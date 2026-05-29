import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_soapfault_addContext,
  Cics_soapfault_createContext,
  Cics_soapfault_deleteContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class SoapfaultOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_soapfault;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.FAULTCODE, Severity.Error],
    [CICSLexer.CLIENT, Severity.Error],
    [CICSLexer.SERVER, Severity.Error],
    [CICSLexer.SENDER, Severity.Error],
    [CICSLexer.RECEIVER, Severity.Error],
    [CICSLexer.FAULTCODESTR, Severity.Error],
    [CICSLexer.FAULTCODELEN, Severity.Error],
    [CICSLexer.FAULTSTRING, Severity.Error],
    [CICSLexer.FAULTSTRLEN, Severity.Error],
    [CICSLexer.NATLANG, Severity.Error],
    [CICSLexer.ROLE, Severity.Error],
    [CICSLexer.ROLELENGTH, Severity.Error],
    [CICSLexer.FAULTACTOR, Severity.Error],
    [CICSLexer.FAULTACTLEN, Severity.Error],
    [CICSLexer.DETAIL, Severity.Error],
    [CICSLexer.DETAILLENGTH, Severity.Error],
    [CICSLexer.FROMCCSID, Severity.Error],
    [CICSLexer.DELETE, Severity.Warning],
    [CICSLexer.CREATE, Severity.Warning],
    [CICSLexer.ADD, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SoapfaultOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SOAPFAULT rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_soapfault_create:
        this.checkCreate(ctx as unknown as Cics_soapfault_createContext);
        break;
      case CICSParser.RULE_cics_soapfault_add:
        this.checkAdd(ctx as unknown as Cics_soapfault_addContext);
        break;
      case CICSParser.RULE_cics_soapfault_delete:
        this.checkDelete(ctx as unknown as Cics_soapfault_deleteContext);
        break;
      default:
        break;
    }

    this.checkDuplicates(ctx);
  }

  private checkCreate(ctx: Cics_soapfault_createContext) {
    this.checkHasExactlyOneOption(
      "FAULTCODE, FAULTCODESTR, CLIENT, SERVER, SENDER or RECEIVER",
      ctx,
      ctx.FAULTCODE(),
      ctx.FAULTCODESTR(),
      ctx.CLIENT(),
      ctx.SERVER(),
      ctx.SENDER(),
      ctx.RECEIVER(),
    );

    this.checkHasMandatoryOptions(ctx.FAULTSTRING(), ctx, "FAULTSTRING");

    this.checkOptionalWithLength(
      ctx.FAULTCODESTR(),
      ctx.FAULTCODELEN(),
      ctx,
      "FAULTCODESTR",
      "FAULTCODELEN",
    );
    this.checkOptionalWithLength(
      ctx.FAULTACTOR(),
      ctx.FAULTACTLEN(),
      ctx,
      "FAULTACTOR",
      "FAULTACTLEN",
    );
    this.checkOptionalWithLength(
      ctx.DETAIL(),
      ctx.DETAILLENGTH(),
      ctx,
      "DETAIL",
      "DETAILLENGTH",
    );
    this.checkOptionalWithLength(
      ctx.ROLE(),
      ctx.ROLELENGTH(),
      ctx,
      "ROLE",
      "ROLELENGTH",
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.FAULTSTRLEN(), ctx, "FAULTSTRLEN");
    }
  }

  private checkAdd(ctx: Cics_soapfault_addContext) {
    this.checkHasExactlyOneOption(
      "FAULTSTRING or SUBCODESTR",
      ctx,
      ctx.FAULTSTRING(),
      ctx.SUBCODESTR(),
    );
    this.checkOptionalWithLength(
      ctx.SUBCODESTR(),
      ctx.SUBCODELEN(),
      ctx,
      "SUBCODESTR",
      "SUBCODELEN",
    );
    this.checkOptionalWithLength(
      ctx.FAULTSTRING(),
      ctx.FAULTSTRLEN(),
      ctx,
      "FAULTSTRING",
      "FAULTSTRLEN",
    );
  }

  private checkDelete(ctx: Cics_soapfault_deleteContext) {
    this.checkHasMandatoryOptions(ctx.DELETE(), ctx, "DELETE");
  }
}
