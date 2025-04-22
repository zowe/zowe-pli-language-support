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

import {
  createConnection,
  ProposedFeatures,
} from "vscode-languageserver/node.js";
import {
  startLanguageServer,
  FileSystemProvider,
  URI,
  setFileSystemProvider,
} from "pli-language";
import * as fs from "fs";
import { PluginConfigProvider, ProcessGroup, ProgramConfig } from "../../../language/src/workspace/plugin-configuration-provider";

class NodeFileSystemProvider implements FileSystemProvider {
  readFileSync(uri: URI): string {
    return fs.readFileSync(uri.fsPath, "utf8");
  }
}

setFileSystemProvider(new NodeFileSystemProvider());

function updatePluginConfig(
  programConfigPath: string,
  processGroupConfigPath: string
) {
  try {
    const programConfig = JSON.parse(
      fs.readFileSync(programConfigPath, "utf8")
    ).pgms as ProgramConfig[];
    const processGroupConfig = JSON.parse(
      fs.readFileSync(processGroupConfigPath, "utf8")
    ).pgroups as ProcessGroup[];

    // store these configs
    PluginConfigProvider.setProgramConfigs(programConfig);
    PluginConfigProvider.setProcessGroupConfigs(processGroupConfig);
  } catch (err) {
    // ignore, configs may be broken mid-edit
  }
}

// check to load up pliplugin configs
if (fs.existsSync(".pliplugin")) {
  const programConfigPath = ".pliplugin/pgm_conf.json";
  const processGroupConfigPath = ".pliplugin/proc_grps.json";
  
  // verify they're both present before proceeding
  if (fs.existsSync(programConfigPath) && fs.existsSync(processGroupConfigPath)) {
    updatePluginConfig(programConfigPath, processGroupConfigPath);
  }

  fs.watch(".pliplugin", { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith("pgm_conf.json") || filename.endsWith("proc_grps.json"))) {
      // verify they're both present before reloading configs
      if (fs.existsSync(programConfigPath) && fs.existsSync(processGroupConfigPath)) {
        updatePluginConfig(programConfigPath, processGroupConfigPath);
      }
    }
  });
}

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// // Inject the shared services and language-specific services
// const { shared } = createPliServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(connection);
