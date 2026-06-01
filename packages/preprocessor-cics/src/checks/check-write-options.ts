import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_write_fileContext,
  Cics_write_journalnameContext,
  Cics_write_operatorContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class WriteOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_write;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.WRITE, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.MASSINSERT, Severity.Warning],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.RIDFLD, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.RBA, Severity.Warning],
    [CICSLexer.RRN, Severity.Warning],
    [CICSLexer.XRBA, Severity.Warning],
    [CICSLexer.NOSUSPEND, Severity.Warning],
    [CICSLexer.JOURNALNAME, Severity.Error],
    [CICSLexer.JTYPEID, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.PREFIX, Severity.Error],
    [CICSLexer.PFXLENG, Severity.Error],
    [CICSLexer.WAIT, Severity.Warning],
    [CICSLexer.OPERATOR, Severity.Error],
    [CICSLexer.TEXT, Severity.Error],
    [CICSLexer.TEXTLENGTH, Severity.Error],
    [CICSLexer.ROUTECODES, Severity.Error],
    [CICSLexer.NUMROUTES, Severity.Error],
    [CICSLexer.CONSNAME, Severity.Error],
    [CICSLexer.EVENTUAL, Severity.Warning],
    [CICSLexer.ACTION, Severity.Error],
    [CICSLexer.CRITICAL, Severity.Warning],
    [CICSLexer.IMMEDIATE, Severity.Warning],
    [CICSLexer.REPLY, Severity.Error],
    [CICSLexer.MAXLENGTH, Severity.Error],
    [CICSLexer.REPLYLENGTH, Severity.Error],
    [CICSLexer.TIMEOUT, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WriteOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Write rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_write_file:
        this.checkWriteFile(ctx as unknown as Cics_write_fileContext);
        break;
      case CICSParser.RULE_cics_write_journalname:
        this.checkWriteJournalname(
          ctx as unknown as Cics_write_journalnameContext,
        );
        break;
      case CICSParser.RULE_cics_write_operator:
        this.checkWriteOperator(ctx as unknown as Cics_write_operatorContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkWriteFile(ctx: Cics_write_fileContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMandatoryOptions(ctx.RIDFLD(), ctx, "RIDFLD");
    if (ctx.SYSID().length !== 0) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
    this.checkHasMutuallyExclusiveOptions(
      "RBA or RRN or XRBA",
      ctx.RBA(),
      ctx.RRN(),
      ctx.XRBA(),
    );
  }

  private checkWriteJournalname(ctx: Cics_write_journalnameContext) {
    this.checkHasMandatoryOptions(ctx.JOURNALNAME(), ctx, "JOURNALNAME");
    this.checkHasMandatoryOptions(ctx.JTYPEID(), ctx, "JTYPEID");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkOptionalWithLength(
      ctx.PREFIX(),
      ctx.PFXLENG(),
      ctx,
      "PREFIX",
      "PFXLENG",
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.FLENGTH(), ctx, "FLENGTH");
    }
  }

  private checkWriteOperator(ctx: Cics_write_operatorContext) {
    this.checkHasMandatoryOptions(ctx.OPERATOR(), ctx, "OPERATOR");
    this.checkHasMandatoryOptions(ctx.TEXT(), ctx, "TEXT");
    if (ctx.NUMROUTES().length !== 0) {
      this.checkHasMandatoryOptions(ctx.ROUTECODES(), ctx, "ROUTECODES");
    }
    if (ctx.ROUTECODES().length !== 0) {
      this.checkHasMandatoryOptions(ctx.NUMROUTES(), ctx, "NUMROUTES");
    }
    this.checkHasMutuallyExclusiveOptions(
      "NUMROUTES or CONSNAME",
      ctx.NUMROUTES(),
      ctx.CONSNAME(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "ROUTECODES or CONSNAME",
      ctx.ROUTECODES(),
      ctx.CONSNAME(),
    );

    this.checkHasMutuallyExclusiveOptions(
      "EVENTUAL or ACTION or CRITICAL or IMMEDIATE or REPLY",
      ctx.EVENTUAL(),
      ctx.ACTION(),
      ctx.CRITICAL(),
      ctx.IMMEDIATE(),
      ctx.REPLY(),
    );
    if (ctx.TIMEOUT().length !== 0 || ctx.REPLYLENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.REPLY(), ctx, "REPLY");
    }
    if (ctx.REPLY().length !== 0) {
      this.checkHasMandatoryOptions(ctx.MAXLENGTH(), ctx, "MAXLENGTH");
    }
    if (ctx.MAXLENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.REPLY(), ctx, "REPLY");
    }
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.TEXTLENGTH(), ctx, "TEXTLENGTH");
    }
  }
}
