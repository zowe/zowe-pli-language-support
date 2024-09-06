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

import com.intellij.notification.Notification
import com.intellij.notification.NotificationType
import com.intellij.notification.Notifications
import com.intellij.openapi.Disposable
import com.intellij.openapi.util.Disposer

/**
 * Represents language support plug-in's state. Carries all the necessary instances
 * to avoid double-initialization plus allows to initialize/de-initialize the plug-in's features.
 * The main purpose is to provide a generic interface to handle the current state of the plug-in and manage
 * it according to the previous and expected state
 */
abstract class LanguageSupportState : Disposable {

  /** The current state of the plug-in for a specific project */
  private var currState: InitStates = InitStates.DOWN

  /** Check if the LSP server connection instance is ready */
  abstract fun isLSPServerConnectionReady(): Boolean

  /** Get the LSP server connection instance */
  abstract fun getReadyLSPServerConnection(): Any

  /** Check if the LSP client instance is ready */
  abstract fun isLSPClientReady(): Boolean

  /** Get the LSP client instance */
  abstract fun getReadyLSPClient(): Any

  /**
   * Prepare VSIX package before all the other preparations
   * @param prepFun the function to prepare the VSIX package
   */
  @InitializationOnly
  open fun prepareVSIX(prepFun: () -> Unit) {
    if (currState != InitStates.DOWN)
      throw IllegalStateException("Invalid plug-in state. Expected: ${InitStates.DOWN}, current: $currState")
    currState = InitStates.VSIX_PREPARE_TRIGGERED
    prepFun()
    currState = InitStates.VSIX_PREPARED
  }

  /**
   * Prepare LSP server connection instance. Expects that the VSIX is prepared
   * @param prepFun the function to prepare LSP server connection instance
   */
  @InitializationOnly
  open fun prepareLSPServerConnection(prepFun: () -> Unit) {
    if (currState < InitStates.VSIX_PREPARED)
      throw IllegalStateException("Invalid plug-in state. Expected: at least ${InitStates.VSIX_PREPARED}, current: $currState")
    currState = InitStates.LSP_SERVER_CONNECTION_PREPARE_TRIGGERED
    prepFun()
    currState = InitStates.LSP_SERVER_CONNECTION_PREPARED
  }

  /**
   * Prepare LSP client instance. Expects that the VSIX is prepared
   * @param prepFun the function to prepare LSP client instance
   */
  @InitializationOnly
  open fun prepareLSPClient(prepFun: () -> Unit) {
    if (currState < InitStates.VSIX_PREPARED)
      throw IllegalStateException("Invalid plug-in state. Expected: at least ${InitStates.VSIX_PREPARED}, current: $currState")
    currState = InitStates.LSP_CLIENT_PREPARE_TRIGGERED
    prepFun()
    currState = InitStates.LSP_CLIENT_PREPARED
  }

  /**
   * Initialization final step, puts the plug-in in [InitStates.UP] state.
   * Will throw an error when both LSP client and LSP server connection instances are not prepared,
   * shows notification when an LSP client is prepared and LSP server connection is not.
   * @param notificationId the notification group ID to show the notification
   * @param finishFun the function to finish initialization
   */
  @InitializationOnly
  open fun finishInitialization(notificationId: String, finishFun: () -> Unit) {
    if (currState != InitStates.LSP_CLIENT_PREPARED) {
      if (currState != InitStates.LSP_SERVER_CONNECTION_PREPARED)
        throw IllegalStateException("Invalid plug-in state. Expected: at least ${InitStates.LSP_SERVER_CONNECTION_PREPARED}, current: $currState")
      else
        Notification(
          notificationId,
          "LSP client is not initialized",
          "",
          NotificationType.WARNING
        ).let {
          Notifications.Bus.notify(it)
        }
    }
    finishFun()
    currState = InitStates.UP
  }

  /**
   * Unload LSP client. It is the starting point of the plug-in's shutdown
   * @param unloadFun the function to perform unloading
   */
  @InitializationOnly
  open fun unloadLSPClient(unloadFun: () -> Unit) {
    if (currState != InitStates.UP)
      throw IllegalStateException("Invalid plug-in state. Expected: ${InitStates.UP}, current: $currState")
    currState = InitStates.LSP_CLIENT_UNLOAD_TRIGGERED
    unloadFun()
    currState = InitStates.LSP_CLIENT_UNLOADED
  }

  /**
   * Deinitialization final step. Disposing purposes
   * @param unloadFinishFun the function to perform final unloading processes
   */
  @InitializationOnly
  open fun finishDeinitialization(unloadFinishFun: () -> Unit) {
    if (currState > InitStates.LSP_CLIENT_UNLOADED)
      throw IllegalStateException("Invalid plug-in state. Expected: at most ${InitStates.LSP_CLIENT_UNLOADED}, current: $currState")
    unloadFinishFun()
    this.dispose()
    currState = InitStates.DOWN
  }

  @InitializationOnly
  override fun dispose() {
    Disposer.dispose(this)
  }
}