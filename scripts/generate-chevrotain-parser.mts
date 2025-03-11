import { createLangiumGrammarServices, collectAst, InterfaceType, Property, PropertyType, isStringType, isArrayType, isPropertyUnion, isPrimitiveType, isValueType, isReferenceType, UnionType } from 'langium/grammar';
import { NodeFileSystem } from 'langium/node';
import { parseHelper } from 'langium/test';
import { AstUtils, Grammar, GrammarAST, GrammarUtils, MultiMap, RegExpUtils } from 'langium';
import { EOL, expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { readFileSync, writeFileSync } from 'fs';

const services = createLangiumGrammarServices({
    fileSystemProvider: NodeFileSystem.fileSystemProvider
});
const parse = parseHelper(services.grammar);

const file = readFileSync('../packages/language/src/pli.langium', 'utf8');
const grammar = (await parse(file)).parseResult.value as Grammar;

function buildCstNodeNames(): Map<GrammarAST.AbstractElement, string> {
    const ruleCallsAndKeywords = AstUtils.streamAllContents(grammar).filter(e => GrammarAST.isRuleCall(e) || GrammarAST.isKeyword(e)).toArray();
    const names = new Map<GrammarAST.AbstractElement, string>();
    const all = new Map<string, number>();
    const ruleMap = new MultiMap<GrammarAST.ParserRule, GrammarAST.AbstractElement>();
    for (const element of ruleCallsAndKeywords) {
        const parserRule = AstUtils.getContainerOfType(element, GrammarAST.isParserRule);
        if (parserRule) {
            ruleMap.add(parserRule, element);
        }
    }

    for (const [rule, elements] of ruleMap.entriesGroupedByKey()) {
        for (const element of elements) {
            const name: string[] = [rule.name];
            const assignmentNode = AstUtils.getContainerOfType(element, GrammarAST.isAssignment);
            if (assignmentNode) {
                name.push(assignmentNode.feature);
            }
            if (GrammarAST.isRuleCall(element)) {
                name.push(element.rule.ref!.name);
            } else if (GrammarAST.isKeyword(element)) {
                name.push(getKeywordName(element));
            }
            const fullName = name.join('_');
            let index = all.get(fullName) || 0;
            all.set(fullName, index + 1);
            names.set(element, fullName + '_' + index);
        }
    }

    return names;
}

function generateParser(): GeneratorNode {
    const parserRules = grammar.rules.filter(GrammarAST.isParserRule);
    return expandToNode`
    import { AbstractParser } from './abstract-parser';
    import * as tokens from './tokens';
    import * as ast from './ast';

    export class PliParser extends AbstractParser {
        constructor() {
            super(tokens.all);
            this.performSelfAnalysis();
        }

        ${joinToNode(parserRules, (rule) => generateParserRule(rule))}
    }
    `
}

interface ParserContext {
    consume: Map<string, number>;
    subrule: Map<string, number>;
    or: number;
    star: number;
    plus: number;
    option: number;
}

function generateParserRule(rule: GrammarAST.ParserRule): GeneratorNode {
    const context: ParserContext = {
        consume: new Map(),
        subrule: new Map(),
        or: 1,
        star: 1,
        plus: 1,
        option: 1
    };
    return expandToNode`
    private create${rule.name}(): ast.${GrammarUtils.getTypeName(rule)} {
        return {} as any;
    }

    ${rule.name} = this.RULE('${rule.name}', () => {
        const element = this.create${rule.name}();

        ${generateElement(rule.definition, context)}

        return element;
    });
    `
}

function generateAlternative(alt: GrammarAST.Alternatives, context: ParserContext): GeneratorNode {
    return expandToNode`
    this.OR${context.or++}([
        ${joinToNode(alt.elements, (el) => expandToNode`
        {
            ALT: () => {
                ${generateElement(el, context)} 
            }
        },`, { appendNewLineIfNotEmpty: true })}
    ]);
    `
}

function generateElement(el: GrammarAST.AbstractElement, context: ParserContext): GeneratorNode {
    let node: GeneratorNode | undefined;
    if (GrammarAST.isAction(el)) {
        return expandToNode`/* Action: ${el.inferredType?.name}${el.feature ? '.' + el.feature : ''} */`;
    } else if (GrammarAST.isAlternatives(el)) {
        node = generateAlternative(el, context);
    } else if (GrammarAST.isKeyword(el)) {
        const name = getKeywordName(el);
        const index = context.consume.get(name) || 1;
        context.consume.set(name, index + 1);
        node = expandToNode`this.CONSUME${index}(tokens.${name});`;
    } else if (GrammarAST.isRuleCall(el)) {
        const rule = el.rule.ref;
        if (!rule) {
            throw new Error('Unknown rule ' + el.rule.$refText);
        }
        if (GrammarAST.isParserRule(rule)) {
            const index = context.subrule.get(rule.name) || 1;
            context.subrule.set(rule.name, index + 1);
            node = expandToNode`this.SUBRULE${index}(this.${rule.name});`;
        } else {
            const index = context.consume.get(rule.name) || 1;
            context.consume.set(rule.name, index + 1);
            node = expandToNode`this.CONSUME${index}(tokens.${rule.name});`;
        }
    } else if (GrammarAST.isGroup(el)) {
        node = joinToNode(el.elements, (el) => generateElement(el, context), {
            appendNewLineIfNotEmpty: true
        })!;
    } else if (GrammarAST.isAssignment(el)) {
        // TODO: handle assignment
        node = generateElement(el.terminal, context);
    } else if (GrammarAST.isCrossReference(el)) {
        node = generateCrossReference(el, context);
    }
    if (!node) {
        throw new Error('Non exhaustive generate ' + el.$type);
    }
    if (el.cardinality === '*') {
        node = expandToNode`
        this.MANY${context.star++}(() => {
            ${node}
        });`;
    } else if (el.cardinality === '+') {
        node = expandToNode`
        this.AT_LEAST_ONE${context.plus++}(() => {
            ${node}
        });`;
    } else if (el.cardinality === '?') {
        node = expandToNode`
        this.OPTION${context.option++}(() => {
            ${node}
        });`;
    }
    return node;
}

function generateCrossReference(reference: GrammarAST.CrossReference, context: ParserContext, terminal = reference.terminal): GeneratorNode {
    if (!terminal) {
        if (!reference.type.ref) {
            throw new Error('Could not resolve reference to type: ' + reference.type.$refText);
        }
        const assignment = GrammarUtils.findNameAssignment(reference.type.ref);
        const assignTerminal = assignment?.terminal;
        if (!assignTerminal) {
            throw new Error('Could not find name assignment for type: ' + reference.type.ref.name);
        }
        return generateCrossReference(reference, context, assignTerminal);
    } else if (GrammarAST.isRuleCall(terminal)) {
        const terminalRuleName = terminal.rule.ref?.name;
        if (!terminalRuleName) {
            throw new Error('Could not resolve reference to rule: ' + terminal.rule.$refText);
        }
        const index = context.consume.get(terminalRuleName) || 1;
        context.consume.set(terminalRuleName, index + 1);
        return expandToNode`this.CONSUME${index}(tokens.${terminalRuleName});`;
    } else if (GrammarAST.isKeyword(terminal)) {
        const name = getKeywordName(terminal);
        const index = context.consume.get(name) || 1;
        context.consume.set(name, index + 1);
        return expandToNode`this.CONSUME${index}(tokens.${name});`;
    }
    return generateElement(terminal, context);
}

const replacementMap = {
    ':': 'Colon',
    '.': 'Dot',
    ',': 'Comma',
    ';': 'Semicolon',
    '(': 'OpenParen',
    ')': 'CloseParen',
    '[': 'OpenBracket',
    ']': 'CloseBracket',
    '{': 'OpenBrace',
    '}': 'CloseBrace',
    '+': 'Plus',
    '*': 'Star',
    '/': 'Slash',
    '?': 'QuestionMark',
    '|': 'Pipe',
    '=': 'Equals',
    '!': 'ExclamationMark',
    '<': 'LessThan',
    '>': 'GreaterThan',
    '@': 'At',
    '#': 'Hash',
    '$': 'Dollar',
    '%': 'Percent',
    '^': 'Caret',
    '&': 'Ampersand',
    '~': 'Tilde',
    '_': 'Underscore',
    '-': 'Minus',
    '¬': 'Not'
}

function getKeywordName(keyword: GrammarAST.Keyword): string {
    let value = keyword.value;
    for (const [key, replacement] of Object.entries(replacementMap)) {
        value = value.replaceAll(key, replacement);
    }
    return value;
}

function generateTokenType(keyword: GrammarAST.Keyword, list: string[]): GeneratorNode {
    const name = getKeywordName(keyword);
    list.push(name);
    const hasLetter = /[a-zA-Z]/.test(keyword.value);
    const startsWithLetter = /^[a-zA-Z]/.test(keyword.value);
    let pattern = `'${keyword.value}'`;
    let categories = '';
    if (hasLetter) {
        pattern = `/${RegExpUtils.escapeRegExp(keyword.value)}/i`;
        categories = `,${EOL}    categories: [ID]`
    }
    if (startsWithLetter) {
        categories += `,${EOL}    longer_alt: ID`;
    }
    return expandToNode`
    export const ${name} = createToken({
        name: '${name}',
        pattern: ${pattern}${categories}
    });
    `
}

function generateTerminalToken(terminal: GrammarAST.TerminalRule, list: string[]): GeneratorNode {
    const name = terminal.name;
    list.push(name);

    return expandToNode`
    export const ${name} = createToken({
        name: '${name}',
        pattern: /${GrammarUtils.terminalRegex(terminal).source}/
    });
    `
}

function generateTokenTypes(): GeneratorNode {
    const keywords = AstUtils.streamAllContents(grammar).filter(GrammarAST.isKeyword).distinct(e => e.value).toArray().sort((a, b) => b.value.length - a.value.length);

    const terminalRules = grammar.rules.filter(GrammarAST.isTerminalRule).filter(e => !e.fragment);
    const keywordNames: string[] = [];
    const terminalNames: string[] = [];
    return expandToNode`
    import { createToken } from 'chevrotain';
    ${joinToNode(terminalRules, (terminal) => generateTerminalToken(terminal, terminalNames))}
    ${joinToNode(keywords, (keyword) => generateTokenType(keyword, keywordNames))}

    export const terminals = [
        ${joinToNode(terminalNames, {
            appendNewLineIfNotEmpty: true,
            separator: ','
        })}
    ];

    export const keywords = [
        ${joinToNode(keywordNames, {
            appendNewLineIfNotEmpty: true,
            separator: ','
        })}
    ];

    export const all = keywords.concat(terminals);
    `
}

function generateAst(): GeneratorNode {
    const { interfaces, unions } = collectAst(grammar);
    return expandToNode`
    import { CstNode } from "./cst-base";

    export enum SyntaxKind {
        ${joinToNode(interfaces, type => expandToNode`${type.name}`, {
            appendNewLineIfNotEmpty: true,
            separator: ','
        })}
    }

    export interface AstNode {
        cst?: CstNode;
    }
    
    export type Reference<T> = T;

    export type SyntaxNode =
        ${joinToNode(interfaces, (type) => type.name, {
            appendNewLineIfNotEmpty: true,
            separator: ' |'
        })};

    ${joinToNode(unions, (type) => generateUnion(type), {
        appendNewLineIfNotEmpty: true
    })}

    ${joinToNode(interfaces, (type) => generateInterface(type), {
        appendNewLineIfNotEmpty: true
    })}
    `
}

function generateUnion(value: UnionType): string {
    return value.toAstTypesString(false).split('\n')[0].trim();
}

function generateInterface(value: InterfaceType): GeneratorNode {
    return expandToNode`
    export interface ${value.name} extends AstNode {
        kind: SyntaxKind.${value.name};
        ${joinToNode(value.properties, (feature) => generateProperty(feature), {
            appendNewLineIfNotEmpty: true
        })}
    }
    `
}

function generateProperty(value: Property): GeneratorNode {
    return expandToNode`
    ${value.name}: ${generatePropertyType(value.type)};
    `
}

function generatePropertyType(value: PropertyType): string {
    if (isStringType(value)) {
        return `'${value.string}'`;
    } else if (isArrayType(value)) {
        if (value.elementType) {
            const elementType = generatePropertyType(value.elementType);
            if (elementType.includes('|')) {
                return `(${elementType})[]`;
            } else {
                return `${elementType}[]`;
            }
        } else {
            return 'unknown[]';
        }
    } else if (isPropertyUnion(value)) {
        return Array.from(new Set(value.types.map(e => generatePropertyType(e)))).join(' | ');
    } else if (isPrimitiveType(value)) {
        return value.primitive;
    } else if (isValueType(value)) {
        return value.value.name;
    } else if (isReferenceType(value)) {
        return `Reference<${generatePropertyType(value.referenceType)}>`;
    }
    throw new Error('Unsupported property type');
}

function generateCst(): GeneratorNode {
    return expandToNode`
    export enum CstNodeKind {
        ${joinToNode(cstNames.values(), {
            appendNewLineIfNotEmpty: true,
            separator: ','
        })}
    }
    `;
}

const cstNames = buildCstNodeNames();

// writeFileSync('./tokens.ts', toString(generateTokenTypes()));
writeFileSync('./parser.ts', toString(generateParser()));
writeFileSync('./ast.ts', toString(generateAst()));
// writeFileSync('./cst.ts', toString(generateCst()));