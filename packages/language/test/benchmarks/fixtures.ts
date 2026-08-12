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

/**
 * Generates a synthetic program exercising the full pipeline: plain declarations, string
 * literals containing `;`, comments, a small macro group every 50th unit, and a unit full
 * of `EXEC SQL`/`EXEC CICS` statements, `SQL TYPE IS`, and `DFHRESP` every 50th unit
 * (offset from the macro group). Most units are plain PL/I - EXEC statements in every unit
 * would make the external SQL/CICS preprocessors dominate the runtime, which no real
 * project's code does. Every line starts in column 2 and stays within the default margins;
 * macro statements are straight-line (no `%DO` loops) to stay well below the interpreter's
 * instruction limit.
 */
export function generateFullFixture(targetLines: number): string {
  const chunks: string[] = [];
  let lines = 0;
  for (let i = 0; lines < targetLines; i++) {
    if (i % 50 === 0) {
      chunks.push(
        ` %DCL V${i} CHAR;`,
        ` %V${i} = 'FIXED BIN(31)';`,
        ` DCL M${i} V${i};`,
      );
      lines += 3;
    }
    if (i % 50 === 25) {
      chunks.push(
        ` P${i}: PROC;`,
        `   DCL A${i} FIXED BIN(31);            /* plain decls + comment */`,
        `   DCL C${i} CHAR(20) VARYING INIT('lit;eral');`,
        `   A${i} = A${i} + 1;`,
        `   EXEC SQL SELECT COL1 INTO :A${i} FROM TAB${i};`,
        `   DCL L${i} SQL TYPE IS CLOB(1K);`,
        `   EXEC CICS ABEND ABCODE('$CAN');`,
        `   A${i} = DFHRESP(NORMAL);`,
        ` END P${i};`,
      );
    } else {
      chunks.push(
        ` P${i}: PROC;`,
        `   DCL A${i} FIXED BIN(31);            /* plain decls + comment */`,
        `   DCL C${i} CHAR(20) VARYING INIT('lit;eral');`,
        `   DCL B${i} FIXED BIN(15);`,
        `   A${i} = A${i} + 1;`,
        `   B${i} = A${i} * 2;`,
        `   C${i} = 'update;d';`,
        `   PUT SKIP LIST(A${i});`,
        ` END P${i};`,
      );
    }
    lines += 9;
  }
  return chunks.join("\n") + "\n";
}

/**
 * Plain PL/I only - no `%` statements and no `EXEC` fragments, so all preprocessor
 * phases just scan through. Measures the margin/comment-strip/lex/annotate baseline.
 */
export function generatePlainFixture(targetLines: number): string {
  const chunks: string[] = [];
  let lines = 0;
  for (let i = 0; lines < targetLines; i++) {
    chunks.push(
      ` P${i}: PROC;`,
      `   DCL A${i} FIXED BIN(31);            /* plain decls + comment */`,
      `   DCL C${i} CHAR(20) VARYING INIT('lit;eral');`,
      `   DCL B${i} FIXED BIN(15);`,
      `   A${i} = A${i} + 1;`,
      `   B${i} = A${i} * 2;`,
      `   C${i} = 'update;d';`,
      `   PUT SKIP LIST(A${i});`,
      ` END P${i};`,
    );
    lines += 9;
  }
  return chunks.join("\n") + "\n";
}

/**
 * Macro preprocessor only - defines preprocessor procedures up front and invokes one in
 * every unit, so each call runs the macro interpreter and splices generated text. The
 * interpreter stops any instruction node after 5000 executions (DEFAULT_INSTRUCTION_LIMIT),
 * so the units cycle through enough identical procedures to keep each below that.
 */
export function generateMacroFixture(targetLines: number): string {
  const procCount = Math.max(1, Math.ceil(targetLines / 4 / 4_000));
  const chunks: string[] = [];
  for (let p = 0; p < procCount; p++) {
    chunks.push(
      ` %GEN${p}: PROC(NM) RETURNS(CHAR);`,
      `   DCL NM CHAR;`,
      `   RETURN('DCL ' || NM || ' FIXED BIN(31);');`,
      ` %END;`,
      ` %ACTIVATE GEN${p};`,
    );
  }
  let lines = chunks.length;
  for (let i = 0; lines < targetLines; i++) {
    chunks.push(
      ` P${i}: PROC;`,
      `   GEN${i % procCount}(A${i})`,
      `   A${i} = A${i} + 1;`,
      ` END P${i};`,
    );
    lines += 4;
  }
  return chunks.join("\n") + "\n";
}
