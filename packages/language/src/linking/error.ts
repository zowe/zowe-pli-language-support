import {
  DiagnosticInfo,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import { Token } from "../parser/tokens";
import { PLICodes } from "../validation/messages";
import { PliValidationAcceptor } from "../validation/validator";

function getLocation(token: Token) {
  const uri = tokenToUri(token);
  const range = tokenToRange(token);

  if (!uri) {
    return null;
  }

  return { uri, range };
}

function withLocation(token: Token, then: (location: DiagnosticInfo) => void) {
  const location = getLocation(token);
  if (!location) {
    return;
  }

  then(location);
}

export class LinkerErrorReporter {
  constructor(protected accept: PliValidationAcceptor) {}

  /**
   * E IBM1363I
   */
  reportLevelError(levelToken: Token) {
    withLocation(levelToken, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1363I.message, {
        code: PLICodes.Error.IBM1363I.fullCode,
        range,
        uri,
      }),
    );
  }

  /**
   * E IBM1308I
   */
  reportRedeclaration(token: Token) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1308I.message(token.image), {
        code: PLICodes.Error.IBM1308I.fullCode,
        range,
        uri,
      }),
    );
  }

  /**
   * S IBM1916I
   */
  reportAlreadyDeclared(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.S, PLICodes.Severe.IBM1916I.message(name), {
        uri,
        range,
        code: PLICodes.Severe.IBM1916I.fullCode,
      }),
    );
  }

  /**
   * E IBM1306I
   */
  reportRepeatedDeclaration(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1306I.message(name), {
        uri,
        range,
        code: PLICodes.Error.IBM1306I.fullCode,
      }),
    );
  }

  /**
   * Synthetic error for when we cannot find a symbol.
   */
  reportCannotFindSymbol(token: Token, name: string) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.W, `Cannot find symbol '${name}'`, {
        uri,
        range,
      }),
    );
  }

  /**
   * W IBM1213I
   */
  reportUnreferencedSymbol(token: Token) {
    withLocation(token, ({ range, uri }) =>
      this.accept(Severity.W, PLICodes.Warning.IBM1213I.message(token.image), {
        uri,
        range,
        code: PLICodes.Warning.IBM1213I.fullCode,
      }),
    );
  }
}
