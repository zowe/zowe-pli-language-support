import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_disable_programContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class DisableProgramOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_disable;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.ENTRYNAME, Severity.Error],
    [CICSLexer.EXIT, Severity.Error],
    [CICSLexer.EXITALL, Severity.Warning],
    [CICSLexer.FORMATEDF, Severity.Warning],
    [CICSLexer.PURGEABLE, Severity.Warning],
    [CICSLexer.SHUTDOWN, Severity.Warning],
    [CICSLexer.SPI, Severity.Warning],
    [CICSLexer.STOP, Severity.Warning],
    [CICSLexer.TASKSTART, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DisableProgramOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS DISABLE PROGRAM rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_disable_program) {
      this.checkDisableProgram(ctx as unknown as Cics_disable_programContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkDisableProgram(ctx: Cics_disable_programContext) {
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
    this.checkHasAtLeastOneOption(
      "EXIT or EXITALL or FORMATEDF or PURGEABLE or SHUTDOWN or SPI or STOP or TASKSTART",
      ctx,
      ctx.EXIT(),
      ctx.EXITALL(),
      ctx.FORMATEDF(),
      ctx.PURGEABLE(),
      ctx.SHUTDOWN(),
      ctx.SPI(),
      ctx.STOP(),
      ctx.TASKSTART(),
    );
    if (ctx.EXIT() != null) {
      this.checkHasMutuallyExclusiveOptions(
        "EXIT or EXITALL",
        ctx.EXIT(),
        ctx.EXITALL(),
      );
      this.checkHasMutuallyExclusiveOptions(
        "EXIT or FORMATEDF",
        ctx.EXIT(),
        ctx.FORMATEDF(),
      );
      this.checkHasMutuallyExclusiveOptions(
        "EXIT or PURGEABLE",
        ctx.EXIT(),
        ctx.PURGEABLE(),
      );
      this.checkHasMutuallyExclusiveOptions(
        "EXIT or SHUTDOWN",
        ctx.EXIT(),
        ctx.SHUTDOWN(),
      );
      this.checkHasMutuallyExclusiveOptions("EXIT or SPI", ctx.EXIT(), ctx.SPI());
      this.checkHasMutuallyExclusiveOptions(
        "EXIT or STOP",
        ctx.EXIT(),
        ctx.STOP(),
      );
      this.checkHasMutuallyExclusiveOptions(
        "EXIT or TASKSTART",
        ctx.EXIT(),
        ctx.TASKSTART(),
      );
    }
  }
}
