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
import { TextDocument } from "vscode-languageserver-textdocument";
import { CompilationUnit } from "../../workspace/compilation-unit";

const DEFAULT_LINE_CUTOFF = 100;

export function getFileContentPreview(
  unit: CompilationUnit,
  key: string,
  document: TextDocument,
  lineCutoff = DEFAULT_LINE_CUTOFF,
) {
  const partialContent = unit.services.includeCache.get(key);
  if (partialContent) {
    return partialContent;
  }
  // load up the first (LINE_CUTOFF) lines of content from the file (semi-arbitrary cutoff)
  const fileContent = document.getText({
    start: { line: 0, character: 0 },
    end: { line: lineCutoff, character: 0 },
  });
  const partialContentText =
    document.getText().length > fileContent.length
      ? fileContent + "\n...\n"
      : fileContent;

  unit.services.includeCache.set(key, partialContentText);
  return partialContentText;
}
