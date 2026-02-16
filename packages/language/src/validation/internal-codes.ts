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

import { Severity } from "../language-server/types";
import { PLICode, Error, Severe } from "./pli-codes";

export const InternalCodes = {
  DiagnosticURIMismatch: {
    code: "_TB0001", // TestBuilder diagnostic code
    severity: Severity.E,
    message: (label: string, file: string, uri: string) =>
      `Expected diagnostic at label "${label}" to be in file "${file}" but received: ${uri}`,
  },
  UnknownIdentifier: {
    code: "UNKNOWN_IDENTIFIER",
    severity: Severity.E,
    message: (name: string) => `Unknown identifier '${name}'`,
  },
};

export const TypeSystemCodes: PLICode[] = [
  Error.IBM1309I,
  Error.IBM2462I,
  Error.IBM2424I,
  Error.IBM1482I,
  Error.IBM1483I,
  Severe.IBM1629I,
];
