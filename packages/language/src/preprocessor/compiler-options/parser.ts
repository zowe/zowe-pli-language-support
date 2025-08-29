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

import {
  ConsumeMethodOpts,
  createToken,
  EmbeddedActionsParser,
  Lexer,
  TokenType,
} from "chevrotain";
import { CompilerOptionIssue } from "./options";
import { Severity, tokenToRange } from "../../language-server/types";
import { CstNodeKind } from "../../syntax-tree/cst";
import {
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  CompilerOptionValue,
  SyntaxKind,
} from "../../syntax-tree/ast";
import { ML_COMMENT, SL_COMMENT, Token } from "../../parser/tokens";

const commaToken = createToken({ name: "comma", pattern: "," });
const semicolonToken = createToken({ name: "semicolon", pattern: ";" });
const stringToken = createToken({
  name: "string",
  pattern: /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')/,
});
const wordToken = createToken({ name: "value", pattern: /[\w\d\-+_]+/ });
const parenOpen = createToken({ name: "parenOpen", pattern: "(" });
const parenClose = createToken({ name: "parenClose", pattern: ")" });
const ws = createToken({ name: "ws", pattern: /\s+/, group: Lexer.SKIPPED });
const HALF_ML_COMMENT = createToken({
  name: "HALF_ML_COMMENT",
  pattern: /\/\*[\s\S]/y,
  group: Lexer.SKIPPED,
});
const tokenTypes = [
  ws,
  commaToken,
  semicolonToken,
  stringToken,
  parenOpen,
  parenClose,
  wordToken,
  ML_COMMENT,
  HALF_ML_COMMENT,
  SL_COMMENT,
];
const lexer = new Lexer(tokenTypes, {
  positionTracking: "full",
});

class CompilerOptionsParser extends EmbeddedActionsParser {
  constructor() {
    super(tokenTypes, { recoveryEnabled: true });
    this.performSelfAnalysis();
  }

  protected override LA(howMuch: number): Token {
    return super.LA(howMuch) as Token;
  }

  protected override CONSUME(
    tokType: TokenType,
    options?: ConsumeMethodOpts,
  ): Token {
    return super.CONSUME(tokType, options) as Token;
  }

  compilerOptions = this.RULE<
    () => Omit<AbstractCompilerOptions, "issues" | "tokens">
  >(
    "compilerOptions",
    () => {
      const options: CompilerOption[] = [];
      this.OPTION1(() => {
        const firstResult = this.SUBRULE1(this.compilerOption, {
          ARGS: [false],
        });
        options.push(firstResult as CompilerOption);
        this.MANY(() => {
          this.OPTION2(() => {
            // TODO: the language reference says that this comma is MANDATORY!
            // However, a lot of code does not use it.
            const comma = this.CONSUME(commaToken);
            this.ACTION(() => {
              comma.kind = CstNodeKind.CompilerOptions_Comma;
              comma.element = options[options.length - 1];
            });
          });

          const subsequentResult = this.SUBRULE2(this.compilerOption, {
            ARGS: [false],
          });
          if (subsequentResult) {
            options.push(subsequentResult as CompilerOption);
          }
        });
      });
      return {
        options,
      };
    },
    {
      recoveryValueFunc: () => ({
        options: [],
      }),
    },
  );

