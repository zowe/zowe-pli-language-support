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

import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { parseHelper } from "langium/test";
import type { PliProgram } from "pl-one-language";
import { createPliServices } from "pl-one-language";

let services: ReturnType<typeof createPliServices>;
let parse:    ReturnType<typeof parseHelper<PliProgram>>;
let parseStmts: ReturnType<typeof parseHelper<PliProgram>>;

beforeAll(async () => {
    services = createPliServices(EmptyFileSystem);
    parse = parseHelper<PliProgram>(services.pli);

    /**
     * Helper function to parse a string of PL/I statements,
     * wrapping them in a procedure to ensure they are valid
     */
    parseStmts = (input: string) => {
        return parse(` STARTPR: PROCEDURE OPTIONS (MAIN);
${input}
 end STARTPR;`);
    }

    // activate the following if your linking test requires elements from a built-in library, for example
    await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Linking tests', () => {
    test('linking of greetings', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`;`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });
});