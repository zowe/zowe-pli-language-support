# PL/I Language Support plug-in for IntelliJ IDEA™

## Prerequisites

- Java v17
- Node.js v18 and later
- IntelliJ v2023.2

## How to run (user)

- Open the folder with the project, run `./gradlew buildPlugin` (for Unix-like) or `.\gradlew.bat buildPlugin` (for Windows) to build the plugin (or run "Package plugin" configuration)
- The built plug-in will be at the `build/distributions` in .zip format, install it with Settings -> Plugins -> Install plugin from disk
- Reload your IDE

## How to run (developer)

- Open the folder with the project, run "Run plugin" configuration, wait for the other instance of IDE to run
