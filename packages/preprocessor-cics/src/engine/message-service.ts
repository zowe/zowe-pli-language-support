/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */
export interface MessageService {
  /**
   * Return a localized {@link String} based on passed key and params.
   *
   * @param key Unique ID for each message in externalized message file.
   * @param parameters Arguments referenced by the format specifiers in the format * string in
   *     externalized message file.
   * @return {@link String}
   */
  getMessage(key: string, ...parameters: any[]): string;
}

export class EnglishMessageService implements MessageService {
  getMessage(key: string, ...parameters: any[]): string {
    try {
      return this.messages.get(key)?.(...parameters) ?? key;
    } catch {
      return key;
    }
  }

  private readonly messages = new Map<string, (...args: any[]) => string>([
    [
      "CobolLineReaderImpl.incorrectLineFormat",
      () => "Unexpected indicator area content",
    ],
    [
      "CobolLineReaderImpl.longLineMsg",
      (col: number) => `Source text cannot go past column ${col}`,
    ],
    [
      "cobolParser.subSchemaNameLength",
      (length: number) =>
        `The length ${length} is not allowed. Allowed values are 16, 18.`,
    ],
    [
      "cobolParser.ObsoleteCode",
      () => "The code block is deprecated and not supported",
    ],
    [
      "CobolVisitor.AreaAWarningMsg",
      (token: string) => `The following token must start in Area A: ${token}`,
    ],
    [
      "CobolVisitor.AreaBWarningMsg",
      (token: string) => `The following token must start in Area B: ${token}`,
    ],
    [
      "CobolVisitor.declarativeSameMsg",
      (token: string) =>
        `The following token cannot be on the same line as a DECLARATIVE token: ${token}`,
    ],
    [
      "CobolVisitor.identicalProgMsg",
      (token: string) =>
        `Program-name must be identical to the program-name of the corresponding PROGRAM-ID paragraph: ${token}`,
    ],
    [
      "CobolVisitor.functionReturningMsg",
      () => "Procedure division of a function must contain RETURNING clause",
    ],
    [
      "CobolVisitor.misspelledWord",
      (word: string) => `A misspelled word, maybe you want to put ${word}`,
    ],
    [
      "CobolVisitor.duplicateFileName",
      (fileName: string) =>
        `File ${fileName} is already in the FILE-CONTROL paragraph`,
    ],
    [
      "CobolVisitor.progIDIssueMsg",
      () => "There is an issue with PROGRAM-ID paragraph",
    ],
    [
      "CobolVisitor.funcIDIssueMsg",
      () => "There is an issue with FUNCTION-ID paragraph",
    ],
    [
      "CobolVisitor.subroutineNotFound",
      (subroutine: string) => `${subroutine}: Subroutine not found`,
    ],
    [
      "semantics.functionExpected",
      (functionName: string) =>
        `Expected a function name, but found '${functionName}'`,
    ],
    [
      "semantics.functionRedefined",
      (functionName: string) => `Function '${functionName}' redefined`,
    ],
    [
      "semantics.redefinedContainValue",
      (item: string) =>
        `The redefining item cannot contain a VALUE clause: ${item}`,
    ],
    [
      "semantics.redefineImmediatelyFollow",
      (item: string) =>
        `REDEFINES line must immediately follow redefined item: ${item}`,
    ],
    [
      "semantics.levelsMustMatch",
      (item: string) =>
        `The redefining and redefined items must have the same level: ${item}`,
    ],
    [
      "semantics.noFileControl",
      (item: string) => `No FILE-CONTROL entry found for ${item}`,
    ],
    ["cics.enableTranslator", () => "Enable CICS translator in the settings"],
    [
      "semantics.unknownVariableDefinition",
      () => "Unknown variable definition",
    ],
    [
      "Communications.noSyntaxError",
      (file: string) => `No syntax errors detected in ${file}`,
    ],
    [
      "Communications.syntaxAnalysisInProgress",
      (file: string) => `${file} : Syntax analysis in progress`,
    ],
    [
      "Communications.syntaxAnalysisInProgressTitle",
      (file: string) => `Parsing ${file}`,
    ],
    [
      "CompilerDirectivesTransformation.sequenceNumber",
      () => "The first character of the sequence number must be numeric.",
    ],
    [
      "ContinuationLineTransformation.compilerDirectiveContinued",
      () => "Compiler directives cannot be continued on another line",
    ],
    [
      "ContinuationLineTransformation.continuationLineContentAreaA",
      () => "A continuation line cannot contain values in the Content Area A",
    ],
    [
      "ContinuationLineTransformation.periodRequired",
      () => "IGYDS1082-E A period was required.",
    ],
    [
      "missing.period",
      (token: string) => `A period was assumed before "${token}".`,
    ],
    [
      "input.mismatch.skipAnalysis",
      () =>
        "Encountered invalid token. Analysis skipped to the next verb or period.",
    ],
    ["inlineComment.missingBlank", () => "Missing blank before inline comment"],
    [
      "db2SqlParser.currentQueryAcceleration",
      (query: string) => `${query} not valid. Must be of format %d%d%d%d.%d`,
    ],
    [
      "db2SqlParser.maxIntValue",
      (value: string) => `${value} not allowed. Allowed range is 1 to 32767`,
    ],
    [
      "db2SqlParser.pieceSize",
      (size: string) => `${size} not allowed. Size must be in KB, MB or GB`,
    ],
    [
      "db2SqlParser.size",
      (size: string) => `${size} not allowed. Size must be in GB`,
    ],
    [
      "parsers.validValueMsg",
      (value: string, expected: string) =>
        `${value} not allowed. It must be ${expected}`,
    ],
    [
      "parsers.maxLength",
      (value: string, max: string) =>
        `${value} cannot exceed ${max} characters`,
    ],
    [
      "parsers.exactLength",
      (value: string, length: string) =>
        `Exact length of ${value} must be ${length} characters`,
    ],
    [
      "parsers.intRangeValue",
      (min: string, max: string) => `Allowed range is ${min} to ${max}`,
    ],
    [
      "parsers.alphaNumeric",
      (value: string) => `Only alphanumerics are allowed for ${value}`,
    ],
    [
      "parsers.startsWith",
      (value: string) => `String must starts with ${value} values`,
    ],
    [
      "parsers.stringLengthRange",
      (min: string, max: string) =>
        `String length must be between ${min} and ${max}`,
    ],
    [
      "parsers.allowedStringValues",
      (values: string) => `Only allowed value(s): ${values}`,
    ],
    [
      "parsers.notAllowedVariableName",
      (name: string) => `Variable name ${name} is not allowed`,
    ],
    ["postprocessing.copybookHasErrors", () => "Errors inside the copybook"],
    ["ErrorStrategy.endOfFile", () => "Unexpected end of file"],
    ["ErrorStrategy.endOfLine", () => "Unexpected end of line"],
    [
      "ErrorStrategy.reportMissingToken",
      (token: string, location: string) =>
        `Missing token ${token} at ${location}`,
    ],
    [
      "ErrorStrategy.reportNoViableAlternative",
      (input: string) => `No viable alternative at input ${input}`,
    ],
    [
      "ErrorStrategy.reportInputMismatch",
      (input: string) => `Syntax error on ${input}`,
    ],
    [
      "ErrorStrategy.reportUnwantedToken",
      (input: string) => `Extraneous input ${input}`,
    ],
    [
      "ErrorStrategy.performMissingEnd",
      (input: string) => `Extraneous input ${input} expected END-PERFORM`,
    ],
    [
      "GrammarPreprocessorListener.copyBkContainsUnderScore",
      (copybook: string) =>
        `Copybook declaration has '_' characters for: ${copybook}`,
    ],
    [
      "GrammarPreprocessorListener.copyBkOverMaxChars",
      (max: number, copybook: string) =>
        `Copybook declaration has more than ${max} characters for: ${copybook}`,
    ],
    [
      "GrammarPreprocessorListener.copyBkStartsOrEndsWithHyphen",
      (copybook: string) =>
        `Copybook declaration starts or ends with '-' characters for: ${copybook}`,
    ],
    [
      "GrammarPreprocessorListener.errorSuggestion",
      (copybook: string) => `${copybook}: Copybook not found`,
    ],
    [
      "GrammarPreprocessorListener.recursionDetected",
      (copybook: string) => `Recursive copybook declaration for: ${copybook}`,
    ],
    [
      "GrammarPreprocessorListener.copyBkNestedReplaceStmt",
      (copybook: string) =>
        `More than one nested copy replace statement for copybook declaration of: ${copybook}`,
    ],
    [
      "GrammarPreprocessorListener.controlDirectiveWrongArgs",
      (directive: string) => `No arguments found for *${directive}`,
    ],
    [
      "GrammarPreprocessorListener.langMissingEnterDirective",
      () => "Language name missing for ENTER compiler directive",
    ],
    [
      "ReplacingServiceImpl.invalidWord",
      () => "COPY string is not allowed in pseudo text",
    ],
    [
      "ReplacingServiceImpl.pseudoTxtInvalidLength",
      () => "Max 322 chars allowed for each individual word in pseudo text",
    ],
    [
      "semantics.paragraphNotDefined",
      (paragraph: string) =>
        `The following paragraph is not defined: ${paragraph}`,
    ],
    [
      "semantics.cannotBeRenamed",
      (dataEntry: string) => `The data entry ${dataEntry} cannot be renamed`,
    ],
    [
      "semantics.childToRenameNotFound",
      (dataEntry: string) =>
        `The data entry with the name ${dataEntry} not found`,
    ],
    [
      "semantics.emptyStructure",
      (dataEntry: string) =>
        `A "PICTURE" or "USAGE INDEX" clause was not found for elementary item ${dataEntry}`,
    ],
    [
      "semantics.incorrectChildrenOrder",
      () => "The data entries to rename are specified in an incorrect order",
    ],
    [
      "semantics.noStructureBeforeRename",
      () => "No data definition entry found for rename",
    ],
    [
      "semantics.numberNotAllowedAtTop",
      (level: string) =>
        `${level}: Only 01, 66 and 77 level numbers are allowed at the highest level`,
    ],
    [
      "semantics.previousWithoutPicFor88",
      (condition: string) =>
        `A conditional data item is not found for this condition: ${condition}`,
    ],
    [
      "semantics.tooManyClauses",
      (clause: string) =>
        `A duplicate ${clause} clause was found in a data description entry`,
    ],
    ["semantics.globalNon01Level", () => "GLOBAL can only be used on level 01"],
    [
      "semantics.globalTooManyDefinitions",
      () => "Global variable must have a unique name",
    ],
    [
      "semantics.notDefined",
      (variable: string) => `Variable ${variable} is not defined`,
    ],
    [
      "semantics.notDefinedInStructure",
      (variable: string, structure: string) =>
        `Variable ${variable} does not exist in structure ${structure}`,
    ],
    [
      "semantics.ambiguous",
      (reference: string) => `Ambiguous reference for ${reference}`,
    ],
    [
      "semantic.exitPerformIsIgnored",
      () =>
        "The EXIT PERFORM statement is outside of an inline PERFORM statement and will be ignored",
    ],
    [
      "semantic.picNotAllowed",
      (variable: string) =>
        `Group variable ${variable} cannot have PICTURE clause`,
    ],
    [
      "statements.invalidReceivingField",
      (expected: string) =>
        `Invalid receiving field type. Expected: ${expected}`,
    ],
    [
      "statements.invalidSendingField",
      (expected: string) => `Invalid sending field type. Expected: ${expected}`,
    ],
    [
      "semantics.picAndUsageConflict",
      () => "PICTURE and USAGE clause are not compatible",
    ],
    [
      "semantics.noPicClause",
      (usage: string) => `PICTURE clause incompatible with usage ${usage}`,
    ],
    [
      "semantics.improperUseBlankWhenZeroAndSignClause",
      (usage: string) => `${usage} not compatible with USAGE clause`,
    ],
    ["variables.indexName", () => "Index name"],
    ["variables.elementaryItem", () => "Elementary data item"],
    ["variables.independent", () => "Independent data item"],
    ["variables.groupItem", () => "Group data item"],
    ["variables.tableDataName", () => "Table data name"],
    ["variables.multiTableDataName", () => "Multi-dimensional table data name"],
    ["variables.renameItem", () => "Rename item"],
    ["variables.mnemonicName", () => "Mnemonic name"],
    ["variables.conditionName", () => "Condition name"],
    [
      "variables.elementaryWithType",
      (type: string) => `Elementary ${type} data item`,
    ],
    ["variables.nonzeroInteger", () => "Non-zero integer"],
    ["variables.integer", () => "integer"],
    ["variables.blankWhenZero", () => "BLANK WHEN ZERO"],
    ["variables.signClause", () => "SIGN CLAUSE"],
    ["variables.mapName", () => "Map name"],
    [
      "workspaceError.ServerType",
      () =>
        "Ensure that you have Java installed and that your serverRuntime is set to JAVA for dialect support.",
    ],
    [
      "dialects.missingDialect",
      (dialect: string, requiredFor: string) =>
        `${dialect} dialect is missing (required for ${requiredFor})`,
    ],
    [
      "dialects.processingError",
      (dialect: string, requiredFor: string) =>
        `${dialect} dialect was stopped due to internal error (required for ${requiredFor})`,
    ],
    [
      "jsonParseProcess.identifier.typeError",
      () =>
        "JSON PARSE identifier1 must reference either an elementary data item or an alphanumeric group item.",
    ],
    [
      "jsonParseProcess.identifier1.groupItemError",
      (item: string) =>
        `${item} group item must be alphanumeric and not be defined with JUSTIFIED or dynamic-length.`,
    ],
    [
      "jsonParseProcess.identifier2.groupItemError",
      (item: string) =>
        `${item} group item must be alphanumeric and not be UNBOUNDED or contain a RENAMES clause.`,
    ],
    [
      "jsonParseProcess.identifier1.elementaryItemError",
      (item: string) =>
        `${item} elementary item must be alphanumeric and not be defined with JUSTIFIED or dynamic-length.`,
    ],
    [
      "jsonParseProcess.condition1",
      (item1: string, item2: string) =>
        `${item1} must directly subordinate to ${item2}.`,
    ],
    [
      "jsonParseProcess.condition2",
      (item: string) => `${item} must be a level-88.`,
    ],
    [
      "jsonParseProcess.identifier2",
      (item: string) =>
        `${item} and its subordinate data items must be alphanumeric and not contain the UNBOUNDED or DYNAMIC clause.`,
    ],
    [
      "jsonParseProcess.identifier5",
      (item: string) =>
        `${item} must be a single-byte alphanumeric elementary data item whose data definition entry contains PICTURE X.`,
    ],
    [
      "jsonParseProcess.identifier4",
      (item1: string, item2: string) =>
        `${item1} must reference a data item that is subordinate to ${item2}`,
    ],
    [
      "jsonParseProcess.omittedIdentifier3",
      (item1: string, item2: string) => `${item1} must reference ${item2}.`,
    ],
    [
      "jsonParseProcess.identifier3",
      (item1: string, item2: string) =>
        `${item1} must reference ${item2} or one of its subordinate data items.`,
    ],
    [
      "jsonParseProcess.noDefnIdentifier1",
      (item: string) =>
        `No definition found for ${item} of JSON PARSE statement.`,
    ],
    [
      "jsonParseProcess.identifier2.wrongClause",
      (item: string) =>
        `${item} and its subordinate data items must be alphanumeric and must NOT contain UNBOUNDED or RENAMES clauses.`,
    ],
    [
      "jsonParseProcess.identifier2.overlap",
      (item1: string, item2: string) =>
        `JSON parse ${item1} must not overlap ${item2}`,
    ],
    [
      "jsonGenProcess.identifier1.elementaryItemError",
      (item: string) =>
        `${item} can only be of category national or alphanumeric and must not be dynamic length or justified.`,
    ],
    [
      "jsonGenProcess.identifier2.groupItemError",
      (item: string) =>
        `${item} group item must have unique data-name and must not contain RENAMES clause.`,
    ],
    [
      "jsonGenProcess.identifier3.dataType",
      (item: string) =>
        `${item} must be an integer data item defined without the symbol P in its picture string.`,
    ],
    [
      "jsonGenProcess.identifier6.dataType",
      (item: string) =>
        `${item} must be an elementary item with a PIC X clause.`,
    ],
    [
      "jsonGenProcess.condition.dataType",
      (item1: string, item2: string) =>
        `${item1} must be a level-88 item directly subordinate to ${item2}.`,
    ],
    [
      "xmlGenProcess.identifier2.overlap",
      (item1: string, item2: string) =>
        `XML generate ${item1} must not overlap ${item2}`,
    ],
    [
      "xmlParse.identifier1.dataType",
      (item: string) =>
        `${item} must be an elementary data item of category national, a national group, an elementary data item of category alphanumeric, or an alphanumeric group item`,
    ],
    [
      "xmlParse.identifier2.dataType",
      (item: string) => `${item} must be of category alphanumeric`,
    ],
    [
      "xmlParse.validating.phrase",
      () =>
        "Validating phrase can be specified only when XMLPARSE(XMLSS) compiler option is in effect",
    ],
    [
      "xmlParse.returnNational.phrase",
      () =>
        "RETURNING NATIONAL phrase can be specified only when the XMLPARSE(XMLSS) compiler option is in effect",
    ],
    ["xmlParse.unsupported.ccid", () => "CCID not supported"],
    [
      "xmlParse.encoding.phrase",
      () =>
        "The ENCODING phrase can be specified only when the XMLPARSE(XMLSS) compiler option is in effect",
    ],
    [
      "xmlParse.ccid.nationalItem",
      () => "A national item codepage must be 1200",
    ],
    [
      "readFileOperation.notOpened",
      () => "READ statement can only reference a file opened for INPUT or I-O",
    ],
    [
      "writeFileOperation.notOpened",
      () =>
        "WRITE statement can only reference a file opened for OUTPUT or I-O or EXTEND",
    ],
    [
      "rewriteFileOperation.notOpened",
      () => "REWRITE statement can only reference a file opened for I-O",
    ],
    [
      "deleteFileOperation.notOpened",
      () => "DELETE statement can only reference a file opened for I-O",
    ],
    [
      "startFileOperation.notOpened",
      () => "START statement can only reference a file opened for INPUT or I-O",
    ],
    [
      "compilerDirective.deprecatedDirectiveUse",
      (directive: string) => `${directive} is a deprecated compiler directive`,
    ],
    [
      "compilerDirective.warning.deprecatedDirectiveUse",
      (option: string) =>
        `The "${option}" compiler option is not supported. The option was ignored.`,
    ],
    [
      "compilerDirective.info.deprecatedDirectiveUse",
      (option: string) => `The "${option}" option is no longer supported.`,
    ],
    [
      "compilerDirective.javaCallable.position",
      () =>
        "The JAVA-CALLABLE directive can only be specified before the PROCEDURE DIVISION of the first program.",
    ],
    [
      "compilerDirective.javaShareable.dataSection",
      () =>
        "The JAVA-SHAREABLE directive can only be specified in the DATA DIVISION of a non-nested program.",
    ],
    [
      "compilerDirective.javaShareable.On",
      () => "The JAVA-SHAREABLE state was already ON.",
    ],
    [
      "compilerDirective.javaShareable.Off",
      () => "The JAVA-SHAREABLE state was already OFF.",
    ],
    [
      "compilerDirective.tooManyBlanks",
      () => "At most one blank character is allowed after >>.",
    ],
    [
      "compilerDirective.extraText",
      () => "Line with a compiler directive can only be padded with blanks.",
    ],
    ["compilerDirective.javaiop.spaceAfterComma", () => "No space allowed."],
    [
      "cicsParser.missingEndExec",
      () => "Missing token END-EXEC for the CICS EXEC block",
    ],
    ["cicsParser.invalidInput", (input: string) => `Extraneous input ${input}`],
    ["cics.invalidExecBlock", () => "Invalid CICS EXEC block"],
    [
      "db2Parser.missingSql",
      () => "Missing token SQL for the EXEC SQL INCLUDE block ",
    ],
    [
      "db2Parser.validation.section",
      () =>
        "this DB2 statement is allowed only in LINKAGE SECTION or WORKING-STORAGE SECTION",
    ],
    [
      "db2Parser.validation.procedureDiv",
      () => "this DB2 statement is allowed only in PROCEDURE DIVISION",
    ],
    [
      "db2Parser.validation.declareVar",
      () => "Db2 variable declaration is only allowed in DATA DIVISION",
    ],
    [
      "db2Parser.validation.allStatement",
      () =>
        "this DB2 statement is allowed only in DATA DIVISION or PROCEDURE DIVISION",
    ],
    [
      "db2Parser.missingEndExec",
      () => "Missing token END-EXEC for the EXEC block",
    ],
    ["cobolParser.expectSpace", () => "A blank is missing after ','"],
    [
      "procedureDivisionHeaderProcess.wrongNodeLocation",
      (operand: string) =>
        `Operand '${operand}' was not defined in the LINKAGE SECTION`,
    ],
    [
      "procedureDivisionHeaderProcess.wrongDataName",
      (dataName: string) => `'${dataName}' was not defined as a data-name`,
    ],
    [
      "variableNameCheck.notAllowedVariableName",
      (name: string) =>
        `The name ${name} cannot be used as a data-name because it was already declared as a function`,
    ],
    [
      "cics.invalidLiteralDelimeter",
      (delimiter: string) =>
        `Invalid literal delimeter: ${delimiter} expected.`,
    ],
    ["analysis.unusedVariable", () => "Unused variable"],
    ["cobolParser.unknownExecBlock", () => "Unknown EXEC block"],
    [
      "cobolParser.unknownExecBlockUnterminated",
      () => "Unknown EXEC block is not terminated",
    ],
  ]);
}
