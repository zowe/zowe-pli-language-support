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

import { TokenType } from "chevrotain";
import { PliPreprocessorInterpreterState } from "./pli-preprocessor-interpreter-state";
import { PliPreprocessorProgram } from "./pli-preprocessor-program-builder";

export class PliPreprocessorInterpreter {
  run(program: PliPreprocessorProgram, idTokenType: TokenType) {
    const state = new PliPreprocessorInterpreterState(
      program.instructions,
      idTokenType,
    );
    while (!state.halt) {
      state.step();
    }
    return state.getOutput();
  }
}
