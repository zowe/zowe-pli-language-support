import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_wsaepr_bodyContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class WSAEPROptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_wsaepr;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.WSAEPR, Severity.Error],
    [CICSLexer.CREATE, Severity.Error],
    [CICSLexer.EPRINTO, Severity.Error],
    [CICSLexer.EPRSET, Severity.Error],
    [CICSLexer.EPRLENGTH, Severity.Error],
    [CICSLexer.ADDRESS, Severity.Error],
    [CICSLexer.REFPARMS, Severity.Error],
    [CICSLexer.REFPARMSLEN, Severity.Error],
    [CICSLexer.METADATA, Severity.Error],
    [CICSLexer.METADATALEN, Severity.Error],
    [CICSLexer.FROMCCSID, Severity.Error],
    [CICSLexer.FROMCODEPAGE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WSAEPROptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS WSAEPR rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_wsaepr_body) {
      this.checkWSAEPR(ctx as unknown as Cics_wsaepr_bodyContext);
    }
    this.checkDuplicates(ctx);
  }

  private checkWSAEPR(ctx: Cics_wsaepr_bodyContext) {
    this.checkHasMandatoryOptions(ctx.CREATE(), ctx, "CREATE");
    this.checkHasExactlyOneOption(
      "EPRINTO or EPRSET",
      ctx,
      ctx.EPRINTO(),
      ctx.EPRSET(),
    );
    this.checkHasMandatoryOptions(ctx.EPRLENGTH(), ctx, "EPRLENGTH");

    const options: TerminalNode[] = [
      ...ctx.ADDRESS(),
      ...ctx.REFPARMS(),
      ...ctx.METADATA(),
    ];
    this.checkHasMandatoryOptions(options, ctx, "ADDRESS or REFPARMS or METADATA");

    this.checkHasMutuallyExclusiveOptions(
      "FROMCCSID or FROMCODEPAGE",
      ctx.FROMCCSID(),
      ctx.FROMCODEPAGE(),
    );
    this.checkOptionalWithLength(
      ctx.REFPARMS(),
      ctx.REFPARMSLEN(),
      ctx,
      "REFPARMS",
      "REFPARMSLEN",
    );
    this.checkOptionalWithLength(
      ctx.METADATA(),
      ctx.METADATALEN(),
      ctx,
      "METADATA",
      "METADATALEN",
    );
  }
}
