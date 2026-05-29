import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_update_counter_dcounterContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class UpdateOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_update;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.COUNTER, Severity.Error],
    [CICSLexer.DCOUNTER, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.VALUE, Severity.Error],
    [CICSLexer.COMPAREMIN, Severity.Error],
    [CICSLexer.COMPAREMAX, Severity.Error],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, UpdateOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Update rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_update_counter_dcounter) {
      this.checkUpdateCounterDcounter(
        ctx as unknown as Cics_update_counter_dcounterContext,
      );
    }
    this.checkDuplicates(ctx);
  }

  private checkUpdateCounterDcounter(
    ctx: Cics_update_counter_dcounterContext,
  ) {
    this.checkHasExactlyOneOption(
      "COUNTER or DCOUNTER",
      ctx,
      ctx.COUNTER(),
      ctx.DCOUNTER(),
    );
    this.checkHasMandatoryOptions(ctx.VALUE(), ctx, "VALUE");
  }
}
