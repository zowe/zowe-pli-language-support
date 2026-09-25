/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */
/*
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import * as antlr from "antlr4ng";
import { Db2SqlExecLexer } from "../generated/Db2SqlExecLexer";
import { Db2SqlExecParser } from "../generated/Db2SqlExecParser";
import {
  CollectingErrorListener,
  CollectingIdentifierVisitor,
  CollectingIncludeVisitor,
} from "./parsing";
import {
  Delimiters,
  Diagnostic,
  ExecFragment,
  findEnclosingProcedureEnd,
  Preprocessor,
  PreprocessorContext,
  ProcedureCheckpoint,
  rebaseDiagnostic,
  rebaseToken,
  scanHostText,
  SemanticsKind,
  Token,
  PreprocessorResult,
} from "preprocessor-api";
import {
  parseSqlTypeClause,
  SQL_LOB_FILE_DECLS,
  SQL_TYPE_ANCHOR,
  sqlLobDecls,
} from "./sql-type";

const COMMENTS = Db2SqlExecLexer.channelNames.indexOf("COMMENTS");

/**
 * Confirmed against `Db2SqlExecLexer.g4`: `'...'`/`"..."` (each escaped by doubling its own
 * quote, never spanning a line) cover every DB2 string form here too - the `X`/`B X`/`U X`/
 * `G X` prefixes on hex/bit/graphic literals are just an ordinary character preceding the
 * quote, not a separate delimiter the scanner needs to know about. The only comment is `--`
 * to end of line; DB2 has no block comment.
 */
const DB2_DELIMITERS: Delimiters = { quotes: ["'", '"'], lineComments: ["--"] };

/** What `SQL TYPE IS ...` clauses become - see `sql-type.ts` for the bodies. */
const LOCATOR_TYPE = "FIXED BIN(31)";
const ROWID_TYPE = "CHAR(40) VARYING";
const LOB_FILE_TYPE = "LIKE SQL_LOB_FILE";
const LOB_TYPE = (length: number) => `LIKE SQL_LOB${length}`;

/**
 * The declaration blocks queued for one procedure (keyed by the offset right after its
 * `;`): each LOB size and the LOB FILE block at most once. `texts` is flushed *reversed*,
 * matching the real preprocessor's output order.
 */
interface DeclBlocks {
  lobFile: boolean;
  lobSizes: Set<number>;
  texts: string[];
}

/**
 * One context's processing state. A nested (`EXEC SQL INCLUDE`d) context usually has no
 * `PROCEDURE` of its own (DCLGEN-style copybooks), so the enclosing procedure is searched
 * at each parent's include site - and its declarations are then queued against *that*
 * frame's context.
 */
interface Frame {
  context: PreprocessorContext;
  procedures: readonly ProcedureCheckpoint[];
  parent?: { frame: Frame; includeOffset: number };
  blocks: Map<number, DeclBlocks>;
}

export class Db2SqlPreprocessor implements Preprocessor {
  static Name = "DB2 SQL Preprocessor";
  get name() {
    return Db2SqlPreprocessor.Name;
  }

  /**
   * Finds everything the DB2 precompiler owns in `context.text` itself, in one walk (see
   * `scanHostText`), and records each replacement directly:
   *
   * - `EXEC SQL INCLUDE` becomes the included file's own text via `context.include`, the
   *   returned context processed recursively right here; any other `EXEC SQL` statement
   *   becomes `DO; END;`, its host-variable references travelling as the recorded tokens;
   * - `SQL TYPE IS ...` declaration attributes become the PL/I attribute the precompiler
   *   substitutes, and the `SQL_LOB*` declarations they rely on are inserted once per
   *   enclosing procedure.
   *
   * Every `replace` carries the construct's full classified token list in host
   * coordinates - the host's only source for semantic highlighting and the include member
   * token.
   */
  public async execute(context: PreprocessorContext): Promise<void> {
    await this.process(context);
  }

