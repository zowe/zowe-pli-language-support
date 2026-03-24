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

export const UnnamedFile = Symbol("UnnamedFile");
export type UnnamedFile = typeof UnnamedFile;

export enum HarnessTestMode {
  Normal = "",
  Todo = ".todo.",
  Skip = ".skip.",
  Fail = ".fail.",
}

export function extractTestModeFromFileName(fileName: string): HarnessTestMode {
  const entries = Object.values(HarnessTestMode);
  for (const testMode of entries.filter((text) => text.includes("."))) {
    if (fileName.includes(testMode)) {
      return testMode;
    }
  }
  return HarnessTestMode.Normal;
}

export interface HarnessFile {
  fileName: string | undefined;
  wrap: string | undefined;
  content: string;
  tags: string[];

  /**
   * The line offset of the file, e.g. the number of lines to skip before the file content
   */
  lineOffset: number;

  /**
   * The general character offset of the file, e.g. the fourslash `////` prefix
   */
  characterOffset: number;
}

export interface HarnessTest {
  fileName: string;
  files: Map<string, HarnessFile>;
  commands: string;
  tags: string[];
}
