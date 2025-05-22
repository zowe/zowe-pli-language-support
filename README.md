<div id="header" align="center">

[![Build Status](https://github.com/zowe/zowe-pli-language-support/actions/workflows/build.yml/badge.svg)](https://github.com/zowe/zowe-pli-language-support/actions/workflows/build.yml)
[![GitHub issues](https://img.shields.io/github/issues-raw/zowe/zowe-pli-language-support)](https://github.com/zowe/zowe-pli-language-support/issues)
[![slack](https://img.shields.io/badge/chat-on%20Slack-blue)](https://join.slack.com/t/che4z/shared_invite/zt-22b0064vn-nBh~Fs9Fl47Prp5ItWOLWw)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zowe_zowe-pli-language-support&metric=alert_status)](https://sonarcloud.io/dashboard?id=zowe_zowe-pli-language-support)

</div>

# PL/I Language Support

PL/I Language Support enhances the PL/I programming experience on your IDE. The extension leverages the language server protocol to provide syntax highlighting and coloring, and diagnostic features for PL/I code, compiler options, and include files. PL/I Language Support is available as a VS Code, and is also available on an interactive [playground](https://zowe.github.io/zowe-pli-language-support/).

PL/I Language Support recognizes files with the extension `.pli` and `.pl1` as PL/I files.

This extension is a part of the Zowe open-source project. To contribute and report issues, visit our [Git repository](https://github.com/zowe/zowe-pli-language-support).

## Prerequisites

There are no client or server-side prerequisites for PL/I Language Support.

## Features

PL/I Language Support provides the following PL/I syntax awareness features:

### Syntax and Semantic Check for Code
This feature checks for mistakes and errors in PL/I code. The syntax check feature reviews the whole content of the code and suggests fixes, and the semantic analysis highlights incorrect names of variables and include files.

### Syntax Highlighting
The extension enables syntax highlighting for PL/I code.

### Syntax Coloring
Contrasting colors are used in displayed code for ease of identifying and distinguishing keywords, variables, compiler options, paragraphs, and sections.

### Code Snippets
Before you write your COBOL code from scratch, search the snippet library for useful templates.

1. Press **F1** to open the command palette.
2. Run the command **Snippets: Insert PL/I Snippet**.
3. Select the snippet that you want to insert.

You can also insert a code snippet by typing the name of the snippet in your code and clicking on the autocomplete text.

### Include File Support
The PL/I Language Support extension supports include files used in your source code as long as they are stored locally in an **/inc** folder in your workspace. Files with the extensions `.inc` and `.mac` or with no extension are recognised as PL/I include files.

The Find All References and Go To Definition functionalities are extended to work for occurrences of include file names, variables and paragraphs in the main PL/I file.

* **Find All References** identifies all occurrences of variables and paragraphs from include files in the code.
* **Go To Definition** enables you to right-click on any variable or paragraph to reveal a definition of the element. If the definition is in an include file, or the name of an include file, the include file opens.
