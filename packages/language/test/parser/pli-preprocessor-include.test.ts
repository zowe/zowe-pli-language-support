import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createPliServices } from "../../src";
import { rmSync, writeFileSync } from "fs";
import { EmptyFileSystem } from "langium";

type TokenizeFunction = (text: string) => string[];

describe("PL/1 Includes", () => {
    let tokenize: TokenizeFunction;

    beforeAll(async () => {
        writeFileSync('payroll.pli', ' DECLARE PAYROLL FIXED;');
        const services = createPliServices(EmptyFileSystem);
        tokenize = (text: string) => {
            const { tokens } = services.pli.parser.Lexer.tokenize(text);
            return tokens.map(t => t.image + ':' + t.tokenType.name.toUpperCase());
        };
    });

    afterAll(() => {
        rmSync('payroll.pli');
    });

    test("Include twice with different IDs", () => {
        expect(tokenize(`
            %DECLARE PAYROLL CHARACTER;
            %PAYROLL = 'CUM_PAY';
            %INCLUDE "payroll.pli";
            %DEACTIVATE PAYROLL;
            %INCLUDE "payroll.pli";
        `)).toStrictEqual([
            "DECLARE:DECLARE",
            "CUM_PAY:ID",
            "FIXED:FIXED",
            ";:;",
            "DECLARE:DECLARE",
            "PAYROLL:ID",
            "FIXED:FIXED",
            ";:;",
        ]);
    });
});