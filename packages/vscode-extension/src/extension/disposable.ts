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

import * as vscode from "vscode";

export function collectDisposables(
  ...disposables: vscode.Disposable[]
): vscode.Disposable {
  return new vscode.Disposable(() => {
    for (const disposable of disposables) {
      disposable.dispose();
    }
  });
}
