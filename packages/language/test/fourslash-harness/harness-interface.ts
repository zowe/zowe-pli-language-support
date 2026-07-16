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

import { CompletionKeywords } from "../../src/language-server/completion/keywords";
import { type Severity } from "../../src/language-server/types";
import { CompilerOptionsCodes } from "../../src/preprocessor/compiler-options/codes";
import { CompilerOptions as PliCompilerOptions } from "../../src/preprocessor/compiler-options/options-pli";
import { CompilerOptions as MacroCompilerOptions } from "../../src/preprocessor/compiler-options/options-macro";
import { CompilerOptions as SQLCompilerOptions } from "../../src/preprocessor/compiler-options/options-sql";
import { CompilerOptions as CICSCompilerOptions } from "../../src/preprocessor/compiler-options/options-cics";
import { PliMarginsProcessor } from "../../src/preprocessor/pli-margins-processor";
import { DefaultAttribute, SyntaxKind } from "../../src/syntax-tree/ast";
import {
  AccessMode,
  Alignments,
  Assignability,
  Base,
  Bound,
  BufferMode,
  DataType,
  Endianess,
  FileUsage,
  FloatFormat,
  NumberMode,
  PictureWideness,
  Precisions,
  ScaleMode,
  Scopes,
  Sign,
  StorageClass,
  StorageConnection,
  StringFormat,
  StringKind,
  TransmissionDirection,
  TypeDescriptions,
  Volatility,
} from "../../src/typesystem/descriptions";
import {
  InternalCodes,
  TypeSystemCodes,
} from "../../src/validation/internal-codes";
import { LspCodes } from "../../src/validation/lsp-codes";
import { PLICode, PLICodes } from "../../src/validation/pli-codes";
import {
  ExpectedCompletion,
  Label,
  TestBuilder,
  DiagnosticExpectation,
  TestDiagnostic,
} from "../test-builder";
import {
  SemanticTokenModifiers,
  SemanticTokenTypes,
} from "../../src/language-server/semantic-tokens";

export type SemanticTokenTypesValues = keyof typeof SemanticTokenTypes;
export type SemanticTokenModifiersValues =
  | keyof typeof SemanticTokenModifiers
  | "none";

export type CompilerOptions = PliCompilerOptions & {
  macroOptions: MacroCompilerOptions;
  sqlOptions: SQLCompilerOptions;
  cicsOptions: CICSCompilerOptions;
};

export type Not<T> = Omit<T, "not">;

type ExpectedDimension = {
  dimension?: {
    lowerBound: Partial<Bound>;
    upperBound: Partial<Bound>;
  }[];
};

type EditComputedAttributes<T extends TypeDescriptions.Any> = Omit<
  T,
  "dimension"
> &
  ExpectedDimension;
export type PrimitiveTypeExpectation =
  | EditComputedAttributes<TypeDescriptions.Area>
  | EditComputedAttributes<TypeDescriptions.Arithmetic>
  | EditComputedAttributes<TypeDescriptions.File>
  | EditComputedAttributes<TypeDescriptions.Format>
  | EditComputedAttributes<TypeDescriptions.Label>
  | EditComputedAttributes<TypeDescriptions.Locator>
  | EditComputedAttributes<TypeDescriptions.Entry>
  | EditComputedAttributes<TypeDescriptions.Ordinal>
  | EditComputedAttributes<TypeDescriptions.Picture>
  | EditComputedAttributes<TypeDescriptions.String>
  | EditComputedAttributes<TypeDescriptions.Task>
  | EditComputedAttributes<TypeDescriptions.Unknown>;
export type TypeExpectation =
  | Partial<PrimitiveTypeExpectation>
  | ({
      type: DataType.Structure;
      members: Record<string, TypeExpectation>;
    } & ExpectedDimension)
  | ({
      type: DataType.Union;
      members: Record<string, TypeExpectation>;
    } & ExpectedDimension);

export interface HarnessTesterInterface {
  Syntax: typeof SyntaxKind;
  testAPI: {
    /**
     * Expose the test builder.
     */
    testBuilder: TestBuilder;
  };

  types: {
    expectTypeAt(label: Label, expectedType: TypeExpectation): void;
    dataTypes: typeof DataType;

    accessModes: typeof AccessMode;
    alignments: typeof Alignments;
    assignabilities: typeof Assignability;
    bases: typeof Base;
    bufferModes: typeof BufferMode;
    connections: typeof StorageConnection;
    endianesses: typeof Endianess;
    fileUsages: typeof FileUsage;
    floatFormats: typeof FloatFormat;
    //TODO locator types
    modes: typeof NumberMode;
    //TODO ordinal names
    pictureWidenesses: typeof PictureWideness;
    //TODO positions
    scales: typeof ScaleMode;
    precision: typeof Precisions;
    scopes: typeof Scopes;
    signs: typeof Sign;
    storageClasses: typeof StorageClass;
    stringFormats: typeof StringFormat;
    stringKinds: typeof StringKind;
    transmissionDirections: typeof TransmissionDirection;
    volatilities: typeof Volatility;
  };

