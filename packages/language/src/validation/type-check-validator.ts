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

import * as ast from "../syntax-tree/ast";
import { CompilationUnit } from "../workspace/compilation-unit";
import { ValidationAcceptor } from "./validator";

export function typeCheckDeclareStatement(
  declareStatement: ast.DeclareStatement,
  _acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  compilationUnit.services.inferer.inferType(declareStatement, compilationUnit);
}
