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

import { CustomPatternMatcherFunc, Lexer, TokenPattern, TokenType, TokenVocabulary } from "chevrotain";
import {
  TokenBuilder,
  Grammar,
  GrammarUtils,
  RegExpUtils,
  stream,
  TokenBuilderOptions,
  LexingReport,
  AstUtils,
  GrammarAST,
  LexingDiagnostic,
  Stream,
} from "langium";

export class PliTokenBuilder implements TokenBuilder {
    private diagnostics: LexingDiagnostic[] = [];

    buildTokens(grammar: Grammar, options?: TokenBuilderOptions): TokenVocabulary {
        const reachableRules = stream(GrammarUtils.getAllReachableRules(grammar, false));
        const terminalTokens: TokenType[] = this.buildTerminalTokens(reachableRules);
        const tokens: TokenType[] = this.buildKeywordTokens(reachableRules, terminalTokens, options);

        const id = terminalTokens.find((e) => e.name === "ID")!;
        for (const keywordToken of tokens) {
          if (/[a-zA-Z]/.test(keywordToken.name)) {
            keywordToken.CATEGORIES = [id];
          }
        }

        terminalTokens.forEach(terminalToken => {
            const pattern = terminalToken.PATTERN;
            if (typeof pattern === 'object' && pattern && 'test' in pattern && RegExpUtils.isWhitespace(pattern) || terminalToken.name === 'ExecFragment') {
                tokens.unshift(terminalToken);
            } else {
                tokens.push(terminalToken);
            }
        });
        const execFragment = tokens.find(e => e.name === 'ExecFragment')!;
        execFragment.START_CHARS_HINT = ['S', 'C'];
        return tokens.map(r => this.makeSticky(r));
    }
    makeSticky(tokenType: TokenType): TokenType {
        if(tokenType.PATTERN instanceof RegExp) {
            return {
                ...tokenType,
                PATTERN: new RegExp(tokenType.PATTERN.source, `${tokenType.PATTERN.flags}y`)
            }
        }
        return tokenType;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flushLexingReport(text: string): LexingReport {
        return { diagnostics: this.popDiagnostics() };
    }

    protected popDiagnostics(): LexingDiagnostic[] {
        const diagnostics = [...this.diagnostics];
        this.diagnostics = [];
        return diagnostics;
    }

    protected buildTerminalTokens(rules: Stream<GrammarAST.AbstractRule>): TokenType[] {
        return rules.filter(GrammarAST.isTerminalRule).filter(e => !e.fragment)
            .map(terminal => this.buildTerminalToken(terminal)).toArray();
    }

    protected buildTerminalToken(terminal: GrammarAST.TerminalRule): TokenType {
        const regex = GrammarUtils.terminalRegex(terminal);
        const pattern = this.requiresCustomPattern(regex) ? this.regexPatternFunction(regex) : regex;
        const tokenType: TokenType = {
            name: terminal.name,
            PATTERN: pattern,
            LINE_BREAKS: true
        };
        if (terminal.hidden) {
            // Only skip tokens that are able to accept whitespace
            tokenType.GROUP = RegExpUtils.isWhitespace(regex) ? Lexer.SKIPPED : 'hidden';
        }
        return tokenType;
    }

    protected requiresCustomPattern(regex: RegExp): boolean {
        if (regex.flags.includes('u') || regex.flags.includes('s')) {
            // Unicode and dotall regexes are not supported by Chevrotain.
            return true;
        } else if (regex.source.includes('?<=') || regex.source.includes('?<!')) {
            // Negative and positive lookbehind are not supported by Chevrotain yet.
            return true;
        } else {
            return false;
        }
    }

    protected regexPatternFunction(regex: RegExp): CustomPatternMatcherFunc {
        const stickyRegex = new RegExp(regex, regex.flags + 'y');
        return (text, offset) => {
            stickyRegex.lastIndex = offset;
            const execResult = stickyRegex.exec(text);
            return execResult;
        };
    }

    protected buildKeywordTokens(rules: Stream<GrammarAST.AbstractRule>, terminalTokens: TokenType[], options?: TokenBuilderOptions): TokenType[] {
        return rules
            // We filter by parser rules, since keywords in terminal rules get transformed into regex and are not actual tokens
            .filter(GrammarAST.isParserRule)
            .flatMap(rule => AstUtils.streamAllContents(rule).filter(GrammarAST.isKeyword))
            .distinct(e => e.value).toArray()
            // Sort keywords by descending length
            .sort((a, b) => b.value.length - a.value.length)
            .map(keyword => this.buildKeywordToken(keyword, terminalTokens, Boolean(options?.caseInsensitive)));
    }

    protected buildKeywordToken(keyword: GrammarAST.Keyword, terminalTokens: TokenType[], caseInsensitive: boolean): TokenType {
        return {
            name: keyword.value,
            PATTERN: this.buildKeywordPattern(keyword, caseInsensitive),
            LONGER_ALT: this.findLongerAlt(keyword, terminalTokens)
        };
    }

    protected buildKeywordPattern(keyword: GrammarAST.Keyword, caseInsensitive: boolean): TokenPattern {
        return caseInsensitive ?
            new RegExp(RegExpUtils.getCaseInsensitivePattern(keyword.value)) :
            keyword.value;
    }

    protected findLongerAlt(keyword: GrammarAST.Keyword, terminalTokens: TokenType[]): TokenType[] {
        return terminalTokens.reduce((longerAlts: TokenType[], token) => {
            const pattern = token?.PATTERN as RegExp;
            if (pattern?.source && RegExpUtils.partialMatches('^' + pattern.source + '$', keyword.value)) {
                longerAlts.push(token);
            }
            return longerAlts;
        }, []);
    }
}
