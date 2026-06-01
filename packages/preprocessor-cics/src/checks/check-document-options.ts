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
  Cics_document_createContext,
  Cics_document_deleteContext,
  Cics_document_insertContext,
  Cics_document_retrieveContext,
  Cics_document_setContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class DocumentOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_document;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CREATE, Severity.Warning],
    [CICSLexer.DELETE, Severity.Warning],
    [CICSLexer.INSERT, Severity.Warning],
    [CICSLexer.RETRIEVE, Severity.Warning],
    [CICSLexer.SET, Severity.Warning],
    [CICSLexer.DOCTOKEN, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.TEXT, Severity.Error],
    [CICSLexer.BINARY, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.FROMDOC, Severity.Error],
    [CICSLexer.TEMPLATE, Severity.Error],
    [CICSLexer.SYMBOLLIST, Severity.Error],
    [CICSLexer.LISTLENGTH, Severity.Error],
    [CICSLexer.DELIMITER, Severity.Error],
    [CICSLexer.UNESCAPED, Severity.Warning],
    [CICSLexer.DOCSIZE, Severity.Error],
    [CICSLexer.HOSTCODEPAGE, Severity.Error],
    [CICSLexer.SYMBOL, Severity.Error],
    [CICSLexer.BOOKMARK, Severity.Error],
    [CICSLexer.AT, Severity.Error],
    [CICSLexer.TO, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.MAXLENGTH, Severity.Error],
    [CICSLexer.CHARACTERSET, Severity.Error],
    [CICSLexer.DATAONLY, Severity.Warning],
    [CICSLexer.VALUE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, DocumentOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS DOCUMENT rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_document_create:
        this.checkDocumentCreate(ctx as unknown as Cics_document_createContext);
        break;
      case CICSParser.RULE_cics_document_delete:
        this.checkDocumentDelete(ctx as unknown as Cics_document_deleteContext);
        break;
      case CICSParser.RULE_cics_document_insert:
        this.checkDocumentInsert(ctx as unknown as Cics_document_insertContext);
        break;
      case CICSParser.RULE_cics_document_retrieve:
        this.checkDocumentRetrieve(
          ctx as unknown as Cics_document_retrieveContext,
        );
        break;
      case CICSParser.RULE_cics_document_set:
        this.checkDocumentSet(ctx as unknown as Cics_document_setContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkDocumentCreate(ctx: Cics_document_createContext) {
    this.checkHasMandatoryOptions(ctx.CREATE(), ctx, "CREATE");
    this.checkHasMandatoryOptions(ctx.DOCTOKEN(), ctx, "DOCTOKEN");
    if (ctx.LENGTH().length !== 0) {
      this.checkHasExactlyOneOption(
        "FROM, TEXT or BINARY",
        ctx,
        ctx.FROM(),
        ctx.TEXT(),
        ctx.BINARY(),
      );
    }
    if (
      ctx.FROM().length !== 0 ||
      ctx.TEXT().length !== 0 ||
      ctx.BINARY().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
    this.checkHasMutuallyExclusiveOptions(
      "LENGTH, FROMDOC or TEMPLATE",
      ctx.LENGTH(),
      ctx.FROMDOC(),
      ctx.TEMPLATE(),
    );
    if (ctx.DELIMITER().length !== 0 || ctx.UNESCAPED().length !== 0) {
      this.checkHasMandatoryOptions(ctx.SYMBOLLIST(), ctx, "SYMBOLLIST");
      this.checkHasMandatoryOptions(ctx.LISTLENGTH(), ctx, "LISTLENGTH");
    }
    this.checkAllOptionsArePresentOrAbsent(
      "SYMBOLLIST, LISTLENGTH",
      ctx,
      ctx.SYMBOLLIST(),
      ctx.LISTLENGTH(),
    );
  }

  private checkDocumentDelete(ctx: Cics_document_deleteContext) {
    this.checkHasMandatoryOptions(ctx.DELETE(), ctx, "DELETE");
    this.checkHasMandatoryOptions(ctx.DOCTOKEN(), ctx, "DOCTOKEN");
  }

  private checkDocumentInsert(ctx: Cics_document_insertContext) {
    this.checkHasMandatoryOptions(ctx.INSERT(), ctx, "INSERT");
    this.checkHasMandatoryOptions(ctx.DOCTOKEN(), ctx, "DOCTOKEN");
    if (
      ctx.FROM().length !== 0 ||
      ctx.TEXT().length !== 0 ||
      ctx.BINARY().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
    if (ctx.LENGTH().length !== 0) {
      this.checkHasExactlyOneOption(
        "FROM, TEXT or BINARY",
        ctx,
        ctx.FROM(),
        ctx.TEXT(),
        ctx.BINARY(),
      );
    }
    this.checkHasMutuallyExclusiveOptions(
      "FROM, TEXT or BINARY",
      ctx.FROM(),
      ctx.TEXT(),
      ctx.BINARY(),
    );
    this.checkHasExactlyOneOption(
      "LENGTH, SYMBOL, TEMPLATE, FROMDOC or BOOKMARK",
      ctx,
      ctx.LENGTH(),
      ctx.SYMBOL(),
      ctx.TEMPLATE(),
      ctx.FROMDOC(),
      ctx.BOOKMARK(),
    );
    this.checkPrerequisiteIsMet(ctx.AT(), ctx.TO(), ctx, "TO");
  }

  private checkDocumentRetrieve(ctx: Cics_document_retrieveContext) {
    this.checkHasMandatoryOptions(ctx.RETRIEVE(), ctx, "RETRIEVE");
    this.checkHasMandatoryOptions(ctx.DOCTOKEN(), ctx, "DOCTOKEN");
    this.checkHasMandatoryOptions(ctx.INTO(), ctx, "INTO");
    this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
  }

  private checkDocumentSet(ctx: Cics_document_setContext) {
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    this.checkHasMandatoryOptions(ctx.DOCTOKEN(), ctx, "DOCTOKEN");
    this.checkAllOptionsArePresentOrAbsent(
      "SYMBOL, VALUE",
      ctx,
      ctx.SYMBOL(),
      ctx.VALUE(),
    );
    this.checkHasExactlyOneOption(
      "SYMBOL or SYMBOLLIST",
      ctx,
      ctx.SYMBOL(),
      ctx.SYMBOLLIST(),
    );
    if (ctx.DELIMITER().length !== 0) {
      this.checkHasMandatoryOptions(ctx.SYMBOLLIST(), ctx, "SYMBOLLIST");
    }
  }
}
