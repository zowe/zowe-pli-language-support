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
  export const CREATE_CONFIG = "pli.applyQuickFixCreateConfig";

  /**
   * Client-side command that saves a plugin config file after a quick fix edited it.
   */

  export const SAVE_FILES = "pli.saveFiles";

  /**
   * Client-side command that writes a user-scope plugin config for files with no workspace folder.
   */
  export const ENSURE_USER_CONFIG = "pli.ensureUserPluginConfig";

  /**
   * Client-side command to navigate from a .pli file to its program
   * configuration entry in pgm_conf.json or VS Code settings.
   */

  export const GO_TO_PROGRAM_CONFIG = "pli.goToProgramConfiguration";

  /**
   * Client-side command to navigate from a .pli file to the process
   * group entry (in proc_grps.json, or VS Code settings) that its
   * program configuration is bound to.
   */
  export const GO_TO_PROCESS_GROUP = "pli.goToProcessGroup";

  /**
   * Client-side command to open the fully preprocessed text of the
   * compilation unit containing the active .pli file in a read-only editor.
   */
  export const SHOW_PREPROCESSED_TEXT = "pli.showPreprocessedText";
}
