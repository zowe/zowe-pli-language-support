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
import { CICSParser } from "../generated/CICSParser";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { CICSLexer } from "../generated/CICSLexer";
import { ParserRuleContext } from "antlr4ng";

export class AssignOptionsChecker extends CICSOptionsCheckerBase {
  public static readonly RULE_INDEX = CICSParser.RULE_cics_assign;

  private static readonly DUPLICATE_CHECK_OPTIONS = new Map<number, Severity>([
    [CICSLexer.ABCODE, Severity.Error],
    [CICSLexer.ABDUMP, Severity.Error],
    [CICSLexer.ABOFFSET, Severity.Error],
    [CICSLexer.ABPROGRAM, Severity.Error],
    [CICSLexer.ACTIVITY, Severity.Error],
    [CICSLexer.ACTIVITYID, Severity.Error],
    [CICSLexer.ALTSCRNHT, Severity.Error],
    [CICSLexer.ALTSCRNWD, Severity.Error],
    [CICSLexer.APLKYBD, Severity.Error],
    [CICSLexer.APLTEXT, Severity.Error],
    [CICSLexer.APPLICATION, Severity.Error],
    [CICSLexer.APPLID, Severity.Error],
    [CICSLexer.ASRAINTRPT, Severity.Error],
    [CICSLexer.ASRAKEY, Severity.Error],
    [CICSLexer.ASRAPSW, Severity.Error],
    [CICSLexer.ASRAPSW16, Severity.Error],
    [CICSLexer.ASRAREGS, Severity.Error],
    [CICSLexer.ASRAREGS64, Severity.Error],
    [CICSLexer.BRIDGE, Severity.Error],
    [CICSLexer.BTRANS, Severity.Error],
    [CICSLexer.CHANNEL, Severity.Error],
    [CICSLexer.CMDSEC, Severity.Error],
    [CICSLexer.COLOR, Severity.Error],
    [CICSLexer.CWALENG, Severity.Error],
    [CICSLexer.DEFSCRNHT, Severity.Error],
    [CICSLexer.DEFSCRNWD, Severity.Error],
    [CICSLexer.DESTCOUNT, Severity.Error],
    [CICSLexer.DESTID, Severity.Error],
    [CICSLexer.DESTIDLENG, Severity.Error],
    [CICSLexer.ERRORMSG, Severity.Error],
    [CICSLexer.ERRORMSGLEN, Severity.Error],
    [CICSLexer.EWASUPP, Severity.Error],
    [CICSLexer.FCI, Severity.Error],
    [CICSLexer.GMMI, Severity.Error],
    [CICSLexer.GMEXITOPT, Severity.Error],
    [CICSLexer.HILIGHT, Severity.Error],
    [CICSLexer.INITPARM, Severity.Error],
    [CICSLexer.INITPARMLEN, Severity.Error],
    [CICSLexer.INPARTN, Severity.Error],
    [CICSLexer.INPUTMSGLEN, Severity.Error],
    [CICSLexer.INVOKINGPROG, Severity.Error],
    [CICSLexer.KATAKANA, Severity.Error],
    [CICSLexer.LANGINUSE, Severity.Error],
    [CICSLexer.LDCMNEM, Severity.Error],
    [CICSLexer.LDCNUM, Severity.Error],
    [CICSLexer.LINKLEVEL, Severity.Error],
    [CICSLexer.LOCALCCSID, Severity.Error],
    [CICSLexer.MAJORVERSION, Severity.Error],
    [CICSLexer.MAPCOLUMN, Severity.Error],
    [CICSLexer.MAPHEIGHT, Severity.Error],
    // cics_assign_parameter2
    [CICSLexer.MAPLINE, Severity.Error],
    [CICSLexer.MAPWIDTH, Severity.Error],
    [CICSLexer.MICROVERSION, Severity.Error],
    [CICSLexer.MINORVERSION, Severity.Error],
    [CICSLexer.MSRCONTROL, Severity.Error],
    [CICSLexer.NATLANGINUSE, Severity.Error],
    [CICSLexer.NETNAME, Severity.Error],
    [CICSLexer.NEXTTRANSID, Severity.Error],
    [CICSLexer.NUMTAB, Severity.Error],
    [CICSLexer.OPCLASS, Severity.Error],
    [CICSLexer.OPERATION, Severity.Error],
    [CICSLexer.OPERKEYS, Severity.Error],
    [CICSLexer.OPID, Severity.Error],
    [CICSLexer.OPSECURITY, Severity.Error],
    [CICSLexer.ORGABCODE, Severity.Error],
    [CICSLexer.OUTLINE, Severity.Error],
    [CICSLexer.PAGENUM, Severity.Error],
    [CICSLexer.PARTNPAGE, Severity.Error],
    [CICSLexer.PARTNS, Severity.Error],
    [CICSLexer.PARTNSET, Severity.Error],
    [CICSLexer.PLATFORM, Severity.Error],
    [CICSLexer.PRINSYSID, Severity.Error],
    [CICSLexer.PROCESS, Severity.Error],
    [CICSLexer.PROCESSTYPE, Severity.Error],
    [CICSLexer.PROGRAM, Severity.Error],
    [CICSLexer.PS, Severity.Error],
    [CICSLexer.QNAME, Severity.Error],
    [CICSLexer.RESSEC, Severity.Error],
    [CICSLexer.RESTART, Severity.Error],
    [CICSLexer.RETURNPROG, Severity.Error],
    [CICSLexer.SCRNHT, Severity.Error],
    [CICSLexer.SCRNWD, Severity.Error],
    [CICSLexer.SIGDATA, Severity.Error],
    [CICSLexer.SOSI, Severity.Error],
    [CICSLexer.STARTCODE, Severity.Error],
    [CICSLexer.STATIONID, Severity.Error],
    [CICSLexer.SYSID, Severity.Error],
    [CICSLexer.TASKPRIORITY, Severity.Error],
    [CICSLexer.TCTUALENG, Severity.Error],
    [CICSLexer.TELLERID, Severity.Error],
    [CICSLexer.TERMCODE, Severity.Error],
    [CICSLexer.TERMPRIORITY, Severity.Error],
    [CICSLexer.TEXTKYBD, Severity.Error],
    [CICSLexer.TEXTPRINT, Severity.Error],
    [CICSLexer.TNADDR, Severity.Error],
    [CICSLexer.TNIPFAMILY, Severity.Error],
    [CICSLexer.TNPORT, Severity.Error],
    [CICSLexer.TRANPRIORITY, Severity.Error],
    [CICSLexer.TWALENG, Severity.Error],
    [CICSLexer.UNATTEND, Severity.Error],
    [CICSLexer.USERID, Severity.Error],
    [CICSLexer.USERNAME, Severity.Error],
    [CICSLexer.USERPRIORITY, Severity.Error],
    [CICSLexer.VALIDATION, Severity.Error],
  ]);

  constructor(errors: Diagnostic[], params: CICSCheckUtilityParameters) {
    super(errors, AssignOptionsChecker.DUPLICATE_CHECK_OPTIONS, params);
  }

  /**
   * Entrypoint to check CICS Assign rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    this.checkDuplicates(ctx);
  }
}
