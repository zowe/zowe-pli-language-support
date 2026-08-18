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
  Preprocessor,
  SemanticsKind,
  Token as ApiToken,
} from "preprocessor-api";
import { CICSPreprocessor, HostLanguageType } from "preprocessor-cics";
import { Db2SqlPreprocessor } from "preprocessor-db2";
import { preprocessorParse, StatementParser } from "../parser/parser-entry";
import { ParserState } from "../parser/parser-state";
import {
  cicsResponseStatement,
  isCicsResponseStatement,
} from "../parser/cics-response-parser";
import { SemanticTokenTypes } from "../language-server/semantic-tokens";
import { recursivelySetContainer } from "../linking/symbol-table";
import {
  isSqlAttributeStatement,
  sqlAttributeStatement,
} from "../parser/sql-attribute-parser";
import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import * as t from "../parser/tokens";
import { tokenize } from "../parser/tokenizer";
import { URI, UriUtils } from "../utils/uri";
import { diagnosticFromCode } from "../language-server/types";
import { CompilerOptionsCodes } from "./compiler-options/codes";
import { CompilerOptionResult } from "./compiler-options/options";
import { rightmostIndexLE } from "../utils/search";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { MarginsProcessor } from "./pli-margins-processor";
import { commentRangesToTokens, stripComments } from "./comment-stripper";
import {
  passthroughPhaseResult,
  PhaseInput,
  PhaseResult,
  PreprocessorPhase,
} from "./pp-phase";
import {
  IncludeAttempt,
  NestedContextInfo,
  PreprocessorContext,
} from "./preprocessor-context";
import { SourceMap } from "./source-map";
import { extractDirectiveTokens } from "./token-annotator";
import { largePush } from "../utils/collections";

/** `SQL TYPE IS BINARY/VARBINARY` real numeric ranges - see `computeLobLength`. */
const LOCATOR_TYPE = "FIXED BIN(31)";
const ROWID_TYPE = "CHAR(40) VARYING";
const LOB_FILE_TYPE = "LIKE SQL_LOB_FILE";
const LOB_TYPE = (length: number) => `LIKE SQL_LOB${length}`;

/**
 * Declarations `SQL TYPE IS LOB FILE`/`LOB(...)` need once per procedure. These aren't
 * documented anywhere - they were extracted from PL/I code after running it through the
 * real SQL preprocessor.
 */
const SQL_LOB_FILE_DECLS = `
    DCL
      1 SQL_LOB_FILE BASED,
        2 SQL_LOB_FILE_NAME_LEN FIXED BIN(31),
        2 SQL_LOB_FILE_DATA_LEN FIXED BIN(31),
        2 SQL_LOB_FILE_OPTIONS FIXED BIN(31),
        2 SQL_LOB_FILE_NAME CHAR(256);

    DCL SQL_FILE_READ      FIXED BIN(31) VALUE(2);
    DCL SQL_FILE_CREATE    FIXED BIN(31) VALUE(8);
    DCL SQL_FILE_OVERWRITE FIXED BIN(31) VALUE(16);
    DCL SQL_FILE_APPEND    FIXED BIN(31) VALUE(32);
  `;
const sqlLobDecls = (length: number) => `
    DCL
      1 SQL_LOB${length} BASED,
        2 SQL_LOB_LEN FIXED BIN(31),
        2 SQL_LOB_BUF(10) CHAR(1);
  `;
/**
 * The `DFH*` runtime declarations every `EXEC CICS`-using procedure needs - extracted from
 * PL/I code after running it through the real CICS preprocessor, except that `DFHEI0`'s
 * `OPTIONS(...)` is moved directly after `ENTRY VARIABLE` (attribute order is free in PL/I,
 * and the parser only understands the `OPTIONS` attribute in that position).
 */
