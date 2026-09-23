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

import { TextDocument } from "vscode-languageserver-textdocument";
import { CancellationToken } from "vscode-languageserver";
import {
  FileIncludeItem,
  IncludeResolverContext,
  resolveIncludeFileUri,
} from "./include-resolver";
import { TextDocuments } from "../language-server/text-documents";
import {
  Diagnostic,
  diagnosticFromCode,
  diagnosticFromCodeAtRange,
  Range,
  Severity,
} from "../language-server/types";
import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";
import { largePush } from "../utils/collections";
import { interruptAndCheck } from "../utils/promises";
import { LspCodes } from "../validation/lsp-codes";
import { PLICodes } from "../validation/pli-codes";
import {
  MappedToken,
  Segment,
  SourceMap,
  translateLocalTokens,
} from "./source-map";
import * as api from "preprocessor-api";
import { createTokenInstance, DO, Token as PliToken } from "../parser/tokens";

/** Converts an api-shaped `Severity` to the language package's own enum. */
function fromApiSeverity(severity: api.Severity): Severity {
  switch (severity) {
    case api.Severity.Error:
      return Severity.E;
    case api.Severity.Warning:
      return Severity.W;
    case api.Severity.Info:
      return Severity.I;
    case api.Severity.Severe:
      return Severity.S;
  }
}

/**
 * Converts an api-shaped `Diagnostic` to the language one (both use exclusive `end`
 * offsets). `source` is the invoking preprocessor's name (attribution is host-side).
 */
function fromApiDiagnostic(
  diagnostic: api.Diagnostic,
  uri: URI,
  source?: string,
): Diagnostic {
  return {
    severity: fromApiSeverity(diagnostic.severity),
    message: diagnostic.message,
    code: diagnostic.code,
    source,
    uri: uri.toString(),
    range: diagnostic.range,
  };
}

function isApiToken(token: MappedToken | api.Token): token is api.Token {
  return "semanticsKind" in token;
}

/**
 * A single `replace`/`insert` edit, recorded against the context's input text and applied
 * when {@link PreprocessorContext.build} runs.
 */
interface Edit {
  start: number;
  end: number;
  text: string;
  tokens?: MappedToken[];
  apiTokens?: api.Token[];
  anchor?: PliToken;
  nested?: PreprocessorContext;
}

export interface IncludeAttempt {
  name: string;
  range?: Range;
  uri?: URI;
  context?: PreprocessorContext;
  document?: TextDocument;
}

export interface PreprocessorContextResult {
  text: string;
  sourceMap: SourceMap;
  diagnostics: Diagnostic[];
}

/**
 * The shared text-editing API preprocessors (other than MACRO, which keeps its own
 * token-based API) use to turn their input text into output text plus a `SourceMap`
 * back to the original source.
 */
export class PreprocessorContext implements api.PreprocessorContext {
  private readonly edits: Edit[] = [];
  private readonly diagnosticsList: Diagnostic[] = [];
  private readonly includeAttempts: IncludeAttempt[] = [];

  constructor(
    readonly file: URI,
    private readonly inputText: string,
    readonly unit: CompilationUnit,
    /**
     * Prepares an included file's raw text before it seeds a nested context.
     */
    private readonly prepareText?: (text: string, uri: URI) => string,
    /**
     * The invoking preprocessor's name, stamped as `source` onto every api-shaped
     * diagnostic pushed into this context.
     */
    private readonly diagnosticSource?: string,
    /**
     * Checked before every include resolution: processing a file is uninterruptible
     * once entered, so a superseded build is given up at least at file granularity.
     */
    private readonly cancellation?: CancellationToken,
    /**
     * The uris of the *ancestor* contexts this one was created from via `resolveInclude`.
     */
    private readonly includeChain: readonly string[] = [],
  ) {}

  /** This context's input text (the phase's own text, or a nested include's raw text). */
  get text(): string {
    return this.inputText;
  }

  /** The uri of the document `text` came from (an included file's own for a nested context). */
  get documentUri(): string {
    return this.file.toString();
  }

  /** The uri of the compilation unit's entry file. */
  get unitUri(): string {
    return this.unit.uri.toString();
  }

  /**
   * The `replace`/`insert` edits recorded so far (offsets into this context's input text).
   */
  getEdits(): readonly Pick<Edit, "start" | "end" | "apiTokens" | "anchor">[] {
    return this.edits;
  }

  /** The `resolveInclude` calls recorded so far - see {@link IncludeAttempt}. */
  getIncludeAttempts(): readonly IncludeAttempt[] {
    return this.includeAttempts;
  }

