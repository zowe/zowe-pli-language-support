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

import { TokenTypeDictionary } from "chevrotain";
import { Lexer, LexerResult } from "langium";
import { Pl1Services } from "../pli-module";
import { MarginsProcessor } from "./pli-margins-processor";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";

export class Pl1Lexer implements Lexer {
    private readonly marginsProcessor: MarginsProcessor;
    private readonly preprocessorLexer: PliPreprocessorLexer;

    constructor(services: Pl1Services) {
        this.marginsProcessor = services.parser.MarginsProcessor;
        this.preprocessorLexer = services.parser.PreprocessorLexer;
    }

    get definition(): TokenTypeDictionary {
        return this.preprocessorLexer.tokenTypeDictionary;
    }

    tokenize(printerText: string): LexerResult {
        const text = this.marginsProcessor.processMargins(printerText);
        const { tokens } = this.preprocessorLexer.tokenize(text);
        return {
            tokens,
            errors: [],
            hidden: [],
            report: undefined!
        };
    }
}
