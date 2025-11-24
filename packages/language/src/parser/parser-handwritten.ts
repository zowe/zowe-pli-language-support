import { Parser } from "./parser-types";
import * as ast from "../syntax-tree/ast";
import { IRecognitionException } from "chevrotain";
import { finalParserState, ParserState } from "./parser-state";
import * as tokens from "./tokens";
import { CstNodeKind } from "../syntax-tree/cst";

export class HandwrittenParser implements Parser<ast.Program, tokens.Token> {
    private _input: tokens.Token[] = [];
    set input(value: tokens.Token[]) {
        this._input = value;
    }
    get errors(): IRecognitionException[] {
        return [];
    }

    parse(): ast.Program {
        const state = finalParserState(this._input);
        return this.rulePliProgram(state);
    }

    rulePliProgram(state: ParserState): ast.Program {
        const program: ast.Program = {
            kind: ast.SyntaxKind.Program,
            container: null,
            statements: [],
        };
        // Parse one or more packages (or top-level statements)
        while (!state.eof) {
            const statement = this.ruleStatement(state);
            program.statements.push(statement);
        }
        return program;
    }

    ruleStatement(state: ParserState): ast.Statement {
        const element: ast.Statement = {
            kind: ast.SyntaxKind.Statement,
            container: null,
            condition: null,
            labels: [],
            value: null,
        };

        if (state.canConsume(tokens.OpenParen)) {
            element.condition = this.ruleConditionPrefix(state);
        }

        while (state.canConsume(tokens.ID)) {
            element.labels.push(this.ruleLabelPrefix(state));
        }

        element.value = this.ruleUnit(state);

        return element;
    }

    ruleUnit(state: ParserState): ast.Unit {
        // TODO: Implement the actual parsing logic for Unit (OR_RULE)
        // This should dispatch to the correct statement type based on the next token
        return undefined!;
    }

    ruleLabelPrefix(state: ParserState): ast.LabelPrefix {
        const element: ast.LabelPrefix = {
            kind: ast.SyntaxKind.LabelPrefix,
            container: null,
            nameToken: null,
            name: null,
        };

        const idToken = state.consume(element, CstNodeKind.LabelPrefix_Name, tokens.ID)!;
        element.name = idToken.image;
        element.nameToken = idToken;

        state.consume(element, CstNodeKind.LabelPrefix_Colon, tokens.Colon);

        return element;
    }

    ruleConditionPrefix(state: ParserState): ast.ConditionPrefix {
        const element: ast.ConditionPrefix = {
            kind: ast.SyntaxKind.ConditionPrefix,
            container: null,
            items: [],
        };

        do {
            state.consume(element, CstNodeKind.ConditionPrefix_OpenParen, tokens.OpenParen);
            element.items.push(this.ruleConditionPrefixItem(state));
            state.consume(element, CstNodeKind.ConditionPrefix_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.ConditionPrefix_Colon, tokens.Colon);
        } while (state.canConsume(tokens.OpenParen));

        return element;
    }

    ruleConditionPrefixItem(state: ParserState): ast.ConditionPrefixItem {
        const element: ast.ConditionPrefixItem = {
            kind: ast.SyntaxKind.ConditionPrefixItem,
            container: null,
            conditions: [],
        };

        element.conditions.push(this.ruleCondition(state));

        while (state.canConsume(tokens.Comma)) {
            state.consume(element, CstNodeKind.ConditionPrefixItem_Comma, tokens.Comma);
            element.conditions.push(this.ruleCondition(state));
        }

        return element;
    }

    ruleCondition(state: ParserState): ast.KeywordCondition | ast.NamedCondition | ast.FileReferenceCondition {
        switch(state.token?.tokenTypeIdx) {
            case tokens.KeywordConditions.tokenTypeIdx:
                return this.ruleKeywordCondition(state);
            case tokens.CONDITION.tokenTypeIdx:
                return this.ruleNamedCondition(state);
            case tokens.FileReferenceConditions.tokenTypeIdx:
                return this.ruleFileReferenceCondition(state);
            default:
                throw new Error("Unexpected token in condition");
        }
    }
}

export const HandwrittenParserInstance = new HandwrittenParser();
