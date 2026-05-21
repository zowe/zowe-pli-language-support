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

import { URI } from "../utils/uri";
import * as tokens from "./tokens";
import { getDefaultCompilerOptions } from "../preprocessor/compiler-options/options";
import { diagnostic, Diagnostic, fullCode } from "../language-server/types";
import { PLICodes } from "../validation/pli-codes";
import { TokenizeFunc, TokenizerContext } from "./tokenizer/shared";
import {
  tokenizeIncludeAlt,
  updatePliTokenizer,
} from "./tokenizer/pli-tokenizer";

export interface TokenizationResult {
  tokens: tokens.Token[];
  comments: tokens.Token[];
  diagnostics: Diagnostic[];
}

export function tokenize(
  input: string,
  uri: URI | undefined,
  caseUpper: boolean = true,
): TokenizationResult {
  const context = new TokenizerContext(input, uri, caseUpper);
  let previous: tokens.Token | undefined = undefined;

  while (context.index < context.length) {
    const char = input[context.index];
    context.char = char;
    context.store();

    // VERY special case for include alt
    const includeAltToken = tokenizeIncludeAlt(context);
    if (includeAltToken) {
      context.tokens.push(includeAltToken);
      previous = includeAltToken;
      continue;
    }

    const fn: TokenizeFunc | undefined =
      context.funcs[input.charCodeAt(context.index)];
    if (fn) {
      const index = context.index;
      const token = fn(context);
      if (token !== undefined) {
        if (previous && previous.endOffset + 1 === token.startOffset) {
          previous.immediateFollow = true;
        }
        context.tokens.push(token);
        previous = token;
      } else if (context.index === index) {
        // No progress made, avoid infinite loop
        context.index++;
      }
    } else {
      if (uri) {
        const issue = diagnostic(
          PLICodes.Error.IBM3550I.severity,
          PLICodes.Error.IBM3550I.message(char),
          {
            start: context.index,
            end: context.index + 1,
          },
          uri.toString(),
        );
        issue.code = fullCode(PLICodes.Error.IBM3550I);
        context.diagnostics.push(issue);
      }
      context.index++;
    }
  }

  return {
    tokens: context.tokens,
    comments: context.comments,
    diagnostics: context.diagnostics,
  };
}

updatePliTokenizer(getDefaultCompilerOptions());
