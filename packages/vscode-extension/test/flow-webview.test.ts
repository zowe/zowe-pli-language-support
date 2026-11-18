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

import "reflect-metadata";
import { beforeAll, describe, expect, test } from "vitest";
import {
  editFeature,
  IModelFactory,
  ModelRendererFactory,
  moveFeature,
  openFeature,
  selectFeature,
  SGraphImpl,
  TYPES,
} from "sprotty";
import { FlowDiagramTypes } from "../../language/src/flow-diagram/flow-diagram-protocol";
import { createFlowDiagramContainer } from "../src/webview/flow-diagram/di.config";
import {
  FlowContainerView,
  FlowEdgeImpl,
  FlowEdgeView,
  FlowNodeImpl,
  FlowNodeView,
} from "../src/webview/flow-diagram/views";
import { FLOW_PROGRAM, layoutProgram } from "./flow-diagram-fixtures";

interface VNodeLike {
  sel?: string;
  text?: string;
  data?: {
    attrs?: Record<string, unknown>;
    class?: Record<string, boolean>;
  };
  children?: (VNodeLike | string)[];
}

function walk(vnode: VNodeLike, visit: (v: VNodeLike) => void): void {
  visit(vnode);
  for (const child of vnode.children ?? []) {
    if (typeof child !== "string") {
      walk(child, visit);
    }
  }
}

function hasClass(vnode: VNodeLike, cssClass: string): boolean {
  return !!vnode.data?.class?.[cssClass];
}

/** Text content of a `<title>` / `<text>` vnode. */
function textOf(vnode: VNodeLike): string {
  if (vnode.text !== undefined) {
    return vnode.text;
  }
  return (vnode.children ?? [])
    .map((c) => (typeof c === "string" ? c : textOf(c)))
    .join("");
}

