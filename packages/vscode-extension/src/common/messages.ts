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

import { FileType, Stats, createRequestType } from "pli-language";

export namespace Messages {
  export const ReadDir = createRequestType<string, [string, FileType][]>(
    "fs/readDir",
  );
  export const ReadFile = createRequestType<string, string>("fs/readFile");
  export const WriteFile = createRequestType<[string, string], void>(
    "fs/writeFile",
  );
  export const FileExists = createRequestType<string, boolean>("fs/fileExists");
  export const FindFile = createRequestType<
    {
      path: string;
      extensions: string[];
    },
    string
  >("fs/findFile");
  export const Stat = createRequestType<string, Stats>("fs/stat");
}
