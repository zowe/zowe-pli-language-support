import { TokenType } from "chevrotain";
import { PPInstruction } from "./pli-preprocessor-instructions";
import { PliPreprocessorInterpreterState } from "./pli-preprocessor-interpreter-state";

export class PliPreprocessorInterpreter {
    run(program: PPInstruction[], idTokenType: TokenType) {
        const state = new PliPreprocessorInterpreterState(program, idTokenType);
        while(!state.halt) {
            // const xxx = printInstruction(state.currentInstruction, state);
            // console.log(xxx);
            state.step();
        }
        return state.getOutput();
    }
}