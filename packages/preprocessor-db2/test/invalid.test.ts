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
import { Db2SqlPreprocessor } from "../src/engine/preprocessor";

describe("DB2 SQL invalid code", async () => {
    const preprocessor = new Db2SqlPreprocessor();

    test("INVALID", async () => {
        const { diagnostics } = await preprocessor.execute(`
           THIS IS INVALID CODE
       `);
        expect(diagnostics).toHaveLength(1);
        expect(diagnostics[0].message.startsWith("mismatched input 'THIS' expecting {ALLOCATE")).toBeTruthy();
    });

});