  languages: {
    Pli: string;
    Db2Sql: string;
    Cics: string;
  };

  verify: {
    /**
     * Expect that the given label has _only_ the given error codes.
     * @param label The label to expect the error codes at.
     * @param codes The only error codes to expect.
     */
    expectExclusiveErrorCodesAt(
      label: Label,
      codes: string[] | string | PLICode | PLICode[],
    ): void;
    /**
     * Expect that the given label has the given error codes.
     * @param label The label to expect the error codes at.
     * @param codes The error codes to expect.
     */
    expectErrorCodesAt(
      label: Label,
      codes: string[] | string | PLICode | PLICode[],
    ): void;
    /**
     * Expect that the given label has _only_ the given diagnostics.
     * @param label The label to expect the diagnostics at.
     * @param diagnostics The only diagnostics to expect. Message field can be a string or RegExp for flexible matching.
     */
    expectExclusiveDiagnosticsAt(
      label: Label,
      diagnostics: DiagnosticExpectation,
    ): void;
    /**
     * Expect that the given label has the given diagnostics.
     * @param label The label to expect the diagnostics at.
     * @param diagnostics The diagnostics to expect. Message field can be a string or RegExp for flexible matching.
     */
    expectDiagnosticsAt(label: Label, diagnostics: DiagnosticExpectation): void;
    /**
     * Expect that there are no code actions at the given label.
     * @param label The label to expect no code actions at.
     */
    noCodeActions(label: Label): Promise<void>;
    /**
     * Expect that the compilation unit has no diagnostics.
     *
     * @param label The label to expect no diagnostics at. If not provided, all diagnostics are expected to be absent.
     * @param errorCodes A subset of error codes to expect no diagnostics for.
     * @example
     *
     * ```ts
     * verify.noDiagnostics();
     * verify.noDiagnostics('i');
     * verify.noDiagnostics(undefined, ...code.TypeSystem);
     * verify.noDiagnostics('i', ...code.TypeSystem);
     * ```
     */
    noDiagnostics(label?: Label, ...errorCodes: PLICode[]): void;

    /**
     * Expect that the compilation unit has no parser diagnostics.
     */
    noParserDiagnostics(): void;

    /**
     * Expect that the compilation unit has no parser errors.
     * Warnings and info diagnostics are allowed.
     */
    noParserErrors(): void;

    /**
     * Expect that the compilation unit has no linking diagnostics.
     */
    noLinkingDiagnostics(): void;

    /**
     * Expect that the compilation unit has no diagnostics from the given language.
     * @param languages The languages to expect no diagnostics from.
     */
    noDiagnosticsFrom(...languages: string[]): void;

    /**
     * Expect that the compilation unit has no diagnostics apart from the given regexes.
     * @param regexes The regexes to expect no diagnostics apart from.
     */
    noDiagnosticsExcept(regexes: RegExp[] | string[] | PLICode[]): void;
    noDiagnosticsExceptAt(
      label: Label,
      regexes: RegExp[] | string[] | PLICode[],
    ): void;

    /**
     * Expect that the given function throws an error.
     *
     * @param fn The function that should throw an error.
     * @param messageToThrow The message that the function is expected to throw.
     * @example
     * ```ts
     * verify.expectToThrow(() => testAPI.testBuilder.checkDiagnosticsURIs());
     * ```
     */
    expectToThrow(fn: () => void, messageToThrow?: string): void;

    /**
     * Expect that the compiler options are set to the given options.
     * @param expectedOptions The expected compiler options.
     */
    expectCompilerOptions(expectedOptions: Partial<CompilerOptions>): void;

    /**
     * TODO: Fix the type of statements. This isn't trivial, since we transform the actual AST before comparing it.
     * Expect that the parsed AST matches the given statements.
     * @param statements The expected statements.
     */
    expectAst(...statements: any[]): void;

    /**
     * Expect that the parsed preprocessor AST matches the given statements.
     * @param statements The expected statements.
     */
    expectPPAst(...statements: any[]): void;

    /**
     * Expect that a code action with the given label and resulting in the given code after applying the code action exists at the given label.
     * @param label The label to expect the code action at.
     * @param expectedActionLabel The expected label of the code action.
     * @param expectedCodeAfter The expected code after applying the code action.
     */
    expectCodeActionAt(
      label: Label,
      expectedActionLabel: string,
      expectedCodeAfter: string,
    ): Promise<void>;

    /**
     * Expect that the number of code actions at the given label is the given count.
     * @param label The label to expect the code actions at.
     * @param count The expected number of code actions.
     */
    expectCodeActionCountAt(label: Label, count: number): Promise<void>;
  };

  linker: {
    /**
     * Expect that the defined links actually links to the correct target.
     */
    expectLinks(): void;
    /**
     * Expect that the defined links do not link to the given label.
     * @param label The label to expect no links at.
     */
    expectNoLinksAt(label: Label): void;
  };

