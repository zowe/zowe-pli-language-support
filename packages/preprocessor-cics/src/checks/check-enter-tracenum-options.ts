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
import { Cics_enter_optsContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class EnterTracenumOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_enter;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ENTER, Severity.Error],
    [CICSLexer.TRACENUM, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.FROMLENGTH, Severity.Error],
    [CICSLexer.RESOURCE, Severity.Error],
    [CICSLexer.EXCEPTION, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, EnterTracenumOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Enter Tracenum rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_enter_opts) {
      this.checkEnq(ctx as unknown as Cics_enter_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkEnq(ctx: Cics_enter_optsContext) {
    this.checkHasMandatoryOptions(ctx.TRACENUM(), ctx, "TRACENUM");

    if (ctx.FROMLENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    }
  }
}
