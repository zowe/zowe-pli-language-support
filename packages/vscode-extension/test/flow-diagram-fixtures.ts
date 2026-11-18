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

import type { SGraph, SLabel, SModelElement, Point } from "sprotty-protocol";
import { FlowDiagramTypes } from "../../language/src/flow-diagram/flow-diagram-protocol";
import { createFlowDiagramModel } from "../../language/src/language-server/flow-diagram-request";
import { parse } from "../../language/test/utils";
import { createFlowLayoutEngine } from "../src/extension/flow-diagram/flow-layout";

/** A program touching every kind of node, container and edge. */
export const FLOW_PROGRAM = ` MAIN: PROC OPTIONS(MAIN);
   DCL (I, N, TOTAL) FIXED BIN(31) INIT(0);
   DCL EOF BIT(1) INIT('0'B);
   DCL SYSIN FILE;
   ON ENDFILE(SYSIN) EOF = '1'B;
   N = 10;
   READ_LOOP: DO WHILE (¬EOF);
     IF N > 5 THEN DO;
       TOTAL = TOTAL + N;
       CALL REPORT(TOTAL);
     END;
     ELSE
       LEAVE READ_LOOP;
     N = N - 1;
   END READ_LOOP;
   SELECT (N);
     WHEN (1, 2) PUT SKIP LIST('SMALL');
     WHEN (3) GO TO DONE;
     OTHERWISE;
   END;
   DO I = 1 TO N;
     IF I = 3 THEN ITERATE;
     TOTAL = TOTAL + I;
   END;
   SIGNAL ENDFILE(SYSIN);
 DONE:
   PUT SKIP LIST(TOTAL);
   RETURN;
 REPORT: PROC(X);
   DCL X FIXED BIN(31);
   PUT SKIP LIST(X);
 END REPORT;
 END MAIN;`;

const CHAR_WIDTH = 7;
const LINE_HEIGHT = 16;

type Shape = SModelElement & {
  position?: Point;
  size?: { width: number; height: number };
  layoutOptions?: Record<string, number | string | boolean>;
};

/**
 * Stands in for the webview's hidden rendering pass: measures labels (fixed-width font) and
 * runs the vbox micro-layout of execution nodes, as Sprotty does before sending computed bounds.
 */
export function simulateClientBounds(element: SModelElement): void {
  for (const child of element.children ?? []) {
    simulateClientBounds(child);
  }
  const shape = element as Shape;
  if (element.type.startsWith("label:")) {
    const text = (element as SLabel).text;
    shape.size = { width: text.length * CHAR_WIDTH, height: LINE_HEIGHT };
    return;
  }
  if (
    element.type.startsWith("node:") &&
    element.type !== FlowDiagramTypes.CONTAINER
  ) {
    const options = shape.layoutOptions ?? {};
    const padX = Number(options.paddingLeft ?? 0);
    const padY = Number(options.paddingTop ?? 0);
    const gap = Number(options.vGap ?? 0);
    let y = padY;
    let width = 0;
    for (const label of (element.children ?? []) as Shape[]) {
      label.position = { x: padX, y };
      y += label.size!.height + gap;
      width = Math.max(width, label.size!.width);
    }
    shape.size = { width: width + 2 * padX, height: y - gap + padY };
  }
}

/** All elements of a model tree, depth first. */
export function collect(
  element: SModelElement,
  out: SModelElement[] = [],
): SModelElement[] {
  out.push(element);
  for (const child of element.children ?? []) {
    collect(child, out);
  }
  return out;
}

/** Runs the whole pipeline: PL/I source → CFG → Sprotty model → client bounds → ELK layout. */
export async function layoutProgram(text: string): Promise<SGraph> {
  const unit = await parse(text, { validate: true });
  const model = createFlowDiagramModel(unit);
  simulateClientBounds(model);
  return createFlowLayoutEngine().layout(model) as Promise<SGraph>;
}
