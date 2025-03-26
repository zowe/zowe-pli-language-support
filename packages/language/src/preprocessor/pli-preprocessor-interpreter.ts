import { TokenType } from "chevrotain";
import { PliPreprocessorInterpreterState } from "./pli-preprocessor-interpreter-state";
import { PliPreprocessorProgram } from "./pli-preprocessor-program-builder";

export class PliPreprocessorInterpreter {
    run(program: PliPreprocessorProgram, idTokenType: TokenType) {
        const state = new PliPreprocessorInterpreterState(program.instructions, idTokenType);
        while(!state.halt) {
            state.step();
        }
        return state.getOutput();
    }
}