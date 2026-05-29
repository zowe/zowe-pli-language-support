import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_acquire_terminal_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class AcquireTerminalOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_acquire_terminal;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.NOQUEUE, Severity.Warning],
    [CICSLexer.QALL, Severity.Warning],
    [CICSLexer.RELREQ, Severity.Warning],
    [CICSLexer.QNOTENAB, Severity.Warning],
    [CICSLexer.QSESSLIM, Severity.Warning],
    [CICSLexer.USERDATA, Severity.Error],
    [CICSLexer.USERDATALEN, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(
      errors,
      AcquireTerminalOptionsChecker.DUPLICATE_CHECK_OPTIONS,
      params,
    );
  }

  /**
   * Entrypoint to check CICS Acquire Terminal rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  checkOptions<E extends ParserRuleContext>(ctx: E) {
    if (ctx.ruleIndex == CICSParser.RULE_cics_acquire_terminal_body) {
      this.checkAcquireTerminal(
        ctx as unknown as Cics_acquire_terminal_bodyContext,
      );
    }
    this.checkDuplicates(ctx);
  }

  private checkAcquireTerminal(ctx: Cics_acquire_terminal_bodyContext) {
    this.checkHasMandatoryOptions(ctx.TERMINAL(), ctx, "TERMINAL");
    this.checkHasMutuallyExclusiveOptions(
      "NOQUEUE or QALL or QNOTENAB or QSESSLIM",
      ctx.NOQUEUE(),
      ctx.QALL(),
      ctx.QNOTENAB(),
      ctx.QSESSLIM(),
    );

    if (ctx.QALL().length === 0 && ctx.QSESSLIM().length === 0) {
      this.checkHasIllegalOptions(
        ctx.RELREQ(),
        "RELREQ without QALL or QSESSLIM",
      );
    }

    if (ctx.USERDATA().length === 0) {
      this.checkHasIllegalOptions(
        ctx.USERDATALEN(),
        "USERDATALEN without USERDATA",
      );
    }
  }
}
