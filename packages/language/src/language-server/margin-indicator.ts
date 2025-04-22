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
import { TextDocument } from "vscode-languageserver-textdocument";

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
  uri: string,
  compilationUnit: CompilationUnit,
  textDocument: TextDocument,
) {
  let indicator: MarginIndicatorNotificationParams = {
    uri: uri,
    m: undefined,
    n: undefined,
  };

  if (compilationUnit) {
    if (compilationUnit.compilerOptions.margins) {
      indicator.m = compilationUnit.compilerOptions.margins.m;
      indicator.n = compilationUnit.compilerOptions.margins.n;
    } else {
      indicator.m = 2;
      indicator.n = 72;
    }
  }

  connection.sendNotification(MarginIndicatorNotification, indicator);
}
