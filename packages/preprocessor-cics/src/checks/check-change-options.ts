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
  Cics_change_passwordContext,
  Cics_change_phraseContext,
  Cics_change_taskContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ChangeOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_change;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CHANGE, Severity.Error],
    [CICSLexer.CHANGETIME, Severity.Error],
    [CICSLexer.DAYSLEFT, Severity.Error],
    [CICSLexer.ESMREASON, Severity.Error],
    [CICSLexer.ESMRESP, Severity.Error],
    [CICSLexer.EXPIRYTIME, Severity.Error],
    [CICSLexer.INVALIDCOUNT, Severity.Error],
    [CICSLexer.LASTUSETIME, Severity.Error],
    [CICSLexer.NEWPHRASE, Severity.Error],
    [CICSLexer.NEWPHRASELEN, Severity.Error],
    [CICSLexer.PHRASELEN, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.PASSWORD, Severity.Error],
    [CICSLexer.NEWPASSWORD, Severity.Error],
    [CICSLexer.PRIORITY, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ChangeOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Change rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_change_phrase) {
      this.checkChangePhrase(ctx as unknown as Cics_change_phraseContext);
    } else if (ctx.ruleIndex === CICSParser.RULE_cics_change_password) {
      this.checkChangePassword(ctx as unknown as Cics_change_passwordContext);
    } else if (ctx.ruleIndex === CICSParser.RULE_cics_change_task) {
      this.checkChangeTask(ctx as unknown as Cics_change_taskContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkChangePhrase(ctx: Cics_change_phraseContext) {
    this.checkHasMandatoryOptions(ctx.NEWPHRASE(), ctx, "NEWPHRASE");
    this.checkHasMandatoryOptions(ctx.NEWPHRASELEN(), ctx, "NEWPHRASELEN");
    this.checkHasMandatoryOptions(ctx.PHRASELEN(), ctx, "PHRASELEN");
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");
    this.checkHasMandatoryOptions(ctx.PHRASE(), ctx, "PHRASE");
  }

  private checkChangePassword(ctx: Cics_change_passwordContext) {
    this.checkHasMandatoryOptions(ctx.NEWPASSWORD(), ctx, "NEWPASSWORD");
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");
    this.checkHasMandatoryOptions(ctx.PASSWORD(), ctx, "PASSWORD");
  }

  private checkChangeTask(ctx: Cics_change_taskContext) {
    this.checkHasMandatoryOptions(ctx.TASK(), ctx, "TASK");
  }
}
