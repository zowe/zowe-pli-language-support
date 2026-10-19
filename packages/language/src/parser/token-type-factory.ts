/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import {
  createToken as originalCreateToken,
  ITokenConfig,
  TokenType,
} from "chevrotain";

const tokenTypesByIdx: Map<number, TokenType> = new Map();

export function createToken(config: ITokenConfig): TokenType {
  const tokenType = originalCreateToken(config);
  tokenTypesByIdx.set(tokenType.tokenTypeIdx!, tokenType);
  return tokenType;
}

export function tokenIdxToClass(tokenTypeIdx: number): TokenType | undefined {
  return tokenTypesByIdx.get(tokenTypeIdx);
}
