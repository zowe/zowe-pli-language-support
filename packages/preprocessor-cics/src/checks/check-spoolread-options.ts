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
  Cics_spoolread_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SpoolreadOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_spoolread;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.MAXFLENGTH, Severity.Error],
    [CICSLexer.TOFLENGTH, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SpoolreadOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SPOOLREAD rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_spoolread_options) {
      this.checkSpoolread(ctx as unknown as Cics_spoolread_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkSpoolread(ctx: Cics_spoolread_optionsContext) {
    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMandatoryOptions(ctx.INTO(), ctx, "INTO");
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.MAXFLENGTH(), ctx, "MAXFLENGTH");
  }
}
