import { TokenType, TokenVocabulary } from "chevrotain";
import { DefaultTokenBuilder, Grammar, GrammarUtils, RegExpUtils, stream, TokenBuilderOptions } from "langium";

export class PliTokenBuilder extends DefaultTokenBuilder {

    override buildTokens(grammar: Grammar, options?: TokenBuilderOptions): TokenVocabulary {
        const reachableRules = stream(GrammarUtils.getAllReachableRules(grammar, false));
        const terminalTokens: TokenType[] = this.buildTerminalTokens(reachableRules);
        const tokens: TokenType[] = this.buildKeywordTokens(reachableRules, terminalTokens, options);
        const id = terminalTokens.find(e => e.name === 'ID')!;

        for (const keywordToken of tokens) {
            if (/[a-zA-Z]/.test(keywordToken.name)) {
                keywordToken.CATEGORIES = [id];
            }
        }

        terminalTokens.forEach(terminalToken => {
            const pattern = terminalToken.PATTERN;
            if (typeof pattern === 'object' && pattern && 'test' in pattern && RegExpUtils.isWhitespace(pattern)) {
                tokens.unshift(terminalToken);
            } else {
                tokens.push(terminalToken);
            }
        });
        return tokens;
    }
}
