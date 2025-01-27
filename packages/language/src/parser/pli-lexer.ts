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
import { PliPreprocessor } from "./pli-preprocessor";

export class Pl1Lexer implements Lexer {
    private readonly marginsProcessor: MarginsProcessor;
    private readonly services: Pl1Services;

    constructor(services: Pl1Services) {
        this.services = services;
        this.marginsProcessor = services.parser.MarginsProcessor;
    }
    return lines;
  }

    get definition(): TokenTypeDictionary {
        return {};
    }

    tokenize(printerText: string): LexerResult {
        const text = this.marginsProcessor.processMargins(printerText);
        const preprocessor = new PliPreprocessor(this.services, text);
        const { hidden, tokens } = preprocessor.start();
        return {
            tokens,
            errors: [],
            hidden,
            report: undefined!
        };
    }
}
