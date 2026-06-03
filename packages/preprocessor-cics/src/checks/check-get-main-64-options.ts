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
  Cics_getmain64Context,
  Cics_getmain64_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class GetMain64OptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_getmain64;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.LOCATION, Severity.Error],
    [CICSLexer.EXECUTABLE, Severity.Warning],
    [CICSLexer.SHARED, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
    [CICSLexer.USERDATAKEY, Severity.Warning],
    [CICSLexer.CICSDATAKEY, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, GetMain64OptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS GETMAIN64 rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_getmain64_body) {
      this.checkGetMain(ctx as unknown as Cics_getmain64_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkGetMain(ctx: Cics_getmain64_bodyContext) {
    const parentCtx = ctx.parent as unknown as Cics_getmain64Context;
    this.checkHasIllegalOptions(
      parentCtx.GETMAIN64(),
      "GETMAIN64 is only available in Assembly",
    );
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
    if (ctx.LOCATION().length === 0)
      this.checkHasIllegalOptions(
        ctx.EXECUTABLE(),
        "EXECUTABLE without LOCATION",
      );
    this.checkHasMutuallyExclusiveOptions(
      "USERDATAKEY or CICSDATAKEY",
      ctx.USERDATAKEY(),
      ctx.CICSDATAKEY(),
    );
  }
}
