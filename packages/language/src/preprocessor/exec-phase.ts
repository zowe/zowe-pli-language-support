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

import {
  Preprocessor,
  scanExecFragments,
  SemanticsKind,
  Token as ApiToken,
} from "preprocessor-api";
import { CICSPreprocessor, HostLanguageType } from "preprocessor-cics";
import { Db2SqlPreprocessor } from "preprocessor-db2";
import { SemanticTokenTypes } from "../language-server/semantic-tokens";
import { recursivelySetContainer } from "../linking/symbol-table";
import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import * as t from "../parser/tokens";
import { URI, UriUtils } from "../utils/uri";
import { diagnosticFromCodeAtRange } from "../language-server/types";
import { CompilerOptionsCodes } from "./compiler-options/codes";
import { CompilerOptionResult } from "./compiler-options/options";
import { MarginsProcessor } from "./pli-margins-processor";
import { commentRangesToTokens, stripComments } from "./comment-stripper";
import { interruptAndCheck } from "../utils/promises";
import {
  passthroughPhaseResult,
  PhaseInput,
  PhaseResult,
  PreprocessorPhase,
} from "./pp-phase";
import { IncludeAttempt, PreprocessorContext } from "./preprocessor-context";
import { SourceMap } from "./source-map";
import { largePush } from "../utils/collections";

/** Builds a PL/I token from a classified api token (host coordinates - see `collectExecMetadata`). */
function toPliToken(token: ApiToken, uri: URI): t.Token {
  return t.createTokenInstance(
    token.image,
    token.image,
    t.ID,
    token.range.start,
    token.range.end - 1,
    uri,
  );
}

/**
 * Builds the PL/I tokens for a classified api token (host coordinates). A qualified host-variable
 * identifier (`A.B`) yields one token per name part.
 */
