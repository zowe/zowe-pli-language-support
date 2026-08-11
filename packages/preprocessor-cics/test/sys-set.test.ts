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
import { describe, expect, test } from "vitest";
import { CICSPreprocessor } from "../src/engine/preprocessor";
import { HostLanguageType } from "../src/engine/host-languages";
import { Severity } from "preprocessor-api";

describe("CICS SET (system programming)", () => {
  const cicsPreprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("Expecting EOF", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SET ATOMSERVICE(ATM) ENABLED BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkAtomservice -> checkMutuallyExclusiveOptions
  test("ATOMSERVICE ENABLED and DISABLED mutually exclusive", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SET ATOMSERVICE(ATM) ENABLED DISABLED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "ENABLESTATUS, ENABLED or DISABLED" are mutually exclusive/,
    );
  });

  // checkFile -> checkMutuallyExclusiveOptions(OPEN or CLOSED)
  test("FILE OPEN and CLOSED mutually exclusive", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET FILE(FL) OPEN CLOSED");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "OPEN or CLOSED" are mutually exclusive/,
    );
  });

  // checkDuplicates
  test("Duplicated ATOMSERVICE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SET ATOMSERVICE(ATM) ATOMSERVICE(AT2) ENABLED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ATOMSERVICE/,
    );
  });

  // ASSOCIATION (missing USERCORRDATA)
  test("ASSOCIATION (missing USERCORRDATA)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET ASSOCIATION");
    expect(diagnostics).toHaveLength(1);
  });
  // ATOMSERVICE
  test("ATOMSERVICE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET ATOMSERVICE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // AUTOINSTALL
  test("AUTOINSTALL", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET AUTOINSTALL");
    expect(diagnostics).toHaveLength(0);
  });
  // BRFACILITY
  test("BRFACILITY", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET BRFACILITY(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // BUNDLE
  test("BUNDLE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET BUNDLE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // CONNECTION
  test("CONNECTION", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET CONNECTION(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DB2CONN
  test("DB2CONN", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DB2CONN");
    expect(diagnostics).toHaveLength(0);
  });
  // DB2ENTRY
  test("DB2ENTRY", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DB2ENTRY(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DB2TRAN
  test("DB2TRAN", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DB2TRAN(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DELETSHIPPED
  test("DELETSHIPPED", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DELETSHIPPED");
    expect(diagnostics).toHaveLength(0);
  });
  // DISPATCHER
  test("DISPATCHER", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SET DISPATCHER MAXOPENTCBS(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // DOCTEMPLATE (missing COPY/NEWCOPY)
  test("DOCTEMPLATE (missing COPY/NEWCOPY)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DOCTEMPLATE(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // DSNAME
  test("DSNAME", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DSNAME(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DUMPDS
  test("DUMPDS", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET DUMPDS");
    expect(diagnostics).toHaveLength(0);
  });
  // ENQMODEL
  test("ENQMODEL", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET ENQMODEL(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // EPADAPTER
  test("EPADAPTER", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET EPADAPTER(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // EPADAPTERSET
  test("EPADAPTERSET", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET EPADAPTERSET(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // EVENTBINDING
  test("EVENTBINDING", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET EVENTBINDING(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // EVENTPROCESS
  test("EVENTPROCESS", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET EVENTPROCESS");
    expect(diagnostics).toHaveLength(0);
  });
  // FILE
  test("FILE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET FILE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // HOST
  test("HOST", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET HOST(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // IPCONN
  test("IPCONN", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET IPCONN(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // IRC
  test("IRC", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET IRC");
    expect(diagnostics).toHaveLength(0);
  });
  // JOURNALNAME
  test("JOURNALNAME", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET JOURNALNAME(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // JOURNALNUM (obsolete)
  test("JOURNALNUM (obsolete)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET JOURNALNUM(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // JVMENDPOINT (missing JVMSERVER)
  test("JVMENDPOINT (missing JVMSERVER)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET JVMENDPOINT(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // JVMSERVER
  test("JVMSERVER", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET JVMSERVER(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // LIBRARY
  test("LIBRARY", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET LIBRARY(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // MODENAME (missing CONNECTION)
  test("MODENAME (missing CONNECTION)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET MODENAME(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // MONITOR
  test("MONITOR", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET MONITOR FREQUENCY(5)");
    expect(diagnostics).toHaveLength(0);
  });
  // MQCONN
  test("MQCONN", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET MQCONN");
    expect(diagnostics).toHaveLength(0);
  });
  // MQMONITOR
  test("MQMONITOR", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET MQMONITOR(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // NETNAME
  test("NETNAME", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET NETNAME(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // OTEL
  test("OTEL", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET OTEL");
    expect(diagnostics).toHaveLength(0);
  });
  // PIPELINE
  test("PIPELINE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET PIPELINE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // PROCESSTYPE
  test("PROCESSTYPE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET PROCESSTYPE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // PROGRAM
  test("PROGRAM", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET PROGRAM(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // SECDISCOVERY
  test("SECDISCOVERY", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET SECDISCOVERY");
    expect(diagnostics).toHaveLength(0);
  });
  // SECRECORDING (missing ACTION/ADD/MODIFY/REMOVE)
  test("SECRECORDING (missing ACTION/ADD/MODIFY/REMOVE)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET SECRECORDING(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // STATISTICS
  test("STATISTICS", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SET STATISTICS INTERVAL(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // SYSDUMPCODE
  test("SYSDUMPCODE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET SYSDUMPCODE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // SYSTEM
  test("SYSTEM", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET SYSTEM");
    expect(diagnostics).toHaveLength(0);
  });
  // TAGS (missing REFRESH)
  test("TAGS (missing REFRESH)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TAGS");
    expect(diagnostics).toHaveLength(1);
  });
  // TASK
  test("TASK", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TASK(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TCLASS
  test("TCLASS", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TCLASS(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TCPIP
  test("TCPIP", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TCPIP");
    expect(diagnostics).toHaveLength(0);
  });
  // TCPIPSERVICE
  test("TCPIPSERVICE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TCPIPSERVICE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TDQUEUE
  test("TDQUEUE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TDQUEUE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TEMPSTORAGE
  test("TEMPSTORAGE", () => {
    const { diagnostics } = cicsPreprocessor.parse(
      "SET TEMPSTORAGE TSMAINLIMIT(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // TERMINAL
  test("TERMINAL", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TERMINAL(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TRACEDEST
  test("TRACEDEST", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TRACEDEST");
    expect(diagnostics).toHaveLength(0);
  });
  // TRACEFLAG
  test("TRACEFLAG", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TRACEFLAG");
    expect(diagnostics).toHaveLength(0);
  });
  // TRACETYPE (missing FLAGSET/SPECIAL/STANDARD)
  test("TRACETYPE (missing FLAGSET/SPECIAL/STANDARD)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TRACETYPE");
    expect(diagnostics).toHaveLength(1);
  });
  // TRANCLASS
  test("TRANCLASS", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TRANCLASS(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TRANDUMPCODE
  test("TRANDUMPCODE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TRANDUMPCODE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TRANSACTION
  test("TRANSACTION", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TRANSACTION(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TSQUEUE
  test("TSQUEUE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET TSQUEUE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // UOW
  test("UOW", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET UOW(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // UOWLINK
  test("UOWLINK", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET UOWLINK(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // URIMAP
  test("URIMAP", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET URIMAP(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // VOLUME (obsolete)
  test("VOLUME (obsolete)", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET VOLUME(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // VTAM
  test("VTAM", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET VTAM");
    expect(diagnostics).toHaveLength(0);
  });
  // WEB
  test("WEB", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET WEB GARBAGEINT(5)");
    expect(diagnostics).toHaveLength(0);
  });
  // WEBSERVICE
  test("WEBSERVICE", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET WEBSERVICE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // WLMHEALTH
  test("WLMHEALTH", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET WLMHEALTH");
    expect(diagnostics).toHaveLength(0);
  });
  // XMLTRANSFORM
  test("XMLTRANSFORM", () => {
    const { diagnostics } = cicsPreprocessor.parse("SET XMLTRANSFORM(VV)");
    expect(diagnostics).toHaveLength(0);
  });
});
