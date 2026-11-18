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

import { afterEach, describe, expect, test } from "vitest";
import { parse } from "../utils";
import {
  buildControlFlowGraph,
  ControlFlowGraph,
  ControlFlowGraphOptions,
  FlowEdge,
  FlowNode,
} from "../../src/flow-diagram/control-flow-graph";
import { createSourceProvider } from "../../src/language-server/flow-diagram-request";
import { FlowNodeKind } from "../../src/flow-diagram/flow-diagram-protocol";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { deserializeProcessGroup } from "../../src/workspace/plugin-configuration-provider";
import { UriUtils } from "../../src/utils/uri";
import { makeProgramConfig } from "../config-fixtures";
import {
  createTestWorkspace,
  setDefaultTestWorkspace,
} from "../test-workspace";

/** Query helpers over a built graph; nodes are addressed by their heading. */
class Graph {
  constructor(
    readonly graph: ControlFlowGraph,
    readonly text: string,
  ) {}

  node(heading: string): FlowNode {
    const matches = this.graph.nodes.filter((n) => n.heading === heading);
    if (matches.length !== 1) {
      throw new Error(
        `Expected one node "${heading}", found ${matches.length}. Nodes: ${this.graph.nodes
          .map((n) => JSON.stringify(n.heading))
          .join(", ")}`,
      );
    }
    return matches[0];
  }

  ofKind(kind: FlowNodeKind): FlowNode[] {
    return this.graph.nodes.filter((n) => n.kind === kind);
  }

  private heading(id: string): string {
    return this.graph.nodes.find((n) => n.id === id)?.heading ?? id;
  }

  private format(edge: FlowEdge): string {
    const label = edge.label ? `[${edge.label}]` : "";
    return `${this.heading(edge.source)} -${edge.kind}${label}-> ${this.heading(edge.target)}`;
  }

  /** Outgoing edges of a node as `source -kind[label]-> target`. */
  from(heading: string): string[] {
    const id = this.node(heading).id;
    return this.graph.edges
      .filter((e) => e.source === id)
      .map((e) => this.format(e));
  }

  /** Incoming edges of a node as `source -kind[label]-> target`. */
  to(heading: string): string[] {
    const id = this.node(heading).id;
    return this.graph.edges
      .filter((e) => e.target === id)
      .map((e) => this.format(e));
  }

  /** Source text a node points at. */
  sourceText(heading: string): string | undefined {
    const source = this.node(heading).source;
    return source ? this.text.slice(source.start, source.end) : undefined;
  }
}

async function build(
  text: string,
  options?: ControlFlowGraphOptions,
): Promise<Graph> {
  const unit = await parse(text, { validate: true });
  const graph = buildControlFlowGraph(unit.ast, createSourceProvider(unit), {
    mainUri: unit.uri.toString(),
    ...options,
  });
  return new Graph(graph, text);
}

/** Wraps statements into a main procedure, one statement per line starting at line 2. */
function program(...lines: string[]): string {
  return [
    " MAIN: PROC OPTIONS(MAIN);",
    ...lines.map((l) => `   ${l}`),
    " END MAIN;",
  ].join("\n");
}

