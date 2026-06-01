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
  Cics_set_association_usercorrdataContext,
  Cics_set_atomserviceContext,
  Cics_set_autoinstallContext,
  Cics_set_brfacilityContext,
  Cics_set_bundleContext,
  Cics_set_connectionContext,
  Cics_set_db2connContext,
  Cics_set_db2entryContext,
  Cics_set_db2tranContext,
  Cics_set_deletshippedContext,
  Cics_set_dispatcherContext,
  Cics_set_doctemplateContext,
  Cics_set_dsnameContext,
  Cics_set_dumpdsContext,
  Cics_set_enqmodelContext,
  Cics_set_epadapterContext,
  Cics_set_epadaptersetContext,
  Cics_set_eventbindingContext,
  Cics_set_eventprocessContext,
  Cics_set_fileContext,
  Cics_set_hostContext,
  Cics_set_ipconnContext,
  Cics_set_ircContext,
  Cics_set_journalnameContext,
  Cics_set_journalnumContext,
  Cics_set_jvmendpointContext,
  Cics_set_jvmserverContext,
  Cics_set_libraryContext,
  Cics_set_modenameContext,
  Cics_set_monitorContext,
  Cics_set_mqconnContext,
  Cics_set_mqmonitorContext,
  Cics_set_netnameContext,
  Cics_set_otelContext,
  Cics_set_pipelineContext,
  Cics_set_processtypeContext,
  Cics_set_programContext,
  Cics_set_secdiscoveryContext,
  Cics_set_secrecordingContext,
  Cics_set_statisticsContext,
  Cics_set_sysdumpcodeContext,
  Cics_set_systemContext,
  Cics_set_tags_refreshContext,
  Cics_set_taskContext,
  Cics_set_tclassContext,
  Cics_set_tcpipContext,
  Cics_set_tcpipserviceContext,
  Cics_set_tdqueueContext,
  Cics_set_tempstorageContext,
  Cics_set_terminalContext,
  Cics_set_tracedestContext,
  Cics_set_traceflagContext,
  Cics_set_tracetypeContext,
  Cics_set_tranclassContext,
  Cics_set_trandumpcodeContext,
  Cics_set_transactionContext,
  Cics_set_tsqueueContext,
  Cics_set_uowContext,
  Cics_set_uowlinkContext,
  Cics_set_urimapContext,
  Cics_set_volumeContext,
  Cics_set_vtamContext,
  Cics_set_webContext,
  Cics_set_webserviceContext,
  Cics_set_wlmhealthContext,
  Cics_set_xmltransformContext,
  CICSParser,
} from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

