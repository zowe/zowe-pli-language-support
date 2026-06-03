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
  Cics_put_containerContext,
  Cics_put_container_btsContext,
  Cics_put_container_channelContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class PutContainerOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_put_container;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.DATATYPE, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.FROMCCSID, Severity.Error],
    [CICSLexer.FROMCODEPAGE, Severity.Error],
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.ACQPROCESS, Severity.Warning],
    [CICSLexer.APPEND, Severity.Warning],
    [CICSLexer.BIT, Severity.Warning],
    [CICSLexer.CHAR, Severity.Warning],
    [CICSLexer.PREPEND, Severity.Warning],
    [CICSLexer.PROCESS, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, PutContainerOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS PUT CONTAINER rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    const mainCtx = ctx.parent as unknown as Cics_put_containerContext;
    if (mainCtx.ruleIndex === PutContainerOptionsChecker.RULE_INDEX)
      this.checkHasIllegalOptions(
        mainCtx.PUT64(),
        "PUT64 is only available in Assembly",
      );

    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_put_container_bts:
        this.checkBTS(ctx as unknown as Cics_put_container_btsContext);
        break;
      case CICSParser.RULE_cics_put_container_channel:
        this.checkChannel(ctx as unknown as Cics_put_container_channelContext);
        break;
      default:
        break;
    }

    this.checkDuplicates(ctx);
  }

  private checkBTS(ctx: Cics_put_container_btsContext) {
    this.checkMutuallyExclusiveOptions(
      "ACTIVITY, ACQACTIVITY, PROCESS or ACQPROCESS",
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
      ctx.PROCESS(),
      ctx.ACQPROCESS(),
    );
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
  }

  private checkChannel(ctx: Cics_put_container_channelContext) {
    this.checkMutuallyExclusiveOptions(
      "BIT, DATATYPE or CHAR",
      ctx.BIT(),
      ctx.DATATYPE(),
      ctx.CHAR(),
    );

    this.checkMutuallyExclusiveOptions(
      "FROMCCSID or FROMCODEPAGE",
      ctx.FROMCCSID(),
      ctx.FROMCODEPAGE(),
    );
    this.checkMutuallyExclusiveOptions(
      "APPEND or PREPEND",
      ctx.APPEND(),
      ctx.PREPEND(),
    );

    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
  }
}
