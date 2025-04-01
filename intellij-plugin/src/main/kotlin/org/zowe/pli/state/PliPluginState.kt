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
import com.intellij.openapi.application.PathManager
import com.intellij.openapi.project.Project
import com.intellij.util.io.ZipUtil
import com.jetbrains.rd.util.firstOrNull
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.plugins.textmate.TextMateService
import org.jetbrains.plugins.textmate.configuration.TextMateUserBundlesSettings
import com.intellij.openapi.util.io.FileUtil
import com.redhat.devtools.lsp4ij.client.LanguageClientImpl
import com.redhat.devtools.lsp4ij.server.ProcessStreamConnectionProvider
import com.redhat.devtools.lsp4ij.server.StreamConnectionProvider
import kotlinx.coroutines.runBlocking
import java.nio.file.Path
import kotlin.io.path.exists
import kotlin.io.path.pathString

const val PLI_PLUGIN_NOTIFICATION_ID = "org.zowe.pli.PliNotificationId"

private const val VSIX_NAME = "pli-language-support"
private const val VSIX_VERSION = "0.0.3"
const val TEXTMATE_BUNDLE_NAME = "pli"

/**
 * State of the PL/I plug-in. Provides initialization methods to set up all the things before the correct usage of
 * the syntax highlighting and the LSP features
 * @property project the project related to the plug-in's state
 */
@OptIn(InitializationOnly::class)
class PliPluginState(private val project: Project) : LanguageSupportState() {

  private lateinit var vsixPlacingRootPath: Path
  private lateinit var vsixUnpackedPath: Path
  private lateinit var packageJsonPath: Path
  private lateinit var lspServerPath: Path
  private lateinit var lspServerConnection: StreamConnectionProvider
  private lateinit var lspClient: LanguageClientImpl

  override fun isLSPServerConnectionReady(): Boolean {
    return ::lspServerConnection.isInitialized
  }

  override fun getReadyLSPServerConnection(): Any {
    return if (isLSPServerConnectionReady()) lspServerConnection else throw IllegalStateException("LSP server connection is not ready")
  }

  override fun isLSPClientReady(): Boolean {
    return ::lspClient.isInitialized
  }

  override fun getReadyLSPClient(): Any {
    return if (isLSPClientReady()) lspClient else throw IllegalStateException("LSP client is not ready")
  }

  /**
   * Compute all the paths needed for the plug-in's setup
   * @return boolean that indicates if the paths are already exist
   */
  private fun computeVSIXPlacingPaths(): Boolean {
    vsixPlacingRootPath = PathManager.getConfigDir().resolve(VSIX_NAME)
    vsixUnpackedPath = vsixPlacingRootPath
    packageJsonPath = vsixUnpackedPath.resolve("package.json")
    lspServerPath = vsixUnpackedPath.resolve("out").resolve("language").resolve("main.cjs")
    val syntaxesPath = vsixUnpackedPath.resolve("syntaxes")
    return vsixUnpackedPath.exists() && packageJsonPath.exists() && lspServerPath.exists() && syntaxesPath.exists()
  }

  /** Unpack VSIX package and place it under temp directory */
  private fun unpackVSIX() {
    val activeClassLoader = this::class.java.classLoader
    val vsixNameWithVersion = "$VSIX_NAME-$VSIX_VERSION"
    val vsixWithExt = "$vsixNameWithVersion.vsix"
    val vsixTempFile = FileUtil.createTempFile(VSIX_NAME, ".vsix")
    val vsixResource = activeClassLoader
      .getResourceAsStream(vsixWithExt)
      ?: throw Exception("No $vsixWithExt found")
    vsixTempFile.writeBytes(vsixResource.readAllBytes())
    ZipUtil.extract(vsixTempFile.toPath(), vsixPlacingRootPath, null)
  }

  /**
   * Unzip .vsix file in the 'resources' folder into the 'build' path,
   * and later use the unzipped files to activate a TextMate bundle and an LSP server connection.
   * If the paths of the unzipped .vsix are already exist, the processing is skipped
   * @param prepFun the function for additional preparation steps after the VSIX package is prepared
   * @see [LanguageSupportState.prepareVSIX]
   */
  @InitializationOnly
  override fun prepareVSIX(prepFun: () -> Unit) {
    super.prepareVSIX {
      runBlocking {
        withContext(Dispatchers.IO) {
          val doPathsAlreadyExist = computeVSIXPlacingPaths()
          if (!doPathsAlreadyExist) {
            unpackVSIX()
          }
        }
      }
      prepFun()
    }
  }

