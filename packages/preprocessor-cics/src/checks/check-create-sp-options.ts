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
  Cics_create_optsContext,
  Cics_data_valueContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";
import { VisitorUtility } from "./utils";

/** Checks CICS Create System Command rules for required and invalid options */
export class CreateSpOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_create;

  private static readonly COMMANDS_WITH_DISCARD_COMPLETE_OPTS = [
    CICSLexer.TERMINAL,
    CICSLexer.CONNECTION,
  ];

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ATOMSERVICE, Severity.Error],
    [CICSLexer.BUNDLE, Severity.Error],
    [CICSLexer.DB2CONN, Severity.Error],
    [CICSLexer.DB2ENTRY, Severity.Error],
    [CICSLexer.DB2TRAN, Severity.Error],
    [CICSLexer.DOCTEMPLATE, Severity.Error],
    [CICSLexer.DUMPCODE, Severity.Error],
    [CICSLexer.ENQMODEL, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.PIPELINE, Severity.Error],
    [CICSLexer.IPCONN, Severity.Error],
    [CICSLexer.JOURNALMODEL, Severity.Error],
    [CICSLexer.JVMSERVER, Severity.Error],
    [CICSLexer.LIBRARY, Severity.Error],
    [CICSLexer.LSRPOOL, Severity.Error],
    [CICSLexer.MAPSET, Severity.Error],
    [CICSLexer.MQCONN, Severity.Error],
    [CICSLexer.MQMONITOR, Severity.Error],
    [CICSLexer.PARTITIONSET, Severity.Error],
    [CICSLexer.PARTNER, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROFILE, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.TDQUEUE, Severity.Error],
    [CICSLexer.TRANCLASS, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Error],
    [CICSLexer.TSMODEL, Severity.Error],
    [CICSLexer.TYPETERM, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.WEBSERVICE, Severity.Error],
    [CICSLexer.SESSIONS, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.CONNECTION, Severity.Error],
    [CICSLexer.ATTRIBUTES, Severity.Error],
    [CICSLexer.ATTRLEN, Severity.Error],
    [CICSLexer.DISCARD, Severity.Warning],
    [CICSLexer.COMPLETE, Severity.Warning],
    [CICSLexer.LOG, Severity.Warning],
    [CICSLexer.NOLOG, Severity.Warning],
    [CICSLexer.LOGMESSAGE, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, CreateSpOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Create System Command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.ruleIndex === CICSParser.RULE_cics_create_opts)
      this.checkOpts(ctx as unknown as Cics_create_optsContext);

    this.checkDuplicates(ctx);
  }

  private checkOpts(ctx: Cics_create_optsContext) {
    this.checkHasExactlyOneOption(
      "ATOMSERVICE or BUNDLE or DB2CONN or DB2ENTRY or DB2TRAN or DOCTEMPLATE or DUMPCODE or" +
        " ENQMODEL or FILEPIPELINE or IPCONN or JOURNALMODEL or JVMSERVER or LIBRARY or" +
        " LSRPOOL or MAPSET or MQCONN or MQMONITOR or PARTITIONSET or PARTNERPROCESSTYPE or" +
        " PROFILE or PROGRAM or TCPIPSERVICE or TDQUEUE or TRANCLASS or TRANSACTION or" +
        " TSMODEL or TYPETERM or URIMAP or WEBSERVICESESSIONS or TERMINAL or CONNECTION",
      ctx,
      ctx.ATOMSERVICE(),
      ctx.BUNDLE(),
      ctx.DB2CONN(),
      ctx.DB2ENTRY(),
      ctx.DB2TRAN(),
      ctx.DOCTEMPLATE(),
      ctx.DUMPCODE(),
      ctx.ENQMODEL(),
      ctx.FILE(),
      ctx.PIPELINE(),
      ctx.IPCONN(),
      ctx.JOURNALMODEL(),
      ctx.JVMSERVER(),
      ctx.LIBRARY(),
      ctx.LSRPOOL(),
      ctx.MAPSET(),
      ctx.MQCONN(),
      ctx.MQMONITOR(),
      ctx.PARTITIONSET(),
      ctx.PARTNER(),
      ctx.PROCESSTYPE(),
      ctx.PROFILE(),
      ctx.PROGRAM(),
      ctx.TCPIPSERVICE(),
      ctx.TDQUEUE(),
      ctx.TRANCLASS(),
      ctx.TRANSACTION(),
      ctx.TSMODEL(),
      ctx.TYPETERM(),
      ctx.URIMAP(),
      ctx.WEBSERVICE(),
      ctx.SESSIONS(),
      ctx.TERMINAL(),
      ctx.CONNECTION(),
    );

    if (ctx.CONNECTION().length !== 0 || ctx.TERMINAL().length !== 0) {
      this.checkHasExactlyOneOption(
        "ATTRIBUTES or COMPLETE or DISCARD",
        ctx,
        ctx.ATTRIBUTES(),
        ctx.COMPLETE(),
        ctx.DISCARD(),
      );
      if (ctx.DISCARD().length !== 0 || ctx.COMPLETE().length !== 0) {
        this.checkHasIllegalOptions(ctx.ATTRLEN(), "ATTRLEN");
        this.checkHasIllegalOptions(ctx.LOG(), "LOG");
        this.checkHasIllegalOptions(ctx.NOLOG(), "NOLOG");
        this.checkHasIllegalOptions(ctx.LOGMESSAGE(), "LOGMESSAGE");
        this.checkDataValueCompleteDiscard(ctx);
      } else {
        this.checkRequiredSubOperand(ctx);
      }
    } else {
      this.checkHasIllegalOptions(ctx.DISCARD(), "DISCARD");
      this.checkHasIllegalOptions(ctx.COMPLETE(), "COMPLETE");
      this.checkHasMandatoryOptions(ctx.ATTRIBUTES(), ctx, "ATTRIBUTES");
    }
    this.checkHasMutuallyExclusiveOptions(
      "LOG or NOLOG or LOGMESSAGE",
      ctx.LOG(),
      ctx.NOLOG(),
      ctx.LOGMESSAGE(),
    );
  }

  private checkDataValueCompleteDiscard(ctx: Cics_create_optsContext) {
    if (ctx.children == null) return;
    for (let index = 0; index < ctx.children.length - 1; index++) {
      if (
        !(ctx.children[index] instanceof TerminalNode) ||
        !(ctx.children[index + 1] instanceof Cics_data_valueContext)
      )
        continue;
      const tokenIndex = (ctx.children[index] as TerminalNode).symbol.type;
      if (
        CreateSpOptionsChecker.COMMANDS_WITH_DISCARD_COMPLETE_OPTS.includes(
          tokenIndex,
        )
      ) {
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(ctx.children[index]),
          "",
          "Operand value not allowed",
        );
      }
    }
  }

  private checkRequiredSubOperand(ctx: Cics_create_optsContext) {
    if (ctx.children == null) return;
    for (let index = 0; index < ctx.children.length; index++) {
      if (
        !(ctx.children[index] instanceof TerminalNode) ||
        (index + 1 < ctx.children.length &&
          ctx.children[index + 1] instanceof Cics_data_valueContext)
      )
        continue;
      const tokenIndex = (ctx.children[index] as TerminalNode).symbol.type;
      if (
        CreateSpOptionsChecker.COMMANDS_WITH_DISCARD_COMPLETE_OPTS.includes(
          tokenIndex,
        )
      ) {
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(ctx.children[index]),
          "",
          "Operand value required",
        );
      }
    }
  }
}
