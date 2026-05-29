import { Diagnostic, Severity } from "preprocessor-api";
import { Cics_read_bodyContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ReadOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_read;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.UNCOMMITTED, Severity.Warning],
    [CICSLexer.CONSISTENT, Severity.Warning],
    [CICSLexer.REPEATABLE, Severity.Warning],
    [CICSLexer.UPDATE, Severity.Warning],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.GENERIC, Severity.Warning],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.DEBKEY, Severity.Warning],
    [CICSLexer.DEBREC, Severity.Warning],
    [CICSLexer.RBA, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.XRBA, Severity.Warning],
    [CICSLexer.EQUAL, Severity.Warning],
    [CICSLexer.GTEQ, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ReadOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS READ rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_read_body)
      this.checkRule(ctx as unknown as Cics_read_bodyContext);
  }

  private checkRule(ctx: Cics_read_bodyContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );

    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");

    this.checkMutuallyExclusiveOptions(
      "UNCOMMITTED, CONSISTENT, REPEATABLE or UPDATE",
      ctx.UNCOMMITTED(),
      ctx.CONSISTENT(),
      ctx.REPEATABLE(),
      ctx.UPDATE(),
    );

    this.checkPrerequisiteIsMet(
      ctx.UPDATE(),
      ctx.TOKEN(),
      ctx,
      "TOKEN without UPDATE",
    );

    this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.INTO(), ctx.SET());

    this.checkPrerequisiteIsMet(
      ctx.KEYLENGTH(),
      ctx.GENERIC(),
      ctx,
      "GENERIC without KEYLENGTH",
    );

    this.checkMutuallyExclusiveOptions(
      "DEBKEY, DEBREC, RBA, RRN or XRBA",
      ctx.DEBKEY(),
      ctx.DEBREC(),
      ctx.RBA(),
      ctx.RRN(),
      ctx.XRBA(),
    );

    if (ctx.SYSID().length !== 0) {
      this.checkHasExactlyOneOption(
        "KEYLENGTH, RBA, XRBA or RRN",
        ctx,
        ctx.KEYLENGTH(),
        ctx.RBA(),
        ctx.XRBA(),
        ctx.RRN(),
      );
    }

    this.checkMutuallyExclusiveOptions("EQUAL or GTEQ", ctx.EQUAL(), ctx.GTEQ());

    this.checkDuplicates(ctx);
  }
}
