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
  Cics_transform_jsonContext,
  Cics_transform_xmlContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class TransformOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_transform;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.INCONTAINER, Severity.Error],
    [CICSLexer.OUTCONTAINER, Severity.Error],
    [CICSLexer.TRANSFORMER, Severity.Error],
    [CICSLexer.XMLCONTAINER, Severity.Error],
    [CICSLexer.NSCONTAINER, Severity.Error],
    [CICSLexer.DATCONTAINER, Severity.Error],
    [CICSLexer.ELEMNAME, Severity.Error],
    [CICSLexer.ELEMNAMELEN, Severity.Error],
    [CICSLexer.ELEMNS, Severity.Error],
    [CICSLexer.ELEMNSLEN, Severity.Error],
    [CICSLexer.TYPENAME, Severity.Error],
    [CICSLexer.TYPENAMELEN, Severity.Error],
    [CICSLexer.TYPENS, Severity.Error],
    [CICSLexer.TYPENSLEN, Severity.Error],
    [CICSLexer.XMLTRANSFORM, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, TransformOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS TRANSFORM rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_transform_json:
        this.checkJSON(ctx as unknown as Cics_transform_jsonContext);
        break;
      case CICSParser.RULE_cics_transform_xml:
        this.checkXML(ctx as unknown as Cics_transform_xmlContext);
        break;
      default:
        break;
    }

    this.checkDuplicates(ctx);
  }

  private checkJSON(ctx: Cics_transform_jsonContext) {
    this.checkHasExactlyOneOption(
      "DATATOJSON or JSONTODATA",
      ctx,
      ctx.DATATOJSON(),
      ctx.JSONTODATA(),
    );

    this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
    this.checkHasMandatoryOptions(ctx.INCONTAINER(), ctx, "INCONTAINER");
    this.checkHasMandatoryOptions(ctx.TRANSFORMER(), ctx, "TRANSFORMER");
  }

  private checkXML(ctx: Cics_transform_xmlContext) {
    if (ctx.DATATOXML().length !== 0) {
      this.checkHasIllegalOptions(ctx.NSCONTAINER(), "NSCONTAINER");
      this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
      this.checkHasMandatoryOptions(ctx.DATCONTAINER(), ctx, "DATCONTAINER");
      this.checkHasMandatoryOptions(ctx.XMLTRANSFORM(), ctx, "XMLTRANSFORM");
      this.checkHasMandatoryOptions(ctx.XMLCONTAINER(), ctx, "XMLCONTAINER");

      if (
        ctx.TYPENAMELEN().length !== 0 ||
        ctx.TYPENS().length !== 0 ||
        ctx.TYPENSLEN().length !== 0
      ) {
        this.checkHasMandatoryOptions(ctx.TYPENAME(), ctx, "TYPENAME");
      }
    } else if (ctx.XMLTODATA().length !== 0) {
      this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
      this.checkHasMandatoryOptions(ctx.XMLCONTAINER(), ctx, "XMLCONTAINER");
    }

    this.checkHasExactlyOneOption(
      "DATATOXML or XMLTODATA",
      ctx,
      ctx.DATATOXML(),
      ctx.XMLTODATA(),
    );

    this.checkOptionalWithLength(
      ctx.ELEMNAME(),
      ctx.ELEMNAMELEN(),
      ctx,
      "ELEMNAME",
      "ELEMNAMELEN",
    );
    this.checkOptionalWithLength(
      ctx.ELEMNS(),
      ctx.ELEMNSLEN(),
      ctx,
      "ELEMNS",
      "ELEMNSLEN",
    );
    this.checkOptionalWithLength(
      ctx.TYPENAME(),
      ctx.TYPENAMELEN(),
      ctx,
      "TYPENAME",
      "TYPENAMELEN",
    );
    this.checkOptionalWithLength(
      ctx.TYPENS(),
      ctx.TYPENSLEN(),
      ctx,
      "TYPENS",
      "TYPENSLEN",
    );
  }
}
