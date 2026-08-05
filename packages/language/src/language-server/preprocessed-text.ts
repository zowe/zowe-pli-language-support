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

import { Connection } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { isVirtualFile } from "../utils/uri";
import { Messages, sendNotification } from "../utils/messages";

/**
 * Notifies the client that the preprocessed text of the given compilation unit
 * has changed, so any open preprocessed text views can refresh.
 */
export function notifyPreprocessedText(
  connection: Connection,
  compilationUnit: CompilationUnit,
) {
  if (isVirtualFile(compilationUnit.uri.toString())) {
    return;
  }

  const cached = compilationUnit.requestCaches.get("preprocessedText");
  if (cached !== compilationUnit.preprocessedText) {
    compilationUnit.requestCaches.set(
      "preprocessedText",
      compilationUnit.preprocessedText,
    );
    const uris = new Set(compilationUnit.services.files.keys());
    uris.add(compilationUnit.uri.toString());
    sendNotification(connection, Messages.PreprocessedTextChanged, {
      uris: [...uris],
    });
  }
}
