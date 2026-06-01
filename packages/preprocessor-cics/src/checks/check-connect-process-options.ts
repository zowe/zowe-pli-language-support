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
  Cics_connect_processContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ConnectProcessOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_connect;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CONNECT, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.PROCNAME, Severity.Error],
    [CICSLexer.PROCLENGTH, Severity.Error],
    [CICSLexer.PARTNER, Severity.Error],
    [CICSLexer.PIPLIST, Severity.Error],
    [CICSLexer.PIPLENGTH, Severity.Error],
    [CICSLexer.SYNCLEVEL, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ConnectProcessOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Connect Process rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_connect_process) {
      this.checkConnectProcessOptions(
        ctx as unknown as Cics_connect_processContext,
      );
    }
    this.checkDuplicates(ctx);
  }

  private checkConnectProcessOptions(ctx: Cics_connect_processContext) {
    this.checkHasExactlyOneOption(
      "CONVID or SESSION",
      ctx,
      ctx.CONVID(),
      ctx.SESSION(),
    );

    if (ctx.CONVID().length !== 0 || ctx.SESSION().length !== 0)
      this.checkHasExactlyOneOption(
        "PROCNAME or PARTNER",
        ctx,
        ctx.PROCNAME(),
        ctx.PARTNER(),
      );

    if (ctx.SESSION().length !== 0) {
      this.checkHasIllegalOptions(ctx.PARTNER(), "PARTNER");
      this.checkHasMandatoryOptions(ctx.PROCNAME(), ctx, "PROCNAME");
    }
    this.checkHasMandatoryOptions(ctx.SYNCLEVEL(), ctx, "SYNCLEVEL");
    this.checkOptionalWithLength(
      ctx.PROCNAME(),
      ctx.PROCLENGTH(),
      ctx,
      "PROCNAME",
      "PROCLENGTH",
    );
    this.checkOptionalWithLength(
      ctx.PIPLIST(),
      ctx.PIPLENGTH(),
      ctx,
      "PIPLIST",
      "PIPLENGTH",
    );
  }
}
