import { EmptyFileSystem } from "langium";
import { beforeAll, describe, expect, test } from "vitest";
import { createPliServices } from "../../src";

type TokenizeFunction = (text: string) => string[];

describe("Lexer", () => {
    let tokenize: TokenizeFunction;

    beforeAll(async() => {
        const services = createPliServices(EmptyFileSystem);
        await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
        tokenize = (text: string) => services.pli.parser.Lexer.tokenize(text).tokens.map(t => t.image+':'+t.tokenType.name);
    });

    test("Empty", () => {
        expect(tokenize('')).toStrictEqual([]);
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

    test('Example 1 from documentation', () => {
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
});