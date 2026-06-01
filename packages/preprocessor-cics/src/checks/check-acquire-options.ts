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
import { CICSLexer } from "../generated/CICSLexer";
import {
  Cics_acquire_processContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { ParserRuleContext } from "antlr4ng";

export class AcquireOptionsChecker extends CICSOptionsCheckerBase {
  static readonly RULE_INDEX = CICSParser.RULE_cics_acquire;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACQUIRE, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.ACTIVITYID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, AcquireOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Acquire rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  override checkOptions<E extends ParserRuleContext>(ctx: E) {
    if (ctx.ruleIndex === CICSParser.RULE_cics_acquire_process) {
      this.checkAcquireProcess(ctx as unknown as Cics_acquire_processContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkAcquireProcess(ctx: Cics_acquire_processContext) {
    this.checkHasMandatoryOptions(ctx.PROCESS(), ctx, "PROCESS");
    this.checkHasMandatoryOptions(ctx.PROCESSTYPE(), ctx, "PROCESSTYPE");
  }
}
