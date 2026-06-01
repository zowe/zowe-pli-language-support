import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_retrieve_reattachContext,
  Cics_retrieve_standardContext,
  Cics_retrieve_subeventContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class RetrieveOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_retrieve;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.RETRIEVE, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.RTRANSID, Severity.Error],
    [CICSLexer.RTERMID, Severity.Error],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.WAIT, Severity.Warning],
    [CICSLexer.REATTACH, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.EVENTTYPE, Severity.Error],
    [CICSLexer.SUBEVENT, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, RetrieveOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Retrieve rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_retrieve_standard:
        this.checkRetrieveStandard(
          ctx as unknown as Cics_retrieve_standardContext,
        );
        break;
      case CICSParser.RULE_cics_retrieve_reattach:
        this.checkRetrieveReattach(
          ctx as unknown as Cics_retrieve_reattachContext,
        );
        break;
      case CICSParser.RULE_cics_retrieve_subevent:
        this.checkRetrieveSubevent(
          ctx as unknown as Cics_retrieve_subeventContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkRetrieveStandard(ctx: Cics_retrieve_standardContext) {
    this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.INTO(), ctx.SET());
    if (this.noLengthOptionsEnabled() || ctx.SET().length !== 0)
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
  }

  private checkRetrieveReattach(ctx: Cics_retrieve_reattachContext) {
    this.checkHasMandatoryOptions(ctx.REATTACH(), ctx, "REATTACH");
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
  }

  private checkRetrieveSubevent(ctx: Cics_retrieve_subeventContext) {
    this.checkHasMandatoryOptions(ctx.SUBEVENT(), ctx, "SUBEVENT");
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
  }
}
