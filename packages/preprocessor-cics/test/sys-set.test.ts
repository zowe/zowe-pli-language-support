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
import { CICSForPLIPreprocessor } from "../src/engine/preprocessor";
import { Severity } from "preprocessor-api";

describe("CICS SET (system programming)", async () => {
  const cicsPreprocessor = new CICSForPLIPreprocessor();

  test("Expecting EOF", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ENABLED BLA",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toMatch("Extraneous input BLA");
  });

  // checkAtomservice -> checkMutuallyExclusiveOptions
  test("ATOMSERVICE ENABLED and DISABLED mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ENABLED DISABLED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "ENABLESTATUS, ENABLED or DISABLED" are mutually exclusive/,
    );
  });

  // checkFile -> checkMutuallyExclusiveOptions(OPEN or CLOSED)
  test("FILE OPEN and CLOSED mutually exclusive", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET FILE(FL) OPEN CLOSED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Options "OPEN or CLOSED" are mutually exclusive/,
    );
  });

  // checkDuplicates
  test("Duplicated ATOMSERVICE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(ATM) ATOMSERVICE(AT2) ENABLED",
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.Error);
    expect(diagnostics[0].message).toMatch(
      /Excessive options provided for: ATOMSERVICE/,
    );
  });

  // ASSOCIATION (missing USERCORRDATA)
  test("ASSOCIATION (missing USERCORRDATA)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET ASSOCIATION");
    expect(diagnostics).toHaveLength(1);
  });
  // ATOMSERVICE
  test("ATOMSERVICE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET ATOMSERVICE(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // AUTOINSTALL
  test("AUTOINSTALL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET AUTOINSTALL");
    expect(diagnostics).toHaveLength(0);
  });
  // BRFACILITY
  test("BRFACILITY", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("SET BRFACILITY(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // BUNDLE
  test("BUNDLE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET BUNDLE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // CONNECTION
  test("CONNECTION", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("SET CONNECTION(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DB2CONN
  test("DB2CONN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET DB2CONN");
    expect(diagnostics).toHaveLength(0);
  });
  // DB2ENTRY
  test("DB2ENTRY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET DB2ENTRY(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DB2TRAN
  test("DB2TRAN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET DB2TRAN(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DELETSHIPPED
  test("DELETSHIPPED", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET DELETSHIPPED");
    expect(diagnostics).toHaveLength(0);
  });
  // DISPATCHER
  test("DISPATCHER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET DISPATCHER MAXOPENTCBS(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // DOCTEMPLATE (missing COPY/NEWCOPY)
  test("DOCTEMPLATE (missing COPY/NEWCOPY)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET DOCTEMPLATE(VV)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  // DSNAME
  test("DSNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET DSNAME(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // DUMPDS
  test("DUMPDS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET DUMPDS");
    expect(diagnostics).toHaveLength(0);
  });
  // ENQMODEL
  test("ENQMODEL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET ENQMODEL(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // EPADAPTER
  test("EPADAPTER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET EPADAPTER(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // EPADAPTERSET
  test("EPADAPTERSET", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET EPADAPTERSET(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // EVENTBINDING
  test("EVENTBINDING", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET EVENTBINDING(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // EVENTPROCESS
  test("EVENTPROCESS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET EVENTPROCESS");
    expect(diagnostics).toHaveLength(0);
  });
  // FILE
  test("FILE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET FILE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // HOST
  test("HOST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET HOST(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // IPCONN
  test("IPCONN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET IPCONN(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // IRC
  test("IRC", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET IRC");
    expect(diagnostics).toHaveLength(0);
  });
  // JOURNALNAME
  test("JOURNALNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET JOURNALNAME(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // JOURNALNUM (obsolete)
  test("JOURNALNUM (obsolete)", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("SET JOURNALNUM(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // JVMENDPOINT (missing JVMSERVER)
  test("JVMENDPOINT (missing JVMSERVER)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET JVMENDPOINT(VV)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  // JVMSERVER
  test("JVMSERVER", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET JVMSERVER(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // LIBRARY
  test("LIBRARY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET LIBRARY(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // MODENAME (missing CONNECTION)
  test("MODENAME (missing CONNECTION)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET MODENAME(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // MONITOR
  test("MONITOR", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET MONITOR FREQUENCY(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // MQCONN
  test("MQCONN", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET MQCONN");
    expect(diagnostics).toHaveLength(0);
  });
  // MQMONITOR
  test("MQMONITOR", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET MQMONITOR(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // NETNAME
  test("NETNAME", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET NETNAME(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // OTEL
  test("OTEL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET OTEL");
    expect(diagnostics).toHaveLength(0);
  });
  // PIPELINE
  test("PIPELINE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET PIPELINE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // PROCESSTYPE
  test("PROCESSTYPE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET PROCESSTYPE(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // PROGRAM
  test("PROGRAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET PROGRAM(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // SECDISCOVERY
  test("SECDISCOVERY", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET SECDISCOVERY");
    expect(diagnostics).toHaveLength(0);
  });
  // SECRECORDING (missing ACTION/ADD/MODIFY/REMOVE)
  test("SECRECORDING (missing ACTION/ADD/MODIFY/REMOVE)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET SECRECORDING(VV)",
    );
    expect(diagnostics).toHaveLength(1);
  });
  // STATISTICS
  test("STATISTICS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET STATISTICS INTERVAL(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // SYSDUMPCODE
  test("SYSDUMPCODE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET SYSDUMPCODE(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // SYSTEM
  test("SYSTEM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET SYSTEM");
    expect(diagnostics).toHaveLength(0);
  });
  // TAGS (missing REFRESH)
  test("TAGS (missing REFRESH)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TAGS");
    expect(diagnostics).toHaveLength(1);
  });
  // TASK
  test("TASK", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TASK(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TCLASS
  test("TCLASS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TCLASS(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TCPIP
  test("TCPIP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TCPIP");
    expect(diagnostics).toHaveLength(0);
  });
  // TCPIPSERVICE
  test("TCPIPSERVICE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET TCPIPSERVICE(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // TDQUEUE
  test("TDQUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TDQUEUE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TEMPSTORAGE
  test("TEMPSTORAGE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET TEMPSTORAGE TSMAINLIMIT(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // TERMINAL
  test("TERMINAL", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TERMINAL(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TRACEDEST
  test("TRACEDEST", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TRACEDEST");
    expect(diagnostics).toHaveLength(0);
  });
  // TRACEFLAG
  test("TRACEFLAG", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TRACEFLAG");
    expect(diagnostics).toHaveLength(0);
  });
  // TRACETYPE (missing FLAGSET/SPECIAL/STANDARD)
  test("TRACETYPE (missing FLAGSET/SPECIAL/STANDARD)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TRACETYPE");
    expect(diagnostics).toHaveLength(1);
  });
  // TRANCLASS
  test("TRANCLASS", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TRANCLASS(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // TRANDUMPCODE
  test("TRANDUMPCODE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET TRANDUMPCODE(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // TRANSACTION
  test("TRANSACTION", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET TRANSACTION(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // TSQUEUE
  test("TSQUEUE", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET TSQUEUE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // UOW
  test("UOW", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET UOW(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // UOWLINK
  test("UOWLINK", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET UOWLINK(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // URIMAP
  test("URIMAP", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET URIMAP(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // VOLUME (obsolete)
  test("VOLUME (obsolete)", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET VOLUME(VV)");
    expect(diagnostics).toHaveLength(1);
  });
  // VTAM
  test("VTAM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET VTAM");
    expect(diagnostics).toHaveLength(0);
  });
  // WEB
  test("WEB", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET WEB GARBAGEINT(5)",
    );
    expect(diagnostics).toHaveLength(0);
  });
  // WEBSERVICE
  test("WEBSERVICE", async () => {
    const { diagnostics } =
      await cicsPreprocessor.execute("SET WEBSERVICE(VV)");
    expect(diagnostics).toHaveLength(0);
  });
  // WLMHEALTH
  test("WLMHEALTH", async () => {
    const { diagnostics } = await cicsPreprocessor.execute("SET WLMHEALTH");
    expect(diagnostics).toHaveLength(0);
  });
  // XMLTRANSFORM
  test("XMLTRANSFORM", async () => {
    const { diagnostics } = await cicsPreprocessor.execute(
      "SET XMLTRANSFORM(VV)",
    );
    expect(diagnostics).toHaveLength(0);
  });
});
