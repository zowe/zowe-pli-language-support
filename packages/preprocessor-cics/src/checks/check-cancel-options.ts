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
  Cics_cancel_btsContext,
  Cics_cancel_reqidContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class CancelOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_cancel;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CANCEL, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACQACTIVITY, Severity.Error],
    [CICSLexer.ACQPROCESS, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, CancelOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Cancel rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_cancel_bts) {
      this.checkBts(ctx as unknown as Cics_cancel_btsContext);
    } else if (ctx.ruleIndex === CICSParser.RULE_cics_cancel_reqid) {
      this.checkReq(ctx as unknown as Cics_cancel_reqidContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkBts(ctx: Cics_cancel_btsContext) {
    this.checkHasExactlyOneOption(
      "ACTIVITY or ACQACTIVITY or ACQPROCESS",
      ctx,
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
      ctx.ACQPROCESS(),
    );
  }

  private checkReq(ctx: Cics_cancel_reqidContext) {
    if (ctx.SYSID().length !== 0 || ctx.TRANSID().length !== 0) {
      this.checkHasMandatoryOptions(ctx.REQID(), ctx, "REQID");
    }
  }
}
