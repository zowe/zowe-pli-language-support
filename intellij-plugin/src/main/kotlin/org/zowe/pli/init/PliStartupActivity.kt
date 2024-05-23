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

import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.ProjectActivity
import kotlinx.coroutines.runBlocking

/** PL/I Language Support plug-in for IntelliJ IDEA main activity to initialize all the things needed */
@OptIn(InitializationOnly::class)
class PliPluginStartupActivity : ProjectActivity {
  override suspend fun execute(project: Project) {
    val pliPluginState = PliPluginState.getPluginState(project)
    runBlocking {
      pliPluginState.unpackVSIX()
    }
    pliPluginState.loadTextMateBundle()
//    cobolPluginState.loadLSP()
//    cobolPluginState.finishInitialization(project)
  }
}
