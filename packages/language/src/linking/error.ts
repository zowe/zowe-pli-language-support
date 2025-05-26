import { IToken } from "chevrotain";
import {
  DiagnosticInfo,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import { PLICodes } from "../validation/messages";
import { PliValidationAcceptor } from "../validation/validator";

export class LinkerErrorReporter {
  constructor(protected accept: PliValidationAcceptor) {}

  private getLocation(token: IToken) {
    const uri = tokenToUri(token);
    const range = tokenToRange(token);

    if (!uri) {
      return null;
    }

    return { uri, range };
  }

  private withLocation(
    token: IToken,
    then: (location: DiagnosticInfo) => void,
  ) {
    const location = this.getLocation(token);
    if (!location) {
      return;
    }

    then(location);
  }

  /**
   * E IBM1363I
   */
  reportLevelError(levelToken: IToken) {
    this.withLocation(levelToken, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1363I.message, {
        code: PLICodes.Error.IBM1363I.fullCode,
        range,
        uri,
        source: "linking",
      }),
    );
  }

  /**
   * E IBM1308I
   */
  reportRedeclaration(token: IToken) {
    this.withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1308I.message(token.image), {
        code: PLICodes.Error.IBM1308I.fullCode,
        range,
        uri,
        source: "linking",
      }),
    );
  }

  /**
   * S IBM1916I
   */
  reportAlreadyDeclared(token: IToken, name: string) {
    this.withLocation(token, ({ range, uri }) =>
      this.accept(Severity.S, PLICodes.Severe.IBM1916I.message(name), {
        uri,
        range,
        code: PLICodes.Severe.IBM1916I.fullCode,
        source: "linking",
      }),
    );
  }

  /**
   * E IBM1306I
   */
  reportRepeatedDeclaration(token: IToken, name: string) {
    this.withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1306I.message(name), {
        uri,
        range,
        code: PLICodes.Error.IBM1306I.fullCode,
        source: "linking",
      }),
    );
  }

  /**
   * Synthetic error for when we cannot find a symbol.
   */
  reportCannotFindSymbol(token: IToken, name: string) {
    this.withLocation(token, ({ range, uri }) =>
      this.accept(Severity.W, `Cannot find symbol '${name}'`, {
        uri,
        range,
        source: "linking",
      }),
    );
  }

  /**
   * W IBM1213I
   */
  reportUnreferencedSymbol(token: IToken) {
    this.withLocation(token, ({ range, uri }) =>
      this.accept(Severity.W, PLICodes.Warning.IBM1213I.message(token.image), {
        uri,
        range,
        code: PLICodes.Warning.IBM1213I.fullCode,
        source: "linking",
      }),
    );
  }
}