  pushDiagnostic(diagnostic: api.Diagnostic): void {
    this.diagnosticsList.push(
      fromApiDiagnostic(diagnostic, this.file, this.diagnosticSource),
    );
  }

  /** The language package's own diagnostics (tokenizer/parser output, include resolution). */
  pushHostDiagnostic(diagnostic: Diagnostic): void {
    this.diagnosticsList.push(diagnostic);
  }

  /** Replaces `range` (offsets into this context's input text) with `text`. */
  replace(
    range: Range,
    text: string,
    tokens?: (MappedToken | api.Token)[],
  ): void {
    this.edits.push(this.createEdit(range.start, range.end, text, tokens));
  }

  /** Inserts `text` at `offset` (a zero-width edit) into this context's input text. */
  insert(
    offset: number,
    text: string,
    tokens?: (MappedToken | api.Token)[],
  ): void {
    this.edits.push(this.createEdit(offset, offset, text, tokens));
  }

  /**
   * Records one edit.
   */
  private createEdit(
    start: number,
    end: number,
    text: string,
    tokens?: (MappedToken | api.Token)[],
  ): Edit {
    if (!tokens?.length) {
      return { start, end, text };
    }
    const mapped: MappedToken[] = [];
    const apiTokens: api.Token[] = [];
    for (const token of tokens) {
      if (isApiToken(token)) {
        apiTokens.push(token);
      } else {
        mapped.push(token);
      }
    }
    let anchor: PliToken | undefined;
    if (apiTokens.length > 0 && /^DO\b/i.test(text)) {
      anchor = createTokenInstance("DO", "DO", DO, start, end - 1, this.file);
      anchor.synthetic = true;
      mapped.push({
        name: "DO",
        startOffset: 0,
        endOffset: 1,
        originalImage: "DO",
        sourceToken: anchor,
      });
    }
    return {
      start,
      end,
      text,
      tokens: mapped.length > 0 ? mapped : undefined,
      apiTokens: apiTokens.length > 0 ? apiTokens : undefined,
      anchor,
    };
  }

  /**
   * Resolves `name` and splices the nested context's result in at `statementRange.start` as a
   * zero-width edit. The include statement itself is blanked whether or not resolution succeeded.
   * The returned context is unprocessed and built lazily.
   */
  async include(
    name: string,
    statementRange: Range,
    nameRange: Range,
    tokens?: (MappedToken | api.Token)[],
  ): Promise<PreprocessorContext | undefined> {
    const nested = await this.resolveInclude(name, statementRange, nameRange);
    if (nested) {
      this.edits.push({
        start: statementRange.start,
        end: statementRange.start,
        text: "",
        nested,
      });
    }
    this.replace(statementRange, "", tokens);
    return nested;
  }

  /**
   * Resolves an include name via the shared include resolver and returns a fresh context seeded
   * with the resolved file's prepared text, or `undefined` if resolution failed.
   */
  async resolveInclude(
    name: string,
    statementRange?: Range,
    nameRange?: Range,
  ): Promise<PreprocessorContext | undefined> {
    if (this.cancellation) {
      await interruptAndCheck(this.cancellation);
    }
    const item: FileIncludeItem = {
      fileName: name,
      token: null,
      idempotent: false,
      sql: true,
    };
    const resolverContext: IncludeResolverContext = {
      unit: this.unit,
      currentUri: this.file,
      entryUri: this.unit.uri,
      diagnostics: this.diagnosticsList,
    };
    const uri = await resolveIncludeFileUri(item, resolverContext);
    // Refuse recursive includes, which would recurse without bound. Deliberately checks
    // the *ancestor chain*, not a global visited set - including the same file twice as
    // siblings is legal. Mirrors the macro `%INCLUDE` path's diagnostic.
    const chain = [...this.includeChain, this.file.toString()];
    const recursive = uri !== undefined && chain.includes(uri.toString());
    const resolvedUri = recursive ? undefined : uri;
    const attempt: IncludeAttempt = {
      name,
      range: statementRange,
      uri: resolvedUri,
    };
    this.includeAttempts.push(attempt);
    if (!resolvedUri) {
      this.pushUnresolvedIncludeDiagnostic(name, nameRange ?? statementRange);
      return undefined;
    }
    const document = await TextDocuments.get(resolvedUri);
    const rawText = document?.getText() ?? "";
    const nested = new PreprocessorContext(
      resolvedUri,
      this.prepareText ? this.prepareText(rawText, resolvedUri) : rawText,
      this.unit,
      this.prepareText,
      this.diagnosticSource,
      this.cancellation,
      chain,
    );
    attempt.context = nested;
    attempt.document = document;
    return nested;
  }

