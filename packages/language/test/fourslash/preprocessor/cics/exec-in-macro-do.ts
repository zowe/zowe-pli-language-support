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

/// <reference path="../../framework.ts" />

//// TEST: PROC;
////   %DO;
////     EXEC CICS ABEND ABCODE('$CAN');
////   %END;
//// END;

// EXEC CICS inside a %DO block passes through the macro phase as plain text and is then
// processed by the CICS phase, generating the declarations and the DO; END; replacement.
preprocessor.expectTokens(`
TEST: PROC;
    DCL 
      1 DFHCNSTS STATIC,
        2 DFHLDVER CHAR(22) INIT('LD TABLE DFHEITAB 730.'),
        2 DFHEIB0 FIXED BIN(15) INIT(0),
        2 DFHEID0 FIXED DEC(7) INIT(0),
        2 DFHEICB CHAR(8) INIT('        ');
    DCL DFHEPI ENTRY, DFHEIPTR PTR;
    DCL 
      1 DFHEIBLK BASED (DFHEIPTR),
        2 EIBTIME  FIXED DEC(7),
        2 EIBDATE  FIXED DEC(7),
        2 EIBTRNID CHAR(4),
        2 EIBTASKN FIXED DEC(7),
        2 EIBTRMID CHAR(4),
        2 EIBFIL01 FIXED BIN(15),
        2 EIBCPOSN FIXED BIN(15),
        2 EIBCALEN FIXED BIN(15),
        2 EIBAID   CHAR(1),
        2 EIBFN    CHAR(2),
        2 EIBRCODE CHAR(6),
        2 EIBDS    CHAR(8),
        2 EIBREQID CHAR(8),
        2 EIBRSRCE CHAR(8),
        2 EIBSYNC  CHAR(1),
        2 EIBFREE  CHAR(1),
        2 EIBRECV  CHAR(1),
        2 EIBFIL02 CHAR(1),
        2 EIBATT   CHAR(1),
        2 EIBEOC   CHAR(1),
        2 EIBFMH   CHAR(1),
        2 EIBCOMPL CHAR(1),
        2 EIBSIG   CHAR(1),
        2 EIBCONF  CHAR(1),
        2 EIBERR   CHAR(1),
        2 EIBERRCD CHAR(4),
        2 EIBSYNRB CHAR(1),
        2 EIBNODAT CHAR(1),
        2 EIBRESP  FIXED BIN(31),
        2 EIBRESP2 FIXED BIN(31),
        2 EIBRLDBK CHAR(1);
    DCL 
      1 DFHCNTBS  STATIC,
        2  DFHLDTBS CHAR(22) INIT('LD TABLE DFHEITBS 730.');
    DCL DFHDUMMY STATIC FIXED BIN(15) INIT(0);
    DCL DFHEI0 ENTRY VARIABLE OPTIONS(INTER ASSEMBLER) INIT(DFHEI01) AUTO;
    DCL DFHEI01 ENTRY OPTIONS(INTER ASSEMBLER);

    DO; END;
END;
`);