const CICS_EXEC_DECLS = `
      DCL
        1 DFHCNSTS STATIC,
          2 DFHLDVER CHAR(22) INIT('LD TABLE DFHEITAB 730.'),
          2 DFHEIB0 FIXED BIN(15) INIT(0),
          2 DFHEID0 FIXED DEC(7) INIT(0),
          2 DFHEICB CHAR(8) INIT('        ');
      DCL DFHEPI ENTRY, DFHEIPTR PTR;
      DCL
        1 DFHEIBLK BASED (DFHEIPTR),
          2 EIBTIME  FIXED DEC(7),
          2 EIBDATE  FIXED DEC(7),
          2 EIBTRNID CHAR(4),
          2 EIBTASKN FIXED DEC(7),
          2 EIBTRMID CHAR(4),
          2 EIBFIL01 FIXED BIN(15),
          2 EIBCPOSN FIXED BIN(15),
          2 EIBCALEN FIXED BIN(15),
          2 EIBAID   CHAR(1),
          2 EIBFN    CHAR(2),
          2 EIBRCODE CHAR(6),
          2 EIBDS    CHAR(8),
          2 EIBREQID CHAR(8),
          2 EIBRSRCE CHAR(8),
          2 EIBSYNC  CHAR(1),
          2 EIBFREE  CHAR(1),
          2 EIBRECV  CHAR(1),
          2 EIBFIL02 CHAR(1),
          2 EIBATT   CHAR(1),
          2 EIBEOC   CHAR(1),
          2 EIBFMH   CHAR(1),
          2 EIBCOMPL CHAR(1),
          2 EIBSIG   CHAR(1),
          2 EIBCONF  CHAR(1),
          2 EIBERR   CHAR(1),
          2 EIBERRCD CHAR(4),
          2 EIBSYNRB CHAR(1),
          2 EIBNODAT CHAR(1),
          2 EIBRESP  FIXED BIN(31),
          2 EIBRESP2 FIXED BIN(31),
          2 EIBRLDBK CHAR(1);
      DCL
        1 DFHCNTBS  STATIC,
          2  DFHLDTBS CHAR(22) INIT('LD TABLE DFHEITBS 730.');
      DCL DFHDUMMY STATIC FIXED BIN(15) INIT(0);
      DCL DFHEI0 ENTRY VARIABLE OPTIONS(INTER ASSEMBLER) INIT(DFHEI01) AUTO;
      DCL DFHEI01 ENTRY OPTIONS(INTER ASSEMBLER);
`;

/**
 * Per-`process()` bookkeeping so LOB/LOB FILE/CICS declarations are inserted once per
 * procedure (keyed by that procedure's semicolon offset), not once per statement.
 * `declBlocks` accumulates blocks and is flushed *reversed* by `flushGenerationCache`,
 * matching the real preprocessor's output order.
 */
interface GenerationCache {
  hasCicsExec: boolean;
  hasSqlLobFile: boolean;
  sqlLobSizes: Set<number>;
  declBlocks: string[];
}

/**
 * One `process()` invocation's working state, linked to the frame of the context that
 * `resolveInclude`d it (if any) so statement handlers can find an enclosing procedure
 * *across* the include boundary - see `findEnclosingProc`.
 */
interface Frame {
  tokens: t.Token[];
  cache: Map<number, GenerationCache>;
  parent?: Frame;
  /** Offset of the include statement in the parent frame's text. */
  includeOffset?: number;
}

/** Where a statement's per-procedure declarations should be queued: which frame's cache, at what offset. */
interface ProcTarget {
  cache: Map<number, GenerationCache>;
  offset: number;
}

/**
 * Finds the enclosing procedure for the statement at `beforeIndex` in `frame`'s tokens.
 * A nested (`EXEC SQL INCLUDE`'d) context usually contains no `PROCEDURE` of its own
 * (DCLGEN-style copybooks), so the search continues at each parent frame's include site -
 * the returned target then names the *parent's* cache.
 */
function findEnclosingProc(
  frame: Frame,
  beforeIndex: number,
): ProcTarget | undefined {
  let current: Frame = frame;
  let index = beforeIndex;
  for (;;) {
    const offset = findProcSemicolonOffset(current.tokens, index);
    if (offset === "unterminated") {
      // A `PROCEDURE` exists in this file but its header never closes (broken source).
      // Give up instead of walking on: continuing at the parent would insert this file's
      // generated declarations into an *ancestor* file.
      return undefined;
    }
    if (offset !== undefined) {
      return { cache: current.cache, offset };
    }
    if (!current.parent || current.includeOffset === undefined) {
      return undefined;
    }
    // First parent token at or after the include site (the LE-dual, see rightmostIndexLE).
    index =
      rightmostIndexLE(
        current.parent.tokens,
        current.includeOffset - 1,
        (token) => token.startOffset,
      ) + 1;
    current = current.parent;
  }
}

function flushGenerationCache(
  context: PreprocessorContext,
  cache: Map<number, GenerationCache>,
): void {
  for (const [offset, entry] of cache) {
    if (entry.declBlocks.length > 0) {
      context.insert(offset, entry.declBlocks.slice().reverse().join(""));
    }
  }
}

