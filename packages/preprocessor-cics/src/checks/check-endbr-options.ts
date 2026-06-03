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
import { Cics_endbr_optsContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class EndbrOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_endbr;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, EndbrOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS ENDBR rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_endbr_opts) {
      this.checkEndbr(ctx as unknown as Cics_endbr_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkEndbr(ctx: Cics_endbr_optsContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );
  }
}
