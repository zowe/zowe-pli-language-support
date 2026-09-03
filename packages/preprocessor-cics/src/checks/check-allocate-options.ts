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
  Cics_allocate_appc_mro_lut61_sysidContext,
  Cics_allocate_appc_partnerContext,
  Cics_allocate_lut61_sessionContext,
  Cics_allocateContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";
import { assertType } from "./utils";

export class AllocateOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_allocate;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ALLOCATE, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.PROFILE, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.PARTNER, Severity.Error],
    [CICSLexer.ASIS, Severity.Warning],
    [CICSLexer.BUFFER, Severity.Warning],
    [CICSLexer.LEAVEKB, Severity.Warning],
    [CICSLexer.NOTRUNCATE, Severity.Warning],
    [CICSLexer.NOQUEUE, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, AllocateOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  override checkRootRule<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_allocate) {
      assertType<Cics_allocateContext>(ctx);
      if (
        !ctx.cics_allocate_appc_partner() &&
        !ctx.cics_allocate_appc_mro_lut61_sysid() &&
        !ctx.cics_allocate_lut61_session()
      ) {
        this.checkHasExactlyOneOption("SESSION, SYSID, PARTNER", ctx);
      }
    }
  }
  /**
   * Entrypoint to check CICS Allocate rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_allocate_appc_partner:
        this.checkAppcPartner(
          ctx as unknown as Cics_allocate_appc_partnerContext,
        );
        break;
      case CICSParser.RULE_cics_allocate_appc_mro_lut61_sysid:
        this.checkAppcMroLut61Sysid(
          ctx as unknown as Cics_allocate_appc_mro_lut61_sysidContext,
        );
        break;
      case CICSParser.RULE_cics_allocate_lut61_session:
        this.checkLut61Session(
          ctx as unknown as Cics_allocate_lut61_sessionContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkAppcPartner(ctx: Cics_allocate_appc_partnerContext) {
    this.checkHasMandatoryOptions(ctx.PARTNER(), ctx, "PARTNER");
  }

  private checkAppcMroLut61Sysid(
    ctx: Cics_allocate_appc_mro_lut61_sysidContext,
  ) {
    this.checkHasMandatoryOptions(ctx.SYSID(), ctx, "SYSID");
  }

  private checkLut61Session(ctx: Cics_allocate_lut61_sessionContext) {
    this.checkHasMandatoryOptions(ctx.SESSION(), ctx, "SESSION");
  }
}
