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
  SearchOptions,
  URI,
  setFileSystemProvider,
  isPathSearch,
  Stats,
} from "pli-language";
import * as fs from "fs";
import * as glob from "glob";
import { dirname } from "path";

class NodeFileSystemProvider implements FileSystemProvider {
  readFile(uri: URI): Promise<string> {
    return fs.promises.readFile(uri.fsPath, "utf8");
  }

  /**
   * Reads directory contents, returning an array of file & directory names
   */
  async readDir(uri: URI): Promise<string[]> {
    return fs.promises.readdir(uri.fsPath);
  }

  async fileExists(uri: URI): Promise<boolean> {
    try {
      await fs.promises.access(uri.fsPath);
      return true;
    } catch {
      return false;
    }
  }
  async writeFile(uri: URI, value: string): Promise<void> {
    const dir = dirname(uri.fsPath);
    try {
      await fs.promises.mkdir(dir, { recursive: true });
    } catch (err) {
      console.log(`Failed to create directory "${dir}":`, err);
    }
    await fs.promises.writeFile(uri.fsPath, value, "utf8");
  }
  async deleteFile(uri: URI): Promise<void> {
    throw new Error("Not supported.");
  }
  async search(options: SearchOptions): Promise<URI | undefined> {
    let files: string[] = [];
    if (isPathSearch(options)) {
      // uri lookup
      const GLOBAL_PATTERN = "**";
      const path = options.path.fsPath.replace(/\\/g, "/");
      const pattern = options.global
        ? `${GLOBAL_PATTERN}${path}{,${options.extensions.join(",")}}`
        : `${path}{,${options.extensions.join(",")}}`;
      files = await glob.glob(pattern, {
        nodir: true,
        absolute: true,
        nocase: true,
      });
    } else {
      // Windows paths may contain backslashes that need to be normalized before using them as glob patterns.
      // This mainly affects INCLUDEs for members without DD names (ddname(member)).
      const normalizedPath = options.dirPath.fsPath.replace(/\\/g, "/");
      // member lookup w/ dir path
      files = await glob.glob(`${normalizedPath}**/*\\(${options.member}\\)`, {
        nodir: true,
        absolute: true,
        nocase: true,
      });
    }

    // return first match when present
    if (!files.length) {
      return undefined;
    }
    const result = URI.file(files[0]);
    if (!result) {
      return undefined;
    }
    return result;
  }

  /**
   * Stats for file or directory
   * @param uri URI of file or directory to stat
   * @returns Stats object. If stat fails, returns a stats object with both isFile and isDirectory false.
   */
  async stat(uri: URI): Promise<Stats> {
    try {
      const stat = await fs.promises.stat(uri.fsPath);
      return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
      };
    } catch {
      return {
        isFile: false,
        isDirectory: false,
      };
    }
  }
}

setFileSystemProvider(new NodeFileSystemProvider());

const connection = createConnection(ProposedFeatures.all);
startLanguageServer(connection);
