import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_run_defaultContext,
  Cics_run_transidContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class RunOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_run;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.RUN, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACQACTIVITY, Severity.Warning],
    [CICSLexer.ACQPROCESS, Severity.Warning],
    [CICSLexer.SYNCHRONOUS, Severity.Warning],
    [CICSLexer.ASYNCHRONOUS, Severity.Warning],
    [CICSLexer.FACILITYTOKN, Severity.Error],
    [CICSLexer.INPUTEVENT, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.CHILD, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, RunOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS RUN rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_run_default:
        this.checkDefaultRun(ctx as unknown as Cics_run_defaultContext);
        break;
      case CICSParser.RULE_cics_run_transid:
        this.checkTransidRun(ctx as unknown as Cics_run_transidContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkDefaultRun(ctx: Cics_run_defaultContext) {
    this.checkHasExactlyOneOption(
      "ACTIVITY or ACQACTIVITY or ACQPROCESS",
      ctx,
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
      ctx.ACQPROCESS(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYNCHRONOUS or ASYNCHRONOUS",
      ctx.SYNCHRONOUS(),
      ctx.ASYNCHRONOUS(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYNCHRONOUS or FACILITYTOKN",
      ctx.SYNCHRONOUS(),
      ctx.FACILITYTOKN(),
    );

    const requiredOptions: TerminalNode[] = [
      ...ctx.SYNCHRONOUS(),
      ...ctx.ASYNCHRONOUS(),
      ...ctx.FACILITYTOKN(),
    ];
    this.checkHasMandatoryOptions(
      requiredOptions,
      ctx,
      "SYNCHRONOUS or ASYNCHRONOUS or FACILITYTOKN",
    );
  }

  private checkTransidRun(ctx: Cics_run_transidContext) {
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");
    this.checkHasMandatoryOptions(ctx.CHILD(), ctx, "CHILD");
  }
}
