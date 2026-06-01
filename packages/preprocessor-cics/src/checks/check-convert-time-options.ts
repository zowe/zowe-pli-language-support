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
  Cics_converttime_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ConvertTimeOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_converttime;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CONVERTTIME, Severity.Error],
    [CICSLexer.ABSTIME, Severity.Error],
    [CICSLexer.DATESTRING, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ConvertTimeOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS CONVERTTIME rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_converttime_opts) {
      this.checkConvertTime(ctx as unknown as Cics_converttime_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkConvertTime(ctx: Cics_converttime_optsContext) {
    this.checkHasMandatoryOptions(ctx.ABSTIME(), ctx, "ABSTIME");
    this.checkHasMandatoryOptions(ctx.DATESTRING(), ctx, "DATESTRING");
  }
}
