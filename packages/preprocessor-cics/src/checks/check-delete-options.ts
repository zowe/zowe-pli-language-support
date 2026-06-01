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
  Cics_delete_group_fourContext,
  Cics_delete_group_oneContext,
  Cics_delete_group_threeContext,
  Cics_delete_group_twoContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class DeleteOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_delete;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.NUMREC, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.COUNTER, Severity.Error],
    [CICSLexer.DCOUNTER, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.TIMER, Severity.Error],
    [CICSLexer.GENERIC, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
    [CICSLexer.RBA, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.PROCESS, Severity.Warning],
    [CICSLexer.ACQPROCESS, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DeleteOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS DELETE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_delete_group_one:
        this.checkDeleteGroupOne(
          ctx as unknown as Cics_delete_group_oneContext,
        );
        break;
      case CICSParser.RULE_cics_delete_group_two:
        this.checkDeleteGroupTwo(
          ctx as unknown as Cics_delete_group_twoContext,
        );
        break;
      case CICSParser.RULE_cics_delete_group_three:
        this.checkDeleteGroupThree(
          ctx as unknown as Cics_delete_group_threeContext,
        );
        break;
      case CICSParser.RULE_cics_delete_group_four:
        this.checkDeleteGroupFour(
          ctx as unknown as Cics_delete_group_fourContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkDeleteGroupOne(ctx: Cics_delete_group_oneContext) {
    this.checkHasMandatoryOptions(ctx.cics_file_name(), ctx, "FILE");
    const file = ctx
      .cics_file_name()
      .map((f) => f.FILE())
      .filter((n): n is TerminalNode => n != null);
    const dataset = ctx
      .cics_file_name()
      .map((f) => f.DATASET())
      .filter((n): n is TerminalNode => n != null);
    this.checkHasMutuallyExclusiveOptions("FILE or DATASET", file, dataset);

    this.checkHasMutuallyExclusiveOptions(
      "TOKEN or RIDFLD",
      ctx.TOKEN(),
      ctx.RIDFLD(),
    );

    if (ctx.RIDFLD().length === 0)
      this.checkHasIllegalOptions(ctx.cics_keylength(), "KEYLENGTH");
    if (ctx.cics_keylength().length === 0)
      this.checkHasIllegalOptions(ctx.GENERIC(), "GENERIC");
    if (ctx.GENERIC().length === 0)
      this.checkHasIllegalOptions(ctx.NUMREC(), "NUMREC");

    this.checkHasMutuallyExclusiveOptions("RBA or RRN", ctx.RBA(), ctx.RRN());
  }

  private checkDeleteGroupTwo(ctx: Cics_delete_group_twoContext) {
    this.checkHasExactlyOneOption(
      "ACTIVITY or CHANNEL or EVENT or TIMER",
      ctx,
      ctx.ACTIVITY(),
      ctx.CHANNEL(),
      ctx.EVENT(),
      ctx.TIMER(),
    );
  }

  private checkDeleteGroupThree(ctx: Cics_delete_group_threeContext) {
    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    this.checkHasMutuallyExclusiveOptions(
      "ACTIVITY or ACQACTIVITY or PROCESS or ACQPROCESS or CHANNEL",
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
      ctx.PROCESS(),
      ctx.ACQPROCESS(),
      ctx.CHANNEL(),
    );
  }

  private checkDeleteGroupFour(ctx: Cics_delete_group_fourContext) {
    this.checkHasExactlyOneOption(
      "COUNTER or DCOUNTER",
      ctx,
      ctx.cics_counter_dcounter(),
    );
  }
}
