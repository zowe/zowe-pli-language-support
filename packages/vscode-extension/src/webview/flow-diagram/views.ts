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

import { decorate, injectable } from "inversify";
import {
  PolylineEdgeView,
  RenderingContext,
  SEdgeImpl,
  ShapeView,
  SNodeImpl,
  svg,
} from "sprotty";
import type { Point } from "sprotty-protocol";
import {
  FlowDiagramTypes,
  FlowEdgeKind,
  FlowSourceLocation,
} from "pli-language/flow-diagram";

/** Snabbdom virtual node (snabbdom itself is only a transitive dependency via sprotty). */
type VNode = ReturnType<typeof svg>;

/** Client-side flow diagram node; the model factory copies `kind`, `tooltip` and `source`. */
export class FlowNodeImpl extends SNodeImpl {
  kind = "";
  tooltip?: string;
  source?: FlowSourceLocation;
}

export class FlowEdgeImpl extends SEdgeImpl {
  kind: FlowEdgeKind = "flow";
}

/** Native SVG tooltip. */
function title(text: string | undefined): VNode[] {
  return text ? [svg("title", null, text)] : [];
}

function polygon(points: [number, number][]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

/**
 * Renders execution nodes with the classic flowchart shape of their type: pill for terminals,
 * pointed hexagon for decisions, hexagon for loop headers, double-barred box for calls, ...
 */
export class FlowNodeView extends ShapeView {
  render(
    node: Readonly<FlowNodeImpl>,
    context: RenderingContext,
  ): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined;
    }
    const width = Math.max(node.size.width, 0);
    const height = Math.max(node.size.height, 0);
    return svg(
      "g",
      {
        "class-pli-node": true,
        "class-selected": node.selected,
        "class-mouseover": node.hoverFeedback,
      },
      ...title(node.tooltip),
      ...this.renderShape(node.type, width, height),
      ...context.renderChildren(node),
    );
  }

  protected renderShape(type: string, w: number, h: number): VNode[] {
    const shape = { "class-pli-shape": true };
    switch (type) {
      case FlowDiagramTypes.TERMINAL:
        return [
          svg("rect", {
            ...shape,
            x: 0,
            y: 0,
            width: w,
            height: h,
            rx: h / 2,
            ry: h / 2,
          }),
        ];
      case FlowDiagramTypes.DECISION: {
        const tip = Math.min(26, w / 4);
        return [
          svg("polygon", {
            ...shape,
            points: polygon([
              [0, h / 2],
              [tip, 0],
              [w - tip, 0],
              [w, h / 2],
              [w - tip, h],
              [tip, h],
            ]),
          }),
        ];
      }
      case FlowDiagramTypes.LOOP: {
        const tip = Math.min(14, w / 4);
        return [
          svg("polygon", {
            ...shape,
            points: polygon([
              [0, h / 2],
              [tip, 0],
              [w - tip, 0],
              [w, h / 2],
              [w - tip, h],
              [tip, h],
            ]),
          }),
        ];
      }
      case FlowDiagramTypes.CALL:
        return [
          svg("rect", {
            ...shape,
            x: 0,
            y: 0,
            width: w,
            height: h,
            rx: 2,
            ry: 2,
          }),
          svg("line", {
            "class-pli-call-bar": true,
            x1: 7,
            y1: 0,
            x2: 7,
            y2: h,
          }),
          svg("line", {
            "class-pli-call-bar": true,
            x1: w - 7,
            y1: 0,
            x2: w - 7,
            y2: h,
          }),
        ];
      case FlowDiagramTypes.JUMP: {
        const slant = Math.min(10, w / 6);
        return [
          svg("polygon", {
            ...shape,
            points: polygon([
              [slant, 0],
              [w, 0],
              [w - slant, h],
              [0, h],
            ]),
          }),
        ];
      }
      case FlowDiagramTypes.CONDITION: {
        const notch = Math.min(10, w / 6);
        return [
          svg("polygon", {
            ...shape,
            points: polygon([
              [0, 0],
              [w, 0],
              [w - notch, h / 2],
              [w, h],
              [0, h],
            ]),
          }),
        ];
      }
      default:
        return [
          svg("rect", {
            ...shape,
            x: 0,
            y: 0,
            width: w,
            height: h,
            rx: 3,
            ry: 3,
          }),
        ];
    }
  }
}

/** PROCEDURE / BEGIN / DO-group / ON-unit / PACKAGE container. */
export class FlowContainerView extends ShapeView {
  render(
    node: Readonly<FlowNodeImpl>,
    context: RenderingContext,
  ): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined;
    }
    const width = Math.max(node.size.width, 0);
    const height = Math.max(node.size.height, 0);
    return svg(
      "g",
      {
        "class-pli-container": true,
        "class-selected": node.selected,
        "class-mouseover": node.hoverFeedback,
      },
      ...title(node.tooltip),
      svg("rect", {
        "class-pli-container-frame": true,
        x: 0,
        y: 0,
        width,
        height,
        rx: 6,
        ry: 6,
      }),
      ...context.renderChildren(node),
    );
  }
}

/** Polyline edge with an arrowhead at the target. */
export class FlowEdgeView extends PolylineEdgeView {
  protected override renderAdditionals(
    _edge: SEdgeImpl,
    segments: Point[],
  ): VNode[] {
    if (segments.length < 2) {
      return [];
    }
    const end = segments[segments.length - 1];
    const before = segments[segments.length - 2];
    const angle =
      (Math.atan2(end.y - before.y, end.x - before.x) * 180) / Math.PI;
    return [
      svg("path", {
        "class-pli-arrow": true,
        d: "M 0,0 L -9,-4.5 L -9,4.5 Z",
        transform: `translate(${end.x},${end.y}) rotate(${angle})`,
      }),
    ];
  }
}

// Inversify needs metadata on every class it instantiates; `decorate` avoids decorator syntax.
decorate(injectable(), FlowNodeView);
decorate(injectable(), FlowContainerView);
decorate(injectable(), FlowEdgeView);
