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

import com.intellij.openapi.project.Project
import com.redhat.devtools.lsp4ij.client.LanguageClientImpl
import com.redhat.devtools.lsp4ij.server.StreamConnectionProvider
import io.kotest.assertions.assertSoftly
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import org.zowe.pli.setPrivateFieldValue
import org.zowe.pli.state.*

@OptIn(InitializationOnly::class)
class PliLanguageServerFactoryTestSpec : FunSpec({

  context("PliLanguageServerFactoryTestSpec.createConnectionProvider") {
    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("create a connection provider, initializing all the elements") {
      var isPrepareVSIXTriggered = false
      var isPrepareLSPServerConnectionTriggered = false

      val projectMock = mockk<Project>()
      val createdConnectionProvider = mockk<StreamConnectionProvider>()

      val lsStateMock = spyk(PliPluginState(projectMock))
      every { lsStateMock.prepareVSIX(any<() -> Unit>()) } answers {
        isPrepareVSIXTriggered = true
        firstArg<() -> Unit>().invoke()
      }
      every { lsStateMock.prepareLSPServerConnection(any<() -> Unit>()) } answers {
        isPrepareLSPServerConnectionTriggered = true
        setPrivateFieldValue(
          lsStateMock,
          PliPluginState::class.java,
          "lspServerConnection",
          createdConnectionProvider
        )
        firstArg<() -> Unit>().invoke()
      }
      val lsStateService = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } returns lsStateMock
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateService

      val pliLanguageServerFactory = spyk(PliLanguageServerFactory())

      val result = pliLanguageServerFactory.createConnectionProvider(projectMock)

      assertSoftly { isPrepareVSIXTriggered shouldBe true }
      assertSoftly { isPrepareLSPServerConnectionTriggered shouldBe true }
      assertSoftly { result shouldBe createdConnectionProvider }
    }

    test("get a connection provider, that was already initialized") {
      lateinit var defaultLSState: LanguageSupportState
      var isPrepareVSIXTriggered = false
      var isPrepareLSPServerConnectionTriggered = false

      val projectMock = mockk<Project>()
      val createdConnectionProvider = mockk<StreamConnectionProvider>()

      val lsStateMock = spyk(PliPluginState(projectMock))
      every { lsStateMock.prepareVSIX(any<() -> Unit>()) } answers {
        isPrepareVSIXTriggered = true
      }
      every { lsStateMock.prepareLSPServerConnection(any<() -> Unit>()) } answers {
        isPrepareLSPServerConnectionTriggered = true
      }
      setPrivateFieldValue(
        lsStateMock,
        PliPluginState::class.java,
        "lspServerConnection",
        createdConnectionProvider
      )
      val lsStateService = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } answers {
          defaultLSState = secondArg<() -> LanguageSupportState>().invoke()
          lsStateMock
        }
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateService

      val pliLanguageServerFactory = spyk(PliLanguageServerFactory())

      val result = pliLanguageServerFactory.createConnectionProvider(projectMock)

      assertSoftly { defaultLSState is PliPluginState }
      assertSoftly { isPrepareVSIXTriggered shouldBe false }
      assertSoftly { isPrepareLSPServerConnectionTriggered shouldBe false }
      assertSoftly { result shouldBe createdConnectionProvider }
    }
  }

  context("PliLanguageServerFactoryTestSpec.createLanguageClient") {
    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("create a language client, initializing all the elements") {
      var isPrepareLSPClientTriggered = false
      var isFinishInitializationTriggered = false

      val projectMock = mockk<Project>()
      val createdLanguageClient = mockk<LanguageClientImpl>()

      val lsStateMock = spyk(PliPluginState(projectMock))
      every { lsStateMock.prepareLSPClient(any<() -> Unit>()) } answers {
        isPrepareLSPClientTriggered = true
        firstArg<() -> Unit>().invoke()
      }
      every { lsStateMock.finishInitialization(any<String>(), any<() -> Unit>()) } answers {
        isFinishInitializationTriggered = true
        setPrivateFieldValue(
          lsStateMock,
          PliPluginState::class.java,
          "lspClient",
          createdLanguageClient
        )
        secondArg<() -> Unit>().invoke()
      }
      val lsStateService = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } returns lsStateMock
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateService

      val pliLanguageServerFactory = spyk(PliLanguageServerFactory())

      val result = pliLanguageServerFactory.createLanguageClient(projectMock)

      assertSoftly { isPrepareLSPClientTriggered shouldBe true }
      assertSoftly { isFinishInitializationTriggered shouldBe true }
      assertSoftly { result shouldBe createdLanguageClient }
    }

    test("get a language client, that was already initialized") {
      lateinit var defaultLSState: LanguageSupportState
      var isPrepareLSPClientTriggered = false
      var isFinishInitializationTriggered = false

      val projectMock = mockk<Project>()
      val createdLanguageClient = mockk<LanguageClientImpl>()

      val lsStateMock = spyk(PliPluginState(projectMock))
      every { lsStateMock.prepareLSPClient(any<() -> Unit>()) } answers {
        isPrepareLSPClientTriggered = true
      }
      every { lsStateMock.finishInitialization(any<String>(), any<() -> Unit>()) } answers {
        isFinishInitializationTriggered = true
      }
      setPrivateFieldValue(
        lsStateMock,
        PliPluginState::class.java,
        "lspClient",
        createdLanguageClient
      )
      val lsStateService = mockk<LanguageSupportStateService> {
        every { getPluginState(projectMock, any<() -> LanguageSupportState>()) } answers {
          defaultLSState = secondArg<() -> LanguageSupportState>().invoke()
          lsStateMock
        }
      }
      mockkObject(LanguageSupportStateService)
      every { LanguageSupportStateService.instance } returns lsStateService

      val pliLanguageServerFactory = spyk(PliLanguageServerFactory())

      val result = pliLanguageServerFactory.createLanguageClient(projectMock)

      assertSoftly { defaultLSState is PliPluginState }
      assertSoftly { isPrepareLSPClientTriggered shouldBe false }
      assertSoftly { isFinishInitializationTriggered shouldBe false }
      assertSoftly { result shouldBe createdLanguageClient }
    }
  }

})
