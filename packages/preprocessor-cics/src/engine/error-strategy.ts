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
  DefaultErrorStrategy,
  FailedPredicateException,
  InputMismatchException,
  IntervalSet,
  NoViableAltException,
  Parser,
  RecognitionException,
  Token,
} from "antlr4ng";
import { CICSLexer } from "../generated/CICSLexer";
import { AllCicsRuleContext } from "../generated/CICSParser";
import { ErrorMessageHelper } from "./error-message-helper";
import { MessageService } from "./message-service";

export class CICSErrorStrategy extends DefaultErrorStrategy {
  private static readonly REPORT_NO_VIABLE_ALTERNATIVE =
    "ErrorStrategy.reportNoViableAlternative";
  private static readonly REPORT_MISSING_TOKEN =
    "ErrorStrategy.reportMissingToken";

  private readonly errorMessageHelper: ErrorMessageHelper;
  private static readonly RESTART_OPTIONS = new IntervalSet([
    CICSLexer.ABEND,
    CICSLexer.ADD,
    CICSLexer.ADDRESS,
    CICSLexer.ALLOCATE,
    CICSLexer.ASKTIME,
    CICSLexer.ASSIGN,
    CICSLexer.BIF,
    CICSLexer.BUILD,
    CICSLexer.CANCEL,
    CICSLexer.CHANGE,
    CICSLexer.CHECK,
    CICSLexer.CONNECT,
    CICSLexer.CONVERSE,
    CICSLexer.CONVERTTIME,
    CICSLexer.DEFINE,
    CICSLexer.DELAY,
    CICSLexer.DELETE,
    CICSLexer.DELETEQ,
    CICSLexer.DEQ,
    CICSLexer.DOCUMENT,
    CICSLexer.DUMP,
    CICSLexer.ENDBR,
    CICSLexer.ENDBROWSE,
    CICSLexer.ENQ,
    CICSLexer.ENTER,
    CICSLexer.EXTRACT,
    CICSLexer.FORCE,
    CICSLexer.FORMATTIME,
    CICSLexer.FREE,
    CICSLexer.FREEMAIN,
    CICSLexer.GDS,
    CICSLexer.GET,
    CICSLexer.GETMAIN,
    CICSLexer.GETNEXT,
    CICSLexer.HANDLE,
    CICSLexer.IGNORE,
    CICSLexer.INQUIRE,
    CICSLexer.INVOKE,
    CICSLexer.ISSUE,
    CICSLexer.LINK,
    CICSLexer.LOAD,
    CICSLexer.MONITOR,
    CICSLexer.MOVE,
    CICSLexer.POINT,
    CICSLexer.POP,
    CICSLexer.POST,
    CICSLexer.PURGE,
    CICSLexer.PUSH,
    CICSLexer.PUT,
    CICSLexer.QUERY,
    CICSLexer.READ,
    CICSLexer.READNEXT,
    CICSLexer.READQ,
    CICSLexer.RECEIVE,
    CICSLexer.RELEASE,
    CICSLexer.REMOVE,
    CICSLexer.RESET,
    CICSLexer.RESETBR,
    CICSLexer.RESUME,
    CICSLexer.RETRIEVE,
    CICSLexer.RETURN,
    CICSLexer.REWIND,
    CICSLexer.REWRITE,
    CICSLexer.ROUTE,
    CICSLexer.RUN,
    CICSLexer.SEND,
    CICSLexer.SET,
    CICSLexer.SIGNAL,
    CICSLexer.SIGNOFF,
    CICSLexer.SIGNON,
    CICSLexer.SOAPFAULT,
    CICSLexer.SPOOLCLOSE,
    CICSLexer.SPOOLOPEN,
    CICSLexer.SPOOLREAD,
    CICSLexer.SPOOLWRITE,
    CICSLexer.START,
    CICSLexer.STARTBR,
    CICSLexer.STARTBROWSE,
    CICSLexer.SUSPEND,
    CICSLexer.SYNCPOINT,
    CICSLexer.TEST,
    CICSLexer.TRANSFORM,
    CICSLexer.UNLOCK,
    CICSLexer.UPDATE,
    CICSLexer.VERIFY,
    CICSLexer.WAIT,
    CICSLexer.WAITCICS,
    CICSLexer.WEB,
    CICSLexer.WRITE,
    CICSLexer.WRITEQ,
    CICSLexer.WSACONTEXT,
    CICSLexer.WSAEPR,
    CICSLexer.XCTL,
    CICSLexer.END_EXEC,
    CICSLexer.DOT,
  ]);
  private static readonly BLOCK_END_TOKENS = new IntervalSet([
    CICSLexer.END_EXEC,
    CICSLexer.DOT,
  ]);
  private static readonly END_EXEC_ONLY = new IntervalSet([CICSLexer.END_EXEC]);

