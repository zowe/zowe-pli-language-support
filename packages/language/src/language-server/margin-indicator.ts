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

import { Connection, NotificationType } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";

export interface MarginIndicatorNotificationParams {
  uri: string;
  m: number | undefined;
  n: number | undefined;
}

export const MarginIndicatorNotification =
  new NotificationType<MarginIndicatorNotificationParams>(
    "pli/marginIndicator",
  );

export function marginIndicator(
  connection: Connection,
  compilationUnit: CompilationUnit,
) {
  const margins = compilationUnit.compilerOptions.margins;
  const indicator: MarginIndicatorNotificationParams = {
    uri: compilationUnit.uri.toString(),
    m: margins ? margins.m : 2,
    n: margins ? margins.n : 72,
  };

  const cachedMargins = compilationUnit.requestCaches.get("margins");
  if (cachedMargins?.m !== indicator.m || cachedMargins?.n !== indicator.n) {
    compilationUnit.requestCaches.set("margins", indicator);
    connection.sendNotification(MarginIndicatorNotification, indicator);
  }
}
