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

import { PliParserInstance } from '../packages/language/src/parser/parser';
import { createSyntaxDiagramsCode } from 'chevrotain';
import { writeFileSync } from 'fs';

const gast = PliParserInstance.getSerializedGastProductions();
const syntaxDiagram = createSyntaxDiagramsCode(gast);
writeFileSync('syntax-diagrams.html', syntaxDiagram);
