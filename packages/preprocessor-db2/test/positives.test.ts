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
    `);
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
    const { diagnostics } = await preprocessor.execute(
      `DECLARE :A VARIABLE FOR BIT DATA`,
    );
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
      const { diagnostics } = await preprocessor.execute(
        `ALTER FUNCTION MY_UDF1 DETERMINISTIC`,
      );
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
    test("ALTER_TABLE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        VALIDPROC NULL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        FOREIGN KEY(ADMRDEPT) REFERENCES DSN8C10.DEPT
        ON DELETE CASCADE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        ADD CHECK (SALARY >= 10000)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE PRODINFO
        FOREIGN KEY (PRODNAME,PRODVERNO)
        REFERENCES PRODVER_1 (VERNAME,RELNO) ON DELETE RESTRICT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        ADD CONSTRAINT KEY_DEPTNAME UNIQUE( DEPTNAME )
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE8", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE TRANSCOUNT ADD MATERIALIZED QUERY
        (SELECT ACCTID, LOCID, YEAR, COUNT(*) as cnt
        FROM TRANS
        GROUP BY ACCTID, LOCID, YEAR )
        DATA INITIALLY DEFERRED
        REFRESH DEFERRED
        MAINTAINED BY USER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE9", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE TB1
        ALTER COLUMN COL1
        SET DATA TYPE BINARY(6)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE10", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.EMP
        KEY LABEL SECUREKEY01
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE11", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter TABLE DSN8C10.DEPT ADD PARTITION BY
        (col asc, col2 desc) (PARTITION 3 ending (MAXVALUE))
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE12", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter TABLE DSN8C10.DEPT add column abc 'xyz.join'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE13", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLE DSN8C10.DEPT
        ADD CONSTRAINT CHK_DEPT_DEPTNO
        CHECK (DEPTNO BETWEEN 'A00' AND 'Z99')
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE14", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter TABLE DSN8C10.DEPT
        CONSTRAINT xyz
        UNIQUE (col1, BUSINESS_TIME WITHOUT OVERLAPS)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE15", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter TABLE DSN8C10.DEPT
        ALTER PARTITIONING TO PARTITION BY range (col1 desc)
        (PARTITION 3 ending (MAXVALUE))
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLE16", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter TABLE DSN8C10.DEPT
        ALTER PARTITION 3 ending (MAXVALUE)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLESPACE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLESPACE DSN8D12A.DSN8S12D
        BUFFERPOOL BP2
        LOCKSIZE PAGE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLESPACE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLESPACE DSN8D12A.DSN8S12E
        CLOSE NO
        SECQTY -1
        ALTER PARTITION 1 PCTFREE 20
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TABLESPACE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TABLESPACE TS01DB.TS01TS
        MAXPARTITIONS 30
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRIGGER_ADV", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRIGGER TRIGGER1
        SECURED
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRIGGER_ADV2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRIGGER TRIGGER1
        ALTER ALLOW DEBUG MODE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRIGGER_ADV3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRIGGER TRIGGER1
        ACTIVATE VERSION V3
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRIGGER_ADV4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRIGGER TRIGGER1
        REGENERATE ACTIVE VERSION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRUSTED_CONTEXT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRUSTED CONTEXT CTX1
        ALTER DEFAULT ROLE CTXROLE2
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRUSTED_CONTEXT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRUSTED CONTEXT CTX3
        ALTER DISABLE
        ADD USE FOR BILL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRUSTED_CONTEXT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRUSTED CONTEXT CTX4
        REPLACE USE FOR JOE WITHOUT AUTHENTICATION
        ADD USE FOR PUBLIC WITH AUTHENTICATION,
        TOM ROLE SPLROLE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRUSTED_CONTEXT4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRUSTED CONTEXT REMOTECTX
        ALTER ATTRIBUTES (ADDRESS "9.12.155.200",
        ENCRYPTION "LOW")
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRUSTED_CONTEXT5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRUSTED CONTEXT CTX1
        drop
        ATTRIBUTES (
        ADDRESS "huu",
        SERVAUTH "JOB989L"
        )
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_TRUSTED_CONTEXT6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        alter TRUSTED CONTEXT CTX1
        add
        ATTRIBUTES (
        address "2 . 4 . 5 . 62",
        SERVAUTH "23"
        )
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_VIEW", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER VIEW MYVIEW REGENERATE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("ALTER_VIEW2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALTER TRUSTED CONTEXT REMOTECTX
        ALTER ATTRIBUTES (ADDRESS "9.12.155.200",
        ENCRYPTION "LOW")
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllCreateStatements", () => {
    test("CREATE_ALIAS", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE ALIAS LATABLES FOR DB2USCALABOA5281.SYSIBM.SYSTABLES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_AUX_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE AUX TABLE EMP_PHOTO_ATAB
        IN DSN8D12A.PHOTOLTS
        STORES DSN8C10.EMP
        COLUMN EMP_PHOTO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_DB", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE DATABASE DSN8D12P
        STOGROUP DSN8G120
        BUFFERPOOL BP8K1
        INDEXBP BP2
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_DB2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE DATABASE DSN8TEMP
        CCSID ASCII
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION NTEST1 (SMALLINT)
           RETURNS SMALLINT
           EXTERNAL NAME 'NTESTMOD'
           SPECIFIC MINENULL1
           LANGUAGE C
            DETERMINISTIC
            NO SQL
            FENCED
            PARAMETER STYLE SQL
            RETURNS NULL ON NULL INPUT
            NO EXTERNAL ACTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT_NO_OPTIONS", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION REVERSE(INSTR VARCHAR(4000))
        RETURNS VARCHAR(4000)
        return null
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION CENTER (INTEGER, FLOAT)
        RETURNS FLOAT
        EXTERNAL NAME 'MIDDLE'
        LANGUAGE C
        DETERMINISTIC
        NO SQL
        FENCED
        PARAMETER STYLE SQL
        NO EXTERNAL ACTION
        STAY RESIDENT YES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION SMITH.CENTER (FLOAT, FLOAT, FLOAT)
            RETURNS DECIMAL(8,4) CAST FROM FLOAT
            EXTERNAL NAME 'CMOD'
            SPECIFIC FOCUS98
            LANGUAGE C
            DETERMINISTIC
            NO SQL
            FENCED
            PARAMETER STYLE SQL
            NO EXTERNAL ACTION
            SCRATCHPAD
            NO FINAL CALL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION FINDV (CLOB(100K))
            RETURNS INTEGER
            FENCED
            LANGUAGE JAVA
            PARAMETER STYLE JAVA
            EXTERNAL NAME 'JAVAUDFS.FINDVWL'
            NO EXTERNAL ACTION
            CALLED ON NULL INPUT
            DETERMINISTIC
            NO SQL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION CENTER (INTEGER, FLOAT)
        RETURNS FLOAT
        EXTERNAL NAME 'MIDDLE'
        LANGUAGE C
        PARAMETER STYLE SQL
        WLM ENVIRONMENT (env, *)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION CENTER (INTEGER, FLOAT)
        RETURNS FLOAT
        EXTERNAL NAME 'MIDDLE'
        LANGUAGE C
        PARAMETER STYLE SQL
        WLM ENVIRONMENT env
        CARDINALITY 3
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION DOCMATCH (VARCHAR(30), VARCHAR(255))
                                     RETURNS TABLE (DOC_ID CHAR(16))
         EXTERNAL NAME ABC
         LANGUAGE C
         PARAMETER STYLE SQL
         NO SQL
         DETERMINISTIC
         NO EXTERNAL ACTION
         FENCED
         SCRATCHPAD
         FINAL CALL
         DISALLOW PARALLEL
         CARDINALITY 20
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_EXT_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION tf6(p1 VARCHAR(10))
        RETURNS GENERIC TABLE
        EXTERNAL NAME 'tf6'
        LANGUAGE C
        PARAMETER STYLE SQL
        DETERMINISTIC
        NO EXTERNAL ACTION
        FENCED
        SCRATCHPAD
        FINAL CALL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_INLINED", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION TAN (X DOUBLE)
        RETURNS DOUBLE
        LANGUAGE SQL
        CONTAINS SQL
        NO EXTERNAL ACTION
        DETERMINISTIC
        RETURN SIN(X)/COS(X)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_SOURCED", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION AVE (HATSIZE) RETURNS HATSIZE
        SOURCE SYSIBM.AVG (INTEGER)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_FUNCTION_SOURCED2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE FUNCTION MYCENTER (INTEGER, INTEGER)
        RETURNS FLOAT
        SOURCE SMITH.CENTER (INTEGER, FLOAT)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_GLOBAL_TMP_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE GLOBAL TEMPORARY TABLE CURRENTMAP
          (CODE INTEGER NOT NULL, MEANING VARCHAR(254) NOT NULL)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_GLOBAL_TMP_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE GLOBAL TEMPORARY TABLE EMP
            (TMPDEPTNO   CHAR(3)     NOT NULL,
            TMPDEPTNAME VARCHAR(36) NOT NULL,
            TMPMGRNO    CHAR(6)  ,
            TMPLOCATION CHAR(16))
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_INDEX", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE UNIQUE INDEX DSN8C10.XDEPT1
            ON DSN8C10.DEPT
            (DEPTNO ASC)
            PADDED
            USING STOGROUP DSN8G120
            PRIQTY 512
            SECQTY 64
            ERASE NO
            BUFFERPOOL BP1
            CLOSE YES
            PIECESIZE 1M
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_INDEX2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE INDEX DSN8C10.XEMP2
            ON DSN8C10.EMP
            (EMPNO ASC)
            USING STOGROUP DSN8G120
            PRIQTY 36
            ERASE NO
            CLUSTER
            PARTITION BY RANGE
            (PARTITION 1 ENDING AT("H99"),
            PARTITION 2 ENDING AT("P99"),
            PARTITION 3 ENDING AT("Z99"),
            PARTITION 4 ENDING AT("999"))
            BUFFERPOOL BP1
            CLOSE YES
            COPY YES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_INDEX3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE UNIQUE INDEX DSN8C10.XDEPT1
        ON DSN8C10.DEPT
        (DEPTNO ASC)
        USING VCAT DSNCAT
        PIECESIZE 1048576K
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_INDEX4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE UNIQUE INDEX DSN8C10.XPHOTO
            ON DSN8C10.EMP_PHOTO_ATAB
            USING VCAT DSNCAT
            COPY YES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_INDEX5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create index inxnm on  tabnam (col1 ASC)
        cluster
        partition by
        (partition 2 ending (MAXVALUE) inclusive dssize 3G)
        not padded
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_INDEX6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE INDEX idx_customer ON customers(info)
             GENERATE KEY USING XMLPATTERN
        "/cust:customer/cust:name" AS SQL VARCHAR(50)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test.fails("CREATE_INDEX7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE INDEX CSTPHNX2 ON CUST(XMLCUST)
        GENERATE KEY USING XMLPATTERN
        "declare namespace s='http://example.com/ns';
   -    "/s:customer/s:phone/@s:type"
        AS SQL VARCHAR(12)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_LOB_TABLESPACE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE LOB TABLESPACE PHOTOLTS
            IN DSN8D12A
            USING STOGROUP DSN8G120
                 PRIQTY 3200
                 SECQTY 1600
             LOCKSIZE LOB
             BUFFERPOOL BP16K0
             GBPCACHE SYSTEM
             NOT LOGGED
             CLOSE NO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_MASK", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE MASK SSN_MASK ON EMPLOYEE
           FOR COLUMN SSN RETURN
             CASE
                  WHEN (VERIFY_GROUP_FOR_USER
                  (SESSION_USER,'PAYROLL') = 1)
                         THEN SSN
                  WHEN (
                  VERIFY_GROUP_FOR_USER(SESSION_USER,'MGR') = 1)
                   THEN 'XXX-XX-' || SUBSTR(SSN,8,4)
                  ELSE NULL
             END
           ENABLE;

        COMMIT;

        ALTER TABLE EMPLOYEE
            ACTIVATE COLUMN ACCESS CONTROL;

        COMMIT;

        SELECT SSN FROM EMPLOYEE
            WHERE EMPNO = 123456
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_MASK2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE MASK SSN_MASK ON EMPLOYEE
            FOR COLUMN SSN RETURN
              CASE
                   WHEN (1 = 1)
                    THEN 'XXX-XX-' || SUBSTR(SSN,8,4)
                   ELSE NULL
              END
            ENABLE;

        COMMIT;

        ALTER TABLE EMPLOYEE
            ACTIVATE COLUMN ACCESS CONTROL;

        COMMIT;

        SELECT 'XXX-XX-' ||
         SUBSTR(SSN,8,4) FROM EMPLOYEE
            WHERE EMPNO = 123456
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_MASK3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE MASK CITY_MASK ON LIBRARY_USAGE
            FOR COLUMN CITY RETURN
              CASE
                   WHEN (LIBRARY_OPT = 'OPT-IN')
                    THEN CITY
                   ELSE ' '
              END
            ENABLE;

        COMMIT;

        ALTER TABLE LIBRARY_USAGE
           ACTIVATE COLUMN ACCESS CONTROL;

        COMMIT;

        SELECT CITY, AVG(LIBRARY_TIME) FROM LIBRARY_USAGE
           GROUP BY CITY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_MASK4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE MASK SALARY_MASK ON EMPLOYEE
           FOR COLUMN SALARY RETURN
               CASE
                    WHEN (BONUS < 10000)
                     THEN SALARY
                    ELSE NULL
               END
           ENABLE;

        COMMIT;

        CREATE MASK BONUS_MASK ON EMPLOYEE
           FOR COLUMN BONUS RETURN
               CASE
                    WHEN (BONUS > 5000)
                     THEN NULL
                    ELSE BONUS
               END
           ENABLE;

        COMMIT;

        ALTER TABLE EMPLOYEE
            ACTIVATE COLUMN ACCESS CONTROL;

        COMMIT;

        SELECT SALARY FROM EMPLOYEE
            WHERE EMPNO = 123456
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_MASK5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE EMPLOYEE (EMPID INT,
                         DEPTID CHAR(8),
                         SALARY DEC(9,2) NOT NULL,
                         BONUS DEC(9,2));

        CREATE MASK SALARY_MASK ON EMPLOYEE
            FOR COLUMN SALARY RETURN
               CASE
                    WHEN SALARY < 10000
                     THEN CAST(SALARY*2 AS DEC(9,2))
                    ELSE COALESCE(CAST(SALARY/2
                    AS DEC(9,2)), BONUS)
               END
            ENABLE;

        COMMIT;

        CREATE MASK BONUS_MASK ON EMPLOYEE
            FOR COLUMN BONUS RETURN
              CASE
                  WHEN BONUS > 1000
                   THEN BONUS
                  ELSE NULL
              END
            ENABLE;

        COMMIT;

        ALTER TABLE EMPLOYEE
            ACTIVATE COLUMN ACCESS CONTROL;

        COMMIT;

        SELECT SALARY FROM DEPT
            LEFT JOIN EMPLOYEE ON DEPTNO = DEPTID;


        SELECT CASE WHEN SALARY IS NULL THEN NULL
                    WHEN SALARY < 10000 THEN
                    CAST(SALARY*2 AS DEC(9,2))
                    ELSE COALESCE(CAST(SALARY/2 AS DEC(9,2)),
                    BONUS)
               END SALARY
               FROM DEPT
                 LEFT JOIN EMPLOYEE ON DEPTNO = DEPTID
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PERMISSION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PERMISSION SALARY_ROW_ACCESS ON EMPLOYEE
           FOR ROWS WHERE VERIFY_GROUP_FOR_USER
         (SESSION_USER,'MGR','ACCOUNTING') = 1
                    AND
                    ACCOUNTING_UDF(SALARY) < 120000
           ENFORCED FOR ALL ACCESS
           ENABLE;

        COMMIT;

        ALTER TABLE EMPLOYEE
        	ACTIVATE ROW ACCESS CONTROL;

        COMMIT;

        SELECT SALARY FROM EMPLOYEE
           WHERE EMPNO = 123456
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PERMISSION2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PERMISSION TELLER_ROW_ACCESS ON CUSTOMER
           FOR ROWS WHERE VERIFY_GROUP_FOR_USER
             (SESSION_USER,'TELLER') = 1
                    AND
            BRANCH = (SELECT HOME_BRANCH FROM INTERNAL_INFO
                  WHERE EMP_ID = SESSION_USER)
            ENFORCED FOR ALL ACCESS
            ENABLE;

        COMMIT;

        CREATE PERMISSION CSR_ROW_ACCESS ON CUSTOMER
           FOR ROWS WHERE
             VERIFY_GROUP_FOR_USER(SESSION_USER,'CSR') = 1
           ENFORCED FOR ALL ACCESS
           ENABLE;

        COMMIT;

        ALTER TABLE CUSTOMER
           ACTIVATE ROW ACCESS CONTROL;

        COMMIT;

        SELECT * FROM CUSTOMER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PROCEDURE_EXT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PROCEDURE SYSPROC.MYPROC(IN INT, OUT INT,
           OUT DECIMAL(7,2))
                 LANGUAGE COBOL
                 EXTERNAL NAME MYMODULE
                 PARAMETER STYLE GENERAL
                 WLM ENVIRONMENT PARTSA
                 DYNAMIC RESULT SETS 1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PROCEDURE_EXT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PROCEDURE
        SYSPROC.MYPROC(IN INT, OUT INT, OUT DECIMAL(7,2))
            LANGUAGE COBOL
            EXTERNAL NAME MYMODULE
            PARAMETER STYLE SQL
            WLM ENVIRONMENT PARTSA
            DYNAMIC RESULT SETS 1
            RUN OPTIONS
        "HEAP(,,ANY),BELOW(4K,,),ALL31(ON),STACK(,,ANY,)"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PROCEDURE_EXT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PROCEDURE PARTS_ON_HAND(IN PARTNUM INT,
                 OUT COST DECIMAL(7,2),
                 OUT QUANTITY INT)
                 LANGUAGE JAVA
                 EXTERNAL NAME 'PARTS.ONHAND'
                 PARAMETER STYLE JAVA
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PROCEDURE_SQL_NATIVE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PROCEDURE UPDATE_SALARY_1
         (IN EMPLOYEE_NUMBER CHAR(10),
         IN RATE DECIMAL(6,2))
         LANGUAGE SQL
         MODIFIES SQL DATA
          UPDATE EMP
          SET SALARY = SALARY * RATE
          WHERE EMPNO = EMPLOYEE_NUMBER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_PROCEDURE_SQL_NATIVE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE PROCEDURE UPDATE_SALARY_1
         (IN EMPLOYEE_NUMBER CHAR(10),
         IN RATE DECIMAL(6,2))
         LANGUAGE SQL
         MODIFIES SQL DATA
         DETERMINISTIC
         COMMIT ON RETURN YES
           UPDATE EMP
           SET SALARY = SALARY * RATE
           WHERE EMPNO = EMPLOYEE_NUMBER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_ROLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE ROLE TELLER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_SEQUENCE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE SEQUENCE ORDER_SEQ
        START WITH 1
        INCREMENT BY 1
        NO MAXVALUE
        NO CYCLE
        CACHE 24
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_SEQUENCE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE SEQUENCE ORDER_SEQ
              START WITH 1
              INCREMENT BY 1
              NO MAXVALUE
              NO CYCLE
              CACHE 20;
             INSERT INTO ORDERS (ORDERNO, CUSTNO)
               VALUES (NEXT VALUE FOR ORDER_SEQ, 123456)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_STOGROUP", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE STOGROUP DSN8G120
             VOLUMES (ABC005,DEF008)
             VCAT DSNCAT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_STOGROUP2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE STOGROUP DSNCG100
             VOLUMES (ABC001,DEF003) VCAT DSNCAT
             KEY LABEL STG01KLABEL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_STOGROUP3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create STOGROUP DSNCG100
          VOLUMES ('*','*') VCAT DSNCAT
          DATACLAS taco
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_STOGROUP4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create STOGROUP DSNCG100
            VOLUMES ('*','*') VCAT DSNCAT
            NO KEY LABEL
            DATACLAS taco
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE DSN8C10.DEPT
             (DEPTNO   CHAR(3)     NOT NULL,
              DEPTNAME VARCHAR(36) NOT NULL,
              MGRNO    CHAR(6)             ,
              ADMRDEPT CHAR(3)     NOT NULL,
              LOCATION CHAR(16)            ,
              PRIMARY KEY(DEPTNO)          )
             IN DSN8D12A.DSN8S12D
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE DSN8C10.PROJ
             (PROJNO   CHAR(6)      NOT NULL,
              PROJNAME VARCHAR(24)  NOT NULL,
              DEPTNO   CHAR(3)      NOT NULL,
              RESPEMP  CHAR(6)      NOT NULL,
              PRSTAFF  DECIMAL(5,2)         ,
              PRSTDATE DATE                 ,
              PRENDATE DATE                 ,
              MAJPROJ  CHAR(6)      NOT NULL)
             IN DATABASE DSN8D12A
             VALIDPROC DSN8EAPR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE ACTIVITY
             (PROJNO   CHAR(6)      NOT NULL,
              ACTNO    SMALLINT     NOT NULL,
              ACTDEPT  CHAR(3)      NOT NULL,
              ACTOWNER CHAR(6)      NOT NULL,
              ACSTAFF  DECIMAL(5,2)         ,
              ACSTDATE DATE         NOT NULL,
              ACENDATE DATE                 ,
              FOREIGN KEY (ACTDEPT,ACTOWNER) REFERENCES
              PROJECT (DEPTNO,RESPEMP) ON DELETE RESTRICT)
             IN DSN8D12A.DSN8S12D
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE DSN8C10.EMP_PHOTO_RESUME (
          EMPNO      CHAR(6)     NOT NULL,
          EMP_ROWID  ROWID NOT NULL GENERATED ALWAYS,
          EMP_PHOTO  BLOB(110K),
          RESUME     CLOB(5K),
          PRIMARY KEY (EMPNO)
        )
             IN DSN8D12A.DSN8S12E
             CCSID EBCDIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE EMPLOYEE
             (EMPNO      INTEGER GENERATED ALWAYS AS IDENTITY,
              ID         SMALLINT,
              NAME       CHAR(30),
              SALARY     DECIMAL(5,2),
              DEPTNO     SMALLINT)
             IN DSN8D12A.DSN8S12D
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE STRANS AS
             (SELECT YEAR AS SYEAR, MONTH AS SMONTH,
              DAY AS SDAY, SUM(AMOUNT) AS SSUM
              FROM TRANS
              GROUP BY YEAR, MONTH, DAY)
              DATA INITIALLY DEFERRED REFRESH DEFERRED
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE TS01TB
               (C1 SMALLINT,
                C2 DECIMAL(9,2),
                C3 CHAR(4))
            APPEND YES
            IN TS01DB.TS01TS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE8", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE TS02TB
               (C1 SMALLINT,
                C2 DECIMAL(9,2),
                C3 CHAR(4))
             PARTITION BY SIZE EVERY 4G
             IN DATABASE DSNDB04
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE9", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE EMP_INFO
               (EMPNO CHAR(6) NOT NULL,
                EMP_INFOCHANGE NOT NULL
                   GENERATED ALWAYS FOR EACH ROW ON UPDATE
                   AS ROW CHANGE TIMESTAMP,
                EMP_ADDRESS VARCHAR(300),
                EMP_PHONENO CHAR(4),
                PRIMARY KEY (EMPNO))
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE10", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE TB01 (
           ACCT_NUM         INTEGER,
           CUST_LAST_NM     CHAR(15),
           LAST_ACTIVITY_DT VARCHAR(25),
           COL2             CHAR(10),
           COL3             CHAR(25),
           COL4             CHAR(25),
           COL5             CHAR(25),
           COL6             CHAR(55),
           STATE            CHAR(55))
         IN DBB.TS01

          PARTITION BY (ACCT_NUM)
           (PARTITION 1 ENDING AT (199),
            PARTITION 2 ENDING AT (299),
            PARTITION 3 ENDING AT (399),
            PARTITION 4 ENDING AT (MAXVALUE))
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLESPACE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLESPACE DSN8S12D
             IN DSN8D12A
             USING STOGROUP DSN8G120
               PRIQTY 52
               SECQTY 20
               ERASE NO
             LOCKSIZE PAGE
             BUFFERPOOL BP1
             CLOSE YES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLESPACE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLESPACE SALESHX
             IN DSN8D12A
             USING STOGROUP DSN8G120
               PRIQTY 4000
               SECQTY 130
               ERASE NO
             NUMPARTS 82
             (PARTITION 80
               COMPRESS YES,
              PARTITION 81
               COMPRESS YES,
              PARTITION 82
               COMPRESS YES
               ERASE YES)
             LOCKSIZE PAGE
             BUFFERPOOL BP1
             CLOSE NO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLESPACE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLESPACE TS1
             IN DSN8D12A
             USING STOGROUP DSN8G120
             NUMPARTS 55
             SEGSIZE 16
             LOCKSIZE ANY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLESPACE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLESPACE TS2
             IN DSN8D12A
             USING STOGROUP DSN8G120
             NUMPARTS 7
             (
              PARTITION 1 COMPRESS YES,
              PARTITION 3 COMPRESS YES,
              PARTITION 5 COMPRESS YES,
              PARTITION 7 COMPRESS YES
             )
             SEGSIZE 64
             DEFINE NO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLESPACE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create tablespace amsm lockmax 23 define yes member
        cluster dssize 23G TRACKMOD YES
        compress yes huffman lockpart yes
        numparts 2 (partition 2 using STOGROUP stgname PRIQTY -1)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRIGGER_ADV", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRIGGER NEW_HIRE
              AFTER INSERT ON EMPLOYEE
              FOR EACH ROW
              MODE DB2SQL
              BEGIN ATOMIC
                UPDATE COMPANY_STATS SET NBEMP = NBEMP + 1;
              END
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRIGGER_ADV2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRIGGER REORDER
             AFTER UPDATE OF ON_HAND, MAX_STOCKED ON PARTS
             REFERENCING NEW AS NROW
             FOR EACH ROW
              MODE DB2SQL
             WHEN (NROW.ON_HAND < 0.10 * NROW.MAX_STOCKED)
             BEGIN ATOMIC
               insert into tab (QTY_ORDERED)
               VALUES(ISSUE_SHIP_REQUEST(NROW.MAX_STOCKED
               - NROW.ON_HAND, NROW.PARTNO));
             END
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRIGGER_ADV3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRIGGER REORDER
             AFTER UPDATE OF ON_HAND, MAX_STOCKED ON PARTS
             REFERENCING NEW_TABLE AS NTABLE
             FOR EACH STATEMENT
              MODE DB2SQL
               BEGIN ATOMIC
                 SELECT ISSUE_SHIP_REQUEST(MAX_STOCKED -
                    ON_HAND, PARTNO)
                   FROM NTABLE
                 WHERE (ON_HAND < 0.10 * MAX_STOCKED);
             END
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRIGGER_ADV4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRIGGER SAL_ADJ
             AFTER UPDATE OF SALARY ON EMPLOYEE
             REFERENCING OLD AS OLD_EMP
                         NEW AS NEW_EMP
             FOR EACH ROW
               MODE DB2SQL
             WHEN (NEW_EMP.SALARY > (OLD_EMP.SALARY * 1.20))
               BEGIN ATOMIC
                 SIGNAL SQLSTATE '75001'
                 ('Invalid Salary Increase - Exceeds 20');
               END
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRIGGER_ADV5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TABLE WEATHER
              (CITY VARCHAR(25),
               TEMPF DECIMAL(5,2));
           CREATE VIEW CELSIUS_WEATHER (CITY, TEMPC) AS
              SELECT CITY, (TEMPF-32)/1.8
              FROM WEATHER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRIGGER_BASIC", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create TRIGGER salary_update_trigger
        AFTER UPDATE OF salary ON employees
        REFERENCING NEW AS n OLD AS o
        FOR EACH ROW MODE DB2SQL
        WHEN (n.salary > 1.1 * o.salary)
        BEGIN ATOMIC
        INSERT INTO salary_audit (emp_id)
        VALUES ((n.emp_id));
        INSERT INTO salary_audit (emp_id, name)
        VALUES (n.emp_id, kkl);
        END
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRUSTED_CONTEXT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRUSTED CONTEXT CTX1
               BASED UPON CONNECTION USING SYSTEM AUTHID ADMF001
               ATTRIBUTES (ADDRESS "9.30.131.203",
                           ENCRYPTION "LOW")
               DEFAULT ROLE CTXROLE
               ENABLE
               WITH USE FOR SAM, JOE ROLE ROLE1 WITH AUTHENTICATION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRUSTED_CONTEXT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRUSTED CONTEXT CTX2
             BASED UPON CONNECTION USING SYSTEM AUTHID ADMF002
             ATTRIBUTES (JOBNAME "WASPROD")
             DEFAULT ROLE CTXROLE WITH ROLE AS OBJECT OWNER
             AND QUALIFIER
             ENABLE
             WITH USE FOR SALLY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TRUSTED_CONTEXT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRUSTED CONTEXT CTX1
            BASED UPON CONNECTION USING SYSTEM AUTHID ADMF001
            ATTRIBUTES (
            address "2 . 4 . 5 . 62",
            ENCRYPTION "LOW",
            SERVAUTH "23"
            )
            ENABLE NO DEFAULT SECURITY LABEL
            with use for autnm security label sclbl
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_ARRAY", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE PHONENUMBERS AS DECIMAL(10,0) ARRAY[50]
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_ARRAY2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE GENERIC.NUMBERS AS DECFLOAT(34) ARRAY??(??)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_ARRAY3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE PERSONAL_PHONENUMBERS AS DECIMAL(16,0)
                 ARRAY??(VARCHAR(8)??)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_ARRAY4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE CAPITALSARRAY AS VARCHAR(30)
        ARRAY[VARCHAR(20)]
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_ARRAY5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE PRODUCTS AS VARCHAR(40) ARRAY??(INTEGER??)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_DISTINCT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE SHOESIZE AS INTEGER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TYPE_DISTINCT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TYPE MILES AS DOUBLE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_VARIABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE VARIABLE MYSCHEMA.MYJOB_PRINTER VARCHAR(30)
         DEFAULT "Default printer"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_VARIABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE VARIABLE SCHEMA1.GV_DEPTNO INTEGER
         DEFAULT "Unassigned"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_VIEW", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE VIEW DSN8C10.VPROJRE1
             (PROJNO,PROJNAME,PROJDEP,RESPEMP,
              FIRSTNME,MIDINIT,LASTNAME)
             AS SELECT ALL
             PROJNO,PROJNAME,DEPTNO,EMPNO,
             FIRSTNME,MIDINIT,LASTNAME
             FROM DSN8C10.PROJ, DSN8C10.EMP
             WHERE RESPEMP = EMPNO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_VIEW2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE VIEW DSN8C10.FIRSTQTR (SNO, CHARGES, DATE) AS
          SELECT SNO, CHARGES, DATE
          FROM MONTH1
          WHERE DATE BETWEEN '01/01/2000' and '01/31/2000'
            UNION All
          SELECT SNO, CHARGES, DATE
          FROM MONTH2
          WHERE DATE BETWEEN '02/01/2000' and '02/29/2000'
            UNION All
          SELECT SNO, CHARGES, DATE
          FROM MONTH3
          WHERE DATE BETWEEN '03/01/2000' and '03/31/2000'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_VIEW3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create VIEW top_publishers AS
        WITH publisher_ratings (col) AS (
        SELECT
                    p.name AS publisher_name,
                    AVG(b.rating) AS avg_rating
        FROM
            publishers p
            INNER JOIN books b ON p.publisher_id = b.publisher_id
        GROUP BY
                    p.name
        )
        SELECT
        publisher_name,
        avg_rating
        FROM
        publisher_ratings
        WHERE
        avg_rating = (SELECT MAX(avg_rating) FROM publisher_ratings)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("CREATE_TABLE1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        create table all (all integer, avg integer)
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllDeclareStatements", () => {
    test("DECLARE_CURSOR", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
        SELECT DEPTNO, DEPTNAME, MGRNO
        FROM DSN8C10.DEPT
        WHERE ADMRDEPT = 'A00'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_GLOBAL_TEMP_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE GLOBAL TEMPORARY TABLE SESSION.TEMP_EMP
          (EMPNO     CHAR(6)   NOT NULL,
           SALARY    DECIMAL(9, 2),
           BONUS     DECIMAL(9, 2),
           COMM      DECIMAL(9, 2))
           CCSID EBCDIC
           ON COMMIT PRESERVE ROWS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE DSN8C10.EMP TABLE
         (EMPNO     CHAR(6)     NOT NULL,
          FIRSTNME  VARCHAR(12) NOT NULL,
          MIDINIT   CHAR(1)     NOT NULL,
          LASTNAME  VARCHAR(15) NOT NULL,
          WORKDEPT  CHAR(3)             ,
          PHONENO   CHAR(4)             ,
          HIREDATE  DATE                ,
          JOB       CHAR(8)             ,
          EDLEVEL   SMALLINT            ,
          SEX       CHAR(1)             ,
          BIRTHDATE DATE                ,
          SALARY    DECIMAL(9,2)        ,
          BONUS     DECIMAL(9,2)        ,
          TIMESTAMP TIMESTAMP NOT NULL,
          COMM      DECIMAL(9,2)        )
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_STATEMENT", async () => {
      const { diagnostics } = await preprocessor.execute(
        `DECLARE OBJECT_STATEMENT STATEMENT`,
      );
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_VARIABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE :FRED VARIABLE CCSID EBCDIC FOR BIT DATA;
        DECLARE :JEAN VARIABLE CCSID 1208;
        DECLARE :DAVE VARIABLE CCSID UNICODE;
        DECLARE :PETE VARIABLE CCSID 1200;
        DECLARE :AMBER VARIABLE CCSID UNICODE;
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_STATEMENT_IN_WORKING_STORAGE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        declare asasa statement
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_STATEMENT_IN_LINKAGE_SECTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        declare asasa statement
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DECLARE_TABLE_WITH_COMPLEX_TIMESTAMP", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE TBL TABLE
         (TIMESTAMP TIMESTAMP(6) WITHOUT TIMEZONE NOT NULL)
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllDescribeStatements", () => {
    test("DESCRIBE_CURSOR", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DESCRIBE CURSOR C1 INTO :HOSTVAR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DESCRIBE_INPUT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DESCRIBE INPUT STMT1_NAME INTO :HOSTVAR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DESCRIBE_OUTPUT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DESCRIBE OUTPUT STMT1_NAME INTO :HOSTVAR USING LABELS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DESCRIBE_PROCEDURE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DESCRIBE PROCEDURE MyProc INTO :HOSTVAR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DESCRIBE_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DESCRIBE TABLE :HOSTVAR INTO :HOSTVAR USING BOTH
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllGrantStatements", () => {
    test("GRANT_ON_COLLECTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT CREATE IN COLLECTION DSN8CC91 TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_COLLECTION2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT CREATE IN COLLECTION QAACLONE, DSN8CC61 TO CLARK
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_DATABASE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT DROP
             ON DATABASE DSN8D12A
             TO PEREZ
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_DATABASE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT REPAIR
             ON DATABASE DSN8D12A
             TO PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_DATABASE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT CREATETAB,LOAD
         ON DATABASE DSN8D12A
         TO WALKER,PIANKA,FUJIMOTO
         WITH GRANT OPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_DATABASE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT LOAD
         ON DATABASE DSN9D91A
         TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_FUNCTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT EXECUTE ON FUNCTION CALC_SALARY TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SPECIFIC_FUNCTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT EXECUTE ON PROCEDURE VACATION_ACCR TO PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PROCEDURE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT EXECUTE ON SPECIFIC FUNCTION DEPT85_TOT TO ADMIN_A
         WITH GRANT OPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PACKAGE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT COPY ON PACKAGE DSN8CC61.* TO LEWIS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PACKAGE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT ALL ON PACKAGE CLCT1.PKG1, CLCT2.PKG2 TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PACKAGE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT EXECUTE ON PACKAGE DSN9CC13.* TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PLAN", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT BIND ON PLAN DSN8IP12 TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PLAN2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT BIND,EXECUTE ON PLAN DSN8CP12 TO PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PLAN3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT EXECUTE ON PLAN DSN8CP12 TO ADAMSON,
        BROWN WITH GRANT OPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_PLAN4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT BIND ON PLAN DSN91PLN TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SCHEMA", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT CREATEIN ON SCHEMA T_SCORES TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SCHEMA2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT ALTERIN ON SCHEMA DEPT TO ADMIN_A
         WITH GRANT OPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SCHEMA3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT CREATEIN, ALTERIN,
        DROPIN ON SCHEMA NEW_HIRE, PROMO, RESIGN TO HR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SCHEMA4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT ALTERIN ON SCHEMA EMPLOYEE TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SEQUENCE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USAGE
        ON SEQUENCE MYNUM
        TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_SEQUENCE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USAGE ON SEQUENCE ORDER_SEQ TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT DISPLAY
        TO LUTZ
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT BSDS,RECOVER
        TO PARKER,SETRIGHT
        WITH GRANT OPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT TRACE
        TO PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT ARCHIVE TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT CREATE_SECURE_OBJECT
        TO STEVE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT DBADM ON SYSTEM
         TO ROLE ADMINROLE;
        GRANT DBADM, ACCESSCTRL, DATAACCESS
        ON SYSTEM
        TO SALLY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_SYS_PRIVILGES7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT DBADM WITHOUT ACCESSCTRL
        WITHOUT DATAACCESS
        ON SYSTEM
        TO JOHN
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT SELECT ON DSN8C10.EMP TO PULASKI
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT ALL ON TABLE DSN8C10.EMP TO KWAN,
        THOMPSON WITH GRANT OPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_TABLE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT ALTER ON TABLE DSN9910.EMP
        TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_TYPE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USAGE ON TYPE SHOE_SIZE TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_TYPE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USAGE ON TYPE US_DOLLAR TO PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_TYPE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USAGE ON TYPE MILES
        TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_VARIABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT READ ON VARIABLE ACCOUNTNO TO JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_VARIABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USE OF TABLESPACE
         DSN8D12A.DSN8S12D
         TO PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("GRANT_ON_VARIABLE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GRANT USE OF STOGROUP SG1
        TO ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllRevokeStatements", () => {
    test("REVOKE_IN_COLLECTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE CREATE IN COLLECTION QAACLONE,
        DSN8CC61 FROM CLARK
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_IN_COLLECTION2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE CREATE IN COLLECTION DSN8CC91 FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_DATABASE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE DROP
         ON DATABASE DSN8D12A
         FROM PEREZ
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_DATABASE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE REPAIR
         ON DATABASE DSN8D12A
         FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_DATABASE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE CREATETAB,LOAD
        ON DATABASE DSN8D12A
        FROM WALKER,PIANKA,FUJIMOTO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_DATABASE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE LOAD
        ON DATABASE DSN8D12A
        FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_FUNCTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE EXECUTE ON FUNCTION CALC_SALARY FROM JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PROCEDURE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE EXECUTE ON PROCEDURE VACATION_ACCR FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PACKAGE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE COPY ON PACKAGE DSN8CC61.* FROM LEWIS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PACKAGE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE EXECUTE ON PACKAGE DSN9CC13.* FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PLAN", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE BIND ON PLAN DSN8IP12 FROM JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PLAN2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE BIND,EXECUTE ON PLAN DSN8CP12 FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PLAN3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE EXECUTE ON PLAN DSN8CP12 FROM ADAMSON,BROWN
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_PLAN4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE BIND ON PLAN DSN91PLN FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SCHEMA", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE CREATEIN ON SCHEMA T_SCORES FROM JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SCHEMA2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE CREATEIN ON SCHEMA VAC FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SCHEMA3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE ALTERIN ON SCHEMA DEPT FROM ADMIN_A
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SCHEMA4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE ALTERIN, DROPIN ON SCHEMA
        NEW_HIRE, PROMO, RESIGN FROM HR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SCHEMA5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE ALTERIN ON SCHEMA EMPLOYEE FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SEQUENCE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USAGE
         ON SEQUENCE MYNUM
         FROM JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_SEQUENCE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USAGE
        ON SEQUENCE ORDER_SEQ
        FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE DISPLAY
        FROM LUTZ
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE BSDS,RECOVER
        FROM PARKER,SETRIGHT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE TRACE
        FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE ARCHIVE
         FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE CREATE_SECURE_OBJECT
        FROM STEVE BY MARY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE DBADM ON SYSTEM
        FROM ROLE ADMINROLE
        NOT INCLUDING DEPENDENT PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_SYS_PRIVILGES7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE DBADM, DATAACCESS, ACCESSCTRL ON SYSTEM
        FROM ROLE ADMINROLE
        NOT INCLUDING DEPENDENT PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE SELECT ON TABLE DSN8C10.EMP FROM PULASKI
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE UPDATE ON TABLE DSN8C10.EMP FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TABLE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE ALL ON TABLE DSN8C10.EMP FROM KWAN,THOMPSON
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TABLE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE SELECT, UPDATE ON TABLE DSN8C10.DEPT
        FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TABLE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE ALTER ON TABLE DSN8C10.EMP
        FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TYPE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USAGE ON TYPE SHOESIZE FROM JONES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TYPE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USAGE ON TYPE US_DOLLAR FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TYPE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USAGE ON TYPE CANADIAN_DOLLARS
         FROM ADMIN_A
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_ON_TYPE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USAGE ON TYPE MILES
         FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_USE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USE OF BUFFERPOOL BP2
         FROM MARINO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_USE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USE OF TABLESPACE DSN8D12A.DSN8S12D
         FROM PUBLIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REVOKE_USE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REVOKE USE OF STOGROUP SG1
        FROM ROLE ROLE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllSetStatements", () => {
    test("SET_CONNECTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CONNECTION TOROLAB1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ASSIGNMENT_STATE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET :HVL = CURRENT PATH
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ASSIGNMENT_STATE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET :SERVER = CURRENT PATH,
       :XTIME = CURRENT TIME,
       :MEM = CURRENT MEMBER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ASSIGNMENT_STATE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET :DETAILS = SUBSTR(:LOCATOR,1,35)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ASSIGNMENT_STATE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT SUBSTR(:LOCATOR,1,35)
         INTO :DETAILS
         FROM SYSIBM.SYSDUMMYU
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ASSIGNMENT_STATE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET (SALARY, COMMISSION) = (50000, 8000)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_ACCELARATOR", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT ACCELERATOR = ACCEL1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_APPLICATION_COMPATIBILITY", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT APPLICATION COMPATIBILITY = "V11R1";
        SET CURRENT APPLICATION COMPATIBILITY = :HV1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_ENCODING_SCHEMA", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT APPLICATION ENCODING SCHEME = "EBCDIC";
        SET CURRENT ENCODING SCHEME  = :HV1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_DEBUG_MODE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT DEBUG MODE = ALLOW
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_DECFLOAT_ROUNDING_MODE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT DECFLOAT ROUNDING MODE = ROUND_CEILING
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_DEGREE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT DEGREE = "1"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_DEGREE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT DEGREE = "ANY"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_EXPLAIN_MODE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT EXPLAIN MODE = YES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_GET_ACCEL_ARCHIVE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT GET_ACCEL_ARCHIVE=NO
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_LOCALE_LC_CTYPE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT LOCALE LC_CTYPE = "En_US"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_LOCALE_LC_CTYPE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT LOCALE LC_CTYPE = :HV1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_MAINTAINED_TABLE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT MAINTAINED TABLE TYPES ALL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_MAINTAINED_TABLE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        VALUES (CURRENT MAINTAINED TABLE TYPES) INTO :CURMAINTYPES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_MAINTAINED_TABLE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT MAINTAINED TABLE TYPES NONE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_OPTIMIZATION_HINT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT OPTIMIZATION HINT = "NOHYB"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_OPTIMIZATION_HINT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT OPTIMIZATION HINT = ""
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_PACKAGE_PATH", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT PACKAGE PATH :hvar1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_PACKAGE_PATH2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT PACKAGE PATH =
        "COLL1","COLL#2","COLL3", :hvar1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_PACKAGE_PATH3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT PACKAGE PATH = ' '
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_PACKAGESET", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT PACKAGESET = "PERSONNEL"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_PACKAGESET2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT PACKAGESET = ""
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_PRECISION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT PRECISION = "DEC15"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_QUERY_ACCELERATION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT QUERY ACCELERATION NONE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_QUERY_ACCELERATION_WAITFORDATA", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT QUERY ACCELERATION WAITFORDATA = 180.0
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_QUERY_ACCELERATION_WAITFORDATA2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT QUERY ACCELERATION WAITFORDATA = 2.5
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_REFRESH_AGE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT REFRESH AGE ANY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_ROUTINE_VERSION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT ROUTINE VERSION = :rvid
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_RULES", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT RULES = "DB2"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_SQLID", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT SQLID = SESSION_USER
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_TEMPORAL_BUSINESS_TIME", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT TEMPORAL BUSINESS_TIME =
               TIMESTAMP('2008-01-01') + 5 DAYS ;
        SET CURRENT TEMPORAL BUSINESS_TIME =
              '2008-01-06-00.00.00.000000000000'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_TEMPORAL_SYSTEM_TIME2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT TEMPORAL BUSINESS_TIME =
                    CURRENT TIMESTAMP - 1 MONTH
        UPDATE att1 SET c1 = 5 WHERE pk = 100
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_CURRENT_TEMPORAL_SYSTEM_TIME3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT TEMPORAL BUSINESS_TIME = NULL
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ENCRYPTION_PASSWORD", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET ENCRYPTION PASSWORD = :hv1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_ENCRYPTION_PASSWORD2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET ENCRYPTION PASSWORD = 'somepwd' WITH HINT :hv2
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_PATH", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET PATH = SCHEMA1,"SCHEMA#2", SYSIBM
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_PATH2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET PATH = CURRENT PATH, SMITH, SYSPROC
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_SCHEMA", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET SCHEMA RICK
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_SCHEMA2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT CURRENT SCHEMA INTO :CURSCHEMA
         FROM SYSIBM.SYSDUMMY1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_SCHEMA3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT SQLID = "USRT001";
        SET CURRENT SCHEMA = "USRT002"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_SCHEMA4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET CURRENT SCHEMA = 'JOHN'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_SESSION_TIME_ZONE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET SESSION TIME ZONE = "-8:00"
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SET_VRAIABLE_VALUE_EVALUATED_BY_FUNCTION_CALL", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SET :WS-TIMESTAMP =
                     TIMESTAMP('1970-01-01-00.00.00.000000')
               + (:WS-TIMESTAMP / 1000) SECOND
               + (INT(CURRENT TIMEZONE/10000)) HOURS
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAllocateCursorStatement", () => {
    test("TestSqlAllocateCursorStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ALLOCATE C1 CURSOR FOR RESULT SET :LOC1
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlAssociateLocatorsStatement", () => {
    test("TestSqlAssociateLocatorsStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CONNECT TO SITE2;
        CALL SITE2.MYSCHEMA.P1;
        ASSOCIATE LOCATORS (:LOC1, :LOC2)
            WITH PROCEDURE :HV1;
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlBeginDeclareSectionStatement", () => {
    test("TestSqlBeginDeclareSectionStatement #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        BEGIN DECLARE SECTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TestSqlBeginDeclareSectionStatement #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        END DECLARE SECTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlCaseStatement", () => {
    test.fails("TestSqlCaseStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT
                 A.COL4
                ,CASE (A.COL5)
                 WHEN '00' THEN 'OK        '
                 WHEN '01' THEN 'OK        '
                 WHEN '02' THEN 'KO        '
                 WHEN '03' THEN 'KO        '
*                WHEN '04' THEN '=BLAH'
                 ELSE      'KO        '
                 END AS CASETEST
        INTO    :WS-VAR1
               ,:WS-VAR2
        FROM  TABLEA A,
              TABLEB B
        WHERE   A.COL1   = B.COL9
          AND   B.COL2  = :WS-VAR3
          AND   A.COL6     <> 'C'
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlCloseStatement", () => {
    test("TestSqlCloseStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
        SELECT DEPTNO, DEPTNAME, MGRNO
        FROM DSN8C10.DEPT
        WHERE ADMRDEPT = 'A00';
        OPEN C1;
        FETCH C1 INTO :DNUM, :DNAME, :MNUM;

        CLOSE C1;
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlColonsInFetchStatements", () => {
    test("TestSqlColonsInFetchStatements", async () => {
      const { diagnostics } = await preprocessor.execute(`
        FETCH NEXT ROWSET FROM TEST INTO :VAR
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlComment", () => {
    test.fails("TestSqlComment", async () => {
      const { diagnostics } = await preprocessor.execute(`
        open a
                *      select a from table a = b 
                       select a from table -- random where stuffss ss sdjsd
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlCommentStatement", () => {
    test("COMMENT1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        COMMENT ON TABLE DSN8C10.EMP
         IS "REFLECTS 1ST QTR 81 REORG"
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("COMMENT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        COMMENT ON COLUMN DSN8C10.DEPT.DEPTNO
        IS "DEPARTMENT ID - UNIQUE"
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("COMMENT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        COMMENT ON FUNCTION CHEM.ATOMIC_WEIGHT
        IS "TAKES ATOMIC NUMBER AND GIVES ATOMIC WEIGHT"
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("COMMENT4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        COMMENT ON PROCEDURE BIOLOGY.OSMOSIS
        IS "CALCULATIONS THAT MODEL OSMOSIS"
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("COMMENT5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        COMMENT ON ROLE ROLE1
        IS "Role defined for trusted context, ctx1"
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlCommitStatement", () => {
    test("TestSqlCommitStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        COMMIT WORK
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlConnectStatement", () => {
    test("TestSqlConnectStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CONNECT TO :LOCNAME USER :USER_AUTHID USING :USER_PASSWORD
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlDeleteStatement", () => {
    test("TestSqlDeleteStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DELETE FROM EMP WHERE CURRENT OF C1
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlDropStatement", () => {
    test("DROP1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP TABLE DSN8C10.DEPT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP TABLESPACE DSN8D12A.DSN8S12D
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP VIEW DSN8C10.VPROJRE1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP PACKAGE DSN8CC61.DSN8CC0 VERSION VERSZZZZ
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP PACKAGE DSN8.CC0 VERSION '1994sw3'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP TYPE DOCUMENT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP FUNCTION CHEM.ATOMIC_WEIGHT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP8", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP FUNCTION CENTER(INTEGER, FLOAT)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP9", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP SPECIFIC FUNCTION JOHNSON.FOCUS97
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP10", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP PROCEDURE BIOLOGY.OSMOSIS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP11", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP TRIGGER BONUS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP12", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP ROLE CTXROLE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP13", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP TRUSTED CONTEXT CTX1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("DROP14", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DROP PUBLIC ALIAS PUBALIAS1 FOR SEQUENCE
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlEndDeclareSectionStatement", () => {
    test("TestSqlEndDeclareSectionStatement #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        BEGIN DECLARE SECTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TestSqlEndDeclareSectionStatement #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INCLUDE STUDENT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TestSqlEndDeclareSectionStatement #3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        END DECLARE SECTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlExchangeStatement", () => {
    test("TestSqlExchangeStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        EXCHANGE DATA BETWEEN TABLE EMPCLONE AND EMPLOYEE
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlExecInDataSection", () => {
    test("TestSqlExecInDataSection #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        BEGIN DECLARE SECTION
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("TestSqlExecInDataSection #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        END DECLARE SECTION
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("TestSqlExecInDataSection #3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        WHENEVER SQLERROR GO TO 1000-ABEND-RTN
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlExecuteImmediateStatement", () => {
    test("TestSqlExecuteImmediateStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        EXECUTE IMMEDIATE :SQL-STMT
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlExecuteStatement", () => {
    test("TestSqlExecuteStatement #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INSERT INTO DSN8C10.DEPT VALUES('s1val')
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TestSqlExecuteStatement #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        EXECUTE DEPT_INSERT USING :SS
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlExplainStatement", () => {
    test("TestSqlExplainStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        EXPLAIN PLAN SET QUERYNO = 13
        FOR SELECT X.ACTNO, X.PROJNO, X.EMPNO, Y.JOB, Y.EDLEVEL
        FROM DSN8C10.EMPPROJACT X, DSN8C10.EMP Y
          WHERE X.EMPNO = Y.EMPNO
             AND X.EMPTIME > 0.5
              AND (Y.JOB = 'DESIGNER' OR Y.EDLEVEL >= 12)
          ORDER BY X.ACTNO, X.PROJNO;
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlFreeLocatorStatement", () => {
    test("TestSqlFreeLocatorStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        FREE LOCATOR :LOCRES, :LOCHIST, :LOCPIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlGetDiagnosticsStatement", () => {
    test("TestSqlGetDiagnosticsStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        GET DIAGNOSTICS :rcount = ROW_COUNT
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlGroupVariableUsage", () => {
    test("TestSqlGroupVariableUsage", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT :INP INTO :A.BBB FROM CACHE
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlHoldLocatorStatement", () => {
    test("TestSqlHoldLocatorStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        HOLD LOCATOR :LOCRES, :LOCHIST, :LOCPIC
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlHostVariableVariableLocation", () => {
    test("TestSqlHostVariableVariableLocation", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE QWE_STATUS
            SET A_B_C  = :QWE.D-E-F
            WHERE TKN_UNIQUE_REFERENCE = :ASD.O-P-R
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlHostedVariableInNestedProgram", () => {
    test("TestSqlHostedVariableInNestedProgram #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        HOLD LOCATOR :LOCRES, :LOCHIST, :LOCPIC
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("TestSqlHostedVariableInNestedProgram #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        HOLD LOCATOR :LOCRES2, :LOCHIST2, :LOCPIC2
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlIncludeStatement", () => {
    test("TestSqlIncludeStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INCLUDE STRUCT1
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlIncludeStatementForDefinedFields", () => {
    test("TestSqlIncludeStatementForDefinedFields #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INCLUDE SQLCA
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TestSqlIncludeStatementForDefinedFields #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INCLUDE SQLDA
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlIncludeStatementUsingRepeatedly", () => {
    test("TestSqlIncludeStatementUsingRepeatedly #1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INCLUDE STRUCT1
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("TestSqlIncludeStatementUsingRepeatedly #2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INCLUDE STRUCT2
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlInsertStatement", () => {
    test("INSERT1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INSERT INTO DSN8C10.EMP
         VALUES ('000205','MARY','T','SMITH','D11','2866',
              '1981-08-10','ANALYST',16,'F','1956-05-22',
             16345,500,2300)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INSERT INTO SMITH.TEMPEMPL
        SELECT *
        FROM DSN8C10.EMP
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INSERT INTO SESSION.TEMPEMPL
        SELECT *
         FROM DSN8C10.EMP
         WHERE WORKDEPT='D11'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INSERT INTO DSN8C10.EMP_PHOTO_RESUME
        (EMPNO, EMP_ROWID)
        VALUES (:HV_ENUM, DEFAULT)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        INSERT INTO DSN8C10.EMP_PHOTO_RESUME
        (EMPNO,EMP_ROWID)
         VALUES (:HV_ENUM,DEFAULT)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT6", async () => {
      const { diagnostics } = await preprocessor.execute(`
         SELECT * INTO :HV_ENUM FROM FINAL TABLE (
         INSERT INTO ABC INCLUDE (A SMALLINT,
         B SMALLINT) VALUEs (:TAD+1)
         )
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT7", async () => {
      const { diagnostics } = await preprocessor.execute(`
         INSERT INTO HOUSE
                     ( POLICYNUMBER,
                       PROPERTYTYPE,
                       BEDROOMS,
                       VALUE,
                       HOUSENAME,
                       HOUSENUMBER,
                       POSTCODE          )
              VALUES ( :DB2-POLICYNUM-INT,
                       :CA-H-PROPERTY-TYPE,
                       :DB2-H-BEDROOMS-SINT,
                       :DB2-H-VALUE-INT,
                       :CA-H-HOUSE-NAME,
                       :CA-H-HOUSE-NUMBER,
                       :CA-H-POSTCODE      )
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT8", async () => {
      const { diagnostics } = await preprocessor.execute(`
         insert into all values(1,1)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT9", async () => {
      const { diagnostics } = await preprocessor.execute(`
         insert into all(all,avg)
         select all all as all, avg from all
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("INSERT10", async () => {
      const { diagnostics } = await preprocessor.execute(`
           INSERT INTO TABLE1
           (
             TBL1_FIELD1
            ,TBL1_TIMESTAMP
           )
           VALUES
           (
             :WS-FIELD1
            ,TIMESTAMP(:WS-TIMESTAMP) +
                       (:WS-EXPIRES-IN SECONDS)
           )
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlLabelStatement", () => {
    test("LABEL1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        LABEL ON COLUMN DSN8C10.DEPT.DEPTNO
        IS "DEPARTMENT NUMBER"
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("LABEL2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        LABEL ON DSN8C10.DEPT
        (MGRNO IS "EMPLOYEE NUMBER FOR THE MANAGER",
        ADMRDEPT IS "ADMINISTERING DEPARTMENT")
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlLockTableStatement", () => {
    test("TestSqlLockTableStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        LOCK TABLE DSN8C10.EMP IN EXCLUSIVE MODE
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlMergeStatement", () => {
    test("MERGE1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO RECORDS AR
        USING (SELECT ACTIVITY, DESCRIPTION FROM ACTIVITIES) AC
        ON (AR.ACTIVITY = AC.ACTIVITY)
        WHEN MATCHED THEN
        UPDATE SET
        DESCRIPTION = AC.DESCRIPTION
        WHEN NOT MATCHED THEN
        INSERT
        (ACTIVITY, DESCRIPTION)
        VALUES (AC.ACTIVITY, AC.DESCRIPTION)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("MERGE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO INVENTORY AS IN
        USING (SELECT PARTNO, DESCRIPTION, COUNT FROM SHIPMENT
        WHERE SHIPMENT.PARTNO IS NOT NULL) AS SH
        ON (IN.PARTNO = SH.PARTNO)
        WHEN MATCHED THEN
         UPDATE SET
          DESCRIPTION = SH.DESCRIPTION,
          QUANTITY = IN.QUANTITY + SH.COUNT
        WHEN NOT MATCHED THEN
         INSERT
         (PARTNO, DESCRIPTION, QUANTITY)
         VALUES (SH.PARTNO, SH.DESCRIPTION, SH.COUNT)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("MERGE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO ACCOUNT AS A
         USING (SELECT ID, SUM(AMOUNT) SUM_AMOUNT FROM TRANSACTION
          GROUP BY ID) AS T
          ON A.ID = T.ID
         WHEN MATCHED THEN
          UPDATE SET
           BALANCE = A.BALANCE + T.SUM_AMOUNT
         WHEN NOT MATCHED THEN
          INSERT
          (ID, BALANCE)
           VALUES (T.ID, T.SUM_AMOUNT)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("MERGE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO EMPLOYEE_FILE AS E
         USING (SELECT EMPID, PHONE, OFFICE
          FROM (SELECT EMPID, PHONE, OFFICE,
          ROW_NUMBER() OVER (PARTITION BY EMPID
          ORDER BY TRANSACTION_TIME DESC) RN
          FROM TRANSACTION_LOG) AS NT
          WHERE RN = 1) AS T
          ON E.EMPID = T.EMPID
         WHEN MATCHED THEN
          UPDATE SET
           (PHONE, OFFICE) =
           (T.PHONE, T.OFFICE)
         WHEN NOT MATCHED THEN
          INSERT
          (EMPID, PHONE, OFFICE)
          VALUES (T.EMPID, T.PHONE, T.OFFICE)
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("MERGE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO RECORDS AR
         USING (SELECT ACTIVITY, DESCRIPTION, DATE, LAST_MODIFIED
          FROM ACTIVITIES_GROUPA) AC
          ON (AR.ACTIVITY = AC.ACTIVITY) AND AR.GROUP = 'A'
         WHEN MATCHED AND AC.DATE IS NULL THEN
          SIGNAL SQLSTATE '70001'
           SET MESSAGE_TEXT =
            AC.ACTIVITY CONCAT
            ' CANNOT BE MODIFIED. REASON: DATE IS NOT KNOWN'
         WHEN MATCHED AND AC.DATE < CURRENT DATE THEN
          DELETE
         WHEN MATCHED AND AR.LAST_MODIFIED < AC.LAST_MODIFIED THEN
          UPDATE SET
          (DESCRIPTION, DATE, LAST_MODIFIED) =
          (AC.DESCRIPTION, AC.DATE, DEFAULT)
         WHEN NOT MATCHED AND AC.DATE IS NULL THEN
          SIGNAL SQLSTATE '70002'
           SET MESSAGE_TEXT =
            AC.ACTIVITY CONCAT
           ' CANNOT BE INSERTED. REASON: DATE IS NOT KNOWN'
         WHEN NOT MATCHED AND AC.DATE >= CURRENT DATE THEN
          INSERT
           (GROUP, ACTIVITY, DESCRIPTION, DATE)
           VALUES ('A', AC.ACTIVITY, AC.DESCRIPTION, AC.DATE)
         ELSE IGNORE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("MERGE6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO RECORDS AR
          USING (VALUES (:hv_activity, :hv_description)
            FOR :hv_nrows ROWS)
            AS AC (ACTIVITY, DESCRIPTION)
          ON (AR.ACTIVITY = AC.ACTIVITY)
          WHEN MATCHED THEN UPDATE SET DESCRIPTION = AC.DESCRIPTION
          WHEN NOT MATCHED THEN INSERT (ACTIVITY, DESCRIPTION)
             VALUES (AC.ACTIVITY, AC.DESCRIPTION)
          NOT ATOMIC CONTINUE ON SQLEXCEPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("MERGE7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        MERGE INTO ACCOUNT AS A
          USING (VALUES (:hv_id, :hv_amount)
            FOR 3 ROWS)
            AS T (ID, AMOUNT)
          ON (A.ID = T.ID)
          WHEN MATCHED THEN UPDATE SET BALANCE =
          A.BALANCE + T.AMOUNT
          WHEN NOT MATCHED THEN INSERT (ID, BALANCE)
              VALUES (T.ID, T.AMOUNT)
          NOT ATOMIC CONTINUE ON SQLEXCEPTION
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlObjectsName", () => {
    test("TestSqlObjectsName", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT FÖ1R
        INTO :ARB-HELLO
        FROM 你好
        WHERE AD.FÖLR = :ARB-HELLO
                  and AD.XYZ = 'hello'
                  and AD.OIY =  :ARB-MD
                  and привет = hello_halo
                  and сайнуу = 'asa'
                  and नमस = 'नमस्ते'
        WITH UR
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlOpenStatement", () => {
    test("TestSqlOpenStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
        SELECT DEPTNO, DEPTNAME, MGRNO FROM DSN8C10.DEPT
        WHERE ADMRDEPT = 'A00';

        OPEN C1;
        FETCH C1 INTO :DNUM, :DNAME, :MNUM;
        CLOSE C1;
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlPrepareStatement", () => {
    test("TestSqlPrepareStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        PREPARE sample FROM :SQL-STMT
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlRefreshTableStatement", () => {
    test("REFRESH", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REFRESH TABLE SALESCOUNT
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("REFRESH2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        REFRESH TABLE SALESCOUNT QUERYNO 23
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlReleaseConnectionStatement", () => {
    test("RELEASE_CONNECTION", async () => {
      const { diagnostics } = await preprocessor.execute(`
        RELEASE TOROLAB1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("RELEASE_CONNECTION2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        RELEASE CURRENT
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlReleaseSavepointStatement", () => {
    test("TestSqlReleaseSavepointStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        RELEASE SAVEPOINT A
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlRenameStatement", () => {
    test("RENAME", async () => {
      const { diagnostics } = await preprocessor.execute(`
        RENAME TABLE EMP TO EMPLOYEE
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("RENAME2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        RENAME TABLE EMP_USA_HIS2002 TO EMPLOYEE_UNITEDSTATES_HISTORY2002
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("RENAME3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        RENAME INDEX COMPANY.EMPINDX1 TO EMPLOYEE_INDEX
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlRollbackStatement", () => {
    test("ROLLBACK", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ROLLBACK WORK
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("ROLLBACK2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        ROLLBACK WORK TO SAVEPOINT A
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlSavepointStatement", () => {
    test("SAVEPOINT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SAVEPOINT A ON ROLLBACK RETAIN CURSORS
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("SAVEPOINT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SAVEPOINT B UNIQUE ON ROLLBACK RETAIN CURSORS
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("SAVEPOINT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SAVEPOINT A UNIQUE ON ROLLBACK RETAIN CURSORS
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlSelectIntoStatement", () => {
    test("SELECT_INTO1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT MAX(SALARY)
          INTO :MAXSALRY
          FROM DSN8C10.EMP
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT_INTO2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT * INTO :EMPREC
         FROM DSN8C10.EMP
         WHERE EMPNO = '528671'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT_INTO3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT * INTO :EMPREC
         FROM DSN8C10.EMP
         WHERE EMPNO = '528671'
         WITH RS USE AND KEEP EXCLUSIVE LOCKS
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT_INTO4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT INTCOL1 INTO
         MYINTARRAY1[INTCOL2+:MYINTVAR+1]
         FROM T1
         WHERE INTCOL1 = MYINTARRAY1[INTCOL2]
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlSelectStatement", () => {
    test("SELECT", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT * FROM DSN8C10.EMP
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT * FROM DSN8C10.EMP
          ORDER BY HIREDATE
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT WORKDEPT, AVG(SALARY)
         FROM DSN8C10.EMP
         GROUP BY WORKDEPT
         ORDER BY 2
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE UP_CUR CURSOR FOR
        SELECT WORKDEPT, EMPNO, SALARY, BONUS, COMM
          FROM DSN8C10.EMP
          WHERE WORKDEPT IN ('D11','D21')
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT MAX(BONUS), MIN(BONUS), AVG(BONUS)
           INTO :MAX1, :MIN1, :AVG1
           FROM DSN8C10.EMP
           WITH UR
           QUERYNO 13
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
         SELECT * FROM RMTTAB
           FETCH FIRST 50 ROWS ONLY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT CONCAT('IBM','MAINFRAMER')
         AS Result FROM SYSIBM.SYSDUMMY1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT8", async () => {
      const { diagnostics } = await preprocessor.execute(`
        select all all, avg from all
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT9", async () => {
      const { diagnostics } = await preprocessor.execute(`
        select all, avg from all
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT10", async () => {
      const { diagnostics } = await preprocessor.execute(`
        select all all as all, avg from all
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT11", async () => {
      const { diagnostics } = await preprocessor.execute(`
          SELECT C_INTRN_SCP_ET                 
            INTO :A610-C-INTRN-SCP-ET           
            FROM VVA610                         
           WHERE C_ET_SICO     = :A610-C-ET-SICO
           FETCH FIRST 1 ROW ONLY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT12", async () => {
      const { diagnostics } = await preprocessor.execute(`
   SELECT                                     
     DATE(                                    
     YEAR(DATE(:WS-D-TRANSIT-2B)-1 MONTH)!!   
     '-'!!                                    
     MONTH(DATE(:WS-D-TRANSIT-2B)-1 MONTH)!!  
     '-'!!                                    
     '01'                                     
     )                                        
   INTO :WS-D-DEB                             
   FROM SYSIBM.SYSDUMMY1                      
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT13", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SELECT
          DATE(
          DAYS(
          DATE(
          YEAR(:WS-D-TRANSIT-2)!!
          '-'!!
          MONTH(:WS-D-TRANSIT-2)!!
          '-'!!
          '01'
          )
          )
          -1)
        INTO :WS-D-DEB
        FROM SYSIBM.SYSDUMMY1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT14", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
         SELECT * FROM RMTTAB
           FOR FETCH ONLY
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT15", async () => {
      const { diagnostics } = await preprocessor.execute(`
          WITH T1 AS
          (
          SELECT  CARD           AS PAN
                 ,CVV            AS CVV2
                 ,Y1             AS W1
                 ,Y2             AS W2
          FROM TABLEY
          )
          SELECT  'Y'
          INTO   :WS-D-DEB
          FROM TABLEY
          INNER JOIN T1 ON
                   TABLEY.Y1         = T1.W1
              AND  TABLEY.Y2         = T1.W2
          WHERE 1 = 1
         FETCH FIRST 1 ROW ONLY
         WITH UR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT16", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
         SELECT * FROM RMTTAB
           LIMIT 1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT17", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
         SELECT * FROM RMTTAB
           LIMIT 1,1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT18", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE C1 CURSOR FOR
         SELECT * FROM RMTTAB
           LIMIT 1 OFFSET 1
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT19", async () => {
      const { diagnostics } = await preprocessor.execute(`
       DECLARE SYSTAB_CSR CURSOR FOR
           SELECT DISTINCT T.NAME
           FROM SYSIBM.SYSTABLES T
               WHERE T.NAME = 'SYSPLAN'
                  AND T.NAME IN
                       (SELECT DISTINCT C.TBNAME
                          FROM SYSIBM.SYSCOLUMNS C
                         WHERE C.COLNO IN (1, 2, 3, 4, 5)
                           AND C.COLTYPE = 'CHAR'
                       )
                 FOR FETCH ONLY
               WITH UR
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("SELECT20", async () => {
      const { diagnostics } = await preprocessor.execute(`
       DECLARE SYSTAB_CSR2 CURSOR FOR
               SELECT DISTINCT T.NAME
                 FROM SYSIBM.SYSTABLES T
                 WHERE T.NAME NOT IN
                       (SELECT TB2.TBNAME
                          FROM SYSIBM.SYSCOLUMNS TB2
                         WHERE TB2.NAME = 'NAME'
                       )
                 FOR FETCH ONLY
               WITH UR
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlSignalStatement", () => {
    test("TestSqlSignalStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        SIGNAL SQLSTATE '75002'
        SET MESSAGE_TEXT = 'Customer number is not known'
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlSpecialNames", () => {
    test("TestSqlSpecialNames", async () => {
      const { diagnostics } = await preprocessor.execute(`
        DECLARE CUR-550 CURSOR FOR
            SELECT C_ISIN
            FROM   VVA550
            WHERE  D_EFF_DEB >= :WS-F900-JOUR-TRAIT
            UNION
            SELECT C_ISIN
            FROM   VVA550
            WHERE  D_EFF_FIN >= :WS-F900-JOUR-TRAIT
            FOR FETCH ONLY
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlSupportPoundSymbol", () => {
    test("TestSqlSupportPoundSymbol", async () => {
      const { diagnostics } = await preprocessor.execute(`
        EXCHANGE DATA BETWEEN TABLE EMPCLONE AND 'EMPCLONE£'
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlTransferOwnershipStatement", () => {
    test("TRANSFER_OWNERSHIP1", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRANSFER OWNERSHIP OF DATABASE DBCC001 TO USER USRT001
        REVOKE PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TRANSFER_OWNERSHIP2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRANSFER OWNERSHIP OF DATABASE DBCC002 TO ROLE OWNRROLE
        REVOKE PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TRANSFER_OWNERSHIP3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRANSFER OWNERSHIP OF DATABASE DBCC003 TO SESSION_USER
        REVOKE PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TRANSFER_OWNERSHIP4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRANSFER OWNERSHIP OF TABLE EMPLOYEE.DEPT TO ROLE TBOWNR_ROLE
        REVOKE PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("TRANSFER_OWNERSHIP5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRANSFER OWNERSHIP OF INDEX EMPLOYEE.SALARYIX TO USER IXOWNER
        REVOKE PRIVILEGES
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlTruncateStatement", () => {
    test("TRUNCATE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRUNCATE TABLE INVENTORY
        DROP STORAGE
        IGNORE DELETE TRIGGERS
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("TRUNCATE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRUNCATE TABLE INVENTORY
        REUSE STORAGE
        IGNORE DELETE TRIGGERS
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("TRUNCATE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        TRUNCATE TABLE INVENTORY
        REUSE STORAGE
        IGNORE DELETE TRIGGERS
        IMMEDIATE
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlUpdateStatement", () => {
    test("UPDATE", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE DSN8C10.EMP
         SET PHONENO='3565'
         WHERE EMPNO='000190'
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE DSN8C10.EMP
         SET SALARY = SALARY + 100
         WHERE WORKDEPT = 'D11';
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE DSN8C10.EMP
         SET SALARY = NULL, BONUS = NULL, COMM = NULL
         WHERE EMPNO='000250';
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE DSN8C10.EMP
         SET PROJSIZE = (SELECT COUNT(*)
          FROM DSN8C10.PROJ
          WHERE DEPTNO = 'E21')
        WHERE WORKDEPT = 'E21';
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE5", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE DSN8C10.EMP
          SET SALARY = 2 * SALARY
         WHERE CURRENT OF C1;
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE6", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE EMP1
         SET SALARY = SALARY + 1000,
          RESUME = UPDATE_RESUME(:HV_RESUME)
          WHERE EMP_ROWID = :HV_EMP_ROWID;
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE7", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE EMP X
         SET SALARY = 1.10 * SALARY
         WHERE SALARY < (SELECT AVG(SALARY) FROM EMP Y
         WHERE X.JOBCODE = Y.JOBCODE);
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE8", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE EMP T1
         SET SALARY = (SELECT AVG(T2.SALARY) FROM EMP T2)
         WHERE WORKDEPT = 'E11' AND
         SALARY < (SELECT AVG(T3.SALARY) FROM EMP T3);
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE9", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE DSN8710.EMP
          SET BONUS = ( SELECT .10 * SALARY FROM DSN8710.EMP Y
          WHERE EMPNO = Y.EMPNO )
        WHERE CURRENT OF C1;
      `);
      expect(diagnostics).toHaveLength(0);
    });
    test("UPDATE10", async () => {
      const { diagnostics } = await preprocessor.execute(`
        UPDATE T1 SET C1 = 5 WHERE CURRENT OF CS1;
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlValuesIntoStatement", () => {
    test("VALUES_INTO", async () => {
      const { diagnostics } = await preprocessor.execute(`
        VALUES(CURRENT PATH) INTO :HV1
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("VALUES_INTO2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        VALUES(CURRENT MEMBER) INTO :MEM
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("VALUES_INTO3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        VALUES (SUBSTR(:LOB1,1,35)) INTO :DETAILS
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("VALUES_INTO4", async () => {
      const { diagnostics } = await preprocessor.execute(`
        VALUES INTVAR1 INTO MYINTARRAY1[23]
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlValuesStatement", () => {
    test("TestSqlValuesStatement", async () => {
      const { diagnostics } = await preprocessor.execute(`
        CREATE TRIGGER EMPISRT1
        AFTER INSERT ON EMP
        REFERENCING NEW AS N
        FOR EACH ROW
        MODE DB2SQL
        BEGIN ATOMIC
         VALUES(NEWEMP(N.EMPNO, N.LASTNAME,N.FIRSTNAME));
        END
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
  describe("TestSqlWheneverStatement", () => {
    test("WHENEVER", async () => {
      const { diagnostics } = await preprocessor.execute(`
        WHENEVER SQLERROR GOTO HANDLER
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("WHENEVER2", async () => {
      const { diagnostics } = await preprocessor.execute(`
        WHENEVER SQLWARNING CONTINUE
      `);
      expect(diagnostics).toHaveLength(0);
    });

    test("WHENEVER3", async () => {
      const { diagnostics } = await preprocessor.execute(`
        WHENEVER NOT FOUND GO TO ENDDATA
      `);
      expect(diagnostics).toHaveLength(0);
    });
  });
});
