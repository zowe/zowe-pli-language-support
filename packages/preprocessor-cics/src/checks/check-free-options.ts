import { Diagnostic, Severity } from "preprocessor-api";
import { Cics_free_bodyContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class FreeOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_free;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CHILD, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, FreeOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS FREE rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    this.checkRule(ctx as unknown as Cics_free_bodyContext);
    this.checkDuplicates(ctx);
  }

  private checkRule(ctx: Cics_free_bodyContext) {
    this.checkMutuallyExclusiveOptions(
      "CONVID or SESSION",
      ctx.CONVID(),
      ctx.SESSION(),
    );
    if (ctx.CHILD().length !== 0) {
      this.checkHasIllegalOptions(ctx.CONVID(), "CONVID");
      this.checkHasIllegalOptions(ctx.SESSION(), "SESSION");
      this.checkHasIllegalOptions(ctx.STATE(), "STATE");
    }
  }
}
