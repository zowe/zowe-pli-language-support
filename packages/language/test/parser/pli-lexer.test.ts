import { EmptyFileSystem } from "langium";
import { beforeAll, describe, expect, test } from "vitest";
import { createPliServices } from "../../src";

type TokenizeFunction = (text: string) => string[];

describe("Lexer", () => {
    let tokenize: TokenizeFunction;

    beforeAll(() => {
        const services = createPliServices(EmptyFileSystem);
        tokenize = (text: string) => services.pli.parser.Lexer.tokenize(text).tokens.map(t => t.image+':'+t.tokenType.name);
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
});