/**
 * Finds the offset right after the nearest enclosing procedure's terminating `;`, scanning
 * backwards from `beforeIndex` for a `PROCEDURE` token and then forwards for the next `;`.
 * Returns `"unterminated"` when a `PROCEDURE` token was found but no `;` follows anywhere
 * in the file (a broken, never-closed header) - distinct from `undefined` (no `PROCEDURE`
 * at all), which lets `findEnclosingProc` continue the search in the including file.
 */
function findProcSemicolonOffset(
  tokens: t.Token[],
  beforeIndex: number,
): number | "unterminated" | undefined {
  for (let i = beforeIndex - 1; i >= 0; i--) {
    if (tokens[i].tokenTypeIdx === PreprocessorTokens.Procedure.tokenTypeIdx) {
      for (let j = i + 1; j < tokens.length; j++) {
        if (
          tokens[j].tokenTypeIdx === PreprocessorTokens.Semicolon.tokenTypeIdx
        ) {
          return tokens[j].endOffset + 1;
        }
      }
      return "unterminated";
    }
  }
  return undefined;
}

function computeLobLength(
  lob: ast.SqlAttributeLob | ast.SqlAttributeBinary,
): number {
  if (lob.length === null) {
    return 0;
  }
  let givenLength = lob.length;
  switch (lob.size) {
    case ast.SQLAttributeLobSize.G:
      givenLength *= 1024;
    // fallthrough
    case ast.SQLAttributeLobSize.M:
      givenLength *= 1024;
    // fallthrough
    case ast.SQLAttributeLobSize.K:
      givenLength *= 1024;
  }
  return givenLength;
}

/**
 * Recognizes `SQL TYPE IS ...` attribute declarations and replaces the clause with the type,
 * `insert`ing the LOB/LOB FILE declarations at the enclosing procedure's semicolon (once)
 * when needed.
 */
function createSqlAttributeHandler(
  context: PreprocessorContext,
  frame: Frame,
): StatementParser {
  return async (state) => {
    const startToken = state.token;
    if (!startToken || startToken.tokenTypeIdx !== t.SQL.tokenTypeIdx) {
      return undefined;
    }
    if (!isSqlAttributeStatement(state)) {
      return undefined;
    }
    const beforeIndex = state.index;
    const sqlAttrStmt = sqlAttributeStatement(state);
    const endToken = state.last;
    const sqlAttrStatement = ast.createStatement();
    sqlAttrStatement.value = sqlAttrStmt;

    const body = sqlAttrStmt.body;
    const range = {
      start: startToken.startOffset,
      end: (endToken ?? startToken).endOffset + 1,
    };
    if (
      body?.kind === ast.SyntaxKind.SqlAttributeLobLocator ||
      body?.kind === ast.SyntaxKind.SqlAttributeTableLocator ||
      body?.kind === ast.SyntaxKind.SqlAttributeResultSetLocator
    ) {
      context.replace(range, LOCATOR_TYPE);
    } else if (body?.kind === ast.SyntaxKind.SqlAttributeRowId) {
      context.replace(range, ROWID_TYPE);
    } else if (body?.kind === ast.SyntaxKind.SqlAttributeBinary) {
      const length = computeLobLength(body);
      const varAttribute =
        body.type === ast.SqlAttributeBinaryType.VARBINARY
          ? "VARYING"
          : "NONVARYING";
      context.replace(range, `CHAR(${length}) ${varAttribute}`);
    } else if (body?.kind === ast.SyntaxKind.SqlAttributeLobFile) {
      // Outside any procedure there's nowhere to put the LOB FILE declarations, so the
      // clause is dropped instead of left dangling as a `LIKE`-reference to a type that's
      // never declared.
      const proc = findEnclosingProc(frame, beforeIndex);
      if (proc) {
        const entry = getGenerationCacheEntry(proc.cache, proc.offset);
        if (!entry.hasSqlLobFile) {
          entry.hasSqlLobFile = true;
          entry.declBlocks.push(SQL_LOB_FILE_DECLS);
        }
        context.replace(range, LOB_FILE_TYPE);
      } else {
        context.replace(range, "");
      }
    } else if (body?.kind === ast.SyntaxKind.SqlAttributeLob) {
      const length = computeLobLength(body);
      const proc = findEnclosingProc(frame, beforeIndex);
      if (proc) {
        const entry = getGenerationCacheEntry(proc.cache, proc.offset);
        if (!entry.sqlLobSizes.has(length)) {
          entry.sqlLobSizes.add(length);
          entry.declBlocks.push(sqlLobDecls(length));
        }
        context.replace(range, LOB_TYPE(length));
      } else {
        context.replace(range, "");
      }
    } else {
      // Unrecognized body (already diagnosed by `sqlAttributeStatement` itself): still
      // blank the consumed `SQL TYPE IS ...` clause, matching the instruction-based
      // path's behavior (it emitted nothing for a null body) - leaving the clause in
      // place would hand the real parser text it never saw before, producing secondary
      // diagnostics on top of the IBM378xI one.
      context.replace(range, "");
    }
    return sqlAttrStatement;
  };
}

