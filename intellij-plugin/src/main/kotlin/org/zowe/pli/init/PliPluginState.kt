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

import com.intellij.openapi.Disposable
import com.intellij.openapi.application.PathManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.Disposer
import com.intellij.openapi.util.io.FileUtil
import com.intellij.util.io.ZipUtil
import com.jetbrains.rd.util.firstOrNull
import com.redhat.devtools.lsp4ij.client.LanguageClientImpl
import com.redhat.devtools.lsp4ij.server.ProcessStreamConnectionProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.plugins.textmate.TextMateService
import org.jetbrains.plugins.textmate.configuration.TextMateUserBundlesSettings
import org.jetbrains.plugins.textmate.plist.JsonPlistReader
import java.nio.file.Path
import kotlin.io.path.exists
import kotlin.io.path.pathString
import kotlin.io.path.readText

private const val VSIX_NAME = "pli-language-support"
private const val VSIX_VERSION = "0.0.1"
private const val TEXTMATE_BUNDLE_NAME = "pli"

/**
 * State of the PL/I plug-in. Provides initialization methods to set up all the things before the correct usage of
 * the syntax highlighting and the LSP features
 */
class PliPluginState private constructor() : Disposable {

  companion object {
    private val projectToPluginState = mutableMapOf<Project, PliPluginState>()

    /**
     * Get initialized plug-in state by the project. If there is no plugin state initialized for the project,
     * the new state is initialized
     * @param project the project to get or initialize the plug-in's state
     * @return initialized plug-in's state
     */
    fun getPluginState(project: Project): PliPluginState {
      val pluginState = projectToPluginState[project] ?: PliPluginState()
      projectToPluginState[project] = pluginState
      return pluginState
    }

    /** Get all initialized plug-in's states */
    fun getAllPluginStates() = projectToPluginState
  }

  private var currState: InitStates = InitStates.DOWN
  private lateinit var stateProject: Project
  private lateinit var vsixPlacingRootPath: Path
  private lateinit var vsixUnpackedPath: Path
  private lateinit var packageJsonPath: Path
  private lateinit var lspServerPath: Path

  /**
   * Compute all the paths needed for the plug-in's setup
   * @return boolean that indicates if the paths are already exist
   */
  private fun computeVSIXPlacingPaths(): Boolean {
    vsixPlacingRootPath = PathManager.getConfigDir().resolve(VSIX_NAME)
    vsixUnpackedPath = vsixPlacingRootPath.resolve("extension")
    packageJsonPath = vsixUnpackedPath.resolve("package.json")
    lspServerPath = vsixUnpackedPath.resolve("out").resolve("language").resolve("main.cjs")
    val syntaxesPath = vsixUnpackedPath.resolve("syntaxes")
    return vsixUnpackedPath.exists() && packageJsonPath.exists() && lspServerPath.exists() && syntaxesPath.exists()
  }

  /**
   * Unzip .vsix file in the 'resources' folder into the 'build' path, and later use the unzipped files to activate
   * a TextMate bundle and an LSP server. If the paths of the unzipped .vsix are already exist, the processing is skipped
   */
  @InitializationOnly
  suspend fun unpackVSIX() {
//    if (currState != InitStates.DOWN) throw IllegalStateException("Invalid plug-in state. Expected: ${InitStates.DOWN}, current: $currState")
    val doPathsAlreadyExist = computeVSIXPlacingPaths()
    if (!doPathsAlreadyExist) {
      val activeClassLoader = this::class.java.classLoader
      currState = InitStates.VSIX_UNPACK_TRIGGERED
      val vsixNameWithVersion = "$VSIX_NAME-$VSIX_VERSION"
      val vsixWithExt = "$vsixNameWithVersion.vsix"
      return withContext(Dispatchers.IO) {
        val vsixTempFile = FileUtil.createTempFile(VSIX_NAME, ".vsix")
        val vsixResource = activeClassLoader
          .getResourceAsStream(vsixWithExt)
          ?: throw Exception("No $vsixWithExt found")
        vsixTempFile.writeBytes(vsixResource.readAllBytes())
        ZipUtil.extract(vsixTempFile.toPath(), vsixPlacingRootPath, null)
        currState = InitStates.VSIX_UNPACKED
      }
    } else {
      currState = InitStates.VSIX_UNPACKED
    }
  }

  /**
   * Load a TextMate bundle from previously unzipped .vsix. The version of the bundle to activate is the same as the
   * .vsix package has. If there is an already activated version of the bundle with the same name, it will be deleted
   * if the version is less than the one it is trying to activate. If the versions are the same, or there are any
   * troubles unzipping/using the provided bundle, the processing does not continue, and the bundle that is already
   * loaded to the IDE stays there
   */
  @InitializationOnly
  fun loadLanguageClientDefinition(project: Project): LanguageClientImpl {
//    if (currState < InitStates.VSIX_UNPACKED) throw IllegalStateException("Invalid plug-in state. Expected: at least ${InitStates.VSIX_UNPACKED}, current: $currState")
    currState = InitStates.TEXTMATE_BUNDLE_LOAD_TRIGGERED
    val emptyBundleName = "$TEXTMATE_BUNDLE_NAME-0.0.0"
    val newBundleName = "$TEXTMATE_BUNDLE_NAME-$VSIX_VERSION"
    var existingBundles = TextMateUserBundlesSettings.instance?.bundles
    val existingBundle = existingBundles
      ?.filter { it.value.name.contains(TEXTMATE_BUNDLE_NAME) }
      ?.firstOrNull()
    val existingBundleName = existingBundle?.value?.name ?: emptyBundleName
    if (existingBundleName < newBundleName) {
      existingBundles = existingBundles?.filter { it.value.name != existingBundleName } ?: emptyMap()
      TextMateUserBundlesSettings.instance?.setBundlesConfig(existingBundles)
      TextMateUserBundlesSettings.instance?.addBundle(vsixUnpackedPath.toString(), newBundleName)
      TextMateService.getInstance().reloadEnabledBundles()
    }
    currState = InitStates.TEXTMATE_BUNDLE_LOADED
    return LanguageClientImpl(project)
  }

