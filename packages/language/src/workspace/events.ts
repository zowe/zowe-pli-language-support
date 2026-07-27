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

import { NotificationType, RequestType } from "vscode-languageserver";

export class EventEmitter {
  private readonly notificationListeners: Map<
    string,
    Array<(...args: any[]) => void>
  > = new Map();
  notify<T extends NotificationType<any>>(
    type: T,
    params: NonNullable<T["_"]>[0],
  ): void {
    const listeners = this.notificationListeners.get(type.method);
    if (listeners) {
      for (const listener of listeners) {
        listener(params);
      }
    }
  }
  onNotification<T extends NotificationType<any>>(
    type: T,
    listener: (params: NonNullable<T["_"]>[0]) => void,
  ): () => void {
    this.notificationListeners.set(type.method, [
      ...(this.notificationListeners.get(type.method) ?? []),
      listener,
    ]);
    return () => {
      const listeners = this.notificationListeners.get(type.method);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private readonly requestListeners: Map<
    string,
    ((params: any, requestId: number) => Promise<any>)[]
  > = new Map();
  private requestIdCounter: number = 0;
  async request<T extends RequestType<any, any, any>>(
    type: T,
    params: NonNullable<T["_"]>[0],
  ): Promise<NonNullable<T["_"]>[1] | undefined> {
    const id = this.requestIdCounter++;
    const listeners = this.requestListeners.get(type.method);
    if (listeners) {
      const promises = listeners.map((listener) => listener(params, id));
      const results = await Promise.all(promises);
      return results[0];
    }
    return Promise.reject(
      new Error(
        `No listener registered for request type ${type.method} with id ${id}`,
      ),
    );
  }
  onRequest<T extends RequestType<any, any, any>>(
    type: T,
    listener: (
      params: NonNullable<T["_"]>[0],
      requestId: number,
    ) => Promise<NonNullable<T["_"]>[1] | undefined>,
  ) {
    this.requestListeners.set(type.method, [
      ...(this.requestListeners.get(type.method) ?? []),
      listener,
    ]);
    return () => {
      const listeners = this.requestListeners.get(type.method);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      }
    };
  }
}
