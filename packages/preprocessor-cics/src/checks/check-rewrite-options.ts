import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_rewrite_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class RewriteOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_rewrite;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, RewriteOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS REWRITE rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_rewrite_body) {
      this.checkRule(ctx as unknown as Cics_rewrite_bodyContext);
      this.checkDuplicates(ctx);
    }
  }

  private checkRule(ctx: Cics_rewrite_bodyContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
  }
}
