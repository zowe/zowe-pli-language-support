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

package org.zowe.pli

import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager
import io.kotest.assertions.assertSoftly
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import org.zowe.pli.state.InitializationOnly
import org.zowe.pli.state.LanguageSupportState
import org.zowe.pli.state.LanguageSupportStateService

@OptIn(InitializationOnly::class)
class PliProjectManagerListenerTestSpec : FunSpec({

  context("PliProjectManagerListenerTestSpec.projectClosing") {
    lateinit var pliProjectManagerListener: PliProjectManagerListener
    lateinit var lsStateMock: LanguageSupportState

    val projectMock = mockk<Project>()
    var isUnloadLSPClientTriggered = false
    var isFinishDeinitializationTriggered = false

    beforeTest {
      isUnloadLSPClientTriggered = false
      isFinishDeinitializationTriggered = false

      lsStateMock = mockk<LanguageSupportState> {
        every { unloadLSPClient(any<() -> Unit>()) } answers {
          firstArg<() -> Unit>().invoke()
          isUnloadLSPClientTriggered = true
        }
        every { finishDeinitialization(any<() -> Unit>()) } answers {
          firstArg<() -> Unit>().invoke()
          isFinishDeinitializationTriggered = true
        }
      }

      pliProjectManagerListener = spyk(PliProjectManagerListener())
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("check that the plugin is fully unloaded when the last project is being closed") {
      mockkStatic(ProjectManager::getInstance)
      every { ProjectManager.getInstance() } returns mockk<ProjectManager> {
        every { openProjects } returns arrayOf(projectMock)
      }
      every { lsStateMock.isLSPClientReady() } returns true

      val lsStateServiceMock = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } returns lsStateMock
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateServiceMock

      pliProjectManagerListener.projectClosing(projectMock)

      assertSoftly { isUnloadLSPClientTriggered shouldBe true }
      assertSoftly { isFinishDeinitializationTriggered shouldBe true }
    }

    test("check that the plugin is not unloaded when the project that is being closed is not the last one") {
      mockkStatic(ProjectManager::getInstance)
      every { ProjectManager.getInstance() } returns mockk<ProjectManager> {
        every { openProjects } returns arrayOf(projectMock, mockk<Project>())
      }

      val lsStateServiceMock = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } answers {
          secondArg<() -> LanguageSupportState>().invoke()
        }
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateServiceMock

      pliProjectManagerListener.projectClosing(projectMock)

      assertSoftly { isUnloadLSPClientTriggered shouldBe false }
      assertSoftly { isFinishDeinitializationTriggered shouldBe false }
    }

    test("check that the plugin is not unloaded when the last project is being closed but the LSP client and server are not initialized yet") {
      mockkStatic(ProjectManager::getInstance)
      every { ProjectManager.getInstance() } returns mockk<ProjectManager> {
        every { openProjects } returns arrayOf(projectMock)
      }
      every { lsStateMock.isLSPClientReady() } returns false
      every { lsStateMock.isLSPServerConnectionReady() } returns false

      val lsStateServiceMock = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } returns lsStateMock
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateServiceMock

      pliProjectManagerListener.projectClosing(projectMock)

      assertSoftly { isUnloadLSPClientTriggered shouldBe false }
      assertSoftly { isFinishDeinitializationTriggered shouldBe false }
    }
  }

})
