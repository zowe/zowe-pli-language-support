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
  Cics_readnext_readprev_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class ReadNextReadPrevOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_readnext_readprev;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.READNEXT, Severity.Error],
    [CICSLexer.READPREV, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.UNCOMMITTED, Severity.Warning],
    [CICSLexer.CONSISTENT, Severity.Warning],
    [CICSLexer.REPEATABLE, Severity.Warning],
    [CICSLexer.UPDATE, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.RBA, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.XRBA, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(
      errors,
      ReadNextReadPrevOptionsChecker.DUPLICATE_CHECK_OPTIONS,
      params,
    );
  }

  /**
   * Entrypoint to check CICS ReadNext ReadPrev rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_readnext_readprev_body) {
      this.checkReadNextReadPrevBody(
        ctx as unknown as Cics_readnext_readprev_bodyContext,
      );
    }
    this.checkDuplicates(ctx);
  }

  private checkReadNextReadPrevBody(ctx: Cics_readnext_readprev_bodyContext) {
    this.checkHasMandatoryOptions(ctx.cics_file_name(), ctx, "FILE");
    const file = ctx
      .cics_file_name()
      .map((f) => f.FILE())
      .filter((n): n is TerminalNode => n != null);
    const dataset = ctx
      .cics_file_name()
      .map((f) => f.DATASET())
      .filter((n): n is TerminalNode => n != null);
    this.checkHasMutuallyExclusiveOptions("FILE or DATASET", file, dataset);

    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.INTO(), ctx.SET());
    this.checkHasMutuallyExclusiveOptions(
      "UNCOMMITTED or CONSISTENT or REPEATABLE or UPDATE",
      ctx.UNCOMMITTED(),
      ctx.CONSISTENT(),
      ctx.REPEATABLE(),
      ctx.UPDATE(),
    );

    if (ctx.UPDATE().length !== 0 && ctx.TOKEN().length === 0) {
      this.checkHasIllegalOptions(ctx.UPDATE(), "UPDATE without TOKEN");
    } else if (ctx.TOKEN().length !== 0 && ctx.UPDATE().length === 0) {
      this.checkHasIllegalOptions(ctx.TOKEN(), "TOKEN without UPDATE");
    }

    if (ctx.SYSID().length !== 0 && ctx.LENGTH().length === 0) {
      this.checkHasIllegalOptions(ctx.UPDATE(), "SYSID without LENGTH");
    }

    this.checkHasMutuallyExclusiveOptions(
      "RBA or RRN or XRBA",
      ctx.RBA(),
      ctx.RRN(),
      ctx.XRBA(),
    );
    if (ctx.SYSID().length !== 0)
      this.checkHasExactlyOneOption(
        "KEYLENGTH, RBA, XRBA or RRN",
        ctx,
        ctx.KEYLENGTH(),
        ctx.RBA(),
        ctx.XRBA(),
        ctx.RRN(),
      );
  }
}
