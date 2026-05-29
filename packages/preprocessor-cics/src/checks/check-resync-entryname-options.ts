import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_resync_entryname_optsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ResyncEntrynameOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_resync_entryname;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ENTRYNAME, Severity.Error],
    [CICSLexer.QUALIFIER, Severity.Error],
    [CICSLexer.IDLIST, Severity.Error],
    [CICSLexer.IDLISTLENGTH, Severity.Error],
    [CICSLexer.PARTIAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(
      errors,
      ResyncEntrynameOptionsChecker.DUPLICATE_CHECK_OPTIONS,
      params,
    );
  }

  /**
   * Entrypoint to check CICS RESYNC ENTRYNAME System Command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_resync_entryname_opts) {
      this.checkOpts(ctx as unknown as Cics_resync_entryname_optsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkOpts(ctx: Cics_resync_entryname_optsContext) {
    this.checkHasMandatoryOptions(ctx.ENTRYNAME(), ctx, "ENTRYNAME");
    this.checkOptionalWithLength(
      ctx.IDLIST(),
      ctx.IDLISTLENGTH(),
      ctx,
      "IDLIST",
      "IDLISTLENGTH",
    );
  }
}
