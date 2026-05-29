import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_spoolwrite_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SpoolWriteOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_spoolwrite;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.LINE, Severity.Warning],
    [CICSLexer.PAGE, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SpoolWriteOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SPOOLWRITE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_spoolwrite_options) {
      this.checkSpoolwrite(ctx as unknown as Cics_spoolwrite_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkSpoolwrite(ctx: Cics_spoolwrite_optionsContext) {
    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMutuallyExclusiveOptions("LINE or PAGE", ctx.LINE(), ctx.PAGE());
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
  }
}
