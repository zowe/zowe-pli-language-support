/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { describe, expect, test } from "vitest";
import { parseListFile } from "./list-file-parser";

const minimalListFileContent = `
15655-PL6  IBM(R) Enterprise PL/I for z/OS                                                      2026.05.07 03:26:52   Page     2
- MACRO (Built:20220315) Messages
0 Message       Line.File Message Description
0 IBM3501I E       3.0    TEST PUT
15655-PL6  IBM(R) Enterprise PL/I for z/OS                                                      2026.05.07 03:26:52   Page     3
0 Compiler Source
0    Line.File
0       4.0      AVERAGE: PROCEDURE OPTIONS (MAIN);
        4.0
        5.0       /* BEGIN %INCLUDE "./hello2.pli" */
        1.1      DCL TEST ENTRY (CHAR(10));
        5.0       /*   END %INCLUDE "./hello2.pli" */
        6.0         PUT(TEST);
        7.0      END AVERAGE;
        8.0      RAND: PROCEDURE;
        8.0
        9.0        INTERNAL_PROC: INTERNAL_PROC2: PROCEDURE;
        9.0
       10.0        END;
       11.0
       12.0      END;
15655-PL6  IBM(R) Enterprise PL/I for z/OS                                                      2026.05.07 03:26:52   Page     4
-                    Attribute/Xref Table
-     Line.File Identifier                      Xref
0      +++++++  SYSPRINT                        Refs: 6.0
         1.1    TEST                            Refs: 6.0
                                                Refs: 7.0
                                                Sets: 2.0
15655-PL6  IBM(R) Enterprise PL/I for z/OS                                                      2026.05.07 03:26:52   Page     5
- Compiler Messages
0 Message       Line.File Message Description
0 IBM1816I S       6.0    LIST item TEST is not computational.
  IBM1213I W       9.0    The PROCEDURE INTERNAL_PROC is not referenced.
- File Reference Table
0   File    Included From  Name
0      0                   /hello_world/hello.pli
       1           5.0     /hello_world/hello2.pli
- Component    Return Code    Messages (Total/Suppressed)    Time
0 MACRO            8                1  /  0                   0 secs
  SQL              0                1  /  1                   0 secs
  Compiler        12                3  /  1                   0 secs
0 End of compilation of AVERAGE
`;

const result = parseListFile(minimalListFileContent);

describe("parseListFile - compiler source", () => {
  test("extracts source lines", () => {
    expect(result.compilerSource.length).toBeGreaterThan(0);
  });

  test("main procedure is found at the correct position", () => {
    const mainProc = result.compilerSource.find((l) =>
      l.text.includes("AVERAGE: PROCEDURE"),
    );
    expect(mainProc).toBeDefined();
    expect(mainProc!.position).toEqual({ line: 4, file: 0 });
  });

  test("included file lines carry the included file index", () => {
    const includedLine = result.compilerSource.find(
      (l) => l.position.file === 1,
    );
    expect(includedLine).toBeDefined();
    expect(includedLine!.position).toEqual({ line: 1, file: 1 });
  });
});

describe("parseListFile - xref table", () => {
  test("extracts xref entries", () => {
    expect(result.xrefTable.length).toBeGreaterThan(0);
  });

  test("TEST is defined in the included file and referenced in the main file", () => {
    const entry = result.xrefTable.find((e) => e.identifier === "TEST");
    expect(entry).toBeDefined();
    expect(entry!.definedAt).toEqual({ line: 1, file: 1 });
    expect(entry!.refs).toEqual([
      { line: 6, file: 0 },
      { line: 7, file: 0 },
    ]);
    expect(entry!.sets).toEqual([{ line: 2, file: 0 }]);
  });

  test("predefined identifier has no definedAt position", () => {
    const entry = result.xrefTable.find((e) => e.identifier === "SYSPRINT");
    expect(entry).toBeDefined();
    expect(entry!.definedAt).toBeUndefined();
  });
});

describe("parseListFile - compiler messages", () => {
  test("extracts compiler messages", () => {
    expect(result.compilerMessages.length).toBeGreaterThan(0);
  });

  test("IBM1816I severity S at the correct position", () => {
    const msg = result.compilerMessages.find((m) => m.code === "IBM1816I");
    expect(msg).toBeDefined();
    expect(msg!.severity).toBe("S");
    expect(msg!.position).toEqual({ line: 6, file: 0 });
    expect(msg!.description).toBe("LIST item TEST is not computational.");
  });

  test("IBM1213I severity W for unreferenced procedure", () => {
    const msg = result.compilerMessages.find((m) => m.code === "IBM1213I");
    expect(msg).toBeDefined();
    expect(msg!.severity).toBe("W");
  });
});

describe("parseListFile - macro messages", () => {
  test("extracts macro messages", () => {
    expect(result.macroMessages.length).toBeGreaterThan(0);
  });

  test("IBM3501I severity E from the macro phase", () => {
    expect(result.macroMessages[0].code).toBe("IBM3501I");
    expect(result.macroMessages[0].severity).toBe("E");
    expect(result.macroMessages[0].position).toEqual({ line: 3, file: 0 });
  });
});

describe("parseListFile - file table", () => {
  test("contains exactly two entries", () => {
    expect(result.fileTable).toHaveLength(2);
  });

  test("file 0 is the main source file with no includedFrom", () => {
    const entry = result.fileTable[0];
    expect(entry.fileIndex).toBe(0);
    expect(entry.includedFrom).toBeUndefined();
    expect(entry.name).toBe("/hello_world/hello.pli");
  });

  test("file 1 is the included file with a correct includedFrom position", () => {
    const entry = result.fileTable[1];
    expect(entry.fileIndex).toBe(1);
    expect(entry.includedFrom).toEqual({ line: 5, file: 0 });
    expect(entry.name).toBe("/hello_world/hello2.pli");
  });
});