/** Checks CICS SET system programming rules for required and invalid options */
export class SysSetOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_set;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ABEND, Severity.Error],
    [CICSLexer.ACCOUNTREC, Severity.Error],
    [CICSLexer.ACQSTATUS, Severity.Error],
    [CICSLexer.ACQUIRED, Severity.Error],
    [CICSLexer.ACTION, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ADD, Severity.Error],
    [CICSLexer.ADDABLE, Severity.Error],
    [CICSLexer.ADJUSTMENT, Severity.Error],
    [CICSLexer.ADVANCE, Severity.Error],
    [CICSLexer.AFFINITY, Severity.Error],
    [CICSLexer.AIBRIDGE, Severity.Error],
    [CICSLexer.AKP, Severity.Error],
    [CICSLexer.ALTPRINTER, Severity.Error],
    [CICSLexer.ALTPRTCOPY, Severity.Error],
    [CICSLexer.ALTPRTCOPYST, Severity.Error],
    [CICSLexer.AP, Severity.Error],
    [CICSLexer.ASSOCIATION, Severity.Error],
    [CICSLexer.ASYNCSERVICE, Severity.Error],
    [CICSLexer.ATI, Severity.Error],
    [CICSLexer.ATIFACILITY, Severity.Error],
    [CICSLexer.ATISTATUS, Severity.Error],
    [CICSLexer.ATITERMID, Severity.Error],
    [CICSLexer.ATITRANID, Severity.Error],
    [CICSLexer.ATIUSERID, Severity.Error],
    [CICSLexer.ATOMSERVICE, Severity.Error],
    [CICSLexer.AUDITLEVEL, Severity.Error],
    [CICSLexer.AUTHID, Severity.Error],
    [CICSLexer.AUTHTYPE, Severity.Error],
    [CICSLexer.AUTOACTIVE, Severity.Error],
    [CICSLexer.AUTOINACTIVE, Severity.Error],
    [CICSLexer.AUTOINSTALL, Severity.Error],
    [CICSLexer.AUTOPAGEABLE, Severity.Error],
    [CICSLexer.AUTOSTART, Severity.Error],
    [CICSLexer.AUTOSTATUS, Severity.Error],
    [CICSLexer.AUXPAUSE, Severity.Error],
    [CICSLexer.AUXSTART, Severity.Error],
    [CICSLexer.AUXSTATUS, Severity.Error],
    [CICSLexer.AUXSTOP, Severity.Error],
    [CICSLexer.AVAILABILITY, Severity.Error],
    [CICSLexer.AVAILABLE, Severity.Error],
    [CICSLexer.AVAILSTATUS, Severity.Error],
    [CICSLexer.BA, Severity.Error],
    [CICSLexer.BACKLOG, Severity.Error],
    [CICSLexer.BACKOUT, Severity.Error],
    [CICSLexer.BM, Severity.Error],
    [CICSLexer.BR, Severity.Error],
    [CICSLexer.BRFACILITY, Severity.Error],
    [CICSLexer.BROWSABLE, Severity.Error],
    [CICSLexer.BROWSE, Severity.Error],
    [CICSLexer.BUNDLE, Severity.Error],
    [CICSLexer.BUSAPPMGR, Severity.Error],
    [CICSLexer.BUSY, Severity.Error],
    [CICSLexer.CANCEL, Severity.Error],
    [CICSLexer.CEDF, Severity.Error],
    [CICSLexer.CEDFSTATUS, Severity.Error],
    [CICSLexer.CFDTPOOL, Severity.Error],
    [CICSLexer.CFTABLE, Severity.Error],
    [CICSLexer.CGROUP, Severity.Error],
    [CICSLexer.CICSTABLE, Severity.Error],
    [CICSLexer.CLOSED, Severity.Error],
    [CICSLexer.CLOSELEAVE, Severity.Error],
    [CICSLexer.CMD, Severity.Error],
    [CICSLexer.COLDACQ, Severity.Error],
    [CICSLexer.COMAUTHID, Severity.Error],
    [CICSLexer.COMAUTHTYPE, Severity.Error],
    [CICSLexer.COMMIT, Severity.Error],
    [CICSLexer.COMPID, Severity.Error],
    [CICSLexer.COMPRESS, Severity.Error],
    [CICSLexer.COMPRESSST, Severity.Error],
    [CICSLexer.COMTHREADLIM, Severity.Error],
    [CICSLexer.CONNECT, Severity.Error],
    [CICSLexer.CONNECTED, Severity.Error],
    [CICSLexer.CONNECTERROR, Severity.Error],
    [CICSLexer.CONNECTION, Severity.Error],
    [CICSLexer.CONNECTST, Severity.Error],
    [CICSLexer.CONNSTATUS, Severity.Error],
    [CICSLexer.CONSISTENT, Severity.Error],
    [CICSLexer.CONSOLES, Severity.Error],
    [CICSLexer.CONTENTION, Severity.Error],
    [CICSLexer.CONVERSE, Severity.Error],
    [CICSLexer.CONVERSEST, Severity.Error],
    [CICSLexer.COPID, Severity.Error],
    [CICSLexer.COPY, Severity.Error],
    [CICSLexer.CP, Severity.Error],
    [CICSLexer.CPI, Severity.Error],
    [CICSLexer.CREATE, Severity.Error],
    [CICSLexer.CREATESESS, Severity.Error],
    [CICSLexer.CRITICAL, Severity.Error],
    [CICSLexer.CRITICALST, Severity.Error],
    [CICSLexer.CSIGN, Severity.Error],
    [CICSLexer.CTERM, Severity.Error],
    [CICSLexer.CTLGALL, Severity.Error],
    [CICSLexer.CTLGMODIFY, Severity.Error],
    [CICSLexer.CTLGNONE, Severity.Error],
    [CICSLexer.CTX, Severity.Error],
    [CICSLexer.CUSERID, Severity.Error],
    [CICSLexer.DAE, Severity.Error],
    [CICSLexer.DAEOPTION, Severity.Error],
    [CICSLexer.DATASET, Severity.Error],
    [CICSLexer.DB2, Severity.Error],
    [CICSLexer.DB2CONN, Severity.Error],
    [CICSLexer.DB2ENTRY, Severity.Error],
    [CICSLexer.DB2GROUPID, Severity.Error],
    [CICSLexer.DB2ID, Severity.Error],
    [CICSLexer.DB2TRAN, Severity.Error],
    [CICSLexer.DC, Severity.Error],
    [CICSLexer.DCT, Severity.Error],
    [CICSLexer.DD, Severity.Error],
    [CICSLexer.DEBUG, Severity.Error],
    [CICSLexer.DEBUGTOOL, Severity.Error],
    [CICSLexer.DELETABLE, Severity.Error],
    [CICSLexer.DELETE, Severity.Error],
    [CICSLexer.DELETSHIPPED, Severity.Error],
    [CICSLexer.DH, Severity.Error],
    [CICSLexer.DIRMGR, Severity.Error],
    [CICSLexer.DISABLED, Severity.Error],
    [CICSLexer.DISABLEDACT, Severity.Error],
    [CICSLexer.DISCARD, Severity.Error],
    [CICSLexer.DISCOVERALL, Severity.Error],
    [CICSLexer.DISCREQ, Severity.Error],
    [CICSLexer.DISCREQST, Severity.Error],
    [CICSLexer.DISPATCHER, Severity.Error],
    [CICSLexer.DISPOSITION, Severity.Error],
    [CICSLexer.DM, Severity.Error],
    [CICSLexer.DOCTEMPLATE, Severity.Error],
    [CICSLexer.DOMAINMGR, Severity.Error],
    [CICSLexer.DP, Severity.Error],
    [CICSLexer.DPLLIMIT, Severity.Error],
    [CICSLexer.DPLSUBSET, Severity.Error],
    [CICSLexer.DRAIN, Severity.Error],
    [CICSLexer.DS, Severity.Error],
    [CICSLexer.DSALIMIT, Severity.Error],
    [CICSLexer.DSNAME, Severity.Error],
    [CICSLexer.DSPLIST, Severity.Error],
    [CICSLexer.DSRTPROGRAM, Severity.Error],
    [CICSLexer.DTRPROGRAM, Severity.Error],
    [CICSLexer.DU, Severity.Error],
    [CICSLexer.DUMPDS, Severity.Error],
    [CICSLexer.DUMPING, Severity.Error],
    [CICSLexer.DUMPSCOPE, Severity.Error],
    [CICSLexer.EC, Severity.Error],
    [CICSLexer.EDSALIMIT, Severity.Error],
    [CICSLexer.EI, Severity.Error],
    [CICSLexer.EJ, Severity.Error],
    [CICSLexer.EM, Severity.Error],
    [CICSLexer.EMPTY, Severity.Error],
    [CICSLexer.EMPTYREQ, Severity.Error],
    [CICSLexer.EMPTYSTATUS, Severity.Error],
    [CICSLexer.ENABLED, Severity.Error],
    [CICSLexer.ENABLESTATUS, Severity.Error],
    [CICSLexer.ENDAFFINITY, Severity.Error],
    [CICSLexer.ENDOFDAY, Severity.Error],
    [CICSLexer.ENDOFDAYHRS, Severity.Error],
    [CICSLexer.ENDOFDAYMINS, Severity.Error],
    [CICSLexer.ENDOFDAYSECS, Severity.Error],
    [CICSLexer.ENQMODEL, Severity.Error],
    [CICSLexer.ENQUEUE, Severity.Error],
    [CICSLexer.ENTJAVA, Severity.Error],
    [CICSLexer.EP, Severity.Error],
    [CICSLexer.EPADAPTER, Severity.Error],
    [CICSLexer.EPADAPTERSET, Severity.Error],
    [CICSLexer.EPSTATUS, Severity.Error],
    [CICSLexer.EQUAL, Severity.Error],
    [CICSLexer.EVENTBINDING, Severity.Error],
    [CICSLexer.EVENTCAPTURE, Severity.Error],
    [CICSLexer.EVENTMGR, Severity.Error],
    [CICSLexer.EVENTPROC, Severity.Error],
    [CICSLexer.EVENTPROCESS, Severity.Error],
    [CICSLexer.EXCEPT, Severity.Error],
    [CICSLexer.EXCEPTCLASS, Severity.Error],
    [CICSLexer.EXCLUSIVE, Severity.Error],
    [CICSLexer.EXCTL, Severity.Error],
    [CICSLexer.EXECUTIONSET, Severity.Error],
    [CICSLexer.EXITTRACE, Severity.Error],
    [CICSLexer.EXITTRACING, Severity.Error],
    [CICSLexer.FC, Severity.Error],
    [CICSLexer.FCT, Severity.Error],
    [CICSLexer.FILE, Severity.Error],
    [CICSLexer.FILELIMIT, Severity.Error],
    [CICSLexer.FLAGSET, Severity.Error],
    [CICSLexer.FLUSH, Severity.Error],
    [CICSLexer.FORCE, Severity.Error],
    [CICSLexer.FORCECANCEL, Severity.Error],
    [CICSLexer.FORCECLOSE, Severity.Error],
    [CICSLexer.FORCEPURGE, Severity.Error],
    [CICSLexer.FORCEQR, Severity.Error],
    [CICSLexer.FORCEUOW, Severity.Error],
    [CICSLexer.FREQUENCY, Severity.Error],
    [CICSLexer.FREQUENCYHRS, Severity.Error],
    [CICSLexer.FREQUENCYMIN, Severity.Error],
    [CICSLexer.FREQUENCYSEC, Severity.Error],
    [CICSLexer.FULL, Severity.Error],
    [CICSLexer.FULLAPI, Severity.Error],
    [CICSLexer.GARBAGEINT, Severity.Error],
    [CICSLexer.GC, Severity.Error],
    [CICSLexer.GLOBALCATLG, Severity.Error],
    [CICSLexer.GMMLENGTH, Severity.Error],
    [CICSLexer.GMMTEXT, Severity.Error],
    [CICSLexer.GROUP, Severity.Error],
    [CICSLexer.GROUPRESYNC, Severity.Error],
    [CICSLexer.GTFSTART, Severity.Error],
    [CICSLexer.GTFSTATUS, Severity.Error],
    [CICSLexer.GTFSTOP, Severity.Error],
    [CICSLexer.HFS, Severity.Error],
    [CICSLexer.HIGH, Severity.Error],
    [CICSLexer.HOST, Severity.Error],
    [CICSLexer.IC, Severity.Error],
    [CICSLexer.IDLE, Severity.Error],
    [CICSLexer.IDLEHRS, Severity.Error],
    [CICSLexer.IDLEMINS, Severity.Error],
    [CICSLexer.IDLESECS, Severity.Error],
    [CICSLexer.IDNTY, Severity.Error],
    [CICSLexer.IDNTYCLASS, Severity.Error],
    [CICSLexer.IE, Severity.Error],
    [CICSLexer.IMMCLOSE, Severity.Error],
    [CICSLexer.IMMQUIESCED, Severity.Error],
    [CICSLexer.INITIALDDS, Severity.Error],
    [CICSLexer.INSERVICE, Severity.Error],
    [CICSLexer.INTERVAL, Severity.Error],
    [CICSLexer.INTERVALHRS, Severity.Error],
    [CICSLexer.INTERVALMINS, Severity.Error],
    [CICSLexer.INTERVALSECS, Severity.Error],
    [CICSLexer.INTSTART, Severity.Error],
    [CICSLexer.INTSTATUS, Severity.Error],
    [CICSLexer.INTSTOP, Severity.Error],
    [CICSLexer.IPCONN, Severity.Error],
    [CICSLexer.IPECI, Severity.Error],
    [CICSLexer.IRC, Severity.Error],
    [CICSLexer.IS, Severity.Error],
    [CICSLexer.JCT, Severity.Error],
    [CICSLexer.JOBLIST, Severity.Error],
    [CICSLexer.JOURNALNAME, Severity.Error],
    [CICSLexer.JOURNALNUM, Severity.Error],
    [CICSLexer.JVM, Severity.Error],
    [CICSLexer.JVMCLASS, Severity.Error],
    [CICSLexer.JVMENDPOINT, Severity.Error],
    [CICSLexer.JVMPROFILE, Severity.Error],
    [CICSLexer.JVMSERVER, Severity.Error],
    [CICSLexer.KC, Severity.Error],
    [CICSLexer.KE, Severity.Error],
    [CICSLexer.KERNEL, Severity.Error],
    [CICSLexer.KEYLENGTH, Severity.Error],
    [CICSLexer.KILL, Severity.Error],
    [CICSLexer.LASTUSEDINT, Severity.Error],
    [CICSLexer.LD, Severity.Error],
    [CICSLexer.LG, Severity.Error],
    [CICSLexer.LIBRARY, Severity.Error],
    [CICSLexer.LM, Severity.Error],
    [CICSLexer.LOAD, Severity.Error],
    [CICSLexer.LOADER, Severity.Error],
    [CICSLexer.LOADTYPE, Severity.Error],
    [CICSLexer.LOCAL, Severity.Error],
    [CICSLexer.LOCALCATLG, Severity.Error],
    [CICSLexer.LOCATION, Severity.Error],
    [CICSLexer.LOCKING, Severity.Error],
    [CICSLexer.LOCKMGR, Severity.Error],
    [CICSLexer.LOGDEFER, Severity.Error],
    [CICSLexer.LOGGER, Severity.Error],
    [CICSLexer.LOW, Severity.Error],
    [CICSLexer.LSRPOOLNUM, Severity.Error],
    [CICSLexer.MANAGEDPLAT, Severity.Error],
    [CICSLexer.MAPNAME, Severity.Error],
    [CICSLexer.MAPSETNAME, Severity.Error],
    [CICSLexer.MAXACTIVE, Severity.Error],
    [CICSLexer.MAXDATALEN, Severity.Error],
    [CICSLexer.MAXIMUM, Severity.Error],
    [CICSLexer.MAXNUMRECS, Severity.Error],
    [CICSLexer.MAXOPENTCBS, Severity.Error],
    [CICSLexer.MAXREQS, Severity.Error],
    [CICSLexer.MAXSOCKETS, Severity.Error],
    [CICSLexer.MAXSSLTCBS, Severity.Error],
    [CICSLexer.MAXTASKS, Severity.Error],
    [CICSLexer.MAXXPTCBS, Severity.Error],
    [CICSLexer.ME, Severity.Error],
    [CICSLexer.ML, Severity.Error],
    [CICSLexer.MN, Severity.Error],
    [CICSLexer.MODENAME, Severity.Error],
    [CICSLexer.MODIFY, Severity.Error],
    [CICSLexer.MONITOR, Severity.Error],
    [CICSLexer.MONSTATUS, Severity.Error],
    [CICSLexer.MP, Severity.Error],
    [CICSLexer.MQCONN, Severity.Error],
    [CICSLexer.MQMONITOR, Severity.Error],
    [CICSLexer.MQNAME, Severity.Error],
    [CICSLexer.MROBATCH, Severity.Error],
    [CICSLexer.MSGQUEUE1, Severity.Error],
    [CICSLexer.MSGQUEUE2, Severity.Error],
    [CICSLexer.MSGQUEUE3, Severity.Error],
    [CICSLexer.NETNAME, Severity.Error],
    [CICSLexer.NEWCOPY, Severity.Error],
    [CICSLexer.NEWMAXSOCKET, Severity.Error],
    [CICSLexer.NEWMAXTASKS, Severity.Error],
    [CICSLexer.NEXTTRANSID, Severity.Error],
    [CICSLexer.NO, Severity.Error],
    [CICSLexer.NOALTPRTCOPY, Severity.Error],
    [CICSLexer.NOATI, Severity.Error],
    [CICSLexer.NOAUTOSTART, Severity.Error],
    [CICSLexer.NOCEDF, Severity.Error],
    [CICSLexer.NOCOMPRESS, Severity.Error],
    [CICSLexer.NOCONNECT, Severity.Error],
    [CICSLexer.NOCONVERSE, Severity.Error],
    [CICSLexer.NOCREATE, Severity.Error],
    [CICSLexer.NODAE, Severity.Error],
    [CICSLexer.NODEBUG, Severity.Error],
    [CICSLexer.NODISCREQ, Severity.Error],
    [CICSLexer.NOEMPTYREQ, Severity.Error],
    [CICSLexer.NOEXCEPT, Severity.Error],
    [CICSLexer.NOEXCTL, Severity.Error],
    [CICSLexer.NOEXITTRACE, Severity.Error],
    [CICSLexer.NOFORCE, Severity.Error],
    [CICSLexer.NOIDNTY, Severity.Error],
    [CICSLexer.NOJVM, Severity.Error],
    [CICSLexer.NOLOAD, Severity.Error],
    [CICSLexer.NONCRITICAL, Severity.Error],
    [CICSLexer.NONE, Severity.Error],
    [CICSLexer.NONTERMREL, Severity.Error],
    [CICSLexer.NOOBFORMAT, Severity.Error],
    [CICSLexer.NOPERF, Severity.Error],
    [CICSLexer.NOPRTCOPY, Severity.Error],
    [CICSLexer.NORECOVDATA, Severity.Error],
    [CICSLexer.NORELEASE, Severity.Error],
    [CICSLexer.NORELREQ, Severity.Error],
    [CICSLexer.NOREPLICATOR, Severity.Error],
    [CICSLexer.NORESRCE, Severity.Error],
    [CICSLexer.NORESYNC, Severity.Error],
    [CICSLexer.NOSHUTDOWN, Severity.Error],
    [CICSLexer.NOSWITCH, Severity.Error],
    [CICSLexer.NOSYNCPOINT, Severity.Error],
    [CICSLexer.NOSYSDUMP, Severity.Error],
    [CICSLexer.NOTADDBALE, Severity.Error],
    [CICSLexer.NOTBROWSABLE, Severity.Error],
    [CICSLexer.NOTCONNECTED, Severity.Error],
    [CICSLexer.NOTDELETABLE, Severity.Error],
    [CICSLexer.NOTERMINAL, Severity.Error],
    [CICSLexer.NOTPENDING, Severity.Error],
    [CICSLexer.NOTPURGEABLE, Severity.Error],
    [CICSLexer.NOTRANDUMP, Severity.Error],
    [CICSLexer.NOTREADABLE, Severity.Error],
    [CICSLexer.NOTRLS, Severity.Error],
    [CICSLexer.NOTTABLE, Severity.Error],
    [CICSLexer.NOTTI, Severity.Error],
    [CICSLexer.NOTUPDATABLE, Severity.Error],
    [CICSLexer.NOTWAIT, Severity.Error],
    [CICSLexer.NOUCTRAN, Severity.Error],
    [CICSLexer.NOVALIDATION, Severity.Error],
    [CICSLexer.NOWAIT, Severity.Error],
    [CICSLexer.NOZCPTRACE, Severity.Error],
    [CICSLexer.NQ, Severity.Error],
    [CICSLexer.OBFORMAT, Severity.Error],
    [CICSLexer.OBFORMATST, Severity.Error],
    [CICSLexer.OBJECTNAME, Severity.Error],
    [CICSLexer.OBJECTTRAN, Severity.Error],
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
    [CICSLexer.OFF, Severity.Error],
    [CICSLexer.OLD, Severity.Error],
    [CICSLexer.ON, Severity.Error],
    [CICSLexer.OPEN, Severity.Error],
    [CICSLexer.OPENOUTPUT, Severity.Error],
    [CICSLexer.OPENSTATUS, Severity.Error],
    [CICSLexer.OPERATION, Severity.Error],
    [CICSLexer.OPERID, Severity.Error],
    [CICSLexer.OPID, Severity.Error],
    [CICSLexer.OT, Severity.Error],
    [CICSLexer.OTEL, Severity.Error],
    [CICSLexer.OUTSERVICE, Severity.Error],
    [CICSLexer.PA, Severity.Error],
    [CICSLexer.PAGEABLE, Severity.Error],
    [CICSLexer.PAGESTATUS, Severity.Error],
    [CICSLexer.PARAMGR, Severity.Error],
    [CICSLexer.PC, Severity.Error],
    [CICSLexer.PCT, Severity.Error],
    [CICSLexer.PENDSTATUS, Severity.Error],
    [CICSLexer.PERF, Severity.Error],
    [CICSLexer.PERFCLASS, Severity.Error],
    [CICSLexer.PERMANENT, Severity.Error],
    [CICSLexer.PG, Severity.Error],
    [CICSLexer.PHASEIN, Severity.Error],
    [CICSLexer.PHASEOUT, Severity.Error],
    [CICSLexer.PI, Severity.Error],
    [CICSLexer.PIPELINE, Severity.Error],
    [CICSLexer.PIPEMGR, Severity.Error],
    [CICSLexer.PLAN, Severity.Error],
    [CICSLexer.PLANEXITNAME, Severity.Error],
    [CICSLexer.POOL, Severity.Error],
    [CICSLexer.POOLNAME, Severity.Error],
    [CICSLexer.PPT, Severity.Error],
    [CICSLexer.PRINTER, Severity.Error],
    [CICSLexer.PRIORITY, Severity.Error],
    [CICSLexer.PRIVATE, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROGAUTOCTLG, Severity.Error],
    [CICSLexer.PROGAUTOEXIT, Severity.Error],
    [CICSLexer.PROGAUTOINST, Severity.Error],
    [CICSLexer.PROGMGR, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.PROTECTNUM, Severity.Error],
    [CICSLexer.PRTCOPY, Severity.Error],
    [CICSLexer.PRTCOPYST, Severity.Error],
    [CICSLexer.PRTYAGING, Severity.Error],
    [CICSLexer.PSB, Severity.Error],
    [CICSLexer.PSDINTERVAL, Severity.Error],
    [CICSLexer.PSDINTHRS, Severity.Error],
    [CICSLexer.PSDINTMINS, Severity.Error],
    [CICSLexer.PSDINTSECS, Severity.Error],
    [CICSLexer.PT, Severity.Error],
    [CICSLexer.PURGE, Severity.Error],
    [CICSLexer.PURGEABILITY, Severity.Error],
    [CICSLexer.PURGEABLE, Severity.Error],
    [CICSLexer.PURGEACTION, Severity.Error],
    [CICSLexer.PURGECYCLEM, Severity.Error],
    [CICSLexer.PURGECYCLES, Severity.Error],
    [CICSLexer.PURGETHRESH, Severity.Error],
    [CICSLexer.PURGETYPE, Severity.Error],
    [CICSLexer.QUESCESTATE, Severity.Error],
    [CICSLexer.QUIESCED, Severity.Error],
    [CICSLexer.RA, Severity.Error],
    [CICSLexer.RANKING, Severity.Error],
    [CICSLexer.READ, Severity.Error],
    [CICSLexer.READABLE, Severity.Error],
    [CICSLexer.READINTEG, Severity.Error],
    [CICSLexer.RECONNECT, Severity.Error],
    [CICSLexer.RECORDING, Severity.Error],
    [CICSLexer.RECORDSIZE, Severity.Error],
    [CICSLexer.RECOVERED, Severity.Error],
    [CICSLexer.RECOVERY, Severity.Error],
    [CICSLexer.RECOVSTATUS, Severity.Error],
    [CICSLexer.REDIRECTTYPE, Severity.Error],
    [CICSLexer.REGIONSTAT, Severity.Error],
    [CICSLexer.RELATED, Severity.Error],
    [CICSLexer.RELEASE, Severity.Error],
    [CICSLexer.RELEASED, Severity.Error],
    [CICSLexer.RELREQ, Severity.Error],
    [CICSLexer.RELREQST, Severity.Error],
    [CICSLexer.REMOVE, Severity.Error],
    [CICSLexer.REPEATABLE, Severity.Error],
    [CICSLexer.REPLICATION, Severity.Error],
    [CICSLexer.REPLICATOR, Severity.Error],
    [CICSLexer.REQUESTSTRM, Severity.Error],
    [CICSLexer.RES, Severity.Error],
    [CICSLexer.RESET, Severity.Error],
    [CICSLexer.RESETLOCKS, Severity.Error],
    [CICSLexer.RESLIFEMGR, Severity.Error],
    [CICSLexer.RESPWAIT, Severity.Error],
    [CICSLexer.RESRCE, Severity.Error],
    [CICSLexer.RESRCECLASS, Severity.Error],
    [CICSLexer.RESYNC, Severity.Error],
    [CICSLexer.RESYNCMEMBER, Severity.Error],
    [CICSLexer.RETRY, Severity.Error],
    [CICSLexer.REUSELIMIT, Severity.Error],
    [CICSLexer.RI, Severity.Error],
    [CICSLexer.RL, Severity.Error],
    [CICSLexer.RLS, Severity.Error],
    [CICSLexer.RLSACCESS, Severity.Error],
    [CICSLexer.RM, Severity.Error],
    [CICSLexer.RMI, Severity.Error],
    [CICSLexer.RMIADAPTERS, Severity.Error],
    [CICSLexer.RREPL, Severity.Error],
    [CICSLexer.RRS, Severity.Error],
    [CICSLexer.RS, Severity.Error],
    [CICSLexer.RUNAWAY, Severity.Error],
    [CICSLexer.RUNAWAYTYPE, Severity.Error],
    [CICSLexer.RUNTIME, Severity.Error],
    [CICSLexer.RX, Severity.Error],
    [CICSLexer.RZ, Severity.Error],
    [CICSLexer.SC, Severity.Error],
    [CICSLexer.SCANDELAY, Severity.Error],
    [CICSLexer.SCHEDULER, Severity.Error],
    [CICSLexer.SDTMEMLIMIT, Severity.Error],
    [CICSLexer.SECDISCOVERY, Severity.Error],
    [CICSLexer.SECRECORDING, Severity.Error],
    [CICSLexer.SECURITY, Severity.Error],
    [CICSLexer.SERVSTATUS, Severity.Error],
    [CICSLexer.SET, Severity.Error],
    [CICSLexer.SH, Severity.Error],
    [CICSLexer.SHARE, Severity.Error],
    [CICSLexer.SHARED, Severity.Error],
    [CICSLexer.SHARELOCKS, Severity.Error],
    [CICSLexer.SHARESTATUS, Severity.Error],
    [CICSLexer.SHUTDISABLED, Severity.Error],
    [CICSLexer.SHUTDOWN, Severity.Error],
    [CICSLexer.SHUTENABLED, Severity.Error],
    [CICSLexer.SHUTOPTION, Severity.Error],
    [CICSLexer.SIGN, Severity.Error],
    [CICSLexer.SIGNID, Severity.Error],
    [CICSLexer.SINGLEOFF, Severity.Error],
    [CICSLexer.SINGLEON, Severity.Error],
    [CICSLexer.SINGLESTATUS, Severity.Error],
    [CICSLexer.SJ, Severity.Error],
    [CICSLexer.SJVM, Severity.Error],
    [CICSLexer.SM, Severity.Error],
    [CICSLexer.SO, Severity.Error],
    [CICSLexer.SPECIAL, Severity.Error],
    [CICSLexer.SPECTRACE, Severity.Error],
    [CICSLexer.SPRSTRACE, Severity.Error],
    [CICSLexer.SQLCODE, Severity.Error],
    [CICSLexer.SRRACTIVE, Severity.Error],
    [CICSLexer.SRRINACTIVE, Severity.Error],
    [CICSLexer.SRRSTATUS, Severity.Error],
    [CICSLexer.ST, Severity.Error],
    [CICSLexer.STANDARD, Severity.Error],
    [CICSLexer.STANDBYMODE, Severity.Error],
    [CICSLexer.STANTRACE, Severity.Error],
    [CICSLexer.STARTED, Severity.Error],
    [CICSLexer.STATISTICS, Severity.Error],
    [CICSLexer.STATSQUEUE, Severity.Error],
    [CICSLexer.STATUS, Severity.Error],
    [CICSLexer.STOPPED, Severity.Error],
    [CICSLexer.STRINGS, Severity.Error],
    [CICSLexer.SWITCH, Severity.Error],
    [CICSLexer.SWITCHACTION, Severity.Error],
    [CICSLexer.SWITCHALL, Severity.Error],
    [CICSLexer.SWITCHNEXT, Severity.Error],
    [CICSLexer.SWITCHSTATUS, Severity.Error],
    [CICSLexer.SYNCPOINT, Severity.Error],
    [CICSLexer.SYNCPOINTST, Severity.Error],
    [CICSLexer.SYSDUMP, Severity.Error],
    [CICSLexer.SYSDUMPCODE, Severity.Error],
    [CICSLexer.SYSDUMPING, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.SYSTEM, Severity.Error],
    [CICSLexer.SYSTEMOFF, Severity.Error],
    [CICSLexer.SYSTEMON, Severity.Error],
    [CICSLexer.SYSTEMSTATUS, Severity.Error],
    [CICSLexer.SZ, Severity.Error],
    [CICSLexer.TABLE, Severity.Error],
    [CICSLexer.TABLENAME, Severity.Error],
    [CICSLexer.TABLEONLY, Severity.Error],
    [CICSLexer.TABLESIZE, Severity.Error],
    [CICSLexer.TAGS, Severity.Error],
    [CICSLexer.TASK, Severity.Error],
    [CICSLexer.TC, Severity.Error],
    [CICSLexer.TCAMCONTROL, Severity.Error],
    [CICSLexer.TCBLIMIT, Severity.Error],
    [CICSLexer.TCEXITALL, Severity.Error],
    [CICSLexer.TCEXITALLOFF, Severity.Error],
    [CICSLexer.TCEXITNONE, Severity.Error],
    [CICSLexer.TCEXITSTATUS, Severity.Error],
    [CICSLexer.TCEXITSYSTEM, Severity.Error],
    [CICSLexer.TCLASS, Severity.Error],
    [CICSLexer.TCPIP, Severity.Error],
    [CICSLexer.TCPIPSERVICE, Severity.Error],
    [CICSLexer.TD, Severity.Error],
    [CICSLexer.TDQUEUE, Severity.Error],
    [CICSLexer.TEMPORARY, Severity.Error],
    [CICSLexer.TEMPSTORAGE, Severity.Error],
    [CICSLexer.TERM, Severity.Error],
    [CICSLexer.TERMINAL, Severity.Error],
    [CICSLexer.TERMPRIORITY, Severity.Error],
    [CICSLexer.TERMSTATUS, Severity.Error],
    [CICSLexer.THREADLIMIT, Severity.Error],
    [CICSLexer.THREADWAIT, Severity.Error],
    [CICSLexer.TI, Severity.Error],
    [CICSLexer.TIME, Severity.Error],
    [CICSLexer.TIMEOUTINT, Severity.Error],
    [CICSLexer.TPOOL, Severity.Error],
    [CICSLexer.TR, Severity.Error],
    [CICSLexer.TRACEDEST, Severity.Error],
    [CICSLexer.TRACEFLAG, Severity.Error],
    [CICSLexer.TRACETYPE, Severity.Error],
    [CICSLexer.TRACING, Severity.Error],
    [CICSLexer.TRANCLASS, Severity.Error],
    [CICSLexer.TRANDUMP, Severity.Error],
    [CICSLexer.TRANDUMPCODE, Severity.Error],
    [CICSLexer.TRANDUMPING, Severity.Error],
    [CICSLexer.TRANIDONLY, Severity.Error],
    [CICSLexer.TRANMGR, Severity.Error],
    [CICSLexer.TRANSACTION, Severity.Error],
    [CICSLexer.TRANSID, Severity.Error],
    [CICSLexer.TRIGGERLEVEL, Severity.Error],
    [CICSLexer.TSMAINLIMIT, Severity.Error],
    [CICSLexer.TSQNAME, Severity.Error],
    [CICSLexer.TSQUEUE, Severity.Error],
    [CICSLexer.TSQUEUELIMIT, Severity.Error],
    [CICSLexer.TST, Severity.Error],
    [CICSLexer.TTI, Severity.Error],
    [CICSLexer.TTISTATUS, Severity.Error],
    [CICSLexer.TWAIT, Severity.Error],
    [CICSLexer.TX, Severity.Error],
    [CICSLexer.TXID, Severity.Error],
    [CICSLexer.UCTRAN, Severity.Error],
    [CICSLexer.UCTRANST, Severity.Error],
    [CICSLexer.UE, Severity.Error],
    [CICSLexer.UNAVAILABLE, Severity.Error],
    [CICSLexer.UNCOMMITTED, Severity.Error],
    [CICSLexer.UNQUIESCED, Severity.Error],
    [CICSLexer.UOW, Severity.Error],
    [CICSLexer.UOWACTION, Severity.Error],
    [CICSLexer.UOWLINK, Severity.Error],
    [CICSLexer.UOWSTATE, Severity.Error],
    [CICSLexer.UPDATABLE, Severity.Error],
    [CICSLexer.UPDATE, Severity.Error],
    [CICSLexer.UPDATEMODEL, Severity.Error],
    [CICSLexer.URIMAP, Severity.Error],
    [CICSLexer.URIMAPLIMIT, Severity.Error],
    [CICSLexer.URM, Severity.Error],
    [CICSLexer.US, Severity.Error],
    [CICSLexer.USER, Severity.Error],
    [CICSLexer.USERCORRDATA, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.USEROFF, Severity.Error],
    [CICSLexer.USERON, Severity.Error],
    [CICSLexer.USERSTATUS, Severity.Error],
    [CICSLexer.USERTABLE, Severity.Error],
    [CICSLexer.VALIDATION, Severity.Error],
    [CICSLexer.VALIDATIONST, Severity.Error],
    [CICSLexer.VERSION, Severity.Error],
    [CICSLexer.VOLUME, Severity.Error],
    [CICSLexer.VTAM, Severity.Error],
    [CICSLexer.W2, Severity.Error],
    [CICSLexer.WAIT, Severity.Error],
    [CICSLexer.WB, Severity.Error],
    [CICSLexer.WEB, Severity.Error],
    [CICSLexer.WEB2, Severity.Error],
    [CICSLexer.WEBRESTMGR, Severity.Error],
    [CICSLexer.WEBSERVICE, Severity.Error],
    [CICSLexer.WEBSERVLIMIT, Severity.Error],
    [CICSLexer.WLMHEALTH, Severity.Error],
    [CICSLexer.WU, Severity.Error],
    [CICSLexer.XM, Severity.Error],
    [CICSLexer.XMLTRANSFORM, Severity.Error],
    [CICSLexer.XS, Severity.Error],
    [CICSLexer.YES, Severity.Error],
    [CICSLexer.ZCPTRACE, Severity.Error],
    [CICSLexer.ZCPTRACING, Severity.Error],
    [CICSLexer.DEREGISTERED, Severity.Warning],
    [CICSLexer.RECORDNOW, Severity.Warning],
    [CICSLexer.REFRESH, Severity.Warning],
    [CICSLexer.RESETNOW, Severity.Warning],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, SysSetOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS SET system programming rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    switch (ctx.ruleIndex) {
      case CICSParser.RULE_cics_set_association_usercorrdata:
        this.checkAssociationUsercorrdata(
          ctx as unknown as Cics_set_association_usercorrdataContext,
        );
        break;
      case CICSParser.RULE_cics_set_atomservice:
        this.checkAtomservice(ctx as unknown as Cics_set_atomserviceContext);
        break;
      case CICSParser.RULE_cics_set_autoinstall:
        this.checkAutoinstall(ctx as unknown as Cics_set_autoinstallContext);
        break;
      case CICSParser.RULE_cics_set_brfacility:
        this.checkBrfacility(ctx as unknown as Cics_set_brfacilityContext);
        break;
      case CICSParser.RULE_cics_set_bundle:
        this.checkBundle(ctx as unknown as Cics_set_bundleContext);
        break;
      case CICSParser.RULE_cics_set_connection:
        this.checkConnection(ctx as unknown as Cics_set_connectionContext);
        break;
      case CICSParser.RULE_cics_set_db2conn:
        this.checkDb2conn(ctx as unknown as Cics_set_db2connContext);
        break;
      case CICSParser.RULE_cics_set_db2entry:
        this.checkDb2entry(ctx as unknown as Cics_set_db2entryContext);
        break;
      case CICSParser.RULE_cics_set_db2tran:
        this.checkDb2tran(ctx as unknown as Cics_set_db2tranContext);
        break;
      case CICSParser.RULE_cics_set_deletshipped:
        this.checkDeletshipped(ctx as unknown as Cics_set_deletshippedContext);
        break;
      case CICSParser.RULE_cics_set_dispatcher:
        this.checkDispatcher(ctx as unknown as Cics_set_dispatcherContext);
        break;
      case CICSParser.RULE_cics_set_doctemplate:
        this.checkDoctemplate(ctx as unknown as Cics_set_doctemplateContext);
        break;
      case CICSParser.RULE_cics_set_dsname:
        this.checkDsname(ctx as unknown as Cics_set_dsnameContext);
        break;
      case CICSParser.RULE_cics_set_dumpds:
        this.checkDumpds(ctx as unknown as Cics_set_dumpdsContext);
        break;
      case CICSParser.RULE_cics_set_enqmodel:
        this.checkEnqmodel(ctx as unknown as Cics_set_enqmodelContext);
        break;
      case CICSParser.RULE_cics_set_epadapter:
        this.checkEpadapter(ctx as unknown as Cics_set_epadapterContext);
        break;
      case CICSParser.RULE_cics_set_epadapterset:
        this.checkEpadapterset(ctx as unknown as Cics_set_epadaptersetContext);
        break;
      case CICSParser.RULE_cics_set_eventbinding:
        this.checkEventbinding(ctx as unknown as Cics_set_eventbindingContext);
        break;
      case CICSParser.RULE_cics_set_eventprocess:
        this.checkEventprocess(ctx as unknown as Cics_set_eventprocessContext);
        break;
      case CICSParser.RULE_cics_set_file:
        this.checkFile(ctx as unknown as Cics_set_fileContext);
        break;
      case CICSParser.RULE_cics_set_host:
        this.checkHost(ctx as unknown as Cics_set_hostContext);
        break;
      case CICSParser.RULE_cics_set_ipconn:
        this.checkIpconn(ctx as unknown as Cics_set_ipconnContext);
        break;
      case CICSParser.RULE_cics_set_irc:
        this.checkIrc(ctx as unknown as Cics_set_ircContext);
        break;
      case CICSParser.RULE_cics_set_journalname:
        this.checkJournalname(ctx as unknown as Cics_set_journalnameContext);
        break;
      case CICSParser.RULE_cics_set_journalnum:
        this.checkJournalnum(ctx as unknown as Cics_set_journalnumContext);
        break;
      case CICSParser.RULE_cics_set_jvmendpoint:
        this.checkJvmendpoint(ctx as unknown as Cics_set_jvmendpointContext);
        break;
      case CICSParser.RULE_cics_set_jvmserver:
        this.checkJvmserver(ctx as unknown as Cics_set_jvmserverContext);
        break;
      case CICSParser.RULE_cics_set_library:
        this.checkLibrary(ctx as unknown as Cics_set_libraryContext);
        break;
      case CICSParser.RULE_cics_set_modename:
        this.checkModename(ctx as unknown as Cics_set_modenameContext);
        break;
      case CICSParser.RULE_cics_set_monitor:
        this.checkMonitor(ctx as unknown as Cics_set_monitorContext);
        break;
      case CICSParser.RULE_cics_set_mqconn:
        this.checkMqconn(ctx as unknown as Cics_set_mqconnContext);
        break;
      case CICSParser.RULE_cics_set_mqmonitor:
        this.checkMqmonitor(ctx as unknown as Cics_set_mqmonitorContext);
        break;
      case CICSParser.RULE_cics_set_netname:
        this.checkNetname(ctx as unknown as Cics_set_netnameContext);
        break;
      case CICSParser.RULE_cics_set_otel:
        this.checkOtel(ctx as unknown as Cics_set_otelContext);
        break;
      case CICSParser.RULE_cics_set_pipeline:
        this.checkPipeline(ctx as unknown as Cics_set_pipelineContext);
        break;
      case CICSParser.RULE_cics_set_processtype:
        this.checkProcesstype(ctx as unknown as Cics_set_processtypeContext);
        break;
      case CICSParser.RULE_cics_set_program:
        this.checkProgram(ctx as unknown as Cics_set_programContext);
        break;
      case CICSParser.RULE_cics_set_secdiscovery:
        this.checkSecdiscovery(ctx as unknown as Cics_set_secdiscoveryContext);
        break;
      case CICSParser.RULE_cics_set_secrecording:
        this.checkSecrecording(ctx as unknown as Cics_set_secrecordingContext);
        break;
      case CICSParser.RULE_cics_set_statistics:
        this.checkStatistics(ctx as unknown as Cics_set_statisticsContext);
        break;
      case CICSParser.RULE_cics_set_sysdumpcode:
        this.checkSysdumpcode(ctx as unknown as Cics_set_sysdumpcodeContext);
        break;
      case CICSParser.RULE_cics_set_system:
        this.checkSystem(ctx as unknown as Cics_set_systemContext);
        break;
      case CICSParser.RULE_cics_set_tags_refresh:
        this.checkTagsRefresh(ctx as unknown as Cics_set_tags_refreshContext);
        break;
      case CICSParser.RULE_cics_set_task:
        this.checkTask(ctx as unknown as Cics_set_taskContext);
        break;
      case CICSParser.RULE_cics_set_tclass:
        this.checkTclass(ctx as unknown as Cics_set_tclassContext);
        break;
      case CICSParser.RULE_cics_set_tcpip:
        this.checkTcpip(ctx as unknown as Cics_set_tcpipContext);
        break;
      case CICSParser.RULE_cics_set_tcpipservice:
        this.checkTcpipservice(ctx as unknown as Cics_set_tcpipserviceContext);
        break;
      case CICSParser.RULE_cics_set_tdqueue:
        this.checkTdqueue(ctx as unknown as Cics_set_tdqueueContext);
        break;
      case CICSParser.RULE_cics_set_tempstorage:
        this.checkTempstorage(ctx as unknown as Cics_set_tempstorageContext);
        break;
      case CICSParser.RULE_cics_set_terminal:
        this.checkTerminal(ctx as unknown as Cics_set_terminalContext);
        break;
      case CICSParser.RULE_cics_set_tracedest:
        this.checkTracedest(ctx as unknown as Cics_set_tracedestContext);
        break;
      case CICSParser.RULE_cics_set_traceflag:
        this.checkTraceflag(ctx as unknown as Cics_set_traceflagContext);
        break;
      case CICSParser.RULE_cics_set_tracetype:
        this.checkTracetype(ctx as unknown as Cics_set_tracetypeContext);
        break;
      case CICSParser.RULE_cics_set_tranclass:
        this.checkTranclass(ctx as unknown as Cics_set_tranclassContext);
        break;
      case CICSParser.RULE_cics_set_trandumpcode:
        this.checkTrandumpcode(ctx as unknown as Cics_set_trandumpcodeContext);
        break;
      case CICSParser.RULE_cics_set_transaction:
        this.checkTransaction(ctx as unknown as Cics_set_transactionContext);
        break;
      case CICSParser.RULE_cics_set_tsqueue:
        this.checkTsqueue(ctx as unknown as Cics_set_tsqueueContext);
        break;
      case CICSParser.RULE_cics_set_uow:
        this.checkUow(ctx as unknown as Cics_set_uowContext);
        break;
      case CICSParser.RULE_cics_set_uowlink:
        this.checkUowlink(ctx as unknown as Cics_set_uowlinkContext);
        break;
      case CICSParser.RULE_cics_set_urimap:
        this.checkUrimap(ctx as unknown as Cics_set_urimapContext);
        break;
      case CICSParser.RULE_cics_set_volume:
        this.checkVolume(ctx as unknown as Cics_set_volumeContext);
        break;
      case CICSParser.RULE_cics_set_vtam:
        this.checkVtam(ctx as unknown as Cics_set_vtamContext);
        break;
      case CICSParser.RULE_cics_set_web:
        this.checkWeb(ctx as unknown as Cics_set_webContext);
        break;
      case CICSParser.RULE_cics_set_webservice:
        this.checkWebservice(ctx as unknown as Cics_set_webserviceContext);
        break;
      case CICSParser.RULE_cics_set_wlmhealth:
        this.checkWlmhealth(ctx as unknown as Cics_set_wlmhealthContext);
        break;
      case CICSParser.RULE_cics_set_xmltransform:
        this.checkXmltransform(ctx as unknown as Cics_set_xmltransformContext);
        break;
      default:
        break;
    }
    this.checkDuplicates(ctx);
  }

  private checkAssociationUsercorrdata(
    ctx: Cics_set_association_usercorrdataContext,
  ) {
    this.checkHasMandatoryOptions(ctx.ASSOCIATION(), ctx, "ASSOCIATION");
    this.checkHasMandatoryOptions(ctx.USERCORRDATA(), ctx, "USERCORRDATA");
  }

  private checkAtomservice(ctx: Cics_set_atomserviceContext) {
    this.checkHasMandatoryOptions(ctx.ATOMSERVICE(), ctx, "ATOMSERVICE");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkAutoinstall(ctx: Cics_set_autoinstallContext) {
    this.checkHasMandatoryOptions(ctx.AUTOINSTALL(), ctx, "AUTOINSTALL");
  }

  private checkBrfacility(ctx: Cics_set_brfacilityContext) {
    this.checkHasMandatoryOptions(ctx.BRFACILITY(), ctx, "BRFACILITY");
    this.checkMutuallyExclusiveOptions(
      "TERMSTATUS or RELEASED",
      ctx.TERMSTATUS(),
      ctx.RELEASED(),
    );
  }

  private checkBundle(ctx: Cics_set_bundleContext) {
    this.checkHasMandatoryOptions(ctx.BUNDLE(), ctx, "BUNDLE");
    this.checkMutuallyExclusiveOptions(
      "AVAILSTATUS, AVAILABLE, UNAVAILABLE, ENABLESTATUS, ENABLED, DISABLED, COPY or PHASEIN",
      ctx.AVAILSTATUS(),
      ctx.AVAILABLE(),
      ctx.UNAVAILABLE(),
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
      ctx.COPY(),
      ctx.PHASEIN(),
    );
  }

  private checkConnection(ctx: Cics_set_connectionContext) {
    this.checkHasMandatoryOptions(ctx.CONNECTION(), ctx, "CONNECTION");
    this.checkMutuallyExclusiveOptions(
      "ACQSTATUS, CONNSTATUS, ACQUIRED or RELEASED",
      ctx.ACQSTATUS(),
      ctx.CONNSTATUS(),
      ctx.ACQUIRED(),
      ctx.RELEASED(),
    );
    this.checkMutuallyExclusiveOptions(
      "AFFINITY or ENDAFFINITY",
      ctx.AFFINITY(),
      ctx.ENDAFFINITY(),
    );
    this.checkMutuallyExclusiveOptions(
      "EXITTRACING, EXITTRACE or NOEXITTRACE",
      ctx.EXITTRACING(),
      ctx.EXITTRACE(),
      ctx.NOEXITTRACE(),
    );
    this.checkMutuallyExclusiveOptions(
      "PENDSTATUS or NOTPENDING",
      ctx.PENDSTATUS(),
      ctx.NOTPENDING(),
    );
    this.checkMutuallyExclusiveOptions(
      "PURGETYPE, CANCEL, FORCECANCEL, FORCEPURGE, KILL or PURGE",
      ctx.PURGETYPE(),
      ctx.CANCEL(),
      ctx.FORCECANCEL(),
      ctx.FORCEPURGE(),
      ctx.KILL(),
      ctx.PURGE(),
    );
    this.checkMutuallyExclusiveOptions(
      "RECOVSTATUS or NORECOVDATA",
      ctx.RECOVSTATUS(),
      ctx.NORECOVDATA(),
    );
    this.checkMutuallyExclusiveOptions(
      "SERVSTATUS, INSERVICE or OUTSERVICE",
      ctx.SERVSTATUS(),
      ctx.INSERVICE(),
      ctx.OUTSERVICE(),
    );
    this.checkMutuallyExclusiveOptions(
      "UOWACTION, BACKOUT, COMMIT, FORCEUOW or RESYNC",
      ctx.UOWACTION(),
      ctx.BACKOUT(),
      ctx.COMMIT(),
      ctx.FORCEUOW(),
      ctx.RESYNC(),
    );
    this.checkMutuallyExclusiveOptions(
      "ZCPTRACING, NOZCPTRACE or ZCPTRACE",
      ctx.ZCPTRACING(),
      ctx.NOZCPTRACE(),
      ctx.ZCPTRACE(),
    );
  }

  private checkDb2conn(ctx: Cics_set_db2connContext) {
    this.checkHasMandatoryOptions(ctx.DB2CONN(), ctx, "DB2CONN");
    this.checkMutuallyExclusiveOptions(
      "ACCOUNTREC, UOW, TASK, TXID or NONE",
      ctx.ACCOUNTREC(),
      ctx.UOW(),
      ctx.TASK(),
      ctx.TXID(),
      ctx.NONE(),
    );
    this.checkMutuallyExclusiveOptions(
      "AUTHTYPE, GROUP, SIGN, TERM, TX, OPID or USERID",
      ctx.AUTHTYPE(),
      ctx.GROUP(),
      ctx.SIGN(),
      ctx.TERM(),
      ctx.TX(),
      ctx.OPID(),
      ctx.USERID(),
    );
    this.checkMutuallyExclusiveOptions(
      "BUSY, WAIT, NOWAIT or FORCE",
      ctx.BUSY(),
      ctx.WAIT(),
      ctx.NOWAIT(),
      ctx.FORCE(),
    );
    this.checkMutuallyExclusiveOptions(
      "COMAUTHTYPE, CGROUP, CSIGN, CTERM, CTX, COPID or CUSERID",
      ctx.COMAUTHTYPE(),
      ctx.CGROUP(),
      ctx.CSIGN(),
      ctx.CTERM(),
      ctx.CTX(),
      ctx.COPID(),
      ctx.CUSERID(),
    );
    this.checkMutuallyExclusiveOptions(
      "CONNECTERROR, ABEND or SQLCODE",
      ctx.CONNECTERROR(),
      ctx.ABEND(),
      ctx.SQLCODE(),
    );
    this.checkMutuallyExclusiveOptions(
      "CONNECTST, CONNECTED or NOTCONNECTED",
      ctx.CONNECTST(),
      ctx.CONNECTED(),
      ctx.NOTCONNECTED(),
    );
    this.checkMutuallyExclusiveOptions(
      "NONTERMREL, RELEASE or NORELEASE",
      ctx.NONTERMREL(),
      ctx.RELEASE(),
      ctx.NORELEASE(),
    );
    this.checkMutuallyExclusiveOptions(
      "PRIORITY, HIGH, EQUAL or LOW",
      ctx.PRIORITY(),
      ctx.HIGH(),
      ctx.EQUAL(),
      ctx.LOW(),
    );
    this.checkMutuallyExclusiveOptions(
      "RESYNCMEMBER, RESYNC or NORESYNC",
      ctx.RESYNCMEMBER(),
      ctx.RESYNC(),
      ctx.NORESYNC(),
    );
    this.checkMutuallyExclusiveOptions(
      "STANDBYMODE, NOCONNECT, CONNECT or RECONNECT",
      ctx.STANDBYMODE(),
      ctx.NOCONNECT(),
      ctx.CONNECT(),
      ctx.RECONNECT(),
    );
    this.checkMutuallyExclusiveOptions(
      "THREADWAIT, TWAIT or NOTWAIT",
      ctx.THREADWAIT(),
      ctx.TWAIT(),
      ctx.NOTWAIT(),
    );
  }

  private checkDb2entry(ctx: Cics_set_db2entryContext) {
    this.checkHasMandatoryOptions(ctx.DB2ENTRY(), ctx, "DB2ENTRY");
    this.checkMutuallyExclusiveOptions(
      "ACCOUNTREC, UOW, TASK, TXID or NONE",
      ctx.ACCOUNTREC(),
      ctx.UOW(),
      ctx.TASK(),
      ctx.TXID(),
      ctx.NONE(),
    );
    this.checkMutuallyExclusiveOptions(
      "AUTHTYPE, GROUP, SIGN, TERM, TX, OPID or USERID",
      ctx.AUTHTYPE(),
      ctx.GROUP(),
      ctx.SIGN(),
      ctx.TERM(),
      ctx.TX(),
      ctx.OPID(),
      ctx.USERID(),
    );
    this.checkMutuallyExclusiveOptions(
      "BUSY, WAIT, NOWAIT or FORCE",
      ctx.BUSY(),
      ctx.WAIT(),
      ctx.NOWAIT(),
      ctx.FORCE(),
    );
    this.checkMutuallyExclusiveOptions(
      "DISABLEDACT, ABEND, SQLCODE or POOL",
      ctx.DISABLEDACT(),
      ctx.ABEND(),
      ctx.SQLCODE(),
      ctx.POOL(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "PRIORITY, HIGH, EQUAL or LOW",
      ctx.PRIORITY(),
      ctx.HIGH(),
      ctx.EQUAL(),
      ctx.LOW(),
    );
    this.checkMutuallyExclusiveOptions(
      "SHARELOCKS, YES or NO",
      ctx.SHARELOCKS(),
      ctx.YES(),
      ctx.NO(),
    );
    this.checkMutuallyExclusiveOptions(
      "THREADWAIT, TWAIT, NOTWAIT or TPOOL",
      ctx.THREADWAIT(),
      ctx.TWAIT(),
      ctx.NOTWAIT(),
      ctx.TPOOL(),
    );
  }

  private checkDb2tran(ctx: Cics_set_db2tranContext) {
    this.checkHasMandatoryOptions(ctx.DB2TRAN(), ctx, "DB2TRAN");
  }

  private checkDeletshipped(ctx: Cics_set_deletshippedContext) {
    this.checkHasMandatoryOptions(ctx.DELETSHIPPED(), ctx, "DELETSHIPPED");
    this.checkMutuallyExclusiveOptions(
      "IDLE or IDLEHRS",
      ctx.IDLE(),
      ctx.IDLEHRS(),
    );
    this.checkMutuallyExclusiveOptions(
      "IDLE or IDLEMINS",
      ctx.IDLE(),
      ctx.IDLEMINS(),
    );
    this.checkMutuallyExclusiveOptions(
      "IDLE or IDLESECS",
      ctx.IDLE(),
      ctx.IDLESECS(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTERVAL or INTERVALHRS",
      ctx.INTERVAL(),
      ctx.INTERVALHRS(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTERVAL or INTERVALMINS",
      ctx.INTERVAL(),
      ctx.INTERVALMINS(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTERVAL or INTERVALSECS",
      ctx.INTERVAL(),
      ctx.INTERVALSECS(),
    );
  }

  private checkDispatcher(ctx: Cics_set_dispatcherContext) {
    this.checkHasMandatoryOptions(ctx.DISPATCHER(), ctx, "DISPATCHER");
  }

  private checkDoctemplate(ctx: Cics_set_doctemplateContext) {
    this.checkHasMandatoryOptions(ctx.DOCTEMPLATE(), ctx, "DOCTEMPLATE");
    this.checkHasExactlyOneOption(
      "COPY or NEWCOPY",
      ctx,
      ctx.COPY(),
      ctx.NEWCOPY(),
    );
  }

  private checkDsname(ctx: Cics_set_dsnameContext) {
    this.checkHasMandatoryOptions(ctx.DSNAME(), ctx, "DSNAME");
    this.checkMutuallyExclusiveOptions(
      "ACTION, REMOVE, RECOVERED, RESETLOCKS or RETRY",
      ctx.ACTION(),
      ctx.REMOVE(),
      ctx.RECOVERED(),
      ctx.RESETLOCKS(),
      ctx.RETRY(),
    );
    this.checkMutuallyExclusiveOptions(
      "AVAILABILITY, AVAILABLE, RREPL or UNAVAILABLE",
      ctx.AVAILABILITY(),
      ctx.AVAILABLE(),
      ctx.RREPL(),
      ctx.UNAVAILABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "QUESCESTATE, QUIESCED, IMMQUIESCED or UNQUIESCED",
      ctx.QUESCESTATE(),
      ctx.QUIESCED(),
      ctx.IMMQUIESCED(),
      ctx.UNQUIESCED(),
    );
    this.checkMutuallyExclusiveOptions(
      "WAIT, BUSY or NOWAIT",
      ctx.WAIT(),
      ctx.BUSY(),
      ctx.NOWAIT(),
    );
    this.checkMutuallyExclusiveOptions(
      "UOWACTION, BACKOUT, COMMIT or FORCE",
      ctx.UOWACTION(),
      ctx.BACKOUT(),
      ctx.COMMIT(),
      ctx.FORCE(),
    );
  }

  private checkDumpds(ctx: Cics_set_dumpdsContext) {
    this.checkHasMandatoryOptions(ctx.DUMPDS(), ctx, "DUMPDS");
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, CLOSED, OPEN or SWITCH",
      ctx.OPENSTATUS(),
      ctx.CLOSED(),
      ctx.OPEN(),
      ctx.SWITCH(),
    );
    this.checkMutuallyExclusiveOptions(
      "SWITCHSTATUS, NOSWITCH, SWITCHNEXT or SWITCHALL",
      ctx.SWITCHSTATUS(),
      ctx.NOSWITCH(),
      ctx.SWITCHNEXT(),
      ctx.SWITCHALL(),
    );
  }

  private checkEnqmodel(ctx: Cics_set_enqmodelContext) {
    this.checkHasMandatoryOptions(ctx.ENQMODEL(), ctx, "ENQMODEL");
    this.checkMutuallyExclusiveOptions(
      "STATUS, ENABLED or DISABLED",
      ctx.STATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkEpadapter(ctx: Cics_set_epadapterContext) {
    this.checkHasMandatoryOptions(ctx.EPADAPTER(), ctx, "EPADAPTER");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkEpadapterset(ctx: Cics_set_epadaptersetContext) {
    this.checkHasMandatoryOptions(ctx.EPADAPTERSET(), ctx, "EPADAPTERSET");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkEventbinding(ctx: Cics_set_eventbindingContext) {
    this.checkHasMandatoryOptions(ctx.EVENTBINDING(), ctx, "EVENTBINDING");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkEventprocess(ctx: Cics_set_eventprocessContext) {
    this.checkHasMandatoryOptions(ctx.EVENTPROCESS(), ctx, "EVENTPROCESS");
    this.checkMutuallyExclusiveOptions(
      "EPSTATUS, STARTED, DRAIN or STOPPED",
      ctx.EPSTATUS(),
      ctx.STARTED(),
      ctx.DRAIN(),
      ctx.STOPPED(),
    );
  }

  private checkFile(ctx: Cics_set_fileContext) {
    this.checkHasExactlyOneOption(
      "FILE or DATASET",
      ctx,
      ctx.FILE(),
      ctx.DATASET(),
    );
    this.checkMutuallyExclusiveOptions(
      "ADD, ADDABLE or NOTADDABLE",
      ctx.ADD(),
      ctx.ADDABLE(),
      ctx.NOTADDABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "BROWSE, BROWSABLE or NOTBROWSABLE",
      ctx.BROWSE(),
      ctx.BROWSABLE(),
      ctx.NOTBROWSABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "BUSY, WAIT, FORCE or NOWAIT",
      ctx.BUSY(),
      ctx.WAIT(),
      ctx.FORCE(),
      ctx.NOWAIT(),
    );
    this.checkMutuallyExclusiveOptions(
      "DELETE, DELETABLE or NOTDELETABLE",
      ctx.DELETE(),
      ctx.DELETABLE(),
      ctx.NOTDELETABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "DISPOSITION, OLD or SHARE",
      ctx.DISPOSITION(),
      ctx.OLD(),
      ctx.SHARE(),
    );
    this.checkMutuallyExclusiveOptions(
      "DSNAME or OBJECTNAME",
      ctx.DSNAME(),
      ctx.OBJECTNAME(),
    );
    this.checkMutuallyExclusiveOptions(
      "EMPTYSTATUS, EMPTY, EMPTYREQ or NOEMPTYREQ",
      ctx.EMPTYSTATUS(),
      ctx.EMPTY(),
      ctx.EMPTYREQ(),
      ctx.NOEMPTYREQ(),
    );
    this.checkMutuallyExclusiveOptions(
      "EXCLUSIVE, EXCTL or NOEXCTL",
      ctx.EXCLUSIVE(),
      ctx.EXCTL(),
      ctx.NOEXCTL(),
    );
    this.checkMutuallyExclusiveOptions(
      "LOADTYPE, LOAD or NOLOAD",
      ctx.LOADTYPE(),
      ctx.LOAD(),
      ctx.NOLOAD(),
    );
    this.checkMutuallyExclusiveOptions(
      "READ, READABLE or NOTREADABLE",
      ctx.READ(),
      ctx.READABLE(),
      ctx.NOTREADABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "READINTEG, UNCOMMITTED, CONSISTENT or REPEATABLE",
      ctx.READINTEG(),
      ctx.UNCOMMITTED(),
      ctx.CONSISTENT(),
      ctx.REPEATABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "RLSACCESS, RLS or NOTRLS",
      ctx.RLSACCESS(),
      ctx.RLS(),
      ctx.NOTRLS(),
    );
    this.checkMutuallyExclusiveOptions(
      "TABLE, CFTABLE, CICSTABLE, NOTTABLE or USERTABLE",
      ctx.TABLE(),
      ctx.CFTABLE(),
      ctx.CICSTABLE(),
      ctx.NOTTABLE(),
      ctx.USERTABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "UPDATE, UPDATABLE or NOTUPDATABLE",
      ctx.UPDATE(),
      ctx.UPDATABLE(),
      ctx.NOTUPDATABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "UPDATEMODEL, CONTENTION or LOCKING",
      ctx.UPDATEMODEL(),
      ctx.CONTENTION(),
      ctx.LOCKING(),
    );
    this.checkMutuallyExclusiveOptions(
      "OPEN or CLOSED",
      ctx.OPEN(),
      ctx.CLOSED(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENABLED or DISABLED",
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkHost(ctx: Cics_set_hostContext) {
    this.checkHasMandatoryOptions(ctx.HOST(), ctx, "HOST");
  }

  private checkIpconn(ctx: Cics_set_ipconnContext) {
    this.checkHasMandatoryOptions(ctx.IPCONN(), ctx, "IPCONN");
    this.checkMutuallyExclusiveOptions(
      "CONNSTATUS, ACQUIRED or RELEASED",
      ctx.CONNSTATUS(),
      ctx.ACQUIRED(),
      ctx.RELEASED(),
    );
    this.checkMutuallyExclusiveOptions(
      "PENDSTATUS or NOTPENDING",
      ctx.PENDSTATUS(),
      ctx.NOTPENDING(),
    );
    this.checkMutuallyExclusiveOptions(
      "PURGETYPE, CANCEL, FORCECANCEL, FORCEPURGE, KILL or PURGE",
      ctx.PURGETYPE(),
      ctx.CANCEL(),
      ctx.FORCECANCEL(),
      ctx.FORCEPURGE(),
      ctx.KILL(),
      ctx.PURGE(),
    );
    this.checkMutuallyExclusiveOptions(
      "RECOVSTATUS or NORECOVDATA",
      ctx.RECOVSTATUS(),
      ctx.NORECOVDATA(),
    );
    this.checkMutuallyExclusiveOptions(
      "SERVSTATUS, INSERVICE or OUTSERVICE",
      ctx.SERVSTATUS(),
      ctx.INSERVICE(),
      ctx.OUTSERVICE(),
    );
    this.checkMutuallyExclusiveOptions(
      "UOWACTION, BACKOUT, COMMIT, FORCEUOW or RESYNC",
      ctx.UOWACTION(),
      ctx.BACKOUT(),
      ctx.COMMIT(),
      ctx.FORCEUOW(),
      ctx.RESYNC(),
    );
  }

  private checkIrc(ctx: Cics_set_ircContext) {
    this.checkHasMandatoryOptions(ctx.IRC(), ctx, "IRC");
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, CLOSED, IMMCLOSE or OPEN",
      ctx.OPENSTATUS(),
      ctx.CLOSED(),
      ctx.IMMCLOSE(),
      ctx.OPEN(),
    );
  }

  private checkJournalname(ctx: Cics_set_journalnameContext) {
    this.checkHasMandatoryOptions(ctx.JOURNALNAME(), ctx, "JOURNALNAME");
    this.checkMutuallyExclusiveOptions(
      "ACTION, FLUSH, RESET, STATUS, DISABLED or ENABLED",
      ctx.ACTION(),
      ctx.FLUSH(),
      ctx.RESET(),
      ctx.STATUS(),
      ctx.DISABLED(),
      ctx.ENABLED(),
    );
  }

  private checkJournalnum(ctx: Cics_set_journalnumContext) {
    this.checkHasMandatoryOptions(ctx.JOURNALNUM(), ctx, "JOURNALNUM");
    this.checkHasObsoleteOptions(
      ctx.JOURNALNUM(),
      ctx,
      "JOURNALNUM. Replace with JOURNALNAME.",
    );
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, ADVANCE, CLOSED, CLOSELEAVE or OPENOUTPUT",
      ctx.OPENSTATUS(),
      ctx.ADVANCE(),
      ctx.CLOSED(),
      ctx.CLOSELEAVE(),
      ctx.OPENOUTPUT(),
    );
    this.checkHasObsoleteOptions(ctx.OPENSTATUS(), ctx, "OPENSTATUS");
    this.checkHasObsoleteOptions(ctx.ADVANCE(), ctx, "ADVANCE");
    this.checkHasObsoleteOptions(ctx.CLOSED(), ctx, "CLOSED");
    this.checkHasObsoleteOptions(ctx.CLOSELEAVE(), ctx, "CLOSELEAVE");
    this.checkHasObsoleteOptions(ctx.OPENOUTPUT(), ctx, "OPENOUTPUT");
  }

  private checkJvmendpoint(ctx: Cics_set_jvmendpointContext) {
    this.checkHasMandatoryOptions(ctx.JVMENDPOINT(), ctx, "JVMENDPOINT");
    this.checkHasMandatoryOptions(ctx.JVMSERVER(), ctx, "JVMSERVER");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.DISABLED(),
      ctx.ENABLED(),
    );
  }

  private checkJvmserver(ctx: Cics_set_jvmserverContext) {
    this.checkHasMandatoryOptions(ctx.JVMSERVER(), ctx, "JVMSERVER");
    this.checkMutuallyExclusiveOptions(
      "PHASEOUT, PURGETYPE, PURGE, FORCEPURGE or KILL",
      ctx.PHASEOUT(),
      ctx.PURGETYPE(),
      ctx.PURGE(),
      ctx.FORCEPURGE(),
      ctx.KILL(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkLibrary(ctx: Cics_set_libraryContext) {
    this.checkHasMandatoryOptions(ctx.LIBRARY(), ctx, "LIBRARY");
    this.checkMutuallyExclusiveOptions(
      "CRITICALST, CRITICAL or NONCRITICAL",
      ctx.CRITICALST(),
      ctx.CRITICAL(),
      ctx.NONCRITICAL(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkModename(ctx: Cics_set_modenameContext) {
    this.checkHasMandatoryOptions(ctx.MODENAME(), ctx, "MODENAME");
    this.checkHasMandatoryOptions(ctx.CONNECTION(), ctx, "CONNECTION");
    this.checkPrerequisiteIsMet(
      ctx.AVAILABLE(),
      ctx.ACQUIRED(),
      ctx,
      "ACQUIRED without AVAILABLE",
    );
    this.checkMutuallyExclusiveOptions(
      "ACQSTATUS or ACQUIRED",
      ctx.ACQSTATUS(),
      ctx.ACQUIRED(),
    );
    this.checkMutuallyExclusiveOptions(
      "ACQSTATUS or CLOSED",
      ctx.ACQSTATUS(),
      ctx.CLOSED(),
    );
  }

  private checkMonitor(ctx: Cics_set_monitorContext) {
    this.checkHasMandatoryOptions(ctx.MONITOR(), ctx, "MONITOR");
    this.checkMutuallyExclusiveOptions(
      "COMPRESSST, COMPRESS or NOCOMPRESS",
      ctx.COMPRESSST(),
      ctx.COMPRESS(),
      ctx.NOCOMPRESS(),
    );
    this.checkMutuallyExclusiveOptions(
      "CONVERSEST, CONVERSE or NOCONVERSE",
      ctx.CONVERSEST(),
      ctx.CONVERSE(),
      ctx.NOCONVERSE(),
    );
    this.checkMutuallyExclusiveOptions(
      "EXCEPTCLASS, EXCEPT or NOEXCEPT",
      ctx.EXCEPTCLASS(),
      ctx.EXCEPT(),
      ctx.NOEXCEPT(),
    );
    this.checkMutuallyExclusiveOptions(
      "FREQUENCY or FREQUENCYHRS",
      ctx.FREQUENCY(),
      ctx.FREQUENCYHRS(),
    );
    this.checkMutuallyExclusiveOptions(
      "FREQUENCY or FREQUENCYMIN",
      ctx.FREQUENCY(),
      ctx.FREQUENCYMIN(),
    );
    this.checkMutuallyExclusiveOptions(
      "FREQUENCY or FREQUENCYSEC",
      ctx.FREQUENCY(),
      ctx.FREQUENCYSEC(),
    );
    this.checkMutuallyExclusiveOptions(
      "IDNTYCLASS, IDNTY or NOIDNTY",
      ctx.IDNTYCLASS(),
      ctx.IDNTY(),
      ctx.NOIDNTY(),
    );
    this.checkMutuallyExclusiveOptions(
      "PERFCLASS, PERF or NOPERF",
      ctx.PERFCLASS(),
      ctx.PERF(),
      ctx.NOPERF(),
    );
    this.checkMutuallyExclusiveOptions(
      "RESRCECLASS, RESRCE or NORESRCE",
      ctx.RESRCECLASS(),
      ctx.RESRCE(),
      ctx.NORESRCE(),
    );
    this.checkMutuallyExclusiveOptions(
      "STATUS, ON or OFF",
      ctx.STATUS(),
      ctx.ON(),
      ctx.OFF(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYNCPOINTST, SYNCPOINT or NOSYNCPOINT",
      ctx.SYNCPOINTST(),
      ctx.SYNCPOINT(),
      ctx.NOSYNCPOINT(),
    );
  }

  private checkMqconn(ctx: Cics_set_mqconnContext) {
    this.checkHasMandatoryOptions(ctx.MQCONN(), ctx, "MQCONN");
    if (
      ctx.WAIT().length !== 0 ||
      ctx.BUSY().length !== 0 ||
      ctx.NOWAIT().length !== 0 ||
      ctx.FORCE().length !== 0
    )
      this.checkMutuallyExclusiveOptions(
        "CONNECTST, CONNECTED or NOTCONNECTED",
        ctx.CONNECTST(),
        ctx.CONNECTED(),
        ctx.NOTCONNECTED(),
      );
    this.checkMutuallyExclusiveOptions(
      "WAIT, BUSY, NOWAIT or FORCE",
      ctx.WAIT(),
      ctx.BUSY(),
      ctx.NOWAIT(),
      ctx.FORCE(),
    );
    this.checkMutuallyExclusiveOptions(
      "CONNECTST, CONNECTED or NOTCONNECTED",
      ctx.CONNECTST(),
      ctx.CONNECTED(),
      ctx.NOTCONNECTED(),
    );
    this.checkMutuallyExclusiveOptions(
      "RESYNCMEMBER, RESYNC, NORESYNC or GROUPRESYNC",
      ctx.RESYNCMEMBER(),
      ctx.RESYNC(),
      ctx.NORESYNC(),
      ctx.GROUPRESYNC(),
    );
  }

  private checkMqmonitor(ctx: Cics_set_mqmonitorContext) {
    this.checkHasMandatoryOptions(ctx.MQMONITOR(), ctx, "MQMONITOR");
    this.checkMutuallyExclusiveOptions(
      "AUTOSTATUS, AUTOSTART or NOAUTOSTART",
      ctx.AUTOSTATUS(),
      ctx.AUTOSTART(),
      ctx.NOAUTOSTART(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "MONSTATUS, STARTED or STOPPED",
      ctx.MONSTATUS(),
      ctx.STARTED(),
      ctx.STOPPED(),
    );
  }

  private checkNetname(ctx: Cics_set_netnameContext) {
    this.checkHasMandatoryOptions(ctx.NETNAME(), ctx, "NETNAME");
    this.checkMutuallyExclusiveOptions(
      "EXITTRACING, EXITTRACE or NOEXITTRACE",
      ctx.EXITTRACING(),
      ctx.EXITTRACE(),
      ctx.NOEXITTRACE(),
    );
  }

  private checkOtel(ctx: Cics_set_otelContext) {
    this.checkHasMandatoryOptions(ctx.OTEL(), ctx, "OTEL");
  }

  private checkPipeline(ctx: Cics_set_pipelineContext) {
    this.checkHasMandatoryOptions(ctx.PIPELINE(), ctx, "PIPELINE");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
  }

  private checkProcesstype(ctx: Cics_set_processtypeContext) {
    this.checkHasMandatoryOptions(ctx.PROCESSTYPE(), ctx, "PROCESSTYPE");
    this.checkMutuallyExclusiveOptions(
      "STATUS, DISABLED or ENABLED",
      ctx.STATUS(),
      ctx.DISABLED(),
      ctx.ENABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "AUDITLEVEL, ACTIVITY, FULL, OFF or PROCESS",
      ctx.AUDITLEVEL(),
      ctx.ACTIVITY(),
      ctx.FULL(),
      ctx.OFF(),
      ctx.PROCESS(),
    );
  }

  private checkProgram(ctx: Cics_set_programContext) {
    this.checkHasMandatoryOptions(ctx.PROGRAM(), ctx, "PROGRAM");
    this.checkMutuallyExclusiveOptions(
      "CEDFSTATUS, CEDF or NOCEDF",
      ctx.CEDFSTATUS(),
      ctx.CEDF(),
      ctx.NOCEDF(),
    );
    this.checkMutuallyExclusiveOptions(
      "COPY, NEWCOPY or PHASEIN",
      ctx.COPY(),
      ctx.NEWCOPY(),
      ctx.PHASEIN(),
    );
    this.checkMutuallyExclusiveOptions(
      "EXECUTIONSET, DPLSUBSET or FULLAPI",
      ctx.EXECUTIONSET(),
      ctx.DPLSUBSET(),
      ctx.FULLAPI(),
    );
    this.checkMutuallyExclusiveOptions(
      "REPLICATION, REPLICATOR or NOREPLICATOR",
      ctx.REPLICATION(),
      ctx.REPLICATOR(),
      ctx.NOREPLICATOR(),
    );
    this.checkMutuallyExclusiveOptions(
      "RUNTIME, JVM or NOJVM",
      ctx.RUNTIME(),
      ctx.JVM(),
      ctx.NOJVM(),
    );
    this.checkMutuallyExclusiveOptions(
      "SHARESTATUS, PRIVATE or SHARED",
      ctx.SHARESTATUS(),
      ctx.PRIVATE(),
      ctx.SHARED(),
    );
    this.checkMutuallyExclusiveOptions(
      "STATUS, DISABLED or ENABLED",
      ctx.STATUS(),
      ctx.DISABLED(),
      ctx.ENABLED(),
    );
  }

  private checkSecdiscovery(ctx: Cics_set_secdiscoveryContext) {
    this.checkHasMandatoryOptions(ctx.SECDISCOVERY(), ctx, "SECDISCOVERY");
    this.checkMutuallyExclusiveOptions(
      "ON, OFF or STATUS",
      ctx.ON(),
      ctx.OFF(),
      ctx.STATUS(),
    );
    this.checkMutuallyExclusiveOptions(
      "CMD or DISCOVERALL",
      ctx.CMD(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "DB2 or DISCOVERALL",
      ctx.DB2(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "DCT or DISCOVERALL",
      ctx.DCT(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "FCT or DISCOVERALL",
      ctx.FCT(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "HFS or DISCOVERALL",
      ctx.HFS(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "JCT or DISCOVERALL",
      ctx.JCT(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "PCT or DISCOVERALL",
      ctx.PCT(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "PPT or DISCOVERALL",
      ctx.PPT(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "PSB or DISCOVERALL",
      ctx.PSB(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "RES or DISCOVERALL",
      ctx.RES(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "TST or DISCOVERALL",
      ctx.TST(),
      ctx.DISCOVERALL(),
    );
    this.checkMutuallyExclusiveOptions(
      "USER or DISCOVERALL",
      ctx.USER(),
      ctx.DISCOVERALL(),
    );
  }

  private checkSecrecording(ctx: Cics_set_secrecordingContext) {
    this.checkHasMandatoryOptions(ctx.SECRECORDING(), ctx, "SECRECORDING");
    this.checkAllOptionsArePresentOrAbsent(
      "ADD and MAXIMUM",
      ctx,
      ctx.ADD(),
      ctx.MAXIMUM(),
    );
    this.checkHasExactlyOneOption(
      "ACTION, ADD MAXIMUM, MODIFY or REMOVE",
      ctx,
      ctx.ACTION(),
      ctx.ADD(),
      ctx.MODIFY(),
      ctx.REMOVE(),
    );
  }

  private checkStatistics(ctx: Cics_set_statisticsContext) {
    this.checkHasMandatoryOptions(ctx.STATISTICS(), ctx, "STATISTICS");
    this.checkMutuallyExclusiveOptions(
      "ENDOFDAY or ENDOFDAYHRS",
      ctx.ENDOFDAY(),
      ctx.ENDOFDAYHRS(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENDOFDAY or ENDOFDAYMINS",
      ctx.ENDOFDAY(),
      ctx.ENDOFDAYMINS(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENDOFDAY or ENDOFDAYSECS",
      ctx.ENDOFDAY(),
      ctx.ENDOFDAYSECS(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTERVAL or INTERVALHRS",
      ctx.INTERVAL(),
      ctx.INTERVALHRS(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTERVAL or INTERVALMINS",
      ctx.INTERVAL(),
      ctx.INTERVALMINS(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTERVAL or INTERVALSECS",
      ctx.INTERVAL(),
      ctx.INTERVALSECS(),
    );
    this.checkMutuallyExclusiveOptions(
      "RECORDING, ON or OFF",
      ctx.RECORDING(),
      ctx.ON(),
      ctx.OFF(),
    );
    if (ctx.RECORDNOW().length !== 0 || ctx.RESETNOW().length !== 0) {
      this.checkHasExactlyOneOption(
        "RECORDING, ON or OFF",
        ctx,
        ctx.RECORDING(),
        ctx.ON(),
        ctx.OFF(),
      );
    }
  }

  private checkSysdumpcode(ctx: Cics_set_sysdumpcodeContext) {
    this.checkHasMandatoryOptions(ctx.SYSDUMPCODE(), ctx, "SYSDUMPCODE");
    this.checkMutuallyExclusiveOptions(
      "ACTION, ADD, REMOVE or RESET",
      ctx.ACTION(),
      ctx.ADD(),
      ctx.REMOVE(),
      ctx.RESET(),
    );
    this.checkMutuallyExclusiveOptions(
      "DAEOPTION, DAE or NODAE",
      ctx.DAEOPTION(),
      ctx.DAE(),
      ctx.NODAE(),
    );
    this.checkMutuallyExclusiveOptions(
      "DUMPSCOPE, LOCAL or RELATED",
      ctx.DUMPSCOPE(),
      ctx.LOCAL(),
      ctx.RELATED(),
    );
    this.checkMutuallyExclusiveOptions(
      "SHUTOPTION, NOSHUTDOWN or SHUTDOWN",
      ctx.SHUTOPTION(),
      ctx.NOSHUTDOWN(),
      ctx.SHUTDOWN(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYSDUMPING, NOSYSDUMP or SYSDUMP",
      ctx.SYSDUMPING(),
      ctx.NOSYSDUMP(),
      ctx.SYSDUMP(),
    );
  }

  private checkSystem(ctx: Cics_set_systemContext) {
    this.checkHasMandatoryOptions(ctx.SYSTEM(), ctx, "SYSTEM");
    this.checkMutuallyExclusiveOptions(
      "DEBUGTOOL, DEBUG or NODEBUG",
      ctx.DEBUGTOOL(),
      ctx.DEBUG(),
      ctx.NODEBUG(),
    );
    this.checkMutuallyExclusiveOptions(
      "DUMPING, NOSYSDUMP, TABLEONLY or SYSDUMP",
      ctx.DUMPING(),
      ctx.NOSYSDUMP(),
      ctx.TABLEONLY(),
      ctx.SYSDUMP(),
    );
    this.checkMutuallyExclusiveOptions(
      "FORCEQR, FORCE or NOFORCE",
      ctx.FORCEQR(),
      ctx.FORCE(),
      ctx.NOFORCE(),
    );
    this.checkMutuallyExclusiveOptions(
      "PROGAUTOCTLG, CTLGALL, CTLGMODIFY or CTLGNONE",
      ctx.PROGAUTOCTLG(),
      ctx.CTLGALL(),
      ctx.CTLGMODIFY(),
      ctx.CTLGNONE(),
    );
    this.checkMutuallyExclusiveOptions(
      "PROGAUTOINST, AUTOACTIVE or AUTOINACTIVE",
      ctx.PROGAUTOINST(),
      ctx.AUTOACTIVE(),
      ctx.AUTOINACTIVE(),
    );
    this.checkPrerequisiteIsMet(
      ctx.GMMTEXT(),
      ctx.GMMLENGTH(),
      ctx,
      "GMMLENGTH without GMMTEXT",
    );
    this.checkPrerequisiteIsMet(
      ctx.MAXTASKS(),
      ctx.NEWMAXTASKS(),
      ctx,
      "NEWMAXTASKS without MAXTASKS",
    );
  }

  private checkTagsRefresh(ctx: Cics_set_tags_refreshContext) {
    this.checkHasMandatoryOptions(ctx.TAGS(), ctx, "TAGS");
    this.checkHasMandatoryOptions(ctx.REFRESH(), ctx, "REFRESH");
  }

  private checkTask(ctx: Cics_set_taskContext) {
    this.checkHasMandatoryOptions(ctx.TASK(), ctx, "TASK");
    this.checkMutuallyExclusiveOptions(
      "PURGETYPE, FORCEPURGE, KILL or PURGE",
      ctx.PURGETYPE(),
      ctx.FORCEPURGE(),
      ctx.KILL(),
      ctx.PURGE(),
    );
    this.checkMutuallyExclusiveOptions(
      "SRRSTATUS, SRRACTIVE or SRRINACTIVE",
      ctx.SRRSTATUS(),
      ctx.SRRACTIVE(),
      ctx.SRRINACTIVE(),
    );
  }

  private checkTclass(ctx: Cics_set_tclassContext) {
    this.checkHasMandatoryOptions(ctx.TCLASS(), ctx, "TCLASS");
  }

  private checkTcpip(ctx: Cics_set_tcpipContext) {
    this.checkHasMandatoryOptions(ctx.TCPIP(), ctx, "TCPIP");
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, CLOSED, IMMCLOSE or OPEN",
      ctx.OPENSTATUS(),
      ctx.CLOSED(),
      ctx.IMMCLOSE(),
      ctx.OPEN(),
    );
  }

  private checkTcpipservice(ctx: Cics_set_tcpipserviceContext) {
    this.checkHasMandatoryOptions(ctx.TCPIPSERVICE(), ctx, "TCPIPSERVICE");
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, CLOSED, IMMCLOSE or OPEN",
      ctx.OPENSTATUS(),
      ctx.CLOSED(),
      ctx.IMMCLOSE(),
      ctx.OPEN(),
    );
  }

  private checkTdqueue(ctx: Cics_set_tdqueueContext) {
    this.checkHasMandatoryOptions(ctx.TDQUEUE(), ctx, "TDQUEUE");
    this.checkMutuallyExclusiveOptions(
      "ATIFACILITY, TERMINAL or NOTERMINAL",
      ctx.ATIFACILITY(),
      ctx.TERMINAL(),
      ctx.NOTERMINAL(),
    );
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, ENABLED or DISABLED",
      ctx.ENABLESTATUS(),
      ctx.ENABLED(),
      ctx.DISABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, CLOSED or OPEN",
      ctx.OPENSTATUS(),
      ctx.CLOSED(),
      ctx.OPEN(),
    );
  }

  private checkTempstorage(ctx: Cics_set_tempstorageContext) {
    this.checkHasMandatoryOptions(ctx.TEMPSTORAGE(), ctx, "TEMPSTORAGE");
  }

  private checkTerminal(ctx: Cics_set_terminalContext) {
    this.checkHasMandatoryOptions(ctx.TERMINAL(), ctx, "TERMINAL");
    this.checkMutuallyExclusiveOptions(
      "ACQSTATUS, TERMSTATUS, ACQUIRED, COLDACQ or RELEASED",
      ctx.ACQSTATUS(),
      ctx.TERMSTATUS(),
      ctx.ACQUIRED(),
      ctx.COLDACQ(),
      ctx.RELEASED(),
    );
    this.checkMutuallyExclusiveOptions(
      "ALTPRTCOPYST, ALTPRTCOPY or NOALTPRTCOPY",
      ctx.ALTPRTCOPYST(),
      ctx.ALTPRTCOPY(),
      ctx.NOALTPRTCOPY(),
    );
    this.checkMutuallyExclusiveOptions(
      "ATISTATUS, ATI or NOATI",
      ctx.ATISTATUS(),
      ctx.ATI(),
      ctx.NOATI(),
    );
    this.checkMutuallyExclusiveOptions(
      "CREATESESS, CREATE or NOCREATE",
      ctx.CREATESESS(),
      ctx.CREATE(),
      ctx.NOCREATE(),
    );
    this.checkMutuallyExclusiveOptions(
      "DISCREQST, DISCREQ or NODISCREQ",
      ctx.DISCREQST(),
      ctx.DISCREQ(),
      ctx.NODISCREQ(),
    );
    this.checkMutuallyExclusiveOptions(
      "EXITTRACING, EXITTRACE or NOEXITTRACE",
      ctx.EXITTRACING(),
      ctx.EXITTRACE(),
      ctx.NOEXITTRACE(),
    );
    this.checkMutuallyExclusiveOptions(
      "OBFORMATST, OBFORMAT or NOOBFORMAT",
      ctx.OBFORMATST(),
      ctx.OBFORMAT(),
      ctx.NOOBFORMAT(),
    );
    this.checkMutuallyExclusiveOptions(
      "PAGESTATUS, AUTOPAGEABLE or PAGEABLE",
      ctx.PAGESTATUS(),
      ctx.AUTOPAGEABLE(),
      ctx.PAGEABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "PRTCOPYST, PRTCOPY or NOPRTCOPY",
      ctx.PRTCOPYST(),
      ctx.PRTCOPY(),
      ctx.NOPRTCOPY(),
    );
    this.checkMutuallyExclusiveOptions(
      "PURGETYPE, FORCEPURGE, KILL, PURGE or CANCEL",
      ctx.PURGETYPE(),
      ctx.FORCEPURGE(),
      ctx.KILL(),
      ctx.PURGE(),
      ctx.CANCEL(),
    );
    this.checkPrerequisiteIsMet(
      ctx.PURGE(),
      ctx.FORCE(),
      ctx,
      "FORCE without PURGE",
    );
    this.checkMutuallyExclusiveOptions(
      "RELREQST, RELREQ or NORELREQ",
      ctx.RELREQST(),
      ctx.RELREQ(),
      ctx.NORELREQ(),
    );
    this.checkMutuallyExclusiveOptions(
      "SERVSTATUS, INSERVICE or OUTSERVICE",
      ctx.SERVSTATUS(),
      ctx.INSERVICE(),
      ctx.OUTSERVICE(),
    );
    this.checkMutuallyExclusiveOptions(
      "TRACING, SPECTRACE or STANTRACE",
      ctx.TRACING(),
      ctx.SPECTRACE(),
      ctx.STANTRACE(),
    );
    this.checkMutuallyExclusiveOptions(
      "TTISTATUS, NOTTI or TTI",
      ctx.TTISTATUS(),
      ctx.NOTTI(),
      ctx.TTI(),
    );
    this.checkMutuallyExclusiveOptions(
      "UCTRANST, UCTRAN, NOUCTRAN or TRANIDONLY",
      ctx.UCTRANST(),
      ctx.UCTRAN(),
      ctx.NOUCTRAN(),
      ctx.TRANIDONLY(),
    );
    this.checkMutuallyExclusiveOptions(
      "ZCPTRACING, NOZCPTRACE or ZCPTRACE",
      ctx.ZCPTRACING(),
      ctx.NOZCPTRACE(),
      ctx.ZCPTRACE(),
    );
  }

  private checkTracedest(ctx: Cics_set_tracedestContext) {
    this.checkHasMandatoryOptions(ctx.TRACEDEST(), ctx, "TRACEDEST");
    this.checkMutuallyExclusiveOptions(
      "AUXSTATUS, AUXPAUSE, AUXSTART or AUXSTOP",
      ctx.AUXSTATUS(),
      ctx.AUXPAUSE(),
      ctx.AUXSTART(),
      ctx.AUXSTOP(),
    );
    this.checkMutuallyExclusiveOptions(
      "GTFSTATUS, GTFSTART or GTFSTOP",
      ctx.GTFSTATUS(),
      ctx.GTFSTART(),
      ctx.GTFSTOP(),
    );
    this.checkMutuallyExclusiveOptions(
      "INTSTATUS, INTSTART or INTSTOP",
      ctx.INTSTATUS(),
      ctx.INTSTART(),
      ctx.INTSTOP(),
    );
    this.checkMutuallyExclusiveOptions(
      "SWITCHACTION or SWITCH",
      ctx.SWITCHACTION(),
      ctx.SWITCH(),
    );
    this.checkMutuallyExclusiveOptions(
      "SWITCHSTATUS, NOSWITCH, SWITCHNEXT or SWITCHALL",
      ctx.SWITCHSTATUS(),
      ctx.NOSWITCH(),
      ctx.SWITCHNEXT(),
      ctx.SWITCHALL(),
    );
  }

  private checkTraceflag(ctx: Cics_set_traceflagContext) {
    this.checkHasMandatoryOptions(ctx.TRACEFLAG(), ctx, "TRACEFLAG");
    this.checkMutuallyExclusiveOptions(
      "SINGLESTATUS, SINGLEOFF or SINGLEON",
      ctx.SINGLESTATUS(),
      ctx.SINGLEOFF(),
      ctx.SINGLEON(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYSTEMSTATUS, SYSTEMOFF or SYSTEMON",
      ctx.SYSTEMSTATUS(),
      ctx.SYSTEMOFF(),
      ctx.SYSTEMON(),
    );
    this.checkMutuallyExclusiveOptions(
      "TCEXITSTATUS, TCEXITALL, TCEXITALLOFF, TCEXITNONE or TCEXITSYSTEM",
      ctx.TCEXITSTATUS(),
      ctx.TCEXITALL(),
      ctx.TCEXITALLOFF(),
      ctx.TCEXITNONE(),
      ctx.TCEXITSYSTEM(),
    );
    this.checkMutuallyExclusiveOptions(
      "USERSTATUS, USEROFF or USERON",
      ctx.USERSTATUS(),
      ctx.USEROFF(),
      ctx.USERON(),
    );
  }

  private checkTracetype(ctx: Cics_set_tracetypeContext) {
    this.checkHasMandatoryOptions(ctx.TRACETYPE(), ctx, "TRACETYPE");
    this.checkHasExactlyOneOption(
      "FLAGSET, SPECIAL or STANDARD",
      ctx,
      ctx.FLAGSET(),
      ctx.SPECIAL(),
      ctx.STANDARD(),
    );
    this.checkMutuallyExclusiveOptions(
      "AP or APPLICATION",
      ctx.AP(),
      ctx.APPLICATION(),
    );
    this.checkMutuallyExclusiveOptions(
      "AS or ASYNCSERVICE",
      ctx.AS(),
      ctx.ASYNCSERVICE(),
    );
    this.checkMutuallyExclusiveOptions(
      "BA or BUSAPPMGR",
      ctx.BA(),
      ctx.BUSAPPMGR(),
    );
    this.checkMutuallyExclusiveOptions("BR or BRIDGE", ctx.BR(), ctx.BRIDGE());
    this.checkMutuallyExclusiveOptions("CP or CPI", ctx.CP(), ctx.CPI());
    this.checkMutuallyExclusiveOptions("DD or DIRMGR", ctx.DD(), ctx.DIRMGR());
    this.checkMutuallyExclusiveOptions(
      "DH or DOCUMENT",
      ctx.DH(),
      ctx.DOCUMENT(),
    );
    this.checkMutuallyExclusiveOptions(
      "DM or DOMAINMGR",
      ctx.DM(),
      ctx.DOMAINMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "DP or DEBUGTOOL",
      ctx.DP(),
      ctx.DEBUGTOOL(),
    );
    this.checkMutuallyExclusiveOptions(
      "DS or DISPATCHER",
      ctx.DS(),
      ctx.DISPATCHER(),
    );
    this.checkMutuallyExclusiveOptions("DU or DUMP", ctx.DU(), ctx.DUMP());
    this.checkMutuallyExclusiveOptions(
      "EC or EVENTCAPTURE",
      ctx.EC(),
      ctx.EVENTCAPTURE(),
    );
    this.checkMutuallyExclusiveOptions(
      "EJ or ENTJAVA",
      ctx.EJ(),
      ctx.ENTJAVA(),
    );
    this.checkMutuallyExclusiveOptions(
      "EM or EVENTMGR",
      ctx.EM(),
      ctx.EVENTMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "EP or EVENTPROC",
      ctx.EP(),
      ctx.EVENTPROC(),
    );
    this.checkMutuallyExclusiveOptions(
      "GC or GLOBALCATLG",
      ctx.GC(),
      ctx.GLOBALCATLG(),
    );
    this.checkMutuallyExclusiveOptions("IE or IPECI", ctx.IE(), ctx.IPECI());
    this.checkMutuallyExclusiveOptions("KE or KERNEL", ctx.KE(), ctx.KERNEL());
    this.checkMutuallyExclusiveOptions(
      "LC or LOCALCATLG",
      ctx.LC(),
      ctx.LOCALCATLG(),
    );
    this.checkMutuallyExclusiveOptions("LD or LOADER", ctx.LD(), ctx.LOADER());
    this.checkMutuallyExclusiveOptions("LG or LOGGER", ctx.LG(), ctx.LOGGER());
    this.checkMutuallyExclusiveOptions(
      "LM or LOCKMGR",
      ctx.LM(),
      ctx.LOCKMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "ME or MESSAGE",
      ctx.ME(),
      ctx.MESSAGE(),
    );
    this.checkMutuallyExclusiveOptions(
      "MN or MONITOR",
      ctx.MN(),
      ctx.MONITOR(),
    );
    this.checkMutuallyExclusiveOptions(
      "MP or MANAGEDPLAT",
      ctx.MP(),
      ctx.MANAGEDPLAT(),
    );
    this.checkMutuallyExclusiveOptions(
      "NQ or ENQUEUE",
      ctx.NQ(),
      ctx.ENQUEUE(),
    );
    this.checkMutuallyExclusiveOptions(
      "OT or OBJECTTRAN",
      ctx.OT(),
      ctx.OBJECTTRAN(),
    );
    this.checkMutuallyExclusiveOptions(
      "PA or PARAMGR",
      ctx.PA(),
      ctx.PARAMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "PG or PROGMGR",
      ctx.PG(),
      ctx.PROGMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "PI or PIPEMGR",
      ctx.PI(),
      ctx.PIPEMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "PT or PARTNER",
      ctx.PT(),
      ctx.PARTNER(),
    );
    this.checkMutuallyExclusiveOptions(
      "RA or RMIADAPTERS",
      ctx.RA(),
      ctx.RMIADAPTERS(),
    );
    this.checkMutuallyExclusiveOptions("RI or RMI", ctx.RI(), ctx.RMI());
    this.checkMutuallyExclusiveOptions(
      "RL or RESLIFEMGR",
      ctx.RL(),
      ctx.RESLIFEMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "RM or RECOVERY",
      ctx.RM(),
      ctx.RECOVERY(),
    );
    this.checkMutuallyExclusiveOptions(
      "RS or REGIONSTAT",
      ctx.RS(),
      ctx.REGIONSTAT(),
    );
    this.checkMutuallyExclusiveOptions("RX or RRS", ctx.RX(), ctx.RRS());
    this.checkMutuallyExclusiveOptions(
      "RZ or REQUESTSTRM",
      ctx.RZ(),
      ctx.REQUESTSTRM(),
    );
    this.checkMutuallyExclusiveOptions(
      "SH or SCHEDULER",
      ctx.SH(),
      ctx.SCHEDULER(),
    );
    this.checkMutuallyExclusiveOptions("SJ or SJVM", ctx.SJ(), ctx.SJVM());
    this.checkMutuallyExclusiveOptions(
      "SM or STORAGE",
      ctx.SM(),
      ctx.STORAGE(),
    );
    this.checkMutuallyExclusiveOptions(
      "SO or SOCKETS",
      ctx.SO(),
      ctx.SOCKETS(),
    );
    this.checkMutuallyExclusiveOptions(
      "ST or STATISTICS",
      ctx.ST(),
      ctx.STATISTICS(),
    );
    this.checkMutuallyExclusiveOptions("TI or TIMER", ctx.TI(), ctx.TIMER());
    this.checkMutuallyExclusiveOptions("TR or TRACE", ctx.TR(), ctx.TRACE());
    this.checkMutuallyExclusiveOptions(
      "TS or TEMPSTORAGE",
      ctx.TS(),
      ctx.TEMPSTORAGE(),
    );
    this.checkMutuallyExclusiveOptions("US or USER", ctx.US(), ctx.USER());
    this.checkMutuallyExclusiveOptions("WB or WEB", ctx.WB(), ctx.WEB());
    this.checkMutuallyExclusiveOptions(
      "WU or WEBRESTMGR",
      ctx.WU(),
      ctx.WEBRESTMGR(),
    );
    this.checkMutuallyExclusiveOptions("W2 or WEB2", ctx.W2(), ctx.WEB2());
    this.checkMutuallyExclusiveOptions(
      "XM or TRANMGR",
      ctx.XM(),
      ctx.TRANMGR(),
    );
    this.checkMutuallyExclusiveOptions(
      "XS or SECURITY",
      ctx.XS(),
      ctx.SECURITY(),
    );
  }

  private checkTranclass(ctx: Cics_set_tranclassContext) {
    this.checkHasMandatoryOptions(ctx.TRANCLASS(), ctx, "TRANCLASS");
    this.checkMutuallyExclusiveOptions(
      "PURGEACTION, ABEND or DISCARD",
      ctx.PURGEACTION(),
      ctx.ABEND(),
      ctx.DISCARD(),
    );
  }

  private checkTrandumpcode(ctx: Cics_set_trandumpcodeContext) {
    this.checkHasMandatoryOptions(ctx.TRANDUMPCODE(), ctx, "TRANDUMPCODE");
    this.checkMutuallyExclusiveOptions(
      "ACTION, ADD, REMOVE or RESET",
      ctx.ACTION(),
      ctx.ADD(),
      ctx.REMOVE(),
      ctx.RESET(),
    );
    this.checkMutuallyExclusiveOptions(
      "DUMPSCOPE, LOCAL or RELATED",
      ctx.DUMPSCOPE(),
      ctx.LOCAL(),
      ctx.RELATED(),
    );
    this.checkMutuallyExclusiveOptions(
      "SHUTOPTION, NOSHUTDOWN or SHUTDOWN",
      ctx.SHUTOPTION(),
      ctx.NOSHUTDOWN(),
      ctx.SHUTDOWN(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYSDUMPING, NOSYSDUMP or SYSDUMP",
      ctx.SYSDUMPING(),
      ctx.NOSYSDUMP(),
      ctx.SYSDUMP(),
    );
    this.checkMutuallyExclusiveOptions(
      "TRANDUMPING, NOTRANDUMP or TRANDUMP",
      ctx.TRANDUMPING(),
      ctx.NOTRANDUMP(),
      ctx.TRANDUMP(),
    );
  }

  private checkTransaction(ctx: Cics_set_transactionContext) {
    this.checkHasMandatoryOptions(ctx.TRANSACTION(), ctx, "TRANSACTION");
    this.checkMutuallyExclusiveOptions(
      "DUMPING, TRANDUMP or NOTRANDUMP",
      ctx.DUMPING(),
      ctx.TRANDUMP(),
      ctx.NOTRANDUMP(),
    );
    this.checkMutuallyExclusiveOptions(
      "OTELTRACE, PROPEMIT, PROP, PROPINIT, PROPINITEMIT or NOOTELTRACE",
      ctx.OTELTRACE(),
      ctx.PROPEMIT(),
      ctx.PROP(),
      ctx.PROPINIT(),
      ctx.PROPINITEMIT(),
      ctx.NOOTELTRACE(),
    );
    this.checkMutuallyExclusiveOptions(
      "PURGEABILITY, NOTPURGEABLE or PURGEABLE",
      ctx.PURGEABILITY(),
      ctx.NOTPURGEABLE(),
      ctx.PURGEABLE(),
    );
    this.checkMutuallyExclusiveOptions(
      "RUNAWAYTYPE, SYSTEM or USER",
      ctx.RUNAWAYTYPE(),
      ctx.SYSTEM(),
      ctx.USER(),
    );
    this.checkMutuallyExclusiveOptions(
      "SHUTDOWN, SHUTDISABLED or SHUTENABLED",
      ctx.SHUTDOWN(),
      ctx.SHUTDISABLED(),
      ctx.SHUTENABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "STATUS, DISABLED or ENABLED",
      ctx.STATUS(),
      ctx.DISABLED(),
      ctx.ENABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "TCLASS or TRANCLASS",
      ctx.TCLASS(),
      ctx.TRANCLASS(),
    );
    this.checkMutuallyExclusiveOptions(
      "TRACING, SPECTRACE, SPRSTRACE or STANTRACE",
      ctx.TRACING(),
      ctx.SPECTRACE(),
      ctx.SPRSTRACE(),
      ctx.STANTRACE(),
    );
  }

  private checkTsqueue(ctx: Cics_set_tsqueueContext) {
    this.checkHasExactlyOneOption(
      "TSQUEUE or TSQNAME",
      ctx,
      ctx.TSQUEUE(),
      ctx.TSQNAME(),
    );
    this.checkMutuallyExclusiveOptions(
      "SYSID or POOLNAME",
      ctx.SYSID(),
      ctx.POOLNAME(),
    );
    this.checkPrerequisiteIsMet(
      ctx.ACTION(),
      ctx.LASTUSEDINT(),
      ctx,
      "LASTUSEDINT without ACTION",
    );
  }

  private checkUow(ctx: Cics_set_uowContext) {
    this.checkHasMandatoryOptions(ctx.UOW(), ctx, "UOW");
    this.checkMutuallyExclusiveOptions(
      "UOWSTATE, COMMIT, BACKOUT or FORCE",
      ctx.UOWSTATE(),
      ctx.COMMIT(),
      ctx.BACKOUT(),
      ctx.FORCE(),
    );
  }

  private checkUowlink(ctx: Cics_set_uowlinkContext) {
    this.checkHasMandatoryOptions(ctx.UOWLINK(), ctx, "UOWLINK");
    this.checkMutuallyExclusiveOptions(
      "ACTION or DELETE",
      ctx.ACTION(),
      ctx.DELETE(),
    );
  }

  private checkUrimap(ctx: Cics_set_urimapContext) {
    this.checkHasMandatoryOptions(ctx.URIMAP(), ctx, "URIMAP");
    this.checkMutuallyExclusiveOptions(
      "ENABLESTATUS, DISABLED or ENABLED",
      ctx.ENABLESTATUS(),
      ctx.DISABLED(),
      ctx.ENABLED(),
    );
    this.checkMutuallyExclusiveOptions(
      "REDIRECTTYPE, NONE, PERMANENT or TEMPORARY",
      ctx.REDIRECTTYPE(),
      ctx.NONE(),
      ctx.PERMANENT(),
      ctx.TEMPORARY(),
    );
  }

  private checkVolume(ctx: Cics_set_volumeContext) {
    this.checkHasMandatoryOptions(ctx.VOLUME(), ctx, "VOLUME");
    this.checkHasObsoleteOptions(ctx.VOLUME(), ctx, "VOLUME");
    if (ctx.JRNL().length !== 0) {
      this.checkHasExactlyOneOption(
        "ACTION or ADD",
        ctx,
        ctx.ACTION(),
        ctx.ADD(),
      );
    }
    this.checkMutuallyExclusiveOptions(
      "ACTION, ADD or REMOVE",
      ctx.ACTION(),
      ctx.ADD(),
      ctx.REMOVE(),
    );
    this.checkMutuallyExclusiveOptions(
      "AVAIL, OK or NOWRITE",
      ctx.AVAIL(),
      ctx.OK(),
      ctx.NOWRITE(),
    );
    if (ctx.REMOVE().length !== 0) {
      this.checkHasIllegalOptions(ctx.JRNL(), "JRNL");
      this.checkHasIllegalOptions(ctx.AVAIL(), "AVAIL");
      this.checkHasIllegalOptions(ctx.OK(), "OK");
      this.checkHasIllegalOptions(ctx.NOWRITE(), "NOWRITE");
    }
  }

  private checkVtam(ctx: Cics_set_vtamContext) {
    this.checkHasMandatoryOptions(ctx.VTAM(), ctx, "VTAM");
    this.checkMutuallyExclusiveOptions(
      "OPENSTATUS, CLOSED, FORCECLOSE, IMMCLOSE or OPEN",
      ctx.OPENSTATUS(),
      ctx.CLOSED(),
      ctx.FORCECLOSE(),
      ctx.IMMCLOSE(),
      ctx.OPEN(),
    );
    this.checkMutuallyExclusiveOptions(
      "PSDINTERVAL or PSDINTHRS",
      ctx.PSDINTERVAL(),
      ctx.PSDINTHRS(),
    );
    this.checkMutuallyExclusiveOptions(
      "PSDINTERVAL or PSDINTMINS",
      ctx.PSDINTERVAL(),
      ctx.PSDINTMINS(),
    );
    this.checkMutuallyExclusiveOptions(
      "PSDINTERVAL or PSDINTSECS",
      ctx.PSDINTERVAL(),
      ctx.PSDINTSECS(),
    );
  }

  private checkWeb(ctx: Cics_set_webContext) {
    this.checkHasMandatoryOptions(ctx.WEB(), ctx, "WEB");
  }

  private checkWebservice(ctx: Cics_set_webserviceContext) {
    this.checkHasMandatoryOptions(ctx.WEBSERVICE(), ctx, "WEBSERVICE");
    this.checkMutuallyExclusiveOptions(
      "VALIDATIONST, VALIDATION or NOVALIDATION",
      ctx.VALIDATIONST(),
      ctx.VALIDATION(),
      ctx.NOVALIDATION(),
    );
  }

  private checkWlmhealth(ctx: Cics_set_wlmhealthContext) {
    this.checkHasMandatoryOptions(ctx.WLMHEALTH(), ctx, "WLMHEALTH");
    this.checkMutuallyExclusiveOptions(
      "ADJUSTMENT, INTERVAL or OPENSTATUS",
      ctx.ADJUSTMENT(),
      ctx.INTERVAL(),
      ctx.OPENSTATUS(),
    );
  }

  private checkXmltransform(ctx: Cics_set_xmltransformContext) {
    this.checkHasMandatoryOptions(ctx.XMLTRANSFORM(), ctx, "XMLTRANSFORM");
    this.checkMutuallyExclusiveOptions(
      "VALIDATIONST, VALIDATION or NOVALIDATION",
      ctx.VALIDATIONST(),
      ctx.VALIDATION(),
      ctx.NOVALIDATION(),
    );
  }
}
