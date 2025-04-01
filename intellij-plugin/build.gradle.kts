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
 *   Uladzislau Kalesnikau
 */

import org.jetbrains.intellij.platform.gradle.TestFrameworkType

//!IMPORTANT!: to refer "libs", use ./gradle/libs.versions.toml

fun properties(key: String) = providers.gradleProperty(key)

plugins {
  alias(libs.plugins.gradle) // IntelliJ Platform Gradle Plugin
  alias(libs.plugins.kotlinJvm)
  alias(libs.plugins.kover)
  java
}

group = properties("pluginGroup").get()
version = properties("pluginVersion").get()
val lsp4ijVersion = "0.11.0"

repositories {
  mavenCentral()
  intellijPlatform {
    defaultRepositories()
    jetbrainsRuntime()
  }
}

java {
  sourceCompatibility = JavaVersion.VERSION_17
  targetCompatibility = JavaVersion.VERSION_17
}

kotlin {
  jvmToolchain {
    languageVersion.set(JavaLanguageVersion.of(JavaVersion.VERSION_17.toString()))
  }
}

// Configure Gradle IntelliJ Plugin
// Read more: https://plugins.jetbrains.com/docs/intellij/tools-intellij-platform-gradle-plugin.html
intellijPlatform {
  pluginConfiguration {
    version = properties("platformVersion").get()
    ideaVersion {
      sinceBuild = properties("pluginSinceBuild").get()
      untilBuild = provider { null }
    }
  }
}

dependencies {
  // ===== Runtime env setup ===
  // IntelliJ
  intellijPlatform {
    intellijIdeaCommunity(properties("platformVersion").get(), useInstaller = false)
    jetbrainsRuntime()
    instrumentationTools()
    bundledPlugin("org.jetbrains.plugins.textmate")
////  pluginsRepositories {
////    custom("https://plugins.jetbrains.com/plugins/nightly/23257")
////  }
    plugin("com.redhat.devtools.lsp4ij:$lsp4ijVersion")
    testFramework(TestFrameworkType.Plugin.Java)
  }
  // Gson
  implementation(libs.gson)
  // ===== Test env setup =====
  // Kotest
  testImplementation(libs.kotest.runner.junit5)
  testImplementation(libs.kotest.assertions.core)
  // MockK
  testImplementation(libs.mockk)
  // JUnit Platform (needed for Kotest)
  testImplementation(libs.junit.platform.launcher)
  // ==========================
}

tasks {
  test {
    useJUnitPlatform()
    testLogging {
      events("passed", "skipped", "failed")
    }
    finalizedBy("koverHtmlReport")
//    testLogging.showStandardStreams = true
  }
}
