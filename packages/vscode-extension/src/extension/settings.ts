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

import * as vscode from "vscode";
import { SkippedCodeDecorator } from "./decorators";

export class Settings {
  private static instance: Settings;
  private disposables: vscode.Disposable[] = [];

  private constructor() {
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("pli")) {
          this.updateSettings();
        }
      }),
    );
  }

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  public dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }

  protected getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("pli");
  }

  private updateSettings(): void {
    SkippedCodeDecorator.updateType(this);
  }

  public get skippedCodeEnabled(): boolean {
    return this.getConfiguration().get("skippedCode.enabled") ?? true;
  }

  public get skippedCodeOpacity(): number {
    return this.getConfiguration().get("skippedCode.opacity") ?? 0.55;
  }
}
