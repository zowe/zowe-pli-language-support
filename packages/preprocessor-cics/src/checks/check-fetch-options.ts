import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_fetch_any_childContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class FetchOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_fetch;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ANY, Severity.Error],
    [CICSLexer.CHILD, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.COMPSTATUS, Severity.Error],
    [CICSLexer.ABCODE, Severity.Error],
    [CICSLexer.NOSUSPEND, Severity.Warning],
    [CICSLexer.TIMEOUT, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, FetchOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Fetch System Command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_fetch_any_child) {
      this.checkFetchAnyChild(ctx as unknown as Cics_fetch_any_childContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkFetchAnyChild(ctx: Cics_fetch_any_childContext) {
    this.checkHasExactlyOneOption("ANY or CHILD", ctx, ctx.ANY(), ctx.CHILD());
    this.checkHasMandatoryOptions(ctx.COMPSTATUS(), ctx, "COMPSTATUS");
    this.checkHasMutuallyExclusiveOptions(
      "NOSUSPEND or TIMEOUT",
      ctx.NOSUSPEND(),
      ctx.TIMEOUT(),
    );
  }
}
