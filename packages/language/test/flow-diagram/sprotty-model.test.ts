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
import type { SEdge, SGraph, SLabel, SModelElement } from "sprotty-protocol";
import { parse } from "../utils";
import { createFlowDiagramModel } from "../../src/language-server/flow-diagram-request";
import {
  FLOW_DIAGRAM_ROOT_ID,
  FlowDiagramTypes,
  FlowElementData,
} from "../../src/flow-diagram/flow-diagram-protocol";
import {
  commonContainer,
  FlowSNode,
} from "../../src/flow-diagram/sprotty-model";
import { FlowContainer } from "../../src/flow-diagram/control-flow-graph";

const PROGRAM = ` MAIN: PROC OPTIONS(MAIN);
   DCL EXTRA ENTRY EXTERNAL;
   ON ERROR BEGIN;
     CALL EXTRA;
   END;
   DO I = 1 TO 3;
     IF I = 2 THEN GO TO DONE;
     CALL SUB;
   END;
 DONE:
   RETURN;
 SUB: PROC;
   SELECT;
     WHEN (A) X = 1;
     OTHERWISE STOP;
   END;
 END SUB;
 END MAIN;`;

async function modelOf(text: string): Promise<SGraph> {
  return createFlowDiagramModel(await parse(text, { validate: true }));
}

function walk(
  element: SModelElement,
  visit: (element: SModelElement, parent: SModelElement | undefined) => void,
  parent?: SModelElement,
): void {
  visit(element, parent);
  for (const child of element.children ?? []) {
    walk(child, visit, element);
  }
}

function heading(node: SModelElement): string | undefined {
  return (node.children?.[0] as SLabel | undefined)?.text;
}

