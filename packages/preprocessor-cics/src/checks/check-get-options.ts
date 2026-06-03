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
  Cics_getContext,
  Cics_get_container_btsContext,
  Cics_get_container_channelContext,
  Cics_get_counter_dcounterContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class GetOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_get;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.PROCESS, Severity.Warning],
    [CICSLexer.ACQPROCESS, Severity.Warning],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.NODATA, Severity.Warning],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.BYTEOFFSET, Severity.Error],
    [CICSLexer.INTOCCSID, Severity.Error],
    [CICSLexer.INTOCODEPAGE, Severity.Error],
    [CICSLexer.CCSID, Severity.Error],
    [CICSLexer.CONVERTST, Severity.Error],
    [CICSLexer.COUNTER, Severity.Error],
    [CICSLexer.DCOUNTER, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.VALUE, Severity.Error],
    [CICSLexer.INCREMENT, Severity.Error],
    [CICSLexer.COMPAREMIN, Severity.Error],
    [CICSLexer.COMPAREMAX, Severity.Error],
    [CICSLexer.REDUCE, Severity.Warning],
    [CICSLexer.WRAP, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, GetOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Get rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_get_container_bts:
        this.checkContainerBTS(ctx as unknown as Cics_get_container_btsContext);
        break;
      case CICSParser.RULE_cics_get_container_channel:
        this.checkContainerChannel(
          ctx as unknown as Cics_get_container_channelContext,
        );
        break;
      case CICSParser.RULE_cics_get_counter_dcounter:
        this.checkCounterDcounter(
          ctx as unknown as Cics_get_counter_dcounterContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkContainerBTS(ctx: Cics_get_container_btsContext) {
    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    this.checkHasMutuallyExclusiveOptions(
      "ACTIVITY or ACQACTIVITY or PROCESS or ACQPROCESS",
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
      ctx.PROCESS(),
      ctx.ACQPROCESS(),
    );
    this.checkHasExactlyOneOption(
      "INTO or SET or NODATA",
      ctx,
      ctx.INTO(),
      ctx.SET(),
      ctx.NODATA(),
    );
    if (ctx.SET().length !== 0 || ctx.NODATA().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
    }
  }

  private checkContainerChannel(ctx: Cics_get_container_channelContext) {
    const parentCtx = ctx.parent as unknown as Cics_getContext;
    this.checkHasIllegalOptions(
      parentCtx.GET64(),
      "GET64 is only available in Assembly",
    );

    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    this.checkHasExactlyOneOption(
      "INTO or SET or NODATA",
      ctx,
      ctx.INTO(),
      ctx.SET(),
      ctx.NODATA(),
    );
    if (
      ctx.BYTEOFFSET().length !== 0 ||
      ctx.SET().length !== 0 ||
      ctx.NODATA().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
    }
    this.checkHasMutuallyExclusiveOptions(
      "NODATA or BYTEOFFSET",
      ctx.NODATA(),
      ctx.BYTEOFFSET(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "INTOCCSID or INTOCODEPAGE or CONVERTST",
      ctx.INTOCCSID(),
      ctx.INTOCODEPAGE(),
      ctx.CONVERTST(),
    );
    if (ctx.CCSID().length !== 0) {
      this.checkHasMandatoryOptions(ctx.CONVERTST(), ctx, "CONVERTST");
    }
  }

  private checkCounterDcounter(ctx: Cics_get_counter_dcounterContext) {
    this.checkHasExactlyOneOption(
      "COUNTER or DCOUNTER",
      ctx,
      ctx.COUNTER(),
      ctx.DCOUNTER(),
    );
    this.checkHasMandatoryOptions(ctx.VALUE(), ctx, "VALUE");
    if (ctx.REDUCE().length !== 0) {
      this.checkHasMandatoryOptions(ctx.INCREMENT(), ctx, "INCREMENT");
    }
  }
}