function getGenerationCacheEntry(
  cache: Map<number, GenerationCache>,
  offset: number,
): GenerationCache {
  let entry = cache.get(offset);
  if (!entry) {
    entry = {
      hasCicsExec: false,
      hasSqlLobFile: false,
      sqlLobSizes: new Set(),
      declBlocks: [],
    };
    cache.set(offset, entry);
  }
  return entry;
}

/**
 * Recognizes `DFHRESP(...)` response code references and replaces them with their numeric
 * CICS response code.
 */
function createCicsResponseHandler(
  context: PreprocessorContext,
): StatementParser {
  return async (state) => {
    const startToken = state.token;
    if (!startToken || startToken.tokenTypeIdx !== t.DFHRESP.tokenTypeIdx) {
      return undefined;
    }
    if (!isCicsResponseStatement(state)) {
      return undefined;
    }
    const cicsRespStmt = cicsResponseStatement(state);
    const endToken = state.last;
    const cicsRespStatement = ast.createStatement();
    cicsRespStatement.value = cicsRespStmt;
    // An invalid response code (already diagnosed by `cicsResponseStatement`) still
    // removes the whole `DFHRESP(...)` clause - it must not leak through to the parser.
    context.replace(
      {
        start: startToken.startOffset,
        end: (endToken ?? startToken).endOffset + 1,
      },
      cicsRespStmt.code !== null ? cicsRespStmt.code.toString() : "",
    );
    return cicsRespStatement;
  };
}

/**
 * Recognizes `EXEC SQL`/`EXEC CICS` statements whose prefix matches the phase's own type,
 * so the SQL and CICS phases never claim each other's statements. Consumes the tokens
 * without building an AST node - the preprocessor replaces the statement itself in a
 * whole-text pass, and `collectExecMetadata` builds the LSP-facing artifacts afterwards.
 * The only thing done here is queueing the CICS runtime declarations.
 */
function createExecHandler(
  execType: "SQL" | "CICS",
  frame: Frame,
): StatementParser {
  return async (state) => {
    const startToken = state.token;
    if (!startToken || startToken.tokenTypeIdx !== t.EXEC.tokenTypeIdx) {
      return undefined;
    }
    if (!state.canConsume(t.EXEC, t.ExecFragment)) {
      return undefined;
    }

    const fragmentToken = state.peek(2);
    const prefixMatch = fragmentToken && /^(\w+)\s*/i.exec(fragmentToken.image);
    if (prefixMatch?.[1]?.toUpperCase() !== execType) {
      return undefined;
    }

    const beforeIndex = state.index;
    // Kind-less tokens never surface in `files.getTokens`, so nothing EXEC-shaped is
    // visible to the language server - `collectExecMetadata` registers the statement's
    // LSP-facing tokens instead.
    state.consume(undefined, undefined, t.EXEC);
    state.consume(undefined, undefined, t.ExecFragment);
    state.consume(undefined, undefined, t.Semicolon);

    if (execType === "CICS") {
      // Every `EXEC CICS`-using procedure needs the `DFH*` runtime declarations once,
      // right after the procedure's own `;`.
      const proc = findEnclosingProc(frame, beforeIndex);
      if (proc) {
        const entry = getGenerationCacheEntry(proc.cache, proc.offset);
        if (!entry.hasCicsExec) {
          entry.hasCicsExec = true;
          entry.declBlocks.push(CICS_EXEC_DECLS);
        }
      }
    }

    return null;
  };
}

/** Builds a PL/I token from a classified api token (host coordinates - see `collectExecMetadata`). */
function toPliToken(token: ApiToken, uri: URI): t.Token {
  return t.createTokenInstance(
    token.image,
    token.image,
    t.ID,
    token.startOffset,
    token.endOffset,
    uri,
  );
}

