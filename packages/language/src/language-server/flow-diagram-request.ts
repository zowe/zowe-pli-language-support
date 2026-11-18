/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import type { Connection } from "vscode-languageserver";
import type { SGraph } from "sprotty-protocol";
import { CompilationUnit } from "../workspace/compilation-unit";
import { isVirtualFile } from "../utils/uri";
import { Messages, sendNotification } from "../utils/messages";
import {
  buildControlFlowGraph,
  FlowSourceProvider,
} from "../flow-diagram/control-flow-graph";
import { toSprottyModel } from "../flow-diagram/sprotty-model";

/**
 * Returns the Sprotty model of the flow diagram of the compilation unit. The model is cached
 * until the unit is parsed again.
 */
export function flowDiagramRequest(unit: CompilationUnit): SGraph {
  const cached = unit.requestCaches.get("flowDiagram");
  if (cached && cached.ast === unit.ast) {
    return cached.model;
  }
  const model = createFlowDiagramModel(unit);
  unit.requestCaches.set("flowDiagram", { ast: unit.ast, model });
  return model;
}

/** Builds the control flow graph of the unit and maps it onto Sprotty's graph schema. */
export function createFlowDiagramModel(unit: CompilationUnit): SGraph {
  const sources = createSourceProvider(unit);
  const graph = buildControlFlowGraph(unit.ast, sources, {
    mainUri: unit.uri.toString(),
  });
  return toSprottyModel(graph, sources);
}

/** Reads line numbers and statement text from the unit's documents (main file and includes). */
export function createSourceProvider(
  unit: CompilationUnit,
): FlowSourceProvider {
  const files = unit.services.files;
  return {
    getText(uri, start, end) {
      return files.getDocument(uri)?.getText().slice(start, end);
    },
    positionAt(uri, offset) {
      return files.getDocument(uri)?.positionAt(offset);
    },
  };
}

/**
 * Notifies the client that the flow diagram of the given compilation unit may have changed, so
 * open diagram views can refresh. The program structure is fully determined by the
 * preprocessed text, so nothing is sent while that text stays the same.
 */
export function notifyFlowDiagram(
  connection: Connection,
  unit: CompilationUnit,
): void {
  if (isVirtualFile(unit.uri.toString())) {
    return;
  }
  if (unit.requestCaches.get("flowDiagramText") === unit.preprocessedText) {
    return;
  }
  unit.requestCaches.set("flowDiagramText", unit.preprocessedText);
  // Any file of the unit (main file or include) may be the one a diagram was opened from.
  // Built-in declarations and other virtual documents never have a diagram.
  const uris = new Set(
    [...unit.services.files.keys()].filter((uri) => !isVirtualFile(uri)),
  );
  uris.add(unit.uri.toString());
  sendNotification(connection, Messages.FlowDiagramChanged, {
    uris: [...uris],
  });
}
