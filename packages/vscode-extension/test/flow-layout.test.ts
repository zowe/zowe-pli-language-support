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

import { describe, expect, test } from "vitest";
import type {
  Bounds,
  Point,
  SEdge,
  SGraph,
  SLabel,
  SModelElement,
  SNode,
} from "sprotty-protocol";
import { FlowDiagramTypes } from "../../language/src/flow-diagram/flow-diagram-protocol";
import { CONTAINER_HEADER_OFFSET } from "../src/extension/flow-diagram/flow-layout";
import { collect, FLOW_PROGRAM, layoutProgram } from "./flow-diagram-fixtures";

type FlowEdge = SEdge & { kind: string };

/** Absolute bounds of every node; Sprotty nests child coordinates inside their parent node. */
function absoluteBounds(root: SGraph): Map<string, Bounds> {
  const result = new Map<string, Bounds>();
  const visit = (element: SModelElement, offset: Point) => {
    for (const child of element.children ?? []) {
      if (!child.type.startsWith("node:")) {
        continue;
      }
      const node = child as SNode;
      const x = offset.x + (node.position?.x ?? 0);
      const y = offset.y + (node.position?.y ?? 0);
      result.set(node.id, {
        x,
        y,
        width: node.size!.width,
        height: node.size!.height,
      });
      visit(node, { x, y });
    }
  };
  visit(root, { x: 0, y: 0 });
  return result;
}

function distanceToBorder(p: Point, b: Bounds): number {
  const dx = Math.max(b.x - p.x, 0, p.x - (b.x + b.width));
  const dy = Math.max(b.y - p.y, 0, p.y - (b.y + b.height));
  if (dx > 0 || dy > 0) {
    return Math.hypot(dx, dy);
  }
  return Math.min(
    p.x - b.x,
    b.x + b.width - p.x,
    p.y - b.y,
    b.y + b.height - p.y,
  );
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const lengthSquared = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) /
              lengthSquared,
          ),
        );
  return Math.hypot(
    p.x - (a.x + t * (b.x - a.x)),
    p.y - (a.y + t * (b.y - a.y)),
  );
}

/** Visits every edge together with the absolute offset of the container it is rendered in. */
function forEachEdge(
  graph: SGraph,
  bounds: Map<string, Bounds>,
  callback: (edge: FlowEdge, offset: Point) => void,
): void {
  const visit = (parent: SModelElement, offset: Point) => {
    for (const child of parent.children ?? []) {
      if (child.type === FlowDiagramTypes.EDGE) {
        callback(child as FlowEdge, offset);
      } else if (child.type.startsWith("node:")) {
        const b = bounds.get(child.id)!;
        visit(child, { x: b.x, y: b.y });
      }
    }
  };
  visit(graph, { x: 0, y: 0 });
}

