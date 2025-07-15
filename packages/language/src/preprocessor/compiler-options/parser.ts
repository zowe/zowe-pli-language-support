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
import { Token } from "../../parser/tokens";

const commaToken = createToken({ name: "comma", pattern: "," });
const stringToken = createToken({
  name: "string",
  pattern: /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')/,
});
const wordToken = createToken({ name: "value", pattern: /[\w\d\-+_]+/ });
const parenOpen = createToken({ name: "parenOpen", pattern: "(" });
const parenClose = createToken({ name: "parenClose", pattern: ")" });
const ws = createToken({ name: "ws", pattern: /\s+/, group: Lexer.SKIPPED });
const tokenTypes = [
  ws,
  commaToken,
  stringToken,
  parenOpen,
  parenClose,
  wordToken,
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
              comma.payload = {
                uri: undefined,
                kind: CstNodeKind.CompilerOptions_Comma,
                element: options[options.length - 1],
              };
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
        nameToken.payload = {
          uri: undefined,
          kind: isNaN(num)
            ? CstNodeKind.CompilerOption_Name
            : CstNodeKind.CompilerOption_Number,
          element,
        };
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
          this.ACTION(() => (nameToken.payload.element = element));
        }
        const parenOpenToken = this.CONSUME(parenOpen);
        this.ACTION(() => {
          parenOpenToken.payload = {
            uri: undefined,
            kind: CstNodeKind.CompilerOption_OpenParen,
            element,
          };
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
                comma.payload = {
                  uri: undefined,
                  kind: CstNodeKind.CompilerOption_Comma,
                  element,
                };
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
          parenCloseToken.payload = {
            uri: undefined,
            kind: CstNodeKind.CompilerOption_CloseParen,
            element,
          };
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
              string.payload = {
                uri: undefined,
                kind: CstNodeKind.CompilerOptionsValue_STRING,
                element: result,
              };
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
  const lexerResult = lexer.tokenize(
    " ".repeat(offset ?? 0) + input.replace(/;$/, ""),
  );
  const tokens = lexerResult.tokens as Token[];
  for (let i = 0; i < tokens.length; i++) {
    tokens[i].payload = {
      uri: undefined,
      kind: undefined,
      element: undefined,
    };
  }
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