  /** Extract PL/I language extensions, supported for recognition, from package.json in resources */
  private fun extractExtensionsFromPackageJson(): List<String> {
    val packageJsonContent = packageJsonPath.readText()
    val cobolExtensions = mutableListOf<String>()
    try {
      val json = JsonPlistReader.createJsonReader()
        .readValue(packageJsonContent, Any::class.java)
      if (json is Map<*, *>) {
        val contributes = json["contributes"]
        if (contributes is Map<*, *>) {
          val languages = contributes["languages"]
          if (languages is ArrayList<*>) {
            for (language in languages) {
              if (language is Map<*, *>) {
                val id = language["id"]
                if (id is String && id == "pl-one") {
                  val extensions = language["extensions"]
                  if (extensions is ArrayList<*>) {
                    val extensionsStrs = extensions.map {
                        ext: Any? -> if (ext is String) { ext.trimStart('.') } else { "" }
                    }
                    cobolExtensions.addAll(extensionsStrs)
                  }
                  val filenames = language["filenames"]
                  if (filenames is ArrayList<*>) {
                    val filenamesStrs = filenames.map {
                        filename: Any? -> if (filename is String) { filename } else { "" }
                    }
                    cobolExtensions.addAll(filenamesStrs)
                  }
                }
              }
            }
          }
        }
      }
    } catch (ignored: Exception) {
    }
    return cobolExtensions
  }

  /** Initialize language server definition. Will run the LSP server command */
  @InitializationOnly
  fun loadLanguageServerDefinition(): ProcessStreamConnectionProvider {
//    if (currState < InitStates.VSIX_UNPACKED) throw IllegalStateException("Invalid plug-in state. Expected: at least ${InitStates.VSIX_UNPACKED}, current: $currState")
    currState = InitStates.LSP_LOAD_TRIGGERED
    val lspServerPathString = lspServerPath.pathString
//    val extensions = extractExtensionsFromPackageJson()
    val commands = listOf("node", lspServerPathString, "--stdio")
    currState = InitStates.LSP_LOADED
    return object : ProcessStreamConnectionProvider(commands) {}
  }

  /** Initialization final step, no direct purposes for now */
  @InitializationOnly
  fun finishInitialization(project: Project) {
    if (currState != InitStates.LSP_LOADED || currState != InitStates.TEXTMATE_BUNDLE_LOADED) throw IllegalStateException("Invalid plug-in state. Expected: at least ${InitStates.LSP_LOADED}, current: $currState")
    stateProject = project
    currState = InitStates.UP
  }

  /** Disable the plug-in's TextMate bundle before the plug-in is unloaded */
  @InitializationOnly
  fun disableTextMateBundle() {
    if (currState != InitStates.UP) throw IllegalStateException("Invalid plug-in state. Expected: ${InitStates.UP}, current: $currState")
    currState = InitStates.TEXTMATE_BUNDLE_UNLOAD_TRIGGERED
    var existingBundles = TextMateUserBundlesSettings.instance?.bundles
    existingBundles = existingBundles?.filter { it.value.name.contains(TEXTMATE_BUNDLE_NAME) } ?: emptyMap()
    TextMateUserBundlesSettings.instance?.setBundlesConfig(existingBundles)
    TextMateService.getInstance().reloadEnabledBundles()
    currState = InitStates.TEXTMATE_BUNDLE_UNLOADED
  }

//  // TODO: finish, doc
//  /** Disable LSP server wrappers together with LSP servers for the project before the plug-in's state is disposed */
//  @InitializationOnly
//  fun disableLSP() {
//    if (currState > InitStates.TEXTMATE_BUNDLE_UNLOADED) throw IllegalStateException("Invalid plug-in state. Expected: at most ${InitStates.TEXTMATE_BUNDLE_UNLOADED}, current: $currState")
//    currState = InitStates.LSP_UNLOAD_TRIGGERED
//    val projectPath = FileUtils.projectToUri(stateProject)
//    val serverWrappers = IntellijLanguageClient.getAllServerWrappersFor(projectPath)
//    serverWrappers.forEach { it.stop(true) }
//    currState = InitStates.LSP_UNLOADED
//  }

  /** Deinitialization final step, disposing purposes */
  @InitializationOnly
  fun finishDeinitialization() {
    if (currState > InitStates.LSP_UNLOADED) throw IllegalStateException("Invalid plug-in state. Expected: at most ${InitStates.LSP_UNLOADED}, current: $currState")
    currState = InitStates.DOWN
    this.dispose()
  }

  override fun dispose() {
    Disposer.dispose(this)
  }

}
