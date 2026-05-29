import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_spoolclose_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SpoolcloseOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_spoolclose;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.KEEP, Severity.Warning],
    [CICSLexer.DELETE, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SpoolcloseOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SPOOLCLOSE TOKEN rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_spoolclose_options) {
      this.checkSpoolcloseToken(
        ctx as unknown as Cics_spoolclose_optionsContext,
      );
    }
    this.checkDuplicates(ctx);
  }

  private checkSpoolcloseToken(ctx: Cics_spoolclose_optionsContext) {
    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMutuallyExclusiveOptions(
      "KEEP or DELETE",
      ctx.KEEP(),
      ctx.DELETE(),
    );
  }
}
