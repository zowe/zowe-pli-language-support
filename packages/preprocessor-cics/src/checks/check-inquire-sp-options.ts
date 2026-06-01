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
  Cics_inquire_association_listContext,
  Cics_inquire_bundleContext,
  Cics_inquire_bundlepartContext,
  Cics_inquire_capdatapredContext,
  Cics_inquire_capinfosrceContext,
  Cics_inquire_capoptpredContext,
  Cics_inquire_capturespecContext,
  Cics_inquire_deletshippedContext,
  Cics_inquire_enqContext,
  Cics_inquire_epadaptinsetContext,
  Cics_inquire_exitprogramContext,
  Cics_inquire_featurekeyContext,
  Cics_inquire_jvmendpointContext,
  Cics_inquire_modenameContext,
  Cics_inquire_mvstcbContext,
  Cics_inquire_netnameContext,
  Cics_inquire_osgibundleContext,
  Cics_inquire_osgiserviceContext,
  Cics_inquire_policyruleContext,
  Cics_inquire_programContext,
  Cics_inquire_reqidContext,
  Cics_inquire_statisticsContext,
  Cics_inquire_storage64Context,
  Cics_inquire_storageContext,
  Cics_inquire_subpoolContext,
  Cics_inquire_tagContext,
  Cics_inquire_task_listContext,
  Cics_inquire_terminalContext,
  Cics_inquire_tracetypeContext,
  Cics_inquire_tranclassContext,
  Cics_inquire_transactionContext,
  Cics_inquire_tsqueueContext,
  Cics_inquire_uowdsnfailContext,
  Cics_inquire_uowenqContext,
  Cics_inquire_vtamContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

/**
 * Checks CICS Inquire SP (System Programming Translator Option) rules for required and invalid
 * options
 */
