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
  Cics_formattime_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class FormatTimeOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_formattime;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FORMATTIME, Severity.Error],
    [CICSLexer.ABSTIME, Severity.Error],
    [CICSLexer.DATE, Severity.Error],
    [CICSLexer.FULLDATE, Severity.Error],
    [CICSLexer.DATEFORM, Severity.Error],
    [CICSLexer.DATESEP, Severity.Warning],
    [CICSLexer.DATESTRING, Severity.Error],
    [CICSLexer.STRINGZONE, Severity.Error],
    [CICSLexer.DAYCOUNT, Severity.Error],
    [CICSLexer.DAYOFWEEK, Severity.Error],
    [CICSLexer.DAYOFMONTH, Severity.Error],
    [CICSLexer.DDMMYY, Severity.Error],
    [CICSLexer.DDMMYYYY, Severity.Error],
    [CICSLexer.MILLISECONDS, Severity.Error],
    [CICSLexer.MMDDYY, Severity.Error],
    [CICSLexer.MMDDYYYY, Severity.Error],
    [CICSLexer.MONTHOFYEAR, Severity.Error],
    [CICSLexer.STRINGFORMAT, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.TIMESEP, Severity.Warning],
    [CICSLexer.YEAR, Severity.Error],
    [CICSLexer.YYDDD, Severity.Error],
    [CICSLexer.YYDDMM, Severity.Error],
    [CICSLexer.YYMMDD, Severity.Error],
    [CICSLexer.YYYYDDD, Severity.Error],
    [CICSLexer.YYYYDDMM, Severity.Error],
    [CICSLexer.YYYYMMDD, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, FormatTimeOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS FORMATTIME rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_formattime_opts) {
      this.checkOpts(ctx as unknown as Cics_formattime_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkOpts(ctx: Cics_formattime_optsContext) {
    this.checkHasMandatoryOptions(ctx.ABSTIME(), ctx, "ABSTIME");

    if (ctx.STRINGZONE().length !== 0)
      this.checkHasMandatoryOptions(ctx.DATESTRING(), ctx, "DATESTRING");
    if (ctx.TIMESEP().length !== 0)
      this.checkHasMandatoryOptions(ctx.TIME(), ctx, "TIME");
  }
}
