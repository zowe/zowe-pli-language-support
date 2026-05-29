import { Diagnostic, Severity } from "preprocessor-api";
import { Cics_move_bodyContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class MoveOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_move;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.MOVE, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.AS, Severity.Error],
    [CICSLexer.FROMPROCESS, Severity.Warning],
    [CICSLexer.FROMACTIVITY, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.TOPROCESS, Severity.Warning],
    [CICSLexer.TOACTIVITY, Severity.Error],
    [CICSLexer.TOCHANNEL, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, MoveOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS MOVE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_move_body) {
      this.checkMoveOptions(ctx as unknown as Cics_move_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkMoveOptions(ctx: Cics_move_bodyContext) {
    this.checkHasMandatoryOptions(ctx.CONTAINER(), ctx, "CONTAINER");
    this.checkHasMandatoryOptions(ctx.AS(), ctx, "AS");
    this.checkHasMutuallyExclusiveOptions(
      "FROMPROCESS or FROMACTIVITY",
      ctx.FROMPROCESS(),
      ctx.FROMACTIVITY(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "TOPROCESS or TOACTIVITY",
      ctx.TOPROCESS(),
      ctx.TOACTIVITY(),
    );
    if (ctx.FROMPROCESS().length !== 0) {
      this.checkHasIllegalOptions(ctx.TOCHANNEL(), "TOCHANNEL with FROMPROCESS");
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL with FROMPROCESS");
    }
    if (ctx.TOPROCESS().length !== 0) {
      this.checkHasIllegalOptions(ctx.TOCHANNEL(), "TOCHANNEL with TOPROCESS");
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL with TOPROCESS");
    }
    if (ctx.FROMACTIVITY().length !== 0) {
      this.checkHasIllegalOptions(
        ctx.TOCHANNEL(),
        "TOCHANNEL with FROMACTIVITY",
      );
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL with FROMACTIVITY");
    }
    if (ctx.TOACTIVITY().length !== 0) {
      this.checkHasIllegalOptions(ctx.TOCHANNEL(), "TOCHANNEL with TOACTIVITY");
      this.checkHasIllegalOptions(ctx.CHANNEL(), "CHANNEL with TOACTIVITY");
    }
  }
}
