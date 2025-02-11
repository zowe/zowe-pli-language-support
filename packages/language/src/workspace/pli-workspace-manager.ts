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
  DefaultWorkspaceManager,
  LangiumDocument,
  LangiumDocumentFactory,
  URI,
  UriUtils,
  WorkspaceFolder,
} from "langium";
import { Builtins } from "./pli-builtin-functions.js";
import { PliConfigStorage } from "./pli-config-storage.js";
import { PliSharedServices } from "../pli-module.js";

export class PliWorkspaceManager extends DefaultWorkspaceManager {
  private readonly factory: LangiumDocumentFactory;
  private readonly configStorage: PliConfigStorage;

  constructor(services: PliSharedServices) {
    super(services);
    this.factory = services.workspace.LangiumDocumentFactory;
    this.configStorage = services.workspace.PliConfigStorage;
  }

  protected override async loadAdditionalDocuments(
    _folders: WorkspaceFolder[],
    _collector: (document: LangiumDocument) => void,
  ): Promise<void> {
    const document = this.factory.fromString(
      Builtins,
      URI.parse("pli-builtin:///builtins.pli"),
    );
    _collector(document);
    for (const folder of _folders) {
      const uri = UriUtils.resolvePath(URI.parse(folder.uri), "pgm_conf.json");
      try {
        const data = await this.fileSystemProvider.readFile(uri);
        await this.configStorage.updateConfig(data, false);
      } catch {
        // ignore
      }
    }
  }

  protected override traverseFolder(): Promise<void> {
    // Do not load the workspace on language server startup
    // Files are mostly standalone, and any included files are loaded on demand.
    return Promise.resolve();
  }
}
