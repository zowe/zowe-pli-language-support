import { InputMismatchException, IntervalSet, NoViableAltException, Parser, Token } from "antlr4ng";
import { MessageService } from "./message-service";
import { CICSLexer } from "../generated/CICSLexer";

export class ErrorMessageHelper {
  private readonly messageService: MessageService;
  private static readonly END_OF_FILE_MESSAGE = "ErrorStrategy.endOfFile";
  private static readonly REPORT_INPUT_MISMATCH = "ErrorStrategy.reportInputMismatch";
  private static readonly REPORT_UNWANTED_TOKEN = "ErrorStrategy.reportUnwantedToken";
  private static readonly MSG_DELIMITER = ", ";
  private static readonly MSG_PREFIX = "{";
  private static readonly MSG_SUFFIX = "}";

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  /**
   * Returns an input mismatch error message for a {@link InputMismatchException}
   *
   * @param recognizer parser reference
   * @param e {@link InputMismatchException}
   * @param token token
   * @param offendingTokens offending token string
   * @return error message string
   */
  public getInputMismatchMessage(
      recognizer: Parser, e: InputMismatchException, token: Token, offendingTokens: string): string {
    return token.type == CICSLexer.EOF
        ? this.messageService.getMessage(ErrorMessageHelper.END_OF_FILE_MESSAGE)
        : this.messageService.getMessage(
            ErrorMessageHelper.REPORT_INPUT_MISMATCH, offendingTokens, this.getExpectedTextByException(recognizer, e));
  }

  /**
   * Returns a message in case unwanted token found while parsing.
   *
   * @param recognizer Parser reference
   * @param currentToken current token
   * @return error message string
   */
  public getUnwantedTokenMessage(recognizer: Parser, currentToken: Token): string {
    return currentToken.type == CICSLexer.EOF
        ? this.messageService.getMessage(ErrorMessageHelper.END_OF_FILE_MESSAGE)
        : this.createMessage(recognizer, currentToken);
  }

  /**
   * Returns an expected text, in case {@link InputMismatchException} is encountered while parsing.
   *
   * @param recognizer Parser ref
   * @return an expected text
   */
  public getExpectedText(recognizer: Parser): string {
    return this.getExpectedTextByInterval(recognizer, recognizer.getExpectedTokens()!);
  }

  /**
   * Returns the last invocation rule while parsing.
   *
   * @param recognizer parser ref
   * @return last invocation rule
   */
  public static getRule(recognizer: Parser): string {
    return recognizer.getRuleInvocationStack()[0];
  }

  /**
   * Returns input string which resulted in {@link NoViableAltException}
   *
   * @param recognizer parser ref
   * @param e {@link NoViableAltException}
   * @return input string
   */
  public retrieveInputForNoViableException(recognizer: Parser, e: NoViableAltException): string {
    return recognizer.inputStream
        ? recognizer.inputStream.getTextFromRange(e.startToken, e.offendingToken)
        : "<unknown input>";
  }

  private getExpectedTextByException(recognizer: Parser, e: InputMismatchException): string {
    return this.getExpectedTextByInterval(recognizer, e.getExpectedTokens()!);
  }

  private getExpectedTextByInterval(recognizer: Parser, interval: IntervalSet): string {
    const newMessage = this.buildErrorMessage(this.removeIdentifierTokens(this.collectErrorTokens(recognizer, interval)));
    return interval.length > 1 ? `{${newMessage}}` : newMessage;
  }

  private createMessage(recognizer: Parser, t: Token): string {
    const tokenName = t.text;
    return this.messageService.getMessage(ErrorMessageHelper.REPORT_UNWANTED_TOKEN, tokenName, this.getExpectedText(recognizer));
  }

  private buildErrorMessage(tokens: string[]): string {
    return tokens
        .filter(it => it.length > 0)
        .map(it => it.replace("_", "-"))
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(ErrorMessageHelper.MSG_DELIMITER);
  }

  private removeIdentifierTokens(tokens: string[]): string[] {
    const identifierTokens = new Set<string>();
    if (identifierTokens.size > 0) {
      tokens = tokens.filter(token => !identifierTokens.has(token));
    }
    return tokens;
  }

  private collectErrorTokens(recognizer: Parser, interval: IntervalSet): string[] {
    return interval
        .toStringWithVocabulary(recognizer.vocabulary)
        .replace(ErrorMessageHelper.MSG_PREFIX, "")
        .replace(ErrorMessageHelper.MSG_SUFFIX, "")
        .split(ErrorMessageHelper.MSG_DELIMITER);
  }
}
