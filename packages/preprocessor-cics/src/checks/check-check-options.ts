import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_check_activityContext,
  Cics_check_timerContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class CheckOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_check;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CHECK, Severity.Error],
    [CICSLexer.ACQPROCESS, Severity.Warning],
    [CICSLexer.COMPSTATUS, Severity.Warning],
    [CICSLexer.ABCODE, Severity.Warning],
    [CICSLexer.ABPROGRAM, Severity.Warning],
    [CICSLexer.MODE, Severity.Warning],
    [CICSLexer.SUSPSTATUS, Severity.Warning],
    [CICSLexer.ACTIVITY, Severity.Warning],
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.TIMER, Severity.Warning],
    [CICSLexer.STATUS, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, CheckOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Check rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_check_activity)
      this.checkActivity(ctx as unknown as Cics_check_activityContext);
    else if (ctx.ruleIndex === CICSParser.RULE_cics_check_timer)
      this.checkTimer(ctx as unknown as Cics_check_timerContext);

    this.checkDuplicates(ctx);
  }

  private checkActivity(ctx: Cics_check_activityContext) {
    this.checkHasExactlyOneOption(
      "ACTIVITY or ACQACTIVITY or ACQPROCESS",
      ctx,
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
      ctx.ACQPROCESS(),
    );
    this.checkHasMandatoryOptions(ctx.COMPSTATUS(), ctx, "COMPSTATUS");
  }

  private checkTimer(ctx: Cics_check_timerContext) {
    this.checkHasMandatoryOptions(ctx.STATUS(), ctx, "STATUS");
    this.checkHasMandatoryOptions(ctx.TIMER(), ctx, "TIMER");
  }
}
