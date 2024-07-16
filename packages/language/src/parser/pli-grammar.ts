// import { AstUtils, GrammarAST, GrammarUtils, stream, Stream } from "langium";
import { GrammarAST } from "langium";
import { Pl1Grammar } from "../generated/grammar";

export function getPliGrammar(): GrammarAST.Grammar {
    const grammar = Pl1Grammar();
    // const featureId = grammar.rules.find(f => f.name === 'FeatureID') as GrammarAST.ParserRule;
    // const rules = GrammarUtils.getAllReachableRules(grammar, false);
    // const keywords = findKeywords(stream(rules));
    // const alts: GrammarAST.Alternatives = {
    //     $type: "Alternatives",
    //     elements: keywords.map(keyword => ({
    //         $type: "Keyword",
    //         value: keyword
    //     }))
    // }
    // alts.elements.push(featureId.definition);
    // featureId.definition = alts;
    return grammar;
}

// function findKeywords(rules: Stream<GrammarAST.AbstractRule>): string[] {
//     return rules
//         // We filter by parser rules, since keywords in terminal rules get transformed into regex and are not actual tokens
//         .filter(GrammarAST.isParserRule)
//         .flatMap(rule => AstUtils.streamAllContents(rule).filter(GrammarAST.isKeyword))
//         .map(e => e.value)
//         .distinct()
//         .filter(e => /[a-zA-Z]/.test(e))
//         .toArray();
// }
