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
  Cics_freemainContext,
  Cics_freemain_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class FreeMainOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_freemain;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.DATA, Severity.Error],
    [CICSLexer.DATAPOINTER, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, FreeMainOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Freemain rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_freemain_opts) {
      this.checkOpts(ctx as unknown as Cics_freemain_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkOpts(ctx: Cics_freemain_optsContext) {
    const parentCtx = ctx.parent as unknown as Cics_freemainContext;
    this.checkHasIllegalOptions(
      parentCtx.FREEMAIN64(),
      "FREEMAIN64 is only available in Assembly",
    );
    this.checkHasExactlyOneOption(
      "DATA or DATAPOINTER",
      ctx,
      ctx.DATA(),
      ctx.DATAPOINTER(),
    );
  }
}
