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
import * as antlr from "antlr4ng";
import { Diagnostic, Severity } from "preprocessor-api";
import { CICSLexer } from "../generated/CICSLexer";

export enum HostLanguageType {
  PLI,
  COBOL,
}

export interface HostLanguage {
  visitToken(token: antlr.Token, diagnostics: Diagnostic[]): void;
}

export const HostLanguageFactories: Record<
  HostLanguageType,
  () => HostLanguage
> = {
  [HostLanguageType.PLI]: () => new PLIHostLanguage(),
  [HostLanguageType.COBOL]: () => new COBOLHostLanguage(),
};

class PLIHostLanguage implements HostLanguage {
  visitToken(token: antlr.Token, diagnostics: Diagnostic[]): void {
    if (token.type === CICSLexer.COBOL_COMMENTLINE) {
      diagnostics.push({
        code: "invalid.cobol.comment",
        message: "COBOL comment in PL/I context detected.",
        startOffset: token.start,
        endOffset: token.stop + 1,
        severity: Severity.Error,
      });
    }
  }
}

class COBOLHostLanguage implements HostLanguage {
  visitToken(token: antlr.Token, diagnostics: Diagnostic[]): void {
    if (
      token.type === CICSLexer.PLI_COMMENTLINE ||
      token.type === CICSLexer.PLI_COMMENTBLOCK
    ) {
      diagnostics.push({
        code: "invalid.pli.comment",
        message: "PL/I comment in COBOL context detected.",
        startOffset: token.start,
        endOffset: token.stop + 1,
        severity: Severity.Error,
      });
    }
  }
}
