import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_link_acqprocessContext,
  Cics_link_activityContext,
  Cics_link_programContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class LinkOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_link;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.LINK, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.COMMAREA, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.DATALENGTH, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.INPUTMSG, Severity.Error],
    [CICSLexer.INPUTMSGLEN, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.SYNCONRETURN, Severity.Warning],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.ACQPROCESS, Severity.Error],
    [CICSLexer.INPUTEVENT, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACQACTIVITY, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, LinkOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Link rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_link_program:
        this.checkLinkProgram(ctx as unknown as Cics_link_programContext);
        break;
      case CICSParser.RULE_cics_link_acqprocess:
        this.checkLinkAcqprocess(ctx as unknown as Cics_link_acqprocessContext);
        break;
      case CICSParser.RULE_cics_link_activity:
        this.checkLinkActivity(ctx as unknown as Cics_link_activityContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkLinkProgram(ctx: Cics_link_programContext) {
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
    this.checkHasMutuallyExclusiveOptions(
      "COMMAREA or CHANNEL",
      ctx.COMMAREA(),
      ctx.CHANNEL(),
    );
    if (ctx.DATALENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.COMMAREA(), ctx, "COMMAREA");
    }

    this.checkHasMutuallyExclusiveOptions(
      "INPUTMSG or SYSID",
      ctx.INPUTMSG(),
      ctx.SYSID(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "INPUTMSG or SYNCONRETURN",
      ctx.INPUTMSG(),
      ctx.SYNCONRETURN(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "INPUTMSG or TRANSID",
      ctx.INPUTMSG(),
      ctx.TRANSID(),
    );
    this.checkOptionalWithLength(
      ctx.INPUTMSG(),
      ctx.INPUTMSGLEN(),
      ctx,
      "INPUTMSG",
      "INPUTMSGLEN",
    );
    this.checkOptionalWithLength(
      ctx.COMMAREA(),
      ctx.LENGTH(),
      ctx,
      "COMMAREA",
      "LENGTH",
    );
  }

  private checkLinkAcqprocess(ctx: Cics_link_acqprocessContext) {
    this.checkHasMandatoryOptions(ctx.ACQPROCESS(), ctx, "ACQPROCESS");
  }

  private checkLinkActivity(ctx: Cics_link_activityContext) {
    this.checkHasExactlyOneOption(
      "ACTIVITY or ACQACTIVITY",
      ctx,
      ctx.ACTIVITY(),
      ctx.ACQACTIVITY(),
    );
  }
}
