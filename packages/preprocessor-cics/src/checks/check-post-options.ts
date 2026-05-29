import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_post_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class PostOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_post;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.INTERVAL, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.AFTER, Severity.Warning],
    [CICSLexer.AT, Severity.Warning],
    [CICSLexer.HOURS, Severity.Error],
    [CICSLexer.MINUTES, Severity.Error],
    [CICSLexer.SECONDS, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, PostOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS POST rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_post_options) {
      this.checkPost(ctx as unknown as Cics_post_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkPost(ctx: Cics_post_optionsContext) {
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasMutuallyExclusiveOptions(
      "INTERVAL or TIME or AFTER or AT",
      ctx.INTERVAL(),
      ctx.TIME(),
      ctx.AFTER(),
      ctx.AT(),
    );
    if (ctx.AFTER().length !== 0 || ctx.AT().length !== 0) {
      if (
        ctx.HOURS().length === 0 &&
        ctx.MINUTES().length === 0 &&
        ctx.SECONDS().length === 0
      ) {
        this.checkHasMandatoryOptions(
          ctx.HOURS(),
          ctx,
          "HOURS or MINUTES or SECONDS",
        );
      }
    }
    if (
      ctx.HOURS().length !== 0 ||
      ctx.MINUTES().length !== 0 ||
      ctx.SECONDS().length !== 0
    ) {
      this.checkHasExactlyOneOption("AFTER or AT", ctx, ctx.AFTER(), ctx.AT());
    }
  }
}
