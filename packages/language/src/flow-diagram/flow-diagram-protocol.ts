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

/**
 * Shared vocabulary of the PL/I flow diagram, used by the language server (which builds the
 * Sprotty model), the extension host (which lays it out) and the webview (which renders it).
 *
 * This module must stay free of imports: the webview bundle pulls it in through the
 * `pli-language/flow-diagram` entry point and must not drag the language server along.
 */

/** Diagram type used in the Sprotty diagram identifier. */
export const FLOW_DIAGRAM_TYPE = "pli-flow-diagram";

/** Id of the root graph element of every flow diagram. */
export const FLOW_DIAGRAM_ROOT_ID = "pli-flow-root";

/**
 * Sprotty model element types. The part before the colon is Sprotty's basic type
 * (`node`, `edge`, `label`), which the layout engine relies on.
 */
export namespace FlowDiagramTypes {
  export const GRAPH = "graph";
  /** Container node: PACKAGE, PROCEDURE, BEGIN, iterative DO group, ON-unit. */
  export const CONTAINER = "node:pli-container";
  /** Procedure entry/exit, STOP, EXIT, secondary ENTRY points. */
  export const TERMINAL = "node:pli-terminal";
  /** Basic block: consecutive straight-line statements collapsed into one node. */
  export const BLOCK = "node:pli-block";
  /** IF and SELECT. */
  export const DECISION = "node:pli-decision";
  /** Header of an iterative DO group (WHILE / UNTIL / controlled / LOOP). */
  export const LOOP = "node:pli-loop";
  /** CALL statement. */
  export const CALL = "node:pli-call";
  /** Unconditional transfers: GO TO, RETURN, LEAVE, ITERATE, SIGNAL, RESIGNAL. */
  export const JUMP = "node:pli-jump";
  /** ON statement establishing an ON-unit. */
  export const CONDITION = "node:pli-condition";
  /** Every control path. Its `kind` property tells the {@link FlowEdgeKind}. */
  export const EDGE = "edge:pli-flow";
  export const CONTAINER_HEADER = "label:pli-container-header";
  export const NODE_HEADING = "label:pli-heading";
  export const NODE_TEXT = "label:pli-text";
  export const EDGE_LABEL = "label:pli-edge";
}

export type FlowContainerKind =
  | "package"
  | "procedure"
  | "begin"
  /** Iterative DO group; its loop header is a node of kind `loop` inside it. */
  | "do-group"
  | "on-unit";

export type FlowNodeKind =
  /** Procedure entry. */
  | "entry"
  /** Procedure end (normal termination or RETURN target). */
  | "exit"
  /** Secondary entry point (ENTRY statement). */
  | "entry-point"
  | "block"
  | "if"
  | "select"
  | "loop"
  | "call"
  | "goto"
  | "return"
  | "stop"
  | "signal"
  | "resignal"
  | "leave"
  | "iterate"
  | "on"
  /** Pass-through node for a label that does not prefix any other node. */
  | "label";

export type FlowEdgeKind =
  /** Sequential fall-through. */
  | "flow"
  /** IF condition holds. */
  | "true"
  /** IF condition does not hold. */
  | "false"
  /** SELECT: a WHEN clause. */
  | "case"
  /** SELECT: the OTHERWISE clause. */
  | "otherwise"
  /** Loop header into the loop body. */
  | "loop-body"
  /** End of the loop body (or ITERATE) back to the loop header. */
  | "loop-back"
  /** Loop header to the statement after the group. */
  | "loop-exit"
  /** GO TO a label. */
  | "goto"
  /** RETURN to the procedure end. */
  | "return"
  /** LEAVE out of a DO group. */
  | "leave"
  /** ON statement to the ON-unit it establishes. */
  | "on-unit"
  /** SIGNAL to an ON-unit for the same condition. Not part of the layout. */
  | "signal"
  /** CALL to the called procedure. Not part of the layout. */
  | "call";

/** Edge kinds that relate code without being a sequential control path; excluded from layout. */
export const NON_LAYOUT_EDGE_KINDS: readonly FlowEdgeKind[] = [
  "call",
  "signal",
];

export interface FlowPosition {
  /** Zero-based line. */
  line: number;
  /** Zero-based character. */
  character: number;
}

/** Source location of a diagram element, in LSP coordinates. */
export interface FlowSourceLocation {
  uri: string;
  range: { start: FlowPosition; end: FlowPosition };
}

/** Extra properties carried by flow diagram nodes and containers in the Sprotty model. */
export interface FlowElementData {
  kind: FlowNodeKind | FlowContainerKind;
  source?: FlowSourceLocation;
  /** Plain text shown as a native tooltip. */
  tooltip?: string;
}

/** Extra properties carried by flow diagram edges in the Sprotty model. */
export interface FlowEdgeData {
  kind: FlowEdgeKind;
}
