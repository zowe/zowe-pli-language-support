/*
 * Copyright (c) 2024 IBA Group.
 *
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   IBA Group
 *   Zowe Community
 */

package org.zowe.pli.state

/** Initialization states enum class to represent available plug-in's states */
enum class InitStates {
  DOWN,
  LSP_CLIENT_UNLOADED,
  LSP_CLIENT_UNLOAD_TRIGGERED,
  VSIX_PREPARE_TRIGGERED,
  VSIX_PREPARED,
  LSP_SERVER_CONNECTION_PREPARE_TRIGGERED,
  LSP_SERVER_CONNECTION_PREPARED,
  LSP_CLIENT_PREPARE_TRIGGERED,
  LSP_CLIENT_PREPARED,
  UP
}
