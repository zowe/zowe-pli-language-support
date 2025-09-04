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

import { Severity } from "../language-server/types";
import { Token } from "../parser/tokens";

interface PreprocessorDiagnosticOptions {
  message: string;
  token?: Token | null;
  severity?: Severity;
  code?: string;
}

export class PreprocessorDiagnostic {
  private _token: Token | undefined;
  private _message: string;
  private _severity: Severity;
  private _code: string | undefined;

  get token(): Token | undefined {
    return this._token;
  }

  get message(): string {
    return this._message;
  }

  get severity(): Severity {
    return this._severity;
  }

  get code(): string | undefined {
    return this._code;
  }

  constructor(options: PreprocessorDiagnosticOptions) {
    this._message = options.message;
    this._token = options.token ?? undefined;
    this._severity = options.severity ?? Severity.E;
    this._code = options.code ?? undefined;
  }
}
