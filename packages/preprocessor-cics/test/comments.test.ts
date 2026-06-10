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
import { CICSForCOBOLPreprocessor, CICSForPLIPreprocessor } from "../src/engine/preprocessor";

describe("CICS Comments", async () => {
    test("PL/I multiline comment in PL/I setup", async () => {
        const preprocessor = new CICSForPLIPreprocessor();
        const { diagnostics } = await preprocessor.execute("/* This is a PL/I comment */ ABEND ABCODE(12)")
        expect(diagnostics).toHaveLength(0);
    });
    test("PL/I line comment in PL/I setup", async () => {
        const preprocessor = new CICSForPLIPreprocessor();
        const { diagnostics } = await preprocessor.execute("ABEND ABCODE(12) // This is a PL/I comment")
        expect(diagnostics).toHaveLength(0);
    });
     test("COBOL comment in PL/I setup", async () => {
        const preprocessor = new CICSForPLIPreprocessor();
        const { diagnostics } = await preprocessor.execute("ABEND ABCODE(12) *> This is a COBOL comment")
        expect(diagnostics).toHaveLength(1);
    });

    test("PL/I multiline comment in COBOL setup", async () => {
        const preprocessor = new CICSForCOBOLPreprocessor();
        const { diagnostics } = await preprocessor.execute("/* This is a PL/I comment */ ABEND ABCODE(12)")
        expect(diagnostics).toHaveLength(1);
    });
    test("PL/I line comment in COBOL setup", async () => {
        const preprocessor = new CICSForCOBOLPreprocessor();
        const { diagnostics } = await preprocessor.execute("ABEND ABCODE(12) // This is a PL/I comment")
        expect(diagnostics).toHaveLength(1);
    });
     test("COBOL comment in COBOL setup", async () => {
        const preprocessor = new CICSForCOBOLPreprocessor();
        const { diagnostics } = await preprocessor.execute("ABEND ABCODE(12) *> This is a COBOL comment")
        expect(diagnostics).toHaveLength(0);
    });
});
