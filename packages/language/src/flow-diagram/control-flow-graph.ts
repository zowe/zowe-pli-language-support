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

import {
  BeginStatement,
  CallStatement,
  DoStatement,
  getContainer,
  GoToStatement,
  IfStatement,
  IterateStatement,
  LabelReference,
  LeaveStatement,
  OnStatement,
  Package,
  ProcedureStatement,
  Program,
  ReferenceItem,
  SelectStatement,
  SignalStatement,
  Statement,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { Token } from "../parser/tokens";
import { isValidToken } from "../linking/tokens";
import {
  FlowContainerKind,
  FlowEdgeKind,
  FlowNodeKind,
  FlowPosition,
} from "./flow-diagram-protocol";
import {
  conditionKey,
  conditionToText,
  doHeaderText,
  expressionToText,
  isIterativeDo,
  labelReferenceName,
  locatorCallToText,
  normalizeSource,
  statementLabelNames,
  truncate,
} from "./statement-text";

/** A source span inside one file. Offsets are zero-based; `end` is exclusive. */
export interface FlowSource {
  uri: string;
  start: number;
  end: number;
}

/** A block-structured region drawn as a container: PROCEDURE, BEGIN, DO loop, ON-unit, PACKAGE. */
export interface FlowContainer {
  id: string;
  /** Creation order shared by containers and nodes; follows the source order. */
  order: number;
  kind: FlowContainerKind;
  title: string;
  /** Enclosing container, `undefined` for top-level containers. */
  parent: FlowContainer | undefined;
  source?: FlowSource;
}

/** An execution node: a basic block, decision, loop header, call, transfer of control, ... */
export interface FlowNode {
  id: string;
  /** Creation order shared by containers and nodes; follows the source order. */
  order: number;
  kind: FlowNodeKind;
  /** Innermost container holding this node, `undefined` for top-level nodes. */
  container: FlowContainer | undefined;
  /** First line of the node's label. */
  heading: string;
  /** Additional label lines (e.g. the statement preview of a basic block). */
  details: string[];
  /** Longer plain-text description, e.g. all statements of a basic block. */
  tooltip?: string;
  source?: FlowSource;
  /** Number of statements collapsed into a basic block. */
  statementCount?: number;
  /** A CALL whose target is not a procedure of this compilation unit. */
  external?: boolean;
}

/** A typed control path between two nodes. */
export interface FlowEdge {
  id: string;
  kind: FlowEdgeKind;
  source: string;
  target: string;
  label?: string;
}

export interface ControlFlowGraph {
  containers: FlowContainer[];
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** Access to the source files of the compilation unit, used for line numbers and previews. */
export interface FlowSourceProvider {
  /** Text between two offsets of a file, `undefined` when the file is not available. */
  getText(uri: string, start: number, end: number): string | undefined;
  /** Line/character of an offset, `undefined` when the file is not available. */
  positionAt(uri: string, offset: number): FlowPosition | undefined;
}

export interface ControlFlowGraphOptions {
  /** Number of statements previewed inside a basic block node. Defaults to 3. */
  blockPreviewStatements?: number;
  /** Number of statements listed in a basic block tooltip. Defaults to 25. */
  blockTooltipStatements?: number;
  /**
   * URI of the main file. Nodes from other files (includes) mention the file name next to
   * their line numbers.
   */
  mainUri?: string;
}

/**
 * Builds a control flow graph for a PL/I program.
 *
 * Consecutive straight-line statements are collapsed into one basic block; IF, SELECT, DO loops,
 * CALL, transfers of control (GO TO, RETURN, LEAVE, ITERATE, SIGNAL, STOP) and ON statements get
 * nodes of their own. PROCEDURE, BEGIN, iterative DO groups and ON-units become containers.
 */
export function buildControlFlowGraph(
  program: Program,
  sources: FlowSourceProvider,
  options: ControlFlowGraphOptions = {},
): ControlFlowGraph {
  return new ControlFlowGraphBuilder(sources, options).build(program);
}

/** An edge whose source is known but whose target is the next node to be created. */
interface PendingEdge {
  from: string;
  kind: FlowEdgeKind;
  label?: string;
}

/** A DO group that LEAVE / ITERATE statements can refer to. */
interface GroupContext {
  /** The statement wrapping the DO group (it carries the group's labels). */
  statement: Statement;
  labels: Set<string>;
  /** Loop header node, set for iterative groups only. */
  headerId: string | undefined;
  leaves: PendingEdge[];
}

interface ProcedureContext {
  exitId: string;
}

interface DeferredReference {
  from: string;
  /** Resolved syntax node of the reference, if the linker found one. */
  target: SyntaxNode | null | undefined;
  name: string;
}

interface OnUnitEntry {
  key: string;
  entryId: string;
}

const NON_EXECUTABLE = new Set<SyntaxKind>([
  SyntaxKind.DeclareStatement,
  SyntaxKind.DefaultStatement,
  SyntaxKind.DefineAliasStatement,
  SyntaxKind.DefineOrdinalStatement,
  SyntaxKind.DefineStructureStatement,
  SyntaxKind.FormatStatement,
  SyntaxKind.LineDirective,
  SyntaxKind.NoteDirective,
  SyntaxKind.QualifyStatement,
  SyntaxKind.ReplaceStatement,
  // Preprocessor statements never reach the PL/I AST, but stay safe.
  SyntaxKind.AnswerStatement,
  SyntaxKind.TokenStatement,
  SyntaxKind.IncludeDirective,
  SyntaxKind.IncludeAltDirective,
  SyntaxKind.InscanDirective,
  SyntaxKind.ActivateStatement,
  SyntaxKind.DeactivateStatement,
  SyntaxKind.ProcessDirective,
  SyntaxKind.ProcincDirective,
  SyntaxKind.PushDirective,
  SyntaxKind.PageDirective,
  SyntaxKind.PopDirective,
  SyntaxKind.PrintDirective,
  SyntaxKind.NoPrintDirective,
  SyntaxKind.SkipDirective,
]);

/** Statements that alter the flow of control or open a block and therefore get their own node. */
const CONTROL = new Set<SyntaxKind>([
  SyntaxKind.BeginStatement,
  SyntaxKind.CallStatement,
  SyntaxKind.DoStatement,
  SyntaxKind.EntryStatement,
  SyntaxKind.ExitStatement,
  SyntaxKind.GoToStatement,
  SyntaxKind.IfStatement,
  SyntaxKind.IterateStatement,
  SyntaxKind.LeaveStatement,
  SyntaxKind.OnStatement,
  SyntaxKind.Package,
  SyntaxKind.ProcedureStatement,
  SyntaxKind.ResignalStatement,
  SyntaxKind.ReturnStatement,
  SyntaxKind.SelectStatement,
  SyntaxKind.SignalStatement,
  SyntaxKind.StopStatement,
]);

type StatementCategory = "skip" | "simple" | "control";

function categorize(stmt: Statement): StatementCategory {
  const value = stmt.value;
  if (!value || NON_EXECUTABLE.has(value.kind)) {
    return "skip";
  }
  if (value.kind === SyntaxKind.NullStatement) {
    // A labeled null statement is a branch target; an unlabeled one does nothing.
    return stmt.labels.length > 0 ? "simple" : "skip";
  }
  return CONTROL.has(value.kind) ? "control" : "simple";
}

function validToken(token: Token | null | undefined): token is Token {
  return !!token && isValidToken(token) && token.uri !== undefined;
}

/** Source span of a whole statement, from its first token through its last one. */
function statementSource(stmt: Statement): FlowSource | undefined {
  const start = stmt.startToken;
  if (!validToken(start)) {
    return undefined;
  }
  const uri = start.uri!.toString();
  const end = stmt.endToken;
  const endOffset =
    validToken(end) &&
    end.uri!.toString() === uri &&
    end.endOffset >= start.startOffset
      ? end.endOffset + 1
      : start.endOffset + 1;
  return { uri, start: start.startOffset, end: endOffset };
}

function tokenSpan(
  first: Token | null | undefined,
  last: Token | null | undefined,
): FlowSource | undefined {
  if (!validToken(first)) {
    return undefined;
  }
  const uri = first.uri!.toString();
  const end =
    validToken(last) &&
    last.uri!.toString() === uri &&
    last.endOffset >= first.startOffset
      ? last.endOffset + 1
      : first.endOffset + 1;
  return { uri, start: first.startOffset, end };
}

/** Name of the procedure/entry a CALL targets: the last segment of a qualified reference. */
function callTargetItem(call: CallStatement): ReferenceItem | null {
  return call.call?.element?.element ?? null;
}

class ControlFlowGraphBuilder {
  private readonly containers: FlowContainer[] = [];
  private readonly nodes: FlowNode[] = [];
  private readonly edges: FlowEdge[] = [];
  private nextId = 0;
  private nextOrder = 0;

  /** Labeled statement to the first node created for it. */
  private readonly labelTargets = new Map<Statement, string>();
  /** Upper-cased label name to node, fallback when the linker did not resolve a reference. */
  private readonly labelsByName = new Map<string, string>();
  private readonly procedureEntries = new Map<Statement, string>();
  private readonly gotos: DeferredReference[] = [];
  private readonly calls: DeferredReference[] = [];
  private readonly signals: { from: string; keys: string[] }[] = [];
  private readonly onUnits: OnUnitEntry[] = [];

  private groupStack: GroupContext[] = [];
  private readonly procedureStack: ProcedureContext[] = [];

  private readonly previewCount: number;
  private readonly tooltipCount: number;

  constructor(
    private readonly sources: FlowSourceProvider,
    private readonly options: ControlFlowGraphOptions,
  ) {
    this.previewCount = options.blockPreviewStatements ?? 3;
    this.tooltipCount = options.blockTooltipStatements ?? 25;
  }

  build(program: Program): ControlFlowGraph {
    this.buildSequence(program.statements, undefined, []);
    this.resolveGotos();
    this.resolveCalls();
    this.resolveSignals();
    return {
      containers: this.containers,
      nodes: this.nodes,
      edges: this.edges,
    };
  }

  // ---------------------------------------------------------------------------
  // Graph construction primitives
  // ---------------------------------------------------------------------------

  private id(prefix: string): string {
    return `${prefix}${this.nextId++}`;
  }

  private addContainer(
    kind: FlowContainerKind,
    title: string,
    parent: FlowContainer | undefined,
    source: FlowSource | undefined,
  ): FlowContainer {
    const container: FlowContainer = {
      id: this.id("c"),
      order: this.nextOrder++,
      kind,
      title,
      parent,
      source,
    };
    this.containers.push(container);
    return container;
  }

  private addNode(
    kind: FlowNodeKind,
    container: FlowContainer | undefined,
    heading: string,
    source: FlowSource | undefined,
    extra: Partial<FlowNode> = {},
  ): FlowNode {
    const node: FlowNode = {
      id: extra.id ?? this.id("n"),
      order: this.nextOrder++,
      kind,
      container,
      heading,
      details: [],
      source,
      ...extra,
    };
    this.nodes.push(node);
    return node;
  }

  private addEdge(
    source: string,
    target: string,
    kind: FlowEdgeKind,
    label?: string,
  ): void {
    this.edges.push({ id: this.id("e"), kind, source, target, label });
  }

  private connect(pending: PendingEdge[], target: string): void {
    for (const edge of pending) {
      this.addEdge(
        edge.from,
        target,
        edge.kind,
        edge.label ?? defaultLabel(edge.kind),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Statement sequences and basic blocks
  // ---------------------------------------------------------------------------

  /**
   * Builds `statements` in order. `incoming` are the edges leading into the sequence; the
   * returned edges leave it (empty when the sequence never falls through).
   */
  private buildSequence(
    statements: Statement[],
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    let current = incoming;
    let block: Statement[] = [];
    let blockUri: string | undefined;

    const flush = () => {
      if (block.length > 0) {
        current = this.emitBlock(block, container, current);
        block = [];
        blockUri = undefined;
      }
    };

    for (const stmt of statements) {
      const category = categorize(stmt);
      if (category === "skip") {
        continue;
      }
      if (category === "simple") {
        const uri = stmt.startToken?.uri?.toString();
        // A label is a branch target, so it starts a new basic block. Blocks never span files.
        if (stmt.labels.length > 0 || (block.length > 0 && uri !== blockUri)) {
          flush();
        }
        if (block.length === 0) {
          blockUri = uri;
        }
        block.push(stmt);
        continue;
      }
      flush();
      current = this.buildLabeledControl(stmt, container, current);
    }
    flush();
    return current;
  }

  private emitBlock(
    block: Statement[],
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const first = block[0];
    const last = block[block.length - 1];
    const firstSource = statementSource(first);
    const lastSource = statementSource(last);
    const source =
      firstSource && lastSource && firstSource.uri === lastSource.uri
        ? {
            uri: firstSource.uri,
            start: firstSource.start,
            end: lastSource.end,
          }
        : firstSource;

    const labels = statementLabelNames(first);
    const heading = this.withLabels(labels, this.lineRangeText(source));
    const texts = block.map((stmt) => this.statementText(stmt));
    const details = texts.slice(0, this.previewCount);
    if (texts.length > this.previewCount) {
      const more = texts.length - this.previewCount;
      details.push(`… ${more} more statement${more === 1 ? "" : "s"}`);
    }
    const tooltipLines = block
      .slice(0, this.tooltipCount)
      .map((stmt, i) => `${this.lineNumberOf(stmt) ?? "?"}: ${texts[i]}`);
    if (block.length > this.tooltipCount) {
      tooltipLines.push(`… ${block.length - this.tooltipCount} more`);
    }

    const node = this.addNode("block", container, heading, source, {
      details,
      tooltip: tooltipLines.join("\n"),
      statementCount: block.length,
    });
    this.registerLabels(first, node.id);
    this.connect(incoming, node.id);
    return [{ from: node.id, kind: "flow" }];
  }

  // ---------------------------------------------------------------------------
  // Control statements
  // ---------------------------------------------------------------------------

  private buildLabeledControl(
    stmt: Statement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const value = stmt.value!;
    const isBlockName =
      value.kind === SyntaxKind.ProcedureStatement ||
      value.kind === SyntaxKind.Package;
    if (stmt.labels.length === 0 || isBlockName) {
      return this.buildControl(stmt, container, incoming);
    }

    // These statements produce no node of their own; a label on them needs an anchor.
    const needsAnchor =
      value.kind === SyntaxKind.LeaveStatement ||
      value.kind === SyntaxKind.IterateStatement ||
      (value.kind === SyntaxKind.DoStatement &&
        !isIterativeDo(value) &&
        value.statements.length === 0);
    if (needsAnchor) {
      const anchor = this.addNode(
        "label",
        container,
        `${statementLabelNames(stmt).join(": ")}:`,
        statementSource(stmt),
      );
      this.registerLabels(stmt, anchor.id);
      this.connect(incoming, anchor.id);
      return this.buildControl(stmt, container, [
        { from: anchor.id, kind: "flow" },
      ]);
    }

    const firstNode = this.nodes.length;
    const exits = this.buildControl(stmt, container, incoming);
    const entry = this.nodes[firstNode];
    if (entry) {
      this.registerLabels(stmt, entry.id);
    }
    return exits;
  }

  private buildControl(
    stmt: Statement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const value = stmt.value!;
    switch (value.kind) {
      case SyntaxKind.IfStatement:
        return this.buildIf(stmt, value, container, incoming);
      case SyntaxKind.DoStatement:
        return isIterativeDo(value)
          ? this.buildLoop(stmt, value, container, incoming)
          : this.buildDoGroup(stmt, value, container, incoming);
      case SyntaxKind.SelectStatement:
        return this.buildSelect(stmt, value, container, incoming);
      case SyntaxKind.BeginStatement:
        return this.buildBegin(stmt, value, container, incoming);
      case SyntaxKind.ProcedureStatement:
        // Control flows around a nested procedure; it only runs when called.
        this.buildProcedure(stmt, value, container);
        return incoming;
      case SyntaxKind.Package:
        this.buildPackage(stmt, value, container);
        return incoming;
      case SyntaxKind.CallStatement:
        return this.buildCall(stmt, value, container, incoming);
      case SyntaxKind.GoToStatement:
        return this.buildGoto(stmt, value, container, incoming);
      case SyntaxKind.ReturnStatement:
        return this.buildReturn(stmt, container, incoming);
      case SyntaxKind.StopStatement:
      case SyntaxKind.ExitStatement:
        return this.buildStop(stmt, container, incoming);
      case SyntaxKind.SignalStatement:
        return this.buildSignal(stmt, value, container, incoming);
      case SyntaxKind.ResignalStatement:
        return this.buildResignal(stmt, container, incoming);
      case SyntaxKind.OnStatement:
        return this.buildOn(stmt, value, container, incoming);
      case SyntaxKind.LeaveStatement:
        return this.buildLeave(value, incoming);
      case SyntaxKind.IterateStatement:
        return this.buildIterate(value, incoming);
      case SyntaxKind.EntryStatement:
        return this.buildEntry(stmt, container, incoming);
      default:
        return incoming;
    }
  }

  private buildIf(
    stmt: Statement,
    ifStmt: IfStatement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const condition = truncate(`IF ${expressionToText(ifStmt.expression)}`);
    const decision = this.addNode(
      "if",
      container,
      this.withLabels(statementLabelNames(stmt), condition),
      this.headerSource(stmt, ifStmt.unit?.startToken),
      { tooltip: `IF ${expressionToText(ifStmt.expression)}` },
    );
    this.connect(incoming, decision.id);
    const thenExits = this.buildSequence(
      ifStmt.unit ? [ifStmt.unit] : [],
      container,
      [{ from: decision.id, kind: "true" }],
    );
    const elseExits = this.buildSequence(
      ifStmt.else ? [ifStmt.else] : [],
      container,
      [{ from: decision.id, kind: "false" }],
    );
    return [...thenExits, ...elseExits];
  }

  private buildLoop(
    stmt: Statement,
    doStmt: DoStatement,
    parent: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const labels = statementLabelNames(stmt);
    const container = this.addContainer(
      "do-group",
      this.withLabels(labels, "DO-group"),
      parent,
      statementSource(stmt),
    );
    const headerText = `DO ${doHeaderText(doStmt)}`;
    const header = this.addNode(
      "loop",
      container,
      truncate(headerText),
      this.headerSource(stmt, doStmt.statements[0]?.startToken),
      { tooltip: headerText },
    );
    this.connect(incoming, header.id);

    const group: GroupContext = {
      statement: stmt,
      labels: new Set(labels.map((l) => l.toUpperCase())),
      headerId: header.id,
      leaves: [],
    };
    this.groupStack.push(group);
    const bodyExits = this.buildSequence(doStmt.statements, container, [
      { from: header.id, kind: "loop-body" },
    ]);
    this.groupStack.pop();

    this.connect(
      bodyExits.map((edge) => retag(edge, "loop-back")),
      header.id,
    );
    // DO LOOP only ends through LEAVE (or another transfer of control).
    const exits: PendingEdge[] = doStmt.doType4
      ? []
      : [{ from: header.id, kind: "loop-exit" }];
    return exits.concat(group.leaves);
  }

  /** A non-iterative `DO; ... END;` group is flattened into its surroundings. */
  private buildDoGroup(
    stmt: Statement,
    doStmt: DoStatement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const group: GroupContext = {
      statement: stmt,
      labels: new Set(statementLabelNames(stmt).map((l) => l.toUpperCase())),
      headerId: undefined,
      leaves: [],
    };
    this.groupStack.push(group);
    const exits = this.buildSequence(doStmt.statements, container, incoming);
    this.groupStack.pop();
    return exits.concat(group.leaves);
  }

  private buildSelect(
    stmt: Statement,
    select: SelectStatement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const subject = select.on ? ` (${expressionToText(select.on)})` : "";
    const node = this.addNode(
      "select",
      container,
      this.withLabels(statementLabelNames(stmt), truncate(`SELECT${subject}`)),
      this.headerSource(stmt, select.cases[0]?.unit?.startToken),
      { tooltip: `SELECT${subject}` },
    );
    this.connect(incoming, node.id);

    const exits: PendingEdge[] = [];
    for (const selectCase of select.cases) {
      const isWhen = selectCase.kind === SyntaxKind.WhenStatement;
      const label = isWhen
        ? truncate(
            `WHEN (${selectCase.conditions.map(expressionToText).join(", ")})`,
            32,
          )
        : "OTHERWISE";
      exits.push(
        ...this.buildSequence(
          selectCase.unit ? [selectCase.unit] : [],
          container,
          [{ from: node.id, kind: isWhen ? "case" : "otherwise", label }],
        ),
      );
    }
    // Without OTHERWISE, an unmatched SELECT raises ERROR - there is no fall-through path.
    return exits;
  }

  private buildBegin(
    stmt: Statement,
    begin: BeginStatement,
    parent: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const container = this.addContainer(
      "begin",
      this.withLabels(statementLabelNames(stmt), "BEGIN"),
      parent,
      statementSource(stmt),
    );
    return this.buildSequence(begin.statements, container, incoming);
  }

  private buildProcedure(
    stmt: Statement,
    proc: ProcedureStatement,
    parent: FlowContainer | undefined,
  ): void {
    const names = statementLabelNames(stmt);
    const name = names[0] ?? "(unnamed)";
    const container = this.addContainer(
      "procedure",
      `PROCEDURE ${name}`,
      parent,
      statementSource(stmt),
    );
    const params = proc.parameters
      .map((p) => p.ref?.text)
      .filter((p): p is string => !!p);
    const entry = this.addNode(
      "entry",
      container,
      `PROC ${name}`,
      this.headerSource(stmt, proc.statements[0]?.startToken),
      {
        details: params.length > 0 ? [truncate(`(${params.join(", ")})`)] : [],
      },
    );
    this.procedureEntries.set(stmt, entry.id);
    for (const label of names) {
      this.labelsByName.set(label.toUpperCase(), entry.id);
    }

    const exitId = this.id("n");
    this.procedureStack.push({ exitId });
    // LEAVE / ITERATE cannot reach groups outside the procedure.
    const outerGroups = this.groupStack;
    this.groupStack = [];
    const exits = this.buildSequence(proc.statements, container, [
      { from: entry.id, kind: "flow" },
    ]);
    this.groupStack = outerGroups;
    this.procedureStack.pop();

    // Created after the body so that the layout's model order puts it last.
    this.addNode(
      "exit",
      container,
      `END ${name}`,
      tokenSpan(proc.end?.endToken, proc.end?.semicolon),
      { id: exitId },
    );
    this.connect(exits, exitId);
  }

  private buildPackage(
    stmt: Statement,
    pkg: Package,
    parent: FlowContainer | undefined,
  ): void {
    const name = statementLabelNames(stmt)[0] ?? "(unnamed)";
    const container = this.addContainer(
      "package",
      `PACKAGE ${name}`,
      parent,
      statementSource(stmt),
    );
    this.buildSequence(pkg.statements, container, []);
  }

  private buildCall(
    stmt: Statement,
    call: CallStatement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const text = `CALL ${locatorCallToText(call.call)}`;
    const node = this.addNode(
      "call",
      container,
      this.withLabels(statementLabelNames(stmt), truncate(text)),
      statementSource(stmt),
      { tooltip: text },
    );
    this.connect(incoming, node.id);
    const target = callTargetItem(call);
    this.calls.push({
      from: node.id,
      target: target?.ref?.node,
      name: target?.ref?.text ?? "",
    });
    return [{ from: node.id, kind: "flow" }];
  }

  private buildGoto(
    stmt: Statement,
    goto: GoToStatement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const name = labelReferenceName(goto.label);
    const node = this.addNode(
      "goto",
      container,
      this.withLabels(statementLabelNames(stmt), `GO TO ${name}`),
      statementSource(stmt),
    );
    this.connect(incoming, node.id);
    this.gotos.push({
      from: node.id,
      target: labelReferenceTarget(goto.label),
      name,
    });
    return [];
  }

  private buildReturn(
    stmt: Statement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const value = stmt.value;
    const expression =
      value?.kind === SyntaxKind.ReturnStatement && value.expression
        ? ` (${expressionToText(value.expression)})`
        : "";
    const node = this.addNode(
      "return",
      container,
      this.withLabels(
        statementLabelNames(stmt),
        truncate(`RETURN${expression}`),
      ),
      statementSource(stmt),
    );
    this.connect(incoming, node.id);
    const procedure = this.procedureStack[this.procedureStack.length - 1];
    if (procedure) {
      this.addEdge(node.id, procedure.exitId, "return");
    }
    return [];
  }

  private buildStop(
    stmt: Statement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const keyword =
      stmt.value?.kind === SyntaxKind.ExitStatement ? "EXIT" : "STOP";
    const node = this.addNode(
      "stop",
      container,
      this.withLabels(statementLabelNames(stmt), keyword),
      statementSource(stmt),
    );
    this.connect(incoming, node.id);
    return [];
  }

  private buildSignal(
    stmt: Statement,
    signal: SignalStatement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const text = `SIGNAL ${signal.condition.map(conditionToText).join(" ")}`;
    const node = this.addNode(
      "signal",
      container,
      this.withLabels(statementLabelNames(stmt), truncate(text)),
      statementSource(stmt),
    );
    this.connect(incoming, node.id);
    this.signals.push({
      from: node.id,
      keys: signal.condition.map(conditionKey),
    });
    // After a normal return from the ON-unit, execution continues after the SIGNAL.
    return [{ from: node.id, kind: "flow" }];
  }

  private buildResignal(
    stmt: Statement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const node = this.addNode(
      "resignal",
      container,
      this.withLabels(statementLabelNames(stmt), "RESIGNAL"),
      statementSource(stmt),
    );
    this.connect(incoming, node.id);
    return [];
  }

  private buildOn(
    stmt: Statement,
    on: OnStatement,
    parent: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const conditions = on.conditions.map(conditionToText).join(" ");
    const suffix = (on.snap ? " SNAP" : "") + (on.system ? " SYSTEM" : "");
    const node = this.addNode(
      "on",
      parent,
      this.withLabels(
        statementLabelNames(stmt),
        truncate(`ON ${conditions}${suffix}`),
      ),
      this.headerSource(stmt, on.onUnit?.startToken),
    );
    this.connect(incoming, node.id);

    const unit = on.onUnit;
    if (unit && categorize(unit) !== "skip") {
      const container = this.addContainer(
        "on-unit",
        truncate(`ON-unit ${conditions}`),
        parent,
        statementSource(unit),
      );
      // A BEGIN on-unit is shown directly as the ON-unit container's content.
      const body =
        unit.value?.kind === SyntaxKind.BeginStatement &&
        unit.labels.length === 0
          ? unit.value.statements
          : [unit];
      const firstNode = this.nodes.length;
      // The ON-unit is entered asynchronously, not by falling through from here.
      const outerGroups = this.groupStack;
      this.groupStack = [];
      const exits = this.buildSequence(body, container, []);
      this.groupStack = outerGroups;
      const entry = this.nodes[firstNode];
      if (entry) {
        this.addEdge(node.id, entry.id, "on-unit");
        for (const key of on.conditions.map(conditionKey)) {
          this.onUnits.push({ key, entryId: entry.id });
        }
      }
      if (exits.length > 0) {
        const end = this.addNode("exit", container, "END ON-unit", undefined, {
          tooltip: "Normal return to the point where the condition was raised",
        });
        this.connect(exits, end.id);
      }
    }
    return [{ from: node.id, kind: "flow" }];
  }

  private buildLeave(
    leave: LeaveStatement,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const group = this.findGroup(leave.label, false);
    if (group) {
      group.leaves.push(
        ...incoming.map((edge) => retag(edge, "leave", "LEAVE")),
      );
    }
    return [];
  }

  private buildIterate(
    iterate: IterateStatement,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const group = this.findGroup(iterate.label, true);
    if (group?.headerId) {
      this.connect(
        incoming.map((edge) => retag(edge, "loop-back", "ITERATE")),
        group.headerId,
      );
    }
    return [];
  }

  private buildEntry(
    stmt: Statement,
    container: FlowContainer | undefined,
    incoming: PendingEdge[],
  ): PendingEdge[] {
    const names = statementLabelNames(stmt);
    const node = this.addNode(
      "entry-point",
      container,
      `ENTRY ${names.join(", ")}`,
      statementSource(stmt),
    );
    // Sequential execution passes over an ENTRY statement.
    this.connect(incoming, node.id);
    return [{ from: node.id, kind: "flow" }];
  }

  /**
   * DO group targeted by LEAVE / ITERATE: the labeled group if a label is given, else the
   * innermost (iterative, for ITERATE) group.
   */
  private findGroup(
    label: LabelReference | null,
    iterativeOnly: boolean,
  ): GroupContext | undefined {
    const candidates = this.groupStack.filter(
      (group) => !iterativeOnly || group.headerId !== undefined,
    );
    if (!label) {
      return candidates[candidates.length - 1];
    }
    const target = labelReferenceTarget(label);
    const targetStatement = target
      ? getContainer(target, SyntaxKind.Statement)
      : null;
    const name = labelReferenceName(label).toUpperCase();
    for (let i = candidates.length - 1; i >= 0; i--) {
      const group = candidates[i];
      if (
        (targetStatement && targetStatement === group.statement) ||
        group.labels.has(name)
      ) {
        return group;
      }
    }
    return undefined;
  }

  // ---------------------------------------------------------------------------
  // Deferred edges
  // ---------------------------------------------------------------------------

  private registerLabels(stmt: Statement, nodeId: string): void {
    if (stmt.labels.length === 0) {
      return;
    }
    this.labelTargets.set(stmt, nodeId);
    for (const label of statementLabelNames(stmt)) {
      const key = label.toUpperCase();
      if (!this.labelsByName.has(key)) {
        this.labelsByName.set(key, nodeId);
      }
    }
  }

  /** Node targeted by a reference: through the linker if possible, by name otherwise. */
  private resolveTarget(reference: DeferredReference): string | undefined {
    if (reference.target) {
      const statement = getContainer(reference.target, SyntaxKind.Statement);
      if (statement) {
        const node =
          this.procedureEntries.get(statement) ??
          this.labelTargets.get(statement);
        if (node) {
          return node;
        }
      }
    }
    return this.labelsByName.get(reference.name.toUpperCase());
  }

  private resolveGotos(): void {
    for (const goto of this.gotos) {
      const target = this.resolveTarget(goto);
      if (target) {
        this.addEdge(goto.from, target, "goto");
      }
    }
  }

  private resolveCalls(): void {
    const nodesById = new Map(this.nodes.map((node) => [node.id, node]));
    for (const call of this.calls) {
      const target = this.resolveTarget(call);
      if (target) {
        this.addEdge(call.from, target, "call");
      } else {
        nodesById.get(call.from)!.external = true;
      }
    }
  }

  private resolveSignals(): void {
    for (const signal of this.signals) {
      for (const onUnit of this.onUnits) {
        if (signal.keys.includes(onUnit.key)) {
          this.addEdge(signal.from, onUnit.entryId, "signal");
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Text helpers
  // ---------------------------------------------------------------------------

  private withLabels(labels: string[], text: string): string {
    return labels.length > 0 ? `${labels.join(": ")}: ${text}` : text;
  }

  /**
   * Span from the start of `stmt` up to (excluding) `next`, without trailing whitespace and
   * comments. Used for the "header" of compound statements, e.g. `IF A > B THEN`.
   */
  private headerSource(
    stmt: Statement,
    next: Token | null | undefined,
  ): FlowSource | undefined {
    const full = statementSource(stmt);
    if (!full) {
      return undefined;
    }
    if (
      !validToken(next) ||
      next.uri!.toString() !== full.uri ||
      next.startOffset <= full.start ||
      next.startOffset > full.end
    ) {
      return full;
    }
    const text = this.sources.getText(full.uri, full.start, next.startOffset);
    if (text === undefined) {
      return { ...full, end: next.startOffset };
    }
    return { ...full, end: full.start + trimTrailingTrivia(text).length };
  }

  private lineNumberOf(stmt: Statement): number | undefined {
    const source = statementSource(stmt);
    const position = source
      ? this.sources.positionAt(source.uri, source.start)
      : undefined;
    return position ? position.line + 1 : undefined;
  }

  private lineRangeText(source: FlowSource | undefined): string {
    if (!source) {
      return "Statements";
    }
    const start = this.sources.positionAt(source.uri, source.start);
    const end = this.sources.positionAt(
      source.uri,
      Math.max(source.start, source.end - 1),
    );
    if (!start || !end) {
      return "Statements";
    }
    const range =
      start.line === end.line
        ? `Line ${start.line + 1}`
        : `Lines ${start.line + 1}–${end.line + 1}`;
    if (this.options.mainUri && source.uri !== this.options.mainUri) {
      return `${fileName(source.uri)}: ${range}`;
    }
    return range;
  }

  private statementText(stmt: Statement): string {
    const source = statementSource(stmt);
    const text = source
      ? this.sources.getText(source.uri, source.start, source.end)
      : undefined;
    if (text) {
      return truncate(normalizeSource(text));
    }
    return describeKind(stmt);
  }
}

function labelReferenceTarget(
  label: LabelReference | null | undefined,
): SyntaxNode | null | undefined {
  return label?.label?.element?.ref?.node;
}

/**
 * Re-targets a pending edge to a LEAVE / ITERATE / loop-back destination. Sequential edges take
 * the new kind; branch edges (e.g. the `false` branch of `IF ... ELSE LEAVE;`) keep their kind
 * and get the transfer appended to their label.
 */
function retag(
  edge: PendingEdge,
  kind: FlowEdgeKind,
  transfer?: string,
): PendingEdge {
  if (edge.kind === "flow" || edge.kind === "loop-body") {
    return { from: edge.from, kind, label: edge.label };
  }
  if (!transfer) {
    return edge;
  }
  const label = edge.label ?? defaultLabel(edge.kind);
  return { ...edge, label: label ? `${label} (${transfer})` : transfer };
}

function defaultLabel(kind: FlowEdgeKind): string | undefined {
  switch (kind) {
    case "true":
      return "true";
    case "false":
      return "false";
    case "loop-exit":
      return "done";
    case "leave":
      return "LEAVE";
    default:
      return undefined;
  }
}

/** Removes trailing whitespace and block comments. */
function trimTrailingTrivia(text: string): string {
  let result = text.trimEnd();
  while (result.endsWith("*/")) {
    const start = result.lastIndexOf("/*");
    if (start < 0) {
      break;
    }
    result = result.slice(0, start).trimEnd();
  }
  return result;
}

function fileName(uri: string): string {
  const path = uri.split(/[\\/]/);
  return decodeURIComponent(path[path.length - 1] ?? uri);
}

function describeKind(stmt: Statement): string {
  const kind = stmt.value ? SyntaxKind[stmt.value.kind] : "Statement";
  return kind
    .replace(/Statement$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toUpperCase();
}
