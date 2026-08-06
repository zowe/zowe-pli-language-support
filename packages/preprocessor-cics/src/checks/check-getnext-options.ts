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
  Cics_getnext_activityContext,
  Cics_getnext_containerContext,
  Cics_getnext_eventContext,
  Cics_getnext_processContext,
  Cics_getnext_timerContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class GetnextOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_getnext;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACTIVITYID, Severity.Error],
    [CICSLexer.LEVEL, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.COMPOSITE, Severity.Error],
    [CICSLexer.TIMER, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.ABSTIME, Severity.Error],
    [CICSLexer.BROWSETOKEN, Severity.Error],
    [CICSLexer.EVENTTYPE, Severity.Error],
    [CICSLexer.FIRESTATUS, Severity.Error],
    [CICSLexer.PREDICATE, Severity.Error],
    [CICSLexer.STATUS, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, GetnextOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS GETNEXT rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_getnext_activity:
        this.checkActivity(ctx as unknown as Cics_getnext_activityContext);
        break;
      case CICSParser.RULE_cics_getnext_container:
        this.checkContainer(ctx as unknown as Cics_getnext_containerContext);
        break;
      case CICSParser.RULE_cics_getnext_event:
        this.checkEvent(ctx as unknown as Cics_getnext_eventContext);
        break;
      case CICSParser.RULE_cics_getnext_process:
        this.checkProcess(ctx as unknown as Cics_getnext_processContext);
        break;
      case CICSParser.RULE_cics_getnext_timer:
        this.checkTimer(ctx as unknown as Cics_getnext_timerContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkActivity(ctx: Cics_getnext_activityContext) {
    this.checkHasMandatoryOptions(ctx.ACTIVITY(), ctx, "ACTIVITY");
    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");
  }

  private checkContainer(ctx: Cics_getnext_containerContext) {
    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");
  }

  private checkEvent(ctx: Cics_getnext_eventContext) {
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");
  }

  private checkProcess(ctx: Cics_getnext_processContext) {
    this.checkHasMandatoryOptions(ctx.PROCESS(), ctx, "PROCESS");
    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");
  }

  private checkTimer(ctx: Cics_getnext_timerContext) {
    this.checkHasMandatoryOptions(ctx.TIMER(), ctx, "TIMER");
    this.checkHasMandatoryOptions(ctx.BROWSETOKEN(), ctx, "BROWSETOKEN");
  }
}
