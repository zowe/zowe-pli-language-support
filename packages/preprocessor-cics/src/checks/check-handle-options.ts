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
  Cics_handle_abendContext,
  Cics_handle_aidContext,
  Cics_handle_conditionContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { VisitorUtility } from "./utils";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class HandleOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_handle;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CONDITION, Severity.Warning],
    [CICSLexer.ABEND, Severity.Error],
    [CICSLexer.CANCEL, Severity.Warning],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.LABEL, Severity.Error],
    [CICSLexer.RESET, Severity.Warning],
    [CICSLexer.AID, Severity.Warning],
    [CICSLexer.ANYKEY, Severity.Error],
    [CICSLexer.CLEAR, Severity.Error],
    [CICSLexer.CLRPARTN, Severity.Error],
    [CICSLexer.ENTER, Severity.Error],
    [CICSLexer.LIGHTPEN, Severity.Error],
    [CICSLexer.OPERID, Severity.Error],
    [CICSLexer.PA1, Severity.Error],
    [CICSLexer.PA2, Severity.Error],
    [CICSLexer.PA3, Severity.Error],
    [CICSLexer.PF1, Severity.Error],
    [CICSLexer.PF2, Severity.Error],
    [CICSLexer.PF3, Severity.Error],
    [CICSLexer.PF4, Severity.Error],
    [CICSLexer.PF5, Severity.Error],
    [CICSLexer.PF6, Severity.Error],
    [CICSLexer.PF7, Severity.Error],
    [CICSLexer.PF8, Severity.Error],
    [CICSLexer.PF9, Severity.Error],
    [CICSLexer.PF10, Severity.Error],
    [CICSLexer.PF11, Severity.Error],
    [CICSLexer.PF12, Severity.Error],
    [CICSLexer.PF13, Severity.Error],
    [CICSLexer.PF14, Severity.Error],
    [CICSLexer.PF15, Severity.Error],
    [CICSLexer.PF16, Severity.Error],
    [CICSLexer.PF17, Severity.Error],
    [CICSLexer.PF18, Severity.Error],
    [CICSLexer.PF19, Severity.Error],
    [CICSLexer.PF20, Severity.Error],
    [CICSLexer.PF21, Severity.Error],
    [CICSLexer.PF22, Severity.Error],
    [CICSLexer.PF23, Severity.Error],
    [CICSLexer.PF24, Severity.Error],
    [CICSLexer.TRIGGER, Severity.Error],
    [CICSLexer.NORMAL, Severity.Error],
    [CICSLexer.ERROR, Severity.Error],
    [CICSLexer.RDATT, Severity.Error],
    [CICSLexer.WRBRK, Severity.Error],
    [CICSLexer.EOF, Severity.Error],
    [CICSLexer.EODS, Severity.Error],
    [CICSLexer.EOC, Severity.Error],
    [CICSLexer.INBFMH, Severity.Error],
    [CICSLexer.ENDINPT, Severity.Error],
    [CICSLexer.NONVAL, Severity.Error],
    [CICSLexer.NOSTART, Severity.Error],
    [CICSLexer.TERMIDERR, Severity.Error],
    [CICSLexer.FILENOTFOUND, Severity.Error],
    [CICSLexer.NOTFND, Severity.Error],
    [CICSLexer.DUPREC, Severity.Error],
    [CICSLexer.DUPKEY, Severity.Error],
    [CICSLexer.INVREQ, Severity.Error],
    [CICSLexer.IOERR, Severity.Error],
    [CICSLexer.NOSPACE, Severity.Error],
    [CICSLexer.NOTOPEN, Severity.Error],
    [CICSLexer.ENDFILE, Severity.Error],
    [CICSLexer.ILLOGIC, Severity.Error],
    [CICSLexer.LENGERR, Severity.Error],
    [CICSLexer.QZERO, Severity.Error],
    [CICSLexer.SIGNAL, Severity.Error],
    [CICSLexer.QBUSY, Severity.Error],
    [CICSLexer.ITEMERR, Severity.Error],
    [CICSLexer.PGMIDERR, Severity.Error],
    [CICSLexer.TRANSIDERR, Severity.Error],
    [CICSLexer.ENDDATA, Severity.Error],
    [CICSLexer.INVTSREQ, Severity.Error],
    [CICSLexer.EXPIRED, Severity.Error],
    [CICSLexer.RETPAGE, Severity.Error],
    [CICSLexer.RTEFAIL, Severity.Error],
    [CICSLexer.RTESOME, Severity.Error],
    [CICSLexer.TSIOERR, Severity.Error],
    [CICSLexer.MAPFAIL, Severity.Error],
    [CICSLexer.INVERRTERM, Severity.Error],
    [CICSLexer.INVMPSZ, Severity.Error],
    [CICSLexer.IGREQID, Severity.Error],
    [CICSLexer.OVERFLOW, Severity.Error],
    [CICSLexer.INVLDC, Severity.Error],
    [CICSLexer.NOSTG, Severity.Error],
    [CICSLexer.JIDERR, Severity.Error],
    [CICSLexer.QIDERR, Severity.Error],
    [CICSLexer.NOJBUFSP, Severity.Error],
    [CICSLexer.DSSTAT, Severity.Error],
    [CICSLexer.SELNERR, Severity.Error],
    [CICSLexer.FUNCERR, Severity.Error],
    [CICSLexer.UNEXPIN, Severity.Error],
    [CICSLexer.NOPASSBKRD, Severity.Error],
    [CICSLexer.NOPASSBKWR, Severity.Error],
    [CICSLexer.SEGIDERR, Severity.Error],
    [CICSLexer.SYSIDERR, Severity.Error],
    [CICSLexer.ISCINVREQ, Severity.Error],
    [CICSLexer.ENQBUSY, Severity.Error],
    [CICSLexer.ENVDEFERR, Severity.Error],
    [CICSLexer.IGREQCD, Severity.Error],
    [CICSLexer.SESSIONERR, Severity.Error],
    [CICSLexer.SYSBUSY, Severity.Error],
    [CICSLexer.SESSBUSY, Severity.Error],
    [CICSLexer.NOTALLOC, Severity.Error],
    [CICSLexer.CBIDERR, Severity.Error],
    [CICSLexer.INVEXITREQ, Severity.Error],
    [CICSLexer.INVPARTNSET, Severity.Error],
    [CICSLexer.INVPARTN, Severity.Error],
    [CICSLexer.PARTNFAIL, Severity.Error],
    [CICSLexer.USERIDERR, Severity.Error],
    [CICSLexer.NOTAUTH, Severity.Error],
    [CICSLexer.VOLIDERR, Severity.Error],
    [CICSLexer.SUPPRESSED, Severity.Error],
    [CICSLexer.RESIDERR, Severity.Error],
    [CICSLexer.NOSPOOL, Severity.Error],
    [CICSLexer.TERMERR, Severity.Error],
    [CICSLexer.ROLLEDBACK, Severity.Error],
    [CICSLexer.END, Severity.Error],
    [CICSLexer.DISABLED, Severity.Error],
    [CICSLexer.ALLOCERR, Severity.Error],
    [CICSLexer.STRELERR, Severity.Error],
    [CICSLexer.OPENERR, Severity.Error],
    [CICSLexer.SPOLBUSY, Severity.Error],
    [CICSLexer.SPOLERR, Severity.Error],
    [CICSLexer.NODEIDERR, Severity.Error],
    [CICSLexer.TASKIDERR, Severity.Error],
    [CICSLexer.TCIDERR, Severity.Error],
    [CICSLexer.DSNNOTFOUND, Severity.Error],
    [CICSLexer.LOADING, Severity.Error],
    [CICSLexer.MODELIDERR, Severity.Error],
    [CICSLexer.OUTDESCRERR, Severity.Error],
    [CICSLexer.PARTNERIDERR, Severity.Error],
    [CICSLexer.PROFILEIDERR, Severity.Error],
    [CICSLexer.NETNAMEIDERR, Severity.Error],
    [CICSLexer.LOCKED, Severity.Error],
    [CICSLexer.RECORDBUSY, Severity.Error],
    [CICSLexer.UOWNOTFOUND, Severity.Error],
    [CICSLexer.UOWLNOTFOUND, Severity.Error],
    [CICSLexer.LINKABEND, Severity.Error],
    [CICSLexer.CHANGED, Severity.Error],
    [CICSLexer.PROCESSBUSY, Severity.Error],
    [CICSLexer.ACTIVITYBUSY, Severity.Error],
    [CICSLexer.PROCESSERR, Severity.Error],
    [CICSLexer.ACTIVITYERR, Severity.Error],
    [CICSLexer.CONTAINERERR, Severity.Error],
    [CICSLexer.EVENTERR, Severity.Error],
    [CICSLexer.TOKENERR, Severity.Error],
    [CICSLexer.NOTFINISHED, Severity.Error],
    [CICSLexer.POOLERR, Severity.Error],
    [CICSLexer.TIMERERR, Severity.Error],
    [CICSLexer.SYMBOLERR, Severity.Error],
    [CICSLexer.TEMPLATERR, Severity.Error],
    [CICSLexer.NOTSUPERUSER, Severity.Error],
    [CICSLexer.CSDERR, Severity.Error],
    [CICSLexer.DUPRES, Severity.Error],
    [CICSLexer.RESUNAVAIL, Severity.Error],
    [CICSLexer.CHANNELERR, Severity.Error],
    [CICSLexer.CCSIDERR, Severity.Error],
    [CICSLexer.TIMEDOUT, Severity.Error],
    [CICSLexer.CODEPAGEERR, Severity.Error],
    [CICSLexer.INCOMPLETE, Severity.Error],
    [CICSLexer.APPNOTFOUND, Severity.Error],
    [CICSLexer.BUSY, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, HandleOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Handle rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_handle_abend:
        this.checkHandleAbend(ctx as unknown as Cics_handle_abendContext);
        break;
      case CICSParser.RULE_cics_handle_aid:
        this.checkHandleAid(ctx as unknown as Cics_handle_aidContext);
        break;
      case CICSParser.RULE_cics_handle_condition:
        this.checkHandleCondition(
          ctx as unknown as Cics_handle_conditionContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkHandleAbend(ctx: Cics_handle_abendContext) {
    this.checkHasMandatoryOptions(ctx.ABEND(), ctx, "ABEND");
    this.checkHasMutuallyExclusiveOptions(
      "CANCEL or PROGRAM or LABEL or RESET",
      ctx.CANCEL(),
      ctx.PROGRAM(),
      ctx.LABEL(),
      ctx.RESET(),
    );
  }

  private checkHandleAid(ctx: Cics_handle_aidContext) {
    this.checkHasMandatoryOptions(ctx.AID(), ctx, "AID");
    this.checkHasTooManyOptions(ctx);
  }

  private checkHandleCondition(ctx: Cics_handle_conditionContext) {
    this.checkHasMandatoryOptions(ctx.CONDITION(), ctx, "CONDITION");
    this.checkHasNormalCondition(ctx);
  }

  private checkHasTooManyOptions(parentCtx: ParserRuleContext) {
    if (parentCtx.children == null) return;
    const commandOptionsCount = parentCtx.children
      .filter((node) => node instanceof TerminalNode)
      .map((node) => node as TerminalNode)
      .filter((node) => node.getSymbol().type !== CICSLexer.AID).length;
    if (commandOptionsCount > 16) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(parentCtx),
        "Too many options provided for: ",
        "HANDLE AID",
      );
    }
  }

  private checkHasNormalCondition(ctx: Cics_handle_conditionContext) {
    ctx
      .cics_conditions()
      .map((c) => c.NORMAL())
      .filter((n) => n != null)
      .forEach((terminalNode) =>
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(terminalNode!),
          "Invalid option provided: ",
          "NORMAL",
        ),
      );
  }
}
