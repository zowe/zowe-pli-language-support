import { IToken, TokenType, createTokenInstance } from "chevrotain";
import { Pl1Services } from "../pli-module";
import { Instructions, PPInstruction, Values } from "./pli-preprocessor-instructions";
import { PPActivate, PPAssign, PPBinaryExpression, PPDeactivate, PPDeclaration, PPDoGroup, PPExpression, PPIfStatement, PPNumber, PPPliStatement, PPStatement, PPString, PPVariableUsage } from "./pli-preprocessor-ast";
import { assertUnreachable } from "langium";

export class PliPreprocessorGenerator {
    private readonly numberTokenType: TokenType;

    constructor(services: Pl1Services) {
        this.numberTokenType = services.parser.PreprocessorLexer.numberTokenType;
    }

    generateProgram(statements: PPStatement[]): PPInstruction[] {
        const program: PPInstruction[] = [];
        for (const statement of statements) {
            this.handleStatement(statement, program);
        }
        program.push(Instructions.halt());
        return program;
    }

    handleStatement(statement: PPStatement, program: PPInstruction[]) {
        switch (statement.type) {
            case 'activate': this.handleActivate(statement, program); break;
            case 'deactivate': this.handleDeactivate(statement, program); break;
            case 'assign': this.handleAssignment(statement, program); break;
            case 'declare':
                for (const declare of statement.declarations) {
                    this.handleDeclaration(declare, program);
                }
                break;
            case 'skip':
            case 'directive':
                //do nothing    
                break;
            case 'if': this.handleIf(statement, program); break;
            case 'do': this.handleDoGroup(statement, program); break;
            case 'pli': this.handlePliCode(statement, program); break;
            default:
                assertUnreachable(statement);
        }
    }

    handlePliCode(statement: PPPliStatement, program: PPInstruction[]) {
        let list: IToken[] = [];
        let hadConcat = false;
        statement.tokens.forEach((token, index) => {
            if (token.image === '%' || token.image === ';') {
                if (token.image === ';') {
                    list.push(token);
                }
                program.push(Instructions.push(list));
                program.push(Instructions.scan());
                if (hadConcat) {
                    program.push(Instructions.concat());
                    //TODO really needed here?
                    program.push(Instructions.scan());
                    hadConcat = false;
                }
                if (token.image === '%') {
                    hadConcat = true;
                } else { // token.image === ';'
                    program.push(Instructions.print());
                }
                list = [];
            } else {
                list.push(token);
            }
        });
    }

    handleDoGroup(doGroup: PPDoGroup, program: PPInstruction[]) {
        for (const statement of doGroup.statements) {
            this.handleStatement(statement, program);
        }
    }

    handleIf(statement: PPIfStatement, program: PPInstruction[]) {
        /** with else:                  without else:
         *  PUSH condition              PUSH condition 
         *  PUSH [TRUE]                 PUSH [TRUE]
         *  BRANCHIFNEQ $else$          BRANCHIFNEQ $exit$
         *  <thenStatement>             <thenStatement>
         *  GOTO $exit$                 $exit$:   
         *  $else$:
         *      <elseStatement>
         *  $exit$:                      
         */
        this.handleExpression(statement.condition, program);
        program.push(Instructions.push(Values.True()));
        if(statement.elseUnit) {
            const $else$ = Instructions.branchIfNotEqual(-1);
            program.push($else$);
            this.handleStatement(statement.thenUnit, program);
            const $exit$ = Instructions.goto(-1);
            program.push($exit$);
            $else$.address = program.length;
            this.handleStatement(statement.elseUnit, program);
            $exit$.address = program.length;
        } else {
            const $exit$ = Instructions.branchIfNotEqual(-1);
            program.push($exit$);
            this.handleStatement(statement.thenUnit, program);
            $exit$.address = program.length;
        }
    }

    handleDeactivate(statement: PPDeactivate, program: PPInstruction[]) {
        for (const name of statement.variables) {
            program.push(Instructions.deactivate(name));
        }
    }

    handleActivate(statement: PPActivate, program: PPInstruction[]) {
        for (const [name, scanMode] of Object.entries(statement.variables)) {
            program.push(Instructions.activate(name, scanMode));
        }
    }

    handleAssignment(statement: PPAssign, program: PPInstruction[]) {
        this.handleExpression(statement.value, program);
        program.push(Instructions.set(statement.name));
    }

    handleExpression(expression: PPExpression, program: PPInstruction[]) {
        switch (expression.type) {
            case "string": {
                this.handleStringLiteral(expression, program);
                break;
            }
            case "number": {
                this.handleNumberLiteral(expression, program);
                break;
            }
            case 'variable-usage': {
                this.handleVariableUsage(expression, program);
                break;
            }
            case 'binary': {
                this.handleBinaryExpression(expression, program);
                break;
            }
        }

    }

    handleBinaryExpression(expression: PPBinaryExpression, program: PPInstruction[]) {
        this.handleExpression(expression.lhs, program);
        this.handleExpression(expression.rhs, program);
        program.push(Instructions.compute(expression.operator));
    }

    handleVariableUsage(expression: PPVariableUsage, program: PPInstruction[]) {
        program.push(Instructions.get(expression.variableName));
    }

    handleNumberLiteral(expression: PPNumber, program: PPInstruction[]) {
        program.push(Instructions.push([createTokenInstance(this.numberTokenType, expression.value.toString(), 0, 0, 0, 0, 0, 0)]));
    }

    handleStringLiteral(expression: PPString, program: PPInstruction[]) {
        program.push(Instructions.push(expression.value));
    }

    handleDeclaration(decl: PPDeclaration, program: PPInstruction[]) {
        switch (decl.type) {
            case 'builtin':
                //TODO builtin declarations
                break;
            case 'entry':
                //TODO entry declarations
                break;
            case "character":
            case "fixed": {
                program.push(Instructions.push(
                    decl.type === "character"
                    ? []
                    : [createTokenInstance(this.numberTokenType, "0", 0, 0, 0, 0, 0, 0)]
                ));
                program.push(Instructions.set(decl.name));
                program.push(Instructions.activate(decl.name, decl.scanMode));
                break;
            }
        }
    }

    // protected isIdentifier(token: IToken) {
    //     return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    // }
}