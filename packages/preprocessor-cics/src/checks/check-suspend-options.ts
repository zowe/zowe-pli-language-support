import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_suspend_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SuspendOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_suspend;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.ACQPROCESS, Severity.Warning],
    [CICSLexer.ACTIVITY, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SuspendOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SUSPEND rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_suspend_body) {
      this.checkSuspend(ctx as unknown as Cics_suspend_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkSuspend(ctx: Cics_suspend_bodyContext) {
    this.checkHasMutuallyExclusiveOptions(
      "ACQACTIVITY or ACQPROCESS or ACTIVITY",
      ctx.ACQACTIVITY(),
      ctx.ACQPROCESS(),
      ctx.ACTIVITY(),
    );
  }
}
