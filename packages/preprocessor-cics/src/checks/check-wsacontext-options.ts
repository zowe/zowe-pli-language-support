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
  Cics_wsacontext_buildContext,
  Cics_wsacontext_deleteContext,
  Cics_wsacontext_getContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { VisitorUtility } from "./utils";
import { ParserRuleContext } from "antlr4ng";

export class WSAContextOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_wsacontext;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.BUILD, Severity.Warning],
    [CICSLexer.DELETE, Severity.Warning],
    [CICSLexer.GET, Severity.Warning],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.ACTION, Severity.Error],
    [CICSLexer.MESSAGEID, Severity.Error],
    [CICSLexer.RELATESURI, Severity.Error],
    [CICSLexer.RELATESTYPE, Severity.Error],
    [CICSLexer.EPRTYPE, Severity.Error],
    [CICSLexer.EPRFIELD, Severity.Error],
    [CICSLexer.EPRFROM, Severity.Error],
    [CICSLexer.EPRLENGTH, Severity.Error],
    [CICSLexer.FROMCCSID, Severity.Error],
    [CICSLexer.FROMCODEPAGE, Severity.Error],
    [CICSLexer.CONTEXTTYPE, Severity.Error],
    [CICSLexer.RELATESINDEX, Severity.Error],
    [CICSLexer.EPRINTO, Severity.Error],
    [CICSLexer.EPRSET, Severity.Error],
    [CICSLexer.INTOCCSID, Severity.Error],
    [CICSLexer.INTOCODEPAGE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WSAContextOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS WSAContext rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_wsacontext_build:
        this.checkWSAContextBuild(
          ctx as unknown as Cics_wsacontext_buildContext,
        );
        break;
      case CICSParser.RULE_cics_wsacontext_delete:
        this.checkWSAContextDelete(
          ctx as unknown as Cics_wsacontext_deleteContext,
        );
        break;
      case CICSParser.RULE_cics_wsacontext_get:
        this.checkWSAContextGet(ctx as unknown as Cics_wsacontext_getContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkWSAContextBuild(ctx: Cics_wsacontext_buildContext) {
    this.checkHasMandatoryOptions(ctx.BUILD(), ctx, "BUILD");
    this.checkPrerequisiteIsMet(
      ctx.RELATESURI(),
      ctx.RELATESTYPE(),
      ctx,
      "RELATESTYPE",
    );
    this.checkAllOptionsArePresentOrAbsent(
      "EPRTYPE, EPRFIELD and EPRFROM",
      ctx,
      ctx.EPRTYPE(),
      ctx.EPRFIELD(),
      ctx.EPRFROM(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "FROMCCSID or FROMCODEPAGE",
      ctx.FROMCCSID(),
      ctx.FROMCODEPAGE(),
    );
    this.checkOptionalWithLength(
      ctx.EPRTYPE(),
      ctx.EPRLENGTH(),
      ctx,
      "EPRTYPE",
      "EPRLENGTH",
    );
  }

  private checkWSAContextDelete(ctx: Cics_wsacontext_deleteContext) {
    this.checkHasMandatoryOptions(ctx.DELETE(), ctx, "DELETE");
    this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
  }

  private checkWSAContextGet(ctx: Cics_wsacontext_getContext) {
    this.checkHasMandatoryOptions(ctx.GET(), ctx, "GET");
    this.checkHasMandatoryOptions(ctx.CONTEXTTYPE(), ctx, "CONTEXTTYPE");
    if (ctx.RELATESTYPE().length !== 0 || ctx.RELATESINDEX().length !== 0) {
      this.checkHasMandatoryOptions(ctx.RELATESURI(), ctx, "RELATESURI");
    }
    this.validateEPRParameters(ctx);
    this.checkHasMutuallyExclusiveOptions(
      "INTOCCSID or INTOCODEPAGE",
      ctx.INTOCCSID(),
      ctx.INTOCODEPAGE(),
    );
  }

  private validateEPRParameters(ctx: Cics_wsacontext_getContext) {
    if (
      ctx.EPRTYPE().length !== 0 ||
      ctx.EPRFIELD().length !== 0 ||
      ctx.EPRLENGTH().length !== 0 ||
      ctx.EPRINTO().length !== 0 ||
      ctx.EPRSET().length !== 0
    ) {
      const mandatoryParamsPresent =
        ctx.EPRTYPE().length !== 0 &&
        ctx.EPRFIELD().length !== 0 &&
        ctx.EPRLENGTH().length !== 0;
      const exclusiveParamsValid =
        (ctx.EPRINTO().length !== 0) !== (ctx.EPRSET().length !== 0);
      if (!(mandatoryParamsPresent && exclusiveParamsValid)) {
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(ctx),
          "Invalid parameters combination. Valid combination is: ",
          "EPRTYPE, EPRFIELD, (EPRINTO or EPRSET) and EPRLENGTH",
        );
      }
      this.checkHasMutuallyExclusiveOptions(
        "EPRINTO or EPRSET",
        ctx.EPRINTO(),
        ctx.EPRSET(),
      );
    }
  }
}
