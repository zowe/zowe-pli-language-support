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
import { LspCodes } from "../validation/lsp-codes";
import { PLICodes } from "../validation/pli-codes";
import {
  MappedToken,
  Segment,
  SourceMap,
  translateLocalTokens,
} from "./source-map";
import * as api from "preprocessor-api";

/** Converts an api-shaped `Severity` to the language package's own enum. */
function fromApiSeverity(severity: api.Severity): Severity {
  switch (severity) {
    case api.Severity.Error:
      return Severity.E;
    case api.Severity.Warning:
      return Severity.W;
    case api.Severity.Info:
      return Severity.I;
  }
}

/**
 * Converts an api-shaped `Diagnostic` to the language one. Api `endOffset`s are
 * ANTLR-style *inclusive*, the language `Range.end` is exclusive - hence the `+ 1`.
 * `source` is the invoking preprocessor's name (attribution is host-side).
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
    range: { start: diagnostic.startOffset, end: diagnostic.endOffset + 1 },
  };
}

function isApiToken(token: MappedToken | api.Token): token is api.Token {
  return "semanticsKind" in token;
}

/**
 * Locates `image` as a whole word in `text`, starting at `from` - how the host finds a
 * re-embedded identifier inside a replacement text (the preprocessor contract is that
 * identifiers appear verbatim, in token-list order - see `buildExecReplacement`).
 */
