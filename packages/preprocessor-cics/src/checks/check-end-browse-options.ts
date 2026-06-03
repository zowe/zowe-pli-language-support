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
  Cics_endbrowse_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class EndBrowseOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_endbrowse;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACTIVITY, Severity.Warning],
    [CICSLexer.BROWSETOKEN, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Warning],
    [CICSLexer.EVENT, Severity.Warning],
    [CICSLexer.PROCESS, Severity.Warning],
    [CICSLexer.TIMER, Severity.Warning],
    [CICSLexer.RETCODE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, EndBrowseOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS ENDBROWSE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_endbrowse_opts) {
      this.checkEndBrowse(ctx as unknown as Cics_endbrowse_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkEndBrowse(ctx: Cics_endbrowse_optsContext) {
    this.checkHasExactlyOneOption(
      "ACTIVITY or CONTAINER or EVENT or PROCESS or TIMER",
      ctx,
      ctx.ACTIVITY(),
      ctx.CONTAINER(),
      ctx.EVENT(),
      ctx.PROCESS(),
      ctx.TIMER(),
    );

    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");
  }
}
