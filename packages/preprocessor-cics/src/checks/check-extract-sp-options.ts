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
  Cics_extract_exitContext,
  Cics_extract_statisticsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";
import { VisitorUtility } from "./utils";

/** Checks CICS Extract System Command rules for required and invalid options */
export class ExtractSpOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX =
    CICSParser.RULE_cics_extract_system_programming;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.EXIT, Severity.Warning],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.ENTRYNAME, Severity.Error],
    [CICSLexer.GALENGTH, Severity.Error],
    [CICSLexer.GASET, Severity.Error],
    [CICSLexer.STATISTICS, Severity.Warning],
    [CICSLexer.RESTYPE, Severity.Error],
    [CICSLexer.RESID, Severity.Error],
    [CICSLexer.RESIDLEN, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.SUBRESTYPE, Severity.Error],
    [CICSLexer.SUBRESID, Severity.Error],
    [CICSLexer.SUBRESIDLEN, Severity.Error],
    [CICSLexer.APPLICATION, Severity.Error],
    [CICSLexer.APPLMAJORVER, Severity.Error],
    [CICSLexer.APPLMINORVER, Severity.Error],
    [CICSLexer.APPLMICROVER, Severity.Error],
    [CICSLexer.PLATFORM, Severity.Error],
    [CICSLexer.LASTRESET, Severity.Error],
    [CICSLexer.LASTRESETABS, Severity.Error],
    [CICSLexer.LASTRESETHRS, Severity.Error],
    [CICSLexer.LASTRESETMIN, Severity.Error],
    [CICSLexer.LASTRESETSEC, Severity.Error],
    // RESTYPE options
    [CICSLexer.ASYNCSERVICE, Severity.Warning],
    [CICSLexer.ATOMSERVICE, Severity.Warning],
    [CICSLexer.BUNDLE, Severity.Warning],
    [CICSLexer.DB2CONN, Severity.Warning],
    [CICSLexer.DB2ENTRY, Severity.Warning],
    [CICSLexer.DISPATCHER, Severity.Warning],
    [CICSLexer.DOCTEMPLATE, Severity.Warning],
    [CICSLexer.EPADAPTER, Severity.Warning],
    [CICSLexer.ENQUEUE, Severity.Warning],
    [CICSLexer.EVENTBINDING, Severity.Warning],
    [CICSLexer.EVENTPROCESS, Severity.Warning],
    [CICSLexer.FILE, Severity.Warning],
    [CICSLexer.IPCONN, Severity.Warning],
    [CICSLexer.JOURNALNAME, Severity.Warning],
    [CICSLexer.JVMPROGRAM, Severity.Warning],
    [CICSLexer.JVMSERVER, Severity.Warning],
    [CICSLexer.LIBRARY, Severity.Warning],
    [CICSLexer.LSRPOOL, Severity.Warning],
    [CICSLexer.MONITOR, Severity.Warning],
    [CICSLexer.MQCONN, Severity.Warning],
    [CICSLexer.MQMONITOR, Severity.Warning],
    [CICSLexer.MVSTCB, Severity.Warning],
    [CICSLexer.NODEJSAPP, Severity.Warning],
    [CICSLexer.PIPELINE, Severity.Warning],
    [CICSLexer.POLICY, Severity.Warning],
    [CICSLexer.PROGAUTO, Severity.Warning],
    [CICSLexer.PROGRAMDEF, Severity.Warning],
    [CICSLexer.RECOVERY, Severity.Warning],
    [CICSLexer.SECURITY, Severity.Warning],
    [CICSLexer.STATS, Severity.Warning],
    [CICSLexer.STORAGE, Severity.Warning],
    [CICSLexer.STREAMNAME, Severity.Warning],
    [CICSLexer.SUBPOOL, Severity.Warning],
    [CICSLexer.SYSDUMPCODE, Severity.Warning],
    [CICSLexer.TASKSUBPOOL, Severity.Warning],
    [CICSLexer.TCPIP, Severity.Warning],
    [CICSLexer.TCPIPSERVICE, Severity.Warning],
    [CICSLexer.TDQUEUE, Severity.Warning],
    [CICSLexer.TRANCLASS, Severity.Warning],
    [CICSLexer.TRANDUMPCODE, Severity.Warning],
    [CICSLexer.TRANSACTION, Severity.Warning],
    [CICSLexer.TSQUEUE, Severity.Warning],
    [CICSLexer.URIMAP, Severity.Warning],
    [CICSLexer.USER, Severity.Warning],
    [CICSLexer.WEBSERVICE, Severity.Warning],
    [CICSLexer.XMLTRANSFORM, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ExtractSpOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Extract System Command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_extract_exit:
        this.checkExtractExit(ctx as unknown as Cics_extract_exitContext);
        break;
      case CICSParser.RULE_cics_extract_statistics:
        this.checkExtractStatistics(
          ctx as unknown as Cics_extract_statisticsContext,
        );
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkExtractExit(ctx: Cics_extract_exitContext) {
    this.checkHasMandatoryOptions(ctx.EXIT(), ctx, "EXIT");
    this.checkHasMandatoryOptions(ctx.GALENGTH(), ctx, "GALENGTH");
    this.checkHasMandatoryOptions(ctx.GASET(), ctx, "GASET");
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
  }

  private checkExtractStatistics(ctx: Cics_extract_statisticsContext) {
    this.checkHasMandatoryOptions(ctx.STATISTICS(), ctx, "STATISTICS");
    this.checkRestypeOptions(ctx);
    this.checkHasMandatoryOptions(ctx.SET(), ctx, "SET");
    if (ctx.RESID().length === 0) {
      this.checkForResidRequiredOptions(ctx);
    } else {
      this.checkAllOptionsArePresentOrAbsent(
        "APPLICATION, APPLMAJORVER, APPLMINORVER, APPLMICROVER, PLATFORM",
        ctx,
        ctx.APPLICATION(),
        ctx.APPLMAJORVER(),
        ctx.APPLMINORVER(),
        ctx.APPLMICROVER(),
        ctx.PLATFORM(),
      );
    }
    this.checkSubResidOptions(ctx);
    this.checkLastTimeOptions(ctx);
    if (this.noLengthOptionsEnabled()) {
      if (ctx.RESID().length !== 0)
        this.checkHasMandatoryOptions(ctx.RESIDLEN(), ctx, "RESIDLEN");
      if (ctx.SUBRESID().length !== 0)
        this.checkHasMandatoryOptions(ctx.SUBRESIDLEN(), ctx, "SUBRESIDLEN");
    }
  }

  /**
   * Helper function to enforce mutually exclusive RESTYPE options
   */
  private checkRestypeOptions(ctx: Cics_extract_statisticsContext) {
    const restypes = ctx.cics_restype();
    this.checkHasMandatoryOptions(restypes, ctx, "RESTYPE");
    const distinctOptions = new Set(
      restypes.map((node) => (node.getChild(0) as TerminalNode).symbol.type),
    ).size;

    if (distinctOptions > 1) {
      restypes.forEach((node) =>
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(node),
          "Multiple RESTYPE options are not allowed",
          "",
        ),
      );
    }
  }

  private checkForResidRequiredOptions(ctx: Cics_extract_statisticsContext) {
    this.checkHasIllegalOptions(ctx.RESIDLEN(), "RESIDLEN without RESID");
    this.checkHasIllegalOptions(ctx.APPLICATION(), "APPLICATION without RESID");
    this.checkHasIllegalOptions(
      ctx.APPLMAJORVER(),
      "APPLMAJORVER without RESID",
    );
    this.checkHasIllegalOptions(
      ctx.APPLMINORVER(),
      "APPLMINORVER without RESID",
    );
    this.checkHasIllegalOptions(
      ctx.APPLMICROVER(),
      "APPLMICROVER without RESID",
    );
    this.checkHasIllegalOptions(ctx.PLATFORM(), "PLATFORM without RESID");
  }

  private checkSubResidOptions(ctx: Cics_extract_statisticsContext) {
    const subrestypes = ctx.cics_subrestype();
    if (ctx.SUBRESID().length === 0) {
      this.checkHasIllegalOptions(
        ctx.SUBRESIDLEN(),
        "SUBRESIDLEN without SUBRESID",
      );
      this.checkHasIllegalOptions(subrestypes, "SUBRESTYPE without SUBRESID");
    }
    const subrestype = subrestypes
      .map((node) => node.SUBRESTYPE())
      .filter((node): node is TerminalNode => node != null);
    const capturespec = subrestypes
      .map((node) => node.CAPTURESPEC())
      .filter((node): node is TerminalNode => node != null);
    const policyrule = subrestypes
      .map((node) => node.POLICYRULE())
      .filter((node): node is TerminalNode => node != null);

    this.checkHasMutuallyExclusiveOptions(
      "SUBRESTYPE or CAPTURESPEC or POLICYRULE",
      subrestype,
      capturespec,
      policyrule,
    );

    if (subrestypes.length === 0) {
      this.checkHasIllegalOptions(
        ctx.SUBRESID(),
        "SUBRESID without SUBRESTYPE",
      );
      this.checkHasIllegalOptions(
        ctx.SUBRESIDLEN(),
        "SUBRESIDLEN without SUBRESTYPE",
      );
    }
  }

  private checkLastTimeOptions(ctx: Cics_extract_statisticsContext) {
    if (ctx.LASTRESET().length !== 0) {
      this.checkHasIllegalOptions(
        ctx.LASTRESETABS(),
        "LASTRESETABS with LASTRESET",
      );
      this.checkHasIllegalOptions(
        ctx.LASTRESETHRS(),
        "LASTRESETHRS with LASTRESET",
      );
      this.checkHasIllegalOptions(
        ctx.LASTRESETMIN(),
        "LASTRESETMIN with LASTRESET",
      );
      this.checkHasIllegalOptions(
        ctx.LASTRESETSEC(),
        "LASTRESETSEC with LASTRESET",
      );
    }
    if (ctx.LASTRESETABS().length !== 0) {
      this.checkHasIllegalOptions(
        ctx.LASTRESET(),
        "LASTRESET with LASTRESETABS",
      );
      this.checkHasIllegalOptions(
        ctx.LASTRESETHRS(),
        "LASTRESETHRS with LASTRESETABS",
      );
      this.checkHasIllegalOptions(
        ctx.LASTRESETMIN(),
        "LASTRESETMIN with LASTRESETABS",
      );
      this.checkHasIllegalOptions(
        ctx.LASTRESETSEC(),
        "LASTRESETSEC with LASTRESETABS",
      );
    }
    this.checkAllOptionsArePresentOrAbsent(
      "LASTRESETHRS, LASTRESETMIN, LASTRESETSEC",
      ctx,
      ctx.LASTRESETHRS(),
      ctx.LASTRESETMIN(),
      ctx.LASTRESETSEC(),
    );
  }
}
