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

import { BaseLanguageClient, HandlerResult } from "vscode-languageclient";
import { NotificationType, RequestType } from "pli-language";

export function onRequest<P, R>(
  client: BaseLanguageClient,
  request: RequestType<P, R>,
  handler: (params: P) => HandlerResult<R, unknown>,
) {
  client.onRequest(request.method, handler);
}

export function sendRequest<P, R>(
  client: BaseLanguageClient,
  request: RequestType<P, R>,
  params: P,
): Promise<R> {
  return client.sendRequest(request.method, params);
}

export function sendNotification(
  client: BaseLanguageClient,
  notification: NotificationType<void>,
): void;
export function sendNotification<P>(
  client: BaseLanguageClient,
  notification: NotificationType<P>,
  params: P,
): void;
export function sendNotification<P>(
  client: BaseLanguageClient,
  notification: NotificationType<P>,
  params?: P,
): void {
  client.sendNotification(notification.method, params);
}

export function onNotification<P>(
  client: BaseLanguageClient,
  notification: NotificationType<P>,
  handler: (params: P) => void,
): void {
  client.onNotification(notification.method, handler);
}
