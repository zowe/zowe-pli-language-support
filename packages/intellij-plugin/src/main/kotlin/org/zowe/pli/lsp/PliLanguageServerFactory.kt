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

package org.zowe.pli.lsp

import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.redhat.devtools.lsp4ij.LanguageServerFactory
import com.redhat.devtools.lsp4ij.client.LanguageClientImpl
import com.redhat.devtools.lsp4ij.server.StreamConnectionProvider
import org.zowe.pli.state.PLI_PLUGIN_NOTIFICATION_ID
import org.zowe.pli.state.PliPluginState
import org.zowe.pli.state.InitializationOnly
import org.zowe.pli.state.LanguageSupportStateService

/** PL/I language server factory to provide all the necessary functionalities for PL/I language support in the IDE */
class PliLanguageServerFactory : LanguageServerFactory {

  override fun createConnectionProvider(project: Project): StreamConnectionProvider {
    val lsStateService = LanguageSupportStateService.instance
    val pluginState = lsStateService.getPluginState(project) { PliPluginState(project) }

    @OptIn(InitializationOnly::class)
    if (!pluginState.isLSPServerConnectionReady()) {
      pluginState.prepareVSIX {}
      pluginState.prepareLSPServerConnection {}
    }

    return pluginState.getReadyLSPServerConnection() as StreamConnectionProvider
  }

  override fun createLanguageClient(project: Project): LanguageClientImpl {
    val lsStateService = LanguageSupportStateService.instance
    val pluginState = lsStateService.getPluginState(project) { PliPluginState(project) }

    @OptIn(InitializationOnly::class)
    if (!pluginState.isLSPClientReady()) {
      pluginState.prepareLSPClient {}
      pluginState.finishInitialization(PLI_PLUGIN_NOTIFICATION_ID) {}
    }

    return pluginState.getReadyLSPClient() as LanguageClientImpl
  }

}
