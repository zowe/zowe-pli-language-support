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
import { SemanticsKind } from "preprocessor-api";

describe("DB2 SQL analysis disabled", async () => {
    const preprocessor = new Db2SqlPreprocessor();

    test("UPDATE_SQL_EN|DISABLED", async () => {
        const { diagnostics, tokens } = await preprocessor.execute(`
          UPDATE EMP1
          SET SALARY = SALARY + 1000,
          RESUME = UPDATE_RESUME(:HV_RESUME)
          WHERE EMP_ROWID = :HV_EMP_ROWID
       `);
        expect(diagnostics).toHaveLength(0);
        expect(tokens.find(t => t.semanticsKind === SemanticsKind.Identifier && t.image === "HV_RESUME")).toBeTruthy();
        expect(tokens.find(t => t.semanticsKind === SemanticsKind.Identifier && t.image === "HV_EMP_ROWID")).toBeTruthy();
    });

});
