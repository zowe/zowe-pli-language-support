/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project
 */

package org.zowe.pli.init

/** Initialization states enum class to represent available plug-in's states */
enum class InitStates {
  DOWN,
  LSP_UNLOADED,
  LSP_UNLOAD_TRIGGERED,
  TEXTMATE_BUNDLE_UNLOADED,
  TEXTMATE_BUNDLE_UNLOAD_TRIGGERED,
  VSIX_UNPACK_TRIGGERED,
  VSIX_UNPACKED,
  TEXTMATE_BUNDLE_LOAD_TRIGGERED,
  TEXTMATE_BUNDLE_LOADED,
  LSP_LOAD_TRIGGERED,
  LSP_LOADED,
  UP
}