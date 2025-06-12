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

import type { LexingError } from "./pli-lexer";
import { Range } from "../language-server/types";
import { URI } from "../utils/uri";
import { Token } from "../parser/tokens";

export class PreprocessorError implements LexingError {
  private _uri: URI;
  private _range: Range;
  private _message: string;

  get uri(): URI {
    return this._uri;
  }

  get range(): Range {
    return this._range;
  }

  get message(): string {
    return this._message;
  }

  constructor(message: string, range: Range | Token, uri: URI) {
    this._message = message;
    if ("start" in range) {
      this._range = range;
    } else {
      this._range = {
        start: range.startOffset,
        end: range.endOffset,
      };
    }
    this._uri = uri;
  }
}
