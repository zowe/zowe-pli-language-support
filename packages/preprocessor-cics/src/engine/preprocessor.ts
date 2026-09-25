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
import { CICSLexer } from "../generated/CICSLexer";
import { CICSParser } from "../generated/CICSParser";
import { CollectingSyntaxErrorListener } from "./collect-syntax-errors";
import { CollectingIdentifierVisitor } from "./collect-identifiers";
import {
  Delimiters,
  Diagnostic,
  findEnclosingProcedureEnd,
  Preprocessor,
  PreprocessorContext,
  PreprocessorResult,
  rebaseDiagnostic,
  rebaseToken,
  scanHostText,
  SemanticsKind,
  Severity,
  Token,
} from "preprocessor-api";
import { CollectingSemanticErrorVisitor } from "./collect-semantic-errors";
import { CICSErrorStrategy } from "./error-strategy";
import { EnglishMessageService, MessageService } from "./message-service";
import {
  HostLanguage,
  HostLanguageFactories,
  HostLanguageType,
} from "./host-languages";
import { CVDA_VALUES, RESP_VALUES } from "./cics-values";

const COMMENTS = CICSLexer.channelNames.indexOf("COMMENTS");

/**
 * Confirmed against `CICSLexer.g4`: `'...'`/`"..."` (each escaped by doubling its own quote,
 * never spanning a line) cover every CICS string form here too - the `X`/`Z`/`G`/`N` prefixes
 * on hex/null-terminated/DBCS literals are just an ordinary character preceding the quote.
 * Comments: `*>`/`>>`/`//` run to end of line; `/* *\/` is the one construct that can span
 * multiple lines.
 */
const CICS_DELIMITERS: Delimiters = {
  quotes: ["'", '"'],
  lineComments: ["*>", ">>", "//"],
  blockComments: [{ start: "/*", end: "*/" }],
};

/**
 * The translator's built-in functions: `DFHRESP(condition)` and `DFHVALUE(cvda)` each
 * become their numeric value. Only the complete form is a match - a bare `DFHRESP` or an
 * unclosed `DFHRESP(NORMAL` is ordinary host text. The `scanHostText` walk adds the
 * leading identifier boundary; `y` lets the same expression re-run at a recorded anchor.
 */
