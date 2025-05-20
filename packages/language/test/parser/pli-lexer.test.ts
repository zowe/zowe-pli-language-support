import { beforeAll, describe, expect, test } from "vitest";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import { URI } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";

type TokenizeFunction = (text: string) => string[];

describe("PL/1 Lexer", () => {
  let tokenize: TokenizeFunction;
  let tokenizeWithErrors: TokenizeFunction;

  beforeAll(async () => {
    const lexer = new PliLexer();
    tokenize = (text: string) => {
      const uri = URI.file("/test/test.pli");
      const { all: allTokens, errors } = lexer.tokenize(
        createCompilationUnit(uri),
        text,
        uri,
      );
      if (errors.length > 0) {
        throw new Error(
          errors.map((e) => `${e.line}:${e.column}: ${e.message}`).join("\n"),
        );
      }
      return allTokens.map(
        (t) => t.image + ":" + t.tokenType.name.toUpperCase(),
      );
    };
    tokenizeWithErrors = (text: string) => {
      const uri = URI.file("/test/test.pli");
      const { errors } = lexer.tokenize(createCompilationUnit(uri), text, uri);
      return errors.map((e) => e.message);
    };
  });

  test("Empty", () => {
    expect(tokenize("")).toStrictEqual([]);
  });

  test("Preprocessor garbage", () => {
    expect(tokenizeWithErrors(" %garbage")).toStrictEqual([
      `Expected token type '=', got '' instead.`,
    ]);
  });

  test("PL/I garbage", () => {
    //This is not an error, since it is a valid PL/I token.
    //The error will pop up in the PL/I parser due to syntax rules!
    expect(tokenizeWithErrors(" garbage")).toStrictEqual([]);
  });

  test("Tokenize simple declaration without preprocessor", () => {
    expect(tokenize(" dcl A fixed bin(31);")).toStrictEqual([
      "dcl:DECLARE",
      "A:A",
      "fixed:FIXED",
      "bin:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Tokenize simple declaration with preprocessor", () => {
    expect(
      tokenize(`
            %dcl A char;
            %A = 'B';
            dcl A%C fixed bin(31);
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "BC:ID",
      "fixed:FIXED",
      "bin:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Tokenize simple error in declaration with preprocessor", () => {
    expect(
      tokenizeWithErrors(`
            %decl A char;
            %A = 'B';
            dcl A%C fixed bin(31);
        `),
    ).toStrictEqual(["Expected token type '=', got 'id' instead."]);
  });

  test("Tokenize multiple errors in declaration with preprocessor", () => {
    expect(
      tokenizeWithErrors(`
            %decl A char;
            %%A = 'B';
        `),
    ).toStrictEqual([
      "Expected token type '=', got 'id' instead.",
      "Unexpected token '%'.",
    ]);
  });

  test("Replace with empty string", () => {
    expect(
      tokenize(`
            %dcl A char;
            %A = '';
            dcl A%C fixed bin(31);
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "C:C",
      "fixed:FIXED",
      "bin:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Example 1.1 from documentation", () => {
    expect(
      tokenize(`
            %DECLARE A CHARACTER, B FIXED;
            %A = 'B+C';
            %B = 2;
            X = A;
        `),
    ).toStrictEqual(["X:X", "=:=", "2:NUMBER", "+:+", "C:C", ";:;"]);
  });

  test("Example 1.2 from documentation", () => {
    expect(
      tokenize(`
            %DECLARE A CHARACTER, B FIXED;
            %A = 'B+C';
            %B = 2;
            %DEACTIVATE B;
            X = A;
        `),
    ).toStrictEqual(["X:X", "=:=", "B:B", "+:+", "C:C", ";:;"]);
  });

  test("Replace once then twice", () => {
    expect(
      tokenize(`
            %DECLARE A CHARACTER, B FIXED, C FIXED;
            %A = 'B+C';
            %B = 2;
            %C = 3;
            X = A;
        `),
    ).toStrictEqual(["X:X", "=:=", "2:NUMBER", "+:+", "3:NUMBER", ";:;"]);
  });

  test("Page directive will be ignored", () => {
    expect(
      tokenize(`
            %PAGE;
            dcl A fixed bin(31);
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "A:A",
      "fixed:FIXED",
      "bin:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Skip directive will ignore only the next line", () => {
    expect(
      tokenize(`
            %SKIP;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "B:B",
      "fixed:FIXED",
      "bin:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Skip directive will ignore 2 next lines", () => {
    expect(
      tokenize(`
            %SKIP (2);
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).toStrictEqual([]);
  });

  test("Skip directive without parentheses should not lex correctly", () => {
    expect(
      tokenizeWithErrors(`
            %SKIP 2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).not.toStrictEqual([]);
  });

  test("Skip directive with incorrect parentheses should not lex correctly", () => {
    expect(
      tokenizeWithErrors(`
            %SKIP (2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).not.toStrictEqual([]);
  });

  test("Assign a preprocessed value", () => {
    expect(
      tokenize(`
            DCL WHAT FIXED;
            %DECLARE A CHARACTER;
            %A = '123';
            WHAT = A;
        `),
    ).toStrictEqual([
      "DCL:DECLARE",
      "WHAT:ID",
      "FIXED:FIXED",
      ";:;",
      "WHAT:ID",
      "=:=",
      "123:NUMBER",
      ";:;",
    ]);
  });

  test("Hello World", () => {
    expect(
      tokenize(`
            AVERAGE: PROCEDURE OPTIONS (MAIN);
                /* Test characters: ^[] € */
                /* AVERAGE_GRADE = SUM / 5; */
                PUT LIST ('PROGRAM TO COMPUTE AVERAGE');
            END AVERAGE;
        `),
    ).toStrictEqual([
      "AVERAGE:ID",
      ":::",
      "PROCEDURE:PROCEDURE",
      "OPTIONS:OPTIONS",
      "(:(",
      "MAIN:MAIN",
      "):)",
      ";:;",
      "PUT:PUT",
      "LIST:LIST",
      "(:(",
      "'PROGRAM TO COMPUTE AVERAGE':STRING_TERM",
      "):)",
      ";:;",
      "END:END",
      "AVERAGE:ID",
      ";:;",
    ]);
  });

  test("NodeDescriptor", () => {
    expect(
      tokenize(`
            a: proc( x ) options(nodescriptor);
              dcl x(20) fixed bin nonconnected;
            end a;
        `),
    ).toStrictEqual([
      "a:A",
      ":::",
      "proc:PROCEDURE",
      "(:(",
      "x:X",
      "):)",
      "options:OPTIONS",
      "(:(",
      "nodescriptor:NODESCRIPTOR",
      "):)",
      ";:;",
      "dcl:DECLARE",
      "x:X",
      "(:(",
      "20:NUMBER",
      "):)",
      "fixed:FIXED",
      "bin:BINARY",
      "nonconnected:NONCONNECTED",
      ";:;",
      "end:END",
      "a:A",
      ";:;",
    ]);
  });

  test("Simple IF-THEN-ELSE", () => {
    expect(
      tokenize(`
            %IF 1 %THEN
              %A = 123;
            %ELSE
              %A = 456;
            %ACTIVATE A;
            dcl X fixed;
            X = A;
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "X:X",
      "fixed:FIXED",
      ";:;",
      "X:X",
      "=:=",
      "123:NUMBER",
      ";:;",
    ]);
  });

  test("IF-THEN-ELSE with DO group", () => {
    expect(
      tokenize(`
            %A = 123;
            %IF 1 %THEN %DO;
              %A = %A + 1;
              %A = %A + 2;
            %END;
            %ACTIVATE A;
            dcl X fixed;
            X = A;
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "X:X",
      "fixed:FIXED",
      ";:;",
      "X:X",
      "=:=",
      "126:NUMBER",
      ";:;",
    ]);
  });

  test("DO WHILE", () => {
    expect(
      tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %WHILE(%X <= 3);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `),
    ).toStrictEqual([
      "DCL:DECLARE",
      "Variable1:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable2:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable3:ID",
      "FIXED:FIXED",
      ";:;",
    ]);
  });

  test("DO WHILE UNTIL", () => {
    expect(
      tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %WHILE(%X > 0)
                %UNTIL(%X > 3);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `),
    ).toStrictEqual([
      "DCL:DECLARE",
      "Variable1:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable2:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable3:ID",
      "FIXED:FIXED",
      ";:;",
    ]);
  });

  test("DO UNTIL", () => {
    expect(
      tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %UNTIL(%X > 3);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `),
    ).toStrictEqual([
      "DCL:DECLARE",
      "Variable1:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable2:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable3:ID",
      "FIXED:FIXED",
      ";:;",
    ]);
  });

  test("DO UNTIL-WHILE", () => {
    expect(
      tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %UNTIL(%X > 3)
                %WHILE(%X > 0);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `),
    ).toStrictEqual([
      "DCL:DECLARE",
      "Variable1:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable2:ID",
      "FIXED:FIXED",
      ";:;",
      "DCL:DECLARE",
      "Variable3:ID",
      "FIXED:FIXED",
      ";:;",
    ]);
  });

  test("DO FOREVER with LEAVE", () => {
    expect(
      tokenize(`
            %DO %FOREVER;
                %LEAVE;
            %END;
        `),
    ).toStrictEqual([]);
  });

  test("DO FOREVER without LEAVE", () => {
    // This might be an intermediate step in the development of a DO FOREVER loop
    // The lexer should eventually terminate anyway
    expect(
      tokenize(`
            %DO %FOREVER;
              /* TERMINATE */
            %END;
        `),
    ).toStrictEqual([]);
  });

  test("Nested DO-block with LEAVE outer one", () => {
    expect(
      tokenize(`
            %outer: DO %FOREVER;
                %DO %FOREVER;
                    %LEAVE outer;
                %END;
            %END;
        `),
    ).toStrictEqual([]);
  });

  test("Nested DO-block with LEAVE inner, then outer one", () => {
    expect(
      tokenize(`
            %outer: DO %FOREVER;
                %inner: DO %FOREVER;
                    %LEAVE inner;
                %END;
                %LEAVE;
            %END;
        `),
    ).toStrictEqual([]);
  });

  test("FOREVER with LEAVE condition", () => {
    expect(
      tokenize(`
            %declare A fixed;
            %A = 3;
            %DO %FOREVER;
                dcl X%A fixed;
                %A = %A - 1;
                %IF %A = 0 %THEN %LEAVE;
            %END;
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "X3:ID",
      "fixed:FIXED",
      ";:;",
      "dcl:DECLARE",
      "X2:ID",
      "fixed:FIXED",
      ";:;",
      "dcl:DECLARE",
      "X1:ID",
      "fixed:FIXED",
      ";:;",
    ]);
  });

  test("FOREVER with ITERATE", () => {
    expect(
      tokenize(`
            %declare A fixed;
            %A = 3;
            %DO %FOREVER;
                %A = %A - 1;
                %IF %A = 0 %THEN %LEAVE;
                %ELSE %ITERATE;
                dcl X%A fixed;
            %END;
        `),
    ).toStrictEqual([]);
  });

  test("DO with GOTO loop", () => {
    expect(
      tokenize(`
            %declare A fixed;
            %A = 3;
            %myLoop: DO;
                %A = %A - 1;
                %IF %A <> 0 %THEN %GO %TO myLoop;
                DCL X%A FIXED;
            %END;
        `),
    ).toStrictEqual(["DCL:DECLARE", "X0:ID", "FIXED:FIXED", ";:;"]);
  });

  test("DECLARE multiple ids in one statement #1", () => {
    expect(
      tokenize(`
            %declare A character, B fixed;
            %A = 'Hello';
            %B = 2;
            A%B = 123;
        `),
    ).toStrictEqual(["Hello2:ID", "=:=", "123:NUMBER", ";:;"]);
  });

  test("DECLARE multiple ids in one statement #2", () => {
    expect(
      tokenize(`
            %declare (A, B) character;
            %A = 'Hello';
            %B = 'World';
            A%B = 123;
        `),
    ).toStrictEqual(["HelloWorld:ID", "=:=", "123:NUMBER", ";:;"]);
  });

  test.skip("XYZ", () => {
    expect(
      tokenize(`
            %DCL GEN ENTRY;
            DCL A GEN(FIXED);
            %GEN: PROCEDURE(STRING) RETURNS (CHAR);
                DCL STRING CHAR;
                RETURN (STRING);
            END;
        `),
    ).toStrictEqual([
      // DCL A GENERIC(A2 WHEN (FIXED,FIXED),
      // A3 WHEN (FIXED, FIXED, FIXED),
      // A4 WHEN (FIXED, FIXED, FIXED, FIXED),
      // A5 WHEN (FIXED, FIXED, FIXED, FIXED, FIXED));
    ]);
  });

  test.skip("Preprocessor example", () => {
    //TODO the final procedure test
    expect(
      tokenize(`
            %DCL GEN ENTRY;
            DCL A GEN (A,2,5,FIXED);
            %GEN: PROC(NAME,LOW,HIGH,ATTR) RETURNS (CHAR);
                DCL (NAME, SUFFIX, ATTR, STRING) CHAR, (LOW, HIGH, I, J) FIXED;
                STRING='GENERIC(';
                DO I=LOW TO HIGH;                      /* ENTRY NAME LOOP*/
                    IF I>9 THEN
                    SUFFIX=SUBSTR(I, 7, 2);
                                                        /* 2 DIGIT SUFFIX*/
                    ELSE SUFFIX=SUBSTR(I, 8, 1);
                                                        /* 1 DIGIT SUFFIX*/
                    STRING=STRING||NAME||SUFFIX||' WHEN (';
                    DO J=1 TO I;                        /* DESCRIPTOR LIST*/
                    STRING=STRING||ATTR;
                    IF J<I                           /* ATTRIBUTE SEPARATOR*/
                        THEN STRING=STRING||',';
                        ELSE STRING=STRING||')';
                                                        /* LIST SEPARATOR */
                    END;
                    IF I<HIGH THEN                      /* ENTRY NAME SEPARATOR*/
                    STRING=STRING||',';
                    ELSE STRING=STRING||')';
                                                    /* END OF LIST /*
                END;
                RETURN (STRING);
            % END;
        `),
    ).toStrictEqual([
      // DCL A GENERIC(A2 WHEN (FIXED,FIXED),
      // A3 WHEN (FIXED, FIXED, FIXED),
      // A4 WHEN (FIXED, FIXED, FIXED, FIXED),
      // A5 WHEN (FIXED, FIXED, FIXED, FIXED, FIXED));
    ]);
  });
});
