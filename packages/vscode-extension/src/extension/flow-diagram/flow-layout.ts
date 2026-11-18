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

// Plain (non-inversify) ELK integration; this module runs in the extension host and must not
// depend on `vscode`, so it can be unit tested in Node.
import {
  DefaultElementFilter,
  DefaultLayoutConfigurator,
  ElkLayoutEngine,
  ILayoutPostprocessor,
} from "sprotty-elk/lib/elk-layout";
import type { ElkNode, LayoutOptions } from "elkjs/lib/elk-api";
import ElkConstructor from "elkjs/lib/elk.bundled.js";
import type { SEdge, SGraph, SLabel, SNode } from "sprotty-protocol";
import type { IModelLayoutEngine } from "sprotty-protocol/lib/diagram-services";
import type { SModelIndex } from "sprotty-protocol/lib/utils/model-utils";
import {
  FlowDiagramTypes,
  FlowEdgeData,
  NON_LAYOUT_EDGE_KINDS,
} from "pli-language/flow-diagram";

/** Offset of a container's title from its top-left corner. */
export const CONTAINER_HEADER_OFFSET = { x: 12, y: 8 };
const CONTAINER_PADDING = 14;

const GRAPH_OPTIONS: LayoutOptions = {
  "org.eclipse.elk.algorithm": "org.eclipse.elk.layered",
  "org.eclipse.elk.direction": "DOWN",
  // Lay out all containers in one pass so edges may cross container boundaries.
  "org.eclipse.elk.hierarchyHandling": "INCLUDE_CHILDREN",
  "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
  // Keep the source order of statements and branches where possible.
  "org.eclipse.elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
  "org.eclipse.elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  "org.eclipse.elk.spacing.nodeNode": "24",
  "org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": "30",
  "org.eclipse.elk.spacing.edgeNode": "14",
  "org.eclipse.elk.layered.spacing.edgeNodeBetweenLayers": "14",
  "org.eclipse.elk.spacing.edgeEdge": "10",
  "org.eclipse.elk.spacing.edgeLabel": "4",
  "org.eclipse.elk.spacing.componentComponent": "40",
  "org.eclipse.elk.padding": "[top=20,left=20,bottom=20,right=20]",
};

/** Labels of edges leaving a decision sit at the edge's start, next to the branch point. */
const BRANCH_EDGE_KINDS = new Set([
  "true",
  "false",
  "case",
  "otherwise",
  "loop-exit",
]);

export class FlowLayoutConfigurator extends DefaultLayoutConfigurator {
  protected override graphOptions(): LayoutOptions {
    return GRAPH_OPTIONS;
  }

  protected override nodeOptions(snode: SNode): LayoutOptions | undefined {
    if (snode.type !== FlowDiagramTypes.CONTAINER) {
      // Leaf nodes keep the size measured by the webview.
      return undefined;
    }
    const header = findHeader(snode);
    // The container must be at least as wide as its title.
    const minWidth = Math.ceil(
      (header?.size?.width ?? 80) + 2 * CONTAINER_HEADER_OFFSET.x,
    );
    const headerHeight = header?.size?.height ?? 16;
    const top = headerHeight + 2 * CONTAINER_HEADER_OFFSET.y;
    const minHeight = Math.ceil(top + 2 * CONTAINER_PADDING);
    return {
      "org.eclipse.elk.padding": `[top=${top},left=${CONTAINER_PADDING},bottom=${CONTAINER_PADDING},right=${CONTAINER_PADDING}]`,
      "org.eclipse.elk.nodeSize.constraints": "MINIMUM_SIZE",
      // elkjs 0.8 applies the minimum size of hierarchical nodes transposed when the layout
      // direction is DOWN with INCLUDE_CHILDREN, hence (height, width). Covered by the
      // "children stay inside their container" layout test.
      "org.eclipse.elk.nodeSize.minimum": `(${minHeight}, ${minWidth})`,
    };
  }

  protected override labelOptions(
    slabel: SLabel,
    index: SModelIndex,
  ): LayoutOptions | undefined {
    if (slabel.type !== FlowDiagramTypes.EDGE_LABEL) {
      return undefined;
    }
    const edge = index.getParent(slabel.id) as
      (SEdge & Partial<FlowEdgeData>) | undefined;
    const atTail = edge?.kind !== undefined && BRANCH_EDGE_KINDS.has(edge.kind);
    return {
      "org.eclipse.elk.edgeLabels.placement": atTail ? "TAIL" : "CENTER",
    };
  }
}

export class FlowElementFilter extends DefaultElementFilter {
  protected override filterEdge(edge: SEdge, index: SModelIndex): boolean {
    // Calls and signals relate distant parts of the program; letting them pull nodes around
    // would wreck the flow layout. They are drawn as straight overlay lines instead.
    const kind = (edge as SEdge & Partial<FlowEdgeData>).kind;
    if (kind && NON_LAYOUT_EDGE_KINDS.includes(kind)) {
      return false;
    }
    return super.filterEdge(edge, index);
  }

  protected override filterLabel(label: SLabel): boolean {
    // Node labels were already arranged by the webview's vbox layout.
    return (
      label.type === FlowDiagramTypes.CONTAINER_HEADER ||
      label.type === FlowDiagramTypes.EDGE_LABEL
    );
  }
}

/** Pins container titles to the top-left corner reserved for them by the container padding. */
export class FlowLayoutPostprocessor implements ILayoutPostprocessor {
  postprocess(elkGraph: ElkNode, _sgraph: SGraph, index: SModelIndex): void {
    const visit = (node: ElkNode) => {
      const element = index.getById(node.id);
      if (element?.type === FlowDiagramTypes.CONTAINER) {
        for (const label of node.labels ?? []) {
          label.x = CONTAINER_HEADER_OFFSET.x;
          label.y = CONTAINER_HEADER_OFFSET.y;
        }
      }
      node.children?.forEach(visit);
    };
    visit(elkGraph);
  }
}

/** ELK layered layout of the flow diagram, run in the extension host. */
export function createFlowLayoutEngine(): IModelLayoutEngine {
  return new ElkLayoutEngine(
    () => new ElkConstructor({ algorithms: ["layered"] }),
    new FlowElementFilter(),
    new FlowLayoutConfigurator(),
    undefined,
    new FlowLayoutPostprocessor(),
  ) as IModelLayoutEngine;
}

function findHeader(snode: SNode): SLabel | undefined {
  return snode.children?.find(
    (child): child is SLabel =>
      child.type === FlowDiagramTypes.CONTAINER_HEADER,
  );
}
