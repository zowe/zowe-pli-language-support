import { Diagnostic, Severity } from "preprocessor-api";
import {
  Ciss_add_event_subeventContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class AddSubeventOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_add;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ADD, Severity.Error],
    [CICSLexer.SUBEVENT, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, AddSubeventOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Add rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_ciss_add_event_subevent)
      this.checkAddEventSubEvent(
        ctx as unknown as Ciss_add_event_subeventContext,
      );

    this.checkDuplicates(ctx);
  }

  private checkAddEventSubEvent(ctx: Ciss_add_event_subeventContext) {
    this.checkHasMandatoryOptions(ctx.SUBEVENT(), ctx, "SUBEVENT");
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
  }
}
