import { Diagnostic, Severity } from "preprocessor-api";
import { CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class DiscardOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_discard;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ATOMSERVICE, Severity.Error],
    [CICSLexer.AUTINSTMODEL, Severity.Error],
    [CICSLexer.BUNDLE, Severity.Error],
    [CICSLexer.CONNECTION, Severity.Error],
    [CICSLexer.DB2CONN, Severity.Warning],
    [CICSLexer.DB2ENTRY, Severity.Error],
    [CICSLexer.DB2TRAN, Severity.Error],
    [CICSLexer.DOCTEMPLATE, Severity.Error],
    [CICSLexer.ENQMODEL, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.IPCONN, Severity.Error],
    [CICSLexer.JOURNALMODEL, Severity.Error],
    [CICSLexer.JOURNALNAME, Severity.Error],
    [CICSLexer.JVMSERVER, Severity.Error],
    [CICSLexer.LIBRARY, Severity.Error],
    [CICSLexer.MQCONN, Severity.Warning],
    [CICSLexer.MQMONITOR, Severity.Error],
    [CICSLexer.PARTNER, Severity.Error],
    [CICSLexer.PIPELINE, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROFILE, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.TDQUEUE, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.TRANCLASS, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Error],
    [CICSLexer.TSMODEL, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.WEBSERVICE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DiscardOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Discard rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    this.checkDuplicates(ctx);
  }
}