  /** Mirrors the diagnostic the MACRO preprocessor's include handling raises on failure. */
  private pushUnresolvedIncludeDiagnostic(name: string, range?: Range): void {
    const missingConfiguration =
      !this.unit.processGroup && !this.unit.programConfig;
    // Without a range the diagnostic has no position and `DiagnosticsStore` drops it -
    // anchor it to the include statement whenever the caller told us where that is.
    let diagnostic: Diagnostic;
    if (missingConfiguration) {
      const code = LspCodes.IncludeResolution.MissingConfiguration;
      diagnostic = range
        ? diagnosticFromCodeAtRange(code, this.file.toString(), range)
        : diagnosticFromCode(code, null);
    } else {
      const code = PLICodes.Severe.IBM1848I;
      diagnostic = range
        ? diagnosticFromCodeAtRange(code, this.file.toString(), range, name)
        : diagnosticFromCode(code, null, name);
    }
    diagnostic.data = {
      unresolvedFile: name,
      entryUri: this.unit.uri.toString(),
    };
    this.unit.includeError = true;
    this.pushHostDiagnostic(diagnostic);
  }

  /**
   * Applies the recorded edits and produces the generated text plus a `SourceMap` back to this
   * context's input.
   */
  build(): PreprocessorContextResult {
    const sortedEdits = [...this.edits].sort(
      (a, b) =>
        a.start - b.start ||
        // Zero-width edits sort before a consuming edit at the same offset, so an insert
        // "before" a replaced range never trips the overlap guard below.
        a.end - a.start - (b.end - b.start),
    );
    const segments: Segment[] = [];
    const chunks: string[] = [];
    const nestedDiagnostics: Diagnostic[] = [];
    let origCursor = 0;
    let genCursor = 0;

    for (const edit of sortedEdits) {
      if (edit.start < origCursor) {
        // Edits come from external preprocessor plugins - drop the conflicting edit with
        // a diagnostic instead of throwing (which would kill the whole tokenization).
        this.diagnosticsList.push({
          severity: Severity.E,
          message:
            `Overlapping preprocessor edit dropped at offset ${edit.start} ` +
            `(a previous edit already covers up to offset ${origCursor})`,
          source: this.diagnosticSource,
          uri: this.file.toString(),
          range: { start: edit.start, end: edit.end },
        });
        continue;
      }

      const gapLength = edit.start - origCursor;
      if (gapLength > 0) {
        chunks.push(this.text.slice(origCursor, edit.start));
        segments.push({
          origStart: origCursor,
          origEnd: edit.start,
          genStart: genCursor,
          genEnd: genCursor + gapLength,
          uri: this.file,
          verbatim: true,
        });
        genCursor += gapLength;
      }

      if (edit.nested) {
        const subResult = edit.nested.build();
        // Splice the nested context's own segments in as-is, shifted and forced
        // `foreign` - they carry real positions in a different file.
        for (const nestedSegment of subResult.sourceMap.getSegments()) {
          segments.push({
            ...nestedSegment,
            genStart: genCursor + nestedSegment.genStart,
            genEnd: genCursor + nestedSegment.genEnd,
            foreign: true,
          });
        }
        // Nested diagnostics keep their ranges: offsets into the included file's own
        // text, which is the space they should be reported in.
        largePush(nestedDiagnostics, subResult.diagnostics);
        chunks.push(subResult.text);
        genCursor += subResult.text.length;
      } else {
        chunks.push(edit.text);
        segments.push({
          origStart: edit.start,
          origEnd: edit.end,
          genStart: genCursor,
          genEnd: genCursor + edit.text.length,
          uri: this.file,
          verbatim: false,
          tokens: translateLocalTokens(edit.tokens, genCursor),
        });
        genCursor += edit.text.length;
      }
      origCursor = edit.end;
    }

    const tailLength = this.text.length - origCursor;
    if (tailLength > 0) {
      chunks.push(this.text.slice(origCursor));
      segments.push({
        origStart: origCursor,
        origEnd: this.text.length,
        genStart: genCursor,
        genEnd: genCursor + tailLength,
        uri: this.file,
        verbatim: true,
      });
    }

    if (segments.length === 0) {
      // Empty input and no edits: keep a zero-length segment so offset 0 still resolves.
      segments.push({
        origStart: 0,
        origEnd: 0,
        genStart: 0,
        genEnd: 0,
        uri: this.file,
        verbatim: true,
      });
    }

    return {
      text: chunks.join(""),
      sourceMap: SourceMap.fromSegments(segments),
      diagnostics: [...this.diagnosticsList, ...nestedDiagnostics],
    };
  }
}
