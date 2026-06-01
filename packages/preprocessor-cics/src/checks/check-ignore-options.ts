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
  Cics_ignore_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { VisitorUtility } from "./utils";
import { ParserRuleContext } from "antlr4ng";

export class IgnoreOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_ignore;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CONDITION, Severity.Warning],
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
    super(errors, IgnoreOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS IGNORE CONDITION rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_ignore_options) {
      this.checkIgnoreCondition(ctx as unknown as Cics_ignore_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkIgnoreCondition(ctx: Cics_ignore_optionsContext) {
    this.checkHasMandatoryOptions(ctx.CONDITION(), ctx, "CONDITION");
    this.checkHasNormalCondition(ctx);
  }

  private checkHasNormalCondition(ctx: Cics_ignore_optionsContext) {
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
