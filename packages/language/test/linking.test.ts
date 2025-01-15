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

import { beforeAll, describe, test } from "vitest";
import { EmptyFileSystem} from "langium";
import { ExpectedGoToDefinition, expectGoToDefinition } from "langium/test";
import { createPliServices } from "pl-one-language";

let services: ReturnType<typeof createPliServices>;
let gotoDefinition: ReturnType<typeof expectGoToDefinition>;

beforeAll(async () => {
    services = createPliServices(EmptyFileSystem);
    const _gotoDefinition = expectGoToDefinition(services.pli);

    /**
     * Helper function to parse a string of PL/I statements,
     * wrapping them in a procedure to ensure they are valid
     */
    gotoDefinition = (expectedGoToDefinition: ExpectedGoToDefinition) => {
        const text = ` STARTPR: PROCEDURE OPTIONS (MAIN);
${expectedGoToDefinition.text}
 end STARTPR;`;

        return _gotoDefinition({
            ...expectedGoToDefinition,
            text
        })
    }

    // activate the following if your linking test requires elements from a built-in library, for example
    await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Linking tests', () => {
    describe('Declarations', async () => {
        const text = `
 Control: procedure options(main);
  call <|>A('ok'); // invoke the 'A' subroutine
 end Control;
 <|A|>: procedure (VAR1);
 declare <|VAR1|> char(3);
 put skip list(V<|>AR1);
 end <|>A;`;

        test('Must find declared procedure label in CALL', async () => {
            await gotoDefinition({
                text: text,
                index: 0,
                rangeIndex: 0
            })
        });

        test('Must find declared procedure label in END', async () => {
            await gotoDefinition({
                text: text,
                index: 2,
                rangeIndex: 0
            })
        });

        test('Must find declared variable', async () => {
            await gotoDefinition({
                text: text,
                index: 1,
                rangeIndex: 1
            })
        });
    })
});