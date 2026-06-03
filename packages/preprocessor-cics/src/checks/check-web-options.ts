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
  Cics_web_closeContext,
  Cics_web_converseContext,
  Cics_web_endbrowseContext,
  Cics_web_extractContext,
  Cics_web_openContext,
  Cics_web_parseContext,
  Cics_web_readContext,
  Cics_web_readnextContext,
  Cics_web_receiveContext,
  Cics_web_retrieveContext,
  Cics_web_sendContext,
  Cics_web_startbrowseContext,
  Cics_web_writeContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

/** Checks CICS Web rules for required and invalid options */
export class WebOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_web;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.CLOSE, Severity.Error],
    [CICSLexer.SESSTOKEN, Severity.Error],
    [CICSLexer.CONVERSE, Severity.Error],
    [CICSLexer.PATH, Severity.Error],
    [CICSLexer.PATHLENGTH, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.GET, Severity.Error],
    [CICSLexer.HEAD, Severity.Error],
    [CICSLexer.PATCH, Severity.Error],
    [CICSLexer.POST, Severity.Error],
    [CICSLexer.PUT, Severity.Error],
    [CICSLexer.TRACE, Severity.Error],
    [CICSLexer.OPTIONS, Severity.Error],
    [CICSLexer.DELETE, Severity.Error],
    [CICSLexer.METHOD, Severity.Error],
    [CICSLexer.MEDIATYPE, Severity.Error],
    [CICSLexer.QUERYSTRING, Severity.Error],
    [CICSLexer.QUERYSTRLEN, Severity.Error],
    [CICSLexer.DOCTOKEN, Severity.Error],
    [CICSLexer.FROM, Severity.Error],
    [CICSLexer.FROMLENGTH, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.ACTION, Severity.Error],
    [CICSLexer.CLOSESTATUS, Severity.Error],
    [CICSLexer.AUTHENTICATE, Severity.Error],
    [CICSLexer.USERNAME, Severity.Error],
    [CICSLexer.USERNAMELEN, Severity.Error],
    [CICSLexer.PASSWORD, Severity.Error],
    [CICSLexer.PASSWORDLEN, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.TOCONTAINER, Severity.Error],
    [CICSLexer.TOCHANNEL, Severity.Error],
    [CICSLexer.TOLENGTH, Severity.Error],
    [CICSLexer.MAXLENGTH, Severity.Error],
    [CICSLexer.STATUSCODE, Severity.Error],
    [CICSLexer.STATUSTEXT, Severity.Error],
    [CICSLexer.STATUSLEN, Severity.Error],
    [CICSLexer.CHARACTERSET, Severity.Error],
    [CICSLexer.CLIENTCONV, Severity.Error],
    [CICSLexer.BODYCHARSET, Severity.Error],
    [CICSLexer.ENDBROWSE, Severity.Error],
    [CICSLexer.FORMFIELD, Severity.Error],
    [CICSLexer.HTTPHEADER, Severity.Error],
    [CICSLexer.QUERYPARM, Severity.Error],
    [CICSLexer.EXTRACT, Severity.Error],
    [CICSLexer.SCHEME, Severity.Error],
    [CICSLexer.HOST, Severity.Error],
    [CICSLexer.HOSTLENGTH, Severity.Error],
    [CICSLexer.HOSTTYPE, Severity.Error],
    [CICSLexer.HTTPMETHOD, Severity.Error],
    [CICSLexer.METHODLENGTH, Severity.Error],
    [CICSLexer.HTTPVERSION, Severity.Error],
    [CICSLexer.VERSIONLEN, Severity.Error],
    [CICSLexer.PORTNUMBER, Severity.Error],
    [CICSLexer.REQUESTTYPE, Severity.Error],
    [CICSLexer.REALM, Severity.Error],
    [CICSLexer.REALMLEN, Severity.Error],
    [CICSLexer.OPEN, Severity.Error],
    [CICSLexer.CERTIFICATE, Severity.Error],
    [CICSLexer.CODEPAGE, Severity.Error],
    [CICSLexer.HTTPVNUM, Severity.Error],
    [CICSLexer.HTTPRNUM, Severity.Error],
    [CICSLexer.CIPHERS, Severity.Error],
    [CICSLexer.NUMCIPHERS, Severity.Error],
    [CICSLexer.PARSE, Severity.Error],
    [CICSLexer.URL, Severity.Error],
    [CICSLexer.SCHEMENAME, Severity.Error],
    [CICSLexer.READ, Severity.Error],
    [CICSLexer.NAMELENGTH, Severity.Error],
    [CICSLexer.VALUE, Severity.Error],
    [CICSLexer.VALUELENGTH, Severity.Error],
    [CICSLexer.HOSTCODEPAGE, Severity.Error],
    [CICSLexer.READNEXT, Severity.Error],
    [CICSLexer.TYPE, Severity.Error],
    [CICSLexer.SERVERCONV, Severity.Error],
    [CICSLexer.RECEIVE, Severity.Error],
    [CICSLexer.RETRIEVE, Severity.Error],
    [CICSLexer.SEND, Severity.Error],
    [CICSLexer.CHUNKING, Severity.Error],
    [CICSLexer.STARTBROWSE, Severity.Error],
    [CICSLexer.WRITE, Severity.Error],
    [CICSLexer.NODOCDELETE, Severity.Warning],
    [CICSLexer.DOCDELETE, Severity.Warning],
    [CICSLexer.DOCSTATUS, Severity.Warning],
    [CICSLexer.EXPECT, Severity.Warning],
    [CICSLexer.NOCLOSE, Severity.Warning],
    [CICSLexer.NONE, Severity.Warning],
    [CICSLexer.BASICAUTH, Severity.Warning],
    [CICSLexer.NOTRUNCATE, Severity.Warning],
    [CICSLexer.CLICONVERT, Severity.Warning],
    [CICSLexer.NOINCONVERT, Severity.Warning],
    [CICSLexer.NOOUTCONVERT, Severity.Warning],
    [CICSLexer.NOCLICONVERT, Severity.Warning],
    [CICSLexer.SRVCONVERT, Severity.Warning],
    [CICSLexer.NOSRVCONVERT, Severity.Warning],
    [CICSLexer.CHUNKNO, Severity.Warning],
    [CICSLexer.CHUNKYES, Severity.Warning],
    [CICSLexer.CHUNKEND, Severity.Warning],
    [CICSLexer.IMMEDIATE, Severity.Warning],
    [CICSLexer.EVENTUAL, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, WebOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS WEB rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_web_close:
        this.checkClose(ctx as unknown as Cics_web_closeContext);
        break;
      case CICSParser.RULE_cics_web_converse:
        this.checkConverse(ctx as unknown as Cics_web_converseContext);
        break;
      case CICSParser.RULE_cics_web_endbrowse:
        this.checkEndbrowse(ctx as unknown as Cics_web_endbrowseContext);
        break;
      case CICSParser.RULE_cics_web_extract:
        this.checkExtract(ctx as unknown as Cics_web_extractContext);
        break;
      case CICSParser.RULE_cics_web_open:
        this.checkOpen(ctx as unknown as Cics_web_openContext);
        break;
      case CICSParser.RULE_cics_web_parse:
        this.checkParse(ctx as unknown as Cics_web_parseContext);
        break;
      case CICSParser.RULE_cics_web_read:
        this.checkRead(ctx as unknown as Cics_web_readContext);
        break;
      case CICSParser.RULE_cics_web_readnext:
        this.checkReadNext(ctx as unknown as Cics_web_readnextContext);
        break;
      case CICSParser.RULE_cics_web_retrieve:
        this.checkRetrieve(ctx as unknown as Cics_web_retrieveContext);
        break;
      case CICSParser.RULE_cics_web_receive:
        this.checkReceive(ctx as unknown as Cics_web_receiveContext);
        break;
      case CICSParser.RULE_cics_web_send:
        this.checkSend(ctx as unknown as Cics_web_sendContext);
        break;
      case CICSParser.RULE_cics_web_startbrowse:
        this.checkStartbrowse(ctx as unknown as Cics_web_startbrowseContext);
        break;
      case CICSParser.RULE_cics_web_write:
        this.checkWrite(ctx as unknown as Cics_web_writeContext);
        break;
      default:
        break;
    }

    this.checkDuplicates(ctx);
  }

  private checkClose(ctx: Cics_web_closeContext) {
    this.checkHasMandatoryOptions(ctx.CLOSE(), ctx, "CLOSE");
    this.checkHasMandatoryOptions(ctx.SESSTOKEN(), ctx, "SESSTOKEN");
  }

  private checkConverse(ctx: Cics_web_converseContext) {
    this.checkHasMandatoryOptions(ctx.CONVERSE(), ctx, "CONVERSE");
    this.checkHasMandatoryOptions(ctx.SESSTOKEN(), ctx, "SESSTOKEN");
    this.checkMutuallyExclusiveOptions(
      "PATH or URIMAP",
      ctx.PATH(),
      ctx.URIMAP(),
    );
    this.checkHasExactlyOneOption(
      "GET, HEAD, PATCH, POST, PUT, TRACE, OPTIONS, DELETE or METHOD",
      ctx,
      ctx.GET(),
      ctx.HEAD(),
      ctx.PATCH(),
      ctx.POST(),
      ctx.PUT(),
      ctx.TRACE(),
      ctx.OPTIONS(),
      ctx.DELETE(),
      ctx.METHOD(),
    );
    this.checkPrerequisiteIsMet(
      ctx.QUERYSTRING(),
      ctx.QUERYSTRLEN(),
      ctx,
      "QUERYSTRLEN without QUERYSTRING",
    );
    // Body subsection
    this.checkMutuallyExclusiveOptions(
      "DOCTOKEN, FROM or CONTAINER",
      ctx.DOCTOKEN(),
      ctx.FROM(),
      ctx.CONTAINER(),
    );

    this.checkPrerequisiteIsMet(
      ctx.DOCTOKEN(),
      ctx.NODOCDELETE(),
      ctx,
      "NODOCDELETE without DOCTOKEN",
    );
    this.checkPrerequisiteIsMet(
      ctx.DOCTOKEN(),
      ctx.DOCDELETE(),
      ctx,
      "DOCDELETE without DOCTOKEN",
    );
    this.checkPrerequisiteIsMet(
      ctx.DOCTOKEN(),
      ctx.DOCSTATUS(),
      ctx,
      "DOCSTATUS without DOCTOKEN",
    );
    this.checkMutuallyExclusiveOptions(
      "NODOCDELETE, DOCDELETE or DOCSTATUS",
      ctx.NODOCDELETE(),
      ctx.DOCDELETE(),
      ctx.DOCSTATUS(),
    );

    this.checkAllOptionsArePresentOrAbsent(
      "FROM and FROMLENGTH",
      ctx,
      ctx.FROM(),
      ctx.FROMLENGTH(),
    );

    this.checkPrerequisiteIsMet(
      ctx.CONTAINER(),
      ctx.CHANNEL(),
      ctx,
      "CHANNEL without CONTAINER",
    );
    // END - Body subsection

    this.checkMutuallyExclusiveOptions(
      "ACTION or EXPECT",
      ctx.ACTION(),
      ctx.EXPECT(),
    );
    this.checkMutuallyExclusiveOptions(
      "NOCLOSE, CLOSE or CLOSESTATUS",
      ctx.NOCLOSE(),
      ctx.CLOSE(),
      ctx.CLOSESTATUS(),
    );

    this.checkMutuallyExclusiveOptions(
      "NONE, BASICAUTH, AUTHENTICATE",
      ctx.NONE(),
      ctx.BASICAUTH(),
      ctx.AUTHENTICATE(),
    );
    if (
      ctx.NONE().length !== 0 ||
      ctx.BASICAUTH().length !== 0 ||
      ctx.AUTHENTICATE().length !== 0
    ) {
      this.checkAllOptionsArePresentOrAbsent(
        "USERNAME and PASSWORD",
        ctx,
        ctx.USERNAME(),
        ctx.PASSWORD(),
      );
    } else {
      this.checkHasIllegalOptions(
        ctx.USERNAME(),
        "USERNAME without NONE, BASICAUTH or AUTHENTICATE",
      );
      this.checkHasIllegalOptions(
        ctx.USERNAMELEN(),
        "USERNAMELEN without NONE, BASICAUTH or AUTHENTICATE",
      );
    }
    if (ctx.TOLENGTH().length !== 0)
      this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.INTO(), ctx.SET());
    else
      this.checkHasExactlyOneOption(
        "INTO, SET or TOCONTAINER",
        ctx,
        ctx.INTO(),
        ctx.SET(),
        ctx.TOCONTAINER(),
      );
    this.checkPrerequisiteIsMet(
      ctx.TOCONTAINER(),
      ctx.TOCHANNEL(),
      ctx,
      "TOCHANNEL without TOCONTAINER",
    );

    if (ctx.INTO().length !== 0 || ctx.SET().length !== 0) {
      this.checkHasMandatoryOptions(ctx.TOLENGTH(), ctx, "TOLENGTH");
      if (this.noLengthOptionsEnabled() && ctx.INTO().length !== 0)
        this.checkHasMandatoryOptions(ctx.MAXLENGTH(), ctx, "MAXLENGTH");
    }

    this.checkAllOptionsArePresentOrAbsent(
      "STATUSCODE, STATUSTEXT, STATUSLEN",
      ctx,
      ctx.STATUSCODE(),
      ctx.STATUSTEXT(),
      ctx.STATUSLEN(),
    );

    this.checkMutuallyExclusiveOptions(
      "CLICONVERT, NOINCONVERT, NOOUTCONVERT, NOCLICONVERT, CLIENTCONV",
      ctx.CLICONVERT(),
      ctx.NOINCONVERT(),
      ctx.NOOUTCONVERT(),
      ctx.NOCLICONVERT(),
      ctx.CLIENTCONV(),
    );
    this.checkOptionalWithLength(
      ctx.PATH(),
      ctx.PATHLENGTH(),
      ctx,
      "PATH",
      "PATHLENGTH",
    );
    this.checkOptionalWithLength(
      ctx.PASSWORD(),
      ctx.PASSWORDLEN(),
      ctx,
      "PASSWORD",
      "PASSWORDLEN",
    );
    this.checkOptionalWithLength(
      ctx.USERNAME(),
      ctx.USERNAMELEN(),
      ctx,
      "USERNAME",
      "USERNAMELEN",
    );
  }

  private checkEndbrowse(ctx: Cics_web_endbrowseContext) {
    this.checkHasMandatoryOptions(ctx.ENDBROWSE(), ctx, "ENDBROWSE");
    this.checkHasExactlyOneOption(
      "FORMFIELD, HTTPHEADER, QUERYPARM",
      ctx,
      ctx.FORMFIELD(),
      ctx.HTTPHEADER(),
      ctx.QUERYPARM(),
    );
    this.checkPrerequisiteIsMet(
      ctx.HTTPHEADER(),
      ctx.SESSTOKEN(),
      ctx,
      "HTTPHEADER",
    );
    if (ctx.FORMFIELD().length !== 0 || ctx.QUERYPARM().length !== 0) {
      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
    }
  }

  private checkExtract(ctx: Cics_web_extractContext) {
    this.checkHasMandatoryOptions(ctx.EXTRACT(), ctx, "EXTRACT");
    // HTTP Server
    if (
      ctx.REQUESTTYPE().length !== 0 ||
      ctx.HTTPMETHOD().length !== 0 ||
      ctx.METHODLENGTH().length !== 0 ||
      ctx.QUERYSTRING().length !== 0 ||
      ctx.QUERYSTRLEN().length !== 0
    ) {
      this.checkPrerequisiteIsMet(
        ctx.HTTPMETHOD(),
        ctx.METHODLENGTH(),
        ctx,
        "METHODLENGTH without HTTPMETHOD",
      );
      this.checkAllOptionsArePresentOrAbsent(
        "QUERYSTRING and QUERYSTRLEN",
        ctx,
        ctx.QUERYSTRING(),
        ctx.QUERYSTRLEN(),
      );

      this.checkAllOptionsArePresentOrAbsent(
        "HTTPMETHOD and METHODLENGTH",
        ctx,
        ctx.HTTPMETHOD(),
        ctx.METHODLENGTH(),
      );

      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
      this.checkHasIllegalOptions(ctx.REALM(), "REALM");
      this.checkHasIllegalOptions(ctx.REALMLEN(), "REALMLEN");
    }

    // HTTP Client
    if (
      ctx.SESSTOKEN().length !== 0 ||
      ctx.REALM().length !== 0 ||
      ctx.REALMLEN().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.SESSTOKEN(), ctx, "SESSTOKEN");
      this.checkAllOptionsArePresentOrAbsent(
        "REALM and REALMLEN",
        ctx,
        ctx.REALM(),
        ctx.REALMLEN(),
      );

      this.checkHasIllegalOptions(ctx.REQUESTTYPE(), "REQUESTTYPE");
      this.checkHasIllegalOptions(ctx.HTTPMETHOD(), "HTTPMETHOD");
      this.checkHasIllegalOptions(ctx.METHODLENGTH(), "METHODLENGTH");
      this.checkHasIllegalOptions(ctx.QUERYSTRING(), "QUERYSTRING");
      this.checkHasIllegalOptions(ctx.QUERYSTRLEN(), "QUERYSTRLEN");
    }

    this.checkAllOptionsArePresentOrAbsent(
      "HOST and HOSTLENGTH",
      ctx,
      ctx.HOST(),
      ctx.HOSTLENGTH(),
    );
    this.checkPrerequisiteIsMet(
      ctx.HOST(),
      ctx.HOSTTYPE(),
      ctx,
      "HOSTTYPE without HOST",
    );
    this.checkAllOptionsArePresentOrAbsent(
      "PATH and PATHLENGTH",
      ctx,
      ctx.PATH(),
      ctx.PATHLENGTH(),
    );
    this.checkAllOptionsArePresentOrAbsent(
      "HTTPVERSION and VERSIONLEN",
      ctx,
      ctx.HTTPVERSION(),
      ctx.VERSIONLEN(),
    );
  }

  private checkOpen(ctx: Cics_web_openContext) {
    this.checkHasMandatoryOptions(ctx.OPEN(), ctx, "OPEN");
    this.checkHasExactlyOneOption(
      "URIMAP or HOST",
      ctx,
      ctx.URIMAP(),
      ctx.HOST(),
    );

    if (ctx.HOST().length !== 0) {
      this.checkHasExactlyOneOption(
        "SCHEME, HTTP or HTTPS",
        ctx,
        ctx.SCHEME(),
        ctx.HTTP(),
        ctx.HTTPS(),
      );
    } else {
      this.checkHasIllegalOptions(ctx.SCHEME(), "SCHEME");
      this.checkHasIllegalOptions(ctx.HTTP(), "HTTP");
      this.checkHasIllegalOptions(ctx.HTTPS(), "HTTPS");
    }

    this.checkHasMandatoryOptions(ctx.SESSTOKEN(), ctx, "SESSTOKEN");
    this.checkAllOptionsArePresentOrAbsent(
      "HTTPVNUM and HTTPRNUM",
      ctx,
      ctx.HTTPVNUM(),
      ctx.HTTPRNUM(),
    );
  }

  private checkParse(ctx: Cics_web_parseContext) {
    this.checkHasMandatoryOptions(ctx.PARSE(), ctx, "PARSE");
    this.checkHasMandatoryOptions(ctx.URL(), ctx, "URL");
    this.checkPrerequisiteIsMet(
      ctx.URL(),
      ctx.URLLENGTH(),
      ctx,
      "URLLENGTH without URL",
    );
    this.checkPrerequisiteIsMet(
      ctx.HOST(),
      ctx.HOSTTYPE(),
      ctx,
      "HOSTTYPE without HOST",
    );

    this.checkOptionalWithLength(
      ctx.PATH(),
      ctx.PATHLENGTH(),
      ctx,
      "PATH",
      "PATHLENGTH",
    );
    this.checkOptionalWithLength(
      ctx.HOST(),
      ctx.HOSTLENGTH(),
      ctx,
      "HOST",
      "HOSTLENGTH",
    );
    this.checkOptionalWithLength(
      ctx.QUERYSTRING(),
      ctx.QUERYSTRLEN(),
      ctx,
      "QUERYSTRING",
      "QUERYSTRLEN",
    );
  }

  private checkRead(ctx: Cics_web_readContext) {
    this.checkHasMandatoryOptions(ctx.READ(), ctx, "READ");
    this.checkHasExactlyOneOption(
      "FORMFIELD, HTTPHEADER or QUERYPARM",
      ctx,
      ctx.FORMFIELD(),
      ctx.HTTPHEADER(),
      ctx.QUERYPARM(),
    );

    if (ctx.FORMFIELD().length !== 0) {
      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
      this.checkHasExactlyOneOption(
        "VALUE or SET",
        ctx,
        ctx.VALUE(),
        ctx.SET(),
      );
      this.checkHasMandatoryOptions(ctx.VALUELENGTH(), ctx, "VALUELENGTH");
    }

    if (ctx.HTTPHEADER().length !== 0) {
      this.checkHasMandatoryOptions(ctx.VALUE(), ctx, "VALUE");
      this.checkHasMandatoryOptions(ctx.VALUELENGTH(), ctx, "VALUELENGTH");

      this.checkHasIllegalOptions(ctx.SET(), "SET");
      this.checkHasIllegalOptions(ctx.CHARACTERSET(), "CHARACTERSET");
      this.checkHasIllegalOptions(ctx.HOSTCODEPAGE(), "HOSTCODEPAGE");
    }

    if (ctx.QUERYPARM().length !== 0) {
      this.checkHasExactlyOneOption(
        "VALUE or SET",
        ctx,
        ctx.VALUE(),
        ctx.SET(),
      );
      this.checkHasMandatoryOptions(ctx.VALUELENGTH(), ctx, "VALUELENGTH");

      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
      this.checkHasIllegalOptions(ctx.CHARACTERSET(), "CHARACTERSET");
    }

    this.checkPrerequisiteIsMet(
      ctx.FORMFIELD(),
      ctx.CHARACTERSET(),
      ctx,
      "CHARACTERSET without FORMFIELD",
    );
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.NAMELENGTH(), ctx, "NAMELENGTH");
    }
  }

  private checkReadNext(ctx: Cics_web_readnextContext) {
    this.checkHasMandatoryOptions(ctx.READNEXT(), ctx, "READNEXT");

    this.checkHasExactlyOneOption(
      "FORMFIELD, HTTPHEADER or QUERYPARM",
      ctx,
      ctx.FORMFIELD(),
      ctx.HTTPHEADER(),
      ctx.QUERYPARM(),
    );

    if (ctx.FORMFIELD().length !== 0 || ctx.QUERYPARM().length !== 0) {
      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
    }

    this.checkHasMandatoryOptions(ctx.NAMELENGTH(), ctx, "NAMELENGTH");
    this.checkHasMandatoryOptions(ctx.VALUE(), ctx, "VALUE");
    this.checkHasMandatoryOptions(ctx.VALUELENGTH(), ctx, "VALUELENGTH");
  }

  private checkReceive(ctx: Cics_web_receiveContext) {
    this.checkHasMandatoryOptions(ctx.RECEIVE(), ctx, "RECEIVE");

    let isBuffer = false;
    let isContainer = false;

    if (
      ctx.INTO().length !== 0 ||
      ctx.SET().length !== 0 ||
      ctx.LENGTH().length !== 0 ||
      ctx.MAXLENGTH().length !== 0 ||
      ctx.NOTRUNCATE().length !== 0 ||
      ctx.SRVCONVERT().length !== 0 ||
      ctx.NOSRVCONVERT().length !== 0 ||
      ctx.SERVERCONV().length !== 0 ||
      ctx.CLICONVERT().length !== 0 ||
      ctx.NOCLICONVERT().length !== 0 ||
      ctx.CLIENTCONV().length !== 0 ||
      ctx.HOSTCODEPAGE().length !== 0
    ) {
      // Buffer
      isBuffer = true;
      this.checkHasIllegalOptions(ctx.TOCONTAINER(), "TOCONTAINER");
      this.checkHasIllegalOptions(ctx.TOCHANNEL(), "TOCHANNEL");

      this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.INTO(), ctx.SET());
      this.checkMutuallyExclusiveOptions(
        "SRVCONVERT, NOSRVCONVERT or SERVERCONV",
        ctx.SRVCONVERT(),
        ctx.NOSRVCONVERT(),
        ctx.SERVERCONV(),
      );
      this.checkMutuallyExclusiveOptions(
        "CLICONVERT, NOCLICONVERT, CLIENTCONV",
        ctx.CLICONVERT(),
        ctx.NOCLICONVERT(),
        ctx.CLIENTCONV(),
      );

      this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    }

    if (ctx.TOCONTAINER().length !== 0 || ctx.TOCHANNEL().length !== 0) {
      // Container
      isContainer = true;

      this.checkHasIllegalOptions(ctx.INTO(), "INTO");
      this.checkHasIllegalOptions(ctx.SET(), "SET");
      this.checkHasIllegalOptions(ctx.LENGTH(), "LENGTH");
      this.checkHasIllegalOptions(ctx.MAXLENGTH(), "MAXLENGTH");
      this.checkHasIllegalOptions(ctx.NOTRUNCATE(), "NOTRUNCATE");
      this.checkHasIllegalOptions(ctx.SRVCONVERT(), "SRVCONVERT");
      this.checkHasIllegalOptions(ctx.NOSRVCONVERT(), "NOSRVCONVERT");
      this.checkHasIllegalOptions(ctx.SERVERCONV(), "SERVERCONV");
      this.checkHasIllegalOptions(ctx.CLICONVERT(), "CLICONVERT");
      this.checkHasIllegalOptions(ctx.NOCLICONVERT(), "NOCLICONVERT");
      this.checkHasIllegalOptions(ctx.CLIENTCONV(), "CLIENTCONV");
      this.checkHasIllegalOptions(ctx.HOSTCODEPAGE(), "HOSTCODEPAGE");

      this.checkHasMandatoryOptions(ctx.TOCONTAINER(), ctx, "TOCONTAINER");
      this.checkPrerequisiteIsMet(
        ctx.TOCONTAINER(),
        ctx.TOCHANNEL(),
        ctx,
        "TOCHANNEL without TOCONTAINER",
      );
    }

    if (
      ctx.SESSTOKEN().length !== 0 ||
      ctx.STATUSCODE().length !== 0 ||
      ctx.STATUSTEXT().length !== 0 ||
      ctx.STATUSLEN().length !== 0
    ) {
      this.checkHasMandatoryOptions(ctx.SESSTOKEN(), ctx, "SESSTOKEN");
      this.checkAllOptionsArePresentOrAbsent(
        "STATUSCODE and STATUSTEXT",
        ctx,
        ctx.STATUSCODE(),
        ctx.STATUSTEXT(),
      );
      this.checkPrerequisiteIsMet(
        ctx.STATUSCODE(),
        ctx.STATUSLEN(),
        ctx,
        "STATUSLEN without STATUSCODE",
      );
    }

    if (!isBuffer && !isContainer) {
      this.checkHasExactlyOneOption(
        "INTO, SET, LENGTH or TOCONTAINER",
        ctx,
        ctx.INTO(),
        ctx.SET(),
        ctx.LENGTH(),
        ctx.TOCONTAINER(),
      );
    }
    if (this.noLengthOptionsEnabled()) {
      if (ctx.SESSTOKEN().length !== 0 && ctx.STATUSCODE().length !== 0)
        this.checkHasMandatoryOptions(ctx.STATUSLEN(), ctx, "STATUSLEN");
      if (ctx.INTO().length !== 0)
        this.checkHasMandatoryOptions(ctx.MAXLENGTH(), ctx, "MAXLENGTH");
    }
  }

  private checkRetrieve(ctx: Cics_web_retrieveContext) {
    this.checkHasMandatoryOptions(ctx.RETRIEVE(), ctx, "RETRIEVE");
    this.checkHasMandatoryOptions(ctx.DOCTOKEN(), ctx, "DOCTOKEN");
  }

  private checkSend(ctx: Cics_web_sendContext) {
    this.checkHasMandatoryOptions(ctx.SEND(), ctx, "SEND");
    if (ctx.SESSTOKEN().length !== 0) {
      // Client
      this.checkMutuallyExclusiveOptions(
        "GET, HEAD, PATCH, POST, PUT, TRACE, OPTIONS, DELETE or METHOD",
        ctx.GET(),
        ctx.HEAD(),
        ctx.PATCH(),
        ctx.POST(),
        ctx.PUT(),
        ctx.TRACE(),
        ctx.OPTIONS(),
        ctx.DELETE(),
        ctx.METHOD(),
      );

      this.checkMutuallyExclusiveOptions(
        "PATH or URIMAP",
        ctx.PATH(),
        ctx.URIMAP(),
      );
      this.checkAllOptionsArePresentOrAbsent(
        "PATH and PATHLENGTH",
        ctx,
        ctx.PATH(),
        ctx.PATHLENGTH(),
      );

      this.checkAllOptionsArePresentOrAbsent(
        "QUERYSTRING and QUERYSTRLEN",
        ctx,
        ctx.QUERYSTRING(),
        ctx.QUERYSTRLEN(),
      );

      // Body subsection
      if (
        ctx.MEDIATYPE().length !== 0 ||
        ctx.DOCTOKEN().length !== 0 ||
        ctx.FROM().length !== 0 ||
        ctx.CONTAINER().length !== 0
      ) {
        this.checkHasMandatoryOptions(ctx.MEDIATYPE(), ctx, "MEDIATYPE");
        this.checkMutuallyExclusiveOptions(
          "DOCTOKEN, FROM or CONTAINER",
          ctx.DOCTOKEN(),
          ctx.FROM(),
          ctx.CONTAINER(),
        );

        this.checkPrerequisiteIsMet(
          ctx.DOCTOKEN(),
          ctx.NODOCDELETE(),
          ctx,
          "NODOCDELETE without DOCTOKEN",
        );
        this.checkPrerequisiteIsMet(
          ctx.DOCTOKEN(),
          ctx.DOCDELETE(),
          ctx,
          "DOCDELETE without DOCTOKEN",
        );
        this.checkPrerequisiteIsMet(
          ctx.DOCTOKEN(),
          ctx.DOCSTATUS(),
          ctx,
          "DOCSTATUS without DOCTOKEN",
        );
        this.checkMutuallyExclusiveOptions(
          "NODOCDELETE, DOCDELETE or DOCSTATUS",
          ctx.NODOCDELETE(),
          ctx.DOCDELETE(),
          ctx.DOCSTATUS(),
        );

        this.checkAllOptionsArePresentOrAbsent(
          "FROM and FROMLENGTH",
          ctx,
          ctx.FROM(),
          ctx.FROMLENGTH(),
        );

        this.checkPrerequisiteIsMet(
          ctx.CONTAINER(),
          ctx.CHANNEL(),
          ctx,
          "CHANNEL without CONTAINER",
        );
      }
      // END - Body subsection

      this.checkMutuallyExclusiveOptions(
        "ACTION or EXPECT",
        ctx.ACTION(),
        ctx.EXPECT(),
      );
      this.checkMutuallyExclusiveOptions(
        "NOCLOSE, CLOSE or CLOSESTATUS",
        ctx.NOCLOSE(),
        ctx.CLOSE(),
        ctx.CLOSESTATUS(),
      );

      this.checkMutuallyExclusiveOptions(
        "NONE, BASICAUTH, AUTHENTICATE",
        ctx.NONE(),
        ctx.BASICAUTH(),
        ctx.AUTHENTICATE(),
      );

      this.checkAllOptionsArePresentOrAbsent(
        "USERNAME and PASSWORD",
        ctx,
        ctx.USERNAME(),
        ctx.PASSWORD(),
      );

      this.checkPrerequisiteIsMet(
        ctx.CONTAINER(),
        ctx.CHANNEL(),
        ctx,
        "CHANNEL without CONTAINER",
      );

      this.checkMutuallyExclusiveOptions(
        "CLICONVERT, NOCLICONVERT, CLIENTCONV",
        ctx.CLICONVERT(),
        ctx.NOCLICONVERT(),
        ctx.CLIENTCONV(),
      );
      this.checkOptionalWithLength(
        ctx.USERNAME(),
        ctx.USERNAMELEN(),
        ctx,
        "USERNAME",
        "USERNAMELEN",
      );
      this.checkOptionalWithLength(
        ctx.PASSWORD(),
        ctx.PASSWORDLEN(),
        ctx,
        "PASSWORD",
        "PASSWORDLEN",
      );
    } else {
      // Server
      this.checkMutuallyExclusiveOptions(
        "DOCTOKEN, FROM or CONTAINER",
        ctx.DOCTOKEN(),
        ctx.FROM(),
        ctx.CONTAINER(),
      );

      this.checkPrerequisiteIsMet(
        ctx.DOCTOKEN(),
        ctx.NODOCDELETE(),
        ctx,
        "NODOCDELETE without DOCTOKEN",
      );
      this.checkPrerequisiteIsMet(
        ctx.DOCTOKEN(),
        ctx.DOCDELETE(),
        ctx,
        "DOCDELETE without DOCTOKEN",
      );
      this.checkPrerequisiteIsMet(
        ctx.DOCTOKEN(),
        ctx.DOCSTATUS(),
        ctx,
        "DOCSTATUS without DOCTOKEN",
      );
      this.checkMutuallyExclusiveOptions(
        "NODOCDELETE, DOCDELETE or DOCSTATUS",
        ctx.NODOCDELETE(),
        ctx.DOCDELETE(),
        ctx.DOCSTATUS(),
      );

      this.checkMutuallyExclusiveOptions(
        "DOCTOKEN, CONTAINER, CHUNKNO, CHUNKYES, CHUNKEND or CHUNKING",
        ctx.DOCTOKEN(),
        ctx.CONTAINER(),
        ctx.CHUNKNO(),
        ctx.CHUNKYES(),
        ctx.CHUNKEND(),
        ctx.CHUNKING(),
      );

      this.checkPrerequisiteIsMet(
        ctx.FROM(),
        ctx.HOSTCODEPAGE(),
        ctx,
        "HOSTCODEPAGE without FROM",
      );

      this.checkAllOptionsArePresentOrAbsent(
        "FROM and FROMLENGTH",
        ctx,
        ctx.FROM(),
        ctx.FROMLENGTH(),
      );

      this.checkPrerequisiteIsMet(
        ctx.CONTAINER(),
        ctx.CHANNEL(),
        ctx,
        "CHANNEL without CONTAINER",
      );

      if (
        ctx.STATUSCODE().length !== 0 ||
        ctx.STATUSTEXT().length !== 0 ||
        ctx.STATUSLEN().length !== 0 ||
        ctx.LENGTH().length !== 0
      ) {
        this.checkHasMandatoryOptions(ctx.STATUSCODE(), ctx, "STATUSCODE");
        this.checkHasMandatoryOptions(ctx.STATUSTEXT(), ctx, "STATUSTEXT");
        this.checkHasExactlyOneOption(
          "STATUSLEN or LENGTH",
          ctx,
          ctx.STATUSLEN(),
          ctx.LENGTH(),
        );
      }

      this.checkMutuallyExclusiveOptions(
        "SRVCONVERT, NOSRVCONVERT, or SERVERCONV",
        ctx.SRVCONVERT(),
        ctx.NOSRVCONVERT(),
        ctx.SERVERCONV(),
      );
      this.checkMutuallyExclusiveOptions(
        "IMMEDIATE, EVENTUAL or ACTION",
        ctx.IMMEDIATE(),
        ctx.EVENTUAL(),
        ctx.ACTION(),
      );
      this.checkMutuallyExclusiveOptions(
        "NOCLOSE, CLOSE, CLOSESTATUS",
        ctx.NOCLOSE(),
        ctx.CLOSE(),
        ctx.CLOSESTATUS(),
      );
    }

    if (ctx.USERNAME().length !== 0 && ctx.PASSWORD().length !== 0)
      this.checkHasExactlyOneOption(
        "NONE, BASICAUTH, AUTHENTICATE",
        ctx,
        ctx.NONE(),
        ctx.BASICAUTH(),
        ctx.AUTHENTICATE(),
      );
  }

  private checkStartbrowse(ctx: Cics_web_startbrowseContext) {
    this.checkHasMandatoryOptions(ctx.STARTBROWSE(), ctx, "STARTBROWSE");
    this.checkHasExactlyOneOption(
      "FORMFIELD, HTTPHEADER or QUERYPARM",
      ctx,
      ctx.FORMFIELD(),
      ctx.HTTPHEADER(),
      ctx.QUERYPARM(),
    );

    if (ctx.FORMFIELD().length !== 0) {
      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
    }

    if (ctx.HTTPHEADER().length !== 0) {
      this.checkHasIllegalOptions(ctx.NAMELENGTH(), "NAMELENGTH");
      this.checkHasIllegalOptions(ctx.HOSTCODEPAGE(), "HOSTCODEPAGE");
      this.checkHasIllegalOptions(ctx.CHARACTERSET(), "CHARACTERSET");
    }

    if (ctx.QUERYPARM().length !== 0) {
      this.checkHasIllegalOptions(ctx.SESSTOKEN(), "SESSTOKEN");
      this.checkHasIllegalOptions(ctx.CHARACTERSET(), "CHARACTERSET");
    }
  }

  private checkWrite(ctx: Cics_web_writeContext) {
    this.checkHasMandatoryOptions(ctx.WRITE(), ctx, "WRITE");
    this.checkHasMandatoryOptions(ctx.HTTPHEADER(), ctx, "HTTPHEADER");
    this.checkHasMandatoryOptions(ctx.VALUE(), ctx, "VALUE");
    if (this.noLengthOptionsEnabled()) {
      this.checkHasMandatoryOptions(ctx.NAMELENGTH(), ctx, "NAMELENGTH");
      this.checkHasMandatoryOptions(ctx.VALUELENGTH(), ctx, "VALUELENGTH");
    }
  }
}
