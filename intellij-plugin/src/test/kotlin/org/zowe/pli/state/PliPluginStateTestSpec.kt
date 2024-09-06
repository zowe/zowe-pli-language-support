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
import com.intellij.notification.Notifications
import com.intellij.openapi.project.Project
import com.redhat.devtools.lsp4ij.server.JavaProcessCommandBuilder
import io.kotest.assertions.assertSoftly
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.mockk.*
import org.jetbrains.plugins.textmate.TextMateService
import org.jetbrains.plugins.textmate.configuration.TextMatePersistentBundle
import org.jetbrains.plugins.textmate.configuration.TextMateUserBundlesSettings
import org.junit.jupiter.api.assertThrows
import org.zowe.pli.getPrivateFieldValue
import org.zowe.pli.setPrivateFieldValue
import java.nio.file.Path
import kotlin.io.path.pathString
import kotlin.reflect.KFunction

@OptIn(InitializationOnly::class)
class PliPluginStateTestSpec : FunSpec({

  context("PliPluginStateTestSpec: lateinit vars") {
    val pliState = spyk(PliPluginState(mockk<Project>()))

    test("make a try to get not yet initialized lateinit var") {
      val exception = assertThrows<IllegalStateException> { pliState.getReadyLSPServerConnection() }
      assertSoftly { exception.message shouldContain "LSP server connection is not ready" }
    }

    test("make a try to get not yet initialized lateinit var") {
      val exception = assertThrows<IllegalStateException> { pliState.getReadyLSPClient() }
      assertSoftly { exception.message shouldContain "LSP client is not ready" }
    }
  }

  context("PliPluginStateTestSpec.prepareVSIX") {
    lateinit var projectMock: Project
    lateinit var pliState: PliPluginState

    var isFinalPrepFunctionCalled = false
    var isUnpackVSIXCalled = false

    beforeTest {
      projectMock = mockk<Project>()
      pliState = spyk(PliPluginState(projectMock), recordPrivateCalls = true)

      isFinalPrepFunctionCalled = false
      isUnpackVSIXCalled = false

      every {
        pliState["unpackVSIX"]()
      } answers {
        isUnpackVSIXCalled = true
        Unit
      }
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("the state should change itself respectively after the VSIX unpacking process is finished") {
      every { pliState["computeVSIXPlacingPaths"]() } returns false

      pliState.prepareVSIX { isFinalPrepFunctionCalled = true }

      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { isUnpackVSIXCalled shouldBe true }
      assertSoftly { currState shouldBe InitStates.VSIX_PREPARED }
    }

    test("the state should change itself respectively without additional steps") {
      every { pliState["computeVSIXPlacingPaths"]() } returns true

      pliState.prepareVSIX { isFinalPrepFunctionCalled = true }

      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { isUnpackVSIXCalled shouldBe false }
      assertSoftly { currState shouldBe InitStates.VSIX_PREPARED}
    }

    test("the state should throw error cause the state before VSIX unpack is not correct") {
      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.VSIX_PREPARED
      )
      val exception = assertThrows<IllegalStateException> { pliState.prepareVSIX { isFinalPrepFunctionCalled = true } }
      assertSoftly { exception.message shouldContain "Invalid plug-in state" }
      assertSoftly { isUnpackVSIXCalled shouldBe false }
    }
  }

  context("PliPluginStateTestSpec.prepareLSPServerConnection") {
    lateinit var projectMock: Project
    lateinit var pliState: PliPluginState

    var isFinalPrepFunctionCalled = false

    beforeTest {
      projectMock = mockk<Project>()
      pliState = spyk(PliPluginState(projectMock), recordPrivateCalls = true)

      isFinalPrepFunctionCalled = false
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("the state should change itself respectively after the LSP server connection instance preparation is finished") {
      val commandsListMock = mockk<MutableList<String>>()
      every { commandsListMock.add(any<String>()) } returns true

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.VSIX_PREPARED
      )

      val lspServerPathMock = mockk<Path>()
      every { lspServerPathMock.pathString } returns ""

      setPrivateFieldValue(
        pliState,
        PliPluginState::class.java,
        "lspServerPath",
        lspServerPathMock
      )

      pliState.prepareLSPServerConnection { isFinalPrepFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { currState shouldBe InitStates.LSP_SERVER_CONNECTION_PREPARED }
    }

    test("the state should throw error cause the state before LSP server connection preparation is not correct") {
      val exception = assertThrows<IllegalStateException> { pliState.prepareLSPServerConnection { isFinalPrepFunctionCalled = true } }
      assertSoftly { exception.message shouldContain "Invalid plug-in state" }
    }
  }

  context("PliPluginStateTestSpec.prepareLSPClient") {
    lateinit var projectMock: Project
    lateinit var pliState: PliPluginState

    var isFinalPrepFunctionCalled = false

    beforeTest {
      projectMock = mockk<Project>()
      pliState = spyk(PliPluginState(projectMock), recordPrivateCalls = true)

      isFinalPrepFunctionCalled = false
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("the state should change itself respectively after the LSP client instance preparation is finished and a new bundle added") {
      var isSetBundlesConfigTriggered = false
      var isAddNewBundleTriggered = false
      var isReloadEnabledBundlesTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.LSP_SERVER_CONNECTION_PREPARED
      )

      setPrivateFieldValue(
        pliState,
        PliPluginState::class.java,
        "vsixUnpackedPath",
        mockk<Path>()
      )

      val textMateBundle = mockk<TextMatePersistentBundle>()
      every { textMateBundle.name } returns "testBundle"

      mockkObject(TextMateUserBundlesSettings)
      every { TextMateUserBundlesSettings.instance } returns mockk<TextMateUserBundlesSettings> {
        every { bundles } returns mapOf(textMateBundle.name to textMateBundle)
        every { setBundlesConfig(any<Map<String, TextMatePersistentBundle>>()) } answers {
          isSetBundlesConfigTriggered = true
        }
        every { addBundle(any<String>(), any<String>()) } answers {
          isAddNewBundleTriggered = true
        }
      }

      mockkStatic(TextMateService::getInstance)
      every { TextMateService.getInstance() } returns mockk<TextMateService> {
        every { reloadEnabledBundles() } answers {
          isReloadEnabledBundlesTriggered = true
        }
      }

      pliState.prepareLSPClient { isFinalPrepFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isSetBundlesConfigTriggered shouldBe true }
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { isReloadEnabledBundlesTriggered shouldBe true }
      assertSoftly { currState shouldBe InitStates.LSP_CLIENT_PREPARED }
      assertSoftly { isAddNewBundleTriggered shouldBe true }
    }

    test("the state should change itself respectively after the LSP client instance preparation is finished and a new bundle is not added as TextMate settings instance is not yet initialized") {
      var isReloadEnabledBundlesTriggered = false
      var isNotificationTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.LSP_SERVER_CONNECTION_PREPARED
      )

      val notifyRef: (Notification) -> Unit = Notifications.Bus::notify
      mockkStatic(notifyRef as KFunction<*>)
      every { Notifications.Bus.notify(any<Notification>()) } answers {
        isNotificationTriggered = true
      }

      mockkObject(TextMateUserBundlesSettings)
      every { TextMateUserBundlesSettings.instance } returns null

      mockkStatic(TextMateService::getInstance)
      every { TextMateService.getInstance() } returns mockk<TextMateService> {
        every { reloadEnabledBundles() } answers {
          isReloadEnabledBundlesTriggered = true
        }
      }

      pliState.prepareLSPClient { isFinalPrepFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { isNotificationTriggered shouldBe true }
      assertSoftly { isReloadEnabledBundlesTriggered shouldBe false }
      assertSoftly { currState shouldBe InitStates.LSP_CLIENT_PREPARED }
    }

    test("the state should change itself respectively after the LSP client instance preparation is finished and a new bundle is not added as there is already a bundle with the version greater than the one to install") {
      var isSetBundlesConfigTriggered = false
      var isAddNewBundleTriggered = false
      var isReloadEnabledBundlesTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.LSP_SERVER_CONNECTION_PREPARED
      )

      val textMateBundle = mockk<TextMatePersistentBundle>()
      every { textMateBundle.name } returns "$TEXTMATE_BUNDLE_NAME-999"

      mockkObject(TextMateUserBundlesSettings)
      every { TextMateUserBundlesSettings.instance } returns mockk<TextMateUserBundlesSettings> {
        every { bundles } returns mapOf(textMateBundle.name to textMateBundle)
        every { setBundlesConfig(any<Map<String, TextMatePersistentBundle>>()) } answers {
          isSetBundlesConfigTriggered = true
        }
        every { addBundle(any<String>(), any<String>()) } answers {
          isAddNewBundleTriggered = true
        }
      }

      mockkStatic(TextMateService::getInstance)
      every { TextMateService.getInstance() } returns mockk<TextMateService> {
        every { reloadEnabledBundles() } answers {
          isReloadEnabledBundlesTriggered = true
        }
      }

      pliState.prepareLSPClient { isFinalPrepFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isSetBundlesConfigTriggered shouldBe false }
      assertSoftly { isAddNewBundleTriggered shouldBe false }
      assertSoftly { isReloadEnabledBundlesTriggered shouldBe false }
      assertSoftly { currState shouldBe InitStates.LSP_CLIENT_PREPARED }
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
    }

    test("the state should throw error cause the state before LSP client preparation is not correct") {
      val exception = assertThrows<IllegalStateException> { pliState.prepareLSPClient { isFinalPrepFunctionCalled = true } }
      assertSoftly { exception.message shouldContain "Invalid plug-in state" }
    }
  }

  context("PliPluginStateTestSpec.finishInitialization") {
    lateinit var projectMock: Project
    lateinit var pliState: PliPluginState

    var isFinalPrepFunctionCalled = false

    beforeTest {
      projectMock = mockk<Project>()
      pliState = spyk(PliPluginState(projectMock), recordPrivateCalls = true)

      isFinalPrepFunctionCalled = false
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("the state should change itself respectively after the initialization is finished") {
      var isNotificationTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.LSP_CLIENT_PREPARED
      )

      val notifyRef: (Notification) -> Unit = Notifications.Bus::notify
      mockkStatic(notifyRef as KFunction<*>)
      every { Notifications.Bus.notify(any<Notification>()) } answers {
        isNotificationTriggered = true
      }

      pliState.finishInitialization("test") { isFinalPrepFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { currState shouldBe InitStates.UP }
      assertSoftly { isNotificationTriggered shouldBe false }
    }

    test("the state should change itself respectively after the initialization is finished together with notification as the TextMate bundle is not initialized") {
      var isNotificationTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.LSP_SERVER_CONNECTION_PREPARED
      )

      val notifyRef: (Notification) -> Unit = Notifications.Bus::notify
      mockkStatic(notifyRef as KFunction<*>)
      every { Notifications.Bus.notify(any<Notification>()) } answers {
        isNotificationTriggered = true
      }

      pliState.finishInitialization("test") { isFinalPrepFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalPrepFunctionCalled shouldBe true }
      assertSoftly { currState shouldBe InitStates.UP }
      assertSoftly { isNotificationTriggered shouldBe true }
    }

    test("the state should throw error cause the state before initialization finish is not correct") {
      val exception = assertThrows<IllegalStateException> { pliState.finishInitialization("test") { isFinalPrepFunctionCalled = true } }
      assertSoftly { exception.message shouldContain "Invalid plug-in state" }
    }
  }

  context("PliPluginStateTestSpec.unloadLSPClient") {
    lateinit var projectMock: Project
    lateinit var pliState: PliPluginState

    var isFinalUnloadFunctionCalled = false

    beforeTest {
      projectMock = mockk<Project>()
      pliState = spyk(PliPluginState(projectMock), recordPrivateCalls = true)

      isFinalUnloadFunctionCalled = false
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("the state should change itself respectively after the LSP client is unloaded") {
      var isSetBundlesConfigTriggered = false
      var isReloadEnabledBundlesTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.UP
      )

      mockkObject(TextMateUserBundlesSettings)
      every { TextMateUserBundlesSettings.instance } returns mockk<TextMateUserBundlesSettings> {
        every { bundles } returns emptyMap()
        every { setBundlesConfig(any<Map<String, TextMatePersistentBundle>>()) } answers {
          isSetBundlesConfigTriggered = true
        }
      }

      mockkStatic(TextMateService::getInstance)
      every { TextMateService.getInstance() } returns mockk<TextMateService> {
        every { reloadEnabledBundles() } answers {
          isReloadEnabledBundlesTriggered = true
        }
      }

      pliState.unloadLSPClient { isFinalUnloadFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isSetBundlesConfigTriggered shouldBe true }
      assertSoftly { isReloadEnabledBundlesTriggered shouldBe true }
      assertSoftly { isFinalUnloadFunctionCalled shouldBe true }
      assertSoftly { currState shouldBe InitStates.LSP_CLIENT_UNLOADED }
    }

    test("the state should change itself respectively after the LSP client is unloaded but the notification for TextMate bundle unload failure is triggered") {
      var isReloadEnabledBundlesTriggered = false
      var isNotificationTriggered = false

      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.UP
      )

      val notifyRef: (Notification) -> Unit = Notifications.Bus::notify
      mockkStatic(notifyRef as KFunction<*>)
      every { Notifications.Bus.notify(any<Notification>()) } answers {
        isNotificationTriggered = true
      }

      mockkObject(TextMateUserBundlesSettings)
      every { TextMateUserBundlesSettings.instance } returns null

      mockkStatic(TextMateService::getInstance)
      every { TextMateService.getInstance() } returns mockk<TextMateService> {
        every { reloadEnabledBundles() } answers {
          isReloadEnabledBundlesTriggered = true
        }
      }

      pliState.unloadLSPClient { isFinalUnloadFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isReloadEnabledBundlesTriggered shouldBe false }
      assertSoftly { isFinalUnloadFunctionCalled shouldBe true }
      assertSoftly { isNotificationTriggered shouldBe true }
      assertSoftly { currState shouldBe InitStates.LSP_CLIENT_UNLOADED }
    }

    test("the state should throw error cause the state before LSP client unload is not correct") {
      val exception = assertThrows<IllegalStateException> { pliState.unloadLSPClient { isFinalUnloadFunctionCalled = true } }
      assertSoftly { exception.message shouldContain "Invalid plug-in state" }
    }
  }

  context("PliPluginStateTestSpec.finishDeinitialization") {
    lateinit var projectMock: Project
    lateinit var pliState: PliPluginState

    var isFinalUnloadFunctionCalled = false

    beforeTest {
      projectMock = mockk<Project>()
      pliState = spyk(PliPluginState(projectMock), recordPrivateCalls = true)

      isFinalUnloadFunctionCalled = false
    }

    afterTest {
      unmockkAll()
      clearAllMocks()
    }

    test("the state should change itself respectively after the deinitialization process") {
      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.LSP_CLIENT_UNLOADED
      )

      pliState.finishDeinitialization { isFinalUnloadFunctionCalled = true }
      val currState = getPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState"
      ) as InitStates
      assertSoftly { isFinalUnloadFunctionCalled shouldBe true }
      assertSoftly { currState shouldBe InitStates.DOWN }
    }

    test("the state should throw error cause the state before deinitialization is not correct") {
      setPrivateFieldValue(
        pliState,
        LanguageSupportState::class.java,
        "currState",
        InitStates.UP
      )
      val exception = assertThrows<IllegalStateException> { pliState.finishDeinitialization { isFinalUnloadFunctionCalled = true } }
      assertSoftly { exception.message shouldContain "Invalid plug-in state" }
    }
  }

})
