import { Parser } from "./parser-types";
import * as ast from "../syntax-tree/ast";
import { IRecognitionException } from "chevrotain";
import { finalParserState, ParserState } from "./parser-state";
import { Token } from "./tokens";

export class HandwrittenParser implements Parser<ast.Program, Token> {
    private _input: Token[] = [];
    set input(value: Token[]) {
        this._input = value;
    }
    get errors(): IRecognitionException[] {
        return [];
    }
    
    parse(): ast.Program {
        const state = finalParserState(this._input);
        return this.rulePliProgram(state);
    }

    rulePliProgram(_state: ParserState): ast.Program {
        return undefined!;
    }
}

export const HandwrittenParserInstance = new HandwrittenParser();
