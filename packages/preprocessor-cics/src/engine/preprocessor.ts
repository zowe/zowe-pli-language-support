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
  buildExecReplacement,
  Delimiters,
  Diagnostic,
  Preprocessor,
  PreprocessorContext,
  PreprocessorResult,
  rebaseDiagnostic,
  rebaseToken,
  scanExecFragments,
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
   * Finds every `EXEC CICS ...;` statement in `context.text` itself (see `scanExecFragments`)
   * and replaces each with `DO; END;`, re-embedding any reference tokens (e.g. an
   * `EXEC CICS LINK(name)` argument) so they stay resolvable - see `buildExecReplacement`.
   * Each `replace` carries the fragment's full classified token list in host coordinates -
   * the host's only source for `EXEC` semantic highlighting/hover.
   * CICS never produces an `EXEC ... INCLUDE`-style replacement.
   */
  public async execute(context: PreprocessorContext): Promise<void> {
    for (const fragment of scanExecFragments(
      context.text,
      "CICS",
      CICS_DELIMITERS,
    )) {
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
        continue;
      }
      context.replace(fragment.range, buildExecReplacement(tokens), rebased);
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
          token.start === identifierTokens[idIndex].startOffset
        ) {
          return identifierTokens[idIndex++];
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
          startOffset: token.start,
          endOffset: token.stop,
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
