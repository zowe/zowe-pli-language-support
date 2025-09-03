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

export type MutexFunc<T = void> = (
  cancellation: CancellationToken,
) => Promise<T>;

class MutexImpl {
  private current: Promise<unknown> = Promise.resolve();
  private source = new CancellationTokenSource();

  cancel() {
    try {
      this.source.cancel();
    } catch {
      // Sometimes cancellation randomly fails, this seems to be a `vscode-languageserver` issue.
    }
  }

  run<T = void>(func: MutexFunc<T>, cancel = true): Promise<T> {
    const deferred = new Deferred<T>();
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
        const result = await func(newSource.token);
        deferred.resolve(result);
      } catch (err) {
        deferred.reject(err);
      }
    });
    return deferred.promise;
  }

  /**
   * Runs the given function when the mutex is available. The mutex will not be cancelled when this function is running.
   *
   * Note that this will prevent cancellation of the current operation!
   */
  read<T = void>(func: MutexFunc<T>): Promise<T> {
    return this.run(func, false);
  }

  /**
   * Returns a promise that indicates when the mutex is done and ready for the next operation.
   *
   * Note that this will prevent cancellation of the current operation!
   */
  ready(): Promise<void> {
    return this.read(() => Promise.resolve());
  }
}

export const Mutex = new MutexImpl();
