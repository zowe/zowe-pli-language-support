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

import { diagnosticFromCode } from "../../language-server/types";
import * as AST from "../../syntax-tree/ast";
import { ValidationAcceptor } from "../validator";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { isBuiltinDeclaration, isEntryDeclaration } from "../utils";
import { ParametricPLICode, PLICodes } from "../pli-codes";
import type { Token } from "../../parser/tokens";
import { CompilerOptions } from "../../preprocessor/compiler-options/options-pli";

const CATEGORY_KEYS: Record<
  CompilerOptions.DeprecateItemType,
  keyof CompilerOptions.Deprecate
> = {
  [CompilerOptions.DeprecateItemType.BUILTIN]: "BUILTIN",
  [CompilerOptions.DeprecateItemType.ENTRY]: "ENTRY",
  [CompilerOptions.DeprecateItemType.INCLUDE]: "INCLUDE",
  [CompilerOptions.DeprecateItemType.STMT]: "STMT",
  [CompilerOptions.DeprecateItemType.VARIABLE]: "VARIABLE",
} as const;

function checkDeprecation(
  name: string,
  category: CompilerOptions.DeprecateItemType,
  token: Token,
  compilationUnit: CompilationUnit,
  acceptor: ValidationAcceptor,
  errorCode: ParametricPLICode,
  warningCode: ParametricPLICode,
): void {
  const categoryKey = CATEGORY_KEYS[category];

  const deprecate =
    compilationUnit.compilerOptions.deprecate?.[categoryKey]?.has(name);
  if (deprecate) {
    acceptor(diagnosticFromCode(errorCode, token, name));
    return;
  }

  const deprecateNext =
    compilationUnit.compilerOptions.deprecateNext?.[categoryKey]?.has(name);
  if (deprecateNext) {
    acceptor(diagnosticFromCode(warningCode, token, name));
  }
}

export function DeprecateVariables(
  node: AST.DeclaredVariable,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    !compilationUnit.compilerOptions.deprecate &&
    !compilationUnit.compilerOptions.deprecateNext
  ) {
    return;
  }

  if (!node.nameToken) {
    return;
  }

  if (isBuiltinDeclaration(node)) {
    checkDeprecation(
      node.nameToken.originalImage,
      CompilerOptions.DeprecateItemType.BUILTIN,
      node.nameToken,
      compilationUnit,
      acceptor,
      PLICodes.Error.IBM2444I,
      PLICodes.Warning.IBM2643I,
    );
    return;
  }

  if (isEntryDeclaration(node)) {
    checkDeprecation(
      node.nameToken.originalImage,
      CompilerOptions.DeprecateItemType.ENTRY,
      node.nameToken,
      compilationUnit,
      acceptor,
      PLICodes.Error.IBM2446I,
      PLICodes.Warning.IBM2645I,
    );
    return;
  }

  checkDeprecation(
    node.nameToken.originalImage,
    CompilerOptions.DeprecateItemType.VARIABLE,
    node.nameToken,
    compilationUnit,
    acceptor,
    PLICodes.Error.IBM2447I,
    PLICodes.Warning.IBM2646I,
  );
}

export function DeprecateIncludes(
  node: AST.IncludeDirective,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    (compilationUnit.compilerOptions.deprecate?.INCLUDE.size || 0) == 0 &&
    (compilationUnit.compilerOptions.deprecateNext?.INCLUDE.size || 0) == 0
  ) {
    return;
  }

  if (!node.token) {
    return;
  }

  for (const item of node.items) {
    let includeName =
      item.kind === AST.SyntaxKind.IncludeItemFile
        ? item.fileName
        : (item as AST.IncludeItemMember).memberName;

    if (!includeName) {
      continue;
    }

    // TODO ssmifi: Since we do not allow . in plain text in the compiler option, we strip the extension here.
    // The spec does only show plain text as valid input. This needs to be confirmed on the mainframe.
    includeName = includeName.replace(/\.[^/.]+$/, "").toUpperCase();

    checkDeprecation(
      includeName,
      CompilerOptions.DeprecateItemType.INCLUDE,
      node.token,
      compilationUnit,
      acceptor,
      PLICodes.Error.IBM3658I,
      PLICodes.Warning.IBM3331I,
    );
  }
}

const STATEMENT_KEYWORD_MAP: Record<number, string> = {
  [AST.SyntaxKind.AllocateStatement]: "ALLOCATE",
  [AST.SyntaxKind.AssertStatement]: "ASSERT",
  [AST.SyntaxKind.AttachStatement]: "ATTACH",
  [AST.SyntaxKind.BeginStatement]: "BEGIN",
  [AST.SyntaxKind.CallStatement]: "CALL",
  [AST.SyntaxKind.CloseStatement]: "CLOSE",
  [AST.SyntaxKind.DelayStatement]: "DELAY",
  [AST.SyntaxKind.DeleteStatement]: "DELETE",
  [AST.SyntaxKind.DetachStatement]: "DETACH",
  [AST.SyntaxKind.DisplayStatement]: "DISPLAY",
  [AST.SyntaxKind.ExitStatement]: "EXIT",
  [AST.SyntaxKind.FetchStatement]: "FETCH",
  [AST.SyntaxKind.FlushStatement]: "FLUSH",
  [AST.SyntaxKind.FreeStatement]: "FREE",
  [AST.SyntaxKind.GetFileStatement]: "GET",
  [AST.SyntaxKind.GetStringStatement]: "GET",
  [AST.SyntaxKind.GoToStatement]: "GOTO",
  [AST.SyntaxKind.IterateStatement]: "ITERATE",
  [AST.SyntaxKind.LeaveStatement]: "LEAVE",
  [AST.SyntaxKind.LocateStatement]: "LOCATE",
  [AST.SyntaxKind.OnStatement]: "ON",
  [AST.SyntaxKind.OpenStatement]: "OPEN",
  [AST.SyntaxKind.PutFileStatement]: "PUT",
  [AST.SyntaxKind.PutStringStatement]: "PUT",
  [AST.SyntaxKind.ReadStatement]: "READ",
  [AST.SyntaxKind.ReleaseStatement]: "RELEASE",
  [AST.SyntaxKind.ResignalStatement]: "RESIGNAL",
  [AST.SyntaxKind.RevertStatement]: "REVERT",
  [AST.SyntaxKind.RewriteStatement]: "REWRITE",
  [AST.SyntaxKind.SignalStatement]: "SIGNAL",
  [AST.SyntaxKind.StopStatement]: "STOP",
  [AST.SyntaxKind.WaitStatement]: "WAIT",
  [AST.SyntaxKind.WriteStatement]: "WRITE",
} as const;

export function DeprecateStatements(
  node: AST.Statement,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    (compilationUnit.compilerOptions.deprecate?.STMT.size || 0) == 0 &&
    (compilationUnit.compilerOptions.deprecateNext?.STMT.size || 0) == 0
  ) {
    return;
  }

  if (!node.value || !node.startToken) {
    return;
  }

  const statementKeyword = STATEMENT_KEYWORD_MAP[node.value.kind];
  if (!statementKeyword) {
    return;
  }

  checkDeprecation(
    statementKeyword,
    CompilerOptions.DeprecateItemType.STMT,
    node.startToken,
    compilationUnit,
    acceptor,
    PLICodes.Error.IBM2454I,
    PLICodes.Warning.IBM2647I,
  );
}
