import { Diagnostic, Severity } from "preprocessor-api";
import { Cics_xctl_bodyContext, CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class XctlOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_xctl;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.COMMAREA, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.INPUTMSG, Severity.Error],
    [CICSLexer.INPUTMSGLEN, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, XctlOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS XCTL rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_xctl_body) {
      this.checkXctl(ctx as unknown as Cics_xctl_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkXctl(ctx: Cics_xctl_bodyContext) {
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
    this.checkHasMutuallyExclusiveOptions(
      "COMMAREA or CHANNEL",
      ctx.COMMAREA(),
      ctx.CHANNEL(),
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