const BUILTIN_ANCHOR = /(DFHRESP|DFHVALUE)\s*\(\s*([A-Za-z0-9_#@$]+)\s*\)/iy;

/**
 * The `DFH*` runtime declarations every `EXEC CICS`-using procedure needs - extracted from
 * PL/I code after running it through the real CICS preprocessor, except that `DFHEI0`'s
 * `OPTIONS(...)` is moved directly after `ENTRY VARIABLE` (attribute order is free in PL/I,
 * and the PL/I parser only understands the `OPTIONS` attribute in that position).
 */
export const CICS_EXEC_DECLS = `
      DCL
        1 DFHCNSTS STATIC,
          2 DFHLDVER CHAR(22) INIT('LD TABLE DFHEITAB 730.'),
          2 DFHEIB0 FIXED BIN(15) INIT(0),
          2 DFHEID0 FIXED DEC(7) INIT(0),
          2 DFHEICB CHAR(8) INIT('        ');
      DCL DFHEPI ENTRY, DFHEIPTR PTR;
      DCL
        1 DFHEIBLK BASED (DFHEIPTR),
          2 EIBTIME  FIXED DEC(7),
          2 EIBDATE  FIXED DEC(7),
          2 EIBTRNID CHAR(4),
          2 EIBTASKN FIXED DEC(7),
          2 EIBTRMID CHAR(4),
          2 EIBFIL01 FIXED BIN(15),
          2 EIBCPOSN FIXED BIN(15),
          2 EIBCALEN FIXED BIN(15),
          2 EIBAID   CHAR(1),
          2 EIBFN    CHAR(2),
          2 EIBRCODE CHAR(6),
          2 EIBDS    CHAR(8),
          2 EIBREQID CHAR(8),
          2 EIBRSRCE CHAR(8),
          2 EIBSYNC  CHAR(1),
          2 EIBFREE  CHAR(1),
          2 EIBRECV  CHAR(1),
          2 EIBFIL02 CHAR(1),
          2 EIBATT   CHAR(1),
          2 EIBEOC   CHAR(1),
          2 EIBFMH   CHAR(1),
          2 EIBCOMPL CHAR(1),
          2 EIBSIG   CHAR(1),
          2 EIBCONF  CHAR(1),
          2 EIBERR   CHAR(1),
          2 EIBERRCD CHAR(4),
          2 EIBSYNRB CHAR(1),
          2 EIBNODAT CHAR(1),
          2 EIBRESP  FIXED BIN(31),
          2 EIBRESP2 FIXED BIN(31),
          2 EIBRLDBK CHAR(1);
      DCL
        1 DFHCNTBS  STATIC,
          2  DFHLDTBS CHAR(22) INIT('LD TABLE DFHEITBS 730.');
      DCL DFHDUMMY STATIC FIXED BIN(15) INIT(0);
      DCL DFHEI0 ENTRY VARIABLE OPTIONS(INTER ASSEMBLER) INIT(DFHEI01) AUTO;
      DCL DFHEI01 ENTRY OPTIONS(INTER ASSEMBLER);
`;

export class CICSPreprocessor implements Preprocessor {
  static Name = "CICS Preprocessor";
  private readonly hostLanguage: HostLanguage;
  private readonly messageService: MessageService = new EnglishMessageService();
  constructor(hostLanguage: HostLanguageType) {
    this.hostLanguage = HostLanguageFactories[hostLanguage]();
  }
  get name() {
    return CICSPreprocessor.Name;
  }

  /**
   * Finds everything the CICS translator owns in `context.text` itself, in one walk (see
   * `scanHostText`), and records each replacement directly:
   *
   * - every `EXEC CICS ...;` statement becomes `DO; END;`, its reference tokens (e.g. an
   *   `EXEC CICS LINK(name)` argument) travelling as the recorded tokens, and the `DFH*`
   *   runtime declarations are inserted once per enclosing procedure;
   * - `DFHRESP(...)`/`DFHVALUE(...)` become their numeric value.
   *
   * Every `replace` carries the construct's full classified token list in host
   * coordinates - the host's only source for semantic highlighting. CICS has no include
   * statement, so no nested context ever needs processing.
   */
  public async execute(context: PreprocessorContext): Promise<void> {
    const scan = scanHostText(
      context.text,
      "CICS",
      CICS_DELIMITERS,
      BUILTIN_ANCHOR,
    );
    const declaredProcedures = new Set<number>();
    for (const fragment of scan.fragments) {
      const { diagnostics, tokens } = this.tryParse(fragment.bodyText);
      for (const diagnostic of diagnostics) {
        context.pushDiagnostic(rebaseDiagnostic(diagnostic, fragment));
      }
      const rebased = tokens.map((token) => rebaseToken(token, fragment));
      if (!fragment.terminated) {
        // Broken statement (no `;` before EOF): record the classified tokens without
        // touching the text - see `ExecFragment.terminated`.
        context.replace(
          { start: fragment.range.start, end: fragment.range.start },
          "",
          rebased,
        );
      } else {
        context.replace(fragment.range, "DO; END;", rebased);
      }
      // Every `EXEC CICS`-using procedure needs the `DFH*` runtime declarations once,
      // right after the procedure's own `;`. Outside any procedure there is nowhere to
      // put them. A procedure header that never closes (broken source) gets none either.
      const procedureEnd = findEnclosingProcedureEnd(
        context.text,
        scan.procedures,
        fragment.range.start,
        CICS_DELIMITERS,
      );
      if (typeof procedureEnd === "number") {
        declaredProcedures.add(procedureEnd);
      }
    }
    for (const offset of scan.anchors) {
      this.replaceBuiltin(context, offset);
    }
    for (const offset of declaredProcedures) {
      context.replace({ start: offset, end: offset }, CICS_EXEC_DECLS);
    }
  }

  /**
   * Replaces the `DFHRESP(...)`/`DFHVALUE(...)` at `offset` with its numeric value. An
   * unknown name is diagnosed and the whole clause removed - it must not leak through to
   * the host parser as a function call.
   */
  private replaceBuiltin(context: PreprocessorContext, offset: number): void {
    BUILTIN_ANCHOR.lastIndex = offset;
    const match = BUILTIN_ANCHOR.exec(context.text);
    if (!match) {
      return;
    }
    const keyword = match[1].toUpperCase();
    const name = match[2];
    const nameStart = offset + match[0].lastIndexOf(name);
    const range = { start: offset, end: offset + match[0].length };
    const tokens: Token[] = [
      {
        image: match[1],
        range: { start: offset, end: offset + match[1].length },
        semanticsKind: SemanticsKind.Keyword,
      },
      {
        image: name,
        range: { start: nameStart, end: nameStart + name.length },
        semanticsKind: SemanticsKind.Keyword,
      },
    ];
    const table = keyword === "DFHRESP" ? RESP_VALUES : CVDA_VALUES;
    const value = table[name.toUpperCase()];
    if (value === undefined) {
      context.pushDiagnostic({
        message:
          keyword === "DFHRESP"
            ? `'${name}' is not a CICS response condition.`
            : `'${name}' is not a CICS value (CVDA).`,
        code:
          keyword === "DFHRESP" ? "unknown.response.condition" : "unknown.cvda",
        severity: Severity.Severe,
        range: tokens[1].range,
      });
      context.replace(range, "", tokens);
      return;
    }
    context.replace(range, value.toString(), tokens);
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
   * Parses one bare fragment body (no `EXEC CICS` prefix, no terminating `;`) into its
   * classified tokens and diagnostics, offsets local to `textSnippet`. Backs `execute`;
   * public for the per-command unit tests in this package - the host only ever calls
   * `execute(context)`.
   */
  public parse(textSnippet: string): PreprocessorResult {
    const charStream = antlr.CharStream.fromString(textSnippet);
    const lexer = new CICSLexer(charStream);
    const tokenStream = new antlr.CommonTokenStream(lexer);
    const parser = new CICSParser(tokenStream);
    tokenStream.fill();

    lexer.removeErrorListeners();
    parser.removeErrorListeners();

    const lexerErrors = new CollectingSyntaxErrorListener();
    const parserErrors = new CollectingSyntaxErrorListener();

    lexer.addErrorListener(lexerErrors);
    parser.addErrorListener(parserErrors);
    parser.errorHandler = new CICSErrorStrategy(this.messageService);

    const tree = parser.startRule();
    const identifierTokens = CollectingIdentifierVisitor.collect(tree);
    const keywordPattern = /^[a-z_]/i;
    let idIndex = 0;
    const tokens = tokenStream
      .getTokens()
      .filter((token) => token.text !== undefined)
      .map((token) => {
        let semanticsKind: SemanticsKind;
        this.hostLanguage.visitToken(token, lexerErrors.errors);
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
        } else if (token.channel === COMMENTS) {
          semanticsKind = SemanticsKind.Comment;
        } else if (token.type === CICSLexer.NONNUMERICLITERAL) {
          semanticsKind = SemanticsKind.String;
        } else if (token.type === CICSLexer.NUMERICLITERAL) {
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

    const semanticErrors = CollectingSemanticErrorVisitor.collect(tree);

    const diagnostics: Diagnostic[] = [];
    diagnostics.push(...lexerErrors.errors);
    diagnostics.push(...parserErrors.errors);
    diagnostics.push(
      ...CollectingSemanticErrorVisitor.aggregateErrors(semanticErrors),
    );
    return {
      diagnostics,
      tokens,
      replacement: null,
    };
  }
}
