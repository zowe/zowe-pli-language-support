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
  Cics_start_attachContext,
  Cics_start_brexitContext,
  Cics_start_channelContext,
  Cics_start_transidContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class StartOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_start;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.AFTER, Severity.Warning],
    [CICSLexer.AT, Severity.Warning],
    [CICSLexer.ATTACH, Severity.Warning],
    [CICSLexer.BRDATA, Severity.Error],
    [CICSLexer.BRDATALENGTH, Severity.Error],
    [CICSLexer.BREXIT, Severity.Warning],
    [CICSLexer.CHANNEL, Severity.Warning],
    [CICSLexer.FMH, Severity.Warning],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.HOURS, Severity.Error],
    [CICSLexer.INTERVAL, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.MINUTES, Severity.Error],
    [CICSLexer.NOCHECK, Severity.Warning],
    [CICSLexer.PROTECT, Severity.Warning],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.RTERMID, Severity.Error],
    [CICSLexer.RTRANSID, Severity.Error],
    [CICSLexer.SECONDS, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.TERMID, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, StartOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS START rules for required and invalid options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_start_transid:
        this.checkStartTransid(ctx as unknown as Cics_start_transidContext);
        break;
      case CICSParser.RULE_cics_start_attach:
        this.checkStartAttach(ctx as unknown as Cics_start_attachContext);
        break;
      case CICSParser.RULE_cics_start_brexit:
        this.checkStartBrexit(ctx as unknown as Cics_start_brexitContext);
        break;
      case CICSParser.RULE_cics_start_channel:
        this.checkStartChannel(ctx as unknown as Cics_start_channelContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkStartTransid(ctx: Cics_start_transidContext) {
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");

    this.checkMutuallyExclusiveOptions(
      "INTERVAL, AFTER, AT or TIME",
      ctx.INTERVAL(),
      ctx.AFTER(),
      ctx.AT(),
      ctx.TIME(),
    );
    this.checkMutuallyExclusiveOptions(
      "TERMID or USERID",
      ctx.TERMID(),
      ctx.USERID(),
    );

    if (
      ctx.HOURS().length !== 0 ||
      ctx.MINUTES().length !== 0 ||
      ctx.SECONDS().length !== 0 ||
      ctx.AFTER().length !== 0 ||
      ctx.AT().length !== 0
    ) {
      this.checkHasExactlyOneOption("AFTER or AT", ctx, ctx.AFTER(), ctx.AT());
      this.checkHasAtLeastOneOption(
        "HOURS, MINUTES or SECONDS",
        ctx,
        ctx.HOURS(),
        ctx.MINUTES(),
        ctx.SECONDS(),
      );
    }
    this.checkPrerequisiteIsMet(
      ctx.LENGTH(),
      ctx.FMH(),
      ctx,
      "FMH without LENGTH",
    );
    this.checkOptionalWithLength(
      ctx.FROM(),
      ctx.LENGTH(),
      ctx,
      "FROM",
      "LENGTH",
    );
  }

  private checkStartAttach(ctx: Cics_start_attachContext) {
    this.checkHasMandatoryOptions(ctx.ATTACH(), ctx, "ATTACH");
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");
    this.checkOptionalWithLength(
      ctx.FROM(),
      ctx.LENGTH(),
      ctx,
      "FROM",
      "LENGTH",
    );
  }

  private checkStartBrexit(ctx: Cics_start_brexitContext) {
    this.checkHasMandatoryOptions(ctx.BREXIT(), ctx, "BREXIT");
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");

    this.checkPrerequisiteIsMet(
      ctx.BRDATA(),
      ctx.BRDATALENGTH(),
      ctx,
      "BRDATALENGTH without BRDATA",
    );
  }

  private checkStartChannel(ctx: Cics_start_channelContext) {
    this.checkHasMandatoryOptions(ctx.CHANNEL(), ctx, "CHANNEL");
    this.checkHasMandatoryOptions(ctx.TRANSID(), ctx, "TRANSID");

    this.checkMutuallyExclusiveOptions(
      "TERMID or USERID",
      ctx.TERMID(),
      ctx.USERID(),
    );
  }
}
