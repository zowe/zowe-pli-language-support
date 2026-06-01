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
  Cics_into_setContext,
  Cics_readq_ts_tdContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ReadqOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_readq;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.TD, Severity.Warning],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.TS, Severity.Warning],
    [CICSLexer.QNAME, Severity.Error],
    [CICSLexer.NUMITEMS, Severity.Error],
    [CICSLexer.ITEM, Severity.Error],
    [CICSLexer.NEXT, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ReadqOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Readq rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_readq_ts_td) {
      this.checkOpts(ctx as unknown as Cics_readq_ts_tdContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkOpts(ctx: Cics_readq_ts_tdContext) {
    const tds = ctx.TD();
    const tss = ctx.TS();
    this.checkHasMutuallyExclusiveOptions("TD or TS", tds, tss);
    if (tds.length === 0) this.checkTs(ctx);
    else if (tss.length === 0) this.checkTd(ctx);
  }

  private checkTd(ctx: Cics_readq_ts_tdContext) {
    this.checkHasMandatoryOptions(ctx.QUEUE(), ctx, "QUEUE");
    this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.cics_into_set());
    this.checkHasIllegalOptions(ctx.ITEM(), "ITEM");
    this.checkHasIllegalOptions(ctx.NEXT(), "NEXT");
    this.checkHasIllegalOptions(ctx.NUMITEMS(), "NUMITEMS");
    this.checkHasIllegalOptions(ctx.QNAME(), "QNAME");
  }

  private checkTs(ctx: Cics_readq_ts_tdContext) {
    const intoSet = ctx.cics_into_set();
    if (intoSet.length !== 0) this.checkSetTs(intoSet[0]);

    this.checkHasExactlyOneOption(
      "QUEUE or QNAME",
      ctx,
      ctx.QUEUE(),
      ctx.QNAME(),
    );
    this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.cics_into_set());
    this.checkHasMutuallyExclusiveOptions(
      "NEXT or ITEM",
      ctx.NEXT(),
      ctx.ITEM(),
    );
    this.checkHasIllegalOptions(ctx.NOSUSPEND(), "NOSUSPEND");
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
  }

  private checkSetTs(ctx: Cics_into_setContext) {
    if (ctx.SET() != null)
      this.checkHasMandatoryOptions(
        (ctx.parent as unknown as Cics_readq_ts_tdContext).LENGTH(),
        ctx,
        "LENGTH",
      );
  }
}
