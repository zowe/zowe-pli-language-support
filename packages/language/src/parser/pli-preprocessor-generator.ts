import { IToken, TokenType, createTokenInstance } from "chevrotain";
import { Pl1Services } from "../pli-module";
import { Instructions, Values } from "./pli-preprocessor-instructions";
import { PPActivate, PPAssign, PPBinaryExpression, PPDeactivate, PPDeclaration, PPDoForever, PPDoGroup, PPDoUntilWhile, PPDoWhileUntil, PPExpression, PPGoTo, PPIfStatement, PPNumber, PPPliStatement, PPStatement, PPString, PPVariableUsage } from "./pli-preprocessor-ast";
import { assertUnreachable } from "langium";
import { PliPreprocessorProgram, PliPreprocessorProgramBuilder } from "./pli-preprocessor-program-builder";

export class PliPreprocessorGenerator {
    private readonly numberTokenType: TokenType;

    constructor(services: Pl1Services) {
        this.numberTokenType = services.parser.PreprocessorLexer.numberTokenType;
    }

    generateProgram(statements: PPStatement[]): PliPreprocessorProgram {
        const builder = new PliPreprocessorProgramBuilder();
        for (const statement of statements) {
            this.handleStatement(statement, builder);
        }
        builder.pushInstruction(Instructions.halt());
        return builder.build();
    }

    handleStatement(statement: PPStatement, builder: PliPreprocessorProgramBuilder) {
        switch (statement.type) {
            case 'labeled':
                const label = builder.createLabel(statement.label);
                builder.pushLabel(label);
                this.handleStatement(statement.statement, builder);
                break;
            case 'activate': this.handleActivate(statement, builder); break;
            case 'deactivate': this.handleDeactivate(statement, builder); break;
            case 'assign': this.handleAssignment(statement, builder); break;
            case 'declare':
                for (const declare of statement.declarations) {
                    this.handleDeclaration(declare, builder);
                }
                break;
            case 'skip':
            case 'directive':
                //do nothing
                break;
            case 'if': this.handleIf(statement, builder); break;
            case 'do': this.handleDoGroup(statement, builder); break;
            case 'pli': this.handlePliCode(statement, builder); break;
            case 'empty':
                break;
            case 'do-until-while': this.handleDoUntilWhile(statement, builder); break;
            case 'do-while-until': this.handleDoWhileUntil(statement, builder); break;
            case "do-forever": this.handleDoForever(statement, builder); break;
            case "include": this.handleStatements(statement.subProgram.statements, builder); break;
            case "goto": this.handleGoTo(statement, builder); break;
            default: assertUnreachable(statement);
        }
    }

    handleGoTo(statement: PPGoTo, builder: PliPreprocessorProgramBuilder) {
        const label = builder.createLabel(statement.label);
        builder.pushInstruction(Instructions.goto(label));
    }

    handleDoForever(statement: PPDoForever, builder: PliPreprocessorProgramBuilder) {
        /**
         * $start$: <BODY>
         * GOTO $start$
         */
        const $start$ = builder.createLabel();
        builder.pushLabel($start$);
        this.handleStatements(statement.body, builder);
        builder.pushInstruction(Instructions.goto($start$));
    }

    handleDoUntilWhile(statement: PPDoUntilWhile, builder: PliPreprocessorProgramBuilder) {
        /**
         * $until$: <EXPRESSION-UNTIL>
         *          PUSH [FALSE]
         *          BRANCHIFNEQ $end$
         * {if while != undefined}
         *          <EXPRESSION-WHILE>
         *          PUSH [TRUE]
         *          BRANCHIFNEQ $end$
         * {/if}
         *          <BODY>
         *          GOTO $until$
         * $end$:
         */
        const $until$ = builder.createLabel();
        builder.pushLabel($until$);
        this.handleExpression(statement.conditionUntil, builder);
        builder.pushInstruction(Instructions.push(Values.False()));
        const $end$ = builder.createLabel();
        builder.pushInstruction(Instructions.branchIfNotEqual($end$));
        if (statement.conditionWhile) {
            this.handleExpression(statement.conditionWhile, builder);
            builder.pushInstruction(Instructions.push(Values.True()));
            builder.pushInstruction(Instructions.branchIfNotEqual($end$));
        }
        this.handleStatements(statement.body, builder);
        builder.pushInstruction(Instructions.goto($until$));
        builder.pushLabel($end$);
    }

    handleDoWhileUntil(statement: PPDoWhileUntil, builder: PliPreprocessorProgramBuilder) {
        /**
         * $while$: <EXPRESSION-WHILE>
         *          PUSH [TRUE]
         *          BRANCHIFNEQ $end$
         * {if until != undefined}
         *          <EXPRESSION-UNTIL>
         *          PUSH [FALSE]
         *          BRANCHIFNEQ $end$
         * {/if}
         *          <BODY>
         *          GOTO $while$
         * $end$:
         */
        const $while$ = builder.createLabel();
        builder.pushLabel($while$);
        this.handleExpression(statement.conditionWhile, builder);
        builder.pushInstruction(Instructions.push(Values.True()));
        const $end$ = builder.createLabel();
        builder.pushInstruction(Instructions.branchIfNotEqual($end$));
        if (statement.conditionUntil) {
            this.handleExpression(statement.conditionUntil, builder);
            builder.pushInstruction(Instructions.push(Values.False()));
            builder.pushInstruction(Instructions.branchIfNotEqual($end$));
        }
        this.handleStatements(statement.body, builder);
        builder.pushInstruction(Instructions.goto($while$));
        builder.pushLabel($end$);
    }

