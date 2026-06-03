/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */
import { Diagnostic, Severity } from "preprocessor-api";
import {
  Cics_nameContext,
  Cics_send_control_mapContext,
  Cics_send_group1Context,
  Cics_send_mappingdevContext,
  Cics_send_pageContext,
  Cics_send_textContext,
  Cics_send_text_mappedContext,
  Cics_send_text_noeditContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

/** Checks CICS Send rules for required and invalid options */
export class SendOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_send;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.SEND, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.WAIT, Severity.Warning],
    [CICSLexer.INVITE, Severity.Warning],
    [CICSLexer.LAST, Severity.Warning],
    [CICSLexer.DEFRESP, Severity.Warning],
    [CICSLexer.FMH, Severity.Warning],
    [CICSLexer.CTLCHAR, Severity.Error],
    [CICSLexer.ERASE, Severity.Warning],
    [CICSLexer.DEFAULT, Severity.Warning],
    [CICSLexer.ALTERNATE, Severity.Warning],
    [CICSLexer.CNOTCOMPL, Severity.Warning],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.CONFIRM, Severity.Warning],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.STRFIELD, Severity.Warning],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.ATTACHID, Severity.Error],
    [CICSLexer.LDC, Severity.Error],
    [CICSLexer.LINEADDR, Severity.Error],
    [CICSLexer.LEAVEKB, Severity.Warning],
    [CICSLexer.PASSBK, Severity.Warning],
    [CICSLexer.CBUFF, Severity.Warning],
    [CICSLexer.CONTROL, Severity.Error],
    [CICSLexer.CURSOR, Severity.Error],
    [CICSLexer.FORMFEED, Severity.Warning],
    [CICSLexer.ERASEAUP, Severity.Warning],
    [CICSLexer.PRINT, Severity.Warning],
    [CICSLexer.FREEKB, Severity.Warning],
    [CICSLexer.ALARM, Severity.Warning],
    [CICSLexer.FRSET, Severity.Warning],
    [CICSLexer.MSR, Severity.Error],
    [CICSLexer.OUTPARTN, Severity.Error],
    [CICSLexer.ACTPARTN, Severity.Error],
    [CICSLexer.ACCUM, Severity.Warning],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.PAGING, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.HONEOM, Severity.Warning],
    [CICSLexer.L40, Severity.Warning],
    [CICSLexer.L64, Severity.Warning],
    [CICSLexer.L80, Severity.Warning],
    [CICSLexer.MAP, Severity.Error],
    [CICSLexer.MAPSET, Severity.Error],
    [CICSLexer.DATAONLY, Severity.Warning],
    [CICSLexer.MAPONLY, Severity.Warning],
    [CICSLexer.NLEOM, Severity.Warning],
    [CICSLexer.FMHPARM, Severity.Error],
    [CICSLexer.NOFLUSH, Severity.Warning],
    [CICSLexer.MAPPINGDEV, Severity.Error],
    [CICSLexer.PAGE, Severity.Error],
    [CICSLexer.RELEASE, Severity.Warning],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.TRAILER, Severity.Error],
    [CICSLexer.RETAIN, Severity.Warning],
    [CICSLexer.AUTOPAGE, Severity.Warning],
    [CICSLexer.CURRENT, Severity.Warning],
    [CICSLexer.ALL, Severity.Warning],
    [CICSLexer.NOAUTOPAGE, Severity.Warning],
    [CICSLexer.OPERPURGE, Severity.Warning],
    [CICSLexer.PARTNSET, Severity.Error],
    [CICSLexer.TEXT, Severity.Error],
    [CICSLexer.HEADER, Severity.Error],
    [CICSLexer.JUSTIFY, Severity.Error],
    [CICSLexer.JUSFIRST, Severity.Warning],
    [CICSLexer.JUSLAST, Severity.Warning],
    [CICSLexer.MAPPED, Severity.Warning],
    [CICSLexer.NOEDIT, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SendOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Send rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_send_group1:
        this.checkGroup1(ctx as unknown as Cics_send_group1Context);
        break;
      case CICSParser.RULE_cics_send_control_map:
        this.checkControl(ctx as unknown as Cics_send_control_mapContext);
        break;
      case CICSParser.RULE_cics_send_mappingdev:
        this.checkMappingdev(ctx as unknown as Cics_send_mappingdevContext);
        break;
      case CICSParser.RULE_cics_send_page:
        this.checkPage(ctx as unknown as Cics_send_pageContext);
        break;
      case CICSParser.RULE_cics_send_text:
        this.checkText(ctx as unknown as Cics_send_textContext);
        break;
      case CICSParser.RULE_cics_send_text_mapped:
        this.checkTextMapped(ctx as unknown as Cics_send_text_mappedContext);
        break;
      case CICSParser.RULE_cics_send_text_noedit:
        this.checkTextNoedit(ctx as unknown as Cics_send_text_noeditContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkGroup1(ctx: Cics_send_group1Context) {
    if (this.noLengthOptionsEnabled() && ctx.FROM().length !== 0) {
      this.checkHasExactlyOneOption(
        "LENGTH or FLENGTH",
        ctx,
        ctx.LENGTH(),
        ctx.FLENGTH(),
      );
    } else
      this.checkHasMutuallyExclusiveOptions(
        "LENGTH or FLENGTH",
        ctx.LENGTH(),
        ctx.FLENGTH(),
      );
    this.checkHasMutuallyExclusiveOptions(
      "INVITE or LAST",
      ctx.INVITE(),
      ctx.LAST(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "STRFIELD or ERASE",
      ctx.STRFIELD(),
      ctx.ERASE(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "DEFAULT or ALTERNATE",
      ctx.DEFAULT(),
      ctx.ALTERNATE(),
    );
    if (
      ctx.LENGTH().length !== 0 ||
      ctx.FLENGTH().length !== 0 ||
      ctx.FMH().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    }
    this.checkHasMutuallyExclusiveOptions(
      "STRFIELD or CTLCHAR",
      ctx.STRFIELD(),
      ctx.CTLCHAR(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "ATTACHID  or CTLCHAR",
      ctx.ATTACHID(),
      ctx.CTLCHAR(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "CONFIRM or WAIT",
      ctx.CONFIRM(),
      ctx.WAIT(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "CNOTCOMPL or DEFRESP",
      ctx.CNOTCOMPL(),
      ctx.DEFRESP(),
    );
    this.checkHasMutuallyExclusiveOptions("LDC or FMH", ctx.LDC(), ctx.FMH());
    this.checkHasMutuallyExclusiveOptions(
      "PASSBK or CBUFF or CNOTCOMPL ",
      ctx.PASSBK(),
      ctx.CBUFF(),
      ctx.CNOTCOMPL(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "INVITE or CNOTCOMPL ",
      ctx.INVITE(),
      ctx.CNOTCOMPL(),
    );
  }

  private checkControl(ctx: Cics_send_control_mapContext) {
    this.checkHasExactlyOneOption(
      "CONTROL or MAP",
      ctx,
      ctx.CONTROL(),
      ctx.MAP(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "ERASE or ERASEAUP",
      ctx.ERASE(),
      ctx.ERASEAUP(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "OUTPARTN or LDC",
      ctx.OUTPARTN(),
      ctx.LDC(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "ACTPARTN or LDC",
      ctx.ACTPARTN(),
      ctx.LDC(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "TERMINAL or SET or PAGING",
      ctx.TERMINAL(),
      ctx.SET(),
      ctx.PAGING(),
    );
    if (ctx.LENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    }
    this.checkHasMutuallyExclusiveOptions(
      "HONEOM or L40 or L64 or L80",
      ctx.HONEOM(),
      ctx.L40(),
      ctx.L64(),
      ctx.L80(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "DATAONLY or MAPONLY",
      ctx.DATAONLY(),
      ctx.MAPONLY(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "FROM or MAPONLY",
      ctx.FROM(),
      ctx.MAPONLY(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "LENGTH or MAPONLY",
      ctx.LENGTH(),
      ctx.MAPONLY(),
    );
    if (
      ctx.MAPSET().length !== 0 ||
      ctx.FROM().length !== 0 ||
      ctx.DATAONLY().length !== 0 ||
      ctx.LENGTH().length !== 0 ||
      ctx.MAPONLY().length !== 0 ||
      ctx.NLEOM().length !== 0 ||
      ctx.FMHPARM().length !== 0 ||
      ctx.NOFLUSH().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.MAP(), ctx, "MAP");
    }
    this.checkOptionalWithLength(
      ctx.FROM(),
      ctx.LENGTH(),
      ctx,
      "FROM",
      "LENGTH",
    );
  }

  private checkMappingdev(ctx: Cics_send_mappingdevContext) {
    this.checkHasMandatoryOptions(ctx.MAP(), ctx, "MAP");
    this.checkHasMandatoryOptions(ctx.MAPPINGDEV(), ctx, "MAPPINGDEV");
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasMutuallyExclusiveOptions(
      "DATAONLY or MAPONLY",
      ctx.DATAONLY(),
      ctx.MAPONLY(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "FROM or MAPONLY",
      ctx.FROM(),
      ctx.MAPONLY(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "LENGTH or MAPONLY",
      ctx.LENGTH(),
      ctx.MAPONLY(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "ERASE or ERASEAUP",
      ctx.ERASE(),
      ctx.ERASEAUP(),
    );
    if (ctx.LENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    }
    if (!this.checkMapHasLiteral(ctx)) {
      this.checkHasMandatoryOptions(
        ctx.FROM(),
        ctx,
        "FROM when specifying MAP or MAPSET parameter without literal",
      );
    }
    this.checkOptionalWithLength(
      ctx.FROM(),
      ctx.LENGTH(),
      ctx,
      "FROM",
      "LENGTH",
    );
  }

  private checkPage(ctx: Cics_send_pageContext) {
    this.checkHasMandatoryOptions(ctx.PAGE(), ctx, "PAGE");
    this.checkHasMutuallyExclusiveOptions(
      "RELEASE or RETAIN",
      ctx.RELEASE(),
      ctx.RETAIN(),
    );
    if (ctx.TRANSID().length !== 0) {
      this.checkHasMandatoryOptions(ctx.RELEASE(), ctx, "RELEASE");
    }
    this.checkHasMutuallyExclusiveOptions(
      "AUTOPAGE or NOAUTOPAGE",
      ctx.AUTOPAGE(),
      ctx.NOAUTOPAGE(),
    );
    if (ctx.CURRENT().length !== 0 || ctx.ALL().length !== 0) {
      this.checkHasMandatoryOptions(ctx.AUTOPAGE(), ctx, "AUTOPAGE");
    }
    this.checkHasMutuallyExclusiveOptions(
      "CURRENT or ALL",
      ctx.CURRENT(),
      ctx.ALL(),
    );
  }

  private checkText(ctx: Cics_send_textContext) {
    this.checkHasMandatoryOptions(ctx.TEXT(), ctx, "TEXT");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMutuallyExclusiveOptions(
      "DEFAULT or ALTERNATE",
      ctx.DEFAULT(),
      ctx.ALTERNATE(),
    );
    if (ctx.LENGTH().length !== 0) {
      this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    }
    this.checkHasMutuallyExclusiveOptions(
      "LDC or OUTPARTN",
      ctx.LDC(),
      ctx.OUTPARTN(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "LDC or ACTPARTN",
      ctx.LDC(),
      ctx.ACTPARTN(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "TERMINAL or SET or PAGING",
      ctx.TERMINAL(),
      ctx.SET(),
      ctx.PAGING(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "JUSTIFY or JUSFIRST or JUSLAST",
      ctx.JUSTIFY(),
      ctx.JUSFIRST(),
      ctx.JUSLAST(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "HONEOM or L40 or L64 or L80",
      ctx.HONEOM(),
      ctx.L40(),
      ctx.L64(),
      ctx.L80(),
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }

  private checkTextMapped(ctx: Cics_send_text_mappedContext) {
    this.checkHasMandatoryOptions(ctx.TEXT(), ctx, "TEXT");
    this.checkHasMandatoryOptions(ctx.MAPPED(), ctx, "MAPPED");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMutuallyExclusiveOptions(
      "TERMINAL or PAGING",
      ctx.TERMINAL(),
      ctx.PAGING(),
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }

  private checkTextNoedit(ctx: Cics_send_text_noeditContext) {
    this.checkHasMandatoryOptions(ctx.TEXT(), ctx, "TEXT");
    this.checkHasMandatoryOptions(ctx.NOEDIT(), ctx, "NOEDIT");
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    this.checkHasMutuallyExclusiveOptions(
      "DEFAULT or ALTERNATE",
      ctx.DEFAULT(),
      ctx.ALTERNATE(),
    );
    if (ctx.DEFAULT().length !== 0 || ctx.ALTERNATE().length !== 0) {
      this.checkHasMandatoryOptions(ctx.ERASE(), ctx, "ERASE");
    }
    this.checkHasMutuallyExclusiveOptions(
      "TERMINAL or PAGING",
      ctx.TERMINAL(),
      ctx.PAGING(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "HONEOM or L40 or L64 or L80",
      ctx.HONEOM(),
      ctx.L40(),
      ctx.L64(),
      ctx.L80(),
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
  }

  private checkMapHasLiteral(ctx: ParserRuleContext): boolean {
    if (ctx.children == null) return false;
    for (let index = 0; index < ctx.children.length - 1; index++) {
      const item = ctx.children[index];
      if (item instanceof TerminalNode) {
        if (
          item.getSymbol().type === CICSParser.MAP ||
          item.getSymbol().type === CICSParser.MAPSET
        ) {
          const param = ctx.children[index + 1];
          if (param instanceof ParserRuleContext) {
            if (param.ruleIndex === CICSParser.RULE_cics_name) {
              if (
                (param as Cics_nameContext)
                  .name()
                  .variableNameUsage()
                  .some((variable) => variable.NONNUMERICLITERAL() != null)
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
}
