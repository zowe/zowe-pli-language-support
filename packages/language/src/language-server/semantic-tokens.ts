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

import { SemanticTokensBuilder } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { Range } from "./types";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokensLegend } from "vscode-languageserver-types";
import {
  DeclaredVariable,
  getContainer,
  isPreprocessorNode,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import {
  controlTokens,
  EXEC,
  modifierTokens,
  NUMBER,
  STRING_TERM,
  Token,
} from "../parser/tokens";
import { getFirstStructureVariable } from "../syntax-tree/ast-utils";

export enum SemanticTokenTypes {
  variable,
  keyword,
  modifier,
  number,
  function,
  parameter,
  enum,
  enumMember,
  class,
  type,
  string,
  comment,
}

export enum SemanticTokenModifiers {
  preprocessor,
}

export const semanticTokenLegend: SemanticTokensLegend = {
  tokenTypes: Object.keys(SemanticTokenTypes).filter((key) =>
    isNaN(Number(key)),
  ),
  tokenModifiers: Object.keys(SemanticTokenModifiers).filter((key) =>
    isNaN(Number(key)),
  ),
};

export function semanticTokens(
  textDocument: TextDocument,
  compilationUnit: CompilationUnit,
  range?: Range,
): number[] {
  const tokens = compilationUnit.services.files.getTokens(textDocument.uri);
  const comments = compilationUnit.services.files.getComments(textDocument.uri);
  if (!tokens || !comments) {
    return [];
  }
  let commentIndex = 0;
  const semanticTokens = new SemanticTokensBuilder();
  for (const token of tokens) {
    // Process any comments that appear before the current token
    while (
      commentIndex < comments.length &&
      comments[commentIndex].startOffset < token.startOffset
    ) {
      const comment = comments[commentIndex++];
      handleCommentTokens(textDocument, semanticTokens, comment);
    }

    if (
      token.kind === CstNodeKind.ExecStatement_ExecFragment &&
      token.element?.kind === SyntaxKind.ExecStatement
    ) {
      const modifier = 1 << SemanticTokenModifiers.preprocessor;
      const push = (token: Token, length: number, type: number) => {
        semanticTokens.push(
          token.startLine,
          token.startColumn,
          length,
          type,
          modifier,
        );
      };

      // Handle the remaining preprocessor tokens
      for (
        let index = 0;
        index < token.element.preprocessorTokens.length;
        index++
      ) {
        const subToken = token.element.preprocessorTokens[index].token;
        const type = token.element.preprocessorTokens[index].semanticType;
        push(subToken, subToken.image.length, type);
      }
      continue;
    }

    const type = tokenType(token);
    if (type !== undefined) {
      const modifier = tokenModifier(compilationUnit, token);
      semanticTokens.push(
        token.startLine,
        token.startColumn,
        token.image.length,
        type,
        modifier,
      );
    }
  }
  // Process any remaining comments after the last token
  while (commentIndex < comments.length) {
    const comment = comments[commentIndex++];
    handleCommentTokens(textDocument, semanticTokens, comment);
  }
  return semanticTokens.build().data;
}

// Most language clients cannot handle multi-line semantic tokens
// This function breaks multi-line comments apart into separate semantic tokens
// Each token covers a single line, so that all clients can display them correctly
function handleCommentTokens(
  document: TextDocument,
  tokenBuilder: SemanticTokensBuilder,
  token: Token,
): void {
  if (token.startLine === token.endLine) {
    // Single-line comment, push as is
    tokenBuilder.push(
      token.startLine,
      token.startColumn,
      token.image.length,
      SemanticTokenTypes.comment,
      0,
    );
    return;
  }
  for (let line = token.startLine; line <= token.endLine; line++) {
    const startChar = line === token.startLine ? token.startColumn : 0;
    let length: number;
    if (line === token.endLine) {
      length = token.endColumn + 1 - startChar;
    } else {
      const lineStart = document.offsetAt({ line, character: 0 });
      const lineEnd = document.offsetAt({
        line,
        character: Number.MAX_SAFE_INTEGER,
      });
      length = lineEnd - lineStart - startChar;
    }
    if (length > 0) {
      tokenBuilder.push(line, startChar, length, SemanticTokenTypes.comment, 0);
    }
  }
}

function tokenModifier(unit: CompilationUnit, token: Token): number {
  let modifier = 0;
  const element = token.element;
  if (!element) {
    return 0;
  }
  if (isPreprocessorNode(unit, element)) {
    modifier |= 1 << SemanticTokenModifiers.preprocessor;
  }
  return modifier;
}

function tokenType(token: Token): number | undefined {
  const referenceTarget = getReferenceTarget(token);
  if (referenceTarget) {
    switch (referenceTarget.kind) {
      case SyntaxKind.LabelPrefix:
        if (isProcedurePrefix(referenceTarget)) {
          return SemanticTokenTypes.function;
        } else {
          return SemanticTokenTypes.variable;
        }
      case SyntaxKind.OrdinalValue:
        return SemanticTokenTypes.enumMember;
      case SyntaxKind.DefineOrdinalStatement:
        return SemanticTokenTypes.enum;
      case SyntaxKind.DefineAliasStatement:
        return SemanticTokenTypes.type;
      case SyntaxKind.DeclaredVariable:
        if (isFirstStructureItem(referenceTarget)) {
          return SemanticTokenTypes.class;
        } else {
          return SemanticTokenTypes.variable;
        }
    }
  }
  if (isProcedureType(token)) {
    return SemanticTokenTypes.function;
  } else if (isClassToken(token)) {
    return SemanticTokenTypes.class;
  } else if (isVariableType(token)) {
    return SemanticTokenTypes.variable;
  } else if (isEnumToken(token)) {
    return SemanticTokenTypes.enum;
  } else if (isEnumMemberToken(token)) {
    return SemanticTokenTypes.enumMember;
  } else if (isTypeToken(token)) {
    return SemanticTokenTypes.type;
  } else if (token.kind === CstNodeKind.ProcedureParameter_Id) {
    return SemanticTokenTypes.parameter;
  } else if (token.kind === CstNodeKind.CompilerOption_Name) {
    return SemanticTokenTypes.modifier;
  } else if (token.kind === CstNodeKind.CompilerOption_Number) {
    return SemanticTokenTypes.number;
  }

  if (token.tokenTypeIdx === STRING_TERM.tokenTypeIdx) {
    return SemanticTokenTypes.string;
  } else if (token.tokenTypeIdx === NUMBER.tokenTypeIdx) {
    return SemanticTokenTypes.number;
  } else if (token.tokenTypeIdx === EXEC.tokenTypeIdx) {
    //because it is handled by the TextMate configuration
    return undefined;
  }

  // If the token has no semantic meaning based on the CST, check if it's a keyword
  if (controlTokens.has(token.tokenType)) {
    return SemanticTokenTypes.keyword;
  } else if (modifierTokens.has(token.tokenType)) {
    return SemanticTokenTypes.modifier;
  }

  return undefined;
}

/**
 * If the specified token represents a reference, this function returns the target SyntaxNode of that reference.
 */
function getReferenceTarget(token: Token): SyntaxNode | undefined {
  switch (token.kind) {
    case CstNodeKind.ReferenceItem_Ref:
      if (token.element?.kind === SyntaxKind.ReferenceItem) {
        return token.element.ref?.node ?? undefined;
      }
      break;
    case CstNodeKind.LabelReference_LabelRef:
      if (token.element?.kind === SyntaxKind.LabelReference) {
        return token.element.label?.node ?? undefined;
      }
      break;
    case CstNodeKind.TypeAttribute_TypeId0:
    case CstNodeKind.TypeAttribute_TypeId1:
      if (token.element?.kind === SyntaxKind.TypeAttribute) {
        return token.element.type?.node ?? undefined;
      }
      break;
    case CstNodeKind.HandleAttribute_TypeId0:
    case CstNodeKind.HandleAttribute_TypeId1:
      if (token.element?.kind === SyntaxKind.HandleAttribute) {
        return token.element.type?.node ?? undefined;
      }
      break;
  }
  return undefined;
}

function isProcedureKind(container: SyntaxNode | null | undefined): boolean {
  if (!container) {
    return false;
  }

  if (container.kind === SyntaxKind.ProcedureStatement) {
    return true;
  }

  if (container.kind === SyntaxKind.Package) {
    return true;
  }

  return false;
}

function isProcedureType(token: Token): boolean {
  switch (token.kind) {
    case CstNodeKind.Exports_Procedure:
      return true;
    case CstNodeKind.LabelPrefix_Name:
      return isProcedurePrefix(token.element);
  }
  return false;
}

function isProcedurePrefix(node: SyntaxNode | null | undefined): boolean {
  if (
    node?.kind === SyntaxKind.LabelPrefix &&
    node.container?.kind === SyntaxKind.Statement &&
    isProcedureKind(node.container.value)
  ) {
    return true;
  }
  return false;
}

function isVariableType(token: Token): boolean {
  switch (token.kind) {
    case CstNodeKind.DeclaredVariable_Name:
    case CstNodeKind.ReferenceItem_Ref:
    case CstNodeKind.ReplaceStatement_Id:
    case CstNodeKind.TypeAttribute_TypeId0:
    case CstNodeKind.TypeAttribute_TypeId1:
    case CstNodeKind.HandleAttribute_TypeId0:
    case CstNodeKind.HandleAttribute_TypeId1:
    case CstNodeKind.LabelReference_LabelRef:
    case CstNodeKind.IncludeItem_FileID:
    case CstNodeKind.IncludeItem_MemberID:
    case CstNodeKind.SqlHostVariableReference_HostVariable:
      return true;
  }
  return false;
}

function isEnumToken(token: Token): boolean {
  return token.kind === CstNodeKind.DefineOrdinalStatement_Name;
}

function isEnumMemberToken(token: Token): boolean {
  return token.kind === CstNodeKind.OrdinalValue_Name;
}

function isTypeToken(token: Token): boolean {
  return token.kind === CstNodeKind.DefineAliasStatement_Name;
}

function isClassToken(token: Token): boolean {
  const { kind, element } = token;
  if (
    kind === CstNodeKind.DeclaredVariable_Name &&
    element?.kind === SyntaxKind.DeclaredVariable
  ) {
    return isFirstStructureItem(element);
  }
  return false;
}

function isFirstStructureItem(element: DeclaredVariable): boolean {
  const defineStruct = getContainer(
    element,
    SyntaxKind.DefineStructureStatement,
  );
  if (!defineStruct) {
    return false;
  }
  return getFirstStructureVariable(defineStruct) === element;
}