    handlePliCode(statement: PPPliStatement, builder: PliPreprocessorProgramBuilder) {
        let list: IToken[] = [];
        let hadConcat = false;
        statement.tokens.forEach((token) => {
            if (token.image === '%' || token.image === ';') {
                if (token.image === ';') {
                    list.push(token);
                }
                builder.pushInstruction(Instructions.push(list));
                builder.pushInstruction(Instructions.scan());
                if (hadConcat) {
                    builder.pushInstruction(Instructions.concat());
                    //TODO really needed here?
                    builder.pushInstruction(Instructions.scan());
                    hadConcat = false;
                }
                if (token.image === '%') {
                    hadConcat = true;
                } else { // token.image === ';'
                    builder.pushInstruction(Instructions.print());
                }
                list = [];
            } else {
                list.push(token);
            }
        });
    }

    handleDoGroup(doGroup: PPDoGroup, builder: PliPreprocessorProgramBuilder) {
        this.handleStatements(doGroup.statements, builder);
    }

    handleStatements(statements: PPStatement[], builder: PliPreprocessorProgramBuilder) {
        for (const statement of statements) {
            this.handleStatement(statement, builder);
        }
    }

    handleIf(statement: PPIfStatement, builder: PliPreprocessorProgramBuilder) {
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
        this.handleExpression(statement.condition, builder);
        builder.pushInstruction(Instructions.push(Values.True()));
        if (statement.elseUnit) {
            const $else$ = builder.createLabel();
            builder.pushInstruction(Instructions.branchIfNotEqual($else$));
            this.handleStatement(statement.thenUnit, builder);
            const $exit$ = builder.createLabel();
            builder.pushInstruction(Instructions.goto($exit$));
            builder.pushLabel($else$);
            this.handleStatement(statement.elseUnit, builder);
            builder.pushLabel($exit$);
        } else {
            const $exit$ = builder.createLabel();
            builder.pushInstruction(Instructions.branchIfNotEqual($exit$));
            this.handleStatement(statement.thenUnit, builder);
            builder.pushLabel($exit$);
        }
    }

    handleDeactivate(statement: PPDeactivate, builder: PliPreprocessorProgramBuilder) {
        for (const name of statement.variables) {
            builder.pushInstruction(Instructions.deactivate(name));
        }
    }

    handleActivate(statement: PPActivate, builder: PliPreprocessorProgramBuilder) {
        for (const [name, scanMode] of Object.entries(statement.variables)) {
            builder.pushInstruction(Instructions.activate(name, scanMode));
        }
    }

    handleAssignment(statement: PPAssign, builder: PliPreprocessorProgramBuilder) {
        this.handleExpression(statement.value, builder);
        builder.pushInstruction(Instructions.set(statement.name));
    }

    handleExpression(expression: PPExpression, builder: PliPreprocessorProgramBuilder) {
        switch (expression.type) {
            case "string": {
                this.handleStringLiteral(expression, builder);
                break;
            }
            case "number": {
                this.handleNumberLiteral(expression, builder);
                break;
            }
            case 'variable-usage': {
                this.handleVariableUsage(expression, builder);
                break;
            }
            case 'binary': {
                this.handleBinaryExpression(expression, builder);
                break;
            }
        }

    }

    handleBinaryExpression(expression: PPBinaryExpression, builder: PliPreprocessorProgramBuilder) {
        this.handleExpression(expression.lhs, builder);
        this.handleExpression(expression.rhs, builder);
        builder.pushInstruction(Instructions.compute(expression.operator));
    }

    handleVariableUsage(expression: PPVariableUsage, builder: PliPreprocessorProgramBuilder) {
        builder.pushInstruction(Instructions.get(expression.variableName));
    }

    handleNumberLiteral(expression: PPNumber, builder: PliPreprocessorProgramBuilder) {
        builder.pushInstruction(Instructions.push([createTokenInstance(this.numberTokenType, expression.value.toString(), 0, 0, 0, 0, 0, 0)]));
    }

    handleStringLiteral(expression: PPString, builder: PliPreprocessorProgramBuilder) {
        builder.pushInstruction(Instructions.push(expression.value));
    }

    handleDeclaration(decl: PPDeclaration, builder: PliPreprocessorProgramBuilder) {
        switch (decl.type) {
            case 'builtin':
                //TODO builtin declarations
                break;
            case 'entry':
                //TODO entry declarations
                break;
            case "character":
            case "fixed": {
                builder.pushInstruction(Instructions.push(
                    decl.type === "character"
                        ? []
                        : [createTokenInstance(this.numberTokenType, "0", 0, 0, 0, 0, 0, 0)]
                ));
                builder.pushInstruction(Instructions.set(decl.name));
                builder.pushInstruction(Instructions.activate(decl.name, decl.scanMode));
                break;
            }
        }
    }
}