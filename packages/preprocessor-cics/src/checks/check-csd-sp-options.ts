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
  Cics_csd_addContext,
  Cics_csd_alterContext,
  Cics_csd_appendContext,
  Cics_csd_copyContext,
  Cics_csd_defineContext,
  Cics_csd_deleteContext,
  Cics_csd_getnextgroupContext,
  Cics_csd_getnextlistContext,
  Cics_csd_getnextrsrceContext,
  Cics_csd_inquiregroupContext,
  Cics_csd_inquirelistContext,
  Cics_csd_inquirersrceContext,
  Cics_csd_installContext,
  Cics_csd_lockContext,
  Cics_csd_removeContext,
  Cics_csd_renameContext,
  Cics_csd_startbrrsrceContext,
  Cics_csd_unlockContext,
  Cics_csd_userdefineContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";
import { VisitorUtility } from "./utils";

/** Checks CICS CSD System Command rules for required and invalid options */
export class CsdSpOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_csd;

  private static readonly MISSING_ATTRBUTES_OR_SET =
    "Missing required option for ATTRLEN: ATTRIBUTES or SET";

  private static readonly CVDA_OPTS =
    "RESTYPE or ATOMSERVICE or BUNDLE or CONNECTION or CORBASERVER or DB2CONN or DB2ENTRY or" +
    " DB2TRAN or DJAR or DOCTEMPLATE or DUMPCODE or ENQMODEL or FILE or IPCONN or" +
    " JOURNALMODEL or JVMSERVER or LIBRARY or LSRPOOL or MAPSET or MQCONN or MQMONITOR or" +
    " PARTITIONSET or PARTNER or PIPELINE or PROCESSTYPE or PROFILE or PROGRAM or" +
    " REQUESTMODEL or SESSIONS or TCPIPSERVICE or TDQUEUE or TERMINAL or TRANCLASS or" +
    " TRANSACTION or TSMODEL or TYPETERM or URIMAP or WEBSERVICE";

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ADD, Severity.Warning],
    [CICSLexer.GROUP, Severity.Error],
    [CICSLexer.LIST, Severity.Error],
    [CICSLexer.BEFORE, Severity.Error],
    [CICSLexer.AFTER, Severity.Error],
    [CICSLexer.ALTER, Severity.Warning],
    [CICSLexer.ATTRLEN, Severity.Error],
    [CICSLexer.NOCOMPAT, Severity.Error],
    [CICSLexer.COMPATMODE, Severity.Error],
    [CICSLexer.COMPAT, Severity.Error],
    [CICSLexer.RESTYPE, Severity.Error],
    [CICSLexer.RESID, Severity.Error],
    [CICSLexer.ATOMSERVICE, Severity.Error],
    [CICSLexer.BUNDLE, Severity.Error],
    [CICSLexer.CONNECTION, Severity.Error],
    [CICSLexer.CORBASERVER, Severity.Error],
    [CICSLexer.DB2CONN, Severity.Error],
    [CICSLexer.DB2ENTRY, Severity.Error],
    [CICSLexer.DB2TRAN, Severity.Error],
    [CICSLexer.DJAR, Severity.Error],
    [CICSLexer.DOCTEMPLATE, Severity.Error],
    [CICSLexer.DUMPCODE, Severity.Error],
    [CICSLexer.ENQMODEL, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
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
    [CICSLexer.PIPELINE, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROFILE, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.REQUESTMODEL, Severity.Error],
    [CICSLexer.SESSIONS, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.TDQUEUE, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.TRANCLASS, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Error],
    [CICSLexer.TSMODEL, Severity.Error],
    [CICSLexer.TYPETERM, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.WEBSERVICE, Severity.Error],
    [CICSLexer.APPEND, Severity.Warning],
    [CICSLexer.TO, Severity.Error],
    [CICSLexer.AS, Severity.Error],
    [CICSLexer.COPY, Severity.Warning],
    [CICSLexer.DUPERROR, Severity.Error],
    [CICSLexer.DUPACTION, Severity.Error],
    [CICSLexer.DUPNOREPLACE, Severity.Error],
    [CICSLexer.DUPREPLACE, Severity.Error],
    [CICSLexer.DEFINE, Severity.Warning],
    [CICSLexer.LISTACTION, Severity.Error],
    [CICSLexer.REMOVE, Severity.Error],
    [CICSLexer.DISCONNECT, Severity.Warning],
    [CICSLexer.ENDBRGROUP, Severity.Warning],
    [CICSLexer.ENDBRLIST, Severity.Warning],
    [CICSLexer.GETNEXTGROUP, Severity.Warning],
    [CICSLexer.GETNEXTLIST, Severity.Warning],
    [CICSLexer.GETNEXTRSRCE, Severity.Warning],
    [CICSLexer.ENDBRRSRCE, Severity.Warning],
    [CICSLexer.ATTRIBUTES, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.INQUIREGROUP, Severity.Warning],
    [CICSLexer.INQUIRELIST, Severity.Warning],
    [CICSLexer.INQUIRERSRCE, Severity.Warning],
    [CICSLexer.INSTALL, Severity.Warning],
    [CICSLexer.LOCK, Severity.Warning],
    [CICSLexer.RENAME, Severity.Warning],
    [CICSLexer.STARTBRGROUP, Severity.Warning],
    [CICSLexer.STARTBRLIST, Severity.Warning],
    [CICSLexer.STARTBRRSRCE, Severity.Warning],
    [CICSLexer.UNLOCK, Severity.Warning],
    [CICSLexer.USERDEFINE, Severity.Warning],
    [CICSLexer.DELETE, Severity.Warning],
  ]);

  private static readonly DUPLICATE_RULE_OPTIONS = new Map<number, string>([
    [
      CICSParser.RULE_cics_csd_cvda,
      "RESTYPE , ATOMSERVICE , BUNDLE , CONNECTION , CORBASERVER , DB2CONN , DB2ENTRY ," +
        " DB2TRAN , DJAR , DOCTEMPLATE , DUMPCODE ,ENQMODEL , FILE , IPCONN ," +
        " JOURNALMODEL , JVMSERVER , LIBRARY , LSRPOOL , MAPSET , MQCONN , MQMONITOR ," +
        " PARTITIONSET , PARTNER , PIPELINE ,PROCESSTYPE , PROFILE , PROGRAM ," +
        " REQUESTMODEL , SESSIONS , TCPIPSERVICE , TDQUEUE , TERMINAL , TRANCLASS ," +
        " TRANSACTION , TSMODEL , TYPETERM , URIMAP , WEBSERVICE",
    ],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, CsdSpOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS CSD System Command rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_csd_add:
        this.checkAdd(ctx as unknown as Cics_csd_addContext);
        break;
      case CICSParser.RULE_cics_csd_alter:
        this.checkAlter(ctx as unknown as Cics_csd_alterContext);
        break;
      case CICSParser.RULE_cics_csd_append:
        this.checkAppend(ctx as unknown as Cics_csd_appendContext);
        break;
      case CICSParser.RULE_cics_csd_copy:
        this.checkCopy(ctx as unknown as Cics_csd_copyContext);
        break;
      case CICSParser.RULE_cics_csd_define:
        this.checkDefine(ctx as unknown as Cics_csd_defineContext);
        break;
      case CICSParser.RULE_cics_csd_delete:
        this.checkDelete(ctx as unknown as Cics_csd_deleteContext);
        break;
      case CICSParser.RULE_cics_csd_getnextgroup:
        this.checkGetNextGroup(ctx as unknown as Cics_csd_getnextgroupContext);
        break;
      case CICSParser.RULE_cics_csd_getnextlist:
        this.checkGetNextList(ctx as unknown as Cics_csd_getnextlistContext);
        break;
      case CICSParser.RULE_cics_csd_getnextrsrce:
        this.checkGetNextRsrce(ctx as unknown as Cics_csd_getnextrsrceContext);
        break;
      case CICSParser.RULE_cics_csd_inquiregroup:
        this.checkInquireGroup(ctx as unknown as Cics_csd_inquiregroupContext);
        break;
      case CICSParser.RULE_cics_csd_inquirelist:
        this.checkInquireList(ctx as unknown as Cics_csd_inquirelistContext);
        break;
      case CICSParser.RULE_cics_csd_inquirersrce:
        this.checkInquireRsrce(ctx as unknown as Cics_csd_inquirersrceContext);
        break;
      case CICSParser.RULE_cics_csd_install:
        this.checkInstall(ctx as unknown as Cics_csd_installContext);
        break;
      case CICSParser.RULE_cics_csd_lock:
        this.checkLock(ctx as unknown as Cics_csd_lockContext);
        break;
      case CICSParser.RULE_cics_csd_remove:
        this.checkRemove(ctx as unknown as Cics_csd_removeContext);
        break;
      case CICSParser.RULE_cics_csd_rename:
        this.checkRename(ctx as unknown as Cics_csd_renameContext);
        break;
      case CICSParser.RULE_cics_csd_startbrrsrce:
        this.checkStartbrRsrce(ctx as unknown as Cics_csd_startbrrsrceContext);
        break;
      case CICSParser.RULE_cics_csd_unlock:
        this.checkUnlock(ctx as unknown as Cics_csd_unlockContext);
        break;
      case CICSParser.RULE_cics_csd_userdefine:
        this.checkUserDefine(ctx as unknown as Cics_csd_userdefineContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx, undefined, CsdSpOptionsChecker.DUPLICATE_RULE_OPTIONS);
  }

  private checkAdd(ctx: Cics_csd_addContext) {
    this.checkHasMandatoryOptions(ctx.ADD(), ctx, "ADD");
    this.checkHasMandatoryOptions(ctx.LIST(), ctx, "LIST");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMutuallyExclusiveOptions(
      "BEFORE or AFTER",
      ctx.BEFORE(),
      ctx.AFTER(),
    );
  }

  private checkAlter(ctx: Cics_csd_alterContext) {
    this.checkHasMandatoryOptions(ctx.ALTER(), ctx, "ALTER");
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMandatoryOptions(ctx.ATTRIBUTES(), ctx, "ATTRIBUTES");
    this.checkHasMutuallyExclusiveOptions(
      "NOCOMPAT or COMPATMODE or COMPAT",
      ctx.NOCOMPAT(),
      ctx.COMPATMODE(),
      ctx.COMPAT(),
    );
    this.checkHasMandatoryOptions(
      ctx.cics_csd_cvda(),
      ctx,
      CsdSpOptionsChecker.CVDA_OPTS,
    );
    if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.ATTRLEN(), ctx, "ATTRLEN");
  }

  private checkAppend(ctx: Cics_csd_appendContext) {
    this.checkHasMandatoryOptions(ctx.APPEND(), ctx, "APPEND");
    this.checkHasMandatoryOptions(ctx.LIST(), ctx, "LIST");
    this.checkHasMandatoryOptions(ctx.TO(), ctx, "TO");
  }

  private checkCopy(ctx: Cics_csd_copyContext) {
    this.checkHasMandatoryOptions(ctx.COPY(), ctx, "COPY");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMutuallyExclusiveOptions(
      "DUPERROR or DUPACTION or DUPNOREPLACE or DUPREPLACE",
      ctx.DUPERROR(),
      ctx.DUPACTION(),
      ctx.DUPNOREPLACE(),
      ctx.DUPREPLACE(),
    );
    this.checkHasExactlyOneOption("AS or TO", ctx, ctx.AS(), ctx.TO());
    if (ctx.cics_csd_cvda().length !== 0) {
      this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    } else if (ctx.AS().length !== 0 || ctx.RESID().length !== 0) {
      this.checkHasMandatoryOptions(
        ctx.cics_csd_cvda(),
        ctx,
        CsdSpOptionsChecker.CVDA_OPTS,
      );
    }
  }

  private checkDefine(ctx: Cics_csd_defineContext) {
    this.checkHasMandatoryOptions(ctx.DEFINE(), ctx, "DEFINE");
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMandatoryOptions(ctx.ATTRIBUTES(), ctx, "ATTRIBUTES");
    this.checkHasMutuallyExclusiveOptions(
      "NOCOMPAT or COMPATMODE or COMPAT",
      ctx.NOCOMPAT(),
      ctx.COMPATMODE(),
      ctx.COMPAT(),
    );
    this.checkHasMandatoryOptions(
      ctx.cics_csd_cvda(),
      ctx,
      CsdSpOptionsChecker.CVDA_OPTS,
    );
  }

  private checkDelete(ctx: Cics_csd_deleteContext) {
    this.checkHasMandatoryOptions(ctx.DELETE(), ctx, "DELETE");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMutuallyExclusiveOptions(
      "LISTACTION or REMOVE",
      ctx.LISTACTION(),
      ctx.REMOVE(),
    );
    this.checkAllOptionsArePresentOrAbsent(
      "RESID and any of " + CsdSpOptionsChecker.CVDA_OPTS,
      ctx,
      ctx.RESID(),
      ctx.cics_csd_cvda(),
    );
  }

  private checkGetNextGroup(ctx: Cics_csd_getnextgroupContext) {
    this.checkHasMandatoryOptions(ctx.GETNEXTGROUP(), ctx, "GETNEXTGROUP");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
  }

  private checkGetNextList(ctx: Cics_csd_getnextlistContext) {
    this.checkHasMandatoryOptions(ctx.GETNEXTLIST(), ctx, "GETNEXTLIST");
    this.checkHasMandatoryOptions(ctx.LIST(), ctx, "LIST");
  }

  private checkGetNextRsrce(ctx: Cics_csd_getnextrsrceContext) {
    this.checkHasMandatoryOptions(ctx.GETNEXTRSRCE(), ctx, "GETNEXTRSRCE");
    this.checkHasMandatoryOptions(ctx.RESTYPE(), ctx, "RESTYPE");
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMutuallyExclusiveOptions(
      "ATTRIBUTES or SET",
      ctx.ATTRIBUTES(),
      ctx.ATTRIBUTES(),
      ctx.SET(),
    );
    if (
      ctx.ATTRLEN().length !== 0 &&
      ctx.ATTRIBUTES().length === 0 &&
      ctx.SET().length === 0
    ) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        CsdSpOptionsChecker.MISSING_ATTRBUTES_OR_SET,
        "",
      );
    }
    if (ctx.ATTRIBUTES().length === 0)
      this.checkAllOptionsArePresentOrAbsent(
        "SET, ATTRLEN",
        ctx,
        ctx.SET(),
        ctx.ATTRLEN(),
      );
    else if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.ATTRLEN(), ctx, "ATTRLEN");
  }

  private checkInquireGroup(ctx: Cics_csd_inquiregroupContext) {
    this.checkHasMandatoryOptions(ctx.INQUIREGROUP(), ctx, "INQUIREGROUP");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
  }

  private checkInquireList(ctx: Cics_csd_inquirelistContext) {
    this.checkHasMandatoryOptions(ctx.INQUIRELIST(), ctx, "INQUIRELIST");
    this.checkHasMandatoryOptions(ctx.LIST(), ctx, "LIST");
  }

  private checkInquireRsrce(ctx: Cics_csd_inquirersrceContext) {
    this.checkHasMandatoryOptions(ctx.INQUIRERSRCE(), ctx, "INQUIRERSRCE");
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMandatoryOptions(
      ctx.cics_csd_cvda(),
      ctx,
      CsdSpOptionsChecker.CVDA_OPTS,
    );
    this.checkHasExactlyOneOption(
      "ATTRIBUTES or SET",
      ctx,
      ctx.ATTRIBUTES(),
      ctx.SET(),
    );
    if (
      ctx.ATTRLEN().length !== 0 &&
      ctx.ATTRIBUTES().length === 0 &&
      ctx.SET().length === 0
    ) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        CsdSpOptionsChecker.MISSING_ATTRBUTES_OR_SET,
        "",
      );
    }
    if (ctx.ATTRIBUTES().length === 0)
      this.checkAllOptionsArePresentOrAbsent(
        "SET, ATTRLEN",
        ctx,
        ctx.SET(),
        ctx.ATTRLEN(),
      );
    else if (this.noLengthOptionsEnabled())
      this.checkHasMandatoryOptions(ctx.ATTRLEN(), ctx, "ATTRLEN");
  }

  private checkInstall(ctx: Cics_csd_installContext) {
    this.checkHasMandatoryOptions(ctx.INSTALL(), ctx, "INSTALL");
    this.checkHasExactlyOneOption("LIST or GROUP", ctx, ctx.LIST(), ctx.GROUP());
    if (ctx.LIST().length !== 0) {
      this.checkHasIllegalOptions(
        ctx.cics_csd_cvda(),
        CsdSpOptionsChecker.CVDA_OPTS,
      );
      this.checkHasIllegalOptions(ctx.RESID(), "RESID");
    } else {
      this.checkAllOptionsArePresentOrAbsent(
        "RESID and any of " + CsdSpOptionsChecker.CVDA_OPTS,
        ctx,
        ctx.RESID(),
        ctx.cics_csd_cvda(),
      );
    }
  }

  private checkLock(ctx: Cics_csd_lockContext) {
    this.checkHasMandatoryOptions(ctx.LOCK(), ctx, "LOCK");
    this.checkHasExactlyOneOption("LIST or GROUP", ctx, ctx.LIST(), ctx.GROUP());
  }

  private checkRemove(ctx: Cics_csd_removeContext) {
    this.checkHasMandatoryOptions(ctx.REMOVE(), ctx, "REMOVE");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMandatoryOptions(ctx.LIST(), ctx, "LIST");
  }

  private checkRename(ctx: Cics_csd_renameContext) {
    this.checkHasMandatoryOptions(ctx.RENAME(), ctx, "RENAME");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMandatoryOptions(ctx.AS(), ctx, "AS");
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    this.checkHasMandatoryOptions(
      ctx.cics_csd_cvda(),
      ctx,
      CsdSpOptionsChecker.CVDA_OPTS,
    );
  }

  private checkStartbrRsrce(ctx: Cics_csd_startbrrsrceContext) {
    this.checkHasMandatoryOptions(ctx.STARTBRRSRCE(), ctx, "STARTBRRSRCE");
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
  }

  private checkUnlock(ctx: Cics_csd_unlockContext) {
    this.checkHasMandatoryOptions(ctx.UNLOCK(), ctx, "UNLOCK");
    this.checkHasExactlyOneOption("LIST or GROUP", ctx, ctx.LIST(), ctx.GROUP());
  }

  private checkUserDefine(ctx: Cics_csd_userdefineContext) {
    this.checkHasMandatoryOptions(ctx.GROUP(), ctx, "GROUP");
    this.checkHasMandatoryOptions(ctx.ATTRIBUTES(), ctx, "ATTRIBUTES");
    this.checkHasMandatoryOptions(ctx.RESID(), ctx, "RESID");
    this.checkHasMutuallyExclusiveOptions(
      "NOCOMPAT or COMPATMODE or COMPAT",
      ctx.NOCOMPAT(),
      ctx.COMPATMODE(),
      ctx.COMPAT(),
    );
    this.checkHasMandatoryOptions(
      ctx.cics_csd_cvda(),
      ctx,
      CsdSpOptionsChecker.CVDA_OPTS,
    );
    this.checkOptionalWithLength(
      ctx.ATTRIBUTES(),
      ctx.ATTRLEN(),
      ctx,
      "ATTRIBUTES",
      "ATTRLEN",
    );
  }
}
