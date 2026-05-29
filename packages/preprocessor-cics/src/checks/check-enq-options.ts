import { Diagnostic, Severity } from "preprocessor-api";
import { Cics_enq_optsContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class EnqOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_enq;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ENQ, Severity.Error],
    [CICSLexer.RESOURCE, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.UOW, Severity.Warning],
    [CICSLexer.MAXLIFETIME, Severity.Error],
    [CICSLexer.TASK, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, EnqOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS ENQ rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_enq_opts) {
      this.checkEnq(ctx as unknown as Cics_enq_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkEnq(ctx: Cics_enq_optsContext) {
    this.checkHasMandatoryOptions(ctx.RESOURCE(), ctx, "RESOURCE");
    this.checkHasMutuallyExclusiveOptions(
      "UOW or MAXLIFETIME or TASK",
      ctx.UOW(),
      ctx.MAXLIFETIME(),
      ctx.TASK(),
    );
  }
}