  private async process(
    context: PreprocessorContext,
    parent?: Frame["parent"],
  ): Promise<void> {
    const scan = scanHostText(
      context.text,
      "SQL",
      DB2_DELIMITERS,
      SQL_TYPE_ANCHOR,
    );
    const frame: Frame = {
      context,
      procedures: scan.procedures,
      parent,
      blocks: new Map(),
    };
    // Strict text order across both kinds of constructs, so a copybook's declaration
    // blocks queue against the including procedure in encounter order.
    let anchorIndex = 0;
    for (const fragment of scan.fragments) {
      while (
        anchorIndex < scan.anchors.length &&
        scan.anchors[anchorIndex] < fragment.range.start
      ) {
        this.processSqlType(frame, scan.anchors[anchorIndex++]);
      }
      await this.processFragment(frame, fragment);
    }
    while (anchorIndex < scan.anchors.length) {
      this.processSqlType(frame, scan.anchors[anchorIndex++]);
    }
    // Flushed only now: nested contexts processed above may have queued declarations
    // against this frame when the enclosing procedure lives in this file.
    for (const [offset, blocks] of frame.blocks) {
      context.replace(
        { start: offset, end: offset },
        blocks.texts.slice().reverse().join(""),
      );
    }
  }

  private async processFragment(
    frame: Frame,
    fragment: ExecFragment,
  ): Promise<void> {
    const { context } = frame;
    const { diagnostics, tokens, replacement } = this.tryParse(
      fragment.bodyText,
    );
    for (const diagnostic of diagnostics) {
      context.pushDiagnostic(rebaseDiagnostic(diagnostic, fragment));
    }
    const rebased = tokens.map((token) => rebaseToken(token, fragment));
    if (!fragment.terminated) {
      // Broken statement (no `;` before EOF): record the classified tokens without
      // touching the text - see `ExecFragment.terminated`. No include splicing either -
      // the raw statement must stay in place for the host parser to diagnose.
      context.replace(
        { start: fragment.range.start, end: fragment.range.start },
        "",
        rebased,
      );
      return;
    }
    if (replacement?.type === "include") {
      const nested = await context.include(
        replacement.filePath,
        fragment.range,
        rebaseToken(replacement.token, fragment).range,
        rebased,
      );
      if (nested) {
        await this.process(nested, {
          frame,
          includeOffset: fragment.range.start,
        });
      }
      return;
    }
    context.replace(fragment.range, "DO; END;", rebased);
  }

  /**
   * Replaces one `SQL TYPE IS ...` clause with its PL/I attribute. A LOB/LOB FILE clause
   * outside any procedure has nowhere to put its declarations, so it is dropped instead
   * of left dangling as a `LIKE`-reference to a type that is never declared; an
   * unrecognized clause (already diagnosed) is blanked as far as it was consumed, so the
   * host parser never sees text the precompiler would have swallowed.
   */
  private processSqlType(frame: Frame, offset: number): void {
    const { context } = frame;
    const clause = parseSqlTypeClause(context.text, offset);
    for (const diagnostic of clause.diagnostics) {
      context.pushDiagnostic(diagnostic);
    }
    const range = { start: offset, end: clause.end };
    const body = clause.body;
    let replacement = "";
    if (body?.kind === "locator") {
      replacement = LOCATOR_TYPE;
    } else if (body?.kind === "rowid") {
      replacement = ROWID_TYPE;
    } else if (body?.kind === "binary") {
      replacement = `CHAR(${body.length}) ${body.varying ? "VARYING" : "NONVARYING"}`;
    } else if (body?.kind === "lobFile") {
      const blocks = this.enclosingProcedureBlocks(frame, offset);
      if (blocks) {
        if (!blocks.lobFile) {
          blocks.lobFile = true;
          blocks.texts.push(SQL_LOB_FILE_DECLS);
        }
        replacement = LOB_FILE_TYPE;
      }
    } else if (body?.kind === "lob") {
      const blocks = this.enclosingProcedureBlocks(frame, offset);
      if (blocks) {
        if (!blocks.lobSizes.has(body.length)) {
          blocks.lobSizes.add(body.length);
          blocks.texts.push(sqlLobDecls(body.length));
        }
        replacement = LOB_TYPE(body.length);
      }
    }
    context.replace(range, replacement, clause.tokens);
  }

