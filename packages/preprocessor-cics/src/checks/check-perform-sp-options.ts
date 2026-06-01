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
  Cics_perform_dumpContext,
  Cics_perform_endaffinityContext,
  Cics_perform_jvmserverContext,
  Cics_perform_pipelineContext,
  Cics_perform_secdiscoveryContext,
  Cics_perform_securityContext,
  Cics_perform_shutdownContext,
  Cics_perform_sslContext,
  Cics_perform_statisticsContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext, TerminalNode } from "antlr4ng";
import { VisitorUtility } from "./utils";

/** Checks CICS Perform System Command rules for required and invalid options */
export class PerformSpOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_perform;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.DELETSHIPPED, Severity.Warning],
    [CICSLexer.DUMPCODE, Severity.Error],
    [CICSLexer.DUMPID, Severity.Error],
    [CICSLexer.TITLE, Severity.Error],
    [CICSLexer.TITLELENGTH, Severity.Error],
    [CICSLexer.CALLER, Severity.Error],
    [CICSLexer.CALLERLENGTH, Severity.Error],
    [CICSLexer.ENDAFFINITY, Severity.Warning],
    [CICSLexer.NETNAME, Severity.Error],
    [CICSLexer.NETID, Severity.Error],
    [CICSLexer.JVMSERVER, Severity.Error],
    [CICSLexer.JVMTYPE, Severity.Error],
    [CICSLexer.JVM, Severity.Error],
    [CICSLexer.JVMACTION, Severity.Error],
    [CICSLexer.DUMPTYPE, Severity.Error],
    [CICSLexer.ALL, Severity.Warning],
    [CICSLexer.JAVACORE, Severity.Error],
    [CICSLexer.HEAP, Severity.Error],
    [CICSLexer.SNAPTRACE, Severity.Error],
    [CICSLexer.GATHER, Severity.Error],
    [CICSLexer.STACKTRACE, Severity.Error],
    [CICSLexer.GATHERTYPE, Severity.Error],
    [CICSLexer.DIAGNOSTICS, Severity.Error],
    [CICSLexer.TASKID, Severity.Error],
    [CICSLexer.LIBERTY, Severity.Error],
    [CICSLexer.REFRESH, Severity.Error],
    [CICSLexer.OSGI, Severity.Error],
    [CICSLexer.LIBRTYACTION, Severity.Error],
    [CICSLexer.RESOURCETYPE, Severity.Error],
    [CICSLexer.APPID, Severity.Error],
    [CICSLexer.APPIDLEN, Severity.Error],
    [CICSLexer.CONFIG, Severity.Error],
    [CICSLexer.SERVERDUMP, Severity.Error],
    [CICSLexer.OSGIACTION, Severity.Error],
    [CICSLexer.REFRESHPKGS, Severity.Error],
    [CICSLexer.PIPELINE, Severity.Error],
    [CICSLexer.ACTION, Severity.Error],
    [CICSLexer.SCAN, Severity.Error],
    [CICSLexer.RESETTIME, Severity.Warning],
    [CICSLexer.SECDISCOVERY, Severity.Warning],
    [CICSLexer.WRITE, Severity.Error],
    [CICSLexer.SECURITY, Severity.Warning],
    [CICSLexer.REBUILD, Severity.Warning],
    [CICSLexer.ESMRESP, Severity.Error],
    [CICSLexer.SHUTDOWN, Severity.Warning],
    [CICSLexer.PLT, Severity.Error],
    [CICSLexer.PLTNAME, Severity.Error],
    [CICSLexer.SDTRAN, Severity.Error],
    [CICSLexer.NOSDTRAN, Severity.Warning],
    [CICSLexer.NORESTART, Severity.Warning],
    [CICSLexer.TAKEOVER, Severity.Warning],
    [CICSLexer.RESTART, Severity.Warning],
    [CICSLexer.SSL, Severity.Warning],
    [CICSLexer.GSKRESP, Severity.Error],
    [CICSLexer.STATISTICS, Severity.Warning],
    [CICSLexer.RECORD, Severity.Warning],
    [CICSLexer.RESETNOW, Severity.Warning],
    [CICSLexer.ASYNCSERVICE, Severity.Warning],
    [CICSLexer.ATOMSERVICE, Severity.Warning],
    [CICSLexer.AUTOINSTALL, Severity.Warning],
    [CICSLexer.BUNDLE, Severity.Warning],
    [CICSLexer.CAPTURESPEC, Severity.Warning],
    [CICSLexer.CIPHER, Severity.Warning],
    [CICSLexer.CONNECTION, Severity.Warning],
    [CICSLexer.DB2, Severity.Warning],
    [CICSLexer.DISPATCHER, Severity.Warning],
    [CICSLexer.DOCTEMPLATE, Severity.Warning],
    [CICSLexer.ENQUEUE, Severity.Warning],
    [CICSLexer.EPADAPTER, Severity.Warning],
    [CICSLexer.EVENTBINDING, Severity.Warning],
    [CICSLexer.EVENTPROCESS, Severity.Warning],
    [CICSLexer.FEPI, Severity.Warning],
    [CICSLexer.FILE, Severity.Warning],
    [CICSLexer.IPCONN, Severity.Warning],
    [CICSLexer.JOURNALNAME, Severity.Warning],
    [CICSLexer.JOURNALNUM, Severity.Warning],
    [CICSLexer.JVMPROGRAM, Severity.Warning],
    [CICSLexer.LIBRARY, Severity.Warning],
    [CICSLexer.LSRPOOL, Severity.Warning],
    [CICSLexer.MONITOR, Severity.Warning],
    [CICSLexer.MQCONN, Severity.Warning],
    [CICSLexer.MQMONITOR, Severity.Warning],
    [CICSLexer.NODEJSAPP, Severity.Warning],
    [CICSLexer.POLICY, Severity.Warning],
    [CICSLexer.PROGAUTO, Severity.Warning],
    [CICSLexer.PROGRAM, Severity.Warning],
    [CICSLexer.PROGRAMDEF, Severity.Warning],
    [CICSLexer.RECOVERY, Severity.Warning],
    [CICSLexer.STATS, Severity.Warning],
    [CICSLexer.STORAGE, Severity.Warning],
    [CICSLexer.STREAMNAME, Severity.Warning],
    [CICSLexer.SYSDUMP, Severity.Warning],
    [CICSLexer.TABLEMGR, Severity.Warning],
    [CICSLexer.TCPIP, Severity.Warning],
    [CICSLexer.TCPIPSERVICE, Severity.Warning],
    [CICSLexer.TDQUEUE, Severity.Warning],
    [CICSLexer.TERMINAL, Severity.Warning],
    [CICSLexer.TRANCLASS, Severity.Warning],
    [CICSLexer.TCLASS, Severity.Warning],
    [CICSLexer.TRANDUMP, Severity.Warning],
    [CICSLexer.TRANSACTION, Severity.Warning],
    [CICSLexer.TSQUEUE, Severity.Warning],
    [CICSLexer.URIMAP, Severity.Warning],
    [CICSLexer.USER, Severity.Warning],
    [CICSLexer.VTAM, Severity.Warning],
    [CICSLexer.WEBSERVICE, Severity.Warning],
    [CICSLexer.XMLTRANSFORM, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, PerformSpOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Perform System Command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_perform_dump:
        this.checkDump(ctx as unknown as Cics_perform_dumpContext);
        break;
      case CICSParser.RULE_cics_perform_endaffinity:
        this.checkEndAffinity(
          ctx as unknown as Cics_perform_endaffinityContext,
        );
        break;
      case CICSParser.RULE_cics_perform_jvmserver:
        this.checkJvmServer(ctx as unknown as Cics_perform_jvmserverContext);
        break;
      case CICSParser.RULE_cics_perform_pipeline:
        this.checkPipeline(ctx as unknown as Cics_perform_pipelineContext);
        break;
      case CICSParser.RULE_cics_perform_secdiscovery:
        this.checkSecdiscovery(
          ctx as unknown as Cics_perform_secdiscoveryContext,
        );
        break;
      case CICSParser.RULE_cics_perform_security:
        this.checkSecurity(ctx as unknown as Cics_perform_securityContext);
        break;
      case CICSParser.RULE_cics_perform_shutdown:
        this.checkShutdown(ctx as unknown as Cics_perform_shutdownContext);
        break;
      case CICSParser.RULE_cics_perform_ssl:
        this.checkSsl(ctx as unknown as Cics_perform_sslContext);
        break;
      case CICSParser.RULE_cics_perform_statistics:
        this.checkStatistics(ctx as unknown as Cics_perform_statisticsContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkDump(ctx: Cics_perform_dumpContext) {
    this.checkHasMandatoryOptions(ctx.DUMP(), ctx, "DUMP");
    this.checkHasMandatoryOptions(ctx.DUMPCODE(), ctx, "DUMPCODE");
    this.checkAllOptionsArePresentOrAbsent(
      "TITLE, TITLELENGTH",
      ctx,
      ctx.TITLE(),
      ctx.TITLELENGTH(),
    );
    this.checkAllOptionsArePresentOrAbsent(
      "CALLER, CALLERLENGTH",
      ctx,
      ctx.CALLER(),
      ctx.CALLERLENGTH(),
    );
    this.checkDumpDuplicates(ctx.DUMP(), Severity.Warning);
  }

  private checkEndAffinity(ctx: Cics_perform_endaffinityContext) {
    this.checkHasMandatoryOptions(ctx.ENDAFFINITY(), ctx, "ENDAFFINITY");
    this.checkHasMandatoryOptions(ctx.NETNAME(), ctx, "NETNAME");
  }

  private checkJvmServer(ctx: Cics_perform_jvmserverContext) {
    this.checkHasMandatoryOptions(ctx.JVMSERVER(), ctx, "JVMSERVER");
    this.checkHasExactlyOneOption(
      "JVMTYPE or JVM or LIBERTY or OSGI",
      ctx,
      ctx.JVMTYPE(),
      ctx.JVM(),
      ctx.LIBERTY(),
      ctx.OSGI(),
    );
    if (ctx.JVM().length !== 0) {
      this.checkOptsLibertyPresent(ctx);
      this.checkOptsOsgiPresent(ctx);
      this.checkHasMutuallyExclusiveOptions(
        "JVMACTION or DUMP or GATHER or STACKTRACE",
        ctx.JVMACTION(),
        ctx.DUMP(),
        ctx.GATHER(),
        ctx.STACKTRACE(),
      );
      const dumps = ctx.DUMP();
      if (dumps.length !== 0) {
        this.checkDumpDuplicates(dumps, Severity.Error);
        this.checkHasMutuallyExclusiveOptions(
          "DUMPTYPE or ALL or JAVACORE or HEAP or SNAPTRACE",
          ctx.DUMPTYPE(),
          ctx.ALL(),
          ctx.JAVACORE(),
          ctx.HEAP(),
          ctx.SNAPTRACE(),
        );
      } else if (ctx.GATHER().length !== 0) {
        this.checkHasMutuallyExclusiveOptions(
          "GATHERTYPE or DIAGNOSTICS",
          ctx.GATHERTYPE(),
          ctx.DIAGNOSTICS(),
        );
      } else if (ctx.STACKTRACE().length !== 0) {
        this.checkHasMandatoryOptions(ctx.TASKID(), ctx, "TASKID");
      }
    } else if (ctx.LIBERTY().length !== 0) {
      this.checkOptsOsgiPresent(ctx);
      this.checkOptsJvmPresent(ctx);
      this.checkHasMutuallyExclusiveOptions(
        "LIBRTYACTION or REFRESH or SERVERDUMP",
        ctx.LIBRTYACTION(),
        ctx.REFRESH(),
        ctx.SERVERDUMP(),
      );
      if (ctx.REFRESH().length !== 0) {
        this.checkPrerequisiteIsMet(
          ctx.APPLICATION(),
          ctx.APPID(),
          ctx,
          "APPID without APPLICATION",
        );
        this.checkOptionalWithLength(
          ctx.APPID(),
          ctx.APPIDLEN(),
          ctx,
          "APPID",
          "APPIDLEN",
        );
        this.checkHasMutuallyExclusiveOptions(
          "RESOURCETYPE or APPLICATION or CONFIG",
          ctx.RESOURCETYPE(),
          ctx.APPLICATION(),
          ctx.CONFIG(),
        );
      }
    } else if (ctx.OSGI().length !== 0) {
      this.checkOptsJvmPresent(ctx);
      this.checkOptsLibertyPresent(ctx);
      this.checkHasMutuallyExclusiveOptions(
        "OSGIACTION or REFRESHPKGS",
        ctx.OSGIACTION(),
        ctx.REFRESHPKGS(),
      );
    } else
      this.checkOptionalWithLength(
        ctx.APPID(),
        ctx.APPIDLEN(),
        ctx,
        "APPID",
        "APPIDLEN",
      );
  }

  private checkOptsLibertyPresent(ctx: Cics_perform_jvmserverContext) {
    this.checkHasIllegalOptions(ctx.LIBRTYACTION(), "LIBRTYACTION");
    this.checkHasIllegalOptions(ctx.REFRESH(), "REFRESH");
    this.checkHasIllegalOptions(ctx.APPLICATION(), "APPLICATION");
    this.checkHasIllegalOptions(ctx.APPID(), "APPID");
    this.checkHasIllegalOptions(ctx.APPIDLEN(), "APPIDLEN");
    this.checkHasIllegalOptions(ctx.CONFIG(), "CONFIG");
    this.checkHasIllegalOptions(ctx.SERVERDUMP(), "SERVERDUMP");
  }

  private checkOptsOsgiPresent(ctx: Cics_perform_jvmserverContext) {
    this.checkHasIllegalOptions(ctx.OSGIACTION(), "OSGIACTION");
    this.checkHasIllegalOptions(ctx.REFRESHPKGS(), "REFRESHPKGS");
  }

  private checkOptsJvmPresent(ctx: Cics_perform_jvmserverContext) {
    this.checkHasIllegalOptions(ctx.JVMACTION(), "JVMACTION");
    this.checkHasIllegalOptions(ctx.DUMP(), "DUMP");
    this.checkHasIllegalOptions(ctx.DUMPTYPE(), "DUMPTYPE");
    this.checkHasIllegalOptions(ctx.ALL(), "ALL");
    this.checkHasIllegalOptions(ctx.JAVACORE(), "JAVACORE");
    this.checkHasIllegalOptions(ctx.HEAP(), "HEAP");
    this.checkHasIllegalOptions(ctx.SNAPTRACE(), "SNAPTRACE");
    this.checkHasIllegalOptions(ctx.GATHER(), "GATHER");
    this.checkHasIllegalOptions(ctx.GATHERTYPE(), "GATHERTYPE");
    this.checkHasIllegalOptions(ctx.DIAGNOSTICS(), "DIAGNOSTICS");
    this.checkHasIllegalOptions(ctx.STACKTRACE(), "STACKTRACE");
    this.checkHasIllegalOptions(ctx.TASKID(), "TASKID");
  }

  private checkPipeline(ctx: Cics_perform_pipelineContext) {
    this.checkHasMandatoryOptions(ctx.PIPELINE(), ctx, "PIPELINE");
    this.checkHasMutuallyExclusiveOptions(
      "ACTION or SCAN",
      ctx.ACTION(),
      ctx.SCAN(),
    );
  }

  private checkSecdiscovery(ctx: Cics_perform_secdiscoveryContext) {
    this.checkHasMandatoryOptions(ctx.SECDISCOVERY(), ctx, "SECDISCOVERY");
    this.checkHasExactlyOneOption(
      "ACTION or WRITE",
      ctx,
      ctx.ACTION(),
      ctx.WRITE(),
    );
  }

  private checkSecurity(ctx: Cics_perform_securityContext) {
    this.checkHasMandatoryOptions(ctx.SECURITY(), ctx, "SECURITY");
    this.checkHasMandatoryOptions(ctx.REBUILD(), ctx, "REBUILD");
  }

  private checkShutdown(ctx: Cics_perform_shutdownContext) {
    this.checkHasMandatoryOptions(ctx.SHUTDOWN(), ctx, "SHUTDOWN");
    this.checkHasMutuallyExclusiveOptions(
      "SDTRAN or NOSDTRAN",
      ctx.SDTRAN(),
      ctx.NOSDTRAN(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "IMMEDIATE or TAKEOVER",
      ctx.IMMEDIATE(),
      ctx.TAKEOVER(),
    );
    this.checkDumpDuplicates(ctx.DUMP(), Severity.Warning);
    if (ctx.IMMEDIATE().length !== 0) {
      this.checkHasIllegalOptions(ctx.RESTART(), "RESTART");
      this.checkHasIllegalOptions(ctx.XLT(), "XLT");
      this.checkHasIllegalOptions(ctx.PLT(), "PLT");
      this.checkHasIllegalOptions(ctx.PLTNAME(), "PLTNAME");
    } else if (ctx.TAKEOVER().length !== 0) {
      this.checkHasIllegalOptions(ctx.NORESTART(), "NORESTART");
      this.checkHasIllegalOptions(ctx.RESTART(), "RESTART");
      this.checkHasIllegalOptions(ctx.XLT(), "XLT");
      this.checkHasIllegalOptions(ctx.PLT(), "PLT");
      this.checkHasIllegalOptions(ctx.PLTNAME(), "PLTNAME");
    } else {
      this.checkHasMutuallyExclusiveOptions(
        "PLT or PLTNAME",
        ctx.PLT(),
        ctx.PLTNAME(),
      );
      this.checkHasIllegalOptions(ctx.NORESTART(), "NORESTART");
    }
  }

  private checkSsl(ctx: Cics_perform_sslContext) {
    this.checkHasMandatoryOptions(ctx.SSL(), ctx, "SSL");
    this.checkHasMandatoryOptions(ctx.REBUILD(), ctx, "REBUILD");
  }

  private checkStatistics(ctx: Cics_perform_statisticsContext) {
    this.checkHasMandatoryOptions(ctx.STATISTICS(), ctx, "STATISTICS");
    this.checkHasMandatoryOptions(ctx.RECORD(), ctx, "RECORD");
    this.checkPrerequisiteIsMet(
      ctx.ALL(),
      ctx.RESETNOW(),
      ctx,
      "RESETNOW without ALL",
    );
    this.checkHasMutuallyExclusiveOptions(
      "JOURNALNAME or JOURNALNUM",
      ctx.JOURNALNAME(),
      ctx.JOURNALNUM(),
    );
    this.checkHasMutuallyExclusiveOptions(
      "TRANCLASS or TCLASS",
      ctx.TRANCLASS(),
      ctx.TCLASS(),
    );
    this.checkAll(ctx);
  }

  private checkDumpDuplicates(rules: TerminalNode[], severity: Severity) {
    if (rules.length <= 1) return;
    rules.slice(1).forEach((child) => {
      this.throwException(
        severity,
        VisitorUtility.constructLocality(child),
        "Excessive options provided for: ",
        "DUMP",
      );
    });
  }

  private checkAll(ctx: Cics_perform_statisticsContext) {
    if (ctx.children == null || ctx.children.length === 0) return;
    let isAll = false;
    let isResource = false;
    for (const child of ctx.children) {
      if (!(child instanceof TerminalNode)) continue;
      const token = child.symbol.type;
      if (token === CICSLexer.ALL) isAll = true;
      else if (
        token !== CICSLexer.STATISTICS &&
        token !== CICSLexer.RECORD &&
        token !== CICSLexer.RESETNOW
      )
        isResource = true;

      if (isAll && isResource) break;
    }
    if (isAll && isResource) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Option ALL cannot be combined with individual resource types",
        "",
      );
    }
  }
}
