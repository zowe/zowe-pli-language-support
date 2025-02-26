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

import { IToken, Lexer, TokenTypeDictionary } from "chevrotain";
import { Lexer as LangiumLexer, LexerResult } from "langium";
import { Pl1Services } from "../pli-module";
import { MarginsProcessor } from "./pli-margins-processor";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorInterpreter } from "./pli-preprocessor-interpreter";

/** 
 * Lexer for PL/I language. It orchestrates a margins processor and a preprocessor. 
 * The latter creates the desired token stream without preprocessor statements
 */
export class Pl1Lexer implements LangiumLexer {
    private readonly marginsProcessor: MarginsProcessor;
    private readonly preprocessorLexer: PliPreprocessorLexer;
    private readonly preprocessorInterpreter: PliPreprocessorInterpreter;

    constructor(services: Pl1Services) {
        this.marginsProcessor = services.parser.MarginsProcessor;
        this.preprocessorLexer = services.parser.PreprocessorLexer;
        this.preprocessorInterpreter = services.parser.PreprocessorInterpreter;
    }

    get definition(): TokenTypeDictionary {
        return this.preprocessorLexer.tokenTypeDictionary;
    }

    tokenize(printerText: string): LexerResult {
        const text = this.marginsProcessor.processMargins(printerText);
        const { program: program, errors } = this.preprocessorLexer.tokenize(text);
        const tokens: IToken[] = [];
        const hidden: IToken[] = [];
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
            hidden,
            report: undefined!
        };
    }
}