describe("Flow diagram webview", () => {
  let root: SGraphImpl;
  let rendered: VNodeLike;

  beforeAll(async () => {
    const model = await layoutProgram(FLOW_PROGRAM);
    const container = createFlowDiagramContainer("test-diagram");
    root = container
      .get<IModelFactory>(TYPES.IModelFactory)
      .createRoot(model) as SGraphImpl;
    // The hidden rendering target skips viewport culling, so every element is rendered.
    const renderer = container.get<ModelRendererFactory>(
      TYPES.ModelRendererFactory,
    )("hidden", []);
    rendered = renderer.renderElement(root) as VNodeLike;
  });

  test("maps every model element type to the flow diagram classes and views", () => {
    const container = createFlowDiagramContainer("bindings");
    const views = container.get<{ get(type: string): unknown }>(
      TYPES.ViewRegistry,
    );
    for (const type of [
      FlowDiagramTypes.TERMINAL,
      FlowDiagramTypes.BLOCK,
      FlowDiagramTypes.DECISION,
      FlowDiagramTypes.LOOP,
      FlowDiagramTypes.CALL,
      FlowDiagramTypes.JUMP,
      FlowDiagramTypes.CONDITION,
    ]) {
      expect(views.get(type), type).toBeInstanceOf(FlowNodeView);
    }
    expect(views.get(FlowDiagramTypes.CONTAINER)).toBeInstanceOf(
      FlowContainerView,
    );
    expect(views.get(FlowDiagramTypes.EDGE)).toBeInstanceOf(FlowEdgeView);
  });

  test("keeps the PL/I data of the language server model on the client elements", () => {
    const nodes = [...root.index.all()].filter(
      (e): e is FlowNodeImpl => e instanceof FlowNodeImpl,
    );
    expect(nodes.length).toBeGreaterThan(10);
    const loop = nodes.find((n) => n.type === FlowDiagramTypes.LOOP)!;
    expect(loop.source?.uri).toBe("file:///test.pli");
    expect(loop.source?.range.start.line).toBe(6);
    expect(loop.tooltip).toContain("DO WHILE");

    const edges = [...root.index.all()].filter(
      (e): e is FlowEdgeImpl => e instanceof FlowEdgeImpl,
    );
    expect(new Set(edges.map((e) => e.kind))).toEqual(
      new Set([
        "flow",
        "true",
        "false",
        "case",
        "otherwise",
        "loop-body",
        "loop-back",
        "loop-exit",
        // No "leave": ELSE LEAVE keeps the "false" kind, labeled "false (LEAVE)".
        "goto",
        "return",
        "on-unit",
        "signal",
        "call",
      ]),
    );
  });

  test("renders flowchart shapes for each node type", () => {
    const polygons: number[] = [];
    let terminals = 0;
    let callBars = 0;
    walk(rendered, (v) => {
      if (v.sel === "polygon" && hasClass(v, "pli-shape")) {
        polygons.push(String(v.data!.attrs!.points).split(" ").length);
      }
      if (
        v.sel === "rect" &&
        hasClass(v, "pli-shape") &&
        Number(v.data!.attrs!.rx) > 3
      ) {
        terminals++;
      }
      if (v.sel === "line" && hasClass(v, "pli-call-bar")) {
        callBars++;
      }
    });
    // Hexagons: 2 x IF, SELECT and 2 DO headers. Parallelograms: GO TO, RETURN, SIGNAL.
    // Notched box: the ON statement.
    expect(polygons.filter((points) => points === 6)).toHaveLength(5);
    expect(polygons.filter((points) => points === 4)).toHaveLength(3);
    expect(polygons.filter((points) => points === 5)).toHaveLength(1);
    // PROC MAIN, END MAIN, PROC REPORT, END REPORT, END ON-unit.
    expect(terminals).toBe(5);
    // One CALL node with two bars.
    expect(callBars).toBe(2);
  });

  test("renders containers with their title and nodes with a tooltip", () => {
    const frames: VNodeLike[] = [];
    const titles: string[] = [];
    const labels: string[] = [];
    walk(rendered, (v) => {
      if (v.sel === "rect" && hasClass(v, "pli-container-frame"))
        frames.push(v);
      if (v.sel === "title") titles.push(textOf(v));
      if (v.sel === "text") labels.push(textOf(v));
    });
    expect(frames).toHaveLength(5);
    expect(labels).toEqual(
      expect.arrayContaining([
        "PROCEDURE MAIN",
        "READ_LOOP: DO-group",
        "ON-unit ENDFILE(SYSIN)",
        "IF N > 5",
        "Line 6",
        "N = 10;",
      ]),
    );
    expect(titles).toEqual(
      expect.arrayContaining([
        "DO WHILE (¬EOF)",
        "IF N > 5",
        "PROCEDURE REPORT",
      ]),
    );
  });

  test("draws one arrowhead per routed edge", () => {
    const edges = [...root.index.all()].filter(
      (e): e is FlowEdgeImpl => e instanceof FlowEdgeImpl,
    );
    let arrows = 0;
    walk(rendered, (v) => {
      if (v.sel === "path" && hasClass(v, "pli-arrow")) arrows++;
    });
    expect(arrows).toBe(edges.length);
  });

  test("nodes are selectable and openable but not movable; edges are not editable", () => {
    const all = [...root.index.all()];
    const nodes = all.filter(
      (e): e is FlowNodeImpl => e instanceof FlowNodeImpl,
    );
    for (const node of nodes) {
      // Click highlights the source, double-click jumps to it.
      expect(node.hasFeature(selectFeature), node.id).toBe(true);
      expect(node.hasFeature(openFeature), node.id).toBe(true);
      // Dragging would detach nodes from their ELK-routed edges.
      expect(node.hasFeature(moveFeature), node.id).toBe(false);
    }
    const edge = all.find((e) => e instanceof FlowEdgeImpl)!;
    expect(edge.hasFeature(editFeature)).toBe(false);
  });
});
