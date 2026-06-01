import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_define_activityContext,
  Cics_define_composite_eventContext,
  Cics_define_counter_dcounterContext,
  Cics_define_input_eventContext,
  Cics_define_processContext,
  Cics_define_timerContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class DefineOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_define;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.DEFINE, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.ACTIVITYID, Severity.Error],
    [CICSLexer.COMPOSITE, Severity.Error],
    [CICSLexer.AND, Severity.Error],
    [CICSLexer.OR, Severity.Error],
    [CICSLexer.SUBEVENT1, Severity.Error],
    [CICSLexer.SUBEVENT2, Severity.Error],
    [CICSLexer.SUBEVENT3, Severity.Error],
    [CICSLexer.SUBEVENT4, Severity.Error],
    [CICSLexer.SUBEVENT5, Severity.Error],
    [CICSLexer.SUBEVENT6, Severity.Error],
    [CICSLexer.SUBEVENT7, Severity.Error],
    [CICSLexer.SUBEVENT8, Severity.Error],
    [CICSLexer.COUNTER, Severity.Error],
    [CICSLexer.DCOUNTER, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.VALUE, Severity.Error],
    [CICSLexer.MINIMUM, Severity.Error],
    [CICSLexer.MAXIMUM, Severity.Error],
    [CICSLexer.NOSUSPEND, Severity.Warning],
    [CICSLexer.INPUT, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.NOCHECK, Severity.Warning],
    [CICSLexer.TIMER, Severity.Error],
    [CICSLexer.DAYS, Severity.Error],
    [CICSLexer.HOURS, Severity.Error],
    [CICSLexer.MINUTES, Severity.Error],
    [CICSLexer.SECONDS, Severity.Error],
    [CICSLexer.YEAR, Severity.Error],
    [CICSLexer.MONTH, Severity.Error],
    [CICSLexer.DAYOFMONTH, Severity.Error],
    [CICSLexer.DAYOFYEAR, Severity.Error],
    [CICSLexer.AFTER, Severity.Error],
    [CICSLexer.AT, Severity.Error],
    [CICSLexer.ON, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DefineOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Define rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_define_activity:
        this.checkActivity(ctx as unknown as Cics_define_activityContext);
        break;
      case CICSParser.RULE_cics_define_composite_event:
        this.checkCompositeEvent(
          ctx as unknown as Cics_define_composite_eventContext,
        );
        break;
      case CICSParser.RULE_cics_define_counter_dcounter:
        this.checkCounter(
          ctx as unknown as Cics_define_counter_dcounterContext,
        );
        break;
      case CICSParser.RULE_cics_define_input_event:
        this.checkInputEvent(ctx as unknown as Cics_define_input_eventContext);
        break;
      case CICSParser.RULE_cics_define_process:
        this.checkDefineProcess(ctx as unknown as Cics_define_processContext);
        break;
      case CICSParser.RULE_cics_define_timer:
        this.checkDefineTimer(ctx as unknown as Cics_define_timerContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkActivity(ctx: Cics_define_activityContext) {
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");
  }

  private checkCompositeEvent(ctx: Cics_define_composite_eventContext) {
    this.checkHasMandatoryOptions(ctx.COMPOSITE(), ctx, "COMPOSITE");
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
    this.checkHasExactlyOneOption("AND or OR", ctx, ctx.AND(), ctx.OR());
  }

  private checkCounter(ctx: Cics_define_counter_dcounterContext) {
    this.checkHasExactlyOneOption(
      "COUNTER or DCOUNTER",
      ctx,
      ctx.COUNTER(),
      ctx.DCOUNTER(),
    );
    if (ctx.VALUE().length === 0)
      this.checkHasIllegalOptions(ctx.MINIMUM(), "MINIMUM");
  }

  private checkInputEvent(ctx: Cics_define_input_eventContext) {
    this.checkHasMandatoryOptions(ctx.INPUT(), ctx, "INPUT");
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
  }

  private checkDefineProcess(ctx: Cics_define_processContext) {
    this.checkHasMandatoryOptions(ctx.PROCESS(), ctx, "PROCESS");
    this.checkHasMandatoryOptions(ctx.PROCESSTYPE(), ctx, "PROCESSTYPE");
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");
  }

  private checkDefineTimer(ctx: Cics_define_timerContext) {
    if (ctx.AFTER().length === 0) {
      this.checkHasIllegalOptions(ctx.DAYS(), "DAYS");
      if (this.checkHasMandatoryOptions(ctx.AT(), ctx, "AT")) {
        // AT CASE
        if (
          ctx.HOURS().length + ctx.MINUTES().length + ctx.SECONDS().length ===
          0
        ) {
          this.checkHasMandatoryOptions(
            ctx.HOURS(),
            ctx,
            "HOURS or MINUTES or SECONDS",
          );
        }
        if (ctx.ON().length === 0) {
          // ON
          this.checkHasIllegalOptions(ctx.YEAR(), "YEAR without ON");
          this.checkHasIllegalOptions(ctx.MONTH(), "MONTH without ON");
          this.checkHasIllegalOptions(ctx.DAYOFYEAR(), "DAYOFYEAR without ON");
          this.checkHasIllegalOptions(
            ctx.DAYOFMONTH(),
            "DAYOFMONTH without ON",
          );
        } else if (ctx.YEAR().length === 0) {
          // YEAR
          this.checkHasIllegalOptions(ctx.MONTH(), "MONTH without YEAR");
          this.checkHasIllegalOptions(
            ctx.DAYOFYEAR(),
            "DAYOFYEAR without YEAR",
          );
          this.checkHasIllegalOptions(
            ctx.DAYOFMONTH(),
            "DAYOFMONTH without YEAR",
          );
        } else if (ctx.DAYOFYEAR().length !== 0) {
          // DAYOFYEAR
          this.checkHasIllegalOptions(ctx.MONTH(), "MONTH without DAYOFYEAR");
          this.checkHasIllegalOptions(
            ctx.DAYOFMONTH(),
            "DAYOFMONTH without DAYOFYEAR",
          );
        } else {
          // MONTH and DAYOFMONTH
          this.checkHasIllegalOptions(ctx.DAYOFYEAR(), "DAYOFYEAR with MONTH");
          this.checkHasMandatoryOptions(ctx.MONTH(), ctx, "MONTH");
          this.checkHasMandatoryOptions(ctx.DAYOFMONTH(), ctx, "DAYOFMONTH");
        }
      } else {
        // Neither AT nor AND
        this.checkHasMandatoryOptions(ctx.AFTER(), ctx, "AFTER");
      }
    } else if (
      ctx.AT().length === 0 &&
      this.checkHasMandatoryOptions(ctx.AFTER(), ctx, "AFTER")
    ) {
      // AFTER CASE
      this.checkHasIllegalOptions(ctx.ON(), "ON");
      this.checkHasIllegalOptions(ctx.YEAR(), "YEAR");
      this.checkHasIllegalOptions(ctx.MONTH(), "MONTH");
      this.checkHasIllegalOptions(ctx.DAYOFYEAR(), "DAYOFYEAR");
      this.checkHasIllegalOptions(ctx.DAYOFMONTH(), "DAYOFMONTH");
      if (
        ctx.DAYS().length +
          ctx.HOURS().length +
          ctx.MINUTES().length +
          ctx.SECONDS().length ===
        0
      ) {
        this.checkHasMandatoryOptions(
          ctx.DAYS(),
          ctx,
          "DAYS or HOURS or MINUTES or SECONDS",
        );
      }
    } else {
      // Both AT and AFTER
      this.checkHasIllegalOptions(ctx.AFTER(), "AFTER with AT");
      this.checkHasIllegalOptions(ctx.AT(), "AT with AFTER");
      this.checkHasIllegalOptions(ctx.ON(), "ON");
      this.checkHasIllegalOptions(ctx.YEAR(), "YEAR");
      this.checkHasIllegalOptions(ctx.MONTH(), "MONTH");
      this.checkHasIllegalOptions(ctx.DAYOFYEAR(), "DAYOFYEAR");
      this.checkHasIllegalOptions(ctx.DAYOFMONTH(), "DAYOFMONTH");
      this.checkHasIllegalOptions(ctx.DAYS(), "DAYS");
    }
  }
}
