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
  Cics_receive_group_oneContext,
  Cics_receive_mapContext,
  Cics_receive_map_mappingdevContext,
  Cics_receive_partnContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";

export class ReceiveOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_receive;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.RECEIVE, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.MAP, Severity.Error],
    [CICSLexer.MAPSET, Severity.Error],
    [CICSLexer.MAXLENGTH, Severity.Error],
    [CICSLexer.MAXFLENGTH, Severity.Error],
    [CICSLexer.INPARTN, Severity.Error],
    [CICSLexer.MAPPINGDEV, Severity.Error],
    [CICSLexer.ASIS, Severity.Warning],
    [CICSLexer.BUFFER, Severity.Warning],
    [CICSLexer.LEAVEKB, Severity.Warning],
    [CICSLexer.PASSBK, Severity.Warning],
    [CICSLexer.NOTRUNCATE, Severity.Warning],
    [CICSLexer.NOQUEUE, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ReceiveOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS RECEIVE rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_receive_group_one:
        this.checkGroupOne(ctx as unknown as Cics_receive_group_oneContext);
        break;
      case CICSParser.RULE_cics_receive_partn:
        this.checkPartn(ctx as unknown as Cics_receive_partnContext);
        break;
      case CICSParser.RULE_cics_receive_map:
        this.checkMap(ctx as unknown as Cics_receive_mapContext);
        break;
      case CICSParser.RULE_cics_receive_map_mappingdev:
        this.checkMapMappingDev(
          ctx as unknown as Cics_receive_map_mappingdevContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkGroupOne(ctx: Cics_receive_group_oneContext) {
    this.checkHasMutuallyExclusiveOptions("INTO or SET", ctx.INTO(), ctx.SET());
    if (ctx.SET().length !== 0)
      this.checkHasExactlyOneOption(
        "LENGTH or FLENGTH",
        ctx,
        ctx.LENGTH(),
        ctx.FLENGTH(),
      );
    else
      this.checkHasMutuallyExclusiveOptions(
        "LENGTH or FLENGTH",
        ctx.LENGTH(),
        ctx.FLENGTH(),
      );
    this.checkHasMutuallyExclusiveOptions(
      "MAXLENGTH or MAXFLENGTH",
      ctx.MAXLENGTH(),
      ctx.MAXFLENGTH(),
    );
    if (this.noLengthOptionsEnabled() && ctx.INTO().length !== 0)
      this.checkHasExactlyOneOption(
        "LENGTH or FLENGTH",
        ctx,
        ctx.LENGTH(),
        ctx.FLENGTH(),
      );
  }

  private checkPartn(ctx: Cics_receive_partnContext) {
    this.checkHasMandatoryOptions(ctx.PARTN(), ctx, "PARTN");
    this.checkHasMutuallyExclusiveOptions("INTO or SET", ctx.INTO(), ctx.SET());
    this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
  }

  private checkMap(ctx: Cics_receive_mapContext) {
    if (ctx.FROM().length === 0)
      this.checkHasIllegalOptions(ctx.LENGTH(), "LENGTH without FROM");
    else if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }
    if (!this.checkMapHasLiteral(ctx)) {
      this.checkHasExactlyOneOption(
        "INTO or SET when specifying MAP param without literal",
        ctx,
        ctx.INTO(),
        ctx.SET(),
      );
    }
    this.checkHasMutuallyExclusiveOptions("INTO or SET", ctx.INTO(), ctx.SET());
    this.checkHasMutuallyExclusiveOptions(
      "TERMINAL or FROM",
      ctx.TERMINAL(),
      ctx.FROM(),
    );
  }

  private checkMapMappingDev(ctx: Cics_receive_map_mappingdevContext) {
    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
    if (!this.checkMapHasLiteral(ctx)) {
      this.checkHasExactlyOneOption(
        "INTO or SET when specifying MAP param without literal",
        ctx,
        ctx.INTO(),
        ctx.SET(),
      );
    }
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
  }

  private checkMapHasLiteral(ctx: ParserRuleContext): boolean {
    if (ctx.children == null) return false;
    for (let index = 0; index < ctx.children.length - 1; index++) {
      const item = ctx.children[index];
      if (item instanceof TerminalNode) {
        if (item.getSymbol().type === CICSParser.MAP) {
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
