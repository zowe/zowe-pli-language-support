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
  Cics_startbrowse_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class StartbrowseOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_startbrowse;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACTIVITYID, Severity.Error],
    [CICSLexer.PROCESS, Severity.Warning],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Warning],
    [CICSLexer.BROWSETOKEN, Severity.Warning],
    [CICSLexer.CONTAINER, Severity.Warning],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.TIMER, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, StartbrowseOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS STARTBROWSE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_startbrowse_body) {
      this.checkBody(ctx as unknown as Cics_startbrowse_bodyContext);
    }
  }

  private checkBody(ctx: Cics_startbrowse_bodyContext) {
    if (ctx.ACTIVITY().length !== 0) {
      this.checkAllOptionsArePresentOrAbsent(
        "PROCESS and PROCESSTYPE",
        ctx,
        ctx.cics_startbrowse_processWithValue_subrule(),
        ctx.PROCESSTYPE(),
      );

      this.checkHasIllegalOptions(
        ctx.PROCESS(),
        "PROCESS, in this context, requires a value",
      );
      this.checkMutuallyExclusiveOptions(
        "ACTIVITYID or PROCESS",
        ctx.ACTIVITYID(),
        ctx.cics_startbrowse_processWithValue_subrule(),
      );
    } else if (ctx.CONTAINER().length !== 0 || ctx.CHANNEL().length !== 0) {
      if (ctx.CHANNEL().length !== 0) {
        this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
        this.checkHasIllegalOptions(ctx.PROCESS(), "PROCESS");
        this.checkHasIllegalOptions(ctx.PROCESSTYPE(), "PROCESSTYPE");
      } else {
        this.checkAllOptionsArePresentOrAbsent(
          "PROCESS and PROCESSTYPE",
          ctx,
          ctx.cics_startbrowse_processWithValue_subrule(),
          ctx.PROCESSTYPE(),
        );
      }

      this.checkHasIllegalOptions(
        ctx.PROCESS(),
        "PROCESS, in this context, requires a value",
      );
      this.checkMutuallyExclusiveOptions(
        "ACTIVITYID, PROCESS or CHANNEL",
        ctx.ACTIVITYID(),
        ctx.PROCESS(),
        ctx.cics_startbrowse_processWithValue_subrule(),
        ctx.CHANNEL(),
      );
    } else if (ctx.EVENT().length !== 0) {
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL");
      this.checkHasIllegalOptions(ctx.PROCESS(), "PROCESS");
      this.checkHasIllegalOptions(
        ctx.cics_startbrowse_processWithValue_subrule(),
        "PROCESS",
      );
      this.checkHasIllegalOptions(ctx.PROCESSTYPE(), "PROCESSTYPE");
    } else if (ctx.PROCESS().length !== 0) {
      this.checkHasMandatoryOptions(ctx.PROCESSTYPE(), ctx, "PROCESSTYPE");

      this.checkHasIllegalOptions(
        ctx.cics_startbrowse_processWithValue_subrule(),
        "PROCESS, in this context, cannot have a value",
      );
      this.checkHasIllegalOptions(ctx.ACTIVITYID(), "ACTIVITYID");
      this.checkHasIllegalOptions(ctx.ACTIVITY(), "ACTIVITY");
      this.checkHasIllegalOptions(ctx.CONTAINER(), "CONTAINER");
      this.checkHasIllegalOptions(ctx.EVENT(), "EVENT");
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL");
      this.checkHasIllegalOptions(ctx.TIMER(), "TIMER");
    } else if (ctx.TIMER().length !== 0) {
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL");
      this.checkHasIllegalOptions(ctx.PROCESS(), "PROCESS");
      this.checkHasIllegalOptions(
        ctx.cics_startbrowse_processWithValue_subrule(),
        "PROCESS",
      );
      this.checkHasIllegalOptions(ctx.PROCESSTYPE(), "PROCESSTYPE");
    }

    this.checkPrerequisiteIsMet(
      ctx.CONTAINER(),
      ctx.CHANNEL(),
      ctx,
      "CHANNEL without CONTAINER",
    );
    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");

    this.checkHasExactlyOneOption(
      "ACTIVITY, CONTAINER, PROCESS, EVENT or TIMER",
      ctx,
      ctx.ACTIVITY(),
      ctx.CONTAINER(),
      ctx.PROCESS(),
      ctx.EVENT(),
      ctx.TIMER(),
    );
  }
}
