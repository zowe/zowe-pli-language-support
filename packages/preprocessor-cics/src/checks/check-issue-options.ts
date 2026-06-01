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
import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_issue_abendContext,
  Cics_issue_abortContext,
  Cics_issue_addContext,
  Cics_issue_commonContext,
  Cics_issue_confirmationContext,
  Cics_issue_copyContext,
  Cics_issue_disconnectContext,
  Cics_issue_endContext,
  Cics_issue_eodsContext,
  Cics_issue_eraseContext,
  Cics_issue_errorContext,
  Cics_issue_loadContext,
  Cics_issue_noteContext,
  Cics_issue_passContext,
  Cics_issue_prepareContext,
  Cics_issue_printContext,
  Cics_issue_queryContext,
  Cics_issue_receiveContext,
  Cics_issue_replaceContext,
  Cics_issue_sendContext,
  Cics_issue_signalContext,
  Cics_issue_waitContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

/** Checks CICS Issue rules for required and invalid options */
export class IssueOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_issue;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ABEND, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.ABORT, Severity.Error],
    [CICSLexer.DESTID, Severity.Error],
    [CICSLexer.DESTIDLENG, Severity.Error],
    [CICSLexer.SUBADDR, Severity.Error],
    [CICSLexer.VOLUME, Severity.Error],
    [CICSLexer.VOLUMELENG, Severity.Error],
    [CICSLexer.CONSOLE, Severity.Error],
    [CICSLexer.PRINT, Severity.Error],
    [CICSLexer.CARD, Severity.Error],
    [CICSLexer.WPMEDIA1, Severity.Error],
    [CICSLexer.WPMEDIA2, Severity.Error],
    [CICSLexer.WPMEDIA3, Severity.Error],
    [CICSLexer.WPMEDIA4, Severity.Error],
    [CICSLexer.ADD, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.NUMREC, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.CONFIRMATION, Severity.Error],
    [CICSLexer.COPY, Severity.Error],
    [CICSLexer.TERMID, Severity.Error],
    [CICSLexer.CTLCHAR, Severity.Error],
    [CICSLexer.DISCONNECT, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.END, Severity.Error],
    [CICSLexer.ENDFILE, Severity.Error],
    [CICSLexer.ENDOUTPUT, Severity.Error],
    [CICSLexer.ERASE, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.KEYNUMBER, Severity.Error],
    [CICSLexer.ERASEAUP, Severity.Error],
    [CICSLexer.ERROR, Severity.Error],
    [CICSLexer.LOAD, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.CONVERSE, Severity.Error],
    [CICSLexer.NOTE, Severity.Error],
    [CICSLexer.PASS, Severity.Error],
    [CICSLexer.LUNAME, Severity.Error],
    [CICSLexer.LOGMODE, Severity.Error],
    [CICSLexer.LOGONLOGMODE, Severity.Error],
    [CICSLexer.NOQUIESCE, Severity.Error],
    [CICSLexer.PREPARE, Severity.Error],
    [CICSLexer.QUERY, Severity.Error],
    [CICSLexer.RECEIVE, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.REPLACE, Severity.Error],
    [CICSLexer.SEND, Severity.Error],
    [CICSLexer.SIGNAL, Severity.Error],
    [CICSLexer.WAIT, Severity.Error],
    [CICSLexer.EODS, Severity.Error],
    [CICSLexer.DEFRESP, Severity.Warning],
    [CICSLexer.NOWAIT, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.NOQUEUE, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, IssueOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Issue rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_issue_abend:
        this.checkAbend(ctx as unknown as Cics_issue_abendContext);
        break;
      case CICSParser.RULE_cics_issue_abort:
        this.checkAbort(ctx as unknown as Cics_issue_abortContext);
        break;
      case CICSParser.RULE_cics_issue_add:
        this.checkAdd(ctx as unknown as Cics_issue_addContext);
        break;
      case CICSParser.RULE_cics_issue_confirmation:
        this.checkConfirmation(
          ctx as unknown as Cics_issue_confirmationContext,
        );
        break;
      case CICSParser.RULE_cics_issue_copy:
        this.checkCopy(ctx as unknown as Cics_issue_copyContext);
        break;
      case CICSParser.RULE_cics_issue_disconnect:
        this.checkDisconnect(ctx as unknown as Cics_issue_disconnectContext);
        break;
      case CICSParser.RULE_cics_issue_end:
        this.checkEnd(ctx as unknown as Cics_issue_endContext);
        break;
      case CICSParser.RULE_cics_issue_eods:
        this.checkEODS(ctx as unknown as Cics_issue_eodsContext);
        break;
      case CICSParser.RULE_cics_issue_erase:
        this.checkErase(ctx as unknown as Cics_issue_eraseContext);
        break;
      case CICSParser.RULE_cics_issue_error:
        this.checkError(ctx as unknown as Cics_issue_errorContext);
        break;
      case CICSParser.RULE_cics_issue_load:
        this.checkLoad(ctx as unknown as Cics_issue_loadContext);
        break;
      case CICSParser.RULE_cics_issue_note:
        this.checkNote(ctx as unknown as Cics_issue_noteContext);
        break;
      case CICSParser.RULE_cics_issue_pass:
        this.checkPass(ctx as unknown as Cics_issue_passContext);
        break;
      case CICSParser.RULE_cics_issue_prepare:
        this.checkPrepare(ctx as unknown as Cics_issue_prepareContext);
        break;
      case CICSParser.RULE_cics_issue_print:
        this.checkPrint(ctx as unknown as Cics_issue_printContext);
        break;
      case CICSParser.RULE_cics_issue_query:
        this.checkQuery(ctx as unknown as Cics_issue_queryContext);
        break;
      case CICSParser.RULE_cics_issue_receive:
        this.checkReceive(ctx as unknown as Cics_issue_receiveContext);
        break;
      case CICSParser.RULE_cics_issue_replace:
        this.checkReplace(ctx as unknown as Cics_issue_replaceContext);
        break;
      case CICSParser.RULE_cics_issue_send:
        this.checkSend(ctx as unknown as Cics_issue_sendContext);
        break;
      case CICSParser.RULE_cics_issue_signal:
        this.checkSignal(ctx as unknown as Cics_issue_signalContext);
        break;
      case CICSParser.RULE_cics_issue_wait:
        this.checkWait(ctx as unknown as Cics_issue_waitContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkAbend(ctx: Cics_issue_abendContext) {
    this.checkHasMandatoryOptions(ctx.ABEND(), ctx, "ABEND");
  }

  private checkAbort(ctx: Cics_issue_abortContext) {
    this.checkHasMandatoryOptions(ctx.ABORT(), ctx, "ABORT");
    this.checkIssueCommon(ctx.cics_issue_common());
  }

  private checkAdd(ctx: Cics_issue_addContext) {
    this.checkHasMandatoryOptions(ctx.ADD(), ctx, "ADD");
    this.checkHasMandatoryOptions(ctx.DESTID(), ctx, "DESTID");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");

    if (ctx.RIDFLD().length === 0)
      this.checkHasIllegalOptions(ctx.RRN(), "RRN without RIDFLD");
    this.checkOptionalWithLength(
      ctx.VOLUME(),
      ctx.VOLUMELENG(),
      ctx,
      "VOLUME",
      "VOLUMELENG",
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.DESTIDLENG(), ctx, "DESTIDLENG");
    }
  }

  private checkConfirmation(ctx: Cics_issue_confirmationContext) {
    this.checkHasMandatoryOptions(ctx.CONFIRMATION(), ctx, "CONFIRMATION");
  }

  private checkCopy(ctx: Cics_issue_copyContext) {
    this.checkHasMandatoryOptions(ctx.COPY(), ctx, "COPY");
    this.checkHasMandatoryOptions(ctx.TERMID(), ctx, "TERMID");
  }

  private checkDisconnect(ctx: Cics_issue_disconnectContext) {
    this.checkHasMandatoryOptions(ctx.DISCONNECT(), ctx, "DISCONNECT");
  }

  private checkEnd(ctx: Cics_issue_endContext) {
    this.checkHasMandatoryOptions(ctx.END(), ctx, "END");
    this.checkIssueCommon(ctx.cics_issue_common());
  }

  private checkEODS(ctx: Cics_issue_eodsContext) {
    this.checkHasMandatoryOptions(ctx.EODS(), ctx, "EODS");
  }

  private checkErase(ctx: Cics_issue_eraseContext) {
    this.checkHasMandatoryOptions(ctx.ERASE(), ctx, "ERASE");
    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    this.checkHasMandatoryOptions(ctx.DESTID(), ctx, "DESTID");

    this.checkHasExactlyOneOption(
      "RRN or KEYLENGTH",
      ctx,
      ctx.RRN(),
      ctx.KEYLENGTH(),
    );
    this.checkOptionalWithLength(
      ctx.VOLUME(),
      ctx.VOLUMELENG(),
      ctx,
      "VOLUME",
      "VOLUMELENG",
    );
    if (ctx.KEYLENGTH().length === 0) {
      this.checkHasIllegalOptions(
        ctx.KEYNUMBER(),
        "KEYNUMBER without KEYLENGTH",
      );
    }
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.DESTIDLENG(), ctx, "DESTIDLENG");
    }
  }

  private checkError(ctx: Cics_issue_errorContext) {
    this.checkHasMandatoryOptions(ctx.ERROR(), ctx, "ERROR");
  }

  private checkLoad(ctx: Cics_issue_loadContext) {
    this.checkHasMandatoryOptions(ctx.LOAD(), ctx, "LOAD");
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
  }

  private checkNote(ctx: Cics_issue_noteContext) {
    this.checkHasMandatoryOptions(ctx.NOTE(), ctx, "NOTE");
    this.checkHasMandatoryOptions(ctx.DESTID(), ctx, "DESTID");
    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    this.checkHasMandatoryOptions(ctx.RRN(), ctx, "RRN");
    this.checkOptionalWithLength(
      ctx.VOLUME(),
      ctx.VOLUMELENG(),
      ctx,
      "VOLUME",
      "VOLUMELENG",
    );
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.DESTIDLENG(), ctx, "DESTIDLENG");
  }

  private checkPass(ctx: Cics_issue_passContext) {
    this.checkHasMandatoryOptions(ctx.PASS(), ctx, "PASS");
    this.checkHasMandatoryOptions(ctx.LUNAME(), ctx, "LUNAME");

    if (ctx.FROM().length === 0)
      this.checkHasIllegalOptions(ctx.LENGTH(), "LENGTH without FROM");
    if (ctx.LOGMODE().length !== 0)
      this.checkHasIllegalOptions(
        ctx.LOGONLOGMODE(),
        "LOGONLOGMODE without LOGMODE",
      );
    if (ctx.FROM().length !== 0)
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
  }

  private checkPrepare(ctx: Cics_issue_prepareContext) {
    this.checkHasMandatoryOptions(ctx.PREPARE(), ctx, "PREPARE");
  }

  private checkPrint(ctx: Cics_issue_printContext) {
    this.checkHasMandatoryOptions(ctx.PRINT(), ctx, "PRINT");
  }

  private checkQuery(ctx: Cics_issue_queryContext) {
    this.checkHasMandatoryOptions(ctx.QUERY(), ctx, "QUERY");
    this.checkHasMandatoryOptions(ctx.DESTID(), ctx, "DESTID");

    this.checkOptionalWithLength(
      ctx.DESTID(),
      ctx.DESTIDLENG(),
      ctx,
      "DESTID",
      "DESTIDLENG",
    );
    this.checkOptionalWithLength(
      ctx.VOLUME(),
      ctx.VOLUMELENG(),
      ctx,
      "VOLUME",
      "VOLUMELENG",
    );
  }

  private checkReceive(ctx: Cics_issue_receiveContext) {
    this.checkHasMandatoryOptions(ctx.RECEIVE(), ctx, "RECEIVE");
    if (ctx.INTO().length === 0)
      this.checkHasMandatoryOptions(ctx.SET(), ctx, "INTO or SET");
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }

  private checkReplace(ctx: Cics_issue_replaceContext) {
    this.checkHasMandatoryOptions(ctx.REPLACE(), ctx, "REPLACE");
    this.checkHasMandatoryOptions(ctx.DESTID(), ctx, "DESTID");
    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");

    if (ctx.KEYLENGTH().length === 0) {
      this.checkHasIllegalOptions(
        ctx.KEYNUMBER(),
        "KEYNUMBER without KEYLENGTTH",
      );
      this.checkHasMandatoryOptions(ctx.RRN(), ctx, "RRN");
    } else this.checkHasIllegalOptions(ctx.RRN(), "RRN with KEYLENGTH");

    this.checkOptionalWithLength(
      ctx.VOLUME(),
      ctx.VOLUMELENG(),
      ctx,
      "VOLUME",
      "VOLUMELENG",
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.DESTIDLENG(), ctx, "DESTIDLENG");
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }

  private checkSend(ctx: Cics_issue_sendContext) {
    this.checkHasMandatoryOptions(ctx.SEND(), ctx, "SEND");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    if (ctx.cics_issue_common().length === 0)
      this.checkHasMandatoryOptions(
        ctx.cics_issue_common(),
        ctx,
        "DESTID or SUBADDR branches",
      );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
    this.checkIssueCommon(ctx.cics_issue_common());
  }

  private checkSignal(ctx: Cics_issue_signalContext) {
    this.checkHasMandatoryOptions(ctx.SIGNAL(), ctx, "SIGNAL");

    if (ctx.CONVID().length !== 0)
      this.checkHasIllegalOptions(ctx.SESSION(), "SESSION with CONVID");
  }

  private checkWait(ctx: Cics_issue_waitContext) {
    this.checkHasMandatoryOptions(ctx.WAIT(), ctx, "WAIT");
    this.checkIssueCommon(ctx.cics_issue_common());
  }

  private checkIssueCommon(ctx: Cics_issue_commonContext[]) {
    const destIds: TerminalNode[] = ctx.flatMap((context) => context.DESTID());
    const subAddrs: TerminalNode[] = ctx.flatMap((context) =>
      context.SUBADDR(),
    );

    this.checkHasMutuallyExclusiveOptions("SUBADDR or DESTID", destIds, subAddrs);

    const hasVolume =
      ctx.reduce((sum, context) => sum + context.VOLUME().length, 0) !== 0;

    ctx.forEach((context) => {
      if (destIds.length === 0 && subAddrs.length === 0) {
        this.checkHasIllegalOptions(
          context.DESTIDLENG(),
          "DESTIDLENG without DESTID",
        );
        this.checkHasIllegalOptions(context.CONSOLE(), "CONSOLE without SUBADDR");
        this.checkHasIllegalOptions(context.PRINT(), "PRINT without SUBADDR");
        this.checkHasIllegalOptions(context.CARD(), "CARD without SUBADDR");
        this.checkHasIllegalOptions(
          context.WPMEDIA1(),
          "WPMEDIA1 without SUBADDR",
        );
        this.checkHasIllegalOptions(
          context.WPMEDIA2(),
          "WPMEDIA2 without SUBADDR",
        );
        this.checkHasIllegalOptions(
          context.WPMEDIA3(),
          "WPMEDIA3 without SUBADDR",
        );
        this.checkHasIllegalOptions(
          context.WPMEDIA4(),
          "WPMEDIA4 without SUBADDR",
        );
      } else if (destIds.length !== 0) {
        this.checkHasIllegalOptions(context.CONSOLE(), "CONSOLE with DESTID");
        this.checkHasIllegalOptions(context.PRINT(), "PRINT with DESTID");
        this.checkHasIllegalOptions(context.CARD(), "CARD with DESTID");
        this.checkHasIllegalOptions(context.WPMEDIA1(), "WPMEDIA1 with DESTID");
        this.checkHasIllegalOptions(context.WPMEDIA2(), "WPMEDIA2 with DESTID");
        this.checkHasIllegalOptions(context.WPMEDIA3(), "WPMEDIA3 with DESTID");
        this.checkHasIllegalOptions(context.WPMEDIA4(), "WPMEDIA4 with DESTID");
      } else {
        this.checkHasIllegalOptions(
          context.DESTIDLENG(),
          "DESTIDLENG with SUBADDR",
        );
        this.checkHasMutuallyExclusiveOptions(
          "CONSOLE or PRINT or CARD or WPMEDIA1 or WPMEDIA2 or WPMEDIA3 or WPMEDIA4",
          context.CONSOLE(),
          context.PRINT(),
          context.CARD(),
          context.WPMEDIA1(),
          context.WPMEDIA2(),
          context.WPMEDIA3(),
          context.WPMEDIA4(),
        );
      }

      if (!hasVolume)
        this.checkHasIllegalOptions(
          context.VOLUMELENG(),
          "VOLUMELENG without VOLUME",
        );
      if (this.noLengthOptionsEnabled()) {
        if (context.DESTID().length !== 0)
          this.checkHasMandatoryOptions(
            context.DESTIDLENG(),
            context,
            "DESTIDLENG",
          );
        if (context.VOLUME().length !== 0)
          this.checkHasMandatoryOptions(
            context.VOLUMELENG(),
            context,
            "VOLUMELENG",
          );
      }
    });
  }
}