export class InquireSpOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX =
    CICSParser.RULE_cics_inquire_system_programming;

  private static readonly COMMON_INQUIRE_BROWSE_RULES = new Map<number, number>([
    [CICSParser.RULE_cics_inquire_atomservice, CICSParser.ATOMSERVICE],
    [CICSParser.RULE_cics_inquire_autinstmodel, CICSParser.AUTINSTMODEL],
    [CICSParser.RULE_cics_inquire_brfacility, CICSParser.BRFACILITY],
    [CICSParser.RULE_cics_inquire_connection, CICSParser.CONNECTION],
    [CICSParser.RULE_cics_inquire_cfdtpool, CICSParser.CFDTPOOL],
    [CICSParser.RULE_cics_inquire_db2entry, CICSParser.DB2ENTRY],
    [CICSParser.RULE_cics_inquire_db2tran, CICSParser.DB2TRAN],
    [CICSParser.RULE_cics_inquire_doctemplate, CICSParser.DOCTEMPLATE],
    [CICSParser.RULE_cics_inquire_dsname, CICSParser.DSNAME],
    [CICSParser.RULE_cics_inquire_enqmodel, CICSParser.ENQMODEL],
    [CICSParser.RULE_cics_inquire_epadapter, CICSParser.EPADAPTER],
    [CICSParser.RULE_cics_inquire_epadapterset, CICSParser.EPADAPTERSET],
    [CICSParser.RULE_cics_inquire_eventbinding, CICSParser.EVENTBINDING],
    [CICSParser.RULE_cics_inquire_exci, CICSParser.EXCI],
    [CICSParser.RULE_cics_inquire_file, CICSParser.FILE],
    [CICSParser.RULE_cics_inquire_host, CICSParser.HOST],
    [CICSParser.RULE_cics_inquire_ipconn, CICSParser.IPCONN],
    [CICSParser.RULE_cics_inquire_journalmodel, CICSParser.JOURNALMODEL],
    [CICSParser.RULE_cics_inquire_journalname, CICSParser.JOURNALNAME],
    [CICSParser.RULE_cics_inquire_jvmserver, CICSParser.JVMSERVER],
    [CICSParser.RULE_cics_inquire_library, CICSParser.LIBRARY],
    [CICSParser.RULE_cics_inquire_mqmonitor, CICSParser.MQMONITOR],
    [CICSParser.RULE_cics_inquire_nodejsapp, CICSParser.NODEJSAPP],
    [CICSParser.RULE_cics_inquire_partner, CICSParser.PARTNER],
    [CICSParser.RULE_cics_inquire_pipeline, CICSParser.PIPELINE],
    [CICSParser.RULE_cics_inquire_policy, CICSParser.POLICY],
    [CICSParser.RULE_cics_inquire_processtype, CICSParser.PROCESSTYPE],
    [CICSParser.RULE_cics_inquire_profile, CICSParser.PROFILE],
    [CICSParser.RULE_cics_inquire_secrecording, CICSParser.SECRECORDING],
    [CICSParser.RULE_cics_inquire_streamname, CICSParser.STREAMNAME],
    [CICSParser.RULE_cics_inquire_sysdumpcode, CICSParser.SYSDUMPCODE],
    [CICSParser.RULE_cics_inquire_tcpipservice, CICSParser.TCPIPSERVICE],
    [CICSParser.RULE_cics_inquire_tdqueue, CICSParser.TDQUEUE],
    [CICSParser.RULE_cics_inquire_trandumpcode, CICSParser.TRANDUMPCODE],
    [CICSParser.RULE_cics_inquire_tsmodel, CICSParser.TSMODEL],
    [CICSParser.RULE_cics_inquire_tspool, CICSParser.TSPOOL],
    [CICSParser.RULE_cics_inquire_uow, CICSParser.UOW],
    [CICSParser.RULE_cics_inquire_uowlink, CICSParser.UOWLINK],
    [CICSParser.RULE_cics_inquire_urimap, CICSParser.URIMAP],
    [CICSParser.RULE_cics_inquire_webservice, CICSParser.WEBSERVICE],
    [CICSParser.RULE_cics_inquire_xmltransform, CICSParser.XMLTRANSFORM],
  ]);

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ABENDCODE, Severity.Error],
    [CICSLexer.ACCESSMETHOD, Severity.Error],
    [CICSLexer.ACCOUNTREC, Severity.Error],
    [CICSLexer.ACQSTATUS, Severity.Error],
    [CICSLexer.ACTIONCOUNT, Severity.Error],
    [CICSLexer.ACTIONTYPE, Severity.Error],
    [CICSLexer.ACTIVE, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACTIVITYID, Severity.Error],
    [CICSLexer.ACTOPENTCBS, Severity.Error],
    [CICSLexer.ACTSOCKETS, Severity.Error],
    [CICSLexer.ACTSSLTCBS, Severity.Error],
    [CICSLexer.ACTTHRDTCBS, Severity.Error],
    [CICSLexer.ACTXPTCBS, Severity.Error],
    [CICSLexer.ADAPTERTYPE, Severity.Error],
    [CICSLexer.ADD, Severity.Error],
    [CICSLexer.ADDRESS, Severity.Error],
    [CICSLexer.ADJUSTMENT, Severity.Error],
    [CICSLexer.ADDRESS64, Severity.Error],
    [CICSLexer.AGE, Severity.Error],
    [CICSLexer.AIBRIDGE, Severity.Error],
    [CICSLexer.AIDCOUNT, Severity.Error],
    [CICSLexer.AKP, Severity.Error],
    [CICSLexer.ALTPAGEHT, Severity.Error],
    [CICSLexer.ALTPAGEWD, Severity.Error],
    [CICSLexer.ALTPRINTER, Severity.Error],
    [CICSLexer.ALTPRTCOPYST, Severity.Error],
    [CICSLexer.ALTSCRNHT, Severity.Error],
    [CICSLexer.ALTSCRNWD, Severity.Error],
    [CICSLexer.ALTSUFFIX, Severity.Error],
    [CICSLexer.ANALYZERSTAT, Severity.Error],
    [CICSLexer.APIST, Severity.Error],
    [CICSLexer.APLKYBDST, Severity.Error],
    [CICSLexer.APLTEXTST, Severity.Error],
    [CICSLexer.APPENDCRLF, Severity.Error],
    [CICSLexer.APPLICATION, Severity.Error],
    [CICSLexer.APPLID, Severity.Error],
    [CICSLexer.APPLMAJORVER, Severity.Error],
    [CICSLexer.APPLMICROVER, Severity.Error],
    [CICSLexer.APPLMINORVER, Severity.Error],
    [CICSLexer.APPLNAMEST, Severity.Error],
    [CICSLexer.ARCHIVEFILE, Severity.Error],
    [CICSLexer.ASCII, Severity.Error],
    [CICSLexer.ATIFACILITY, Severity.Error],
    [CICSLexer.ATISTATUS, Severity.Error],
    [CICSLexer.ATITERMID, Severity.Error],
    [CICSLexer.ATITRANID, Severity.Error],
    [CICSLexer.ATIUSERID, Severity.Error],
    [CICSLexer.ATOMSERVICE, Severity.Error],
    [CICSLexer.ATOMTYPE, Severity.Error],
    [CICSLexer.ATTACHSEC, Severity.Error],
    [CICSLexer.ATTACHTIME, Severity.Error],
    [CICSLexer.ATTLS, Severity.Error],
    [CICSLexer.AUDALARMST, Severity.Error],
    [CICSLexer.AUDITLEVEL, Severity.Error],
    [CICSLexer.AUDITLOG, Severity.Error],
    [CICSLexer.AUTHENTICATE, Severity.Error],
    [CICSLexer.AUTHID, Severity.Error],
    [CICSLexer.AUTHORITY, Severity.Error],
    [CICSLexer.AUTHTYPE, Severity.Error],
    [CICSLexer.AUTHUSERID, Severity.Error],
    [CICSLexer.AUTINSTMODEL, Severity.Error],
    [CICSLexer.AUTOCONNECT, Severity.Error],
    [CICSLexer.AUXSTATUS, Severity.Error],
    [CICSLexer.AVAILABILITY, Severity.Error],
    [CICSLexer.AVAILABLE, Severity.Error],
    [CICSLexer.AVAILSTATUS, Severity.Error],
    [CICSLexer.BACKLOG, Severity.Error],
    [CICSLexer.BACKTRANSST, Severity.Error],
    [CICSLexer.BACKUPTYPE, Severity.Error],
    [CICSLexer.BASEDSNAME, Severity.Error],
    [CICSLexer.BASESCOPE, Severity.Error],
    [CICSLexer.BINDFILE, Severity.Error],
    [CICSLexer.BINDING, Severity.Error],
    [CICSLexer.BLOCKFORMAT, Severity.Error],
    [CICSLexer.BLOCKKEYLEN, Severity.Error],
    [CICSLexer.BLOCKSIZE, Severity.Error],
    [CICSLexer.BRANCHQUAL, Severity.Error],
    [CICSLexer.BREXIT, Severity.Error],
    [CICSLexer.BRFACILITY, Severity.Error],
    [CICSLexer.BRIDGE, Severity.Error],
    [CICSLexer.BROWSE, Severity.Error],
    [CICSLexer.BUNDLE, Severity.Error],
    [CICSLexer.BUNDLEDIR, Severity.Error],
    [CICSLexer.BUNDLEID, Severity.Error],
    [CICSLexer.BUNDLEPART, Severity.Error],
    [CICSLexer.CACHESIZE, Severity.Error],
    [CICSLexer.CAPTUREPOINT, Severity.Error],
    [CICSLexer.CAPTUREPTYPE, Severity.Error],
    [CICSLexer.CAPTURESPEC, Severity.Error],
    [CICSLexer.CAUSE, Severity.Error],
    [CICSLexer.CCSID, Severity.Error],
    [CICSLexer.CDSASIZE, Severity.Error],
    [CICSLexer.CEDFSTATUS, Severity.Error],
    [CICSLexer.CERTIFICATE, Severity.Error],
    [CICSLexer.CFDTPOOL, Severity.Error],
    [CICSLexer.CHANGEAGENT, Severity.Error],
    [CICSLexer.CHANGEAGREL, Severity.Error],
    [CICSLexer.CHANGETIME, Severity.Error],
    [CICSLexer.CHANGEUSRID, Severity.Error],
    [CICSLexer.CHARACTERSET, Severity.Error],
    [CICSLexer.CICSSTATUS, Severity.Error],
    [CICSLexer.CICSSYS, Severity.Error],
    [CICSLexer.CICSTSLEVEL, Severity.Error],
    [CICSLexer.CIDDOMAIN, Severity.Error],
    [CICSLexer.CIPHERS, Severity.Error],
    [CICSLexer.CLIENTLOC, Severity.Error],
    [CICSLexer.CLOSETIMEOUT, Severity.Error],
    [CICSLexer.CMD, Severity.Error],
    [CICSLexer.CMDPROTECT, Severity.Error],
    [CICSLexer.CMDSEC, Severity.Error],
    [CICSLexer.COBOLTYPE, Severity.Error],
    [CICSLexer.COLDSTATUS, Severity.Error],
    [CICSLexer.COLORST, Severity.Error],
    [CICSLexer.COMAUTHID, Severity.Error],
    [CICSLexer.COMAUTHTYPE, Severity.Error],
    [CICSLexer.COMPID, Severity.Error],
    [CICSLexer.COMPRESSST, Severity.Error],
    [CICSLexer.COMTHREADLIM, Severity.Error],
    [CICSLexer.COMTHREADS, Severity.Error],
    [CICSLexer.CONCURRENCY, Severity.Error],
    [CICSLexer.CONCURRENTST, Severity.Error],
    [CICSLexer.CONFIGDATA1, Severity.Error],
    [CICSLexer.CONFIGFILE, Severity.Error],
    [CICSLexer.CONNECTERROR, Severity.Error],
    [CICSLexer.CONNECTION, Severity.Error],
    [CICSLexer.CONNECTIONS, Severity.Error],
    [CICSLexer.CONNECTST, Severity.Error],
    [CICSLexer.CONNSTATUS, Severity.Error],
    [CICSLexer.CONNTYPE, Severity.Error],
    [CICSLexer.CONSOLE, Severity.Error],
    [CICSLexer.CONSOLES, Severity.Error],
    [CICSLexer.CONTAINER, Severity.Error],
    [CICSLexer.CONVERSEST, Severity.Error],
    [CICSLexer.CONVERTER, Severity.Error],
    [CICSLexer.COPY, Severity.Error],
    [CICSLexer.COPYST, Severity.Error],
    [CICSLexer.CORRELID, Severity.Error],
    [CICSLexer.CQP, Severity.Error],
    [CICSLexer.CREATESESS, Severity.Error],
    [CICSLexer.CRITICALST, Severity.Error],
    [CICSLexer.CRLPROFILE, Severity.Error],
    [CICSLexer.CURAUXDS, Severity.Error],
    [CICSLexer.CURRENT, Severity.Error],
    [CICSLexer.CURRENTDDS, Severity.Error],
    [CICSLexer.CURRENTHEAP, Severity.Error],
    [CICSLexer.CURRENTPROG, Severity.Error],
    [CICSLexer.CURREQS, Severity.Error],
    [CICSLexer.CURRPGM, Severity.Error],
    [CICSLexer.CURRPGMOP, Severity.Error],
    [CICSLexer.CURRTRANID, Severity.Error],
    [CICSLexer.CURRTRANIDOP, Severity.Error],
    [CICSLexer.CURRUSERID, Severity.Error],
    [CICSLexer.CURRUSERIDOP, Severity.Error],
    [CICSLexer.DAEOPTION, Severity.Error],
    [CICSLexer.DATABUFFERS, Severity.Error],
    [CICSLexer.DATAFORMAT, Severity.Error],
    [CICSLexer.DATALOCATION, Severity.Error],
    [CICSLexer.DATASTREAM, Severity.Error],
    [CICSLexer.DB2, Severity.Error],
    [CICSLexer.DB2CONN, Severity.Error],
    [CICSLexer.DB2ENTRY, Severity.Error],
    [CICSLexer.DB2GROUPID, Severity.Error],
    [CICSLexer.DB2ID, Severity.Error],
    [CICSLexer.DB2PLAN, Severity.Error],
    [CICSLexer.DB2RELEASE, Severity.Error],
    [CICSLexer.DB2TRAN, Severity.Error],
    [CICSLexer.DCT, Severity.Error],
    [CICSLexer.DDNAME, Severity.Error],
    [CICSLexer.DEBUGTOOL, Severity.Error],
    [CICSLexer.DEFINESOURCE, Severity.Error],
    [CICSLexer.DEFINETIME, Severity.Error],
    [CICSLexer.DEFPAGEHT, Severity.Error],
    [CICSLexer.DEFPAGEWD, Severity.Error],
    [CICSLexer.DEFSCRNHT, Severity.Error],
    [CICSLexer.DEFSCRNWD, Severity.Error],
    [CICSLexer.DELETE, Severity.Error],
    [CICSLexer.DEVICE, Severity.Error],
    [CICSLexer.DFLTUSER, Severity.Error],
    [CICSLexer.DISABLEDACT, Severity.Error],
    [CICSLexer.DISCREQST, Severity.Error],
    [CICSLexer.DISPOSITION, Severity.Error],
    [CICSLexer.DNAME, Severity.Error],
    [CICSLexer.DNAMELEN, Severity.Error],
    [CICSLexer.DOCTEMPLATE, Severity.Error],
    [CICSLexer.DPLLIMIT, Severity.Error],
    [CICSLexer.DROLLBACK, Severity.Error],
    [CICSLexer.DSALIMIT, Severity.Error],
    [CICSLexer.DSANAME, Severity.Error],
    [CICSLexer.DSNAME, Severity.Error],
    [CICSLexer.DSNAME01, Severity.Error],
    [CICSLexer.DSNAME02, Severity.Error],
    [CICSLexer.DSNAME03, Severity.Error],
    [CICSLexer.DSNAME04, Severity.Error],
    [CICSLexer.DSNAME05, Severity.Error],
    [CICSLexer.DSNAME06, Severity.Error],
    [CICSLexer.DSNAME07, Severity.Error],
    [CICSLexer.DSNAME08, Severity.Error],
    [CICSLexer.DSNAME09, Severity.Error],
    [CICSLexer.DSNAME10, Severity.Error],
    [CICSLexer.DSNAME11, Severity.Error],
    [CICSLexer.DSNAME12, Severity.Error],
    [CICSLexer.DSNAME13, Severity.Error],
    [CICSLexer.DSNAME14, Severity.Error],
    [CICSLexer.DSNAME15, Severity.Error],
    [CICSLexer.DSNAME16, Severity.Error],
    [CICSLexer.DSNAMELIST, Severity.Error],
    [CICSLexer.DSPLIST, Severity.Error],
    [CICSLexer.DSRTPROGRAM, Severity.Error],
    [CICSLexer.DTIMEOUT, Severity.Error],
    [CICSLexer.DTRPROGRAM, Severity.Error],
    [CICSLexer.DUALCASEST, Severity.Error],
    [CICSLexer.DUMPING, Severity.Error],
    [CICSLexer.DUMPSCOPE, Severity.Error],
    [CICSLexer.DURATION, Severity.Error],
    [CICSLexer.DYNAMSTATUS, Severity.Error],
    [CICSLexer.ECDSASIZE, Severity.Error],
    [CICSLexer.EDSALIMIT, Severity.Error],
    [CICSLexer.ELEMENT, Severity.Error],
    [CICSLexer.ELEMENT64, Severity.Error],
    [CICSLexer.ELEMENTLIST, Severity.Error],
    [CICSLexer.EMITMODE, Severity.Error],
    [CICSLexer.EMPTYSTATUS, Severity.Error],
    [CICSLexer.ENABLEDCOUNT, Severity.Error],
    [CICSLexer.ENABLESTATUS, Severity.Error],
    [CICSLexer.ENDOFDAY, Severity.Error],
    [CICSLexer.ENDOFDAYHRS, Severity.Error],
    [CICSLexer.ENDOFDAYMINS, Severity.Error],
    [CICSLexer.ENDOFDAYSECS, Severity.Error],
    [CICSLexer.ENDPOINT, Severity.Error],
    [CICSLexer.ENQFAILS, Severity.Error],
    [CICSLexer.ENQMODEL, Severity.Error],
    [CICSLexer.ENQNAME, Severity.Error],
    [CICSLexer.ENQSCOPE, Severity.Error],
    [CICSLexer.ENTRY, Severity.Error],
    [CICSLexer.ENTRYNAME, Severity.Error],
    [CICSLexer.ENTRYPOINT, Severity.Error],
    [CICSLexer.EPADAPTER, Severity.Error],
    [CICSLexer.EPADAPTERNUM, Severity.Error],
    [CICSLexer.EPADAPTERRES, Severity.Error],
    [CICSLexer.EPADAPTERSET, Severity.Error],
    [CICSLexer.EPCDSASIZE, Severity.Error],
    [CICSLexer.EPSTATUS, Severity.Error],
    [CICSLexer.EPUDSASIZE, Severity.Error],
    [CICSLexer.ERDSASIZE, Severity.Error],
    [CICSLexer.ERROROPTION, Severity.Error],
    [CICSLexer.ESDSASIZE, Severity.Error],
    [CICSLexer.EUDSASIZE, Severity.Error],
    [CICSLexer.EVENTBINDING, Severity.Error],
    [CICSLexer.EVENTNAME, Severity.Error],
    [CICSLexer.EXCEPTCLASS, Severity.Error],
    [CICSLexer.EXCI, Severity.Error],
    [CICSLexer.EXCLUSIVE, Severity.Error],
    [CICSLexer.EXECKEY, Severity.Error],
    [CICSLexer.EXECUTIONSET, Severity.Error],
    [CICSLexer.EXIT, Severity.Error],
    [CICSLexer.EXITPGM, Severity.Error],
    [CICSLexer.EXITPROGRAM, Severity.Error],
    [CICSLexer.EXITTRACING, Severity.Error],
    [CICSLexer.EXPIRYINT, Severity.Error],
    [CICSLexer.EXPIRYINTMIN, Severity.Error],
    [CICSLexer.EXTENDEDDSST, Severity.Error],
    [CICSLexer.FACILITY, Severity.Error],
    [CICSLexer.FACILITYLIKE, Severity.Error],
    [CICSLexer.FACILITYTYPE, Severity.Error],
    [CICSLexer.FCT, Severity.Error],
    [CICSLexer.FEATUREKEY, Severity.Error],
    [CICSLexer.FIELDLENGTH, Severity.Error],
    [CICSLexer.FIELDOFFSET, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.FILECOUNT, Severity.Error],
    [CICSLexer.FILELIMIT, Severity.Error],
    [CICSLexer.FILENAME, Severity.Error],
    [CICSLexer.FILEPATH, Severity.Error],
    [CICSLexer.FILTERVALUE, Severity.Error],
    [CICSLexer.FLAGSET, Severity.Error],
    [CICSLexer.FLENGTH, Severity.Error],
    [CICSLexer.FMHPARMST, Severity.Error],
    [CICSLexer.FMHSTATUS, Severity.Error],
    [CICSLexer.FORCEQR, Severity.Error],
    [CICSLexer.FORMATEDFST, Severity.Error],
    [CICSLexer.FORMFEEDST, Severity.Error],
    [CICSLexer.FREQUENCY, Severity.Error],
    [CICSLexer.FREQUENCYHRS, Severity.Error],
    [CICSLexer.FREQUENCYMINS, Severity.Error],
    [CICSLexer.FREQUENCYSECS, Severity.Error],
    [CICSLexer.FWDRECOVLOG, Severity.Error],
    [CICSLexer.FWDRECOVLSN, Severity.Error],
    [CICSLexer.FWDRECSTATUS, Severity.Error],
    [CICSLexer.GAENTRYNAME, Severity.Error],
    [CICSLexer.GALENGTH, Severity.Error],
    [CICSLexer.GARBAGEINT, Severity.Error],
    [CICSLexer.GAUSECOUNT, Severity.Error],
    [CICSLexer.GCDSASIZE, Severity.Error],
    [CICSLexer.GCHARS, Severity.Error],
    [CICSLexer.GCODES, Severity.Error],
    [CICSLexer.GCPOLICY, Severity.Error],
    [CICSLexer.GENERICTCPS, Severity.Error],
    [CICSLexer.GMMLENGTH, Severity.Error],
    [CICSLexer.GMMTEXT, Severity.Error],
    [CICSLexer.GMMTRANID, Severity.Error],
    [CICSLexer.GRNAME, Severity.Error],
    [CICSLexer.GRSTATUS, Severity.Error],
    [CICSLexer.GSDSASIZE, Severity.Error],
    [CICSLexer.GTFSTATUS, Severity.Error],
    [CICSLexer.GUDSASIZE, Severity.Error],
    [CICSLexer.HA, Severity.Error],
    [CICSLexer.HEALTH, Severity.Error],
    [CICSLexer.HEALTHABSTIM, Severity.Error],
    [CICSLexer.HEALTHCHECK, Severity.Error],
    [CICSLexer.HFORMST, Severity.Error],
    [CICSLexer.HFS, Severity.Error],
    [CICSLexer.HFSFILE, Severity.Error],
    [CICSLexer.HILIGHTST, Severity.Error],
    [CICSLexer.HOLDSTATUS, Severity.Error],
    [CICSLexer.HOST, Severity.Error],
    [CICSLexer.HOSTCODEPAGE, Severity.Error],
    [CICSLexer.HOSTTYPE, Severity.Error],
    [CICSLexer.HOURS, Severity.Error],
    [CICSLexer.IDENTIFIER, Severity.Error],
    [CICSLexer.IDLE, Severity.Error],
    [CICSLexer.IDLEHRS, Severity.Error],
    [CICSLexer.IDLEMINS, Severity.Error],
    [CICSLexer.IDLESECS, Severity.Error],
    [CICSLexer.IDNTYCLASS, Severity.Error],
    [CICSLexer.IDPROP, Severity.Error],
    [CICSLexer.INDIRECTNAME, Severity.Error],
    [CICSLexer.INDOUBT, Severity.Error],
    [CICSLexer.INDOUBTMINS, Severity.Error],
    [CICSLexer.INDOUBTST, Severity.Error],
    [CICSLexer.INDOUBTWAIT, Severity.Error],
    [CICSLexer.INITHEAP, Severity.Error],
    [CICSLexer.INITIALDDS, Severity.Error],
    [CICSLexer.INITQNAME, Severity.Error],
    [CICSLexer.INITSTATUS, Severity.Error],
    [CICSLexer.INSTALLAGENT, Severity.Error],
    [CICSLexer.INSTALLTIME, Severity.Error],
    [CICSLexer.INSTALLUSRID, Severity.Error],
    [CICSLexer.INTERVAL, Severity.Error],
    [CICSLexer.INTERVALHRS, Severity.Error],
    [CICSLexer.INTERVALMINS, Severity.Error],
    [CICSLexer.INTERVALSECS, Severity.Error],
    [CICSLexer.INTSTATUS, Severity.Error],
    [CICSLexer.INVOKETYPE, Severity.Error],
    [CICSLexer.IOTYPE, Severity.Error],
    [CICSLexer.IPADDRESS, Severity.Error],
    [CICSLexer.IPCONN, Severity.Error],
    [CICSLexer.IPFACILITIES, Severity.Error],
    [CICSLexer.IPFACILITY, Severity.Error],
    [CICSLexer.IPFACILTYPE, Severity.Error],
    [CICSLexer.IPFAMILY, Severity.Error],
    [CICSLexer.IPFLISTSIZE, Severity.Error],
    [CICSLexer.IPRESOLVED, Severity.Error],
    [CICSLexer.ISOLATEST, Severity.Error],
    [CICSLexer.ITEMNAME, Severity.Error],
    [CICSLexer.JAVAHOME, Severity.Error],
    [CICSLexer.JCT, Severity.Error],
    [CICSLexer.JOBLIST, Severity.Error],
    [CICSLexer.JOBNAME, Severity.Error],
    [CICSLexer.JOURNALMODEL, Severity.Error],
    [CICSLexer.JOURNALNAME, Severity.Error],
    [CICSLexer.JOURNALNUM, Severity.Error],
    [CICSLexer.JVMCLASS, Severity.Error],
    [CICSLexer.JVMENDPOINT, Severity.Error],
    [CICSLexer.JVMPROFILE, Severity.Error],
    [CICSLexer.JVMSERVER, Severity.Error],
    [CICSLexer.KATAKANAST, Severity.Error],
    [CICSLexer.KEEPTIME, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.KEYPOSITION, Severity.Error],
    [CICSLexer.LANGDEDUCED, Severity.Error],
    [CICSLexer.LANGUAGE, Severity.Error],
    [CICSLexer.LASTACTTIME, Severity.Error],
    [CICSLexer.LASTCOLDTIME, Severity.Error],
    [CICSLexer.LASTEMERTIME, Severity.Error],
    [CICSLexer.LASTINITTIME, Severity.Error],
    [CICSLexer.LASTMODTIME, Severity.Error],
    [CICSLexer.LASTUSEDINT, Severity.Error],
    [CICSLexer.LASTWARMTIME, Severity.Error],
    [CICSLexer.LASTWRITTIME, Severity.Error],
    [CICSLexer.LASTSECDTIME, Severity.Error],
    [CICSLexer.LENGTH, Severity.Error],
    [CICSLexer.LENGTHLIST, Severity.Error],
    [CICSLexer.LERUNOPTS, Severity.Error],
    [CICSLexer.LIBRARY, Severity.Error],
    [CICSLexer.LIBRARYDSN, Severity.Error],
    [CICSLexer.LIGHTPENST, Severity.Error],
    [CICSLexer.LINK, Severity.Error],
    [CICSLexer.LINKAUTH, Severity.Error],
    [CICSLexer.LINKSYSNET, Severity.Error],
    [CICSLexer.LINKSYSTEM, Severity.Error],
    [CICSLexer.LISTSIZE, Severity.Error],
    [CICSLexer.LOADPOINT, Severity.Error],
    [CICSLexer.LOADTYPE, Severity.Error],
    [CICSLexer.LOCATION, Severity.Error],
    [CICSLexer.LOG, Severity.Error],
    [CICSLexer.LOGDEFER, Severity.Error],
    [CICSLexer.LOGREPSTATUS, Severity.Error],
    [CICSLexer.LOSTLOCKS, Severity.Error],
    [CICSLexer.LPASTATUS, Severity.Error],
    [CICSLexer.LSRPOOLNUM, Severity.Error],
    [CICSLexer.MAJORVERSION, Severity.Error],
    [CICSLexer.MAPNAME, Severity.Error],
    [CICSLexer.MAPPINGLEVEL, Severity.Error],
    [CICSLexer.MAPPINGRNUM, Severity.Error],
    [CICSLexer.MAPPINGVNUM, Severity.Error],
    [CICSLexer.MAPSETNAME, Severity.Error],
    [CICSLexer.MAXACTIVE, Severity.Error],
    [CICSLexer.MAXDATALEN, Severity.Error],
    [CICSLexer.MAXHEAP, Severity.Error],
    [CICSLexer.MAXIMUM, Severity.Error],
    [CICSLexer.MAXITEMLEN, Severity.Error],
    [CICSLexer.MAXNUMRECS, Severity.Error],
    [CICSLexer.MAXOPENTCBS, Severity.Error],
    [CICSLexer.MAXPERSIST, Severity.Error],
    [CICSLexer.MAXQTIME, Severity.Error],
    [CICSLexer.MAXREQS, Severity.Error],
    [CICSLexer.MAXSOCKETS, Severity.Error],
    [CICSLexer.MAXSSLTCBS, Severity.Error],
    [CICSLexer.MAXTASKS, Severity.Error],
    [CICSLexer.MAXTHRDTCBS, Severity.Error],
    [CICSLexer.MAXWINNERS, Severity.Error],
    [CICSLexer.MAXXPTCBS, Severity.Error],
    [CICSLexer.MEDIATYPE, Severity.Error],
    [CICSLexer.MEMBER, Severity.Error],
    [CICSLexer.MEMBERNAME, Severity.Error],
    [CICSLexer.MEMLIMIT, Severity.Error],
    [CICSLexer.MESSAGECASE, Severity.Error],
    [CICSLexer.METADATAFILE, Severity.Error],
    [CICSLexer.MGMTPART, Severity.Error],
    [CICSLexer.MICROVERSION, Severity.Error],
    [CICSLexer.MINITEMLEN, Severity.Error],
    [CICSLexer.MINORVERSION, Severity.Error],
    [CICSLexer.MINRUNLEVEL, Severity.Error],
    [CICSLexer.MINRUNRNUM, Severity.Error],
    [CICSLexer.MINRUNVNUM, Severity.Error],
    [CICSLexer.MINUTES, Severity.Error],
    [CICSLexer.MIRRORLIFE, Severity.Error],
    [CICSLexer.MODE, Severity.Error],
    [CICSLexer.MODENAME, Severity.Error],
    [CICSLexer.MONDATA, Severity.Error],
    [CICSLexer.MONSTATUS, Severity.Error],
    [CICSLexer.MONUSERID, Severity.Error],
    [CICSLexer.MQCONN, Severity.Error],
    [CICSLexer.MQINI, Severity.Error],
    [CICSLexer.MQMONITOR, Severity.Error],
    [CICSLexer.MQNAME, Severity.Error],
    [CICSLexer.MQQMGR, Severity.Error],
    [CICSLexer.MQRELEASE, Severity.Error],
    [CICSLexer.MROBATCH, Severity.Error],
    [CICSLexer.MSGFORMAT, Severity.Error],
    [CICSLexer.MSGQUEUE1, Severity.Error],
    [CICSLexer.MSGQUEUE2, Severity.Error],
    [CICSLexer.MSGQUEUE3, Severity.Error],
    [CICSLexer.MSRCONTROLST, Severity.Error],
    [CICSLexer.MTOMNOXOPST, Severity.Error],
    [CICSLexer.MTOMST, Severity.Error],
    [CICSLexer.MVSSMFID, Severity.Error],
    [CICSLexer.MVSSYSNAME, Severity.Error],
    [CICSLexer.MVSTCB, Severity.Error],
    [CICSLexer.NAMESPACE, Severity.Error],
    [CICSLexer.NATLANG, Severity.Error],
    [CICSLexer.NATURE, Severity.Error],
    [CICSLexer.NETNAME, Severity.Error],
    [CICSLexer.NETUOWID, Severity.Error],
    [CICSLexer.NETWORK, Severity.Error],
    [CICSLexer.NETWORKID, Severity.Error],
    [CICSLexer.NEWSECDCOUNT, Severity.Error],
    [CICSLexer.NEXTTIME, Severity.Error],
    [CICSLexer.NEXTTIMEHRS, Severity.Error],
    [CICSLexer.NEXTTIMEMINS, Severity.Error],
    [CICSLexer.NEXTTIMESECS, Severity.Error],
    [CICSLexer.NEXTTRANSID, Severity.Error],
    [CICSLexer.NODEHOME, Severity.Error],
    [CICSLexer.NODEJSAPP, Severity.Error],
    [CICSLexer.NONTERMREL, Severity.Error],
    [CICSLexer.NQNAME, Severity.Error],
    [CICSLexer.NUMCIPHERS, Severity.Error],
    [CICSLexer.NUMDATAPRED, Severity.Error],
    [CICSLexer.NUMDSNAMES, Severity.Error],
    [CICSLexer.NUMELEMENTS, Severity.Error],
    [CICSLexer.NUMEXITS, Severity.Error],
    [CICSLexer.NUMINFOSRCE, Severity.Error],
    [CICSLexer.NUMITEMS, Severity.Error],
    [CICSLexer.NUMOPTPRED, Severity.Error],
    [CICSLexer.OBFORMATST, Severity.Error],
    [CICSLexer.OBJECT, Severity.Error],
    [CICSLexer.OBOPERIDST, Severity.Error],
    [CICSLexer.OCCUPANCY, Severity.Error],
    [CICSLexer.ODADPTRDATA1, Severity.Error],
    [CICSLexer.ODADPTRDATA2, Severity.Error],
    [CICSLexer.ODADPTRDATA3, Severity.Error],
    [CICSLexer.ODADPTRID, Severity.Error],
    [CICSLexer.ODAPPLID, Severity.Error],
    [CICSLexer.ODCLNTIPADDR, Severity.Error],
    [CICSLexer.ODCLNTPORT, Severity.Error],
    [CICSLexer.ODFACILNAME, Severity.Error],
    [CICSLexer.ODFACILTYPE, Severity.Error],
    [CICSLexer.ODIPFAMILY, Severity.Error],
    [CICSLexer.ODLUNAME, Severity.Error],
    [CICSLexer.ODNETID, Severity.Error],
    [CICSLexer.ODNETWORKID, Severity.Error],
    [CICSLexer.ODSERVERPORT, Severity.Error],
    [CICSLexer.ODTCPIPS, Severity.Error],
    [CICSLexer.ODTRANSID, Severity.Error],
    [CICSLexer.ODUSERID, Severity.Error],
    [CICSLexer.OPENSTATUS, Severity.Error],
    [CICSLexer.OPERATION, Severity.Error],
    [CICSLexer.OPERATOR, Severity.Error],
    [CICSLexer.OPERID, Severity.Error],
    [CICSLexer.OPREL, Severity.Error],
    [CICSLexer.OPSYS, Severity.Error],
    [CICSLexer.OPTIONNAME, Severity.Error],
    [CICSLexer.OPTIONSPGM, Severity.Error],
    [CICSLexer.OSGIBUNDLE, Severity.Error],
    [CICSLexer.OSGIBUNDLEID, Severity.Error],
    [CICSLexer.OSGISERVICE, Severity.Error],
    [CICSLexer.OSGISTATUS, Severity.Error],
    [CICSLexer.OSGIVERSION, Severity.Error],
    [CICSLexer.OSLEVEL, Severity.Error],
    [CICSLexer.OTSTID, Severity.Error],
    [CICSLexer.OTSTIMEOUT, Severity.Error],
    [CICSLexer.OUTLINEST, Severity.Error],
    [CICSLexer.PAGEHT, Severity.Error],
    [CICSLexer.PAGESTATUS, Severity.Error],
    [CICSLexer.PAGEWD, Severity.Error],
    [CICSLexer.PARTCLASS, Severity.Error],
    [CICSLexer.PARTCOUNT, Severity.Error],
    [CICSLexer.PARTITIONSST, Severity.Error],
    [CICSLexer.PARTNER, Severity.Error],
    [CICSLexer.PARTTYPE, Severity.Error],
    [CICSLexer.PATH, Severity.Error],
    [CICSLexer.PCDSASIZE, Severity.Error],
    [CICSLexer.PCT, Severity.Error],
    [CICSLexer.PENDSTATUS, Severity.Error],
    [CICSLexer.PERFCLASS, Severity.Error],
    [CICSLexer.PGMINTERFACE, Severity.Error],
    [CICSLexer.PID, Severity.Error],
    [CICSLexer.PIPELINE, Severity.Error],
    [CICSLexer.PLAN, Severity.Error],
    [CICSLexer.PLANEXITNAME, Severity.Error],
    [CICSLexer.PLATFORM, Severity.Error],
    [CICSLexer.PLTPIUSR, Severity.Error],
    [CICSLexer.POLICY, Severity.Error],
    [CICSLexer.POLICYRULE, Severity.Error],
    [CICSLexer.POOLNAME, Severity.Error],
    [CICSLexer.PORT, Severity.Error],
    [CICSLexer.PPT, Severity.Error],
    [CICSLexer.PREFIX, Severity.Error],
    [CICSLexer.PRIMPRED, Severity.Error],
    [CICSLexer.PRIMPREDOP, Severity.Error],
    [CICSLexer.PRIMPREDTYPE, Severity.Error],
    [CICSLexer.PRINTADAPTST, Severity.Error],
    [CICSLexer.PRINTCONTROL, Severity.Error],
    [CICSLexer.PRINTER, Severity.Error],
    [CICSLexer.PRIORITY, Severity.Error],
    [CICSLexer.PRIVACY, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROFILE, Severity.Error],
    [CICSLexer.PROFILEDIR, Severity.Error],
    [CICSLexer.PROGAUTOCTLG, Severity.Error],
    [CICSLexer.PROGAUTOEXIT, Severity.Error],
    [CICSLexer.PROGAUTOINST, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.PROGSYMBOLST, Severity.Error],
    [CICSLexer.PROGTYPE, Severity.Error],
    [CICSLexer.PROTECTNUM, Severity.Error],
    [CICSLexer.PROTOCOL, Severity.Error],
    [CICSLexer.PRTCOPYST, Severity.Error],
    [CICSLexer.PRTYAGING, Severity.Error],
    [CICSLexer.PSB, Severity.Error],
    [CICSLexer.PSDINTERVAL, Severity.Error],
    [CICSLexer.PSDINTHRS, Severity.Error],
    [CICSLexer.PSDINTMINS, Severity.Error],
    [CICSLexer.PSDINTSECS, Severity.Error],
    [CICSLexer.PSTYPE, Severity.Error],
    [CICSLexer.PTHREADS, Severity.Error],
    [CICSLexer.PUDSASIZE, Severity.Error],
    [CICSLexer.PURGEABILITY, Severity.Error],
    [CICSLexer.PURGEABLEST, Severity.Error],
    [CICSLexer.PURGEACTION, Severity.Error],
    [CICSLexer.PURGECYCLEM, Severity.Error],
    [CICSLexer.PURGECYCLES, Severity.Error],
    [CICSLexer.PURGETHRESH, Severity.Error],
    [CICSLexer.QNAME, Severity.Error],
    [CICSLexer.QUALIFIER, Severity.Error],
    [CICSLexer.QUALLEN, Severity.Error],
    [CICSLexer.QUERYST, Severity.Error],
    [CICSLexer.QUEUE, Severity.Error],
    [CICSLexer.QUEUED, Severity.Error],
    [CICSLexer.QUEUELIMIT, Severity.Error],
    [CICSLexer.QUIESCESTATE, Severity.Error],
    [CICSLexer.RANKING, Severity.Error],
    [CICSLexer.RBATYPE, Severity.Error],
    [CICSLexer.RDSASIZE, Severity.Error],
    [CICSLexer.READ, Severity.Error],
    [CICSLexer.READINTEG, Severity.Error],
    [CICSLexer.REALM, Severity.Error],
    [CICSLexer.REALMLEN, Severity.Error],
    [CICSLexer.REASON, Severity.Error],
    [CICSLexer.RECEIVECOUNT, Severity.Error],
    [CICSLexer.RECORDFORMAT, Severity.Error],
    [CICSLexer.RECORDING, Severity.Error],
    [CICSLexer.RECORDLENGTH, Severity.Error],
    [CICSLexer.RECORDSIZE, Severity.Error],
    [CICSLexer.RECOVSTATUS, Severity.Error],
    [CICSLexer.REDIRECTTYPE, Severity.Error],
    [CICSLexer.REENTPROTECT, Severity.Error],
    [CICSLexer.REGIONUSERID, Severity.Error],
    [CICSLexer.RELATION, Severity.Error],
    [CICSLexer.RELEASE, Severity.Error],
    [CICSLexer.RELREQST, Severity.Error],
    [CICSLexer.RELTYPE, Severity.Error],
    [CICSLexer.REMOTENAME, Severity.Error],
    [CICSLexer.REMOTEPREFIX, Severity.Error],
    [CICSLexer.REMOTESYSNET, Severity.Error],
    [CICSLexer.REMOTESYSTEM, Severity.Error],
    [CICSLexer.REMOTETABLE, Severity.Error],
    [CICSLexer.REPLICATION, Severity.Error],
    [CICSLexer.REQID, Severity.Error],
    [CICSLexer.REQTYPE, Severity.Error],
    [CICSLexer.RES, Severity.Error],
    [CICSLexer.RESCOUNT, Severity.Error],
    [CICSLexer.RESIDENCY, Severity.Error],
    [CICSLexer.RESNAME, Severity.Error],
    [CICSLexer.RESOURCENAME, Severity.Error],
    [CICSLexer.RESOURCETYPE, Severity.Error],
    [CICSLexer.RESPWAIT, Severity.Error],
    [CICSLexer.RESRCECLASS, Severity.Error],
    [CICSLexer.RESSEC, Severity.Error],
    [CICSLexer.RESYNCMEMBER, Severity.Error],
    [CICSLexer.RESYNCSTATUS, Severity.Error],
    [CICSLexer.RETLOCKS, Severity.Error],
    [CICSLexer.REUSELIMIT, Severity.Error],
    [CICSLexer.REWIND, Severity.Error],
    [CICSLexer.RLSACCESS, Severity.Error],
    [CICSLexer.RLSSTATUS, Severity.Error],
    [CICSLexer.RMIQFY, Severity.Error],
    [CICSLexer.RMIST, Severity.Error],
    [CICSLexer.ROLE, Severity.Error],
    [CICSLexer.ROUTESTATUS, Severity.Error],
    [CICSLexer.ROUTING, Severity.Error],
    [CICSLexer.RTERMID, Severity.Error],
    [CICSLexer.RTIMEOUT, Severity.Error],
    [CICSLexer.RTRANSID, Severity.Error],
    [CICSLexer.RULEGROUP, Severity.Error],
    [CICSLexer.RULEITEM, Severity.Error],
    [CICSLexer.RULETYPE, Severity.Error],
    [CICSLexer.RUNAWAY, Severity.Error],
    [CICSLexer.RUNAWAYTYPE, Severity.Error],
    [CICSLexer.RUNSTATUS, Severity.Error],
    [CICSLexer.RUNTIME, Severity.Error],
    [CICSLexer.SCANDELAY, Severity.Error],
    [CICSLexer.SCHEMALEVEL, Severity.Error],
    [CICSLexer.SCHEME, Severity.Error],
    [CICSLexer.SCRNHT, Severity.Error],
    [CICSLexer.SCRNSIZE, Severity.Error],
    [CICSLexer.SCRNWD, Severity.Error],
    [CICSLexer.SDSASIZE, Severity.Error],
    [CICSLexer.SDTMEMLIMIT, Severity.Error],
    [CICSLexer.SDTRAN, Severity.Error],
    [CICSLexer.SEARCHPOS, Severity.Error],
    [CICSLexer.SECDCOUNT, Severity.Error],
    [CICSLexer.SECONDS, Severity.Error],
    [CICSLexer.SECPORT, Severity.Error],
    [CICSLexer.SECRECORDING, Severity.Error],
    [CICSLexer.SECURITY, Severity.Error],
    [CICSLexer.SECURITYMGR, Severity.Error],
    [CICSLexer.SECURITYNAME, Severity.Error],
    [CICSLexer.SECURITYST, Severity.Error],
    [CICSLexer.SENDCOUNT, Severity.Error],
    [CICSLexer.SENDMTOMST, Severity.Error],
    [CICSLexer.SERVSTATUS, Severity.Error],
    [CICSLexer.SESSIONTYPE, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.SETTRANSID, Severity.Error],
    [CICSLexer.SHARELOCKS, Severity.Error],
    [CICSLexer.SHARESTATUS, Severity.Error],
    [CICSLexer.SHELF, Severity.Error],
    [CICSLexer.SHUTDOWN, Severity.Error],
    [CICSLexer.SHUTDOWNST, Severity.Error],
    [CICSLexer.SHUTOPTION, Severity.Error],
    [CICSLexer.SHUTSTATUS, Severity.Error],
    [CICSLexer.SIGNID, Severity.Error],
    [CICSLexer.SIGNONSTATUS, Severity.Error],
    [CICSLexer.SINGLESTATUS, Severity.Error],
    [CICSLexer.SOAPLEVEL, Severity.Error],
    [CICSLexer.SOAPRNUM, Severity.Error],
    [CICSLexer.SOAPVNUM, Severity.Error],
    [CICSLexer.SOCKETCLOSE, Severity.Error],
    [CICSLexer.SOCKPOOLSIZE, Severity.Error],
    [CICSLexer.SOSABOVEBAR, Severity.Error],
    [CICSLexer.SOSABOVELINE, Severity.Error],
    [CICSLexer.SOSBELOWLINE, Severity.Error],
    [CICSLexer.SOSIST, Severity.Error],
    [CICSLexer.SOSSTATUS, Severity.Error],
    [CICSLexer.SPECIFTCPS, Severity.Error],
    [CICSLexer.SPIST, Severity.Error],
    [CICSLexer.SRRSTATUS, Severity.Error],
    [CICSLexer.SRRTASKS, Severity.Error],
    [CICSLexer.SRVCNAME, Severity.Error],
    [CICSLexer.SRVCSTATUS, Severity.Error],
    [CICSLexer.SSLCACHE, Severity.Error],
    [CICSLexer.SSLTYPE, Severity.Error],
    [CICSLexer.STANDBYMODE, Severity.Error],
    [CICSLexer.STARTCODE, Severity.Error],
    [CICSLexer.STARTSCRIPT, Severity.Error],
    [CICSLexer.STARTSTATUS, Severity.Error],
    [CICSLexer.STARTUP, Severity.Error],
    [CICSLexer.STARTUPDATE, Severity.Error],
    [CICSLexer.STATE, Severity.Error],
    [CICSLexer.STATSQUEUE, Severity.Error],
    [CICSLexer.STATUS, Severity.Error],
    [CICSLexer.STDERR, Severity.Error],
    [CICSLexer.STDOUT, Severity.Error],
    [CICSLexer.STORAGECLEAR, Severity.Error],
    [CICSLexer.STOREPROTECT, Severity.Error],
    [CICSLexer.STREAMNAME, Severity.Error],
    [CICSLexer.STRINGS, Severity.Error],
    [CICSLexer.STRUCTNAME, Severity.Error],
    [CICSLexer.SUBPOOL, Severity.Error],
    [CICSLexer.SUBTASKS, Severity.Error],
    [CICSLexer.SUSPENDTIME, Severity.Error],
    [CICSLexer.SUSPENDTYPE, Severity.Error],
    [CICSLexer.SUSPENDVALUE, Severity.Error],
    [CICSLexer.SWITCHSTATUS, Severity.Error],
    [CICSLexer.SYNCPOINTST, Severity.Error],
    [CICSLexer.SYSDUMPCODE, Severity.Error],
    [CICSLexer.SYSDUMPING, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.SYSOUTCLASS, Severity.Error],
    [CICSLexer.SYSTEMLOG, Severity.Error],
    [CICSLexer.SYSTEMSTATUS, Severity.Error],
    [CICSLexer.TABLE, Severity.Error],
    [CICSLexer.TABLENAME, Severity.Error],
    [CICSLexer.TABLESIZE, Severity.Error],
    [CICSLexer.TALENGTH, Severity.Error],
    [CICSLexer.TARGETCOUNT, Severity.Error],
    [CICSLexer.TASK, Severity.Error],
    [CICSLexer.TASKDATAKEY, Severity.Error],
    [CICSLexer.TASKDATALOC, Severity.Error],
    [CICSLexer.TASKID, Severity.Error],
    [CICSLexer.TASKS, Severity.Error],
    [CICSLexer.TASKSTARTST, Severity.Error],
    [CICSLexer.TCAMCONTROL, Severity.Error],
    [CICSLexer.TCB, Severity.Error],
    [CICSLexer.TCBLIMIT, Severity.Error],
    [CICSLexer.TCBS, Severity.Error],
    [CICSLexer.TCEXITSTATUS, Severity.Error],
    [CICSLexer.TCLASS, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.TDQUEUE, Severity.Error],
    [CICSLexer.TEMPLATENAME, Severity.Error],
    [CICSLexer.TEMPLATETYPE, Severity.Error],
    [CICSLexer.TERMID, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.TERMMODEL, Severity.Error],
    [CICSLexer.TERMPRIORITY, Severity.Error],
    [CICSLexer.TERMSTATUS, Severity.Error],
    [CICSLexer.TEXTKYBDST, Severity.Error],
    [CICSLexer.TEXTPRINTST, Severity.Error],
    [CICSLexer.THREADCOUNT, Severity.Error],
    [CICSLexer.THREADERROR, Severity.Error],
    [CICSLexer.THREADLIMIT, Severity.Error],
    [CICSLexer.THREADS, Severity.Error],
    [CICSLexer.THREADWAIT, Severity.Error],
    [CICSLexer.THRESHOLD, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.TIMEOUTINT, Severity.Error],
    [CICSLexer.TNADDR, Severity.Error],
    [CICSLexer.TNIPFAMILY, Severity.Error],
    [CICSLexer.TNPORT, Severity.Error],
    [CICSLexer.TPNAME, Severity.Error],
    [CICSLexer.TPNAMELEN, Severity.Error],
    [CICSLexer.TRACE, Severity.Error],
    [CICSLexer.TRACING, Severity.Error],
    [CICSLexer.TRAN, Severity.Error],
    [CICSLexer.TRANCLASS, Severity.Error],
    [CICSLexer.TRANDUMPCODE, Severity.Error],
    [CICSLexer.TRANDUMPING, Severity.Error],
    [CICSLexer.TRANISOLATE, Severity.Error],
    [CICSLexer.TRANPRIORITY, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.TRANSMODE, Severity.Error],
    [CICSLexer.TRIGGERLEVEL, Severity.Error],
    [CICSLexer.TRIGMONTASKS, Severity.Error],
    [CICSLexer.TRPROF, Severity.Error],
    [CICSLexer.TSMAININUSE, Severity.Error],
    [CICSLexer.TSMAINLIMIT, Severity.Error],
    [CICSLexer.TSMODEL, Severity.Error],
    [CICSLexer.TSPOOL, Severity.Error],
    [CICSLexer.TSQNAME, Severity.Error],
    [CICSLexer.TSQUEUE, Severity.Error],
    [CICSLexer.TSQUEUELIMIT, Severity.Error],
    [CICSLexer.TST, Severity.Error],
    [CICSLexer.TTISTATUS, Severity.Error],
    [CICSLexer.TWASIZE, Severity.Error],
    [CICSLexer.TYPE, Severity.Error],
    [CICSLexer.UCTRANST, Severity.Error],
    [CICSLexer.UDSASIZE, Severity.Error],
    [CICSLexer.UOWLINK, Severity.Error],
    [CICSLexer.UOWSTATE, Severity.Error],
    [CICSLexer.UPDATE, Severity.Error],
    [CICSLexer.UPDATEMODEL, Severity.Error],
    [CICSLexer.URID, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.URIMAPLIMIT, Severity.Error],
    [CICSLexer.URM, Severity.Error],
    [CICSLexer.USAGE, Severity.Error],
    [CICSLexer.USECOUNT, Severity.Error],
    [CICSLexer.USER, Severity.Error],
    [CICSLexer.USERAREA, Severity.Error],
    [CICSLexer.USERAREALEN, Severity.Error],
    [CICSLexer.USERAUTH, Severity.Error],
    [CICSLexer.USERCORRDATA, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.USERNAME, Severity.Error],
    [CICSLexer.USERSTATUS, Severity.Error],
    [CICSLexer.USERTAG, Severity.Error],
    [CICSLexer.VALIDATIONST, Severity.Error],
    [CICSLexer.VALIDITY, Severity.Error],
    [CICSLexer.VALUE, Severity.Error],
    [CICSLexer.VARIABLENAME, Severity.Error],
    [CICSLexer.VFORMST, Severity.Error],
    [CICSLexer.WAITCAUSE, Severity.Error],
    [CICSLexer.WAITSTATE, Severity.Error],
    [CICSLexer.WEBSERVICE, Severity.Error],
    [CICSLexer.WEBSERVLIMIT, Severity.Error],
    [CICSLexer.WLMOPENST, Severity.Error],
    [CICSLexer.WORKDIR, Severity.Error],
    [CICSLexer.WSBIND, Severity.Error],
    [CICSLexer.WSDIR, Severity.Error],
    [CICSLexer.WSDLFILE, Severity.Error],
    [CICSLexer.XCFGROUP, Severity.Error],
    [CICSLexer.XID, Severity.Error],
    [CICSLexer.XLNSTATUS, Severity.Error],
    [CICSLexer.XMLSCHEMA, Severity.Error],
    [CICSLexer.XMLTRANSFORM, Severity.Error],
    [CICSLexer.XOPDIRECTST, Severity.Error],
    [CICSLexer.XOPSUPPORTST, Severity.Error],
    [CICSLexer.XRFSTATUS, Severity.Error],
    [CICSLexer.XSDBIND, Severity.Error],
    [CICSLexer.ZCPTRACING, Severity.Error],
    [CICSLexer.AFTER, Severity.Warning],
    [CICSLexer.ASSOCIATION, Severity.Warning],
    [CICSLexer.AT, Severity.Warning],
    [CICSLexer.AUTOINSTALL, Severity.Warning],
    [CICSLexer.CAPDATAPRED, Severity.Warning],
    [CICSLexer.CAPINFOSRCE, Severity.Warning],
    [CICSLexer.CAPOPTPRED, Severity.Warning],
    [CICSLexer.DELETSHIPPED, Severity.Warning],
    [CICSLexer.DISPATCHABLE, Severity.Warning],
    [CICSLexer.DISPATCHER, Severity.Warning],
    [CICSLexer.DUMPDS, Severity.Warning],
    [CICSLexer.END, Severity.Warning],
    [CICSLexer.ENQ, Severity.Warning],
    [CICSLexer.EPADAPTINSET, Severity.Warning],
    [CICSLexer.EVENTPROCESS, Severity.Warning],
    [CICSLexer.INQUIRE, Severity.Warning],
    [CICSLexer.IRC, Severity.Warning],
    [CICSLexer.LIST, Severity.Warning],
    [CICSLexer.MONITOR, Severity.Warning],
    [CICSLexer.NEXT, Severity.Warning],
    [CICSLexer.RRMS, Severity.Warning],
    [CICSLexer.RUNNING, Severity.Warning],
    [CICSLexer.SECDISCOVERY, Severity.Warning],
    [CICSLexer.SPECIAL, Severity.Warning],
    [CICSLexer.STANDARD, Severity.Warning],
    [CICSLexer.START, Severity.Warning],
    [CICSLexer.STATISTICS, Severity.Warning],
    [CICSLexer.STORAGE, Severity.Warning],
    [CICSLexer.STORAGE64, Severity.Warning],
    [CICSLexer.SUSPENDED, Severity.Warning],
    [CICSLexer.SYSTEM, Severity.Warning],
    [CICSLexer.TAG, Severity.Warning],
    [CICSLexer.TCPIP, Severity.Warning],
    [CICSLexer.TEMPSTORAGE, Severity.Warning],
    [CICSLexer.TRACEDEST, Severity.Warning],
    [CICSLexer.TRACEFLAG, Severity.Warning],
    [CICSLexer.TRACETYPE, Severity.Warning],
    [CICSLexer.UOWDSNFAIL, Severity.Warning],
    [CICSLexer.UOWENQ, Severity.Warning],
    [CICSLexer.VTAM, Severity.Warning],
    [CICSLexer.WEB, Severity.Warning],
    [CICSLexer.WLMHEALTH, Severity.Warning],
    [CICSLexer.AP, Severity.Error],
    [CICSLexer.ASYNCSERVICE, Severity.Error],
    [CICSLexer.BA, Severity.Error],
    [CICSLexer.BM, Severity.Error],
    [CICSLexer.BR, Severity.Error],
    [CICSLexer.BUSAPPMGR, Severity.Error],
    [CICSLexer.CP, Severity.Error],
    [CICSLexer.CPI, Severity.Error],
    [CICSLexer.DC, Severity.Error],
    [CICSLexer.DD, Severity.Error],
    [CICSLexer.DH, Severity.Error],
    [CICSLexer.DIRMGR, Severity.Error],
    [CICSLexer.DM, Severity.Error],
    [CICSLexer.DOMAINMGR, Severity.Error],
    [CICSLexer.DP, Severity.Error],
    [CICSLexer.DS, Severity.Error],
    [CICSLexer.DU, Severity.Error],
    [CICSLexer.EC, Severity.Error],
    [CICSLexer.EI, Severity.Error],
    [CICSLexer.EJ, Severity.Error],
    [CICSLexer.EM, Severity.Error],
    [CICSLexer.ENQUEUE, Severity.Error],
    [CICSLexer.ENTJAVA, Severity.Error],
    [CICSLexer.EP, Severity.Error],
    [CICSLexer.EVENTCAPTURE, Severity.Error],
    [CICSLexer.EVENTMGR, Severity.Error],
    [CICSLexer.EVENTPROC, Severity.Error],
    [CICSLexer.FC, Severity.Error],
    [CICSLexer.GC, Severity.Error],
    [CICSLexer.GLOBALCATLG, Severity.Error],
    [CICSLexer.IC, Severity.Error],
    [CICSLexer.IE, Severity.Error],
    [CICSLexer.IPECI, Severity.Error],
    [CICSLexer.IS, Severity.Error],
    [CICSLexer.KC, Severity.Error],
    [CICSLexer.KE, Severity.Error],
    [CICSLexer.KERNEL, Severity.Error],
    [CICSLexer.LD, Severity.Error],
    [CICSLexer.LG, Severity.Error],
    [CICSLexer.LM, Severity.Error],
    [CICSLexer.LOADER, Severity.Error],
    [CICSLexer.LOCALCATLG, Severity.Error],
    [CICSLexer.LOCKMGR, Severity.Error],
    [CICSLexer.LOGGER, Severity.Error],
    [CICSLexer.MANAGEDPLAT, Severity.Error],
    [CICSLexer.ME, Severity.Error],
    [CICSLexer.ML, Severity.Error],
    [CICSLexer.MN, Severity.Error],
    [CICSLexer.MP, Severity.Error],
    [CICSLexer.NQ, Severity.Error],
    [CICSLexer.OBJECTTRAN, Severity.Error],
    [CICSLexer.OT, Severity.Error],
    [CICSLexer.PA, Severity.Error],
    [CICSLexer.PARAMGR, Severity.Error],
    [CICSLexer.PC, Severity.Error],
    [CICSLexer.PG, Severity.Error],
    [CICSLexer.PI, Severity.Error],
    [CICSLexer.PIPEMGR, Severity.Error],
    [CICSLexer.PROGMGR, Severity.Error],
    [CICSLexer.PT, Severity.Error],
    [CICSLexer.RA, Severity.Error],
    [CICSLexer.RECOVERY, Severity.Error],
    [CICSLexer.REGIONSTAT, Severity.Error],
    [CICSLexer.REQUESTSTRM, Severity.Error],
    [CICSLexer.RESLIFEMGR, Severity.Error],
    [CICSLexer.RI, Severity.Error],
    [CICSLexer.RL, Severity.Error],
    [CICSLexer.RM, Severity.Error],
    [CICSLexer.RMI, Severity.Error],
    [CICSLexer.RMIADAPTERS, Severity.Error],
    [CICSLexer.RRS, Severity.Error],
    [CICSLexer.RS, Severity.Error],
    [CICSLexer.RX, Severity.Error],
    [CICSLexer.RZ, Severity.Error],
    [CICSLexer.SC, Severity.Error],
    [CICSLexer.SCHEDULER, Severity.Error],
    [CICSLexer.SH, Severity.Error],
    [CICSLexer.SJ, Severity.Error],
    [CICSLexer.SJVM, Severity.Error],
    [CICSLexer.SM, Severity.Error],
    [CICSLexer.SO, Severity.Error],
    [CICSLexer.SOCKETS, Severity.Error],
    [CICSLexer.ST, Severity.Error],
    [CICSLexer.SZ, Severity.Error],
    [CICSLexer.TC, Severity.Error],
    [CICSLexer.TI, Severity.Error],
    [CICSLexer.TR, Severity.Error],
    [CICSLexer.TRANMGR, Severity.Error],
    [CICSLexer.UE, Severity.Error],
    [CICSLexer.US, Severity.Error],
    [CICSLexer.W2, Severity.Error],
    [CICSLexer.WB, Severity.Error],
    [CICSLexer.WEB2, Severity.Error],
    [CICSLexer.WEBRESTMGR, Severity.Error],
    [CICSLexer.WU, Severity.Error],
    [CICSLexer.XM, Severity.Error],
    [CICSLexer.XS, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, InquireSpOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Inquire SP rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_inquire_association_list: {
        const listContext = ctx as unknown as Cics_inquire_association_listContext;
        this.checkHasMandatoryOptions(listContext.LIST(), ctx, "LIST");
        this.checkHasMandatoryOptions(listContext.LISTSIZE(), ctx, "LISTSIZE");
        break;
      }
      case CICSParser.RULE_cics_inquire_bundle: {
        const bundleContext = ctx as unknown as Cics_inquire_bundleContext;
        this.checkBrowseMutuallyExclusive(bundleContext);
        if (bundleContext.START().length !== 0 || bundleContext.END().length !== 0) {
          this.checkBrowsingInvalidOptions(bundleContext, CICSParser.BUNDLE);
        } else this.checkStatementHasParameter(bundleContext, CICSParser.BUNDLE);
        break;
      }
      case CICSParser.RULE_cics_inquire_bundlepart: {
        const bundlepartContext = ctx as unknown as Cics_inquire_bundlepartContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          bundlepartContext,
          bundlepartContext.START(),
          bundlepartContext.END(),
          bundlepartContext.NEXT(),
        );
        if (
          bundlepartContext.START().length !== 0 ||
          bundlepartContext.END().length !== 0
        ) {
          if (bundlepartContext.END().length === 0)
            this.checkHasMandatoryOptions(
              bundlepartContext.BUNDLE(),
              bundlepartContext,
              "BUNDLE with START",
            );
          else
            this.checkHasIllegalOptions(
              bundlepartContext.BUNDLE(),
              "BUNDLE with END",
            );
          this.checkBrowsingInvalidOptions(
            bundlepartContext,
            CICSParser.BUNDLEPART,
            CICSParser.BUNDLE,
          );
          this.checkBrowsingHasNotParameter(
            bundlepartContext,
            CICSParser.BUNDLEPART,
          );
        } else
          this.checkStatementHasParameter(
            bundlepartContext,
            CICSParser.BUNDLEPART,
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_capdatapred: {
        const capdatapredContext = ctx as unknown as Cics_inquire_capdatapredContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          capdatapredContext,
          capdatapredContext.START(),
          capdatapredContext.END(),
          capdatapredContext.NEXT(),
        );
        if (
          capdatapredContext.START().length !== 0 ||
          capdatapredContext.END().length !== 0
        ) {
          if (capdatapredContext.START().length !== 0) {
            this.checkHasMandatoryOptions(
              capdatapredContext.CAPTURESPEC(),
              capdatapredContext,
              "CAPTURESPEC with START",
            );
            this.checkHasMandatoryOptions(
              capdatapredContext.EVENTBINDING(),
              capdatapredContext,
              "EVENTBINDING with START",
            );
          } else {
            this.checkHasIllegalOptions(
              capdatapredContext.CAPTURESPEC(),
              "CAPTURESPEC with END",
            );
            this.checkHasIllegalOptions(
              capdatapredContext.EVENTBINDING(),
              "EVENTBINDING with END",
            );
          }
          this.checkBrowsingInvalidOptions(
            capdatapredContext,
            CICSParser.CAPDATAPRED,
            CICSParser.CAPTURESPEC,
            CICSParser.EVENTBINDING,
          );
        } else if (capdatapredContext.NEXT().length !== 0) {
          this.checkHasIllegalOptions(
            capdatapredContext.CAPTURESPEC(),
            "CAPTURESPEC with NEXT",
          );
          this.checkHasIllegalOptions(
            capdatapredContext.EVENTBINDING(),
            "EVENTBINDING with NEXT",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_capinfosrce: {
        const capinfosrceContext = ctx as unknown as Cics_inquire_capinfosrceContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          capinfosrceContext,
          capinfosrceContext.START(),
          capinfosrceContext.END(),
          capinfosrceContext.NEXT(),
        );
        if (
          capinfosrceContext.START().length !== 0 ||
          capinfosrceContext.END().length !== 0
        ) {
          if (capinfosrceContext.START().length !== 0) {
            this.checkHasMandatoryOptions(
              capinfosrceContext.CAPTURESPEC(),
              capinfosrceContext,
              "CAPTURESPEC with START",
            );
            this.checkHasMandatoryOptions(
              capinfosrceContext.EVENTBINDING(),
              capinfosrceContext,
              "EVENTBINDING with START",
            );
          } else {
            this.checkHasIllegalOptions(
              capinfosrceContext.CAPTURESPEC(),
              "CAPTURESPEC with END",
            );
            this.checkHasIllegalOptions(
              capinfosrceContext.EVENTBINDING(),
              "EVENTBINDING with END",
            );
          }
          this.checkBrowsingInvalidOptions(
            capinfosrceContext,
            CICSParser.CAPINFOSRCE,
            CICSParser.CAPTURESPEC,
            CICSParser.EVENTBINDING,
          );
        } else if (capinfosrceContext.NEXT().length !== 0) {
          this.checkHasIllegalOptions(
            capinfosrceContext.CAPTURESPEC(),
            "CAPTURESPEC with NEXT",
          );
          this.checkHasIllegalOptions(
            capinfosrceContext.EVENTBINDING(),
            "EVENTBINDING with NEXT",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_capoptpred: {
        const capoptpredContext = ctx as unknown as Cics_inquire_capoptpredContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          capoptpredContext,
          capoptpredContext.START(),
          capoptpredContext.END(),
          capoptpredContext.NEXT(),
        );
        if (
          capoptpredContext.START().length !== 0 ||
          capoptpredContext.END().length !== 0
        ) {
          if (capoptpredContext.START().length !== 0) {
            this.checkHasMandatoryOptions(
              capoptpredContext.CAPTURESPEC(),
              capoptpredContext,
              "CAPTURESPEC with START",
            );
            this.checkHasMandatoryOptions(
              capoptpredContext.EVENTBINDING(),
              capoptpredContext,
              "EVENTBINDING with START",
            );
          } else {
            this.checkHasIllegalOptions(
              capoptpredContext.CAPTURESPEC(),
              "CAPTURESPEC with END",
            );
            this.checkHasIllegalOptions(
              capoptpredContext.EVENTBINDING(),
              "EVENTBINDING with END",
            );
          }
          this.checkBrowsingInvalidOptions(
            capoptpredContext,
            CICSParser.CAPOPTPRED,
            CICSParser.CAPTURESPEC,
            CICSParser.EVENTBINDING,
          );
        } else if (capoptpredContext.NEXT().length !== 0) {
          this.checkHasIllegalOptions(
            capoptpredContext.CAPTURESPEC(),
            "CAPTURESPEC with NEXT",
          );
          this.checkHasIllegalOptions(
            capoptpredContext.EVENTBINDING(),
            "EVENTBINDING with NEXT",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_capturespec: {
        const capturespecContext = ctx as unknown as Cics_inquire_capturespecContext;
        this.checkBrowseMutuallyExclusive(capturespecContext);
        if (
          capturespecContext.START().length !== 0 ||
          capturespecContext.END().length !== 0
        ) {
          if (capturespecContext.END().length === 0)
            this.checkHasMandatoryOptions(
              capturespecContext.EVENTBINDING(),
              capturespecContext,
              "EVENTBINDING with START",
            );
          else
            this.checkHasIllegalOptions(
              capturespecContext.EVENTBINDING(),
              "EVENTBINDING with END",
            );
          this.checkBrowsingInvalidOptions(
            capturespecContext,
            CICSParser.CAPTURESPEC,
            CICSParser.EVENTBINDING,
          );
          this.checkBrowsingHasNotParameter(
            capturespecContext,
            CICSParser.CAPTURESPEC,
          );
        } else
          this.checkStatementHasParameter(
            capturespecContext,
            CICSParser.CAPTURESPEC,
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_deletshipped: {
        const deletshippedContext = ctx as unknown as Cics_inquire_deletshippedContext;
        this.checkHasMutuallyExclusiveOptions(
          "IDLEHRS with IDLE",
          deletshippedContext.IDLE(),
          deletshippedContext.IDLEHRS(),
        );
        this.checkHasMutuallyExclusiveOptions(
          "IDLEMINS with IDLE",
          deletshippedContext.IDLE(),
          deletshippedContext.IDLEMINS(),
        );
        this.checkHasMutuallyExclusiveOptions(
          "IDLESECS with IDLE",
          deletshippedContext.IDLE(),
          deletshippedContext.IDLESECS(),
        );
        if (deletshippedContext.IDLEHRS().length !== 0) {
          this.checkHasMandatoryOptions(
            deletshippedContext.IDLEMINS(),
            deletshippedContext,
            "IDLEMINS with IDLEHRS",
          );
          this.checkHasMandatoryOptions(
            deletshippedContext.IDLESECS(),
            deletshippedContext,
            "IDLESECS with IDLEHRS and IDLEMINS",
          );
        }
        this.checkHasMutuallyExclusiveOptions(
          "INTERVAL with INTERVALHRS",
          deletshippedContext.INTERVAL(),
          deletshippedContext.INTERVALHRS(),
        );
        this.checkHasMutuallyExclusiveOptions(
          "INTERVAL with INTERVALMINS",
          deletshippedContext.INTERVAL(),
          deletshippedContext.INTERVALMINS(),
        );
        this.checkHasMutuallyExclusiveOptions(
          "INTERVAL with INTERVALSECS",
          deletshippedContext.INTERVAL(),
          deletshippedContext.INTERVALSECS(),
        );
        if (deletshippedContext.INTERVALHRS().length !== 0) {
          this.checkHasMandatoryOptions(
            deletshippedContext.INTERVALMINS(),
            deletshippedContext,
            "INTERVALMINS with INTERVALHRS",
          );
          this.checkHasMandatoryOptions(
            deletshippedContext.INTERVALSECS(),
            deletshippedContext,
            "INTERVALSECS with INTERVALMINS and INTERVALHRS",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_enq: {
        const enqContext = ctx as unknown as Cics_inquire_enqContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          enqContext,
          enqContext.START(),
          enqContext.END(),
          enqContext.NEXT(),
        );
        if (enqContext.END().length !== 0) {
          this.checkHasMutuallyExclusiveOptions(
            "ENQSCOPE or RESOURCE or UOW with END",
            enqContext.ENQSCOPE(),
            enqContext.RESOURCE(),
            enqContext.UOW(),
            enqContext.END(),
          );
        }
        if (enqContext.START().length !== 0 || enqContext.END().length !== 0) {
          this.checkBrowsingInvalidOptions(
            enqContext,
            CICSParser.ENQ,
            CICSParser.ENQSCOPE,
            CICSParser.RESOURCE,
            CICSParser.RESLEN,
            CICSParser.UOW,
          );
        }
        if (enqContext.RESOURCE().length !== 0)
          this.checkHasMandatoryOptions(enqContext.RESLEN(), ctx, "RESLEN with RESOURCE");
        else
          this.checkHasIllegalOptions(
            enqContext.RESLEN(),
            "RESLEN without RESOURCE",
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_epadaptinset: {
        const epadaptinsetContext = ctx as unknown as Cics_inquire_epadaptinsetContext;
        this.checkBrowseMutuallyExclusive(epadaptinsetContext);
        if (
          epadaptinsetContext.START().length !== 0 ||
          epadaptinsetContext.END().length !== 0
        ) {
          this.checkHasIllegalOptions(
            epadaptinsetContext.EPADAPTER(),
            "EPADAPTER with START or END",
          );
          if (epadaptinsetContext.END().length !== 0)
            this.checkHasIllegalOptions(
              epadaptinsetContext.EPADAPTERSET(),
              "EPADAPTERSET with START or END",
            );
        } else if (epadaptinsetContext.NEXT().length !== 0)
          this.checkHasIllegalOptions(
            epadaptinsetContext.EPADAPTERSET(),
            "EPADAPTERSET with NEXT",
          );
        else {
          this.checkHasMandatoryOptions(
            epadaptinsetContext.EPADAPTERSET(),
            epadaptinsetContext,
            "EPADAPTERSET without Browsing",
          );
          this.checkHasMandatoryOptions(
            epadaptinsetContext.EPADAPTER(),
            epadaptinsetContext,
            "EPADAPTER without Browsing",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_exitprogram: {
        const exitprogramContext = ctx as unknown as Cics_inquire_exitprogramContext;
        this.checkBrowseMutuallyExclusive(exitprogramContext);
        if (
          exitprogramContext.START().length !== 0 ||
          exitprogramContext.END().length !== 0
        ) {
          if (exitprogramContext.END().length !== 0)
            this.checkHasIllegalOptions(exitprogramContext.EXIT(), "EXIT with END");
          this.checkBrowsingInvalidOptions(
            exitprogramContext,
            CICSParser.EXITPROGRAM,
            CICSParser.EXIT,
          );
          this.checkBrowsingHasNotParameter(
            exitprogramContext,
            CICSParser.EXITPROGRAM,
          );
        } else if (exitprogramContext.NEXT().length !== 0)
          this.checkBrowsingHasNotParameter(
            exitprogramContext,
            CICSParser.EXITPROGRAM,
          );
        else
          this.checkStatementHasParameter(
            exitprogramContext,
            CICSParser.EXITPROGRAM,
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_featurekey: {
        const featurekeyContext = ctx as unknown as Cics_inquire_featurekeyContext;
        this.checkBrowseMutuallyExclusive(featurekeyContext);
        if (
          featurekeyContext.START().length !== 0 ||
          featurekeyContext.END().length !== 0
        ) {
          this.checkBrowsingInvalidOptions(featurekeyContext, CICSParser.FEATUREKEY);
          this.checkBrowsingHasNotParameter(
            featurekeyContext,
            CICSParser.FEATUREKEY,
          );
        } else {
          this.checkStatementHasParameter(featurekeyContext, CICSParser.FEATUREKEY);
          this.checkHasMandatoryOptions(
            featurekeyContext.VALUE(),
            featurekeyContext,
            "VALUE without START or END",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_statistics: {
        const statsContext = ctx as unknown as Cics_inquire_statisticsContext;
        this.checkHasMutuallyExclusiveOptions(
          "ENDOFDAY or ENDOFDAYHRS",
          statsContext.ENDOFDAY(),
          statsContext.ENDOFDAYHRS(),
        );
        if (statsContext.ENDOFDAYHRS().length !== 0) {
          this.checkHasMandatoryOptions(
            statsContext.ENDOFDAYMINS(),
            statsContext,
            "ENDOFDAYMINS with ENDOFDAYHRS",
          );
          this.checkHasMandatoryOptions(
            statsContext.ENDOFDAYSECS(),
            statsContext,
            "ENDOFDAYSECS with ENDOFDAYHRS",
          );
        } else {
          this.checkHasIllegalOptions(
            statsContext.ENDOFDAYMINS(),
            "ENDOFDAYMINS without ENDOFDAYHRS",
          );
          this.checkHasIllegalOptions(
            statsContext.ENDOFDAYSECS(),
            "ENDOFDAYSECS without ENDOFDAYHRS",
          );
        }
        this.checkHasMutuallyExclusiveOptions(
          "INTERVAL or INTERVALHRS",
          statsContext.INTERVAL(),
          statsContext.INTERVALHRS(),
        );
        if (statsContext.INTERVALHRS().length !== 0) {
          this.checkHasMandatoryOptions(
            statsContext.INTERVALMINS(),
            statsContext,
            "INTERVALMINS with INTERVALHRS",
          );
          this.checkHasMandatoryOptions(
            statsContext.INTERVALSECS(),
            statsContext,
            "INTERVALSECS with INTERVALHRS",
          );
        } else {
          this.checkHasIllegalOptions(
            statsContext.INTERVALMINS(),
            "INTERVALMINS without INTERVALHRS",
          );
          this.checkHasIllegalOptions(
            statsContext.INTERVALSECS(),
            "INTERVALSECS without INTERVALHRS",
          );
        }
        this.checkHasMutuallyExclusiveOptions(
          "NEXTTIME or NEXTTIMEHRS",
          statsContext.NEXTTIME(),
          statsContext.NEXTTIMEHRS(),
        );
        if (statsContext.NEXTTIMEHRS().length !== 0) {
          this.checkHasMandatoryOptions(
            statsContext.NEXTTIMEMINS(),
            statsContext,
            "NEXTTIMEMINS with NEXTTIMEHRS",
          );
          this.checkHasMandatoryOptions(
            statsContext.NEXTTIMESECS(),
            statsContext,
            "NEXTTIMESECS with NEXTTIMEHRS",
          );
        } else {
          this.checkHasIllegalOptions(
            statsContext.NEXTTIMEMINS(),
            "NEXTTIMEMINS without NEXTTIMEHRS",
          );
          this.checkHasIllegalOptions(
            statsContext.NEXTTIMESECS(),
            "NEXTTIMESECS without NEXTTIMEHRS",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_jvmendpoint: {
        const jvmendpointContext = ctx as unknown as Cics_inquire_jvmendpointContext;
        this.checkBrowseMutuallyExclusive(jvmendpointContext);
        if (
          jvmendpointContext.START().length !== 0 ||
          jvmendpointContext.END().length !== 0
        ) {
          if (jvmendpointContext.END().length === 0)
            this.checkHasMandatoryOptions(
              jvmendpointContext.JVMSERVER(),
              jvmendpointContext,
              "JVMSERVER with START",
            );
          else
            this.checkHasIllegalOptions(
              jvmendpointContext.JVMSERVER(),
              "JVMSERVER with END",
            );
          this.checkBrowsingInvalidOptions(
            jvmendpointContext,
            CICSParser.JVMENDPOINT,
            CICSParser.JVMSERVER,
          );
          this.checkBrowsingHasNotParameter(
            jvmendpointContext,
            CICSParser.JVMENDPOINT,
          );
        } else
          this.checkStatementHasParameter(
            jvmendpointContext,
            CICSParser.JVMENDPOINT,
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_modename: {
        const modenameContext = ctx as unknown as Cics_inquire_modenameContext;
        this.checkBrowseMutuallyExclusive(modenameContext);
        if (
          modenameContext.START().length !== 0 ||
          modenameContext.END().length !== 0
        ) {
          this.checkHasIllegalOptions(
            modenameContext.CONNECTION(),
            "CONNECTION with START or END",
          );
          this.checkBrowsingInvalidOptions(
            modenameContext,
            CICSParser.MODENAME,
            CICSParser.CONNECTION,
          );
          this.checkBrowsingHasNotParameter(modenameContext, CICSParser.MODENAME);
        } else this.checkStatementHasParameter(modenameContext, CICSParser.MODENAME);
        break;
      }
      case CICSParser.RULE_cics_inquire_mvstcb: {
        const mvstcbContext = ctx as unknown as Cics_inquire_mvstcbContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          mvstcbContext,
          mvstcbContext.START(),
          mvstcbContext.END(),
          mvstcbContext.NEXT(),
        );
        if (mvstcbContext.START().length !== 0 || mvstcbContext.END().length !== 0) {
          this.checkBrowsingInvalidOptions(mvstcbContext, CICSParser.MVSTCB);
          this.checkBrowsingHasNotParameter(mvstcbContext, CICSParser.MVSTCB);
        } else if (mvstcbContext.NEXT().length !== 0) {
          this.checkStatementHasParameter(mvstcbContext, CICSParser.MVSTCB);
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_netname: {
        const netnameContext = ctx as unknown as Cics_inquire_netnameContext;
        this.checkBrowseMutuallyExclusive(netnameContext);
        if (
          netnameContext.START().length !== 0 ||
          netnameContext.END().length !== 0
        ) {
          this.checkBrowsingInvalidOptions(
            netnameContext,
            CICSParser.NETNAME,
            CICSParser.TERMINAL,
          );
          this.checkBrowsingHasNotParameter(netnameContext, CICSParser.NETNAME);
          this.checkStatementHasParameter(netnameContext, CICSParser.TERMINAL);
        } else this.checkStatementHasParameter(netnameContext, CICSParser.NETNAME);
        break;
      }
      case CICSParser.RULE_cics_inquire_osgibundle: {
        const osgibundleContext = ctx as unknown as Cics_inquire_osgibundleContext;
        this.checkBrowseMutuallyExclusive(osgibundleContext);
        if (
          osgibundleContext.START().length !== 0 ||
          osgibundleContext.END().length !== 0
        ) {
          if (osgibundleContext.END().length === 0)
            this.checkHasMandatoryOptions(
              osgibundleContext.JVMSERVER(),
              osgibundleContext,
              "JVMSERVER with START",
            );
          else {
            this.checkHasIllegalOptions(
              osgibundleContext.JVMSERVER(),
              "JVMSERVER with END",
            );
          }
          this.checkHasIllegalOptions(
            osgibundleContext.OSGIVERSION(),
            "OSGIVERSION with START or END",
          );
          this.checkBrowsingInvalidOptions(
            osgibundleContext,
            CICSParser.OSGIBUNDLE,
            CICSParser.OSGIVERSION,
            CICSParser.JVMSERVER,
          );
          this.checkBrowsingHasNotParameter(
            osgibundleContext,
            CICSParser.OSGIBUNDLE,
          );
        } else
          this.checkStatementHasParameter(osgibundleContext, CICSParser.OSGIBUNDLE);
        break;
      }
      case CICSParser.RULE_cics_inquire_osgiservice: {
        const osgiserviceContext = ctx as unknown as Cics_inquire_osgiserviceContext;
        this.checkBrowseMutuallyExclusive(osgiserviceContext);
        if (
          osgiserviceContext.START().length !== 0 ||
          osgiserviceContext.END().length !== 0
        ) {
          if (osgiserviceContext.END().length === 0)
            this.checkHasMandatoryOptions(
              osgiserviceContext.JVMSERVER(),
              osgiserviceContext,
              "JVMSERVER with START",
            );
          else {
            this.checkHasIllegalOptions(
              osgiserviceContext.JVMSERVER(),
              "JVMSERVER with END",
            );
          }
          this.checkBrowsingInvalidOptions(
            osgiserviceContext,
            CICSParser.OSGISERVICE,
            CICSParser.JVMSERVER,
          );
          this.checkBrowsingHasNotParameter(
            osgiserviceContext,
            CICSParser.OSGISERVICE,
          );
        } else
          this.checkStatementHasParameter(
            osgiserviceContext,
            CICSParser.OSGISERVICE,
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_policyrule: {
        const policyruleContext = ctx as unknown as Cics_inquire_policyruleContext;
        this.checkBrowseMutuallyExclusive(policyruleContext);
        if (
          policyruleContext.START().length !== 0 ||
          policyruleContext.END().length !== 0
        ) {
          if (policyruleContext.END().length === 0)
            this.checkHasMandatoryOptions(
              policyruleContext.POLICY(),
              policyruleContext,
              "POLICY with START",
            );
          else {
            this.checkHasIllegalOptions(
              policyruleContext.POLICY(),
              "POLICY with END",
            );
          }
          this.checkBrowsingInvalidOptions(
            policyruleContext,
            CICSParser.POLICYRULE,
            CICSParser.POLICY,
          );
          this.checkBrowsingHasNotParameter(
            policyruleContext,
            CICSParser.POLICYRULE,
          );
        } else
          this.checkStatementHasParameter(policyruleContext, CICSParser.POLICYRULE);
        break;
      }
      case CICSParser.RULE_cics_inquire_program: {
        const programContext = ctx as unknown as Cics_inquire_programContext;
        this.checkBrowseMutuallyExclusive(programContext);
        if (programContext.START().length === 0)
          this.checkHasIllegalOptions(programContext.AT(), "AT without START");
        if (
          programContext.START().length !== 0 ||
          programContext.END().length !== 0
        ) {
          if (programContext.END().length === 0)
            this.checkBrowsingInvalidOptions(
              programContext,
              CICSParser.PROGRAM,
              CICSParser.APPLICATION,
              CICSParser.APPLMAJORVER,
              CICSParser.APPLMINORVER,
              CICSParser.APPLMICROVER,
              CICSParser.PLATFORM,
            );
          else this.checkBrowsingInvalidOptions(programContext, CICSParser.PROGRAM);
          this.checkBrowsingHasNotParameter(programContext, CICSParser.PROGRAM);
        } else
          this.checkStatementHasParameter(
            programContext,
            CICSParser.PROGRAM,
            CICSParser.AT,
          );
        if (programContext.NEXT().length !== 0)
          this.checkHasIllegalOptions(programContext.AT(), "AT with NEXT");
        if (programContext.APPLICATION().length === 0) {
          this.checkHasIllegalOptions(
            programContext.APPLMAJORVER(),
            "APPLMAJORVER without APPLICATION",
          );
          this.checkHasIllegalOptions(
            programContext.APPLMINORVER(),
            "APPLMINORVER without APPLICATION",
          );
          this.checkHasIllegalOptions(
            programContext.APPLMICROVER(),
            "APPLMICROVER without APPLICATION",
          );
          this.checkHasIllegalOptions(
            programContext.PLATFORM(),
            "PLATFORM without APPLICATION",
          );
        } else {
          this.checkHasMandatoryOptions(
            programContext.APPLMAJORVER(),
            programContext,
            "APPLMAJORVER with APPLICATION",
          );
          this.checkHasMandatoryOptions(
            programContext.APPLMINORVER(),
            programContext,
            "APPLMINORVER with APPLICATION",
          );
          this.checkHasMandatoryOptions(
            programContext.APPLMICROVER(),
            programContext,
            "APPLMICROVER with APPLICATION",
          );
          this.checkHasMandatoryOptions(
            programContext.PLATFORM(),
            programContext,
            "PLATFORM with APPLICATION",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_reqid: {
        const reqidContext = ctx as unknown as Cics_inquire_reqidContext;
        this.checkBrowseMutuallyExclusive(reqidContext);
        if (reqidContext.START().length !== 0 || reqidContext.END().length !== 0) {
          this.checkBrowsingInvalidOptions(reqidContext, CICSParser.REQID);
          this.checkBrowsingHasNotParameter(reqidContext, CICSParser.REQID);
        } else {
          this.checkStatementHasParameter(reqidContext, CICSParser.REQID);
          if (reqidContext.SET().length === 0) {
            this.checkHasIllegalOptions(reqidContext.LENGTH(), "LENGTH without SET");
            this.checkHasIllegalOptions(
              reqidContext.FMHSTATUS(),
              "FMHSTATUS without SET",
            );
          } else if (reqidContext.LENGTH().length === 0) {
            this.checkHasIllegalOptions(
              reqidContext.FMHSTATUS(),
              "FMHSTATUS without LENGTH",
            );
          }
          this.checkHasMutuallyExclusiveOptions(
            "INTERVAL or AT or AFTER",
            reqidContext.INTERVAL(),
            reqidContext.AT(),
            reqidContext.AFTER(),
          );
          if (reqidContext.INTERVAL().length !== 0) {
            this.checkHasIllegalOptions(reqidContext.HOURS(), "HOURS with INTERVAL");
            this.checkHasIllegalOptions(
              reqidContext.MINUTES(),
              "MINUTES with INTERVAL",
            );
            this.checkHasIllegalOptions(
              reqidContext.SECONDS(),
              "SECONDS with INTERVAL",
            );
          } else if (
            reqidContext.AT().length !== 0 ||
            reqidContext.AFTER().length !== 0
          ) {
            this.checkHasMandatoryOptions(
              reqidContext.HOURS(),
              reqidContext,
              "HOURS with AT or AFTER",
            );
            this.checkHasMandatoryOptions(
              reqidContext.MINUTES(),
              reqidContext,
              "MINUTES with AT or AFTER",
            );
            this.checkHasMandatoryOptions(
              reqidContext.SECONDS(),
              reqidContext,
              "SECONDS with AT or AFTER",
            );
          }
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_storage: {
        const storageContext = ctx as unknown as Cics_inquire_storageContext;
        this.checkHasExactlyOneOption(
          "ADDRESS or NUMELEMENTS",
          storageContext,
          storageContext.ADDRESS(),
          storageContext.NUMELEMENTS(),
        );
        if (storageContext.ADDRESS().length !== 0) {
          this.checkHasIllegalOptions(
            storageContext.ELEMENTLIST(),
            "ELEMENTLIST with ADDRESS",
          );
          this.checkHasIllegalOptions(
            storageContext.LENGTHLIST(),
            "LENGTHLIST with ADDRESS",
          );
          this.checkHasIllegalOptions(storageContext.TASK(), "TASK with ADDRESS");
        } else if (storageContext.NUMELEMENTS().length !== 0) {
          this.checkHasIllegalOptions(
            storageContext.ELEMENT(),
            "ELEMENT with NUMELEMENTS",
          );
          this.checkHasIllegalOptions(
            storageContext.FLENGTH(),
            "FLENGTH with NUMELEMENTS",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_storage64: {
        const s64Context = ctx as unknown as Cics_inquire_storage64Context;
        this.checkHasExactlyOneOption(
          "ADDRESS64 or NUMELEMENTS",
          s64Context,
          s64Context.ADDRESS64(),
          s64Context.NUMELEMENTS(),
        );
        if (s64Context.ADDRESS64().length !== 0) {
          this.checkHasIllegalOptions(
            s64Context.ELEMENTLIST(),
            "ELEMENTLIST with ADDRESS64",
          );
          this.checkHasIllegalOptions(
            s64Context.LENGTHLIST(),
            "LENGTHLIST with ADDRESS64",
          );
          this.checkHasIllegalOptions(s64Context.TASK(), "TASK with ADDRESS64");
        } else if (s64Context.NUMELEMENTS().length !== 0) {
          this.checkHasIllegalOptions(
            s64Context.DSANAME(),
            "DSANAME with NUMELEMENTS",
          );
          this.checkHasIllegalOptions(
            s64Context.ELEMENT64(),
            "ELEMENT64 with NUMELEMENTS",
          );
          this.checkHasIllegalOptions(
            s64Context.FLENGTH(),
            "FLENGTH with NUMELEMENTS",
          );
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_subpool: {
        const subpoolContext = ctx as unknown as Cics_inquire_subpoolContext;
        this.checkBrowseMutuallyExclusive(subpoolContext);
        if (
          subpoolContext.START().length !== 0 ||
          subpoolContext.END().length !== 0
        ) {
          if (subpoolContext.END().length !== 0)
            this.checkHasIllegalOptions(subpoolContext.AT(), "AT with END");
          this.checkBrowsingInvalidOptions(subpoolContext, CICSParser.SUBPOOL);
          this.checkBrowsingHasNotParameter(subpoolContext, CICSParser.SUBPOOL);
        } else this.checkStatementHasParameter(subpoolContext, CICSParser.SUBPOOL);
        if (subpoolContext.NEXT().length !== 0)
          this.checkHasIllegalOptions(subpoolContext.AT(), "AT with NEXT");
        break;
      }
      case CICSParser.RULE_cics_inquire_tag: {
        const tagContext = ctx as unknown as Cics_inquire_tagContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          tagContext,
          tagContext.START(),
          tagContext.END(),
          tagContext.NEXT(),
        );
        if (tagContext.START().length !== 0 || tagContext.END().length !== 0) {
          this.checkBrowsingHasNotParameter(tagContext, CICSParser.TAG);
        } else this.checkStatementHasParameter(tagContext, CICSParser.TAG);
        break;
      }
      case CICSParser.RULE_cics_inquire_task_list: {
        const taskListContext = ctx as unknown as Cics_inquire_task_listContext;
        this.checkHasMandatoryOptions(taskListContext.LIST(), taskListContext, "LIST");
        this.checkHasMandatoryOptions(
          taskListContext.LISTSIZE(),
          taskListContext,
          "LISTSIZE",
        );
        this.checkPrerequisiteIsMet(
          taskListContext.SET(),
          taskListContext.SETTRANSID(),
          taskListContext,
          "SETTRANSID without SET",
        );
        break;
      }
      case CICSParser.RULE_cics_inquire_terminal: {
        const terminalContext = ctx as unknown as Cics_inquire_terminalContext;
        this.checkBrowseMutuallyExclusive(terminalContext);
        if (
          terminalContext.START().length !== 0 ||
          terminalContext.END().length !== 0
        ) {
          this.checkBrowsingInvalidOptions(
            terminalContext,
            CICSParser.TERMINAL,
            CICSParser.NETNAME,
          );
          this.checkBrowsingHasNotParameter(terminalContext, CICSParser.TERMINAL);
          this.checkStatementHasParameter(terminalContext, CICSParser.NETNAME);
        } else this.checkStatementHasParameter(terminalContext, CICSParser.TERMINAL);
        break;
      }
      case CICSParser.RULE_cics_inquire_tracetype: {
        const tracetypeContext = ctx as unknown as Cics_inquire_tracetypeContext;
        this.checkCompIDMutuallyExclusive(tracetypeContext);
        this.checkHasExactlyOneOption(
          "FLAGSET or SPECIAL or STANDARD",
          tracetypeContext,
          tracetypeContext.FLAGSET(),
          tracetypeContext.SPECIAL(),
          tracetypeContext.STANDARD(),
        );
        break;
      }
      case CICSParser.RULE_cics_inquire_tranclass: {
        const tranclassContext = ctx as unknown as Cics_inquire_tranclassContext;
        this.checkBrowseMutuallyExclusive(tranclassContext);
        if (
          tranclassContext.START().length !== 0 ||
          tranclassContext.END().length !== 0
        ) {
          if (tranclassContext.END().length !== 0)
            this.checkHasIllegalOptions(tranclassContext.AT(), "AT with END");
          this.checkBrowsingInvalidOptions(tranclassContext, CICSParser.TRANCLASS);
          this.checkBrowsingHasNotParameter(tranclassContext, CICSParser.TRANCLASS);
        } else
          this.checkStatementHasParameter(tranclassContext, CICSParser.TRANCLASS);
        if (tranclassContext.NEXT().length !== 0)
          this.checkHasIllegalOptions(tranclassContext.AT(), "AT with NEXT");
        break;
      }
      case CICSParser.RULE_cics_inquire_transaction: {
        const transactionContext = ctx as unknown as Cics_inquire_transactionContext;
        this.checkBrowsingCommon(transactionContext, CICSParser.TRANSACTION);
        if (transactionContext.NEXT().length !== 0)
          this.checkHasIllegalOptions(transactionContext.AT(), "AT with NEXT");
        this.checkHasMutuallyExclusiveOptions(
          "TCLASS and TRANCLASS",
          transactionContext.TCLASS(),
          transactionContext.TRANCLASS(),
        );
        break;
      }
      case CICSParser.RULE_cics_inquire_tsqueue: {
        const tsqueueContext = ctx as unknown as Cics_inquire_tsqueueContext;
        this.checkBrowseMutuallyExclusive(tsqueueContext);
        this.checkHasMutuallyExclusiveOptions(
          "POOLNAME or SYSID",
          tsqueueContext.POOLNAME(),
          tsqueueContext.SYSID(),
        );
        if (
          tsqueueContext.START().length !== 0 ||
          tsqueueContext.END().length !== 0
        ) {
          if (tsqueueContext.END().length !== 0)
            this.checkHasIllegalOptions(tsqueueContext.AT(), "AT with END");
          this.checkBrowsingInvalidOptions(
            tsqueueContext,
            CICSParser.TSQUEUE,
            CICSParser.TSQNAME,
            CICSParser.POOLNAME,
            CICSParser.SYSID,
          );
          this.checkBrowsingHasNotParameter(
            tsqueueContext,
            CICSParser.TSQUEUE,
            CICSParser.TSQNAME,
          );
        } else
          this.checkStatementHasParameter(
            tsqueueContext,
            CICSParser.TSQUEUE,
            CICSParser.TSQNAME,
          );
        if (tsqueueContext.NEXT().length !== 0)
          this.checkHasIllegalOptions(tsqueueContext.AT(), "AT with NEXT");
        break;
      }
      case CICSParser.RULE_cics_inquire_uowdsnfail: {
        const uowdsnfailContext = ctx as unknown as Cics_inquire_uowdsnfailContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          uowdsnfailContext,
          uowdsnfailContext.START(),
          uowdsnfailContext.END(),
          uowdsnfailContext.NEXT(),
        );
        if (
          uowdsnfailContext.START().length !== 0 ||
          uowdsnfailContext.END().length !== 0
        ) {
          this.checkBrowsingInvalidOptions(uowdsnfailContext, CICSParser.UOWDSNFAIL);
        }
        break;
      }
      case CICSParser.RULE_cics_inquire_uowenq: {
        const uowenqContext = ctx as unknown as Cics_inquire_uowenqContext;
        this.checkHasExactlyOneOption(
          "START or END or NEXT",
          uowenqContext,
          uowenqContext.START(),
          uowenqContext.END(),
          uowenqContext.NEXT(),
        );
        if (uowenqContext.END().length !== 0) {
          this.checkHasMutuallyExclusiveOptions(
            "ENQSCOPE or RESOURCE or UOW or END",
            uowenqContext.ENQSCOPE(),
            uowenqContext.RESOURCE(),
            uowenqContext.UOW(),
            uowenqContext.END(),
          );
        }
        if (
          uowenqContext.START().length !== 0 ||
          uowenqContext.END().length !== 0
        ) {
          this.checkBrowsingInvalidOptions(
            uowenqContext,
            CICSParser.UOWENQ,
            CICSParser.ENQSCOPE,
            CICSParser.RESOURCE,
            CICSParser.RESLEN,
            CICSParser.UOW,
          );
        }
        if (uowenqContext.RESOURCE().length !== 0)
          this.checkHasMandatoryOptions(uowenqContext.RESLEN(), ctx, "RESLEN with RESOURCE");
        else
          this.checkHasIllegalOptions(
            uowenqContext.RESLEN(),
            "RESLEN without RESOURCE",
          );
        break;
      }
      case CICSParser.RULE_cics_inquire_vtam: {
        const vtamContext = ctx as unknown as Cics_inquire_vtamContext;
        this.checkHasMutuallyExclusiveOptions(
          "PSDINTHRS with PSDINTERVAL",
          vtamContext.PSDINTERVAL(),
          vtamContext.PSDINTHRS(),
        );
        this.checkPrerequisiteIsMet(
          vtamContext.PSDINTHRS(),
          vtamContext.PSDINTMINS(),
          vtamContext,
          "PSDINTMINS without PSDINTMINS",
        );
        this.checkPrerequisiteIsMet(
          vtamContext.PSDINTMINS(),
          vtamContext.PSDINTSECS(),
          vtamContext,
          "PSDINTMINS without PSDINTMINS",
        );
        break;
      }
      default: {
        const ruleToken = InquireSpOptionsChecker.COMMON_INQUIRE_BROWSE_RULES.get(
          ctx.ruleIndex,
        );
        if (ruleToken != null) this.checkBrowsingCommon(ctx, ruleToken);
        break;
      }
    }
    this.checkDuplicates(ctx);
  }

  /**
   * Check mutually exclusive COMPID identifiers
   *
   * @param ctx Context Including COMPID identifiers
   */
  public checkCompIDMutuallyExclusive(ctx: Cics_inquire_tracetypeContext) {
    this.checkHasMutuallyExclusiveOptions("AP and APPLICATION", ctx.AP(), ctx.APPLICATION());
    this.checkHasMutuallyExclusiveOptions("AS and ASYNCSERVICE", ctx.AS(), ctx.ASYNCSERVICE());
    this.checkHasMutuallyExclusiveOptions("BA and BUSAPPMGR", ctx.BA(), ctx.BUSAPPMGR());
    this.checkHasMutuallyExclusiveOptions("BR and BRIDGE", ctx.BR(), ctx.BRIDGE());
    this.checkHasMutuallyExclusiveOptions("CP and CPI", ctx.CP(), ctx.CPI());
    this.checkHasMutuallyExclusiveOptions("DD and DIRMGR", ctx.DD(), ctx.DIRMGR());
    this.checkHasMutuallyExclusiveOptions("DH and DOCUMENT", ctx.DH(), ctx.DOCUMENT());
    this.checkHasMutuallyExclusiveOptions("DM and DOMAINMGR", ctx.DM(), ctx.DOMAINMGR());
    this.checkHasMutuallyExclusiveOptions("DP and DEBUGTOOL", ctx.DP(), ctx.DEBUGTOOL());
    this.checkHasMutuallyExclusiveOptions("DS and DISPATCHER", ctx.DS(), ctx.DISPATCHER());
    this.checkHasMutuallyExclusiveOptions("DU and DUMP", ctx.DU(), ctx.DUMP());
    this.checkHasMutuallyExclusiveOptions("EC and EVENTCAPTURE", ctx.EC(), ctx.EVENTCAPTURE());
    this.checkHasMutuallyExclusiveOptions("EJ and ENTJAVA", ctx.EJ(), ctx.ENTJAVA());
    this.checkHasMutuallyExclusiveOptions("EM and EVENTMGR", ctx.EM(), ctx.EVENTMGR());
    this.checkHasMutuallyExclusiveOptions("EP and EVENTPROC", ctx.EP(), ctx.EVENTPROC());
    this.checkHasMutuallyExclusiveOptions("GC and GLOBALCATLG", ctx.GC(), ctx.GLOBALCATLG());
    this.checkHasMutuallyExclusiveOptions("IE and IPECI", ctx.IE(), ctx.IPECI());
    this.checkHasMutuallyExclusiveOptions("KE and KERNEL", ctx.KE(), ctx.KERNEL());
    this.checkHasMutuallyExclusiveOptions("LC and LOCALCATLG", ctx.LC(), ctx.LOCALCATLG());
    this.checkHasMutuallyExclusiveOptions("LD and LOADER", ctx.LD(), ctx.LOADER());
    this.checkHasMutuallyExclusiveOptions("LG and LOGGER", ctx.LG(), ctx.LOGGER());
    this.checkHasMutuallyExclusiveOptions("LM and LOCKMGR", ctx.LM(), ctx.LOCKMGR());
    this.checkHasMutuallyExclusiveOptions("ME and MESSAGE", ctx.ME(), ctx.MESSAGE());
    this.checkHasMutuallyExclusiveOptions("MN and MONITOR", ctx.MN(), ctx.MONITOR());
    this.checkHasMutuallyExclusiveOptions("MP and MANAGEDPLAT", ctx.MP(), ctx.MANAGEDPLAT());
    this.checkHasMutuallyExclusiveOptions("NQ and ENQUEUE", ctx.NQ(), ctx.ENQUEUE());
    this.checkHasMutuallyExclusiveOptions("OT and OBJECTTRAN", ctx.OT(), ctx.OBJECTTRAN());
    this.checkHasMutuallyExclusiveOptions("PA and PARAMGR", ctx.PA(), ctx.PARAMGR());
    this.checkHasMutuallyExclusiveOptions("PG and PROGMGR", ctx.PG(), ctx.PROGMGR());
    this.checkHasMutuallyExclusiveOptions("PI and PIPEMGR", ctx.PI(), ctx.PIPEMGR());
    this.checkHasMutuallyExclusiveOptions("PT and PARTNER", ctx.PT(), ctx.PARTNER());
    this.checkHasMutuallyExclusiveOptions("RA and RMIADAPTERS", ctx.RA(), ctx.RMIADAPTERS());
    this.checkHasMutuallyExclusiveOptions("RI and RMI", ctx.RI(), ctx.RMI());
    this.checkHasMutuallyExclusiveOptions("RL and RESLIFEMGR", ctx.RL(), ctx.RESLIFEMGR());
    this.checkHasMutuallyExclusiveOptions("RM and RECOVERY", ctx.RM(), ctx.RECOVERY());
    this.checkHasMutuallyExclusiveOptions("RS and REGIONSTAT", ctx.RS(), ctx.REGIONSTAT());
    this.checkHasMutuallyExclusiveOptions("RX and RRS", ctx.RX(), ctx.RRS());
    this.checkHasMutuallyExclusiveOptions("RZ and REQUESTSTRM", ctx.RZ(), ctx.REQUESTSTRM());
    this.checkHasMutuallyExclusiveOptions("SH and SCHEDULER", ctx.SH(), ctx.SCHEDULER());
    this.checkHasMutuallyExclusiveOptions("SJ and SJVM", ctx.SJ(), ctx.SJVM());
    this.checkHasMutuallyExclusiveOptions("SM and STORAGE", ctx.SM(), ctx.STORAGE());
    this.checkHasMutuallyExclusiveOptions("SO and SOCKETS", ctx.SO(), ctx.SOCKETS());
    this.checkHasMutuallyExclusiveOptions("ST and STATISTICS", ctx.ST(), ctx.STATISTICS());
    this.checkHasMutuallyExclusiveOptions("TI and TIMER", ctx.TI(), ctx.TIMER());
    this.checkHasMutuallyExclusiveOptions("TR and TRACE", ctx.TR(), ctx.TRACE());
    this.checkHasMutuallyExclusiveOptions("TS and TEMPSTORAGE", ctx.TS(), ctx.TEMPSTORAGE());
    this.checkHasMutuallyExclusiveOptions("US and USER", ctx.US(), ctx.USER());
    this.checkHasMutuallyExclusiveOptions("WB and WEB", ctx.WB(), ctx.WEB());
    this.checkHasMutuallyExclusiveOptions("WU and WEBRESTMGR", ctx.WU(), ctx.WEBRESTMGR());
    this.checkHasMutuallyExclusiveOptions("W2 and WEB2", ctx.W2(), ctx.WEB2());
    this.checkHasMutuallyExclusiveOptions("XM and TRANMGR", ctx.XM(), ctx.TRANMGR());
    this.checkHasMutuallyExclusiveOptions("XS and SECURITY", ctx.XS(), ctx.SECURITY());
  }
}
