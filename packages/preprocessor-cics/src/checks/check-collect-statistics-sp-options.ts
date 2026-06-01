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
  Cics_collect_statistics_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class CollectStatisticsSpOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_collect_statistics;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.STATISTICS, Severity.Warning],
    [CICSLexer.LASTRESET, Severity.Error],
    [CICSLexer.LASTRESETHRS, Severity.Error],
    [CICSLexer.LASTRESETMIN, Severity.Error],
    [CICSLexer.LASTRESETSEC, Severity.Error],
    [CICSLexer.AUTOINSTALL, Severity.Warning],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.CONNECTION, Severity.Error],
    [CICSLexer.DB2ENTRY, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.JVMPROGRAM, Severity.Error],
    [CICSLexer.JOURNALNAME, Severity.Error],
    [CICSLexer.JOURNALNUM, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.LSRPOOL, Severity.Error],
    [CICSLexer.TARGET, Severity.Error],
    [CICSLexer.STORAGE, Severity.Error],
    [CICSLexer.SUBPOOL, Severity.Error],
    [CICSLexer.NODE, Severity.Error],
    [CICSLexer.TCLASS, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.TRANCLASS, Severity.Error],
    [CICSLexer.DB2CONN, Severity.Warning],
    [CICSLexer.DISPATCHER, Severity.Warning],
    [CICSLexer.ENQUEUE, Severity.Warning],
    [CICSLexer.MONITOR, Severity.Error],
    [CICSLexer.MVSTCB, Severity.Error],
    [CICSLexer.PROGAUTO, Severity.Warning],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.RECOVERY, Severity.Warning],
    [CICSLexer.STATS, Severity.Warning],
    [CICSLexer.STREAMNAME, Severity.Error],
    [CICSLexer.SYSDUMPCODE, Severity.Error],
    [CICSLexer.TABLEMGR, Severity.Warning],
    [CICSLexer.TASKSUBPOOL, Severity.Warning],
    [CICSLexer.TCPIP, Severity.Warning],
    [CICSLexer.TDQUEUE, Severity.Error],
    [CICSLexer.TRANDUMPCODE, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Error],
    [CICSLexer.TSQUEUE, Severity.Warning],
    [CICSLexer.VTAM, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(
      errors,
      CollectStatisticsSpOptionsChecker.DUPLICATE_CHECK_OPTIONS,
      params,
    );
  }

  /**
   * Entrypoint to check CICS COLLECT STATISTICS system command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_collect_statistics_opts)
      this.checkOpts(ctx as unknown as Cics_collect_statistics_optsContext);

    this.checkDuplicates(ctx);
  }

  private checkOpts(ctx: Cics_collect_statistics_optsContext) {
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasMutuallyExclusiveOptions(
      "LASTRESET or LASTRESETHRS",
      ctx.LASTRESET(),
      ctx.LASTRESETHRS(),
    );
    this.checkAllOptionsArePresentOrAbsent(
      "LASTRESETHRS, LASTRESETMIN, LASTRESETSEC",
      ctx,
      ctx.LASTRESETHRS(),
      ctx.LASTRESETMIN(),
      ctx.LASTRESETSEC(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "AUTOINSTALL or  CONNECTION or  DB2CONN or " +
        "DB2ENTRY or  DISPATCHER or  ENQUEUE or  FILE or  JOURNALNAME or  JOURNALNUM or " +
        "JVMPROGRAM or  LSRPOOL or  MONITOR or  MVSTCB or POOL or " +
        "PROGAUTO or  PROGRAM or  RECOVERY or  STATS or  STORAGE or  STREAMNAME or " +
        "SUBPOOL or  SYSDUMPCODE or  TABLEMGR or NODE or TASKSUBPOOL or " +
        "TCLASS or  TCPIP or  TCPIPSERVICE or  TDQUEUE or  TERMINAL or  TRANCLASS or " +
        "TRANDUMPCODE or  TRANSACTION or  TSQUEUE or  VTAM",
      ctx.AUTOINSTALL(),
      ctx.CONNECTION(),
      ctx.DB2CONN(),
      ctx.DB2ENTRY(),
      ctx.DISPATCHER(),
      ctx.ENQUEUE(),
      ctx.FILE(),
      ctx.JOURNALNAME(),
      ctx.JOURNALNUM(),
      ctx.JVMPROGRAM(),
      ctx.LSRPOOL(),
      ctx.MONITOR(),
      ctx.MVSTCB(),
      ctx.POOL(),
      ctx.PROGAUTO(),
      ctx.PROGRAM(),
      ctx.RECOVERY(),
      ctx.STATS(),
      ctx.STORAGE(),
      ctx.STREAMNAME(),
      ctx.SUBPOOL(),
      ctx.SYSDUMPCODE(),
      ctx.TABLEMGR(),
      ctx.NODE(),
      ctx.TASKSUBPOOL(),
      ctx.TCLASS(),
      ctx.TCPIP(),
      ctx.TCPIPSERVICE(),
      ctx.TDQUEUE(),
      ctx.TERMINAL(),
      ctx.TRANCLASS(),
      ctx.TRANDUMPCODE(),
      ctx.TRANSACTION(),
      ctx.TSQUEUE(),
      ctx.VTAM(),
    );
    if (ctx.POOL().length === 0) {
      this.checkAllOptionsArePresentOrAbsent(
        "NODE and TARGET",
        ctx,
        ctx.NODE(),
        ctx.TARGET(),
      );
    }
  }
}
