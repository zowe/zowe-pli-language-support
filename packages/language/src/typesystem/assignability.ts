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
import { TypeDescriptions } from "./descriptions";

export function isAssignableTo(
  source: TypeDescriptions.Any,
  target: TypeDescriptions.Any,
): boolean {
  if (
    TypeDescriptions.isUnknown(source) ||
    TypeDescriptions.isUnknown(target)
  ) {
    return TypeDescriptions.isUnknown(source);
  }
  if (
    TypeDescriptions.isArithmetic(source) &&
    TypeDescriptions.isArithmetic(target)
  ) {
    return true;
  }
  //TODO implement assignability check
  return false;
}