  constructor(private readonly messageService: MessageService) {
    super();
    this.errorMessageHelper = new ErrorMessageHelper(messageService);
  }

  override reportError(recognizer: Parser, e: RecognitionException): void {
    // if we've already reported an error and have not matched a token
    // yet successfully, don't report any errors.
    if (this.inErrorRecoveryMode(recognizer)) {
      return; // don't report spurious errors
    }
    this.beginErrorCondition(recognizer);

    if (e instanceof NoViableAltException) {
      this.reportNoViableAlternative(recognizer, e);
    } else if (e instanceof InputMismatchException) {
      this.reportInputMismatch(recognizer, e);
    } else if (e instanceof FailedPredicateException) {
      this.reportFailedPredicate(recognizer, e);
    } else {
      this.reportUnrecognizedException(recognizer, e);
    }
  }

  private reportUnrecognizedException(
    recognizer: Parser,
    e: RecognitionException,
  ) {
    console.error("unknown recognition error type: " + e.constructor.name);
    recognizer.notifyErrorListeners(e.message, e.offendingToken, e);
  }

  override reportInputMismatch(recognizer: Parser, e: InputMismatchException) {
    const msg = this.errorMessageHelper.getInputMismatchMessage(
      recognizer,
      e,
      e.offendingToken!,
      this.getOffendingToken(e),
    );
    recognizer.notifyErrorListeners(msg, e.offendingToken, e);
  }

  override recover(recognizer: Parser, e: RecognitionException) {
    const ctx = recognizer.context;
    if (ctx instanceof AllCicsRuleContext) {
      const input = recognizer.inputStream;
      const m = input.mark();
      const index = input.index;
      if (index == ctx.start?.tokenIndex) input.consume();
      this.consumeUntil(recognizer, CICSErrorStrategy.RESTART_OPTIONS);
      const next = input.LA(1);
      if (next == CICSLexer.DOT || next == CICSLexer.EOF) {
        input.seek(index);
      }
      input.release(m);
      return;
    }
    super.recover(recognizer, e);
  }

  override reportNoViableAlternative(
    recognizer: Parser,
    e: NoViableAltException,
  ) {
    const messageParams =
      this.errorMessageHelper.retrieveInputForNoViableException(recognizer, e);
    const msg = this.messageService.getMessage(
      CICSErrorStrategy.REPORT_NO_VIABLE_ALTERNATIVE,
      messageParams,
    );
    recognizer.notifyErrorListeners(msg, e.offendingToken, e);
  }

  override reportUnwantedToken(recognizer: Parser) {
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }
    this.beginErrorCondition(recognizer);
    const currentToken = recognizer.getCurrentToken();
    const msg = this.errorMessageHelper.getUnwantedTokenMessage(
      recognizer,
      currentToken,
    );
    recognizer.notifyErrorListeners(msg, currentToken, null);
  }

  override reportMissingToken(recognizer: Parser) {
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }
    this.beginErrorCondition(recognizer);
    const msg = this.messageService.getMessage(
      CICSErrorStrategy.REPORT_MISSING_TOKEN,
      this.errorMessageHelper.getExpectedText(recognizer),
      ErrorMessageHelper.getRule(recognizer),
    );
    recognizer.notifyErrorListeners(msg, recognizer.getCurrentToken(), null);
  }

  private getOffendingToken(e: InputMismatchException) {
    return this.getTokenErrorDisplay(e.offendingToken);
  }
}
