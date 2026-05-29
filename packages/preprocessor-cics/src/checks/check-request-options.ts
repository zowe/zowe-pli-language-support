import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_request_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class RequestOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_request;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.REQUEST, Severity.Error],
    [CICSLexer.ENCRYPTPTKT, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.ENCRYPTKEY, Severity.Error],
    [CICSLexer.ESMAPPNAME, Severity.Error],
    [CICSLexer.ESMREASON, Severity.Error],
    [CICSLexer.ESMRESP, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, RequestOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS REQUEST ENCRYPTPTKT rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_request_body) {
      this.checkRequestBody(ctx as unknown as Cics_request_bodyContext);
    }

    this.checkDuplicates(ctx);
  }

  private checkRequestBody(ctx: Cics_request_bodyContext) {
    if (ctx.ENCRYPTPTKT().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
      this.checkHasMandatoryOptions(ctx.ENCRYPTKEY(), ctx, "ENCRYPTKEY");
      this.checkHasMandatoryOptions(ctx.ESMAPPNAME(), ctx, "ESMAPPNAME");
    }

    if (ctx.PASSTICKET().length !== 0) {
      this.checkHasMandatoryOptions(ctx.ESMAPPNAME(), ctx, "ESMAPPNAME");
    }

    this.checkHasExactlyOneOption(
      "ENCRYPTPTKT or PASSTICKET",
      ctx,
      ctx.ENCRYPTPTKT(),
      ctx.PASSTICKET(),
    );
  }
}
