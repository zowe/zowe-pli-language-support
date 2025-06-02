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

import { PLICodes } from "../../src/validation/messages";
import { TestBuilder } from "../test-builder";
import { HarnessTesterInterface } from "./harness-interface";

/**
 * Create a harness implementation that can be used to run the harness test.
 *
 * @param testBuilder - The test builder to use to verify the harness test.
 * @returns A harness implementation that can be used to run the harness test.
 */
export function createHarnessImplementation(
  testBuilder: TestBuilder,
): HarnessTesterInterface {
  return {
    linker: {
      expectLinks: () => testBuilder.expectLinks(),
      expectNoLinksAt: (label: string | number) =>
        testBuilder.expectNoLinksAt(label.toString()),
    },
    verify: {
      expectExclusiveErrorCodesAt: (
        label: string | number,
        codes: string[] | string,
      ) => testBuilder.expectExclusiveErrorCodesAt(label.toString(), codes),
    },
    code: {
      Severe: PLICodes.Severe,
      Warning: PLICodes.Warning,
      Information: PLICodes.Info,
      Error: PLICodes.Error,
    },
  };
}
