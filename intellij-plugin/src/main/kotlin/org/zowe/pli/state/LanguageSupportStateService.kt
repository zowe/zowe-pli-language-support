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

import com.intellij.openapi.components.Service
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project

/** Service to provide language support states storage */
@Service
class LanguageSupportStateService {

  companion object {
    @JvmStatic
    val instance
      get() = service<LanguageSupportStateService>()
  }

  private val projectToPluginState = mutableMapOf<Project, LanguageSupportState>()

  /**
   * Get initialized plug-in state by the project. If there is no plugin state initialized for the project,
   * the new state is initialized
   * @param project the project to get or initialize the plug-in's state
   * @param defaultStateProvider the function that initializes the [LanguageSupportState] if it is not yet exists
   * @return initialized plug-in's state
   */
  fun getPluginState(project: Project, defaultStateProvider: () -> LanguageSupportState): LanguageSupportState {
    return projectToPluginState.computeIfAbsent(project) {
      defaultStateProvider()
    }
  }

}