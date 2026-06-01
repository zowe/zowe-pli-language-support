import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_spoolopen_inputContext,
  Cics_spoolopen_outputContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SpoolOpenOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_spoolopen;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.INPUT, Severity.Error],
    [CICSLexer.OUTPUT, Severity.Error],
    [CICSLexer.TOKEN, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.CLASS, Severity.Error],
    [CICSLexer.NOHANDLE, Severity.Warning],
    [CICSLexer.NODE, Severity.Error],
    [CICSLexer.OUTDESCR, Severity.Error],
    [CICSLexer.NOCC, Severity.Warning],
    [CICSLexer.ASA, Severity.Warning],
    [CICSLexer.MCC, Severity.Warning],
    [CICSLexer.PRINT, Severity.Warning],
    [CICSLexer.PUNCH, Severity.Warning],
    [CICSLexer.RECORDLENGTH, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SpoolOpenOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SpoolOpen rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_spoolopen_input:
        this.checkSpoolopenInput(ctx as unknown as Cics_spoolopen_inputContext);
        break;
      case CICSParser.RULE_cics_spoolopen_output:
        this.checkSpoolopenOutput(
          ctx as unknown as Cics_spoolopen_outputContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkSpoolopenInput(ctx: Cics_spoolopen_inputContext) {
    this.checkHasMandatoryOptions(ctx.INPUT(), ctx, "INPUT");
    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");
  }

  private checkSpoolopenOutput(ctx: Cics_spoolopen_outputContext) {
    this.checkHasMandatoryOptions(ctx.OUTPUT(), ctx, "OUTPUT");
    this.checkHasMandatoryOptions(ctx.TOKEN(), ctx, "TOKEN");
    this.checkHasMandatoryOptions(ctx.USERID(), ctx, "USERID");
    this.checkHasMandatoryOptions(ctx.NODE(), ctx, "NODE");
    this.checkHasMutuallyExclusiveOptions(
      "NOCC, ASA, or MCC",
      ctx.NOCC(),
      ctx.ASA(),
      ctx.MCC(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "PRINT or PUNCH",
      ctx.PRINT(),
      ctx.PUNCH(),
    );
    if (ctx.RECORDLENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.PRINT(), ctx, "PRINT");
    }
  }
}
