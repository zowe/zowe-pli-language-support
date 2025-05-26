import { IToken } from "chevrotain";
import {
  DiagnosticInfo,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import { PLICodes } from "../validation/messages";
import { PliValidationAcceptor } from "../validation/validator";

export class LinkerError {
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

  reportRedeclaration(token: IToken) {
    this.withLocation(token, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1308I.message(token.image), {
        code: PLICodes.Error.IBM1308I.fullCode,
        range,
        uri,
      }),
    );
  }

  reportLevelError(levelToken: IToken) {
    this.withLocation(levelToken, ({ range, uri }) =>
      this.accept(Severity.E, PLICodes.Error.IBM1363I.message, {
        code: PLICodes.Error.IBM1363I.fullCode,
        range,
        uri,
      }),
    );
  }
}
