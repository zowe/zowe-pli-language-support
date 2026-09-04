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
import { Cics_allocate_nextContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class AllocateOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_allocate;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ALLOCATE, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.PROFILE, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.PARTNER, Severity.Error],
    [CICSLexer.ASIS, Severity.Warning],
    [CICSLexer.BUFFER, Severity.Warning],
    [CICSLexer.LEAVEKB, Severity.Warning],
    [CICSLexer.NOTRUNCATE, Severity.Warning],
    [CICSLexer.NOQUEUE, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, AllocateOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Allocate rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_allocate_next) {
      this.checkNext(ctx as unknown as Cics_allocate_nextContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkNext(ctx: Cics_allocate_nextContext) {
    this.checkMutuallyExclusiveOptions(
      "SYSID or SESSION or PARTNER",
      ctx.SYSID(),
      ctx.SESSION(),
      ctx.PARTNER(),
    );
    this.checkHasExactlyOneOption(
      "SYSID or SESSION or PARTNER",
      ctx,
      ctx.SYSID(),
      ctx.SESSION(),
      ctx.PARTNER(),
    );
  }
}