  compilerOption = this.RULE<
    (text: boolean) => CompilerOption | CompilerOptionText | undefined
  >(
    "compilerOption",
    (text) => {
      const nameToken = this.CONSUME(wordToken);
      const values: CompilerOptionValue[] = [];
      let element: CompilerOption | CompilerOptionText = text
        ? {
            container: null,
            kind: SyntaxKind.CompilerOptionText,
            token: nameToken,
            value: nameToken.image,
          }
        : {
            container: null,
            kind: SyntaxKind.CompilerOption,
            name: nameToken.image,
            token: nameToken,
            values,
          };
      this.ACTION(() => {
        const num = Number(nameToken.image);
        nameToken.kind = isNaN(num)
          ? CstNodeKind.CompilerOption_Name
          : CstNodeKind.CompilerOption_Number;
        nameToken.element = element;
      });
      this.OPTION1(() => {
        if (text) {
          element = {
            container: null,
            kind: SyntaxKind.CompilerOption,
            name: nameToken.image,
            token: nameToken,
            values,
          };
          this.ACTION(() => (nameToken.element = element));
        }
        const parenOpenToken = this.CONSUME(parenOpen);
        this.ACTION(() => {
          parenOpenToken.kind = CstNodeKind.CompilerOption_OpenParen;
          parenOpenToken.element = element;
        });
        this.OPTION2(() => {
          let firstValue: CompilerOptionValue = {
            container: element,
            kind: SyntaxKind.CompilerOptionText,
            token: this.LA(1),
            value: "",
          };
          this.OPTION3(() => {
            firstValue = this.SUBRULE1(this.compilerValue);
          });
          this.ACTION(() => {
            firstValue.container = element;
          });
          values.push(firstValue);
          this.MANY(() => {
            this.OPTION4(() => {
              const comma = this.CONSUME(commaToken);
              this.ACTION(() => {
                comma.kind = CstNodeKind.CompilerOption_Comma;
                comma.element = element;
              });
            });
            const subsequentValue = this.SUBRULE2(this.compilerValue);
            this.ACTION(() => {
              subsequentValue.container = element;
            });
            values.push(subsequentValue);
          });
        });
        const parenCloseToken = this.CONSUME(parenClose);
        this.ACTION(() => {
          parenCloseToken.kind = CstNodeKind.CompilerOption_CloseParen;
          parenCloseToken.element = element;
        });
      });
      return element;
    },
    {
      recoveryValueFunc: () => undefined,
    },
  );

  compilerValue = this.RULE<() => CompilerOptionValue>(
    "compilerValue",
    () => {
      return this.OR([
        {
          ALT: () => {
            const string = this.CONSUME(stringToken);
            const result: CompilerOptionString = {
              container: null,
              kind: SyntaxKind.CompilerOptionString,
              token: string,
              value: string.image.slice(1, -1),
            };
            this.ACTION(() => {
              string.kind = CstNodeKind.CompilerOptionsValue_STRING;
              string.element = result;
            });
            return result;
          },
        },
        {
          ALT: () => {
            return this.SUBRULE(this.compilerOption, {
              ARGS: [true],
            });
          },
        },
        {
          ALT: () => {
            const result: CompilerOptionValue = {
              container: null,
              kind: SyntaxKind.CompilerOptionText,
              value: "",
              token: this.LA(1),
            };
            return result;
          },
        },
      ]);
    },
    {
      recoveryValueFunc: () => ({
        container: null,
        kind: SyntaxKind.CompilerOptionText,
        value: "",
        token: this.LA(1),
      }),
    },
  );
}

const parser = new CompilerOptionsParser();

export interface AbstractCompilerOptions {
  options: CompilerOption[];
  tokens: Token[];
  issues: CompilerOptionIssue[];
}

/**
 * Parses a string containing PL/I compiler options to generate an abstract opts object, ready for translation
 * @param input String containing the compiler options to parse.
 * @param offset Offset to apply to the input string, to preserve the original positions of tokens for diagnostics
 */
export function parseAbstractCompilerOptions(
  input: string,
  offset?: number,
): AbstractCompilerOptions {
  // Remove everything after the first ;.
  // *PROCESS MARGINS(2, 72) ; MARGINS(1, 72); is valid, but everything after the first ; is ignored.
  const lexerResult = lexer.tokenize(" ".repeat(offset ?? 0) + input);
  const semicolonTokenPosition = lexerResult.tokens.findIndex(
    (token) => token.tokenTypeIdx === semicolonToken.tokenTypeIdx,
  );
  const tokens = lexerResult.tokens.slice(
    0,
    semicolonTokenPosition === -1 ? undefined : semicolonTokenPosition,
  ) as Token[];
  parser.input = tokens;
  const compilerOptions = parser.compilerOptions();
  const issues: CompilerOptionIssue[] = [];
  for (const lexerError of lexerResult.errors) {
    issues.push({
      message: lexerError.message,
      range: {
        start: lexerError.offset,
        end: lexerError.offset + lexerError.length,
      },
      severity: Severity.E,
    });
  }
  for (const parserError of parser.errors) {
    issues.push({
      message: parserError.message,
      range: tokenToRange(parserError.token as Token),
      severity: 1,
    });
  }
  return {
    options: compilerOptions.options,
    tokens,
    issues,
  };
}
