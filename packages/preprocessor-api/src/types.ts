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
export enum SemanticsKind {
  Identifier,
  Keyword,
  String,
  Comment,
  Number,
}

export interface WithRange {
  startOffset: number;
  endOffset: number;
}

export interface Token extends WithRange {
  image: string;
  semanticsKind: SemanticsKind;
}

export interface ParseError extends WithRange {
  message: string;
}

export interface PreprocessorResult {
  diagnostics: ParseError[];
  tokens: Token[];
}

export interface Preprocessor {
  execute(input: string): Promise<PreprocessorResult>;
}
