import { Diagnostic, Severity } from "preprocessor-api";
import { Cics_route_bodyContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class RouteOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_route;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.INTERVAL, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.AFTER, Severity.Warning],
    [CICSLexer.AT, Severity.Warning],
    [CICSLexer.ERRTERM, Severity.Error],
    [CICSLexer.TITLE, Severity.Error],
    [CICSLexer.LIST, Severity.Error],
    [CICSLexer.OPCLASS, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.LDC, Severity.Error],
    [CICSLexer.NLEOM, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, RouteOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS ROUTE rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_route_body) {
      this.checkRule(ctx as unknown as Cics_route_bodyContext);
      this.checkDuplicates(ctx);
    }
  }

  private checkRule(ctx: Cics_route_bodyContext) {
    this.checkMutuallyExclusiveOptions(
      "INTERVAL, TIME, AFTER or AT",
      ctx.INTERVAL(),
      ctx.TIME(),
      ctx.AFTER(),
      ctx.AT(),
    );

    if (ctx.AFTER().length !== 0 || ctx.AT().length !== 0) {
      this.checkHasAtLeastOneOption(
        "HOURS, MINUTES or SECONDS",
        ctx,
        ctx.HOURS(),
        ctx.MINUTES(),
        ctx.SECONDS(),
      );
    }
  }
}
