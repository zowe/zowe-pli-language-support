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

import { CompilationUnit } from "../workspace/compilation-unit";

export function getSymbolName(unit: CompilationUnit, name: string) {
  const cse = unit.compilerOptions.case ?? "UPPER";

  switch (cse) {
    case "UPPER":
      return name.toUpperCase();
    case "ASIS":
    default:
      return name;
  }
}
