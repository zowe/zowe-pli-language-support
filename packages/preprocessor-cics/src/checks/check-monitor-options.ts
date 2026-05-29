import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_monitor_optionsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class MonitorOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_monitor;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.POINT, Severity.Error],
    [CICSLexer.DATA1, Severity.Error],
    [CICSLexer.DATA2, Severity.Error],
    [CICSLexer.ENTRYNAME, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, MonitorOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS MONITOR rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_monitor_options) {
      this.checkMonitor(ctx as unknown as Cics_monitor_optionsContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkMonitor(ctx: Cics_monitor_optionsContext) {
    this.checkHasMandatoryOptions(ctx.POINT(), ctx, "POINT");
  }
}
