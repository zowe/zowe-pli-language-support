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
import { Diagnostic } from "../../src/language-server/types";
import { ExpectedCompletion, Label, TestBuilder } from "../test-builder";
import { type Severity } from "../../src/language-server/types";
import { SemanticTokenTypes } from "vscode-languageserver-types";
import { PliMarginsProcessor } from "../../src/preprocessor/pli-margins-processor";
import { CompilerOptionsCodes } from "../../src/preprocessor/compiler-options/codes";
import { CompilerOptions } from "../../src/preprocessor/compiler-options/options";
import {
  InternalCodes,
  TypeSystemCodes,
} from "../../src/validation/internal-codes";
import { PLICode, PLICodes } from "../../src/validation/pli-codes";
import { SyntaxKind } from "../../src/syntax-tree/ast";
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

type SemanticTokenTypesValues = `${SemanticTokenTypes}`;

export type Not<T> = Omit<T, "not">;

type EditComputedAttributes<T extends TypeDescriptions.Any> = Omit<T, "dimension"> & {
  dimension: {
    lowerBound: Partial<Bound>;
    upperBound: Partial<Bound>;
  }[] | undefined;
};
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
  ;
export type TypeExpectation =
  | Partial<PrimitiveTypeExpectation>
  | Partial<TypeDescriptions.Unknown>
  | {
    type: DataType.Structure;
    members: Record<string, TypeExpectation>;
  };

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
     * @param diagnostics The only diagnostics to expect.
     */
    expectExclusiveDiagnosticsAt(
      label: Label,
      diagnostics:
        | Partial<Diagnostic>
        | Partial<Diagnostic>[]
        | PLICode
        | PLICode[],
    ): void;
    /**
     * Expect that the given label has the given diagnostics.
     * @param label The label to expect the diagnostics at.
     * @param diagnostics The diagnostics to expect.
     */
    expectDiagnosticsAt(
      label: Label,
      diagnostics:
        | Partial<Diagnostic>
        | Partial<Diagnostic>[]
        | PLICode
        | PLICode[],
    ): void;
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
    Lexer: {
      Margins: {
        ErrorLeft: typeof PliMarginsProcessor.MARGIN_ERROR_MESSAGE_LEFT;
        ErrorRight: typeof PliMarginsProcessor.MARGIN_ERROR_MESSAGE_RIGHT;
      };
    };
    CompilerOptions: typeof CompilerOptionsCodes;
    TypeSystem: typeof TypeSystemCodes;
  };

  constants: {
    CompletionKeywords: typeof CompletionKeywords;
    Severity: typeof Severity;
  };
}
