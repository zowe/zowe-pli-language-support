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
import { Cics_delay_optsContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class DelayOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_delay;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.DELAY, Severity.Error],
    [CICSLexer.INTERVAL, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.FOR, Severity.Warning],
    [CICSLexer.HOURS, Severity.Error],
    [CICSLexer.MINUTES, Severity.Error],
    [CICSLexer.SECONDS, Severity.Error],
    [CICSLexer.MILLISECS, Severity.Error],
    [CICSLexer.UNTIL, Severity.Warning],
    [CICSLexer.REQID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DelayOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Delay rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_delay_opts) {
      this.checkOpts(ctx as unknown as Cics_delay_optsContext);
      this.checkDuplicates(ctx);
    }
  }

  private checkOpts(ctx: Cics_delay_optsContext) {
    if (ctx.UNTIL().length !== 0) {
      this.checkHasIllegalOptions(ctx.MILLISECS(), "MILLISECS");
      if (
        ctx.HOURS().length === 0 &&
        ctx.MINUTES().length === 0 &&
        ctx.SECONDS().length === 0
      )
        this.checkHasMandatoryOptions(
          ctx.HOURS(),
          ctx,
          "HOURS or MINUTES or SECONDS",
        );
    }

    this.checkHasMutuallyExclusiveOptions(
      "INTERVAL, TIME, UNTIL, FOR",
      ctx.INTERVAL(),
      ctx.TIME(),
      ctx.UNTIL(),
      ctx.FOR(),
    );

    if (ctx.INTERVAL().length !== 0 || ctx.TIME().length !== 0) {
      this.checkHasIllegalOptions(ctx.HOURS(), "HOURS");
      this.checkHasIllegalOptions(ctx.MINUTES(), "MINUTES");
      this.checkHasIllegalOptions(ctx.SECONDS(), "SECONDS");
      this.checkHasIllegalOptions(ctx.MILLISECS(), "MILLISECS");
    }
    if (
      ctx.FOR().length !== 0 &&
      ctx.HOURS().length === 0 &&
      ctx.MINUTES().length === 0 &&
      ctx.SECONDS().length === 0 &&
      ctx.MILLISECS().length === 0
    )
      this.checkHasMandatoryOptions(
        ctx.HOURS(),
        ctx,
        "HOURS or MINUTES or SECONDS or MILLISECS",
      );
  }
}