/**
 * Builds the PL/I tokens for a classified api token (host coordinates). A qualified
 * host-variable identifier (`A.B`) yields one token per name part, located in the host
 * text (which may carry whitespace around the `.` that the engine's image lacks);
 * everything else yields one token covering the whole span.
 */
function toPliTokens(token: ApiToken, uri: URI, hostText: string): t.Token[] {
  if (
    token.semanticsKind === SemanticsKind.Identifier &&
    token.image.includes(".")
  ) {
    const result: t.Token[] = [];
    let cursor = token.startOffset;
    for (const part of token.image.split(".")) {
      if (part.length === 0) {
        continue;
      }
      const index = hostText.indexOf(part, cursor);
      if (index === -1 || index + part.length - 1 > token.endOffset) {
        return [toPliToken(token, uri)];
      }
      result.push(
        t.createTokenInstance(
          part,
          part,
          t.ID,
          index,
          index + part.length - 1,
          uri,
        ),
      );
      cursor = index + part.length;
    }
    if (result.length > 0) {
      return result;
    }
  }
  return [toPliToken(token, uri)];
}

const semanticTypes: Record<SemanticsKind, SemanticTokenTypes | undefined> = {
  [SemanticsKind.Comment]: SemanticTokenTypes.comment,
  [SemanticsKind.Identifier]: SemanticTokenTypes.variable,
  [SemanticsKind.Keyword]: SemanticTokenTypes.keyword,
  [SemanticsKind.Number]: SemanticTokenTypes.number,
  [SemanticsKind.String]: SemanticTokenTypes.string,
};

/** What `collectExecMetadata` extracted from one `process()` pass' recorded edits. */
interface ExecMetadata {
  /** LSP-facing tokens (semantic highlighting, cursor resolution) to register via `PhaseResult.directiveTokens`. */
  directiveTokens: t.Token[];
  /** One `IncludeDirective` statement per `EXEC SQL INCLUDE`, destined for `preprocessorAst`. */
  statements: ast.Statement[];
}

/**
 * Turns what `preprocessor.execute(context)` recorded into the `EXEC` statements'
 * LSP-facing artifacts - the language server itself has no notion of an EXEC statement.
 * Per statement this produces:
 *
 * - one plain token per classified sub-token (semantic highlighting via
 *   `Token.ppSemanticType`, position-based cursor resolution), plus `string`-typed tokens
 *   for `EXEC` and the leading `SQL`/`CICS` word the engine's classification doesn't see,
 * - each re-embedded identifier's `MappedToken.sourceToken`, so resolved references land
 *   on tokens with real source offsets (see `MappedToken.sourceToken`),
 * - a regular `IncludeDirective` statement per `EXEC SQL INCLUDE`, riding the same
 *   hover/definition/validation paths as `%INCLUDE`.
 *
 * Must run after `preprocessor.execute(context)`. The returned tokens are already
 * remapped to original-source space.
 */