describe("Flow diagram Sprotty model", () => {
  test("is a graph of containers, nodes, labels and edges with unique ids", async () => {
    const model = await modelOf(PROGRAM);
    expect(model.type).toBe(FlowDiagramTypes.GRAPH);
    expect(model.id).toBe(FLOW_DIAGRAM_ROOT_ID);
    const ids = new Set<string>();
    const types = new Set<string>();
    walk(model, (element) => {
      expect(ids.has(element.id), element.id).toBe(false);
      ids.add(element.id);
      types.add(element.type);
    });
    expect([...types].sort()).toEqual(
      [
        FlowDiagramTypes.GRAPH,
        FlowDiagramTypes.CONTAINER,
        FlowDiagramTypes.CONTAINER_HEADER,
        FlowDiagramTypes.TERMINAL,
        FlowDiagramTypes.BLOCK,
        FlowDiagramTypes.DECISION,
        FlowDiagramTypes.LOOP,
        FlowDiagramTypes.CALL,
        FlowDiagramTypes.JUMP,
        FlowDiagramTypes.CONDITION,
        FlowDiagramTypes.NODE_HEADING,
        FlowDiagramTypes.NODE_TEXT,
        FlowDiagramTypes.EDGE,
        FlowDiagramTypes.EDGE_LABEL,
      ].sort(),
    );
  });

  test("nests containers like the PL/I block structure, each with a title", async () => {
    const model = await modelOf(PROGRAM);
    const titles: string[] = [];
    const structure: string[] = [];
    walk(model, (element, parent) => {
      if (element.type === FlowDiagramTypes.CONTAINER) {
        const header = element.children![0] as SLabel;
        expect(header.type).toBe(FlowDiagramTypes.CONTAINER_HEADER);
        titles.push(header.text);
        const parentTitle =
          parent?.type === FlowDiagramTypes.CONTAINER
            ? (parent.children![0] as SLabel).text
            : "<root>";
        structure.push(`${parentTitle} > ${header.text}`);
      }
    });
    expect(structure).toEqual([
      "<root> > PROCEDURE MAIN",
      "PROCEDURE MAIN > ON-unit ERROR",
      "PROCEDURE MAIN > DO-group",
      "PROCEDURE MAIN > PROCEDURE SUB",
    ]);
  });

  test("execution nodes size themselves around their labels on the client", async () => {
    const model = await modelOf(PROGRAM);
    walk(model, (element) => {
      if (
        element.type.startsWith("node:") &&
        element.type !== FlowDiagramTypes.CONTAINER
      ) {
        const node = element as FlowSNode;
        expect(node.layout).toBe("vbox");
        expect(node.layoutOptions?.resizeContainer).toBe(true);
        expect(node.children![0].type).toBe(FlowDiagramTypes.NODE_HEADING);
        expect(node.tooltip, node.id).toBeTruthy();
      }
    });
  });

  test("puts every edge into the innermost container holding both endpoints", async () => {
    const model = await modelOf(PROGRAM);
    const parentOf = new Map<string, SModelElement>();
    walk(
      model,
      (element, parent) => parent && parentOf.set(element.id, parent),
    );
    const ancestors = (id: string): SModelElement[] => {
      const result: SModelElement[] = [];
      for (let p = parentOf.get(id); p; p = parentOf.get(p.id)) {
        result.push(p);
      }
      return result;
    };
    let edges = 0;
    walk(model, (element, parent) => {
      if (element.type !== FlowDiagramTypes.EDGE) {
        return;
      }
      edges++;
      const edge = element as SEdge;
      const sourceAncestors = ancestors(edge.sourceId);
      const targetAncestors = new Set(ancestors(edge.targetId));
      expect(sourceAncestors.length, `${edge.id} source`).toBeGreaterThan(0);
      expect(targetAncestors.size, `${edge.id} target`).toBeGreaterThan(0);
      const lowestCommon = sourceAncestors.find((a) => targetAncestors.has(a));
      expect(parent, edge.id).toBe(lowestCommon);
    });
    expect(edges).toBeGreaterThan(10);
  });

  test("carries source locations, kinds and styling classes", async () => {
    const model = await modelOf(PROGRAM);
    const nodes: FlowSNode[] = [];
    walk(model, (element) => {
      if (element.type.startsWith("node:")) nodes.push(element as FlowSNode);
    });
    const byHeading = (text: string) => nodes.find((n) => heading(n) === text)!;

    const loop = byHeading("DO I = 1 TO 3");
    expect(loop.type).toBe(FlowDiagramTypes.LOOP);
    expect(loop.kind).toBe("loop");
    expect(loop.cssClasses).toEqual(["pli-node-loop"]);
    expect(loop.source).toEqual({
      uri: "file:///test.pli",
      range: {
        start: { line: 5, character: 3 },
        end: { line: 5, character: 17 },
      },
    });

    expect(byHeading("CALL EXTRA").cssClasses).toEqual([
      "pli-node-call",
      "pli-external",
    ]);
    expect(byHeading("CALL SUB").cssClasses).toEqual(["pli-node-call"]);
    expect(byHeading("GO TO DONE").type).toBe(FlowDiagramTypes.JUMP);
    expect(byHeading("ON ERROR").type).toBe(FlowDiagramTypes.CONDITION);
    expect(byHeading("SELECT").type).toBe(FlowDiagramTypes.DECISION);
    expect(byHeading("STOP").type).toBe(FlowDiagramTypes.TERMINAL);

    const subContainer = nodes.find(
      (n) =>
        n.type === FlowDiagramTypes.CONTAINER &&
        (n as FlowElementData).kind === "procedure" &&
        heading(n) === "PROCEDURE SUB",
    )!;
    expect(subContainer.cssClasses).toEqual(["pli-container-procedure"]);
    expect(subContainer.source?.range.start.line).toBe(11);
    expect(subContainer.source?.range.end.line).toBe(16);
  });

  test("labels branch edges and styles edges by kind", async () => {
    const model = await modelOf(PROGRAM);
    const edges: (SEdge & { kind: string })[] = [];
    walk(model, (element) => {
      if (element.type === FlowDiagramTypes.EDGE)
        edges.push(element as SEdge & { kind: string });
    });
    for (const edge of edges) {
      expect(edge.cssClasses).toEqual([`pli-edge-${edge.kind}`]);
    }
    const labelsOf = (kind: string) =>
      edges
        .filter((e) => e.kind === kind)
        .map((e) => (e.children?.[0] as SLabel | undefined)?.text);
    expect(labelsOf("true")).toEqual(["true"]);
    expect(labelsOf("false")).toEqual(["false"]);
    expect(labelsOf("case")).toEqual(["WHEN (A)"]);
    expect(labelsOf("otherwise")).toEqual(["OTHERWISE"]);
    expect(labelsOf("loop-exit")).toEqual(["done"]);
    expect(labelsOf("goto")).toEqual([undefined]);
  });

  test("commonContainer finds the innermost shared container", () => {
    const container = (id: string, parent?: FlowContainer): FlowContainer => ({
      id,
      order: 0,
      kind: "procedure",
      title: id,
      parent,
    });
    const main = container("main");
    const loop = container("loop", main);
    const inner = container("inner", loop);
    const sub = container("sub", main);
    expect(commonContainer(inner, sub)).toBe(main);
    expect(commonContainer(inner, loop)).toBe(loop);
    expect(commonContainer(loop, loop)).toBe(loop);
    expect(commonContainer(main, undefined)).toBeUndefined();
    expect(commonContainer(container("other"), inner)).toBeUndefined();
  });
});
