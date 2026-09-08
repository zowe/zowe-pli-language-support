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
  Preprocessor,
  PreprocessorContext,
  rebaseDiagnostic,
  rebaseToken,
  scanExecFragments,
  SemanticsKind,
  Token,
  PreprocessorResult,
  Severity,
} from "preprocessor-api";

const COMMENTS = Db2SqlExecLexer.channelNames.indexOf("COMMENTS");

/**
 * Confirmed against `Db2SqlExecLexer.g4`: `'...'`/`"..."` (each escaped by doubling its own
 * quote, never spanning a line) cover every DB2 string form here too - the `X`/`B X`/`U X`/
 * `G X` prefixes on hex/bit/graphic literals are just an ordinary character preceding the
 * quote, not a separate delimiter the scanner needs to know about. The only comment is `--`
 * to end of line; DB2 has no block comment.
 */
const DB2_DELIMITERS: Delimiters = { quotes: ["'", '"'], lineComments: ["--"] };

export class Db2SqlPreprocessor implements Preprocessor {
  static Name = "DB2 SQL Preprocessor";
  get name() {
    return Db2SqlPreprocessor.Name;
  }

  /**
   * Finds every `EXEC SQL ...;` statement in `context.text` itself (see `scanExecFragments`)
   * and replaces each directly: an `EXEC SQL INCLUDE` becomes the included file's own
   * (recursively processed) text via `context.include`; any other statement becomes
   * `DO; END;`, its host-variable references travelling as the recorded tokens.
   * Each `replace` carries the fragment's full classified token list in host coordinates -
   * the host's only source for `EXEC` semantic highlighting/hover and the include member
   * token.
   */
  public async execute(context: PreprocessorContext): Promise<void> {
    for (const fragment of scanExecFragments(
      context.text,
      "SQL",
      DB2_DELIMITERS,
    )) {
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
        continue;
      }
      if (replacement?.type === "include") {
        await context.include(
          replacement.filePath,
          fragment.range,
          rebaseToken(replacement.token, fragment).range,
          rebased,
        );
        continue;
      }
      context.replace(fragment.range, "DO; END;", rebased);
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
