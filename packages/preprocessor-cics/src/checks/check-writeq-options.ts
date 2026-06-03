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
  Cics_writeq_tdContext,
  Cics_writeq_tsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class WriteqOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_writeq;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.WRITEQ, Severity.Error],
    [CICSLexer.TD, Severity.Error],
    [CICSLexer.TS, Severity.Error],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.QNAME, Severity.Error],
    [CICSLexer.NUMITEMS, Severity.Error],
    [CICSLexer.ITEM, Severity.Error],
    [CICSLexer.REWRITE, Severity.Warning],
    [CICSLexer.AUXILIARY, Severity.Warning],
    [CICSLexer.MAIN, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WriteqOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Writeq rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_writeq_td:
        this.checkWriteqTd(ctx as unknown as Cics_writeq_tdContext);
        break;
      case CICSParser.RULE_cics_writeq_ts:
        this.checkWriteqTs(ctx as unknown as Cics_writeq_tsContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkWriteqTd(ctx: Cics_writeq_tdContext) {
    this.checkHasMandatoryOptions(ctx.TD(), ctx, "TD");
    this.checkHasMandatoryOptions(ctx.QUEUE(), ctx, "QUEUE");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
  }

  private checkWriteqTs(ctx: Cics_writeq_tsContext) {
    this.checkHasExactlyOneOption(
      "QUEUE or QNAME",
      ctx,
      ctx.QUEUE(),
      ctx.QNAME(),
    );
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMutuallyExclusiveOptions(
      "NUMITEMS or ITEM",
      ctx.NUMITEMS(),
      ctx.ITEM(),
    );
    if (ctx.REWRITE().length !== 0) {
      this.checkHasMandatoryOptions(ctx.ITEM(), ctx, "ITEM");
    }
    this.checkHasMutuallyExclusiveOptions(
      "AUXILIARY or MAIN",
      ctx.AUXILIARY(),
      ctx.MAIN(),
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }
}
