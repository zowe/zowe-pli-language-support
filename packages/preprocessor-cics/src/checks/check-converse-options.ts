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
  Cics_converse_groupContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ConverseOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_converse;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.FROMLENGTH, Severity.Error],
    [CICSLexer.FROMFLENGTH, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.TOLENGTH, Severity.Error],
    [CICSLexer.TOFLENGTH, Severity.Error],
    [CICSLexer.MAXLENGTH, Severity.Error],
    [CICSLexer.MAXFLENGTH, Severity.Error],
    [CICSLexer.NOTRUNCATE, Severity.Error],
    [CICSLexer.DEFRESP, Severity.Error],
    [CICSLexer.STRFIELD, Severity.Error],
    [CICSLexer.CTLCHAR, Severity.Error],
    [CICSLexer.LINEADDR, Severity.Error],
    [CICSLexer.LDC, Severity.Error],
    [CICSLexer.FMH, Severity.Error],
    [CICSLexer.LEAVEKB, Severity.Error],
    [CICSLexer.ASIS, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.ATTACHID, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.ERASE, Severity.Error],
    [CICSLexer.DEFAULT, Severity.Error],
    [CICSLexer.ALTERNATE, Severity.Error],
  ]);

  private static readonly DUPLICATE_RULES_CHECK = new Map<number, string>([
    [CICSParser.RULE_cics_converse_fromlength, "FROMLENGTH or FROMFLENGTH"],
    [CICSParser.RULE_cics_converse_tolength, "TOLENGTH or TOFLENGTH"],
    [CICSParser.RULE_cics_maxlength, "MAXLENGTH or MAXFLENGTH"],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ConverseOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS CONVERSE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_converse_group) {
      this.checkRule(ctx as unknown as Cics_converse_groupContext);
    }
  }

  private checkRule(ctx: Cics_converse_groupContext) {
    if (ctx.ASIS().length !== 0) {
      this.checkHasIllegalOptions(ctx.LEAVEKB(), "LEAVEKB");
    }

    if (ctx.cics_converse_fromlength().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    }

    if (ctx.CTLCHAR().length !== 0) {
      this.checkHasIllegalOptions(ctx.CONVID(), "CONVID");
      this.checkHasIllegalOptions(ctx.STRFIELD(), "STRFIELD");
    }

    if (ctx.cics_converse_erase().length !== 0) {
      this.checkHasIllegalOptions(ctx.STRFIELD(), "STRFIELD");
    }
    if (ctx.STRFIELD().length !== 0) {
      this.checkHasIllegalOptions(ctx.cics_converse_erase(), "ERASE");
    }
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(
        ctx.cics_converse_fromlength(),
        ctx,
        "FROMLENGTH",
      );
      this.checkHasMandatoryOptions(
        ctx.cics_converse_tolength(),
        ctx,
        "TOLENGTH OR TOFLENGTH",
      );
    }
    this.checkDuplicates(
      ctx,
      undefined,
      ConverseOptionsChecker.DUPLICATE_RULES_CHECK,
    );
  }
}
