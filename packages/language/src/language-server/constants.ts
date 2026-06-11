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

export namespace PluginConfiguration {
  export const PROGRAM_FILE_PATH = ".pliplugin/pgm_conf.json";
  export const PROCESS_GROUP_FILE_PATH = ".pliplugin/proc_grps.json";
  export const DEFAULT_PROGRAM_FILE_CONTENT = {
    pgms: [
      {
        program: "*.pli",
        pgroup: "default",
      },
    ],
  };
  export const DEFAULT_PROCESS_GROUP_FILE_CONTENT = {
    pgroups: [
      {
        name: "default",
        "compiler-options": [],
        libs: ["cpy", "inc"],
        "member-name-validation": false,
        "include-extensions": [".pli", ".pl1", ".inc"],
        "lsp-options": {
          "check-margins": true,
        },
      },
    ],
  };
}

export namespace Commands {
  export const RESOLVE_INCLUDE = "pli.applyQuickFixResolveInclude";
  export const CREATE_CONFIG = "pli.applyQuickFixCreateConfig";
  export const REMOVE_DEAD_LIB = "pli.applyQuickFixRemoveUnresolvedLib";
}
