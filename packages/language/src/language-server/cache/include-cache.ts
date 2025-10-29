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

import { LRUCache } from "lru-cache";
import { URI } from "vscode-uri";
import { CompilationUnit } from "../../workspace/compilation-unit";

export interface IncludePreview {
  fileUri: string | null;
  partialContent: string | null;
  fetchedAt: number;
}

export interface IncludeItemNode {
  sourceText: string | null;
  filePath: string | null;
  relativeFilePath: string | null;
}

export const includeCache = new LRUCache<string, IncludePreview>({
  max: 500,
  ttl: 1000 * 60 * 5,
  maxSize: 1000,
  sizeCalculation: (v) => (v.partialContent ? v.partialContent.length : 1),
  fetchMethod: async (key, staleValue, { context }) => {
    if (!context) throw new Error("Missing context for include preview");
    const { unit, node } = context as { unit: CompilationUnit; node: IncludeItemNode };
    return loadIncludePreview(unit, node);
  }
});

export function makeIncludeKey(
  unitId: string,
  relativePath: string,
  configVersion?: string,
) {
  return `${unitId}::inc::${relativePath}::cfg=${configVersion ?? "v0"}`;
}

// export async function fetchIncludePreview(
//   key: string,
//   fetchFn: () => Promise<IncludePreview>,
// ) {
//   const cached = includeCache.get(key);
//   if (cached) return cached;

//   const value = await fetchFn();
//   includeCache.set(key, value);
//   return value;
// }

export async function fetchIncludePreviewWithCache(
  key: string,
  asyncLoader: () => Promise<IncludePreview>,
) {
  return (includeCache as any).fetch(key, { fetchMethod: asyncLoader });
}

export function delKeysStartingWith(prefix: string) {
  for (const k of includeCache.keys()) {
    if (k.startsWith(prefix)) includeCache.delete(k);
  }
}

export function clear() {
  includeCache.clear();
}

export async function loadIncludePreview(
  unit: CompilationUnit,
  node: IncludeItemNode,
): Promise<IncludePreview> {
  if (!node.filePath || !node.relativeFilePath) {
    return { fileUri: null, partialContent: null, fetchedAt: Date.now() };
  }

  const fileUri = URI.parse(node.filePath);
  const doc = unit.services.files.getDocument(fileUri);
  if (!doc) {
    // unresolved now
    return { fileUri: null, partialContent: null, fetchedAt: Date.now() };
  }

  // read up to N lines (same logic as before)
  const lineCutoff = 20;
  const fileContent = doc.getText({
    start: { line: 0, character: 0 },
    end: { line: lineCutoff + 1, character: 0 },
  });
  const lineCount = Array.from(fileContent.matchAll(/\n/g)).length;
  const partialContent =
    lineCount > lineCutoff ? fileContent + "\n...\n" : fileContent;
  return { fileUri: fileUri.toString(), partialContent, fetchedAt: Date.now() };
}
