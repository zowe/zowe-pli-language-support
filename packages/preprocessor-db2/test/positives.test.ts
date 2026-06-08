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
import { Db2SqlPreprocessor } from "../src/engine/preprocessor";

describe("DB2 SQL Positive Tests", async () => {
  const preprocessor = new Db2SqlPreprocessor();

  test("TestDb2BlobSize", async () => {
    const { diagnostics } = await preprocessor.execute(`
      DECLARE TEST123
      TABLE(JSON_DATA BLOB(256K) NOT NULL);
    `)
    expect(diagnostics).toHaveLength(0);
  });

  test("TestDb2DecimalExpression", async () => {
    const { diagnostics } = await preprocessor.execute(`
      UPDATE DSN8C10.EMP
      SET SALARY = SALARY + 100.
      WHERE WORKDEPT = 'D11'
    `);
    expect(diagnostics).toHaveLength(0);
  });
  test("TestDb2DeclareVariable", async () => {
    const { diagnostics } = await preprocessor.execute(`DECLARE :A VARIABLE FOR BIT DATA`);
    expect(diagnostics).toHaveLength(0);
  });
  test("TestDb2JoinedTablesQuery", async () => {
    const { diagnostics } = await preprocessor.execute(`
       declare dummy-cu cursor for
       select 'Y' from table t1
       inner join table t2 ON t1.key = t2.KEY
       inner join table t3 ON t3.key = t1.key
    `);
    expect(diagnostics).toHaveLength(0);
  });
  describe("TestSqlAllAlterStatements", () => {
    test("ALTER DB", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER DATABASE ABCDE BUFFERPOOL BP2
        INDEXBP BP2 STOGROUP stgrp CCSID 5348
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_EXT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER SPECIFIC FUNCTION ENGLES.FOCUS1
        WLM ENVIRONMENT WLMENVNAME2  
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_EXT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER FUNCTION ENGLES.CENTER (CHAR(25), DEC(5,2),
        INTEGER) RETURNS NULL ON NULL INPUT  
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_EXT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter FUNCTION CENTER (INTEGER, FLOAT)
        EXTERNAL NAME 'MIDDLE'
        LANGUAGE C
        PARAMETER STYLE SQL
        WLM ENVIRONMENT (env, *)
        CARDINALITY 3
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_EXTERNAL_FUNCTION", async () => {
      const { diagnostics } = await preprocessor.execute(`ALTER FUNCTION MY_UDF1 DETERMINISTIC`);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_COMPILED2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER FUNCTION REVERSE
        ALTER ACTIVE VERSION
        NOT DETERMINISTIC
        ALLOW DEBUG MODE  
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_COMPILED5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER FUNCTION REVERSE(INSTR VARCHAR(4000))
        ACTIVATE VERSION V3  
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_COMPILED6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER FUNCTION REVERSE(INSTR VARCHAR(4000))
        REGENERATE ACTIVE VERSION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_SQL_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER FUNCTION GET_TABLE
        RESTRICT CARDINALITY 10000
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_FUNCTION_INLINED", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER FUNCTION MY_UDF1
        DETERMINISTIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_INDEX", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER INDEX DSN8C10.XEMP1
        CLOSE NO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_INDEX2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER INDEX DSN8C10.XPROJ1
        BUFFERPOOL BP1
        COPY YES
        PIECESIZE 8M
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_INDEX3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER INDEX X1
        NOT PADDED
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_INDEX4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER INDEX DSN8C10.XDEPT1
        BUFFERPOOL BP1
        CLOSE YES
        COPY YES
        USING VCAT CATLGG
        FREEPAGE 6
        PCTFREE 11
        GBPCACHE ALL
        ALTER PARTITION 3
        USING VCAT CATLGG
        FREEPAGE 13
        PCTFREE 13,
        ALTER PARTITION 4
        USING VCAT CATLGG
        GBPCACHE CHANGED,
        ALTER PARTITION 5
        USING VCAT CATLGG
        FREEPAGE 25
        PCTFREE 25
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_INDEX5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER INDEX inxnm 
        BUFFERPOOL sdjks
        ADD COLUMN (col1 ASC)
        ALTER PARTITION 2 ENDING (MAXVALUE) INCLUSIVE DSSIZE 3G,
        ALTER PARTITION 4 ENDING (MINVALUE) INCLUSIVE DSSIZE 3G
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_MASK", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER MASK M1 ENABLE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_MASK2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER MASK M1 REGENERATE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_PERMISSION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER PERMISSION P1 ENABLE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_PERMISSION2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER PERMISSION P1 REGENERATE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_PROCEDURE_EXT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER PROCEDURE SYSPROC.MYPROC WLM ENVIRONMENT PARTSEC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_PROCEDURE_SQL_NATIVE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER PROCEDURE UPDATE_SALARY_1
        ALTER ACTIVE VERSION
        NOT DETERMINISTIC
        CALLED ON NULL INPUT
        ALLOW DEBUG MODE
        ASUTIME LIMIT 10
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_PROCEDURE_SQL_NATIVE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER PROCEDURE UPDATE_SALARY_1
        ACTIVATE VERSION V3
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_PROCEDURE_SQL_NATIVE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER PROCEDURE UPDATE_SALARY_1
        REGENERATE ACTIVE VERSION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_SEQUENCE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER SEQUENCE org_seq RESTART
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_STOGROUP", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER STOGROUP DSN8G120
        ADD VOLUMES (DSNV04, DSNV05)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_STOGROUP2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER STOGROUP DSN8G120
        REMOVE VOLUMES (DSNV04,DSNV05)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_STOGROUP3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER STOGROUP DSN8G120
        NO KEY LABEL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        ALTER COLUMN DEPTNAME SET DATA TYPE VARCHAR(50)
        ADD BLDG CHAR(3) FOR SBCS DATA
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        VALIDPROC DSN8EAEM
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("", async () => {
      const { diagnostics } = await preprocessor.execute(`
        
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("", async () => {
      const { diagnostics } = await preprocessor.execute(`
        
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("", async () => {
      const { diagnostics } = await preprocessor.execute(`
        
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("", async () => {
      const { diagnostics } = await preprocessor.execute(`
        
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
  test("", async () => {
    const { diagnostics } = await preprocessor.execute(``);
    expect(diagnostics).toHaveLength(0);
  });
});
