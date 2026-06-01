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
  Cics_wait_convidContext,
  Cics_wait_eventContext,
  Cics_wait_externalContext,
  Cics_wait_journalnameContext,
  Cics_wait_terminalContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class WaitOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_wait;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.WAIT, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.EVENT, Severity.Error],
    [CICSLexer.ECADDR, Severity.Error],
    [CICSLexer.NAME, Severity.Error],
    [CICSLexer.EXTERNAL, Severity.Error],
    [CICSLexer.ECBLIST, Severity.Error],
    [CICSLexer.NUMEVENTS, Severity.Error],
    [CICSLexer.PURGEABILITY, Severity.Error],
    [CICSLexer.PURGEABLE, Severity.Error],
    [CICSLexer.NOTPURGEABLE, Severity.Error],
    [CICSLexer.JOURNALNAME, Severity.Error],
    [CICSLexer.JOURNALNUM, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.SIGNAL, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WaitOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Wait rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_wait_convid:
        this.checkConvid(ctx as unknown as Cics_wait_convidContext);
        break;
      case CICSParser.RULE_cics_wait_event:
        this.checkEvent(ctx as unknown as Cics_wait_eventContext);
        break;
      case CICSParser.RULE_cics_wait_external:
        this.checkExternal(ctx as unknown as Cics_wait_externalContext);
        break;
      case CICSParser.RULE_cics_wait_journalname:
        this.checkJournalName(ctx as unknown as Cics_wait_journalnameContext);
        break;
      case CICSParser.RULE_cics_wait_terminal:
        this.checkTerminal(ctx as unknown as Cics_wait_terminalContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkConvid(ctx: Cics_wait_convidContext) {
    this.checkHasMandatoryOptions(ctx.CONVID(), ctx, "CONVID");
  }

  private checkEvent(ctx: Cics_wait_eventContext) {
    this.checkHasMandatoryOptions(ctx.EVENT(), ctx, "EVENT");
    this.checkHasMandatoryOptions(ctx.ECADDR(), ctx, "ECADDR");
  }

  private checkExternal(ctx: Cics_wait_externalContext) {
    this.checkHasMandatoryOptions(ctx.EXTERNAL(), ctx, "EXTERNAL");
    this.checkHasMandatoryOptions(ctx.ECBLIST(), ctx, "ECBLIST");
    this.checkHasMandatoryOptions(ctx.NUMEVENTS(), ctx, "NUMEVENTS");

    this.checkHasMutuallyExclusiveOptions(
      "PURGEABLE or PURGEABILITY or NOTPURGEABLE",
      ctx.PURGEABLE(),
      ctx.PURGEABILITY(),
      ctx.NOTPURGEABLE(),
    );
  }

  private checkJournalName(ctx: Cics_wait_journalnameContext) {
    this.checkHasExactlyOneOption(
      "JOURNALNAME or JORUNALNUM",
      ctx,
      ctx.JOURNALNAME(),
      ctx.JOURNALNUM(),
    );
  }

  private checkTerminal(ctx: Cics_wait_terminalContext) {
    this.checkHasMandatoryOptions(ctx.TERMINAL(), ctx, "TERMINAL");
    this.checkHasMutuallyExclusiveOptions(
      "SESSION or CONVID",
      ctx.SESSION(),
      ctx.CONVID(),
    );
  }
}
