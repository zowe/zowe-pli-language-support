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

import { Container, ContainerModule } from "inversify";
import {
  ConsoleLogger,
  configureModelElement,
  edgeLayoutFeature,
  editFeature,
  loadDefaultModules,
  LogLevel,
  moveFeature,
  openFeature,
  overrideViewerOptions,
  SGraphImpl,
  SGraphView,
  SLabelImpl,
  SLabelView,
  TYPES,
} from "sprotty";
import { FlowDiagramTypes } from "pli-language/flow-diagram";
import {
  FlowContainerView,
  FlowEdgeImpl,
  FlowEdgeView,
  FlowNodeImpl,
  FlowNodeView,
} from "./views";

const EXECUTION_NODE_TYPES = [
  FlowDiagramTypes.TERMINAL,
  FlowDiagramTypes.BLOCK,
  FlowDiagramTypes.DECISION,
  FlowDiagramTypes.LOOP,
  FlowDiagramTypes.CALL,
  FlowDiagramTypes.JUMP,
  FlowDiagramTypes.CONDITION,
];

const flowDiagramModule = new ContainerModule(
  (bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(
      context,
      FlowDiagramTypes.GRAPH,
      SGraphImpl,
      SGraphView,
    );
    // Nodes are laid out by ELK; dragging them would detach them from their routed edges.
    // Double-click (open) reveals the node's source and focuses the editor.
    const nodeFeatures = { enable: [openFeature], disable: [moveFeature] };
    configureModelElement(
      context,
      FlowDiagramTypes.CONTAINER,
      FlowNodeImpl,
      FlowContainerView,
      nodeFeatures,
    );
    for (const type of EXECUTION_NODE_TYPES) {
      configureModelElement(
        context,
        type,
        FlowNodeImpl,
        FlowNodeView,
        nodeFeatures,
      );
    }
    configureModelElement(
      context,
      FlowDiagramTypes.EDGE,
      FlowEdgeImpl,
      FlowEdgeView,
      {
        disable: [editFeature],
      },
    );
    configureModelElement(
      context,
      FlowDiagramTypes.CONTAINER_HEADER,
      SLabelImpl,
      SLabelView,
    );
    configureModelElement(
      context,
      FlowDiagramTypes.NODE_HEADING,
      SLabelImpl,
      SLabelView,
    );
    configureModelElement(
      context,
      FlowDiagramTypes.NODE_TEXT,
      SLabelImpl,
      SLabelView,
    );
    // Edge labels keep the position computed by ELK.
    configureModelElement(
      context,
      FlowDiagramTypes.EDGE_LABEL,
      SLabelImpl,
      SLabelView,
      {
        disable: [edgeLayoutFeature],
      },
    );
  },
);

export function createFlowDiagramContainer(widgetId: string): Container {
  const container = new Container();
  loadDefaultModules(container);
  container.load(flowDiagramModule);
  overrideViewerOptions(container, {
    // The webview measures labels and nodes; the extension host runs ELK with those sizes.
    needsClientLayout: true,
    needsServerLayout: true,
    baseDiv: widgetId,
    hiddenDiv: widgetId + "_hidden",
  });
  return container;
}
