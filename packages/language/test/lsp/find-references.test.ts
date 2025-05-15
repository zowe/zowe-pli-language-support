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

import { describe, test } from "vitest";
import { expectReferences } from "../utils";

describe("Find references", () => {
  test("Can find references of qualified name variables on declaration", () =>
    expectReferences(`
 DCL 1 <|1><|1:A|>,
     2 <|2><|2:B|> CHAR(8) VALUE("B");
 PUT(<|2:B|>);
 PUT(<|1:A|>.<|2:B|>);`));

  test("Can find references of qualified name variables on reference #1", () =>
    expectReferences(`
 DCL 1 <|1:A|>,
     2 <|2><|2:B|> CHAR(8) VALUE("B");
 PUT(<|2:B|>);
 PUT(<|1:<|1>A|>.<|2:B|>);`));

  test("Can find references of qualified name variables on reference #2", () =>
    expectReferences(`
 DCL 1 <|1:A|>,
     2 <|2><|2:B|> CHAR(8) VALUE("B");
 PUT(<|2:B|>);
 PUT(<|1:A|><|1>.<|2:B|>);`));
});
