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
  Cics_bif_deeditContext,
  Cics_bif_digestContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class BifOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_bif;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.BIF, Severity.Error],
    [CICSLexer.DEEDIT, Severity.Error],
    [CICSLexer.FIELD, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.DIGEST, Severity.Error],
    [CICSLexer.RECORD, Severity.Error],
    [CICSLexer.RECORDLEN, Severity.Error],
    [CICSLexer.HEX, Severity.Error],
    [CICSLexer.BINARY, Severity.Error],
    [CICSLexer.BASE64, Severity.Error],
    [CICSLexer.DIGESTTYPE, Severity.Error],
    [CICSLexer.RESULT, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, BifOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Bif rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_bif_deedit)
      this.checkDeedit(ctx as unknown as Cics_bif_deeditContext);
    else if (ctx.ruleIndex === CICSParser.RULE_cics_bif_digest)
      this.checkDigest(ctx as unknown as Cics_bif_digestContext);

    this.checkDuplicates(ctx);
  }

  private checkDeedit(ctx: Cics_bif_deeditContext) {
    this.checkHasMandatoryOptions(ctx.DEEDIT(), ctx, "DEEDIT");
    this.checkHasMandatoryOptions(ctx.FIELD(), ctx, "FIELD");
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }

  private checkDigest(ctx: Cics_bif_digestContext) {
    this.checkHasMandatoryOptions(ctx.DIGEST(), ctx, "DIGEST");
    this.checkHasMandatoryOptions(ctx.RECORD(), ctx, "RECORD");
    this.checkHasMandatoryOptions(ctx.RESULT(), ctx, "RESULT");
    this.checkHasMutuallyExclusiveOptions(
      "HEX or BINARY or BASE64 or DIGESTTYPE",
      ctx.HEX(),
      ctx.BINARY(),
      ctx.BASE64(),
      ctx.DIGESTTYPE(),
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.RECORDLEN(), ctx, "RECORDLEN");
    }
  }
}
