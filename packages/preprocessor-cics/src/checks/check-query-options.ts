import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_query_channelContext,
  Cics_query_counterContext,
  Cics_query_securityContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class QueryOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_query;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.CONTAINERCNT, Severity.Error],
    [CICSLexer.RETCODE, Severity.Error],
    [CICSLexer.COUNTER, Severity.Error],
    [CICSLexer.DCOUNTER, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.VALUE, Severity.Error],
    [CICSLexer.MINIMUM, Severity.Error],
    [CICSLexer.MAXIMUM, Severity.Error],
    [CICSLexer.SECURITY, Severity.Warning],
    [CICSLexer.RESTYPE, Severity.Error],
    [CICSLexer.RESCLASS, Severity.Error],
    [CICSLexer.RESIDLENGTH, Severity.Error],
    [CICSLexer.RESID, Severity.Error],
    [CICSLexer.LOGMESSAGE, Severity.Error],
    [CICSLexer.READ, Severity.Error],
    [CICSLexer.UPDATE, Severity.Error],
    [CICSLexer.CONTROL, Severity.Error],
    [CICSLexer.ALTER, Severity.Error],
    [CICSLexer.NOSUSPEND, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, QueryOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS QUERY rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_query_channel:
        this.checkQueryChannel(ctx as unknown as Cics_query_channelContext);
        break;
      case CICSParser.RULE_cics_query_counter:
        this.checkQueryCounter(ctx as unknown as Cics_query_counterContext);
        break;
      case CICSParser.RULE_cics_query_security:
        this.checkQuerySecurity(ctx as unknown as Cics_query_securityContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkQueryChannel(ctx: Cics_query_channelContext) {
    this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
  }

  private checkQueryCounter(ctx: Cics_query_counterContext) {
    this.checkHasExactlyOneOption(
      "COUNTER or DCOUNTER",
      ctx,
      ctx.cics_counter_dcounter(),
    );
  }

  private checkQuerySecurity(ctx: Cics_query_securityContext) {
    this.checkHasMandatoryOptions(ctx.SECURITY(), ctx, "SECURITY");
    this.checkHasExactlyOneOption(
      "RESTYPE or RESCLASS",
      ctx,
      ctx.RESTYPE(),
      ctx.RESCLASS(),
    );
    if (ctx.RESCLASS().length !== 0) {
      this.checkHasMandatoryOptions(ctx.RESIDLENGTH(), ctx, "RESIDLENGTH");
    }
    if (ctx.RESIDLENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.RESCLASS(), ctx, "RESCLASS");
    }
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
  }
}
