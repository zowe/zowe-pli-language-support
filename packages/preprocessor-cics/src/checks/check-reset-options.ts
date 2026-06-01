import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_reset_acqprocessContext,
  Cics_reset_activityContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ResetOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_reset;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACQPROCESS, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ResetOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS RESET rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_reset_acqprocess:
        this.checkResetAcqprocess(
          ctx as unknown as Cics_reset_acqprocessContext,
        );
        break;
      case CICSParser.RULE_cics_reset_activity:
        this.checkResetActivity(ctx as unknown as Cics_reset_activityContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkResetAcqprocess(ctx: Cics_reset_acqprocessContext) {
    this.checkHasMandatoryOptions(ctx.ACQPROCESS(), ctx, "ACQPROCESS");
  }

  private checkResetActivity(ctx: Cics_reset_activityContext) {
    this.checkHasMandatoryOptions(ctx.ACTIVITY(), ctx, "ACTIVITY");
  }
}
