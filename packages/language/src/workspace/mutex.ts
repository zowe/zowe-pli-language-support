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

import {
  CancellationToken,
  CancellationTokenSource,
} from "vscode-languageserver";
import { Deferred } from "../utils/promises";

export type MutexFunc = (cancellation: CancellationToken) => Promise<void>;

class MutexImpl {
  private current: Promise<void> = Promise.resolve();
  private source = new CancellationTokenSource();

  cancel() {
    try {
      this.source.cancel();
    } catch {
      // Sometimes cancellation randomly fails, this seems to be a `vscode-languageserver` issue.
    }
  }

  run(func: MutexFunc, cancel = true): Promise<void> {
    const deferred = new Deferred<void>();
    if (cancel) {
      this.cancel();
    }
    const newSource = new CancellationTokenSource();
    this.source = newSource;
    this.current = this.current.finally(async () => {
      if (newSource.token.isCancellationRequested) {
        return;
      }
      try {
        await func(newSource.token);
        deferred.resolve();
      } catch (err) {
        deferred.reject(err);
      }
    });
    return deferred.promise;
  }

  /**
   * Returns a promise that indicates when the mutex is done and ready for the next operation.
   *
   * Note that this will prevent cancellation of the current operation!
   */
  ready(): Promise<void> {
    return this.run(() => Promise.resolve(), false);
  }
}

export const Mutex = new MutexImpl();
