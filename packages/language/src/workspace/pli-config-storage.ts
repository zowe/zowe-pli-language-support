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

import { DocumentBuilder, LangiumDocuments, URI } from "langium";
import { LangiumSharedServices } from "langium/lsp";
import { CompilerOptionResult, CompilerOptions } from "../compiler/options";

export class PliConfigStorage {
  private readonly documents: LangiumDocuments;
  private readonly documentBuilder: DocumentBuilder;

  private compilerOptions?: CompilerOptions;

  constructor(services: LangiumSharedServices) {
    this.documentBuilder = services.workspace.DocumentBuilder;
    this.documents = services.workspace.LangiumDocuments;
    services.lsp.Connection?.onNotification(
      "pli/pgmConfChanged",
      async (params) => {
        await this.updateConfig(params.text);
      },
    );
  }

  async updateConfig(text: string, update = true): Promise<void> {
    try {
      const config = JSON.parse(text);
      this.compilerOptions = config;
      if (update) {
        // Collect all non-builtin documents and rebuild them
        const documents = this.documents.all
          .filter((doc) => doc.uri.scheme !== "pli-builtin")
          .toArray();
        documents.forEach((doc) => {
          // Reset the CST node to force re-parsing
          // We definitely need to reparse, since some of the compiler options might influence the parsing process
          // For example, the "or" and "not" operators are defined in the compiler options
          (doc.parseResult.value as any).$cstNode = undefined;
        });
        await this.documentBuilder.update(
          documents.map((doc) => doc.uri),
          [],
        );
      }
    } catch (error) {
      // found no config, this is fine
    }
  }

  getCompilerOptions(uri: URI): CompilerOptionResult {
    return {
      options: this.compilerOptions ?? {},
      issues: [],
    };
  }
}
