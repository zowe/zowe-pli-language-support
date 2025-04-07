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

export class PreprocessorError extends Error implements ILexingError {
  private readonly token: IToken;
  public readonly uri: string;
  constructor(message: string, token: IToken, uri: string) {
    super(message);
    this.token = token;
    this.uri = uri;
  }
  readonly type = "error";
  get offset(): number {
    return this.token.startOffset;
  }
  get line(): number | undefined {
    return this.token.startLine;
  }
  get column(): number | undefined {
    return this.token.startColumn;
  }
  get length(): number {
    return this.token.image.length;
  }
}
