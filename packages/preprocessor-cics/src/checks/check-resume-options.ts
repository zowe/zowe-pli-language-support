import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_resume_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ResumeOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_resume;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.ACQPROCESS, Severity.Warning],
    [CICSLexer.ACTIVITY, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ResumeOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS RESUME rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_resume_body) {
      this.checkBody(ctx as unknown as Cics_resume_bodyContext);
      this.checkDuplicates(ctx);
    }
  }

  private checkBody(ctx: Cics_resume_bodyContext) {
    this.checkHasExactlyOneOption(
      "ACQACTIVITY, ACQPROCESS or ACTIVITY",
      ctx,
      ctx.ACQACTIVITY(),
      ctx.ACQPROCESS(),
      ctx.ACTIVITY(),
    );
  }
}
