import { describe, expect, test } from "vitest";
import { PliPreprocessorInterpreterState } from "../../src/parser/pli-preprocessor-interpreter-state";
import { PreprocessorTokens } from "../../src/parser/pli-preprocessor-tokens";
import { Instructions } from "../../src/parser/pli-preprocessor-instructions";
import { createTokenInstance } from "chevrotain";

namespace Fixtures {
    export function emptyProgram() {
        return new PliPreprocessorInterpreterState([
            Instructions.halt()
        ], PreprocessorTokens.Id);
    }
}

describe("Preprocessor Interpreter State", () => {
    describe("activate", () => {
        test("activate if not existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();

            //act
            state.activate("VARIABLE", "rescan");

            //assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy()
            expect(state.getVariable("VARIABLE").active).toBeTruthy()
        });

        test("activate if existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();
            state.declare("VARIABLE", {
                active: true,
                dataType: 'character',
                scanMode: "scan",
                value: [],
            });

            //act
            state.deactivate("VARIABLE");

            //assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy()
            expect(state.getVariable("VARIABLE").active).toBeFalsy()
        });
    });

    describe("assign", () => {
        test("assign if not existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();

            //act
            state.assign("VARIABLE", []);

            //assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy()
            expect(state.getVariable("VARIABLE").active).toBeFalsy()
        });

        test("assign if existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();
            state.declare("VARIABLE", {
                active: true,
                dataType: 'character',
                scanMode: "scan",
                value: [],
            });

            //act
            state.assign("VARIABLE", [createTokenInstance(PreprocessorTokens.Id, "bye", 0,0,0,0,0,0)]);

            //assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy()
            expect(state.getVariable("VARIABLE").value[0].image).toBe("bye")
        });
    });

    describe("hasVariable", () => {
        test("hasVariable if not existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();

            //act + assert
            expect(state.hasVariable("VARIABLE")).toBeFalsy();
        });

        test("hasVariable if existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();
            state.declare("VARIABLE", {
                active: true,
                dataType: 'character',
                scanMode: 'noscan',
                value: []
            })

            //act + assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy();
        });
    });

    describe("getVariable", () => {
        test("getVariable if not existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();

            //act + assert
            expect(state.getVariable("VARIABLE")).toBeUndefined();
        });

        test("getVariable if existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();
            state.declare("VARIABLE", {
                active: true,
                dataType: 'character',
                scanMode: 'noscan',
                value: []
            })

            //act + assert
            expect(state.getVariable("VARIABLE")).toBeDefined();
            expect(state.getVariable("VARIABLE").value.length).toBe(0);
        });
    });

    describe("declare", () => {
        test("declare if not existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();

            //act
            state.declare("VARIABLE", {
                active: true,
                dataType: 'fixed',
                scanMode: 'noscan',
                value: []
            })

            //assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy();
        });

        test("declare if existing", () => {
            //arrange
            const state = Fixtures.emptyProgram();
            state.declare("VARIABLE", {
                active: true,
                dataType: 'fixed',
                scanMode: 'noscan',
                value: []
            })

            //act
            state.declare("VARIABLE", {
                active: true,
                dataType: 'character',
                scanMode: 'noscan',
                value: [createTokenInstance(PreprocessorTokens.Number, "123", 0,0,0,0,0,0)]
            })

            //assert
            expect(state.hasVariable("VARIABLE")).toBeTruthy();
            expect(state.getVariable("VARIABLE").value[0].image).toBe('123');
        });
    });
});