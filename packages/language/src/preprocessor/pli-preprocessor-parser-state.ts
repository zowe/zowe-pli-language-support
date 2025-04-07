import { IToken, TokenType } from "chevrotain";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import {
  PliPreprocessorLexerState,
  PreprocessorLexerState,
} from "./pli-preprocessor-lexer-state";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { Values } from "./pli-preprocessor-instructions";
import { URI } from "langium";
import { PreprocessorError } from "./pli-preprocessor-error";

type ParserLocation = "in-statement" | "in-procedure";

export interface PreprocessorParserState {
  index: number;
  uri: URI;
  get tokens(): IToken[];
  get perFileTokens(): Record<string, IToken[]>;
  get current(): IToken | undefined;
  get last(): IToken | undefined;
  get eof(): boolean;

  canConsume(...tokenType: TokenType[]): boolean;
  tryConsume(...tokenTypes: TokenType[]): boolean;
  consume(...tokenTypes: TokenType[]): IToken;

  canConsumeKeyword(...tokenType: TokenType[]): boolean;
  tryConsumeKeyword(...tokenTypes: TokenType[]): boolean;
  consumeKeyword(...tokenTypes: TokenType[]): IToken;

  consumeUntil(predicate: (token: IToken) => boolean): IToken[];
  advanceLines(lineCount: number): void;
  push(location: ParserLocation): void;
  pop(): void;
  isOnlyInStatement(): boolean;
  isInProcedure(): boolean;
}

export class PliPreprocessorParserState implements PreprocessorParserState {
  private readonly lexer: PliPreprocessorLexer;
  private readonly lexerState: PreprocessorLexerState;
  readonly tokens: IToken[];
  readonly perFileTokens: Record<string, IToken[]> = {};
  public index: number;
  public uri: URI;
  private location: ParserLocation[] = [];

  constructor(lexer: PliPreprocessorLexer, text: string, uri: URI) {
    this.lexer = lexer;
    this.lexerState = new PliPreprocessorLexerState(text, uri);
    this.tokens = [];
    this.index = 0;
    this.uri = uri;
  }

  consumeUntil(predicate: (token: IToken) => boolean): IToken[] {
    const result: IToken[] = [];
    while (!this.eof && this.current && !predicate(this.current)) {
      result.push(this.current);
      this.index++;
    }
    if (this.current && predicate(this.current)) {
      result.push(this.current);
      this.index++;
    }
    return result;
  }

  advanceLines(lineCount: number): void {
    this.lexerState.advanceLines(lineCount);
  }
  push(location: ParserLocation): void {
    this.location.push(location);
  }
  top(): ParserLocation | undefined {
    if (this.location.length > 0) {
      return this.location[this.location.length - 1];
    }
    return undefined;
  }
  pop(): void {
    this.location.pop();
  }

  get current() {
    return this.eof ? undefined : this.tokens[this.index];
  }

  get last() {
    return this.eof
      ? this.tokens.length === 0
        ? undefined
        : this.tokens[this.tokens.length - 1]
      : this.tokens[this.index - 1];
  }

  get eof() {
    //end of statement
    if (this.index >= this.tokens.length && !this.lexerState.eof()) {
      this.fetchNextChunkOfTokens();
    }
    return this.index >= this.tokens.length;
  }

  canConsume(...tokenTypes: TokenType[]) {
    if (this.index + tokenTypes.length - 1 >= this.tokens.length) {
      if (!this.lexerState.eof()) {
        this.fetchNextChunkOfTokens();
      }
    }
    if (this.index + tokenTypes.length - 1 >= this.tokens.length) {
      return false;
    }
    return tokenTypes.every((t, index) =>
      Values.sameType(t, this.tokens[this.index + index].tokenType),
    );
  }

  private fetchNextChunkOfTokens() {
    this.lexer.skipHiddenTokens(this.lexerState);
    if (this.isInProcedure()) {
      //only fetch preprocessor tokens until the first semicolon
      const newTokens = this.lexer.tokenizePreprocessorTokensUntilSemicolon(
        this.lexerState,
      );
      this.tokens.push(...newTokens);
    } else if (this.isOnlyInStatement()) {
      //if an percentage occurs, fetch preprocessor tokens. Otherwise only % and PL/I tokens
      //until the first semicolon
      if (this.lexerState.canConsume(PreprocessorTokens.Percentage)) {
        const newTokens = this.lexer.tokenizePreprocessorTokensUntilSemicolon(
          this.lexerState,
        );
        this.tokens.push(...newTokens);
      } else {
        const newTokens = this.lexer.tokenizePliTokensUntilSemicolon(
          this.lexerState,
        );
        this.tokens.push(...newTokens);
      }
    }
  }

  isOnlyInStatement() {
    return (
      this.location.length === 0 ||
      this.location.every((l) => l === "in-statement")
    );
  }

  isInProcedure() {
    return this.location.some((l) => l === "in-procedure");
  }

  tryConsume(...tokenTypes: TokenType[]): boolean {
    if (!this.canConsume(...tokenTypes)) {
      return false;
    }
    this.index += tokenTypes.length;
    return true;
  }

  consume(...tokenTypes: TokenType[]) {
    const token = this.current!;
    if (!this.canConsume(...tokenTypes)) {
      const actualTokenTypes = this.tokens
        .slice(this.index, this.index + tokenTypes.length)
        .map((t) => t.tokenType.name ?? "???")
        .join(", ");
      const message = `Expected token types '${tokenTypes.map((tt) => tt.name).join(", ")}', got '${actualTokenTypes}' instead.`;
      throw new PreprocessorError(message, token, this.uri.toString());
    }
    this.index += tokenTypes.length;
    return token;
  }

  canConsumeKeyword(...tokenTypes: TokenType[]): boolean {
    if (!this.isInProcedure()) {
      tokenTypes = [PreprocessorTokens.Percentage, ...tokenTypes];
    }
    return this.canConsume(...tokenTypes);
  }

  tryConsumeKeyword(...tokenTypes: TokenType[]): boolean {
    if (!this.isInProcedure()) {
      tokenTypes = [PreprocessorTokens.Percentage, ...tokenTypes];
    }
    return this.tryConsume(...tokenTypes);
  }

  consumeKeyword(...tokenTypes: TokenType[]): IToken {
    if (!this.isInProcedure()) {
      tokenTypes = [PreprocessorTokens.Percentage, ...tokenTypes];
    }
    return this.consume(...tokenTypes);
  }
}
