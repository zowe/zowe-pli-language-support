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
  Cics_extract_attachContext,
  Cics_extract_attributesContext,
  Cics_extract_certificateContext,
  Cics_extract_logonmessageContext,
  Cics_extract_processContext,
  Cics_extract_tcpipContext,
  Cics_extract_tctContext,
  Cics_extract_web_clientContext,
  Cics_extract_web_serverContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class ExtractOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_extract;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.EXTRACT, Severity.Error],
    [CICSLexer.ATTACH, Severity.Error],
    [CICSLexer.ATTACHID, Severity.Error],
    [CICSLexer.CONVID, Severity.Error],
    [CICSLexer.SESSION, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.RESOURCE, Severity.Error],
    [CICSLexer.RPROCESS, Severity.Error],
    [CICSLexer.RRESOURCE, Severity.Error],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.IUTYPE, Severity.Error],
    [CICSLexer.DATASTR, Severity.Error],
    [CICSLexer.RECFM, Severity.Error],
    [CICSLexer.ATTRIBUTES, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.CERTIFICATE, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.SERIALNUMLEN, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.COMMONNAMLEN, Severity.Error],
    [CICSLexer.COUNTRYLEN, Severity.Error],
    [CICSLexer.STATELEN, Severity.Error],
    [CICSLexer.LOCALITYLEN, Severity.Error],
    [CICSLexer.ORGANIZATLEN, Severity.Error],
    [CICSLexer.ORGUNITLEN, Severity.Error],
    [CICSLexer.SERIALNUM, Severity.Error],
    [CICSLexer.COMMONNAME, Severity.Error],
    [CICSLexer.COUNTRY, Severity.Error],
    [CICSLexer.LOCALITY, Severity.Error],
    [CICSLexer.ORGANIZATION, Severity.Error],
    [CICSLexer.ORGUNIT, Severity.Error],
    [CICSLexer.OWNER, Severity.Warning],
    [CICSLexer.ISSUER, Severity.Warning],
    [CICSLexer.LOGONMSG, Severity.Error],
    [CICSLexer.INTO, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.PROCNAME, Severity.Error],
    [CICSLexer.PROCLENGTH, Severity.Error],
    [CICSLexer.MAXPROCLEN, Severity.Error],
    [CICSLexer.SYNCLEVEL, Severity.Error],
    [CICSLexer.PIPLENGTH, Severity.Error],
    [CICSLexer.PIPLIST, Severity.Error],
    [CICSLexer.TCPIP, Severity.Error],
    [CICSLexer.AUTHENTICATE, Severity.Error],
    [CICSLexer.CLNTIPFAMILY, Severity.Error],
    [CICSLexer.SRVRIPFAMILY, Severity.Error],
    [CICSLexer.SSLTYPE, Severity.Error],
    [CICSLexer.PRIVACY, Severity.Error],
    [CICSLexer.CLIENTNAME, Severity.Error],
    [CICSLexer.CNAMELENGTH, Severity.Error],
    [CICSLexer.SERVERNAME, Severity.Error],
    [CICSLexer.SNAMELENGTH, Severity.Error],
    [CICSLexer.CLIENTADDR, Severity.Error],
    [CICSLexer.CADDRLENGTH, Severity.Error],
    [CICSLexer.CLIENTADDRNU, Severity.Error],
    [CICSLexer.CLNTADDR6NU, Severity.Error],
    [CICSLexer.SERVERADDR, Severity.Error],
    [CICSLexer.SADDRLENGTH, Severity.Error],
    [CICSLexer.SERVERADDRNU, Severity.Error],
    [CICSLexer.SRVRADDR6NU, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.PORTNUMBER, Severity.Error],
    [CICSLexer.PORTNUMNU, Severity.Error],
    [CICSLexer.MAXDATALEN, Severity.Error],
    [CICSLexer.TCT, Severity.Error],
    [CICSLexer.NETNAME, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.TERMID, Severity.Error],
    [CICSLexer.WEB, Severity.Error],
    [CICSLexer.REQUESTTYPE, Severity.Error],
    [CICSLexer.HOSTTYPE, Severity.Error],
    [CICSLexer.SCHEME, Severity.Error],
    [CICSLexer.HOSTLENGTH, Severity.Error],
    [CICSLexer.HOST, Severity.Error],
    [CICSLexer.HTTPVERSION, Severity.Error],
    [CICSLexer.VERSIONLEN, Severity.Error],
    [CICSLexer.PATH, Severity.Error],
    [CICSLexer.PATHLENGTH, Severity.Error],
    [CICSLexer.HTTPMETHOD, Severity.Error],
    [CICSLexer.METHODLENGTH, Severity.Error],
    [CICSLexer.QUERYSTRING, Severity.Error],
    [CICSLexer.QUERYSTRLEN, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.SESSTOKEN, Severity.Error],
    [CICSLexer.REALM, Severity.Error],
    [CICSLexer.REALMLEN, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, ExtractOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Extract rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_extract_attach:
        this.checkAttach(ctx as unknown as Cics_extract_attachContext);
        break;
      case CICSParser.RULE_cics_extract_attributes:
        this.checkAttributes(ctx as unknown as Cics_extract_attributesContext);
        break;
      case CICSParser.RULE_cics_extract_certificate:
        this.checkCertificate(
          ctx as unknown as Cics_extract_certificateContext,
        );
        break;
      case CICSParser.RULE_cics_extract_logonmessage:
        this.checkLogonMsg(ctx as unknown as Cics_extract_logonmessageContext);
        break;
      case CICSParser.RULE_cics_extract_process:
        this.checkProcess(ctx as unknown as Cics_extract_processContext);
        break;
      case CICSParser.RULE_cics_extract_tcpip:
        this.checkTcpIp(ctx as unknown as Cics_extract_tcpipContext);
        break;
      case CICSParser.RULE_cics_extract_tct:
        this.checkTCT(ctx as unknown as Cics_extract_tctContext);
        break;
      case CICSParser.RULE_cics_extract_web_client:
        this.checkWebClient(ctx as unknown as Cics_extract_web_clientContext);
        break;
      case CICSParser.RULE_cics_extract_web_server:
        this.checkWebServer(ctx as unknown as Cics_extract_web_serverContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkAttach(ctx: Cics_extract_attachContext) {
    this.checkHasMandatoryOptions(ctx.ATTACH(), ctx, "ATTACH");
    this.checkHasMutuallyExclusiveOptions(
      "ATTACHID or CONVID or SESSION",
      ctx.ATTACHID(),
      ctx.CONVID(),
      ctx.SESSION(),
    );
  }

  private checkAttributes(ctx: Cics_extract_attributesContext) {
    this.checkHasMandatoryOptions(ctx.ATTRIBUTES(), ctx, "ATTRIBUTES");
    this.checkHasMandatoryOptions(ctx.STATE(), ctx, "STATE");

    this.checkHasMutuallyExclusiveOptions(
      "CONVID or SESSION",
      ctx.SESSION(),
      ctx.CONVID(),
    );
  }

  private checkCertificate(ctx: Cics_extract_certificateContext) {
    this.checkHasMandatoryOptions(ctx.CERTIFICATE(), ctx, "CERTIFICATE");
    this.checkHasMutuallyExclusiveOptions(
      "ISSUER or OWNER",
      ctx.ISSUER(),
      ctx.OWNER(),
    );
  }

  private checkLogonMsg(ctx: Cics_extract_logonmessageContext) {
    this.checkHasMandatoryOptions(ctx.LOGONMSG(), ctx, "LOGONMSG");
    this.checkHasMandatoryOptions(ctx.LENGTH(), ctx, "LENGTH");
    this.checkHasExactlyOneOption("INTO or SET", ctx, ctx.INTO(), ctx.SET());
  }

  private checkProcess(ctx: Cics_extract_processContext) {
    this.checkHasMandatoryOptions(ctx.PROCESS(), ctx, "PROCESS");
    if (ctx.PROCNAME().length === 0) {
      this.checkHasIllegalOptions(
        ctx.PROCLENGTH(),
        "PROCLENGTH without PROCNAME",
      );
      this.checkHasIllegalOptions(
        ctx.MAXPROCLEN(),
        "MAXPROCLEN without PROCNAME",
      );
    } else if (ctx.PROCLENGTH().length === 0)
      this.checkHasIllegalOptions(
        ctx.MAXPROCLEN(),
        "MAXPROCLEN without PROCLENGTH",
      );

    if (ctx.PIPLIST().length === 0)
      this.checkHasIllegalOptions(ctx.PIPLENGTH(), "PIPLENGTH without PIPLIST");

    if (ctx.PIPLIST().length !== 0)
      this.checkHasMandatoryOptions(ctx.PIPLENGTH(), ctx, "PIPLENGTH");

    if (ctx.PROCNAME().length !== 0)
      this.checkHasMandatoryOptions(ctx.PROCLENGTH(), ctx, "PROCLENGTH");
  }

  private checkTcpIp(ctx: Cics_extract_tcpipContext) {
    this.checkHasMandatoryOptions(ctx.TCPIP(), ctx, "TCPIP");
    if (ctx.CLIENTNAME().length === 0)
      this.checkHasIllegalOptions(
        ctx.CNAMELENGTH(),
        "CNAMELENGTH without CLIENTNAME",
      );
    if (ctx.SERVERNAME().length === 0)
      this.checkHasIllegalOptions(
        ctx.SNAMELENGTH(),
        "SNAMELENGTH without SERVERNAME",
      );
    if (ctx.CLIENTADDR().length === 0)
      this.checkHasIllegalOptions(
        ctx.CADDRLENGTH(),
        "CADDRLENGTH without CLIENTADDR",
      );
    if (ctx.SERVERADDR().length === 0)
      this.checkHasIllegalOptions(
        ctx.SADDRLENGTH(),
        "SADDRLENGTH without SERVERADDR",
      );
    if (ctx.SERVERNAME().length !== 0)
      this.checkHasMandatoryOptions(ctx.SNAMELENGTH(), ctx, "SNAMELENGTH");
    if (ctx.CLIENTADDR().length !== 0)
      this.checkHasMandatoryOptions(ctx.CADDRLENGTH(), ctx, "CADDRLENGTH");
    if (ctx.SERVERADDR().length !== 0)
      this.checkHasMandatoryOptions(ctx.SADDRLENGTH(), ctx, "SADDRLENGTH");
  }

  private checkTCT(ctx: Cics_extract_tctContext) {
    this.checkHasMandatoryOptions(ctx.TCT(), ctx, "TCT");
    this.checkHasMandatoryOptions(ctx.NETNAME(), ctx, "NETNAME");

    this.checkHasMutuallyExclusiveOptions(
      "TERMID or SYSID",
      ctx.TERMID(),
      ctx.SYSID(),
    );
  }

  private checkWebClient(ctx: Cics_extract_web_clientContext) {
    this.checkHasMandatoryOptions(ctx.WEB(), ctx, "WEB");
    this.checkHasMandatoryOptions(ctx.SESSTOKEN(), ctx, "SESSTOKEN");

    if (ctx.REALM().length === 0)
      this.checkHasIllegalOptions(ctx.REALMLEN(), "REALMLEN without REALM");

    if (ctx.HOST().length === 0) {
      this.checkHasIllegalOptions(ctx.HOSTLENGTH(), "HOSTLENGTH without HOST");
      this.checkHasIllegalOptions(
        ctx.HOSTTYPE(),
        "HOSTTYPE without without HOST",
      );
    } else if (ctx.HOSTLENGTH().length === 0)
      this.checkHasIllegalOptions(
        ctx.HOSTTYPE(),
        "HOSTTYPE without HOSTLENGTH",
      );
    if (ctx.HTTPVERSION().length === 0)
      this.checkHasIllegalOptions(
        ctx.VERSIONLEN(),
        "VERSIONLEN without HTTPVERSION",
      );
    if (ctx.PATH().length === 0)
      this.checkHasIllegalOptions(ctx.PATHLENGTH(), "PATHLENGTH without PATH");
  }

  private checkWebServer(ctx: Cics_extract_web_serverContext) {
    this.checkHasMandatoryOptions(ctx.WEB(), ctx, "WEB");
    if (ctx.HTTPMETHOD().length === 0)
      this.checkHasIllegalOptions(
        ctx.METHODLENGTH(),
        "METHODLENGTH without HTTPMETHOD",
      );
    if (ctx.QUERYSTRING().length === 0)
      this.checkHasIllegalOptions(
        ctx.QUERYSTRLEN(),
        "QUERYSTRLEN without QUERYSTRING",
      );

    if (ctx.HOST().length === 0) {
      this.checkHasIllegalOptions(ctx.HOSTLENGTH(), "HOSTLENGTH without HOST");
      this.checkHasIllegalOptions(
        ctx.HOSTTYPE(),
        "HOSTTYPE without HOSTLENGTH",
      );
    } else if (ctx.HOSTLENGTH().length === 0)
      this.checkHasIllegalOptions(
        ctx.HOSTTYPE(),
        "HOSTTYPE without HOSTLENGTH",
      );
    if (ctx.HTTPVERSION().length === 0)
      this.checkHasIllegalOptions(
        ctx.VERSIONLEN(),
        "VERSIONLEN without HTTPVERSION",
      );
    if (ctx.PATH().length === 0)
      this.checkHasIllegalOptions(ctx.PATHLENGTH(), "PATHLEN without PATH");
    if (ctx.HTTPMETHOD().length !== 0)
      this.checkHasMandatoryOptions(ctx.METHODLENGTH(), ctx, "METHODLENGTH");
    if (ctx.HOST().length !== 0)
      this.checkHasMandatoryOptions(ctx.HOSTLENGTH(), ctx, "HOSTLENGTH");
    if (ctx.PATH().length !== 0)
      this.checkHasMandatoryOptions(ctx.PATHLENGTH(), ctx, "PATHLENGTH");
  }
}
