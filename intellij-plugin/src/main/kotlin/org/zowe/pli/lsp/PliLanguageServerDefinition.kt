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
import com.redhat.devtools.lsp4ij.server.ProcessStreamConnectionProvider

// TODO: doc
class PliLanguageServerDefinition(project: Project) : ProcessStreamConnectionProvider() {

  init {
    val commands = listOf("node", "D:\\IBA\\IJMP\\zowe-pli-language-support\\intellij-plugin\\src\\main\\resources\\language\\main.cjs","--stdio")
    super.setCommands(commands)
  }

}