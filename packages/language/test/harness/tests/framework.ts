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

import { PLICodes } from "../../../src/validation/messages";

declare namespace HarnessTesterInterface {
  class verify {
    expectExclusiveErrorCodesAt(
      label: string | number,
      codes: string[] | string,
    ): void;
  }

  class linker {
    /**
     * Expect that the defined links actually links to the correct target.
     */
    expectLinks(): void;
    /**
     * Expect that the defined links do not link to the given label.
     */
    expectNoLinksAt(label: string | number): void;
  }

  class code {
    Severe: typeof PLICodes.Severe;
    Warning: typeof PLICodes.Warning;
    Information: typeof PLICodes.Info;
    Error: typeof PLICodes.Error;
  }
}

declare global {
  var verify: HarnessTesterInterface.verify;
  var linker: HarnessTesterInterface.linker;
  var code: HarnessTesterInterface.code; // Declare 'code' as a global variable.
}
