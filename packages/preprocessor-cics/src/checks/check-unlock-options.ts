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
import { Cics_unlock_bodyContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class UnlockOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_unlock;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.UNLOCK, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, UnlockOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS UNLOCK rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_unlock_body) {
      this.checkUnlock(ctx as unknown as Cics_unlock_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkUnlock(ctx: Cics_unlock_bodyContext) {
    this.checkHasMandatoryOptions(ctx.cics_file_name(), ctx, "FILE");
    const file = ctx
      .cics_file_name()
      .map((f) => f.FILE())
      .filter((n): n is TerminalNode => n != null);
    const dataset = ctx
      .cics_file_name()
      .map((f) => f.DATASET())
      .filter((n): n is TerminalNode => n != null);
    this.checkHasMutuallyExclusiveOptions("FILE or DATASET", file, dataset);
  }
}