function findEmbeddedImage(text: string, image: string, from: number): number {
  // PL/I identifiers allow `#`, `@` and `$` in addition to `\w` - a plain `\w` boundary
  // check would let image `VAR` match inside `VAR#X`.
  const identifierChar = /[A-Za-z0-9_#@$]/;
  let index = text.indexOf(image, from);
  while (index !== -1) {
    const before = text[index - 1];
    const after = text[index + image.length];
    if (
      (!before || !identifierChar.test(before)) &&
      (!after || !identifierChar.test(after))
    ) {
      return index;
    }
    index = text.indexOf(image, index + 1);
  }
  return -1;
}

/**
 * The name parts of a (possibly qualified) host-variable image: `A.B` yields `A` and `B`
 * with their offsets inside the image. The final lex splits a qualified name at each `.`,
 * so every part needs its own `MappedToken` for exact-span matching to fire.
 */
function splitQualifiedImage(
  image: string,
): { image: string; offset: number }[] {
  if (!image.includes(".")) {
    return [{ image, offset: 0 }];
  }
  const parts: { image: string; offset: number }[] = [];
  let offset = 0;
  for (const part of image.split(".")) {
    if (part.length > 0) {
      parts.push({ image: part, offset });
    }
    offset += part.length + 1;
  }
  return parts;
}

/**
 * A single `replace`/`insert` edit, recorded against the context's input text and applied
 * when {@link PreprocessorContext.build} runs. `tokens`, if given, are *local* to `text`
 * (0-based offsets into the replacement string) - `build()` translates them into their
 * final position in the generated text.
 */
interface Edit {
  start: number;
  end: number;
  text: string;
  tokens?: MappedToken[];
  /**
   * The full classified api token list recorded with this edit (host coordinates), when
   * the caller was a preprocessor - the metadata `collectExecMetadata` (exec-phase.ts)
   * builds the statement's LSP-facing tokens and the include AST from.
   */
  apiTokens?: api.Token[];
  /**
   * Which `MappedToken` each re-embedded `apiTokens` identifier became.
   * `collectExecMetadata` sets each pair's `mapped.sourceToken` from the PL/I token it
   * builds for the same api token, so host-variable go-to-definition lands on real
   * source positions.
   */
  identifierPairs?: { apiToken: api.Token; mapped: MappedToken }[];
  /**
   * Set by `insertContext` instead of `text`/`tokens`: splices a nested context's
   * already-built result in as `foreign` spans. Always a zero-width edit.
   */
  subResult?: PreprocessorContextResult;
}

/**
 * One recorded `resolveInclude` call: `uri` is present iff resolution succeeded.
 * `exec-phase.ts` builds the `EXEC SQL INCLUDE` AST node from this (matched by `range`).
 */
export interface IncludeAttempt {
  name: string;
  range?: Range;
  uri?: URI;
}

export interface PreprocessorContextResult {
  text: string;
  sourceMap: SourceMap;
  diagnostics: Diagnostic[];
}

/** Passed to a context's `onProcess` callback when the context was created by `resolveInclude`. */
export interface NestedContextInfo {
  /** The context whose `resolveInclude` created this one. */
  parent: PreprocessorContext;
  /** The include statement's range in `parent`'s text, when the caller provided one. */
  includeRange?: Range;
  /** The included file's own text document. */
  document?: TextDocument;
}

/**
 * The shared text-editing API preprocessors (other than MACRO, which keeps its own
 * token-based API) use to turn their input text into
 * output text plus a `SourceMap` back to the original source.
 *
 * Usage: call `replace`/`insert` any number of times (in any order - they are sorted by
 * offset in `build()`), then call `build()` once to get the generated text and source map.
 * A context is single-use: create a new one per phase invocation.
 */
export class PreprocessorContext implements api.PreprocessorContext {
  private readonly edits: Edit[] = [];
  private readonly diagnosticsList: Diagnostic[] = [];
  private readonly includeAttempts: IncludeAttempt[] = [];

  constructor(
    readonly file: URI,
    private readonly inputText: string,
    readonly unit: CompilationUnit,
    readonly entryUri: URI,
    /**
     * Runs against every context `resolveInclude` produces (including nested ones), so an
     * included file's own `EXEC`/directive statements are turned into edits *before* the
     * caller splices its result in via `insertContext`. Supplied by the phase (see
     * `exec-phase.ts`) - this class itself has no notion of statements or phases.
     */
    private readonly onProcess?: (
      context: PreprocessorContext,
      nested?: NestedContextInfo,
    ) => Promise<void>,
    /**
     * Prepares an included file's raw text before it seeds a nested context - the same
     * length-preserving margins-blanking + comment-stripping the pipeline applies to the
     * entry file. Without it, a copybook's sequence-number columns and comments would
     * reach the raw-text `EXEC` scan verbatim.
     */
    private readonly prepareText?: (text: string, uri: URI) => string,
    /**
     * The invoking preprocessor's name, stamped as `source` onto every api-shaped
     * diagnostic pushed into this context.
     */
    private readonly diagnosticSource?: string,
    /**
     * The uris of the *ancestor* contexts this one was created from via `resolveInclude`.
     * Used to refuse recursive includes without forbidding legal repeated *sibling*
     * includes of the same file.
     */
    private readonly includeChain: readonly string[] = [],
  ) {}

  /** This context's input text (the phase's own text, or a nested include's raw text). */
  get text(): string {
    return this.inputText;
  }

  /**
   * The `replace`/`insert` edits recorded so far (offsets into this context's input
   * text). `collectExecMetadata` builds each `EXEC` statement's LSP-facing metadata from
   * their recorded api tokens.
   */
  getEdits(): readonly Pick<
    Edit,
    "start" | "end" | "apiTokens" | "identifierPairs"
  >[] {
    return this.edits;
  }

  /** The `resolveInclude` calls recorded so far - see {@link IncludeAttempt}. */
  getIncludeAttempts(): readonly IncludeAttempt[] {
    return this.includeAttempts;
  }

  pushDiagnostic(diagnostic: Diagnostic | api.Diagnostic): void {
    // Only the api shape carries `startOffset`.
    this.diagnosticsList.push(
      "startOffset" in diagnostic
        ? fromApiDiagnostic(diagnostic, this.file, this.diagnosticSource)
        : diagnostic,
    );
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
   * Records one edit. Api tokens are kept as-is, and each Identifier among them that was
   * re-embedded in `text` additionally becomes a `MappedToken` local to `text`; plain
   * `MappedToken` inputs pass through unchanged.
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
    const identifierPairs: { apiToken: api.Token; mapped: MappedToken }[] = [];
    let cursor = 0;
    for (const token of tokens) {
      if (!isApiToken(token)) {
        mapped.push(token);
        continue;
      }
      apiTokens.push(token);
      if (token.semanticsKind !== api.SemanticsKind.Identifier) {
        continue;
      }
      const local = findEmbeddedImage(text, token.image, cursor);
      if (local === -1) {
        continue;
      }
      cursor = local + token.image.length;
      // One MappedToken (and pair) per name part, in part order - `collectExecMetadata`
      // zips them against its per-part tokens.
      for (const part of splitQualifiedImage(token.image)) {
        const mappedToken: MappedToken = {
          name: part.image,
          startOffset: local + part.offset,
          endOffset: local + part.offset + part.image.length - 1,
          originalImage: part.image,
        };
        mapped.push(mappedToken);
        identifierPairs.push({ apiToken: token, mapped: mappedToken });
      }
    }
    return {
      start,
      end,
      text,
      tokens: mapped.length > 0 ? mapped : undefined,
      apiTokens: apiTokens.length > 0 ? apiTokens : undefined,
      identifierPairs: identifierPairs.length > 0 ? identifierPairs : undefined,
    };
  }

  /**
   * Splices another context's already-built result in at `offset` (a zero-width edit),
   * preserving that context's own positions as `foreign` segments rather than collapsing
   * it to a single opaque block. Its diagnostics are merged into this context's own,
   * keeping their ranges in the nested file's own coordinate space.
   */
  insertContext(offset: number, nested: api.PreprocessorContext): void {
    // `resolveInclude` - the only source of nested contexts - always returns this
    // concrete class; guard explicitly instead of blindly casting.
    if (!(nested instanceof PreprocessorContext)) {
      throw new Error(
        "insertContext only accepts contexts returned by resolveInclude",
      );
    }
    const result = nested.build();
    this.edits.push({
      start: offset,
      end: offset,
      text: "",
      subResult: result,
    });
  }

  /**
   * Resolves an include name via the shared include resolver and returns a fresh context
   * seeded with the resolved file's text (already run through `onProcess`), or
   * `undefined` if resolution failed. Resolution diagnostics land in this context's own
   * sink either way.
   */
  async resolveInclude(
    name: string,
    range?: Range,
  ): Promise<PreprocessorContext | undefined> {
    const item: FileIncludeItem = {
      fileName: name,
      token: null,
      idempotent: false,
      sql: true,
    };
    const resolverContext: IncludeResolverContext = {
      unit: this.unit,
      currentUri: this.file,
      entryUri: this.entryUri,
      diagnostics: this.diagnosticsList,
    };
    const uri = await resolveIncludeFileUri(item, resolverContext);
    // Refuse recursive includes, which would recurse without bound. Deliberately checks
    // the *ancestor chain*, not a global visited set - including the same file twice as
    // siblings is legal. Mirrors the macro `%INCLUDE` path's diagnostic.
    const chain = [...this.includeChain, this.file.toString()];
    const recursive = uri !== undefined && chain.includes(uri.toString());
    const resolvedUri = recursive ? undefined : uri;
    this.includeAttempts.push({ name, range, uri: resolvedUri });
    if (!resolvedUri) {
      this.pushUnresolvedIncludeDiagnostic(name, range);
      return undefined;
    }
    const document = await TextDocuments.get(resolvedUri);
    const rawText = document?.getText() ?? "";
    const nested = new PreprocessorContext(
      resolvedUri,
      this.prepareText ? this.prepareText(rawText, resolvedUri) : rawText,
      this.unit,
      this.entryUri,
      this.onProcess,
      this.prepareText,
      this.diagnosticSource,
      chain,
    );
    await this.onProcess?.(nested, {
      parent: this,
      includeRange: range,
      document,
    });
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
      entryUri: this.entryUri.toString(),
    };
    this.unit.includeError = true;
    this.pushDiagnostic(diagnostic);
  }

  /**
   * Applies the recorded edits and produces the generated text plus a `SourceMap` back to
   * this context's input. Single linear pass over the (sorted) edits.
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

      if (edit.subResult) {
        // Splice the nested context's own segments in as-is, shifted and forced
        // `foreign` - they carry real positions in a different file.
        for (const nestedSegment of edit.subResult.sourceMap.getSegments()) {
          segments.push({
            ...nestedSegment,
            genStart: genCursor + nestedSegment.genStart,
            genEnd: genCursor + nestedSegment.genEnd,
            foreign: true,
          });
        }
        // Nested diagnostics keep their ranges: offsets into the included file's own
        // text, which is the space they should be reported in.
        largePush(nestedDiagnostics, edit.subResult.diagnostics);
        chunks.push(edit.subResult.text);
        genCursor += edit.subResult.text.length;
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
