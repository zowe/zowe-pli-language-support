import { describe, expect, test } from "vitest";
import { PliPreprocessorLexerState, PreprocessorLexerState, TextPosition } from "../../src/parser/pli-preprocessor-lexer-state";
import { PreprocessorTokens } from "../../src/parser/pli-preprocessor-tokens";

namespace Fixtures {
    export function empty(): PreprocessorLexerState {
        return new PliPreprocessorLexerState("");
    }
    export function declarationFixed() {
        return new PliPreprocessorLexerState("DCL VARIABLE FIXED;");
    }
}

describe("Preprocessor Lexer State", () => {
    describe("top", () => {
        test("top on empty", () => {
            //arrange
            const state = Fixtures.empty();

            //act + assert
            expect(state.top()).toBeUndefined();
        });

        test("top on non-empty", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const top = state.top();

            //assert
            expect(top).not.toBeUndefined();
            expect(top!.text).toBe("DCL VARIABLE FIXED;");
            expect(top!.line).toBe(1);
            expect(top!.column).toBe(1);
        });
    });

    describe("eof", () => {
        test("eof on empty", () => {
            //arrange
            const state = Fixtures.empty();

            //act + assert
            expect(state.eof()).toBeTruthy();
        });

        test("eof on non-empty", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const eof = state.eof();

            //assert
            expect(eof).toBeFalsy();
        });
    });

    describe("position", () => {
        test("position on empty", () => {
            //arrange
            const state = Fixtures.empty();

            //act + assert
            expect(state.position()).toStrictEqual<TextPosition>({
                offset: 0,
                column: 0,
                line: 0
            });
        });

        test("position on non-empty at beginning", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const position = state.position();

            //assert
            expect(position).toStrictEqual<TextPosition>({
                offset: 0,
                column: 1,
                line: 1
            });
        });

        test("position on non-empty in the middle", () => {
            //arrange
            const state = Fixtures.declarationFixed();
            state.advanceScan("DCL");

            //act
            const position = state.position();

            //assert
            expect(position).toStrictEqual<TextPosition>({
                offset: 3,
                column: 4,
                line: 1
            });
        });
    });

    describe("canConsume", () => {
        test("canConsume on empty", () => {
            //arrange
            const state = Fixtures.empty();

            //act
            const actual = state.canConsume(PreprocessorTokens.Declare);

            //assert
            expect(actual).toBeFalsy();
        });

        test("canConsume positive on non-empty at beginning", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const actual = state.canConsume(PreprocessorTokens.Declare);

            //assert
            expect(actual).toBe("DCL");
        });

        test("canConsume negative on non-empty in the middle", () => {
            //arrange
            const state = Fixtures.declarationFixed();
            state.advanceScan("DCL"); // " " is a gap between DCL and VARIABLE

            //act
            const actual = state.canConsume(PreprocessorTokens.Id);

            //assert
            expect(actual).toBeUndefined();
        });

        test("canConsume positive on non-empty in the middle", () => {
            //arrange
            const state = Fixtures.declarationFixed();
            state.advanceScan("DCL");
            state.advanceScan(" ");

            //act
            const actual = state.canConsume(PreprocessorTokens.Id);

            //assert
            expect(actual).toBe("VARIABLE");
        });

        test("canConsume negative on non-empty", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const actual = state.canConsume(PreprocessorTokens.Character);

            //assert
            expect(actual).toBeFalsy();
        });
    });


        /*
        tryConsume(tokenType: TokenType): IToken | undefined;
        emit(image: string, tokenType: TokenType): void;
        advanceLines(lineCount: number): void;
        advanceScan(scanned: string): void;
        
        activate(name: string, active: boolean): void;
        assign(name: string, value: number | string): void;
        declare(name: string, variable: PreprocessorVariable): void;
        hasVariable(name: string): boolean;
        getVariable(name: string): PreprocessorVariable;
        replaceVariable(text: string): void;
        */
});