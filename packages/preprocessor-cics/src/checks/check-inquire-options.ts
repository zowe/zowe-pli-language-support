import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_inquire_containerContext,
  Cics_inquire_processContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class InquireOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_inquire;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ABCODE, Severity.Error],
    [CICSLexer.ABPROGRAM, Severity.Error],
    [CICSLexer.ABSTIME, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACTIVITYID, Severity.Error],
    [CICSLexer.COMPOSITE, Severity.Error],
    [CICSLexer.COMPSTATUS, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.DATALENGTH, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.EVENTTYPE, Severity.Error],
    [CICSLexer.FIRESTATUS, Severity.Error],
    [CICSLexer.MODE, Severity.Error],
    [CICSLexer.PREDICATE, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.SUSPSTATUS, Severity.Error],
    [CICSLexer.TIMER, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, InquireOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Inquire rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_inquire_container: {
        const containerContext = ctx as unknown as Cics_inquire_containerContext;
        this.checkHasMutuallyExclusiveOptions(
          "ACTIVITYID and PROCESS",
          containerContext.ACTIVITYID(),
          containerContext.PROCESS(),
        );
        if (containerContext.PROCESS().length === 0)
          this.checkHasIllegalOptions(
            containerContext.PROCESSTYPE(),
            "PROCESSTYPE without PROCESS",
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_process: {
        const processContext = ctx as unknown as Cics_inquire_processContext;
        this.checkHasMandatoryOptions(
          processContext.PROCESSTYPE(),
          ctx,
          "PROCESSTYPE",
        );
        break;
      }
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }
}