function collectExecMetadata(
  context: PreprocessorContext,
  tokens: t.Token[],
  textDocument: TextDocument,
  sourceMap: SourceMap,
): ExecMetadata {
  const collected: t.Token[] = [];
  const statements: ast.Statement[] = [];
  const edits = context.getEdits().filter((edit) => edit.apiTokens?.length);
  if (edits.length === 0) {
    return { directiveTokens: [], statements };
  }
  const attempts = context.getIncludeAttempts();
  const uri = URI.parse(textDocument.uri);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.tokenTypeIdx !== t.ExecFragment.tokenTypeIdx) {
      continue;
    }
    const execToken = tokens[i - 1];
    const isExec = execToken?.tokenTypeIdx === t.EXEC.tokenTypeIdx;
    // The statement's own start: the engines anchor their edits at the `EXEC` keyword
    // (see `scanExecFragments`), which the fragment's preceding CST token also covers.
    const statementStart = isExec ? execToken.startOffset : token.startOffset;
    const edit = findFragmentEdit(edits, token.startOffset, statementStart);
    if (!edit?.apiTokens) {
      continue;
    }

    if (isExec) {
      execToken.ppSemanticType = SemanticTokenTypes.string;
      collected.push(execToken);
    }
    const prefixMatch = /^(\w+)/i.exec(token.image);
    if (prefixMatch) {
      const prefixToken = t.createTokenInstance(
        prefixMatch[1],
        prefixMatch[1],
        t.ID,
        token.startOffset,
        token.startOffset + prefixMatch[1].length - 1,
        uri,
      );
      prefixToken.ppSemanticType = SemanticTokenTypes.string;
      collected.push(prefixToken);
    }

    const pliTokens = new Map<ApiToken, t.Token[]>();
    for (const apiToken of edit.apiTokens) {
      const parts = toPliTokens(apiToken, uri, context.text);
      for (const part of parts) {
        part.ppSemanticType = semanticTypes[apiToken.semanticsKind];
        collected.push(part);
      }
      pliTokens.set(apiToken, parts);
    }
    // `identifierPairs` lists one entry per name part, in part order (see `createEdit`) -
    // zip them against the per-part tokens built above.
    const pairCursor = new Map<ApiToken, number>();
    for (const pair of edit.identifierPairs ?? []) {
      const parts = pliTokens.get(pair.apiToken);
      const index = pairCursor.get(pair.apiToken) ?? 0;
      pairCursor.set(pair.apiToken, index + 1);
      const sourceToken = parts?.[index];
      if (sourceToken) {
        pair.mapped.sourceToken = sourceToken;
      }
    }
    const attempt = attempts.find(
      (a) => a.range?.start === edit.start && a.range?.end === edit.end,
    );
    if (attempt) {
      const statement = ast.createStatement();
      statement.value = buildIncludeDirective(
        context,
        attempt,
        edit.apiTokens,
        pliTokens,
      );
      recursivelySetContainer(statement);
      statements.push(statement);
    }
  }
  const directiveTokens: t.Token[] = [];
  for (const token of collected) {
    const start = sourceMap.mapToOriginal(token.startOffset);
    const end = sourceMap.mapToOriginal(token.endOffset);
    if (start && end) {
      token.startOffset = start.offset;
      token.endOffset = end.offset;
      token.uri = start.uri;
      directiveTokens.push(token);
    }
  }
  return { directiveTokens, statements };
}

/**
 * The edit recorded for the statement owning the `ExecFragment` CST token at
 * `fragmentOffset`: normally the edit consuming the whole `EXEC ...;` range, or - for an
 * unterminated statement - the zero-width annotation edit at its start. A zero-width edit
 * has no upper bound to scope it by containment, so it only matches the statement
 * starting at its exact offset - anything looser would let it claim a *later* statement's
 * fragment.
 */
function findFragmentEdit(
  edits: readonly ReturnType<PreprocessorContext["getEdits"]>[number][],
  fragmentOffset: number,
  statementStart: number,
): (typeof edits)[number] | undefined {
  let best: (typeof edits)[number] | undefined;
  for (const edit of edits) {
    if (edit.start === edit.end) {
      if (edit.start !== statementStart) {
        continue;
      }
    } else if (edit.start > fragmentOffset || fragmentOffset >= edit.end) {
      continue;
    }
    if (!best || edit.start > best.start) {
      best = edit;
    }
  }
  return best;
}

/**
 * Builds the `IncludeDirective`/`IncludeItemFile` node for an `EXEC SQL INCLUDE`
 * statement. The member token is reused from `pliTokens` (the same object the
 * position-based lookups find); an unresolved include yields a node without `filePath`,
 * exactly like the `%INCLUDE` handling.
 */
function buildIncludeDirective(
  context: PreprocessorContext,
  attempt: IncludeAttempt,
  apiTokens: ApiToken[],
  pliTokens: Map<ApiToken, t.Token[]>,
): ast.IncludeDirective {
  const item = ast.createIncludeItemFile();
  item.sql = true;
  item.fileName = attempt.name;
  const memberToken = apiTokens.find(
    (apiToken) => apiToken.semanticsKind === SemanticsKind.Identifier,
  );
  // Include member names are never qualified, so the api token maps to exactly one part.
  const token = memberToken && pliTokens.get(memberToken)?.[0];
  if (token) {
    token.kind = CstNodeKind.IncludeItem_MemberID;
    token.element = item;
    item.token = token;
  }
  if (attempt.uri) {
    item.filePath = attempt.uri.toString();
    const workspace = context.unit.services.workspace.config.getWorkspacePath();
    item.relativeFilePath = UriUtils.composeRelativePath(
      workspace.path,
      attempt.uri.toString(),
    );
  }
  const directive = ast.createIncludeDirective();
  directive.items.push(item);
  return directive;
}

/**
 * Base class for the EXEC-based preprocessor phases (SQL and CICS). Builds one
 * `PreprocessorContext` over the phase's whole input text; statement handlers apply their
 * own edits directly against it as they're found - the only output step left is
 * `context.build()`.
 */
