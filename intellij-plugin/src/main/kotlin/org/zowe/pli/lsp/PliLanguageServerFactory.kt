/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project
 */

package org.zowe.pli.lsp

import com.intellij.openapi.project.Project
import com.redhat.devtools.lsp4ij.LanguageServerFactory
import com.redhat.devtools.lsp4ij.client.LanguageClientImpl
import com.redhat.devtools.lsp4ij.server.StreamConnectionProvider
import org.eclipse.lsp4j.services.LanguageServer

// TODO: doc
class PliLanguageServerFactory : LanguageServerFactory {

  override fun createConnectionProvider(project: Project): StreamConnectionProvider {
    return PliLanguageServerDefinition(project)
  }

  override fun createLanguageClient(project: Project): LanguageClientImpl {
    return PliLanguageClientDefinition(project)
  }

  override fun getServerInterface(): Class<out LanguageServer> {
    return super.getServerInterface()
  }

}