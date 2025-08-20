#!/usr/bin/env npx tsx
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

const gast = PliParserInstance.getSerializedGastProductions() as AST[];
const gbnf = createGbnf(gast);

console.log(gbnf);

// Type definitions based on the AST structure
// internal api, inferred from https://github.com/Chevrotain/chevrotain/blob/master/packages/chevrotain/diagrams/src/diagrams_builder.js
interface AST {
  // properties from chevrotain's api.d.ts ISerializedGast
  type: string;
  definition?: AST[];
  // inferred from https://github.com/Chevrotain/chevrotain/blob/master/packages/chevrotain/diagrams/src/diagrams_builder.js
  name: string;
  occurrenceInParent?: number;
  separator?: AST;
  nonTerminalName?: string;
}

function createGbnf(topRules: AST[]): string {
  const rules: string[] = [];
  
  topRules.forEach((production) => {
    const ruleName = production.name;
    const ruleBody = convertProductionToGbnf(production);
    rules.push(`${ruleName} ::= ${ruleBody}`);
  });
  
  return rules.join('\n\n') + '\n';
}

function convertProductionToGbnf(prod: AST): string {
  switch (prod.type) {
    case 'Rule':
      // A rule contains a sequence of definitions
      return convertDefinitionsToGbnf(prod.definition || []);
    
    case 'Terminal':
      return `"${prod.name}"`;
    
    case 'NonTerminal':
      // Reference to another rule
      return prod.nonTerminalName || prod.name;
    
    case 'Alternative':
      // Sequence of elements
      return convertDefinitionsToGbnf(prod.definition || []);
    
    case 'Option':
      // Optional element: X?
      const optContent = convertDefinitionsToGbnf(prod.definition || []);
      return `(${optContent})?`;
    
    case 'Repetition':
      // Zero or more: X*
      const repContent = convertDefinitionsToGbnf(prod.definition || []);
      return `(${repContent})*`;
    
    case 'RepetitionMandatory':
      // One or more: X+
      const repMandContent = convertDefinitionsToGbnf(prod.definition || []);
      return `(${repMandContent})+`;
    
    case 'Alternation':
      // Choice between alternatives: X | Y | Z
      const choices = (prod.definition || []).map(def => convertProductionToGbnf(def));
      return choices.length > 1 ? `(${choices.join(' | ')})` : choices[0] || '';
    
    case 'RepetitionWithSeparator':
      // MANY_SEP(separator, definition) === (definition (separator definition)*)?
      const sepDef = convertDefinitionsToGbnf(prod.definition || []);
      const sep = prod.separator ? convertProductionToGbnf(prod.separator) : '';
      return `(${sepDef} (${sep} ${sepDef})*)?`;
    
    case 'RepetitionMandatoryWithSeparator':
      // AT_LEAST_ONE_SEP(separator, definition) === definition (separator definition)*
      const sepMandDef = convertDefinitionsToGbnf(prod.definition || []);
      const sepMand = prod.separator ? convertProductionToGbnf(prod.separator) : '';
      return `${sepMandDef} (${sepMand} ${sepMandDef})*`;
    
    default:
      throw new Error(`Unknown production type: ${prod.type}`);
  }
}

function convertDefinitionsToGbnf(definitions: AST[]): string {
  return definitions.map(def => convertProductionToGbnf(def)).join(' ');
}