abstract class ExecPreprocessorPhase implements PreprocessorPhase {
  constructor(
    protected readonly compilerOptionsResult: CompilerOptionResult | undefined,
    protected readonly marginsProcessor: MarginsProcessor,
  ) {}

  /**
   * Cheap pre-scan trigger: no match in the input text means none of the phase's
   * constructs can occur, so the whole pass is skipped as a guaranteed identity
   * transform. False positives merely run the phase.
   */
  protected abstract readonly triggerPattern: RegExp;

  /**
   * The external preprocessor that finds and replaces its own `EXEC` statements directly
   * against a `PreprocessorContext` - one instance per phase, shared with every nested
   * (`resolveInclude`d) context.
   */
  protected abstract readonly preprocessor: Preprocessor;

  protected abstract createHandlers(
    context: PreprocessorContext,
    textDocument: TextDocument,
    frame: Frame,
  ): StatementParser[];

  async execute(input: PhaseInput): Promise<PhaseResult> {
    if (!this.triggerPattern.test(input.text)) {
      return passthroughPhaseResult(input);
    }
    const { unit, uri, textDocument } = input;
    const opts = this.compilerOptionsResult?.options;
    const allStatements: ast.Statement[] = [];
    const allDirectiveTokens: t.Token[] = [];
    const frames = new Map<PreprocessorContext, Frame>();
    // Comment tokens per `resolveInclude`d file, captured by the `prepareText` hook below
    // (the only place the pre-strip text still exists).
    const includeComments = new Map<string, t.Token[]>();

    const process = async (
      context: PreprocessorContext,
      sourceMapForDirectives: SourceMap,
      nestedInfo?: NestedContextInfo,
    ): Promise<void> => {
      const tokenization = tokenize(context.text, context.file);
      for (const diagnostic of tokenization.diagnostics) {
        context.pushDiagnostic(diagnostic);
      }
      const state = new ParserState(tokenization.tokens, opts);
      const frame: Frame = {
        tokens: tokenization.tokens,
        cache: new Map(),
        parent: nestedInfo ? frames.get(nestedInfo.parent) : undefined,
        includeOffset: nestedInfo?.includeRange?.start,
      };
      frames.set(context, frame);
      // Positions/diagnostics inside a nested include belong to the *included* document.
      const contextDocument = nestedInfo?.document ?? textDocument;
      // Register the included file for position-based LSP lookups, mirroring the MACRO
      // phase's `runInclude`. First registration wins: a file the MACRO phase already
      // `%INCLUDE`d keeps its (annotated) registration. The entry file is registered
      // later, by `registerFileTokens`.
      if (nestedInfo?.document && !unit.services.files.get(context.file)) {
        unit.services.files.set({
          textDocument: nestedInfo.document,
          tokens: tokenization.tokens,
          comments: includeComments.get(context.file.toString()) ?? [],
          uri: context.file,
        });
      }
      const handlers = this.createHandlers(context, contextDocument, frame);
      const { statements, diagnostics } = await preprocessorParse(
        state,
        handlers,
      );
      largePush(allStatements, statements);
      for (const diagnostic of diagnostics) {
        context.pushDiagnostic(diagnostic);
      }
      // The `EXEC` statements' own replacement: the preprocessor finds its own
      // `EXEC <keyword> ...;` occurrences in `context.text` in one whole-text pass.
      await this.preprocessor.execute(context);
      // Flushed only now: nested contexts are processed inside `preprocessor.execute`
      // above and may queue declarations against *this* frame's cache when the enclosing
      // procedure lives in this file - see `findEnclosingProc`.
      flushGenerationCache(context, frame.cache);
      const execMetadata = collectExecMetadata(
        context,
        tokenization.tokens,
        contextDocument,
        sourceMapForDirectives,
      );
      largePush(allStatements, execMetadata.statements);
      largePush(allDirectiveTokens, execMetadata.directiveTokens);
      largePush(
        allDirectiveTokens,
        extractDirectiveTokens(tokenization.tokens, sourceMapForDirectives),
      );
    };

    const context = new PreprocessorContext(
      uri,
      input.text,
      unit,
      uri,
      (nested, info) =>
        process(nested, SourceMap.identity(nested.text, nested.file), info),
      // Included files get the same length-preserving margins-blanking +
      // comment-stripping as the entry file - see `PreprocessorContext.prepareText`.
      (text, includeUri) => {
        const textWithoutMargins = this.marginsProcessor.processMargins(
          {
            result: this.compilerOptionsResult,
            text,
            recompileFingerprint: "",
          },
          includeUri,
          unit.services.workspace,
        );
        const stripped = stripComments(textWithoutMargins);
        includeComments.set(
          includeUri.toString(),
          commentRangesToTokens(
            stripped.comments,
            textWithoutMargins,
            includeUri,
          ),
        );
        return stripped.text;
      },
      this.preprocessor.name,
    );
    await process(context, input.sourceMap);
    const built = context.build();

    return {
      text: built.text,
      sourceMap: built.sourceMap,
      statements: allStatements,
      diagnostics: built.diagnostics,
      references: [],
      directiveTokens: allDirectiveTokens,
    };
  }
}

