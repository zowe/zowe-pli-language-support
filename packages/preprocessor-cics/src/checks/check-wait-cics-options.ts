import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_waitcics_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class WaitCicsOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_waitcics;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.WAITCICS, Severity.Error],
    [CICSLexer.ECBLIST, Severity.Error],
    [CICSLexer.NUMEVENTS, Severity.Error],
    [CICSLexer.PURGEABILITY, Severity.Error],
    [CICSLexer.PURGEABLE, Severity.Error],
    [CICSLexer.NOTPURGEABLE, Severity.Error],
    [CICSLexer.NAME, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WaitCicsOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS WAITCICS rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_waitcics_body) {
      this.checkWaitCics(ctx as unknown as Cics_waitcics_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkWaitCics(ctx: Cics_waitcics_bodyContext) {
    this.checkHasMandatoryOptions(ctx.ECBLIST(), ctx, "ECBLIST");
    this.checkHasMandatoryOptions(ctx.NUMEVENTS(), ctx, "NUMEVENTS");
    this.checkHasMutuallyExclusiveOptions(
      "PURGEABLE or NOTPURGEABLE or PURGEABILITY",
      ctx.PURGEABLE(),
      ctx.NOTPURGEABLE(),
      ctx.PURGEABILITY(),
    );
  }
}
