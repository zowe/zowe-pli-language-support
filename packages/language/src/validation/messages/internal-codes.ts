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

import { ParametricPLICode } from "./pli-codes";

export const Internal = {
  DiagnosticURIMismatch: {
    code: "_TB0001", // TestBuilder diagnostic code
    severity: "E",
    message: (label: string, file: string, uri: string) =>
      `Expected diagnostic at label "${label}" to be in file "${file}" but received: ${uri}`,
    fullCode: "_TB0001E",
  } as ParametricPLICode,
};
