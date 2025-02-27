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
    export function fourLines() {
        return new PliPreprocessorLexerState("DCL VARIABLE1 FIXED;\nDCL VARIABLE2 FIXED;\nDCL VARIABLE3 FIXED;\nDCL VARIABLE4 FIXED;");
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

    describe('tryConsume', () => {
        test("tryConsume on empty", () => {
            //arrange
            const state = Fixtures.empty();

            //act
            const actual = state.tryConsume(PreprocessorTokens.Declare);

            //assert
            expect(actual).toBeFalsy();
        });

        test("tryConsume positive on non-empty at beginning", () => {
            //arrange
            const state = Fixtures.declarationFixed();
            const { offset } = state.position();

            //act
            const actual = state.tryConsume(PreprocessorTokens.Declare);

            //assert
            expect(actual).not.toBeUndefined();
            expect(actual!.image).toBe("DCL");
            expect(state.eof()).toBeFalsy();
            expect(offset).toBeLessThan(state.position().offset);
        });

        test("tryConsume negative on non-empty in the middle", () => {
            //arrange
            const state = Fixtures.declarationFixed();
            state.advanceScan("DCL"); // " " is a gap between DCL and VARIABLE

            //act
            const actual = state.tryConsume(PreprocessorTokens.Id);

            //assert
            expect(actual).toBeUndefined();
        });

        test("tryConsume positive on non-empty in the middle", () => {
            //arrange
            const state = Fixtures.declarationFixed();
            state.advanceScan("DCL");
            state.advanceScan(" ");

            //act
            const actual = state.tryConsume(PreprocessorTokens.Id);

            //assert
            expect(actual).not.toBeUndefined();
            expect(actual!.image).toBe("VARIABLE");
        });

        test("tryConsume negative on non-empty", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const actual = state.tryConsume(PreprocessorTokens.Character);

            //assert
            expect(actual).toBeUndefined();
        });
    });

    describe("emit", () => {
        //Attention! You can emit anything. It will become a token with the specified image and advance by the length of the image.
        test("emit on empty", () => {
            //arrange
            const state = Fixtures.empty();

            //act
            const token = state.emit("haha", PreprocessorTokens.Declare);

            //assert
            expect(token).not.toBeUndefined();
            expect(token.image).toBe("haha");
            expect(token.tokenType).toBe(PreprocessorTokens.Declare);
            expect(state.eof()).toBeTruthy()
        });

        test("emit on non-empty", () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            const token = state.emit("haha", PreprocessorTokens.Declare);

            //assert
            expect(token).not.toBeUndefined();
            expect(token.image).toBe("haha");
            expect(token.tokenType).toBe(PreprocessorTokens.Declare);
            expect(state.eof()).toBeFalsy()
        });
    });

    describe("advanceLines", () => {
        test('advanceLines on empty', () => {
            //arrange
            const state = Fixtures.empty();

            //act
            state.advanceLines(100);

            //assert
            expect(state.eof()).toBeTruthy()
        });

        test('advanceLines on four lines, move 0 lines', () => {
            //arrange
            const state = Fixtures.fourLines();

            //act
            state.advanceLines(0);

            //assert
            expect(state.position().line).toBe(1);
            expect(state.eof()).toBeFalsy();
        });

        test('advanceLines on four lines, move 1 lines', () => {
            //arrange
            const state = Fixtures.fourLines();

            //act
            state.advanceLines(1);

            //assert
            expect(state.position().line).toBe(2);
            expect(state.eof()).toBeFalsy();
        });
        test('advanceLines on four lines, move 3 lines', () => {
            //arrange
            const state = Fixtures.fourLines();

            //act
            state.advanceLines(3);

            //assert
            expect(state.position().line).toBe(4);
            expect(state.eof()).toBeFalsy();
        });

        test('advanceLines on four lines, move 4 lines', () => {
            //arrange
            const state = Fixtures.fourLines();

            //act
            state.advanceLines(4);

            //assert
            expect(state.eof()).toBeTruthy();
        });
    });

    describe("advanceScan", () => {
        test('advanceScan on empty', () => {
            //arrange
            const state = Fixtures.empty();

            //act
            state.advanceScan("anything");

            //assert
            expect(state.eof()).toBeTruthy()
        });

        test('advanceScan on non-empty', () => {
            //arrange
            const state = Fixtures.declarationFixed();

            //act
            state.advanceScan("anything");

            //assert
            expect(state.eof()).toBeFalsy()
            expect(state.position().offset).toBe("anything".length);
        });
    });
});