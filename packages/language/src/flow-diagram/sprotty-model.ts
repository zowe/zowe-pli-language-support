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

import type {
  SEdge,
  SGraph,
  SLabel,
  SModelElement,
  SNode,
} from "sprotty-protocol";
import {
  ControlFlowGraph,
  FlowContainer,
  FlowEdge,
  FlowNode,
  FlowSource,
  FlowSourceProvider,
} from "./control-flow-graph";
import {
  FLOW_DIAGRAM_ROOT_ID,
  FlowDiagramTypes,
  FlowEdgeData,
  FlowElementData,
  FlowNodeKind,
  FlowSourceLocation,
} from "./flow-diagram-protocol";

/** Flow diagram node as sent to the client: a Sprotty node plus PL/I specific data. */
export type FlowSNode = SNode & FlowElementData;
/** Flow diagram edge as sent to the client: a Sprotty edge plus its control path kind. */
export type FlowSEdge = SEdge & FlowEdgeData;

interface ShapeStyle {
  type: string;
  /** Horizontal padding; pointed shapes (decisions) need room for their tips. */
  paddingX: number;
  paddingY: number;
  hAlign: "left" | "center";
}

const SHAPES: Record<FlowNodeKind, ShapeStyle> = {
  entry: terminal(),
  exit: terminal(),
  "entry-point": terminal(),
  stop: terminal(),
  block: {
    type: FlowDiagramTypes.BLOCK,
    paddingX: 10,
    paddingY: 6,
    hAlign: "left",
  },
  label: {
    type: FlowDiagramTypes.BLOCK,
    paddingX: 10,
    paddingY: 4,
    hAlign: "left",
  },
  if: decision(),
  select: decision(),
  loop: {
    type: FlowDiagramTypes.LOOP,
    paddingX: 22,
    paddingY: 7,
    hAlign: "center",
  },
  call: {
    type: FlowDiagramTypes.CALL,
    paddingX: 18,
    paddingY: 7,
    hAlign: "center",
  },
  goto: jump(),
  return: jump(),
  leave: jump(),
  iterate: jump(),
  signal: jump(),
  resignal: jump(),
  on: {
    type: FlowDiagramTypes.CONDITION,
    paddingX: 14,
    paddingY: 7,
    hAlign: "center",
  },
};

function terminal(): ShapeStyle {
  return {
    type: FlowDiagramTypes.TERMINAL,
    paddingX: 18,
    paddingY: 7,
    hAlign: "center",
  };
}

function decision(): ShapeStyle {
  return {
    type: FlowDiagramTypes.DECISION,
    paddingX: 30,
    paddingY: 10,
    hAlign: "center",
  };
}

function jump(): ShapeStyle {
  return {
    type: FlowDiagramTypes.JUMP,
    paddingX: 18,
    paddingY: 7,
    hAlign: "center",
  };
}

/**
 * Maps a control flow graph onto Sprotty's graph schema.
 *
 * - Containers become `SNode`s holding a header label, their child nodes and the edges whose
 *   endpoints they both contain.
 * - Execution nodes become `SNode`s with a client-side `vbox` layout around their labels, so
 *   the webview can measure them before the extension host runs the ELK layout.
 * - Every edge sits in the lowest common container of its endpoints: ELK lays out an edge in
 *   the coordinate system of that container, and Sprotty renders it relative to its parent.
 */
