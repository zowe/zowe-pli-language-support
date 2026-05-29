import { Diagnostic, Severity } from "preprocessor-api";
import { CICSLexer } from "../generated/CICSLexer";
import { Cics_address_setContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { ParserRuleContext } from "antlr4ng";

export class AddressOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_address;

  private static readonly DUPLICATE_CHECK_OPTIONS: Map<number, Severity> =
    new Map([
      [CICSLexer.ADDRESS, Severity.Error],
      [CICSLexer.ACEE, Severity.Error],
      [CICSLexer.COMMAREA, Severity.Error],
      [CICSLexer.CWA, Severity.Error],
      [CICSLexer.EIB, Severity.Error],
      [CICSLexer.TCTUA, Severity.Error],
      [CICSLexer.TWA, Severity.Error],
      [CICSLexer.SET, Severity.Error],
      [CICSLexer.USING, Severity.Error],
    ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, AddressOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Address rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  checkOptions<E extends ParserRuleContext>(ctx: E) {
    if (ctx.ruleIndex == CICSParser.RULE_cics_address_set) {
      this.checkAddressSet(ctx as unknown as Cics_address_setContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkAddressSet(ctx: Cics_address_setContext) {
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasMandatoryOptions(ctx.USING(), ctx, "USING");
  }
}
