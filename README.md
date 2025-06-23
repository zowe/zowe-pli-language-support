<div id="header" align="center">

[![Build Status](https://github.com/zowe/zowe-pli-language-support/actions/workflows/build.yml/badge.svg)](https://github.com/zowe/zowe-pli-language-support/actions/workflows/build.yml)
[![GitHub issues](https://img.shields.io/github/issues-raw/zowe/zowe-pli-language-support)](https://github.com/zowe/zowe-pli-language-support/issues)
[![slack](https://img.shields.io/badge/chat-on%20Slack-blue)](https://join.slack.com/t/che4z/shared_invite/zt-22b0064vn-nBh~Fs9Fl47Prp5ItWOLWw)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=zowe_zowe-pli-language-support&metric=alert_status)](https://sonarcloud.io/dashboard?id=zowe_zowe-pli-language-support)

</div>

# PL/I Language Support

PL/I Language Support enhances the PL/I programming experience on your IDE. The extension leverages the language server protocol to provide syntax highlighting and coloring, and diagnostic features for PL/I code, compiler options, and include files. PL/I Language Support is available as a VS Code extension, and on an interactive [playground](https://zowe.github.io/zowe-pli-language-support/).

PL/I Language Support recognizes files with the extension `.pli` and `.pl1` as PL/I files.

This extension is a part of the Zowe open-source project, hosted by the Open Mainframe Project. To contribute and report issues, visit our [Git repository](https://github.com/zowe/zowe-pli-language-support).

<a href="https://www.openmainframeproject.org/all-projects/zowe/conformance"><img alt="This extension is Zowe v3 conformant" src="https://artwork.openmainframeproject.org/other/zowe-conformant/zowev3/explorer-vs-code/color/zowe-conformant-zowev3-explorer-vs-code-color.png" width=260 height=195 /></a>

## Address Software Requirements

There are no client or server-side prerequisites for PL/I Language Support.

## Language Support Features

PL/I Language Support provides the following PL/I syntax awareness features:

### Syntax and Semantic Check for Code
This feature checks for mistakes and errors in PL/I code, including compiler options. The syntax check feature reviews the whole content of the code and suggests fixes, and the semantic analysis highlights incorrect names of variables and include files.

The syntax check feature also validates built-in functions, pseudovariables, and subroutines which must be explicitly declared.

### Syntax Highlighting
The extension enables syntax highlighting for PL/I code.

### Syntax Coloring
Contrasting colors are used in displayed code for ease of identifying and distinguishing keywords, variables, compiler options, paragraphs, and sections.

### Code Snippets
Before you write your PL/I code from scratch, search the snippet library for useful templates.

1. Press **F1** to open the command palette.
2. Run the command **Snippets: Insert PL/I Snippet**.
3. Select the snippet that you want to insert.

You can also insert a code snippet by typing the name of the snippet in your code and clicking on the autocomplete text.

### Core Preprocessor Support

The following preprocessor statements are supported:

* Listing control statements (`PAGE`, `SKIP`, `PRINT`, `PUSH`, `POP`)
* Standard include statements (`%INCLUDE`, `%XINCLUDE`, `%INSCAN`, `%INSCAN`)
* Core preprocessor statements (`%DECLARE`, `%ACTIVATE`, `%DEACTIVATE`, `%DO`, `%SELECT`, `%IF`, `%ELSE`, `%THEN`, `%GOTO`, `%END`, `%ITERATE`, `%LEAVE`, `%NOTE`, `%null`, `%REPLACE`)

### Include File Support
The PL/I Language Support extension supports include files used in your source code as long as they are stored locally in an **/inc** folder in your workspace, or in another workspace folder which you specify in a processor group. Files with the extensions `.inc` and `.mac` or with no extension are recognised as PL/I include files. The `%INCLUDE` statement is supported by default, variations on it such as `++INCLUDE` must be specified as compiler options in a processor group.

The Find All References and Go To Definition functionalities are extended to work for occurrences of include file names, variables and paragraphs in the main PL/I file.

* **Find All References** identifies all occurrences of variables and paragraphs from include files in the code.
* **Go To Definition** enables you to right-click on any variable or paragraph to reveal a definition of the element. If the definition is in an include file, or the name of an include file, the include file opens.

## Processor Groups

Use processor groups to link specific programs with compiler options, folders that contain include files, and include file extensions. You define processor groups in a `proc_grps.json` file and associate processor groups with programs in a `pgm_conf.json` file. Create both of these files in a **/.pliplugin** folder in your workspace root.

The `proc_grps.json` file is formatted as an array of JSON elements, with one JSON per processor group. Each processor group can contain the following elements:

- **"name":** (string)  
    - Specify a name for the processor group.
- (Optional) **"libs":** (array)  
    - Specify local folders that contain include files. Specify local folders as either absolute or relative local paths.
- (Optional) **"copybook-extensions":** (array)  
    - Specify file extensions that you use for the include files in programs linked with this processor groups.
- (Optional) **"compiler-options":** (array)  
    - Specify compiler directives that you want to apply to the programs linked with this processor group. 

### Example Program Configuration File

The program configuration file, `pgm_conf.json`, links programs to processor groups. The program configuration file has the following format:

```
{
    "pgms": [
        { "program": "PROGRAM1", "pgroup": "GROUP1" },
        { "program": "PROGRAM2", "pgroup": "GROUP2" },
    ]
}
```

Each element contains the following parameters:

- **"program":** (string)
    - Specify a program name. This field can be wildcarded.
- **"pgroup":** (string)
    - Specify the name of a procecssor group that is defined in `proc_grps.json`.

### Example Processor Group Configuration

Using the example `pgm_conf.json` file in the section above, the following `proc_grps.json` example enables the following:

- Include files from local folder /lib1, with the extensions ".cpy" and ".copy" are used with PROGRAM1.
- The `INCAFTER(PROCESS(FWKMACRO))` compiler option is enabled for PROGRAM1.
- Include files from local folders /lib2 and /lib3 are used with PROGRAM2.

```
{
  "pgroups": [
    {
      "name": "GROUP1",
      "compiler-options": ["INCAFTER(PROCESS(FWKMACRO))"],
      "libs": [
        "lib1"
      ],
      "copybook-extensions": [
        ".cpy", ".copy"
      ]
    },
{
      "name": "GROUP2",
      "libs": [
        "lib2",
        "lib3"
      ]
    }
  ]
}
```

## Integrate with Zowe Explorer

We recommend the use of [Zowe Explorer](https://marketplace.visualstudio.com/items?itemName=Zowe.vscode-extension-for-zowe) to access your mainframe data sets containing PL/I source code directly in the VS Code interface.
