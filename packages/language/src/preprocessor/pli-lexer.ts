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

import { ILexingResult, IToken, Lexer, TokenTypeDictionary } from "chevrotain";
import { MarginsProcessor, PliMarginsProcessor } from "./pli-margins-processor";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorInterpreter } from "./pli-preprocessor-interpreter";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PliPreprocessorGenerator } from "./pli-preprocessor-generator";
import { printProgram } from "./pli-preprocessor-instructions";
import { PliSmartTokenPickerOptimizer } from "./pli-token-picker-optimizer";
import * as tokens from '../parser/tokens';
import { URI } from "../utils/uri";

/** 
 * Lexer for PL/I language. It orchestrates a margins processor and a preprocessor. 
 * The latter creates the desired token stream without preprocessor statements
 */
export class Pl1Lexer {
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

    get definition(): TokenTypeDictionary {
        return this.preprocessorLexer.tokenTypeDictionary;
    }

    tokenize(printerText: string): ILexingResult {
        const text = this.marginsProcessor.processMargins(printerText);
        const state = this.preprocessorParser.initializeState(text, URI.file('file.pli')); //TODO update URI
        const { statements, errors } = this.preprocessorParser.start(state);
        if(errors.length > 0) {
            return {
                errors,
                tokens: [],
                groups: {}
            };
        }
        const program = this.preprocessorGenerator.generateProgram(statements);
        const tokens: IToken[] = [];
        const hidden: IToken[] = [];
        printProgram(program);
        const output = this.preprocessorInterpreter.run(program, this.preprocessorLexer.idTokenType);
        for (const token of output) {
            if(token.tokenType.GROUP === 'hidden' || token.tokenType.GROUP === Lexer.SKIPPED) {
                hidden.push(token);
            } else {
                tokens.push(token);
            }
        }
        return {
            tokens,
            errors,
            groups: {}
        };
    }
}
