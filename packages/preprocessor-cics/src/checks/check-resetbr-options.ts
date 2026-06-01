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
  Cics_resetbr_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ResetbrOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_resetbr;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.GENERIC, Severity.Warning],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.GTEQ, Severity.Warning],
    [CICSLexer.EQUAL, Severity.Warning],
    [CICSLexer.RBA, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.XRBA, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ResetbrOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS RESETBR rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_resetbr_options) {
      this.checkResetbr(ctx as unknown as Cics_resetbr_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkResetbr(ctx: Cics_resetbr_optionsContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );
    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    this.checkHasMutuallyExclusiveOptions(
      "RBA, RRN, XRBA or KEYLENGTH",
      ctx.RBA(),
      ctx.RRN(),
      ctx.XRBA(),
      ctx.KEYLENGTH(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "GTEQ or EQUAL",
      ctx.GTEQ(),
      ctx.EQUAL(),
    );
    this.checkPrerequisiteIsMet(ctx.KEYLENGTH(), ctx.GENERIC(), ctx, "GENERIC");
    if (ctx.SYSID().length !== 0)
      this.checkHasExactlyOneOption(
        "RBA, RRN, XRBA or KEYLENGTH",
        ctx,
        ctx.RBA(),
        ctx.RRN(),
        ctx.XRBA(),
        ctx.KEYLENGTH(),
      );
  }
}
