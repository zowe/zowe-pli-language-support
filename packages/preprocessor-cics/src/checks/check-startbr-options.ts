import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_startbr_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class StartbrOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_startbr;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.GENERIC, Severity.Warning],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.DEBKEY, Severity.Warning],
    [CICSLexer.DEBREC, Severity.Warning],
    [CICSLexer.RBA, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.XRBA, Severity.Warning],
    [CICSLexer.GTEQ, Severity.Warning],
    [CICSLexer.EQUAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, StartbrOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS STARTBR rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_startbr_options) {
      this.checkStartbr(ctx as unknown as Cics_startbr_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkStartbr(ctx: Cics_startbr_optionsContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );
    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    this.checkHasMutuallyExclusiveOptions(
      "DEBKEY, DEBREC, RBA, RRN, or XRBA",
      ctx.DEBKEY(),
      ctx.DEBREC(),
      ctx.RBA(),
      ctx.RRN(),
      ctx.XRBA(),
    );
    this.checkHasMutuallyExclusiveOptions("GTEQ or EQUAL", ctx.GTEQ(), ctx.EQUAL());
    if (ctx.GENERIC().length !== 0) {
      this.checkHasMandatoryOptions(ctx.KEYLENGTH(), ctx, "KEYLENGTH");
    }
    if (ctx.SYSID().length !== 0) {
      this.checkHasExactlyOneOption(
        "KEYLENGTH, RBA, RRN, or XRBA",
        ctx,
        ctx.KEYLENGTH(),
        ctx.RBA(),
        ctx.RRN(),
        ctx.XRBA(),
      );
    }
    this.checkHasMutuallyExclusiveOptions(
      "GTEQ or DEBKEY or RBA or DEBREC",
      ctx.GTEQ(),
      ctx.DEBKEY(),
      ctx.RBA(),
      ctx.DEBREC(),
    );
  }
}