  /**
   * The declaration blocks of the procedure enclosing `offset` in `frame` - walking up to
   * the including file's procedure at the include site when this file has none. A
   * procedure whose header never closes (broken source) yields nothing: continuing at
   * the parent would insert this file's declarations into an *ancestor* file.
   */
  private enclosingProcedureBlocks(
    frame: Frame,
    offset: number,
  ): DeclBlocks | undefined {
    let current = frame;
    let position = offset;
    for (;;) {
      const end = findEnclosingProcedureEnd(
        current.context.text,
        current.procedures,
        position,
        DB2_DELIMITERS,
      );
      if (end === "unterminated") {
        return undefined;
      }
      if (end !== undefined) {
        let blocks = current.blocks.get(end);
        if (!blocks) {
          blocks = { lobFile: false, lobSizes: new Set(), texts: [] };
          current.blocks.set(end, blocks);
        }
        return blocks;
      }
      if (!current.parent) {
        return undefined;
      }
      position = current.parent.includeOffset;
      current = current.parent.frame;
    }
  }

  private tryParse(text: string): PreprocessorResult {
    try {
      return this.parse(text);
    } catch {
      return {
        tokens: [],
        diagnostics: [],
        replacement: null,
      };
    }
  }

  /**
   * Parses one bare fragment body (no `EXEC SQL` prefix, no terminating `;`) into its
   * classified tokens, diagnostics, and include info, offsets local to `textSnippet`. Backs
   * `execute`; public for the unit tests in this package - the host only ever calls
   * `execute(context)`.
   */
  public parse(textSnippet: string): PreprocessorResult {
    const charStream = antlr.CharStream.fromString(textSnippet);
    const lexer = new Db2SqlExecLexer(charStream);
    const tokenStream = new antlr.CommonTokenStream(lexer);
    const parser = new Db2SqlExecParser(tokenStream);
    tokenStream.fill();

    lexer.removeErrorListeners();
    parser.removeErrorListeners();

    const lexerErrors = new CollectingErrorListener();
    const parserErrors = new CollectingErrorListener();

    lexer.addErrorListener(lexerErrors);
    parser.addErrorListener(parserErrors);

    const tree = parser.startSqlRule();
    const replacement = CollectingIncludeVisitor.collect(tree);
    const identifierTokens = CollectingIdentifierVisitor.collect(tree);

    const keywordPattern = /^[a-z_]/i;
    let idIndex = 0;
    const tokens = tokenStream
      .getTokens()
      .filter((token) => token.text !== undefined)
      .map((token) => {
        let semanticsKind: SemanticsKind;
        if (
          idIndex < identifierTokens.length &&
          token.start === identifierTokens[idIndex].range.start
        ) {
          return identifierTokens[idIndex++];
        } else if (
          idIndex > 0 &&
          token.stop < identifierTokens[idIndex - 1].range.end
        ) {
          // Inside the identifier just returned (`:A.B` lexes as several tokens).
          return undefined;
        } else if (
          replacement?.type === "include" &&
          token.start === replacement.token.range.start
        ) {
          semanticsKind = SemanticsKind.Identifier;
        } else if (token.channel === COMMENTS) {
          semanticsKind = SemanticsKind.Comment;
        } else if (
          [
            Db2SqlExecLexer.CHAR_STRING_LITERAL_DOUBLE_QUOTE,
            Db2SqlExecLexer.CHAR_STRING_LITERAL_SINGLE_QUOTE,
          ].includes(token.type)
        ) {
          semanticsKind = SemanticsKind.String;
        } else if (token.type === Db2SqlExecLexer.NUMERICLITERAL) {
          semanticsKind = SemanticsKind.Number;
        } else if (keywordPattern.test(token.text!)) {
          semanticsKind = SemanticsKind.Keyword;
        } else {
          return undefined;
        }
        return <Token>{
          image: token.text!,
          range: { start: token.start, end: token.stop + 1 },
          semanticsKind,
        };
      })
      .filter((token): token is Token => token !== undefined)
      // Add any remaining identifier tokens that were not matched in the token stream
      .concat(identifierTokens.slice(idIndex));

    const diagnostics: Diagnostic[] = [];
    diagnostics.push(...lexerErrors.errors);
    diagnostics.push(...parserErrors.errors);
    return {
      diagnostics,
      tokens,
      replacement,
    };
  }
}