describe("Control flow graph", () => {
  describe("basic blocks", () => {
    test("collapses consecutive straight-line statements into one block", async () => {
      const g = await build(
        program(
          "DCL (A, B) FIXED BIN(31);",
          "A = 1;",
          "B = A + 2;",
          "PUT SKIP LIST(A, B);",
          "DCL C CHAR(8);",
          "C = 'X';",
          "PUT SKIP LIST(C);",
        ),
      );
      const blocks = g.ofKind("block");
      expect(blocks).toHaveLength(1);
      const block = blocks[0];
      // Declarations are not executable and do not appear in the block.
      expect(block.statementCount).toBe(5);
      expect(block.heading).toBe("Lines 3–8");
      expect(block.details).toEqual([
        "A = 1;",
        "B = A + 2;",
        "PUT SKIP LIST(A, B);",
        "… 2 more statements",
      ]);
      expect(block.tooltip?.split("\n")).toEqual([
        "3: A = 1;",
        "4: B = A + 2;",
        "5: PUT SKIP LIST(A, B);",
        "7: C = 'X';",
        "8: PUT SKIP LIST(C);",
      ]);
      expect(g.from("PROC MAIN")).toEqual(["PROC MAIN -flow-> Lines 3–8"]);
      expect(g.from("Lines 3–8")).toEqual(["Lines 3–8 -flow-> END MAIN"]);
    });

    test("number of previewed statements is configurable", async () => {
      const g = await build(program("A = 1;", "B = 2;", "C = 3;"), {
        blockPreviewStatements: 1,
      });
      expect(g.node("Lines 2–4").details).toEqual([
        "A = 1;",
        "… 2 more statements",
      ]);
    });

    test("a label starts a new block because it is a branch target", async () => {
      const g = await build(
        program("A = 1;", "B = 2;", "AGAIN: C = 3;", "D = 4;"),
      );
      expect(g.ofKind("block").map((b) => b.heading)).toEqual([
        "Lines 2–3",
        "AGAIN: Lines 4–5",
      ]);
      expect(g.from("Lines 2–3")).toEqual([
        "Lines 2–3 -flow-> AGAIN: Lines 4–5",
      ]);
    });

    test("an unlabeled null statement disappears, a labeled one is kept as a target", async () => {
      const g = await build(program(";", "A = 1;", "GO TO SKIP;", "SKIP: ;"));
      expect(g.ofKind("block").map((b) => b.heading)).toEqual([
        "Line 3",
        "SKIP: Line 5",
      ]);
      expect(g.from("GO TO SKIP")).toEqual(["GO TO SKIP -goto-> SKIP: Line 5"]);
    });

    test("an empty procedure flows from entry to end", async () => {
      const g = await build(program());
      expect(g.from("PROC MAIN")).toEqual(["PROC MAIN -flow-> END MAIN"]);
    });
  });

  describe("decisions", () => {
    test("IF / THEN / ELSE branches join at the next statement", async () => {
      const g = await build(
        program("IF A > B THEN", "  X = 1;", "ELSE", "  X = 2;", "Y = X;"),
      );
      expect(g.from("IF A > B")).toEqual([
        "IF A > B -true[true]-> Line 3",
        "IF A > B -false[false]-> Line 5",
      ]);
      expect(g.to("Line 6")).toEqual([
        "Line 3 -flow-> Line 6",
        "Line 5 -flow-> Line 6",
      ]);
      // The decision points at the IF header only, not at its branches.
      expect(g.sourceText("IF A > B")).toBe("IF A > B THEN");
    });

    test("IF without ELSE falls through on false", async () => {
      const g = await build(program("IF A = 0 THEN X = 1;", "Y = 2;"));
      expect(g.from("IF A = 0")).toEqual([
        "IF A = 0 -true[true]-> Line 2",
        "IF A = 0 -false[false]-> Line 3",
      ]);
    });

    test("a non-iterative DO group is flattened into its surroundings", async () => {
      const g = await build(
        program("IF A = 0 THEN DO;", "  X = 1;", "  Y = 2;", "END;", "Z = 3;"),
      );
      expect(g.graph.containers.map((c) => c.kind)).toEqual(["procedure"]);
      expect(g.from("IF A = 0")).toEqual([
        "IF A = 0 -true[true]-> Lines 3–4",
        "IF A = 0 -false[false]-> Line 6",
      ]);
    });

    test("SELECT branches into one edge per WHEN and OTHERWISE", async () => {
      const g = await build(
        program(
          "SELECT (CODE);",
          "  WHEN (1, 2) X = 1;",
          "  WHEN (3) X = 2;",
          "  OTHERWISE X = 0;",
          "END;",
          "Y = X;",
        ),
      );
      expect(g.from("SELECT (CODE)")).toEqual([
        "SELECT (CODE) -case[WHEN (1, 2)]-> Line 3",
        "SELECT (CODE) -case[WHEN (3)]-> Line 4",
        "SELECT (CODE) -otherwise[OTHERWISE]-> Line 5",
      ]);
      expect(g.to("Line 7")).toHaveLength(3);
    });

    test("SELECT without OTHERWISE has no fall-through path", async () => {
      const g = await build(
        program("SELECT;", "  WHEN (A > 1) X = 1;", "END;", "Y = X;"),
      );
      expect(g.from("SELECT")).toEqual(["SELECT -case[WHEN (A > 1)]-> Line 3"]);
      expect(g.to("Line 5")).toEqual(["Line 3 -flow-> Line 5"]);
    });
  });

  describe("loops", () => {
    test("DO WHILE becomes a DO-group container with header, body, back edge and exit", async () => {
      const g = await build(
        program("DO WHILE (I < 10);", "  I = I + 1;", "END;", "PUT LIST(I);"),
      );
      const header = g.node("DO WHILE (I < 10)");
      expect(header.kind).toBe("loop");
      expect(header.container?.kind).toBe("do-group");
      expect(header.container?.parent?.kind).toBe("procedure");
      expect(g.node("Line 3").container).toBe(header.container);
      expect(g.from("DO WHILE (I < 10)")).toEqual([
        "DO WHILE (I < 10) -loop-body-> Line 3",
        "DO WHILE (I < 10) -loop-exit[done]-> Line 5",
      ]);
      expect(g.from("Line 3")).toEqual([
        "Line 3 -loop-back-> DO WHILE (I < 10)",
      ]);
    });

    test("loop headers render controlled, UNTIL and LOOP forms", async () => {
      const g = await build(
        program(
          "DO I = 1 TO N BY 2;",
          "  X = I;",
          "END;",
          "DO UNTIL (EOF);",
          "  X = 0;",
          "END;",
          "DO J = 1, 3 TO 5 WHILE (OK);",
          "  X = J;",
          "END;",
          "DO LOOP;",
          "  LEAVE;",
          "END;",
        ),
      );
      expect(g.ofKind("loop").map((n) => n.heading)).toEqual([
        "DO I = 1 TO N BY 2",
        "DO UNTIL (EOF)",
        "DO J = 1, 3 TO 5 WHILE (OK)",
        "DO LOOP",
      ]);
    });

    test("DO LOOP only ends through LEAVE", async () => {
      const g = await build(
        program(
          "DO LOOP;",
          "  X = X + 1;",
          "  IF X > 9 THEN LEAVE;",
          "END;",
          "Y = X;",
        ),
      );
      expect(g.from("DO LOOP")).toEqual(["DO LOOP -loop-body-> Line 3"]);
      // LEAVE edges are emitted when the group closes, hence the sorting.
      expect(g.from("IF X > 9").sort()).toEqual([
        "IF X > 9 -false[false]-> DO LOOP",
        "IF X > 9 -true[true (LEAVE)]-> Line 6",
      ]);
    });

    test("a sequential LEAVE becomes a leave edge out of the group", async () => {
      const g = await build(
        program("DO WHILE (A);", "  X = 1;", "  LEAVE;", "END;", "Y = 2;"),
      );
      expect(g.from("Line 3")).toEqual(["Line 3 -leave[LEAVE]-> Line 6"]);
      expect(g.to("DO WHILE (A)")).toEqual(["PROC MAIN -flow-> DO WHILE (A)"]);
    });

    test("LEAVE with a label exits the labeled outer loop", async () => {
      const g = await build(
        program(
          "OUTER: DO I = 1 TO 10;",
          "  DO J = 1 TO 10;",
          "    IF J = I THEN LEAVE OUTER;",
          "  END;",
          "END OUTER;",
          "PUT LIST(I);",
        ),
      );
      expect(g.from("IF J = I").sort()).toEqual([
        "IF J = I -false[false]-> DO J = 1 TO 10",
        "IF J = I -true[true (LEAVE)]-> Line 7",
      ]);
      expect(g.node("DO I = 1 TO 10").container?.title).toBe("OUTER: DO-group");
    });

    test("ITERATE returns to the loop header", async () => {
      const g = await build(
        program(
          "DO I = 1 TO N;",
          "  IF I = 3 THEN ITERATE;",
          "  X = X + I;",
          "END;",
        ),
      );
      expect(g.from("IF I = 3")).toEqual([
        "IF I = 3 -true[true (ITERATE)]-> DO I = 1 TO N",
        "IF I = 3 -false[false]-> Line 4",
      ]);
    });

    test("labeled loops carry the label on the header and the container", async () => {
      const g = await build(
        program("READ_LOOP: DO WHILE (MORE);", "  CALL NEXT;", "END;"),
      );
      const header = g.node("DO WHILE (MORE)");
      expect(header.container?.title).toBe("READ_LOOP: DO-group");
    });
  });

  describe("transfers of control", () => {
    test("GO TO jumps to the labeled statement and does not fall through", async () => {
      const g = await build(program("GO TO DONE;", "X = 1;", "DONE: Y = 2;"));
      expect(g.from("GO TO DONE")).toEqual(["GO TO DONE -goto-> DONE: Line 4"]);
      // Unreachable code stays visible, without incoming edges.
      expect(g.to("Line 3")).toEqual([]);
    });

    test("GO TO a labeled loop targets the loop header", async () => {
      const g = await build(
        program(
          "AGAIN: DO WHILE (A);",
          "  A = 0;",
          "END;",
          "IF B THEN GO TO AGAIN;",
        ),
      );
      expect(g.from("GO TO AGAIN")).toEqual([
        "GO TO AGAIN -goto-> DO WHILE (A)",
      ]);
    });

    test("RETURN leads to the end of the procedure", async () => {
      const g = await build(program("IF A THEN RETURN;", "X = 1;"));
      expect(g.from("RETURN")).toEqual(["RETURN -return-> END MAIN"]);
      expect(g.to("END MAIN")).toEqual([
        "RETURN -return-> END MAIN",
        "Line 3 -flow-> END MAIN",
      ]);
    });

    test("STOP ends the program", async () => {
      const g = await build(program("STOP;", "X = 1;"));
      expect(g.node("STOP").kind).toBe("stop");
      expect(g.from("STOP")).toEqual([]);
    });
  });

  describe("procedures and calls", () => {
    test("internal procedures are separate containers bypassed by the main flow", async () => {
      const g = await build(
        program(
          "CALL SUB(1);",
          "X = 2;",
          "SUB: PROC(P);",
          "  DCL P FIXED BIN(31);",
          "  PUT LIST(P);",
          "END SUB;",
          "Y = 3;",
        ),
      );
      const sub = g.node("PROC SUB");
      expect(sub.container?.kind).toBe("procedure");
      expect(sub.container?.title).toBe("PROCEDURE SUB");
      expect(sub.container?.parent?.title).toBe("PROCEDURE MAIN");
      expect(sub.details).toEqual(["(P)"]);
      expect(g.from("CALL SUB(1)")).toEqual([
        "CALL SUB(1) -flow-> Line 3",
        "CALL SUB(1) -call-> PROC SUB",
      ]);
      // The nested procedure is skipped by sequential flow.
      expect(g.from("Line 3")).toEqual(["Line 3 -flow-> Line 8"]);
      expect(g.from("PROC SUB")).toEqual(["PROC SUB -flow-> Line 6"]);
      expect(g.from("Line 6")).toEqual(["Line 6 -flow-> END SUB"]);
    });

    test("calls to procedures outside the program are marked external", async () => {
      const g = await build(
        program("DCL EXTPROC ENTRY EXTERNAL;", "CALL EXTPROC;"),
      );
      expect(g.node("CALL EXTPROC").external).toBe(true);
      expect(g.from("CALL EXTPROC")).toEqual(["CALL EXTPROC -flow-> END MAIN"]);
    });

    test("a CALL to a secondary ENTRY resolves to the entry point", async () => {
      const g = await build(
        program(
          "CALL ALT;",
          "SUB: PROC;",
          "  X = 1;",
          "ALT: ENTRY;",
          "  X = 2;",
          "END SUB;",
        ),
      );
      expect(g.node("ENTRY ALT").kind).toBe("entry-point");
      expect(g.from("CALL ALT")).toContain("CALL ALT -call-> ENTRY ALT");
      // Sequential execution passes over the ENTRY statement.
      expect(g.to("ENTRY ALT")).toContain("Line 4 -flow-> ENTRY ALT");
    });

    test("BEGIN blocks are containers on the sequential path", async () => {
      const g = await build(program("BEGIN;", "  X = 1;", "END;", "Y = 2;"));
      const block = g.node("Line 3");
      expect(block.container?.kind).toBe("begin");
      expect(g.from("PROC MAIN")).toEqual(["PROC MAIN -flow-> Line 3"]);
      expect(g.from("Line 3")).toEqual(["Line 3 -flow-> Line 5"]);
    });

    test("packages hold their procedures", async () => {
      const g = await build(
        [
          " PKG: PACKAGE;",
          " P1: PROC;",
          "   X = 1;",
          " END P1;",
          " P2: PROC;",
          "   CALL P1;",
          " END P2;",
          " END PKG;",
        ].join("\n"),
      );
      expect(
        g.graph.containers.map((c) => [c.kind, c.title, c.parent?.title]),
      ).toEqual([
        ["package", "PACKAGE PKG", undefined],
        ["procedure", "PROCEDURE P1", "PACKAGE PKG"],
        ["procedure", "PROCEDURE P2", "PACKAGE PKG"],
      ]);
      expect(g.from("CALL P1")).toContain("CALL P1 -call-> PROC P1");
    });
  });

  describe("condition handling", () => {
    test("an ON statement establishes an ON-unit container", async () => {
      const g = await build(
        program(
          "DCL F FILE;",
          "ON ENDFILE(F) EOF = '1'B;",
          "READ FILE(F) INTO(R);",
        ),
      );
      const on = g.node("ON ENDFILE(F)");
      expect(g.from("ON ENDFILE(F)")).toEqual([
        "ON ENDFILE(F) -on-unit-> Line 3",
        "ON ENDFILE(F) -flow-> Line 4",
      ]);
      const body = g.node("Line 3");
      expect(body.container?.kind).toBe("on-unit");
      expect(body.container?.title).toBe("ON-unit ENDFILE(F)");
      expect(body.container?.parent).toBe(on.container);
      expect(g.from("Line 3")).toEqual(["Line 3 -flow-> END ON-unit"]);
      expect(g.sourceText("ON ENDFILE(F)")).toBe("ON ENDFILE(F)");
    });

    test("a BEGIN ON-unit is shown as the ON-unit body", async () => {
      const g = await build(
        program(
          "ON ZERODIVIDE BEGIN;",
          "  X = 0;",
          "  PUT LIST('DIV');",
          "END;",
          "Y = 1;",
        ),
      );
      expect(g.graph.containers.map((c) => c.kind)).toEqual([
        "procedure",
        "on-unit",
      ]);
      expect(g.node("Lines 3–4").container?.kind).toBe("on-unit");
    });

    test("an ON-unit ending in GO TO has no normal return", async () => {
      const g = await build(
        program(
          "DCL F FILE;",
          "ON ENDFILE(F) GO TO DONE;",
          "X = 1;",
          "DONE: Y = 2;",
        ),
      );
      expect(g.from("GO TO DONE")).toEqual(["GO TO DONE -goto-> DONE: Line 5"]);
      expect(g.ofKind("exit").map((n) => n.heading)).toEqual(["END MAIN"]);
    });

    test("ON ... SYSTEM has no ON-unit", async () => {
      const g = await build(program("ON ERROR SYSTEM;", "X = 1;"));
      expect(g.from("ON ERROR SYSTEM")).toEqual([
        "ON ERROR SYSTEM -flow-> Line 3",
      ]);
      expect(g.graph.containers).toHaveLength(1);
    });

    test("SIGNAL links to the ON-unit of the same condition", async () => {
      const g = await build(
        program(
          "ON CONDITION(MYCOND) X = 1;",
          "ON ZERODIVIDE Y = 1;",
          "SIGNAL CONDITION(MYCOND);",
          "Z = 1;",
        ),
      );
      expect(g.from("SIGNAL CONDITION(MYCOND)")).toEqual([
        "SIGNAL CONDITION(MYCOND) -flow-> Line 5",
        "SIGNAL CONDITION(MYCOND) -signal-> Line 2",
      ]);
    });
  });

  describe("sources", () => {
    test("containers span their whole block, nodes their statements", async () => {
      const text = program("DO WHILE (A);", "  X = 1;", "END;");
      const g = await build(text);
      const loop = g.node("DO WHILE (A)").container!;
      expect(text.slice(loop.source!.start, loop.source!.end)).toBe(
        "DO WHILE (A);\n     X = 1;\n   END;",
      );
      expect(g.sourceText("DO WHILE (A)")).toBe("DO WHILE (A);");
      expect(g.sourceText("Line 3")).toBe("X = 1;");
      expect(g.sourceText("PROC MAIN")).toBe("MAIN: PROC OPTIONS(MAIN);");
      expect(g.sourceText("END MAIN")).toBe("END MAIN;");
    });
  });

  describe("include files", () => {
    afterEach(() => setDefaultTestWorkspace(undefined));

    test("blocks never span files and name the include they come from", async () => {
      const vfs = new VirtualFileSystemProvider();
      const workspace = createTestWorkspace(vfs);
      setDefaultTestWorkspace(workspace);
      await vfs.writeFile(
        UriUtils.toUri("/workspace/lib/steps.pli"),
        " B = 2;\n C = 3;\n",
      );
      await workspace.config.init(UriUtils.toUri("/workspace"));
      await workspace.config.setProcessGroupConfigs([
        deserializeProcessGroup({
          name: "default",
          "include-extensions": [".pli"],
          libs: ["/workspace/lib/"],
        }),
      ]);
      workspace.config.setProgramConfigs(UriUtils.toUri("/workspace"), [
        makeProgramConfig({ program: "*.pli", pgroup: "default" }),
      ]);

      const text = program("A = 1;", '%INCLUDE "steps.pli";', "D = 4;");
      const uri = UriUtils.toUri("/workspace/main.pli");
      const unit = await parse(text, { validate: true, uri });
      const graph = buildControlFlowGraph(
        unit.ast,
        createSourceProvider(unit),
        {
          mainUri: uri.toString(),
        },
      );
      expect(
        graph.nodes.filter((n) => n.kind === "block").map((n) => n.heading),
      ).toEqual(["Line 2", "steps.pli: Lines 1–2", "Line 4"]);
    });
  });
});