export class ExecSqlPreprocessorPhase extends ExecPreprocessorPhase {
  // `EXEC SQL` and `SQL TYPE IS` both contain "SQL".
  protected readonly triggerPattern = /SQL/i;
  protected readonly preprocessor = new Db2SqlPreprocessor();
  protected createHandlers(
    context: PreprocessorContext,
    textDocument: TextDocument,
    frame: Frame,
  ): StatementParser[] {
    return [
      createSqlAttributeHandler(context, frame),
      createExecHandler("SQL", frame),
    ];
  }
}

export class ExecCicsPreprocessorPhase extends ExecPreprocessorPhase {
  // TODO/29.07.2026/msujew: Support DFHVALUE in the future?
  protected readonly triggerPattern = /CICS|DFHRESP/i;
  protected readonly preprocessor = new CICSPreprocessor(HostLanguageType.PLI);
  protected createHandlers(
    context: PreprocessorContext,
    textDocument: TextDocument,
    frame: Frame,
  ): StatementParser[] {
    return [
      createCicsResponseHandler(context),
      createExecHandler("CICS", frame),
    ];
  }
}

/**
 * Runs unconditionally, after every configured PP() phase: an `EXEC`/`ExecFragment` pair
 * still present at this point means the corresponding preprocessor was never configured
 * via `PP(CICS)`/`PP(SQL)`. Replaces the statement with `DO; END;` so the final grammar
 * parse doesn't also raise its own generic error for it.
 */
export class UnresolvedExecPhase implements PreprocessorPhase {
  constructor(
    private readonly hasCics: boolean,
    private readonly hasSql: boolean,
  ) {}

  async execute(input: PhaseInput): Promise<PhaseResult> {
    if (
      (this.hasCics && this.hasSql) ||
      !/\bEXEC\s+(\w+)\b/i.test(input.text)
    ) {
      // Both preprocessors are configured (no EXEC statement can be left unresolved), or
      // there is no EXEC-looking text at all - skip the tokenize pass entirely, like the
      // real phases' own `triggerPattern` pre-scan.
      return passthroughPhaseResult(input);
    }

    const context = new PreprocessorContext(
      input.uri,
      input.text,
      input.unit,
      input.uri,
    );
    const { tokens } = tokenize(input.text, input.uri);

    for (let i = 0; i < tokens.length; i++) {
      const execToken = tokens[i];
      if (execToken.tokenTypeIdx !== t.EXEC.tokenTypeIdx) {
        continue;
      }
      const fragmentToken = tokens[i + 1];
      if (fragmentToken?.tokenTypeIdx !== t.ExecFragment.tokenTypeIdx) {
        continue;
      }

      const prefix = fragmentToken.image.match(/^(\w+)/i)?.[1]?.toUpperCase();
      const code =
        prefix === "CICS" && !this.hasCics
          ? CompilerOptionsCodes.PP.CicsPreprocessorRequired
          : prefix === "SQL" && !this.hasSql
            ? CompilerOptionsCodes.PP.SqlPreprocessorRequired
            : undefined;
      if (!code) {
        continue;
      }

      context.pushDiagnostic(diagnosticFromCode(code, execToken));

      // Replace EXEC/ExecFragment(/Semicolon) with a harmless DO; END; so the final
      // grammar parse doesn't also raise its own diagnostic for the same statement.
      let end = fragmentToken.endOffset + 1;
      if (tokens[i + 2]?.tokenTypeIdx === t.Semicolon.tokenTypeIdx) {
        end = tokens[i + 2].endOffset + 1;
        i++;
      }
      context.replace({ start: execToken.startOffset, end }, "DO; END;");
      i++;
    }

    const built = context.build();
    return {
      text: built.text,
      sourceMap: built.sourceMap,
      statements: [],
      diagnostics: built.diagnostics,
      references: [],
      directiveTokens: [],
    };
  }
}