  hover: {
    /**
     * Expect that the hover at the given label is the given markdown.
     *
     * @param label The label to expect the hover at.
     * @param markdown The expected hover markdown.
     */
    expectMarkdownAt(label: Label, markdown: string): void;
    /**
     * Expect that the hover at the given label is the given text.
     *
     * @param label The label to expect the hover at.
     * @param text The expected hover text.
     */
    expectTextAt(label: Label, text: string): void;
    /**
     * Format the given text as a code block.
     * @param text The text to format as a code block.
     * @returns The formatted text.
     *
     * @example
     * hover.codeBlock("DCL A;") === "```pli\nDCL A;\n```\n"
     */
    codeBlock(text: string): string;
    /**
     * Format the given include directive as a code block.
     * @param type The type of the include directive.
     * @param filePath The file path of the included file.
     * @param content The content of the included file.
     * @returns The formatted include directive.
     */
    include(type: string, filePath: string, content: string): string;
  };

  signatureHelp: {
    /**
     * Expect that there is no signature help at the given label.
     * @param label The label to expect no signature help at.
     */
    expectNoHelp(label: Label): void;
    /**
     * Expect that the signature help at the given label is the given markdown.
     *
     * @param label The label to expect the signature help at.
     * @param markdown The expected signature help markdown.
     */
    expectMarkdownSignatureAt(label: Label, markdown: string): void;
    /**
     * Expect that the parameter help at the given label is the given text.
     * @param label The label to expect the parameter help at.
     * @param markdown The expected parameter help markdown.
     */
    expectMarkdownParameterAt(label: Label, markdown: string): void;
    /**
     * Expect that the active parameter index at the given label is the given index.
     * @param label The label to expect the active parameter index at.
     * @param index The expected active parameter index.
     */
    expectParameterIndexAt(label: Label, index: number): void;
  };

  completion: {
    /**
     * Expect that the completion items at the given label contains the given content.
     *
     * @param label The label to expect the completion items at.
     * @param expected The expected completion items.
     */
    expectAt(label: Label, expected: ExpectedCompletion): void;
  };

  semanticTokens: {
    /**
     * Expect that the semantic tokens at the given label are the given token type.
     * @param label The label to expect the semantic tokens at.
     */
    expectAt(label: SemanticTokenTypesValues): void;
    /**
     * Expect that the semantic tokens at the given label are the given token type.
     * @param label The label to expect the semantic tokens at.
     * @param tokenType The token type to expect.
     */
    expectAt(label: Label, tokenType: SemanticTokenTypesValues): void;
    /**
     * Expect that the semantic tokens at the given label have the given token modifier.
     * @param label The label to expect the semantic tokens at.
     */
    expectModifierAt(label: SemanticTokenModifiersValues): void;
    /**
     * Expect that the semantic tokens at the given label have the given token modifier.
     * @param label The label to expect the semantic tokens at.
     * @param modifier The token modifier to expect.
     */
    expectModifierAt(
      label: Label,
      modifier: SemanticTokenModifiersValues,
    ): void;
  };

  preprocessor: {
    not: Not<HarnessTesterInterface["preprocessor"]>;
    /**
     * Expect that the preprocessor produces the given text or tokens.
     * @param textOrTokens The text or tokens to expect.
     * If an array of strings is provided, it is treated as a list of tokens.
     * If a string is provided, it is piped through the lexer and the resulting tokens are expected.
     */
    expectTokens(textOrTokens: string | string[]): void;
    containsTokens(textOrTokens: string | string[]): void;
    /**
     * Expect that the code is skipped at the given range.
     * @param label The label to expect the skipped code at.
     */
    expectSkippedCodeAt(label: Label): void;
  };

  code: {
    Severe: typeof PLICodes.Severe;
    Warning: typeof PLICodes.Warning;
    Information: typeof PLICodes.Info;
    Error: typeof PLICodes.Error;
    Internal: typeof InternalCodes;
    LspCodes: typeof LspCodes;
    Lexer: {
      Margins: {
        ErrorLeft: typeof PliMarginsProcessor.MARGIN_ERROR_MESSAGE_LEFT;
        ErrorRight: typeof PliMarginsProcessor.MARGIN_ERROR_MESSAGE_RIGHT;
      };
    };
    LSP: typeof LspCodes;
    CompilerOptions: typeof CompilerOptionsCodes;
    TypeSystem: typeof TypeSystemCodes;
    Parser: {
      /**
       * Matches the generic parser recovery diagnostic ("Expected any of {...}, but
       * found ...") raised when the current token doesn't match any alternative in a
       * grammar rule.
       * @param tokenImage The raw image of the unexpected token (e.g. "EXEC").
       */
      unexpectedToken(tokenImage: string): TestDiagnostic;
    };
  };

  constants: {
    CompletionKeywords: typeof CompletionKeywords;
    Severity: typeof Severity;
    DefaultAttribute: typeof DefaultAttribute;
    CompilerOptions: typeof PliCompilerOptions & {
      Macro: typeof MacroCompilerOptions;
      SQL: typeof SQLCompilerOptions;
      CICS: typeof CICSCompilerOptions;
    };
  };
}
