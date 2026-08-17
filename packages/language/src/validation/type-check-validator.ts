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

import { diagnosticFromCode } from "../language-server/types";
import * as ast from "../syntax-tree/ast";
import {
  AttributeKind,
  Bound,
  ScaleMode,
  StringKind,
  TypeDescriptions,
} from "../typesystem/descriptions";
import { BuiltinsUriSchema } from "../workspace/builtins";
import { CompilationUnit } from "../workspace/compilation-unit";
import { PLICodes } from "./pli-codes";
import { ValidationAcceptor } from "./validator";
import * as tokens from "../parser/tokens";
import { LspCodes } from "./lsp-codes";

export function typeCheck(
  stmt:
    | ast.DeclareStatement
    | ast.DeclaredVariable
    | ast.DeclaredItem
    | ast.DefineAliasStatement
    | ast.DefineOrdinalStatement,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  const description = compilationUnit.services.inferer.inferType(
    stmt,
    compilationUnit,
  );

  if (compilationUnit.uri.scheme !== BuiltinsUriSchema) {
    if (description.list) {
      const token = description.witnesses.witnesses[AttributeKind.List]?.token;
      if (token) {
        acceptor(
          diagnosticFromCode(
            LspCodes.BuiltinAttributes.IsForbiddenUsage,
            token,
            token.image,
          ),
        );
      }
    }
    if (TypeDescriptions.isUnknown(description)) {
      const witness = description.witnesses.witnesses[AttributeKind.DataType];
      if (witness?.token.tokenType === tokens.ANY) {
        acceptor(
          diagnosticFromCode(
            LspCodes.BuiltinAttributes.IsForbiddenUsage,
            witness.token,
            witness.token.image,
          ),
        );
      }
      // ignore further type checking
      return;
    }
  }

  if (description.dimension) {
    const witness = description.witnesses.witnesses[AttributeKind.Dimension];
    if (witness && witness.token && witness.token.image) {
      if (description.dimension.length === 0) {
        acceptor(
          diagnosticFromCode(
            PLICodes.Error.IBM1352I,
            witness.token,
            witness.token.image,
          ),
        );
      } else {
        for (const dimension of description.dimension) {
          const upperBound = validateBound(
            dimension.upperBound,
            acceptor,
            compilationUnit,
          );
          const lowerBound = validateBound(
            dimension.lowerBound,
            acceptor,
            compilationUnit,
          );
          if (
            typeof lowerBound === "undefined" &&
            typeof upperBound === "number"
          ) {
            if (upperBound < 1) {
              acceptor(
                diagnosticFromCode(PLICodes.Error.IBM1295I, witness.token),
              );
            }
          } else if (
            typeof upperBound === "number" &&
            typeof lowerBound === "number"
          ) {
            if (upperBound < lowerBound) {
              acceptor(
                diagnosticFromCode(PLICodes.Error.IBM1338I, witness.token),
              );
            }
          }
        }
      }
    }
  }

  if (TypeDescriptions.isArithmetic(description)) {
    const witness = description.witnesses.witnesses[AttributeKind.Precision];
    if (description.precision && witness?.token) {
      if (typeof description.precision.fractionalDigitsCount === "number") {
        if (
          description.precision.fractionalDigitsCount >
          description.precision.totalDigitsCount
        ) {
          acceptor(diagnosticFromCode(PLICodes.Error.IBM2436I, witness.token));
        } else if (description.scale === ScaleMode.Float) {
          acceptor(diagnosticFromCode(PLICodes.Error.IBM2424I, witness.token));
        }
      }
    }
  }
}

function validateBound(
  bound: Bound,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  if (bound.expression) {
    if (bound.expression.kind === ast.SyntaxKind.WildcardItem) {
      return "unbounded";
    } else {
      const boundDescription = compilationUnit.services.inferer.inferType(
        bound.expression,
        compilationUnit,
      );
      if (TypeDescriptions.isUnknown(boundDescription)) {
        // ignore further type checking
        return "unknown";
      }
      if (!TypeDescriptions.isArithmetic(boundDescription)) {
        //TODO handle other types
        let code = "";
        if (TypeDescriptions.isString(boundDescription)) {
          if (
            boundDescription.stringBits &&
            boundDescription.stringBits.kind === StringKind.WideChar
          ) {
            code = "676";
          } else {
            code = "612";
          }
        } else if (TypeDescriptions.isPicture(boundDescription)) {
          code = "652";
        }
        acceptor(
          diagnosticFromCode(
            PLICodes.Severe.IBM1948I,
            bound.token,
            "CONVERSION",
            code,
          ),
        );
        return "invalid";
      }
      //TODO assignability check

      if (typeof bound.value === "number") {
        return bound.value;
      } else {
        return "computed";
      }
    }
  }
  return undefined;
}
