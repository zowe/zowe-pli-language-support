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
  Cics_dumpContext,
  Cics_dump_transaction_fromContext,
  Cics_dump_transaction_segmentlistContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";
import { assertType } from "./utils";

export class DumpTransactionOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_dump;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.DUMP, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Warning],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.COMPLETE, Severity.Warning],
    [CICSLexer.TRT, Severity.Warning],
    [CICSLexer.SEGMENTLIST, Severity.Error],
    [CICSLexer.LENGTHLIST, Severity.Error],
    [CICSLexer.NUMSEGMENTS, Severity.Error],
    [CICSLexer.TASK, Severity.Warning],
    [CICSLexer.STORAGE, Severity.Warning],
    [CICSLexer.PROGRAM, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Warning],
    [CICSLexer.TABLES, Severity.Warning],
    [CICSLexer.FCT, Severity.Warning],
    [CICSLexer.PCT, Severity.Warning],
    [CICSLexer.PPT, Severity.Warning],
    [CICSLexer.SIT, Severity.Warning],
    [CICSLexer.TCT, Severity.Warning],
    [CICSLexer.DUMPID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(
      errors,
      DumpTransactionOptionsChecker.DUPLICATE_CHECK_OPTIONS,
      params,
    );
  }

  override checkRootRule<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_dump) {
      assertType<Cics_dumpContext>(ctx);
      if (
        !ctx.cics_dump_transaction_from()?.length &&
        !ctx.cics_dump_transaction_segmentlist()?.length &&
        !ctx.cics_dump_code_opts()?.length
      ) {
        this.checkHasExactlyOneOption(
          "DUMPCODE, DUMPID, FROM, COMPLETE, TRT, TASK, STORAGE, PROGRAM, TERMINAL, TABLES, FCT, PCT, PPT, SIT, TCT, SEGMENTLIST, LENGTHLIST, NUMSEGMENTS",
          ctx,
        );
      }
    }
  }

  /**
   * Entrypoint to check CICS Dump Transaction rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_dump_transaction_from) {
      this.checkDumpTransactionFrom(
        ctx as unknown as Cics_dump_transaction_fromContext,
      );
      this.checkDumpTransaction(ctx.parent as unknown as Cics_dumpContext);
    } else if (
      ctx.ruleIndex === CICSParser.RULE_cics_dump_transaction_segmentlist
    ) {
      this.checkDumpTransactionSegmentList(
        ctx as unknown as Cics_dump_transaction_segmentlistContext,
      );
      this.checkDumpTransaction(ctx.parent as unknown as Cics_dumpContext);
    }

    this.checkDuplicates(ctx);
  }

  private checkDumpTransaction(ctx: Cics_dumpContext) {
    this.checkHasMandatoryOptions(ctx.DUMPCODE(), ctx, "DUMPCODE");
  }

  private checkDumpTransactionFrom(ctx: Cics_dump_transaction_fromContext) {
    if (ctx.FROM().length !== 0)
      this.checkHasExactlyOneOption(
        "LENGTH or FLENGTH",
        ctx,
        ctx.cics_length_flength(),
      );

    this.checkHasMandatoryOptions(ctx.FROM(), ctx, "FROM");
  }

  private checkDumpTransactionSegmentList(
    ctx: Cics_dump_transaction_segmentlistContext,
  ) {
    this.checkHasMandatoryOptions(ctx.LENGTHLIST(), ctx, "LENGTHLIST");
    this.checkHasMandatoryOptions(ctx.NUMSEGMENTS(), ctx, "NUMSEGMENTS");
    this.checkHasMandatoryOptions(ctx.SEGMENTLIST(), ctx, "SEGMENTLIST");
  }
}
