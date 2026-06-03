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
  Cics_enable_programContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class EnableProgramOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_enable;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.ENTRY, Severity.Error],
    [CICSLexer.ENTRYNAME, Severity.Error],
    [CICSLexer.EXIT, Severity.Error],
    [CICSLexer.FORMATEDF, Severity.Warning],
    [CICSLexer.GALENGTH, Severity.Error],
    [CICSLexer.GALOCATION, Severity.Error],
    [CICSLexer.GAEXECUTABLE, Severity.Warning],
    [CICSLexer.GAENTRYNAME, Severity.Error],
    [CICSLexer.INDOUBTWAIT, Severity.Warning],
    [CICSLexer.LINKEDITMODE, Severity.Warning],
    [CICSLexer.QUASIRENT, Severity.Warning],
    [CICSLexer.THREADSAFE, Severity.Warning],
    [CICSLexer.OPENAPI, Severity.Warning],
    [CICSLexer.REQUIRED, Severity.Warning],
    [CICSLexer.PURGEABLE, Severity.Warning],
    [CICSLexer.SHUTDOWN, Severity.Warning],
    [CICSLexer.SPI, Severity.Warning],
    [CICSLexer.START, Severity.Warning],
    [CICSLexer.TALENGTH, Severity.Error],
    [CICSLexer.TAEXECUTABLE, Severity.Warning],
    [CICSLexer.TASKSTART, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, EnableProgramOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS ENABLE PROGRAM rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_enable_program) {
      this.checkEnableProgram(ctx as unknown as Cics_enable_programContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkEnableProgram(ctx: Cics_enable_programContext) {
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
    this.checkHasMutuallyExclusiveOptions(
      "GALENGTH or GAENTRYNAME",
      ctx.GALENGTH(),
      ctx.GAENTRYNAME(),
    );
    if (ctx.GALENGTH().length === 0) {
      this.checkHasIllegalOptions(
        ctx.GAEXECUTABLE(),
        "GAEXECUTABLE without GALENGTH",
      );
      this.checkHasIllegalOptions(
        ctx.GALOCATION(),
        "GALOCATION without GALENGTH",
      );
    }
    this.checkHasMutuallyExclusiveOptions(
      "QUASIRENT or THREADSAFE or REQUIRED",
      ctx.QUASIRENT(),
      ctx.THREADSAFE(),
      ctx.REQUIRED(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "QUASIRENT or OPENAPI",
      ctx.QUASIRENT(),
      ctx.OPENAPI(),
    );
    if (ctx.TALENGTH().length === 0) {
      this.checkHasIllegalOptions(
        ctx.TAEXECUTABLE(),
        "TAEXECUTABLE without TALENGTH",
      );
    }
  }
}
