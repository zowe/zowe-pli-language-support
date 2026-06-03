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
  Cics_signon_bodyContext,
  Cics_signon_token_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SignonOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_signon;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.BASE64, Severity.Warning],
    [CICSLexer.BIT, Severity.Warning],
    [CICSLexer.CHANGETIME, Severity.Error],
    [CICSLexer.DATATYPE, Severity.Error],
    [CICSLexer.DAYSLEFT, Severity.Error],
    [CICSLexer.ESMREASON, Severity.Error],
    [CICSLexer.ESMRESP, Severity.Error],
    [CICSLexer.EXPIRYTIME, Severity.Error],
    [CICSLexer.GROUPID, Severity.Error],
    [CICSLexer.INVALIDCOUNT, Severity.Error],
    [CICSLexer.KERBEROS, Severity.Warning],
    [CICSLexer.LANGINUSE, Severity.Error],
    [CICSLexer.LANGUAGECODE, Severity.Error],
    [CICSLexer.LASTUSETIME, Severity.Error],
    [CICSLexer.NATLANG, Severity.Error],
    [CICSLexer.NATLANGINUSE, Severity.Error],
    [CICSLexer.NEWPASSWORD, Severity.Error],
    [CICSLexer.NEWPHRASE, Severity.Error],
    [CICSLexer.NEWPHRASELEN, Severity.Error],
    [CICSLexer.OIDCARD, Severity.Error],
    [CICSLexer.PASSWORD, Severity.Error],
    [CICSLexer.PHRASE, Severity.Error],
    [CICSLexer.PHRASELEN, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.TOKENLEN, Severity.Error],
    [CICSLexer.TOKENTYPE, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SignonOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SIGNON rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_signon_body:
        this.checkMainBody(ctx as unknown as Cics_signon_bodyContext);
        break;
      case CICSParser.RULE_cics_signon_token_body:
        this.checkToken(ctx as unknown as Cics_signon_token_bodyContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkMainBody(ctx: Cics_signon_bodyContext) {
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");

    this.checkMutuallyExclusiveOptions(
      "LANGUAGECODE or NATLANG",
      ctx.LANGUAGECODE(),
      ctx.NATLANG(),
    );
    this.checkMutuallyExclusiveOptions(
      "PASSWORD or PHRASE",
      ctx.PASSWORD(),
      ctx.PHRASE(),
    );

    this.checkPrerequisiteIsMet(
      ctx.PASSWORD(),
      ctx.NEWPASSWORD(),
      ctx,
      "NEWPASSWORD without PASSWORD",
    );
    this.checkPrerequisiteIsMet(
      ctx.PHRASE(),
      ctx.NEWPHRASE(),
      ctx,
      "NEWPHRASE without PHRASE",
    );
    this.checkPrerequisiteIsMet(
      ctx.NEWPHRASE(),
      ctx.NEWPHRASELEN(),
      ctx,
      "NEWPHRASELEN without NEWPHRASE",
    );
    this.checkOptionalWithLength(
      ctx.PHRASE(),
      ctx.PHRASELEN(),
      ctx,
      "PHRASE",
      "PHRASELEN",
    );
  }

  private checkToken(ctx: Cics_signon_token_bodyContext) {
    this.checkHasExactlyOneOption(
      "TOKENTYPE or KERBEROS",
      ctx,
      ctx.TOKENTYPE(),
      ctx.KERBEROS(),
    );
    this.checkMutuallyExclusiveOptions(
      "BIT, DATATYPE or BASE64",
      ctx.BIT(),
      ctx.DATATYPE(),
      ctx.BASE64(),
    );
    this.checkMutuallyExclusiveOptions(
      "LANGUAGECODE or NATLANG",
      ctx.LANGUAGECODE(),
      ctx.NATLANG(),
    );

    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMandatoryOptions(ctx.TOKENLEN(), ctx, "TOKENLEN");
  }
}
