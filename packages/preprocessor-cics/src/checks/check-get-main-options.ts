import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_getmain_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class GetMainOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_getmain;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.BELOW, Severity.Warning],
    [CICSLexer.INITIMG, Severity.Error],
    [CICSLexer.EXECUTABLE, Severity.Warning],
    [CICSLexer.SHARED, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
    [CICSLexer.USERDATAKEY, Severity.Warning],
    [CICSLexer.CICSDATAKEY, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, GetMainOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS GETMAIN rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_getmain_body) {
      this.checkGetMain(ctx as unknown as Cics_getmain_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkGetMain(ctx: Cics_getmain_bodyContext) {
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasExactlyOneOption(
      "FLENGTH or LENGTH",
      ctx,
      ctx.FLENGTH(),
      ctx.LENGTH(),
    );
    if (ctx.FLENGTH().length === 0)
      this.checkHasIllegalOptions(ctx.BELOW(), "BELOW without FLENGTH");
    this.checkHasMutuallyExclusiveOptions(
      "USERDATAKEY or CICSDATAKEY",
      ctx.USERDATAKEY(),
      ctx.CICSDATAKEY(),
    );
  }
}
