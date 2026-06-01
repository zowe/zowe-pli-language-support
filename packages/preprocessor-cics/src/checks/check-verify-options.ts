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
  Cics_verify_passwordContext,
  Cics_verify_phraseContext,
  Cics_verify_tokenContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class VerifyOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_verify;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.PASSWORD, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.GROUPID, Severity.Error],
    [CICSLexer.CHANGETIME, Severity.Error],
    [CICSLexer.DAYSLEFT, Severity.Error],
    [CICSLexer.ESMREASON, Severity.Error],
    [CICSLexer.ESMRESP, Severity.Error],
    [CICSLexer.EXPIRYTIME, Severity.Error],
    [CICSLexer.INVALIDCOUNT, Severity.Error],
    [CICSLexer.LASTUSETIME, Severity.Error],
    [CICSLexer.PHRASE, Severity.Error],
    [CICSLexer.PHRASELEN, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.TOKENLEN, Severity.Error],
    [CICSLexer.TOKENTYPE, Severity.Error],
    [CICSLexer.ISUSERID, Severity.Error],
    [CICSLexer.DATATYPE, Severity.Error],
    [CICSLexer.ENCRYPTKEY, Severity.Error],
    [CICSLexer.OUTTOKEN, Severity.Error],
    [CICSLexer.OUTTOKENLEN, Severity.Error],
    [CICSLexer.BASICAUTH, Severity.Warning],
    [CICSLexer.JWT, Severity.Warning],
    [CICSLexer.KERBEROS, Severity.Warning],
    [CICSLexer.BIT, Severity.Warning],
    [CICSLexer.BASE64, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, VerifyOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Verify rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_verify_password:
        this.checkVerifyPassword(ctx as unknown as Cics_verify_passwordContext);
        break;
      case CICSParser.RULE_cics_verify_phrase:
        this.checkVerifyPhrase(ctx as unknown as Cics_verify_phraseContext);
        break;
      case CICSParser.RULE_cics_verify_token:
        this.checkVerifyToken(ctx as unknown as Cics_verify_tokenContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkVerifyPassword(ctx: Cics_verify_passwordContext) {
    this.checkHasMandatoryOptions(ctx.PASSWORD(), ctx, "PASSWORD");
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");
  }

  private checkVerifyPhrase(ctx: Cics_verify_phraseContext) {
    this.checkHasMandatoryOptions(ctx.PHRASE(), ctx, "PHRASE");
    this.checkHasMandatoryOptions(ctx.PHRASELEN(), ctx, "PHRASELEN");
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");
  }

  private checkVerifyToken(ctx: Cics_verify_tokenContext) {
    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMandatoryOptions(ctx.TOKENLEN(), ctx, "TOKENLEN");
    this.checkHasExactlyOneOption(
      "TOKENTYPE or BASICAUTH or JWT or KERBEROS",
      ctx,
      ctx.TOKENTYPE(),
      ctx.BASICAUTH(),
      ctx.JWT(),
      ctx.KERBEROS(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "BIT or DATATYPE or BASE64",
      ctx.BIT(),
      ctx.DATATYPE(),
      ctx.BASE64(),
    );
    if (ctx.OUTTOKENLEN().length !== 0) {
      this.checkHasMandatoryOptions(ctx.OUTTOKEN(), ctx, "OUTTOKEN");
    }
    if (ctx.OUTTOKEN().length !== 0) {
      this.checkHasMandatoryOptions(ctx.OUTTOKENLEN(), ctx, "OUTTOKENLEN");
    }
  }
}