export function toSprottyModel(
  graph: ControlFlowGraph,
  sources: FlowSourceProvider,
): SGraph {
  const root: SGraph = {
    type: FlowDiagramTypes.GRAPH,
    id: FLOW_DIAGRAM_ROOT_ID,
    children: [],
  };

  const containerElements = new Map<string, SNode>();
  const ordered: {
    order: number;
    parent: FlowContainer | undefined;
    element: SNode;
  }[] = [];

  for (const container of graph.containers) {
    const element = createContainer(container, sources);
    containerElements.set(container.id, element);
    ordered.push({ order: container.order, parent: container.parent, element });
  }
  const nodeContainers = new Map<string, FlowContainer | undefined>();
  for (const node of graph.nodes) {
    nodeContainers.set(node.id, node.container);
    ordered.push({
      order: node.order,
      parent: node.container,
      element: createNode(node, sources),
    });
  }

  const childrenOf = (container: FlowContainer | undefined): SModelElement[] =>
    container ? containerElements.get(container.id)!.children! : root.children;

  ordered.sort((a, b) => a.order - b.order);
  for (const { parent, element } of ordered) {
    childrenOf(parent).push(element);
  }

  for (const edge of graph.edges) {
    if (!nodeContainers.has(edge.source) || !nodeContainers.has(edge.target)) {
      continue;
    }
    const owner = commonContainer(
      nodeContainers.get(edge.source),
      nodeContainers.get(edge.target),
    );
    childrenOf(owner).push(createEdge(edge));
  }

  return root;
}

function createContainer(
  container: FlowContainer,
  sources: FlowSourceProvider,
): FlowSNode {
  const header: SLabel = {
    type: FlowDiagramTypes.CONTAINER_HEADER,
    id: `${container.id}_header`,
    text: container.title,
  };
  return {
    type: FlowDiagramTypes.CONTAINER,
    id: container.id,
    kind: container.kind,
    cssClasses: [`pli-container-${container.kind}`],
    source: toLocation(container.source, sources),
    tooltip: container.title,
    children: [header],
  };
}

function createNode(node: FlowNode, sources: FlowSourceProvider): FlowSNode {
  const shape = SHAPES[node.kind];
  const labels: SLabel[] = [
    {
      type: FlowDiagramTypes.NODE_HEADING,
      id: `${node.id}_heading`,
      text: node.heading,
    },
    ...node.details.map((text, i): SLabel => ({
      type: FlowDiagramTypes.NODE_TEXT,
      id: `${node.id}_text${i}`,
      text,
    })),
  ];
  const cssClasses = [`pli-node-${node.kind}`];
  if (node.external) {
    cssClasses.push("pli-external");
  }
  return {
    type: shape.type,
    id: node.id,
    kind: node.kind,
    cssClasses,
    source: toLocation(node.source, sources),
    tooltip: node.tooltip ?? [node.heading, ...node.details].join("\n"),
    layout: "vbox",
    layoutOptions: {
      paddingLeft: shape.paddingX,
      paddingRight: shape.paddingX,
      paddingTop: shape.paddingY,
      paddingBottom: shape.paddingY,
      vGap: 2,
      hAlign: shape.hAlign,
      resizeContainer: true,
    },
    children: labels,
  } as FlowSNode;
}

function createEdge(edge: FlowEdge): FlowSEdge {
  const children: SLabel[] = edge.label
    ? [
        {
          type: FlowDiagramTypes.EDGE_LABEL,
          id: `${edge.id}_label`,
          text: edge.label,
        },
      ]
    : [];
  return {
    type: FlowDiagramTypes.EDGE,
    id: edge.id,
    kind: edge.kind,
    sourceId: edge.source,
    targetId: edge.target,
    cssClasses: [`pli-edge-${edge.kind}`],
    children,
  };
}

/** Innermost container enclosing both containers (`undefined` = the root graph). */
export function commonContainer(
  a: FlowContainer | undefined,
  b: FlowContainer | undefined,
): FlowContainer | undefined {
  const ancestors = new Set<string>();
  for (let c = a; c; c = c.parent) {
    ancestors.add(c.id);
  }
  for (let c = b; c; c = c.parent) {
    if (ancestors.has(c.id)) {
      return c;
    }
  }
  return undefined;
}

function toLocation(
  source: FlowSource | undefined,
  sources: FlowSourceProvider,
): FlowSourceLocation | undefined {
  if (!source) {
    return undefined;
  }
  const start = sources.positionAt(source.uri, source.start);
  const end = sources.positionAt(source.uri, source.end);
  if (!start || !end) {
    return undefined;
  }
  return { uri: source.uri, range: { start, end } };
}
