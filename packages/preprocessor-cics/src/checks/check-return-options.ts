import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_return_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ReturnOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_return;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.COMMAREA, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.IMMEDIATE, Severity.Warning],
    [CICSLexer.INPUTMSG, Severity.Error],
    [CICSLexer.INPUTMSGLEN, Severity.Error],
    [CICSLexer.ENDACTIVITY, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ReturnOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS RETURN rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_return_body) {
      this.checkRule(ctx as unknown as Cics_return_bodyContext);
      this.checkDuplicates(ctx);
    }
  }

  private checkRule(ctx: Cics_return_bodyContext) {
    this.checkPrerequisiteIsMet(
      ctx.TRANSID(),
      ctx.COMMAREA(),
      ctx,
      "COMMAREA without TRANSID",
    );
    this.checkPrerequisiteIsMet(
      ctx.TRANSID(),
      ctx.CHANNEL(),
      ctx,
      "CHANNEL without TRANSID",
    );
    this.checkPrerequisiteIsMet(
      ctx.TRANSID(),
      ctx.IMMEDIATE(),
      ctx,
      "IMMEDIATE without TRANSID",
    );

    this.checkMutuallyExclusiveOptions(
      "COMMAREA or CHANNEL",
      ctx.COMMAREA(),
      ctx.CHANNEL(),
    );
    this.checkMutuallyExclusiveOptions(
      "TRANSID or ENDACTIVITY",
      ctx.TRANSID(),
      ctx.ENDACTIVITY(),
    );

    this.checkOptionalWithLength(
      ctx.COMMAREA(),
      ctx.LENGTH(),
      ctx,
      "COMMAREA",
      "LENGTH",
    );
    this.checkOptionalWithLength(
      ctx.INPUTMSG(),
      ctx.INPUTMSGLEN(),
      ctx,
      "INPUTMSG",
      "INPUTMSGLEN",
    );
  }
}