describe("Flow diagram ELK layout", () => {
  test("positions every node and routes every flow edge", async () => {
    const graph = await layoutProgram(FLOW_PROGRAM);
    const elements = collect(graph);
    const nodes = elements.filter((e) => e.type.startsWith("node:")) as SNode[];
    expect(nodes.length).toBeGreaterThan(10);
    for (const node of nodes) {
      expect(node.position, node.id).toBeDefined();
      expect(node.size!.width, node.id).toBeGreaterThan(0);
    }
    const edges = elements.filter(
      (e) => e.type === FlowDiagramTypes.EDGE,
    ) as FlowEdge[];
    for (const edge of edges) {
      if (edge.kind === "call" || edge.kind === "signal") {
        // Overlay edges are not laid out; the webview draws them straight.
        expect(edge.routingPoints ?? []).toHaveLength(0);
      } else {
        expect(edge.routingPoints!.length, edge.id).toBeGreaterThanOrEqual(2);
      }
    }
  });

  test("edge routes start and end on their nodes in the coordinates of the edge's container", async () => {
    const graph = await layoutProgram(FLOW_PROGRAM);
    const bounds = absoluteBounds(graph);
    const parentOf = new Map<string, string>();
    for (const element of collect(graph)) {
      for (const child of element.children ?? []) {
        parentOf.set(child.id, element.id);
      }
    }
    let checked = 0;
    let crossContainer = 0;
    forEachEdge(graph, bounds, (edge, offset) => {
      const points = edge.routingPoints ?? [];
      if (points.length < 2) {
        return;
      }
      checked++;
      if (parentOf.get(edge.sourceId) !== parentOf.get(edge.targetId)) {
        crossContainer++;
      }
      const first = { x: offset.x + points[0].x, y: offset.y + points[0].y };
      const lastPoint = points[points.length - 1];
      const last = { x: offset.x + lastPoint.x, y: offset.y + lastPoint.y };
      expect(
        distanceToBorder(first, bounds.get(edge.sourceId)!),
        `${edge.id} start`,
      ).toBeLessThan(2);
      expect(
        distanceToBorder(last, bounds.get(edge.targetId)!),
        `${edge.id} end`,
      ).toBeLessThan(2);
    });
    expect(checked).toBeGreaterThan(20);
    // e.g. loop exits and LEAVE edges leave the DO-group container.
    expect(crossContainer).toBeGreaterThanOrEqual(3);
  });

  test("edge labels are placed next to their edge", async () => {
    const graph = await layoutProgram(FLOW_PROGRAM);
    const bounds = absoluteBounds(graph);
    let labels = 0;
    forEachEdge(graph, bounds, (edge, offset) => {
      const label = edge.children?.find(
        (c) => c.type === FlowDiagramTypes.EDGE_LABEL,
      ) as (SLabel & { position?: Point }) | undefined;
      const points = edge.routingPoints ?? [];
      if (!label || points.length < 2) {
        return;
      }
      labels++;
      expect(label.position, label.id).toBeDefined();
      // Edge labels render in the coordinate system of the edge's container, like the route.
      const center = {
        x: label.position!.x + label.size!.width / 2,
        y: label.position!.y + label.size!.height / 2,
      };
      let nearest = Infinity;
      for (let i = 1; i < points.length; i++) {
        nearest = Math.min(
          nearest,
          distanceToSegment(center, points[i - 1], points[i]),
        );
      }
      const reach = Math.max(label.size!.width, label.size!.height) / 2 + 12;
      expect(
        nearest,
        `${label.id} (${label.text}) at ${JSON.stringify(offset)}`,
      ).toBeLessThan(reach);
    });
    expect(labels).toBeGreaterThanOrEqual(6);
  });

  test("children stay inside their container, below the container title", async () => {
    const graph = await layoutProgram(FLOW_PROGRAM);
    const bounds = absoluteBounds(graph);
    const containers = collect(graph).filter(
      (e) => e.type === FlowDiagramTypes.CONTAINER,
    ) as SNode[];
    expect(containers.length).toBeGreaterThanOrEqual(4);
    for (const container of containers) {
      const outer = bounds.get(container.id)!;
      const header = container.children!.find(
        (c) => c.type === FlowDiagramTypes.CONTAINER_HEADER,
      ) as SLabel;
      expect(header.position).toEqual(CONTAINER_HEADER_OFFSET);
      expect(outer.width).toBeGreaterThanOrEqual(header.size!.width);
      const headerBottom =
        outer.y + CONTAINER_HEADER_OFFSET.y + header.size!.height;
      for (const child of container.children!) {
        if (!child.type.startsWith("node:")) {
          continue;
        }
        const inner = bounds.get(child.id)!;
        expect(inner.x).toBeGreaterThanOrEqual(outer.x);
        expect(inner.y).toBeGreaterThanOrEqual(headerBottom);
        expect(inner.x + inner.width).toBeLessThanOrEqual(
          outer.x + outer.width + 0.5,
        );
        expect(inner.y + inner.height).toBeLessThanOrEqual(
          outer.y + outer.height + 0.5,
        );
      }
    }
  });

  test("the main flow runs top-down", async () => {
    const graph = await layoutProgram(FLOW_PROGRAM);
    const bounds = absoluteBounds(graph);
    const nodes = collect(graph) as (SNode & { kind?: string })[];
    const heading = (n: SNode) => (n.children?.[0] as SLabel | undefined)?.text;
    const entry = nodes.find(
      (n) => n.kind === "entry" && heading(n) === "PROC MAIN",
    )!;
    const loop = nodes.find(
      (n) => n.kind === "loop" && heading(n) === "DO WHILE (¬EOF)",
    )!;
    const select = nodes.find((n) => n.kind === "select")!;
    const exit = nodes.find(
      (n) => n.kind === "exit" && heading(n) === "END MAIN",
    )!;
    const y = (n: SNode) => bounds.get(n.id)!.y;
    expect(y(entry)).toBeLessThan(y(loop));
    expect(y(loop)).toBeLessThan(y(select));
    expect(y(select)).toBeLessThan(y(exit));
  });
});