function toPliTokens(token: ApiToken, uri: URI, hostText: string): t.Token[] {
  if (
    token.semanticsKind === SemanticsKind.Identifier &&
    token.image.includes(".")
  ) {
    const result: t.Token[] = [];
    let cursor = token.range.start;
    for (const part of token.image.split(".")) {
      if (part.length === 0) {
        continue;
      }
      const index = hostText.indexOf(part, cursor);
      if (index === -1 || index + part.length > token.range.end) {
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

/** What `collectExecMetadata` extracted from one context's recorded edits. */
interface ExecMetadata {
  /** LSP-facing tokens (semantic highlighting, cursor resolution) to register via `PhaseResult.directiveTokens`. */
  directiveTokens: t.Token[];
  /** One `IncludeDirective` statement per `EXEC SQL INCLUDE`, destined for `preprocessorAst`. */
  statements: ast.Statement[];
  /** One linkable reference per host-variable name part, for `PhaseResult.references`. */
  references: ast.Reference[];
}

/**
 * One `ReferenceItem` per name part of a host variable (`A.B` -> `A`, `B`), chained as member calls
 * like the parser does. The chain has no AST parent: the linker adopts the statement surrounding
 * the reference's source position (see `resolveReference`).
 */
function buildExecReferences(parts: t.Token[]): ast.Reference[] {
  const references: ast.Reference[] = [];
  let call: ast.MemberCall | null = null;
  for (const part of parts) {
    const item = ast.createReferenceItem();
    const ref = ast.createReference<ast.NamedElement>(
      item,
      part,
      ast.ReferenceType.Variable,
    );
    item.ref = ref;
    part.kind = CstNodeKind.ReferenceItem_Ref;
    part.element = item;
    const next = ast.createMemberCall();
    next.element = item;
    next.previous = call;
    item.container = next;
    if (call) {
      call.container = next;
    }
    call = next;
    references.push(ref);
  }
  return references;
}

/**
 * The two leading words of an `EXEC` statement, which the engines' classification does not cover.
 */
const EXEC_PREFIX = /(EXEC)\s+(\w+)/iy;

/**
 * Turns what `preprocessor.execute(context)` recorded on one context into the LSP-facing tokens,
 * references and include directives of the constructs it replaced. Must run after
 * `preprocessor.execute`.
 */
function collectExecMetadata(
  context: PreprocessorContext,
  sourceMap: SourceMap,
): ExecMetadata {
  const directiveTokens: t.Token[] = [];
  const references: ast.Reference[] = [];
  const statements: ast.Statement[] = [];
  const edits = context.getEdits().filter((edit) => edit.apiTokens?.length);
  if (edits.length === 0) {
    return { directiveTokens, references, statements };
  }
  // Unmapped (macro-generated) tokens keep their phase offsets and stay unregistered.
  const remap = (token: t.Token): boolean => {
    const start = sourceMap.mapToOriginal(token.startOffset);
    const end = sourceMap.mapToOriginal(token.endOffset);
    if (!start || !end) {
      return false;
    }
    token.startOffset = start.offset;
    token.endOffset = end.offset;
    token.uri = start.uri;
    return true;
  };
  const register = (token: t.Token): boolean => {
    if (!remap(token)) {
      return false;
    }
    directiveTokens.push(token);
    return true;
  };
  const attempts = context.getIncludeAttempts();
  const uri = context.file;
  const text = context.text;
  for (const edit of edits) {
    EXEC_PREFIX.lastIndex = edit.start;
    const exec = EXEC_PREFIX.exec(text);
    if (exec) {
      const execToken = t.createTokenInstance(
        exec[1],
        exec[1],
        t.EXEC,
        edit.start,
        edit.start + exec[1].length - 1,
        uri,
      );
      execToken.ppSemanticType = SemanticTokenTypes.string;
      register(execToken);
      const prefixStart = edit.start + exec[0].length - exec[2].length;
      const prefixToken = t.createTokenInstance(
        exec[2],
        exec[2],
        t.ID,
        prefixStart,
        prefixStart + exec[2].length - 1,
        uri,
      );
      prefixToken.ppSemanticType = SemanticTokenTypes.string;
      register(prefixToken);
    }

    const attempt = attempts.find(
      (a) => a.range?.start === edit.start && a.range?.end === edit.end,
    );
    const pliTokens = new Map<ApiToken, t.Token[]>();
    for (const apiToken of edit.apiTokens!) {
      const parts = toPliTokens(apiToken, uri, text);
      let mapped = true;
      for (const part of parts) {
        part.ppSemanticType = semanticTypes[apiToken.semanticsKind];
        mapped = register(part) && mapped;
      }
      pliTokens.set(apiToken, parts);
      if (
        mapped &&
        !attempt &&
        apiToken.semanticsKind === SemanticsKind.Identifier
      ) {
        largePush(references, buildExecReferences(parts));
      }
    }
    if (attempt) {
      const statement = ast.createStatement();
      statement.value = buildIncludeDirective(
        context,
        attempt,
        edit.apiTokens!,
        pliTokens,
      );
      recursivelySetContainer(statement);
      statements.push(statement);
    }
  }
  return { directiveTokens, references, statements };
}

/**
 * Builds the `IncludeDirective`/`IncludeItemFile` node for an `EXEC SQL INCLUDE` statement. An
 * unresolved include yields a node without `filePath`, like `%INCLUDE`.
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
    const workspace = context.unit.services.workspace.config.getWorkspaceUri();
    item.relativeFilePath = workspace
      ? UriUtils.composeRelativePath(workspace.path, attempt.uri.toString())
      : attempt.uri.toString();
  }
  const directive = ast.createIncludeDirective();
  directive.items.push(item);
  return directive;
}

/**
 * Base class for the EXEC-based preprocessor phases (SQL and CICS). Builds one
 * `PreprocessorContext` over the phase's input text and hands it to the external preprocessor.
 */
abstract class ExecPreprocessorPhase implements PreprocessorPhase {
  constructor(
    protected readonly compilerOptionsResult: CompilerOptionResult | undefined,
    protected readonly marginsProcessor: MarginsProcessor,
  ) {}

  /**
   * Cheap pre-scan trigger: no match in the input text means the whole pass can be skipped.
   */
  protected abstract readonly triggerPattern: RegExp;

  /**
   * The external preprocessor that finds and replaces its own constructs against a
   * `PreprocessorContext`.
   */
  protected abstract readonly preprocessor: Preprocessor;

  async execute(input: PhaseInput): Promise<PhaseResult> {
    if (!this.triggerPattern.test(input.text)) {
      return passthroughPhaseResult(input);
    }
    const { unit, uri } = input;
    if (input.cancellation) {
      // Processing a file is uninterruptible once entered, so give up a superseded
      // build at least at file granularity (the context repeats this per include).
      await interruptAndCheck(input.cancellation);
    }
    // Comment tokens per `resolveInclude`d file, captured by the `prepareText` hook below
    // (the only place the pre-strip text still exists).
    const includeComments = new Map<string, t.Token[]>();
    const context = new PreprocessorContext(
      uri,
      input.text,
      unit,
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
          unit,
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
      input.cancellation,
    );
    await this.preprocessor.execute(context);

    const allStatements: ast.Statement[] = [];
    const allDirectiveTokens: t.Token[] = [];
    const allReferences: ast.Reference[] = [];
    const collect = (
      current: PreprocessorContext,
      sourceMapForDirectives: SourceMap,
    ): void => {
      const metadata = collectExecMetadata(current, sourceMapForDirectives);
      largePush(allStatements, metadata.statements);
      largePush(allReferences, metadata.references);
      largePush(allDirectiveTokens, metadata.directiveTokens);
      for (const attempt of current.getIncludeAttempts()) {
        const nested = attempt.context;
        if (!nested) {
          continue;
        }
        // Register the included file for position-based LSP lookups. First registration wins.
        // Tokens are filled in by `PliLexer.mergeForeignTokens` once the pipeline is done.
        if (attempt.document && !unit.services.files.get(nested.file)) {
          unit.services.files.set({
            textDocument: attempt.document,
            tokens: [],
            comments: includeComments.get(nested.file.toString()) ?? [],
            uri: nested.file,
          });
        }
        // Positions inside a nested include are the *included* document's own.
        collect(nested, SourceMap.identity(nested.text, nested.file));
      }
    };
    collect(context, input.sourceMap);
    const built = context.build();

    return {
      text: built.text,
      sourceMap: built.sourceMap,
      statements: allStatements,
      diagnostics: built.diagnostics,
      references: allReferences,
      directiveTokens: allDirectiveTokens,
    };
  }
}

export class ExecSqlPreprocessorPhase extends ExecPreprocessorPhase {
  // `EXEC SQL` and `SQL TYPE IS` both contain "SQL".
  protected readonly triggerPattern = /SQL/i;
  protected readonly preprocessor = new Db2SqlPreprocessor();
}

export class ExecCicsPreprocessorPhase extends ExecPreprocessorPhase {
  protected readonly triggerPattern = /CICS|DFHRESP|DFHVALUE/i;
  protected readonly preprocessor = new CICSPreprocessor(HostLanguageType.PLI);
}

/** Only the host's quote characters matter outside a preprocessor's own statements. */
const HOST_DELIMITERS = { quotes: ["'", '"'], lineComments: [] };

/**
 * Runs after every configured PP() phase: an `EXEC CICS`/`EXEC SQL` statement still present means
 * the corresponding preprocessor was never configured. Replaces it with `DO; END;`.
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
      // there is no EXEC-looking text at all - skip the scan entirely, like the real
      // phases' own `triggerPattern` pre-scan.
      return passthroughPhaseResult(input);
    }

    const context = new PreprocessorContext(input.uri, input.text, input.unit);
    const unconfigured = [
      {
        prefix: "CICS",
        code: CompilerOptionsCodes.PP.CicsPreprocessorRequired,
        missing: !this.hasCics,
      },
      {
        prefix: "SQL",
        code: CompilerOptionsCodes.PP.SqlPreprocessorRequired,
        missing: !this.hasSql,
      },
    ];
    for (const { prefix, code, missing } of unconfigured) {
      if (!missing) {
        continue;
      }
      for (const fragment of scanExecFragments(
        input.text,
        prefix,
        HOST_DELIMITERS,
      )) {
        // The diagnostic covers the `EXEC` keyword only.
        context.pushHostDiagnostic(
          diagnosticFromCodeAtRange(code, input.uri.toString(), {
            start: fragment.range.start,
            end: fragment.range.start + 4,
          }),
        );
        context.replace(fragment.range, "DO; END;");
      }
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