   /**
   * Initialize language server definition. Will run the LSP server command
   * @param prepFun the function for additional preparation steps after the LSP server connection instance is prepared
   * @see [LanguageSupportState.prepareLSPServerConnection]
   */
  @InitializationOnly
  override fun prepareLSPServerConnection(prepFun: () -> Unit) {
    return super.prepareLSPServerConnection {
      val lspServerPathString = lspServerPath.pathString
      val commands = listOf("node", lspServerPathString, "--stdio")
      lspServerConnection = object : ProcessStreamConnectionProvider(commands) {}
      prepFun()
    }
  }

  /**
   * Load a TextMate bundle from previously unzipped .vsix. The version of the bundle to activate is the same as the
   * .vsix package has. If there is an already activated version of the bundle with the same name, it will be deleted
   * if the version is less than the one it is trying to activate. If the versions are the same, or there are any
   * troubles unzipping/using the provided bundle, the processing does not continue, and the bundle that is already
   * loaded to the IDE stays there. As the finishing step, prepares the PL/I LSP client instance
   * @param prepFun the function for additional preparation steps after the LSP client instance is prepared
   * @see [LanguageSupportState.prepareLSPClient]
   */
  @InitializationOnly
  override fun prepareLSPClient(prepFun: () -> Unit) {
    super.prepareLSPClient {
      val emptyBundleName = "$TEXTMATE_BUNDLE_NAME-0.0.0"
      val newBundleName = "$TEXTMATE_BUNDLE_NAME-$VSIX_VERSION"
//      val textMateUserBundlesSettings = TextMateUserBundlesSettings.getInstance()
      val textMateUserBundlesSettings = TextMateUserBundlesSettings.instance
      if (textMateUserBundlesSettings != null) {
        var existingBundles = textMateUserBundlesSettings.bundles
        val existingBundle = existingBundles
          .filter { it.value.name.contains(TEXTMATE_BUNDLE_NAME) }
          .firstOrNull()
        val existingBundleName = existingBundle?.value?.name ?: emptyBundleName
        if (existingBundleName < newBundleName) {
          existingBundles = existingBundles.filter { it.value.name != existingBundleName }
          textMateUserBundlesSettings.setBundlesConfig(existingBundles)
          textMateUserBundlesSettings.addBundle(vsixUnpackedPath.toString(), newBundleName)
          TextMateService.getInstance().reloadEnabledBundles()
        }
      } else {
        Notification(
          PLI_PLUGIN_NOTIFICATION_ID,
          "TextMate bundle is not initialized",
          "TextMate user settings is failed to load, thus it is not possible to initialize the PL/I TextMate bundle",
          NotificationType.WARNING
        ).let {
          Notifications.Bus.notify(it)
        }
      }
      lspClient = LanguageClientImpl(project)
      prepFun()
    }
  }

  /**
   * Disable the PL/I plug-in TextMate bundle before the plug-in is unloaded
   * @param unloadFun the function for additional unloading steps before the LSP client instance is unloaded
   * @see [LanguageSupportState.unloadLSPClient]
   */
  @InitializationOnly
  override fun unloadLSPClient(unloadFun: () -> Unit) {
    super.unloadLSPClient {
      unloadFun()
//      val textMateUserBundlesSettings = TextMateUserBundlesSettings.getInstance()
      val textMateUserBundlesSettings = TextMateUserBundlesSettings.instance
      if (textMateUserBundlesSettings != null) {
        var existingBundles = textMateUserBundlesSettings.bundles
        existingBundles = existingBundles.filter { it.value.name.contains(TEXTMATE_BUNDLE_NAME) }
        textMateUserBundlesSettings.setBundlesConfig(existingBundles)
        TextMateService.getInstance().reloadEnabledBundles()
      } else {
        Notification(
          PLI_PLUGIN_NOTIFICATION_ID,
          "TextMate bundle is not uninitialized",
          "TextMate user settings is failed to load, thus it is not possible to remove the PL/I TextMate bundle",
          NotificationType.WARNING
        ).let {
          Notifications.Bus.notify(it)
        }
      }
    }
  }

}
