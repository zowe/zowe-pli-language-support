/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { ILexingError, IToken } from "chevrotain";
import { MarginsProcessor, PliMarginsProcessor } from "./pli-margins-processor";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorInterpreter } from "./pli-preprocessor-interpreter";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PliPreprocessorGenerator } from "./pli-preprocessor-generator";
import { PliSmartTokenPickerOptimizer } from "./pli-token-picker-optimizer";
import * as tokens from '../parser/tokens';
import { URI } from "../utils/uri";

export interface LexerResult {
    all: IToken[];
    errors: ILexingError[];
    fileTokens: Record<string, IToken[]>;
}

/**
 * Lexer for PL/I language. It orchestrates a margins processor and a preprocessor. 
 * The latter creates the desired token stream without preprocessor statements
 */
export class PliLexer {
    readonly marginsProcessor: MarginsProcessor;
    readonly preprocessorLexer: PliPreprocessorLexer;
    readonly preprocessorParser: PliPreprocessorParser;
    readonly preprocessorGenerator: PliPreprocessorGenerator;
    readonly preprocessorInterpreter: PliPreprocessorInterpreter;

    constructor() {
        this.marginsProcessor = new PliMarginsProcessor();
        this.preprocessorLexer = new PliPreprocessorLexer(new PliSmartTokenPickerOptimizer(), tokens.all);
        this.preprocessorParser = new PliPreprocessorParser(this.preprocessorLexer);
        this.preprocessorGenerator = new PliPreprocessorGenerator(tokens.NUMBER);
        this.preprocessorInterpreter = new PliPreprocessorInterpreter();
    }

    tokenize(printerText: string, uri: URI): LexerResult {
        const text = this.marginsProcessor.processMargins(printerText);
        const state = this.preprocessorParser.initializeState(text, uri);
        const { statements, errors } = this.preprocessorParser.start(state);
        if (errors.length > 0) {
            return {
                errors,
                all: [],
                fileTokens: {}
            };
        }
        const program = this.preprocessorGenerator.generateProgram(statements);
        const output = this.preprocessorInterpreter.run(program, this.preprocessorLexer.idTokenType);
        return {
            all: output.all,
            errors,
            fileTokens: state.perFileTokens
        };
    }
}
