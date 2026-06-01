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
import { Cics_build_attachContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class BuildOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_build;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.BUILD, Severity.Error],
    [CICSLexer.ATTACH, Severity.Error],
    [CICSLexer.ATTACHID, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.RESOURCE, Severity.Error],
    [CICSLexer.RPROCESS, Severity.Error],
    [CICSLexer.RRESOURCE, Severity.Error],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.IUTYPE, Severity.Error],
    [CICSLexer.DATASTR, Severity.Error],
    [CICSLexer.RECFM, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, BuildOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Build rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_build_attach) {
      this.checkAttachIdOptions(ctx as unknown as Cics_build_attachContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkAttachIdOptions(ctx: Cics_build_attachContext) {
    this.checkHasMandatoryOptions(ctx.ATTACH(), ctx, "ATTACH");
    this.checkHasMandatoryOptions(ctx.ATTACHID(), ctx, "ATTACHID");
  }
}
