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
import { Cics_load_optionsContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class LoadOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_load;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.ENTRY, Severity.Error],
    [CICSLexer.HOLD, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, LoadOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS LOAD rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_load_options) {
      this.checkLoad(ctx as unknown as Cics_load_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkLoad(ctx: Cics_load_optionsContext) {
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
    this.checkHasMutuallyExclusiveOptions(
      "LENGTH or FLENGTH",
      ctx.LENGTH(),
      ctx.FLENGTH(),
    );
  }
}
