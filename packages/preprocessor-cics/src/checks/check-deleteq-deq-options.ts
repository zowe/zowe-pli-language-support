import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_deleteq_tdContext,
  Cics_deleteq_tsContext,
  Cics_deq_cmdsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class DeleteqDeqOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX_DELETEQ = CICSParser.RULE_cics_deleteq;
  public static readonly RULE_INDEX_DEQ = CICSParser.RULE_cics_deq;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.DELETEQ, Severity.Error],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.QNAME, Severity.Error],
    [CICSLexer.TD, Severity.Warning],
    [CICSLexer.TS, Severity.Warning],
    [CICSLexer.DEQ, Severity.Error],
    [CICSLexer.RESOURCE, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.MAXLIFETIME, Severity.Error],
    [CICSLexer.UOW, Severity.Warning],
    [CICSLexer.TASK, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DeleteqDeqOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS DELETEQ and DEQ rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_deleteq_td:
        this.checkDeleteqTd(ctx as unknown as Cics_deleteq_tdContext);
        break;
      case CICSParser.RULE_cics_deleteq_ts:
        this.checkDeleteqTs(ctx as unknown as Cics_deleteq_tsContext);
        break;
      case CICSParser.RULE_cics_deq_cmds:
        this.checkDeqCmds(ctx as unknown as Cics_deq_cmdsContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkDeleteqTd(ctx: Cics_deleteq_tdContext) {
    this.checkHasMandatoryOptions(ctx.QUEUE(), ctx, "QUEUE");
  }

  private checkDeleteqTs(ctx: Cics_deleteq_tsContext) {
    this.checkHasExactlyOneOption(
      "QUEUE or QNAME",
      ctx,
      ctx.cics_queue_qname(),
    );
  }

  private checkDeqCmds(ctx: Cics_deq_cmdsContext) {
    this.checkHasMandatoryOptions(ctx.RESOURCE(), ctx, "RESOURCE");
    this.checkHasMutuallyExclusiveOptions(
      "UOW or MAXLIFETIME or TASK",
      ctx.UOW(),
      ctx.MAXLIFETIME(),
      ctx.TASK(),
    );
  }
}
