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

// Must be loaded before inversify.
import "reflect-metadata";
import "sprotty/css/sprotty.css";
import "sprotty-vscode-webview/css/sprotty-vscode.css";
import "./flow-diagram.css";

import type { Container } from "inversify";
import {
  SprottyDiagramIdentifier,
  SprottyStarter,
} from "sprotty-vscode-webview";
import { createFlowDiagramContainer } from "./di.config";

const LEGEND: [string, string][] = [
  ["pli-edge-flow", "sequential flow"],
  ["pli-edge-true", "IF true"],
  ["pli-edge-false", "IF false"],
  ["pli-edge-case", "SELECT WHEN / OTHERWISE"],
  ["pli-edge-loop-back", "loop / ITERATE / LEAVE"],
  ["pli-edge-goto", "GO TO"],
  ["pli-edge-return", "RETURN"],
  ["pli-edge-on-unit", "ON-unit / SIGNAL"],
  ["pli-edge-call", "CALL"],
];

/** Collapsible legend explaining the edge styles. */
function createLegend(): HTMLElement {
  const legend = document.createElement("details");
  legend.className = "pli-flow-legend";
  const summary = document.createElement("summary");
  summary.textContent = "Legend";
  legend.appendChild(summary);
  for (const [cssClass, text] of LEGEND) {
    const row = document.createElement("div");
    row.className = "pli-flow-legend-row";
    row.innerHTML = `<svg width="28" height="10"><line class="${cssClass} pli-legend-line" x1="1" y1="5" x2="27" y2="5"/></svg>`;
    const label = document.createElement("span");
    label.textContent = text;
    row.appendChild(label);
    legend.appendChild(row);
  }
  const hint = document.createElement("div");
  hint.className = "pli-flow-legend-hint";
  hint.textContent =
    "Click: highlight source · Double-click: go to source · Wheel: zoom · Drag: pan";
  legend.appendChild(hint);
  return legend;
}

class FlowDiagramStarter extends SprottyStarter {
  protected createContainer(identifier: SprottyDiagramIdentifier): Container {
    document
      .getElementById(identifier.clientId + "_container")
      ?.appendChild(createLegend());
    return createFlowDiagramContainer(identifier.clientId);
  }
}

new FlowDiagramStarter().start();
