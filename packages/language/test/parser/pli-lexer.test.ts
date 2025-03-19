import { EmptyFileSystem } from "langium";
import { beforeAll, describe, expect, test } from "vitest";
import { createPliServices } from "../../src";

type TokenizeFunction = (text: string) => string[];

describe("PL/1 Lexer", () => {
    let tokenize: TokenizeFunction;
    let tokenizeWithErrors: TokenizeFunction;

    beforeAll(async () => {
        const services = createPliServices(EmptyFileSystem);
        tokenize = (text: string) => {
            const { tokens } = services.pli.parser.Lexer.tokenize(text);
            return tokens.map(t => t.image + ':' + t.tokenType.name.toUpperCase());
        };
        tokenizeWithErrors = (text: string) => {
            const { errors } = services.pli.parser.Lexer.tokenize(text);
            return errors.map(e => e.message);
        };
    });

    test("Empty", () => {
        expect(tokenize('')).toStrictEqual([]);
    });

    test("Preprocessor garbage", () => {
        expect(tokenizeWithErrors(' %garbage')).toStrictEqual([`Expected token type 'eq', got '???' instead.`]);
    });

    test("PL/I garbage", () => {
        //This is not an error, since it is a valid PL/I token.
        //The error will pop up in the PL/I parser due to syntax rules!
        expect(tokenizeWithErrors(' garbage')).toStrictEqual([]);
    });

    test("Tokenize simple declaration without preprocessor", () => {
        expect(tokenize(' dcl A fixed bin(31);')).toStrictEqual([
            "dcl:DCL",
            "A:A",
            "fixed:FIXED",
            "bin:BIN",
            "(:(",
            "31:NUMBER",
            "):)",
            ";:;",
        ]);
    });


    test("Tokenize simple declaration with preprocessor", () => {
        expect(tokenize(`
            %dcl A char;
            %A = 'B';
            dcl A%C fixed bin(31);
        `)).toStrictEqual([
            "dcl:DCL",
            "BC:ID",
            "fixed:FIXED",
            "bin:BIN",
            "(:(",
            "31:NUMBER",
            "):)",
            ";:;",
        ]);
    });

    test("Tokenize simple error in declaration with preprocessor", () => {
        expect(tokenizeWithErrors(`
            %decl A char;
            %A = 'B';
            dcl A%C fixed bin(31);
        `)).toStrictEqual([
            "Expected token type 'eq', got 'id' instead."
        ]);
    });

    test("Tokenize multiple errors in declaration with preprocessor", () => {
        expect(tokenizeWithErrors(`
            %decl A char;
            %%A = 'B';
        `)).toStrictEqual([
            "Expected token type 'eq', got 'id' instead.",
            "Unexpected token '%'."
        ]);
    });

    test("Replace with empty string", () => {
        expect(tokenize(`
            %dcl A char;
            %A = '';
            dcl A%C fixed bin(31);
        `)).toStrictEqual([
            "dcl:DCL",
            "C:C",
            "fixed:FIXED",
            "bin:BIN",
            "(:(",
            "31:NUMBER",
            "):)",
            ";:;",
        ]);
    });

    test('Example 1.1 from documentation', () => {
        expect(tokenize(`
            %DECLARE A CHARACTER, B FIXED;
            %A = 'B+C';
            %B = 2;
            X = A;
        `)).toStrictEqual([
            "X:X",
            "=:=",
            "2:NUMBER",
            "+:+",
            "C:C",
            ";:;"
        ]);
    });

    test('Example 1.2 from documentation', () => {
        expect(tokenize(`
            %DECLARE A CHARACTER, B FIXED;
            %A = 'B+C';
            %B = 2;
            %DEACTIVATE B;
            X = A;
        `)).toStrictEqual([
            "X:X",
            "=:=",
            "B:B",
            "+:+",
            "C:C",
            ";:;"
        ]);
    });

    test('Replace once then twice', () => {
        expect(tokenize(`
            %DECLARE A CHARACTER, B FIXED, C FIXED;
            %A = 'B+C';
            %B = 2;
            %C = 3;
            X = A;
        `)).toStrictEqual([
            "X:X",
            "=:=",
            "2:NUMBER",
            "+:+",
            "3:NUMBER",
            ";:;"
        ]);
    });

    test("Page directive will be ignored", () => {
        expect(tokenize(`
            %PAGE;
            dcl A fixed bin(31);
        `)).toStrictEqual([
            "dcl:DCL",
            "A:A",
            "fixed:FIXED",
            "bin:BIN",
            "(:(",
            "31:NUMBER",
            "):)",
            ";:;",
        ]);
    });

    test("Skip directive will ignore only the next line", () => {
        expect(tokenize(`
            %SKIP;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `)).toStrictEqual([
            "dcl:DCL",
            "B:B",
            "fixed:FIXED",
            "bin:BIN",
            "(:(",
            "31:NUMBER",
            "):)",
            ";:;",
        ]);
    });

    test("Skip directive will ignore 2 next lines", () => {
        expect(tokenize(`
            %SKIP 2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `)).toStrictEqual([]);
    });

    test("Assign a preprocessed value", () => {
        expect(tokenize(`
            DCL WHAT FIXED;
            %DECLARE A CHARACTER;
            %A = '123';
            WHAT = A;
        `)).toStrictEqual([
            "DCL:DCL",
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
        expect(tokenize(`
            AVERAGE: PROCEDURE OPTIONS (MAIN);
                /* Test characters: ^[] € */
                /* AVERAGE_GRADE = SUM / 5; */
                PUT LIST ('PROGRAM TO COMPUTE AVERAGE');
            END AVERAGE;
        `)).toStrictEqual([
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
        expect(tokenize(`
            a: proc( x ) options(nodescriptor);
              dcl x(20) fixed bin nonconnected;
            end a;
        `)).toStrictEqual([
            "a:A",
            ":::",
            "proc:PROC",
            "(:(",
            "x:X",
            "):)",
            "options:OPTIONS",
            "(:(",
            "nodescriptor:NODESCRIPTOR",
            "):)",
            ";:;",
            "dcl:DCL",
            "x:X",
            "(:(",
            "20:NUMBER",
            "):)",
            "fixed:FIXED",
            "bin:BIN",
            "nonconnected:NONCONNECTED",
            ";:;",
            "end:END",
            "a:A",
            ";:;",
        ]);
    });

    test('Simple IF-THEN-ELSE', () => {
        expect(tokenize(`
            %IF 1 %THEN
              %A = 123;
            %ELSE
              %A = 456;
            %ACTIVATE A;
            dcl X fixed;
            X = A;
        `)).toStrictEqual([
            "dcl:DCL",
            "X:X",
            "fixed:FIXED",
            ";:;",
            "X:X",
            "=:=",
            "123:NUMBER",
            ";:;",
        ]);
    });

    test('IF-THEN-ELSE with DO group', () => {
        expect(tokenize(`
            %A = 123;
            %IF 1 %THEN %DO
              %A = %A + 1;
              %A = %A + 2;
            %END;
            %ACTIVATE A;
            dcl X fixed;
            X = A;
        `)).toStrictEqual([
            "dcl:DCL",
            "X:X",
            "fixed:FIXED",
            ";:;",
            "X:X",
            "=:=",
            "126:NUMBER",
            ";:;",
        ]);
    });

    test('DO WHILE', () => {
        expect(tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %WHILE(%X <= 3);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `)).toStrictEqual([
            "DCL:DCL",
            "Variable1:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable2:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable3:ID",
            "FIXED:FIXED",
            ";:;",
        ]);
    });

    test('DO WHILE UNTIL', () => {
        expect(tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %WHILE(%X > 0)
                %UNTIL(%X > 3);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `)).toStrictEqual([
            "DCL:DCL",
            "Variable1:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable2:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable3:ID",
            "FIXED:FIXED",
            ";:;",
        ]);
    });

    test('DO UNTIL', () => {
        expect(tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %UNTIL(%X > 3);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `)).toStrictEqual([
            "DCL:DCL",
            "Variable1:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable2:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable3:ID",
            "FIXED:FIXED",
            ";:;",
        ]);
    });

    test('DO UNTIL-WHILE', () => {
        expect(tokenize(`
            %DCL X FIXED;
            %X = 1;
            %DO
                %UNTIL(%X > 3)
                %WHILE(%X > 0);
                DCL Variable%X FIXED;
                %X = %X + 1;
            %END;
        `)).toStrictEqual([
            "DCL:DCL",
            "Variable1:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable2:ID",
            "FIXED:FIXED",
            ";:;",
            "DCL:DCL",
            "Variable3:ID",
            "FIXED:FIXED",
            ";:;",
        ]);
    });

    test.skip('DO FOREVER', () => {
        //TODO implement when you have LEAVE or GOTO ready
        expect(tokenize(`
            %DO %FOREVER;
                
            %END;
        `)).toStrictEqual([]);
    });
});