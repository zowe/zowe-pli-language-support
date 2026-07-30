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
  URI,
  Stats,
  FileType,
  UriUtils,
} from "pli-language";
import * as fs from "fs";
import * as glob from "glob";
import { dirname, join } from "path";
import { VSCodeFileSystemProvider } from "./file-system";
import { VscodeGlobalConfigLoader } from "./config-loader";

// Node-specific file system provider
// This provider is used when running the language server in a Node environment
// Usually preserved for VS Code desktop use cases
// It optimizes file system access by directly using Node's fs module,
// rather than sending requests to the client as the browser provider does.
//
// For non-file URIs, it falls back to the VSCodeFileSystemProvider which sends requests to the client.
class NodeFileSystemProvider extends VSCodeFileSystemProvider {
  override async readFile(uri: URI): Promise<string | undefined> {
    if (uri.scheme !== "file") {
      return super.readFile(uri);
    }
    try {
      return await fs.promises.readFile(uri.fsPath, "utf8");
    } catch {
      return undefined;
    }
  }

  override async readDir(uri: URI): Promise<[string, FileType][]> {
    if (uri.scheme !== "file") {
      return super.readDir(uri);
    }
    const dirents = await fs.promises.readdir(uri.fsPath, {
      withFileTypes: true,
    });
    return Promise.all(
      dirents.map(async (dirent): Promise<[string, FileType]> => {
        if (dirent.isDirectory()) return [dirent.name, FileType.Directory];
        if (dirent.isFile()) return [dirent.name, FileType.File];
        if (dirent.isSymbolicLink()) {
          try {
            const s = await fs.promises.stat(join(uri.fsPath, dirent.name));
            if (s.isDirectory())
              return [dirent.name, FileType.Directory | FileType.SymbolicLink];
            if (s.isFile())
              return [dirent.name, FileType.File | FileType.SymbolicLink];
          } catch {
            /* broken symlink */
          }
          return [dirent.name, FileType.SymbolicLink];
        }
        return [dirent.name, FileType.Unknown];
      }),
    );
  }

  override async fileExists(uri: URI): Promise<boolean> {
    if (uri.scheme !== "file") {
      return super.fileExists(uri);
    }
    try {
      await fs.promises.access(uri.fsPath);
      return true;
    } catch {
      return false;
    }
  }
  override async writeFile(uri: URI, value: string): Promise<void> {
    if (uri.scheme !== "file") {
      return super.writeFile(uri, value);
    }
    const dir = dirname(uri.fsPath);
    let failure = false;
    try {
      await fs.promises.mkdir(dir, { recursive: true });
    } catch (err) {
      console.log(`Failed to create directory "${dir}":`, err);
      failure = true;
    }
    if (!failure) {
      // Only write if the directory creation succeeded (or was not needed)
      await fs.promises.writeFile(uri.fsPath, value, "utf8");
    }
  }
  override async findFile(
    path: URI,
    extensions: readonly string[],
  ): Promise<URI | undefined> {
    if (path.scheme !== "file") {
      return super.findFile(path, extensions);
    }
    const fsPath = UriUtils.normalizePath(path.fsPath);
    // Workspace-wide lookup: match the path as a suffix of any file, with
    // optional extension. `nocase: true` for case-insensitive systems.
    const pattern =
      extensions.length > 0
        ? `**${fsPath}{,${extensions.join(",")}}`
        : `**${fsPath}`;
    const files = await glob.glob(pattern, {
      nodir: true,
      absolute: true,
      nocase: true,
    });
    if (!files.length) {
      return undefined;
    }
    const result = UriUtils.toUri(files[0]);
    return result;
  }

  /**
   * Stats for file or directory
   * @param uri URI of file or directory to stat
   * @returns Stats object. If stat fails, this function throws.
   */
  override async stat(uri: URI): Promise<Stats> {
    if (uri.scheme !== "file") {
      return super.stat(uri);
    }
    const stat = await fs.promises.stat(uri.fsPath);
    return {
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
    };
  }
}

const connection = createConnection(ProposedFeatures.all);
const globalConfigLoader = new VscodeGlobalConfigLoader(connection);
startLanguageServer(connection, new NodeFileSystemProvider(connection), globalConfigLoader);
