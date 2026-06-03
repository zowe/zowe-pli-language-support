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
  Cics_gdsContext,
  Cics_gds_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { ParserRuleContext } from "antlr4ng";

export class GdsOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_gds;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>();

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, GdsOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS GDS rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_gds_opts) {
      this.checkGds(ctx as unknown as Cics_gds_optsContext);
    }
  }

  private checkGds(ctx: Cics_gds_optsContext) {
    const parentCtx = ctx.parent as unknown as Cics_gdsContext;
    this.checkHasIllegalOptions(
      parentCtx.GDS(),
      "GDS is only available in Assembly",
    );
  }
}
