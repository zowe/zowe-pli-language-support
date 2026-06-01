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
  Cics_invoke_applicationContext,
  Cics_invoke_serviceContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class InvokeOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_invoke;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.APPLICATION, Severity.Error],
    [CICSLexer.OPERATION, Severity.Error],
    [CICSLexer.PLATFORM, Severity.Error],
    [CICSLexer.MAJORVERSION, Severity.Error],
    [CICSLexer.MINORVERSION, Severity.Error],
    [CICSLexer.EXACTMATCH, Severity.Warning],
    [CICSLexer.MINIMUM, Severity.Warning],
    [CICSLexer.COMMAREA, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.SERVICE, Severity.Error],
    [CICSLexer.WEBSERVICE, Severity.Error],
    [CICSLexer.URI, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.SCOPE, Severity.Error],
    [CICSLexer.SCOPELEN, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, InvokeOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Invoke rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_invoke_application) {
      this.checkInvokeApplication(
        ctx as unknown as Cics_invoke_applicationContext,
      );
    } else if (ctx.ruleIndex === CICSParser.RULE_cics_invoke_service) {
      this.checkInvokeService(ctx as unknown as Cics_invoke_serviceContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkInvokeApplication(ctx: Cics_invoke_applicationContext) {
    this.checkHasMandatoryOptions(ctx.APPLICATION(), ctx, "APPLICATION");
    this.checkHasMandatoryOptions(ctx.OPERATION(), ctx, "OPERATION");
    this.checkHasMutuallyExclusiveOptions(
      "EXACTMATCH or MINIMUM",
      ctx.EXACTMATCH(),
      ctx.MINIMUM(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "COMMAREA or CHANNEL",
      ctx.COMMAREA(),
      ctx.CHANNEL(),
    );
    if (ctx.MINORVERSION().length !== 0) {
      this.checkHasMandatoryOptions(ctx.MAJORVERSION(), ctx, "MAJORVERSION");
    }
    if (ctx.EXACTMATCH().length !== 0 || ctx.MINIMUM().length !== 0) {
      this.checkHasMandatoryOptions(ctx.MINORVERSION(), ctx, "MINORVERSION");
    }
    this.checkOptionalWithLength(
      ctx.COMMAREA(),
      ctx.LENGTH(),
      ctx,
      "COMMAREA",
      "LENGTH",
    );
  }

  private checkInvokeService(ctx: Cics_invoke_serviceContext) {
    this.checkHasExactlyOneOption(
      "SERVICE or WEBSERVICE",
      ctx,
      ctx.SERVICE(),
      ctx.WEBSERVICE(),
    );
    this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
    this.checkHasMandatoryOptions(ctx.OPERATION(), ctx, "OPERATION");
    this.checkHasMutuallyExclusiveOptions(
      "URI or URIMAP",
      ctx.URI(),
      ctx.URIMAP(),
    );
    this.checkOptionalWithLength(
      ctx.SCOPE(),
      ctx.SCOPELEN(),
      ctx,
      "SCOPE",
      "SCOPELEN",
    );
  }
}
