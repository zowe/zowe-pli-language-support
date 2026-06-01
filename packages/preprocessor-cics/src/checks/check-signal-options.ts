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
  Cics_signal_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SignalOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_signal;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.FROMCHANNEL, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.FROMLENGTH, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SignalOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SIGNAL EVENT rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_signal_options) {
      this.checkSignalEvent(ctx as unknown as Cics_signal_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkSignalEvent(ctx: Cics_signal_optionsContext) {
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
    this.checkHasMutuallyExclusiveOptions(
      "FROMCHANNEL or FROM",
      ctx.FROMCHANNEL(),
      ctx.FROM(),
    );
    this.checkOptionalWithLength(
      ctx.FROM(),
      ctx.FROMLENGTH(),
      ctx,
      "FROM",
      "FROMLENGTH",
    );
  }
}
