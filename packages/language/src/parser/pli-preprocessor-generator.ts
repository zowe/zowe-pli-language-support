import { IToken, TokenType, createTokenInstance } from "chevrotain";
import { Pl1Services } from "../pli-module";
import { Instructions, PPIBranchIfNotEqual, PPInstruction, Values } from "./pli-preprocessor-instructions";
import { PPActivate, PPAssign, PPBinaryExpression, PPDeactivate, PPDeclaration, PPDoForever, PPDoGroup, PPDoUntilWhile, PPDoWhileUntil, PPExpression, PPGoTo, PPIfStatement, PPNumber, PPPliStatement, PPStatement, PPString, PPVariableUsage } from "./pli-preprocessor-ast";
import { assertUnreachable } from "langium";

export type PliPreprocessorProgram = {
    instructions: PPInstruction[];
    labels: Record<string, number>;
}

export class PliPreprocessorGenerator {
    private readonly numberTokenType: TokenType;

    constructor(services: Pl1Services) {
        this.numberTokenType = services.parser.PreprocessorLexer.numberTokenType;
    }

    generateProgram(statements: PPStatement[]): PliPreprocessorProgram {
        const program: PliPreprocessorProgram = {
            instructions: [],
            labels: {},
        };
        for (const statement of statements) {
            this.handleStatement(statement, program);
        }
        program.instructions.push(Instructions.halt());
        return program;
    }

    handleStatement(statement: PPStatement, program: PliPreprocessorProgram) {
        switch (statement.type) {
            case 'labeled':
                program.labels[statement.label] = program.instructions.length;
                this.handleStatement(statement.statement, program);
                break;
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
            case 'empty':
                break;
            case 'do-until-while': this.handleDoUntilWhile(statement, program); break;
            case 'do-while-until': this.handleDoWhileUntil(statement, program); break;
            case "do-forever": this.handleDoForever(statement, program); break;
            case "include": this.handleStatements(statement.subProgram.statements, program); break;
            case "goto": this.handleGoTo(program, statement); break;
            default: assertUnreachable(statement);
        }
    }

    handleGoTo(program: PliPreprocessorProgram, statement: PPGoTo) {
        if (program.labels[statement.label] === undefined) {
            throw new Error(`Label '${statement.label}' not found.`);
        }
        program.instructions.push(Instructions.goto(program.labels[statement.label]));
    }

    handleDoForever(statement: PPDoForever, program: PliPreprocessorProgram) {
        /**
         * $start$: <BODY>
         * GOTO $start$
         */
        const $start$ = program.instructions.length;
        this.handleStatements(statement.body, program);
        program.instructions.push(Instructions.goto($start$));
    }

    handleDoUntilWhile(statement: PPDoUntilWhile, program: PliPreprocessorProgram) {
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
        const $until$ = program.instructions.length;
        this.handleExpression(statement.conditionUntil, program);
        program.instructions.push(Instructions.push(Values.False()));
        const branchUntil = Instructions.branchIfNotEqual(-1);
        program.instructions.push(branchUntil);
        let branchWhile: PPIBranchIfNotEqual | undefined = undefined;
        if (statement.conditionWhile) {
            this.handleExpression(statement.conditionWhile, program);
            program.instructions.push(Instructions.push(Values.True()));
            branchWhile = Instructions.branchIfNotEqual(-1);
            program.instructions.push(branchWhile);
        }
        this.handleStatements(statement.body, program);
        program.instructions.push(Instructions.goto($until$));
        const $end$ = program.instructions.length;
        branchUntil.address = $end$;
        if (branchWhile) {
            branchWhile.address = $end$;
        }
    }

    handleDoWhileUntil(statement: PPDoWhileUntil, program: PliPreprocessorProgram) {
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
        const $while$ = program.instructions.length;
        this.handleExpression(statement.conditionWhile, program);
        program.instructions.push(Instructions.push(Values.True()));
        const branchWhile = Instructions.branchIfNotEqual(-1);
        program.instructions.push(branchWhile);
        let branchUntil: PPIBranchIfNotEqual | undefined = undefined;
        if (statement.conditionUntil) {
            this.handleExpression(statement.conditionUntil, program);
            program.instructions.push(Instructions.push(Values.False()));
            branchUntil = Instructions.branchIfNotEqual(-1);
            program.instructions.push(branchUntil);
        }
        this.handleStatements(statement.body, program);
        program.instructions.push(Instructions.goto($while$));
        const $end$ = program.instructions.length;
        branchWhile.address = $end$;
        if (branchUntil) {
            branchUntil.address = $end$;
        }
    }

    handlePliCode(statement: PPPliStatement, program: PliPreprocessorProgram) {
        let list: IToken[] = [];
        let hadConcat = false;
        statement.tokens.forEach((token, index) => {
            if (token.image === '%' || token.image === ';') {
                if (token.image === ';') {
                    list.push(token);
                }
                program.instructions.push(Instructions.push(list));
                program.instructions.push(Instructions.scan());
                if (hadConcat) {
                    program.instructions.push(Instructions.concat());
                    //TODO really needed here?
                    program.instructions.push(Instructions.scan());
                    hadConcat = false;
                }
                if (token.image === '%') {
                    hadConcat = true;
                } else { // token.image === ';'
                    program.instructions.push(Instructions.print());
                }
                list = [];
            } else {
                list.push(token);
            }
        });
    }

    handleDoGroup(doGroup: PPDoGroup, program: PliPreprocessorProgram) {
        this.handleStatements(doGroup.statements, program);
    }

    handleStatements(statements: PPStatement[], program: PliPreprocessorProgram) {
        for (const statement of statements) {
            this.handleStatement(statement, program);
        }
    }

    handleIf(statement: PPIfStatement, program: PliPreprocessorProgram) {
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
        program.instructions.push(Instructions.push(Values.True()));
        if (statement.elseUnit) {
            const $else$ = Instructions.branchIfNotEqual(-1);
            program.instructions.push($else$);
            this.handleStatement(statement.thenUnit, program);
            const $exit$ = Instructions.goto(-1);
            program.instructions.push($exit$);
            $else$.address = program.instructions.length;
            this.handleStatement(statement.elseUnit, program);
            $exit$.address = program.instructions.length;
        } else {
            const $exit$ = Instructions.branchIfNotEqual(-1);
            program.instructions.push($exit$);
            this.handleStatement(statement.thenUnit, program);
            $exit$.address = program.instructions.length;
        }
    }

    handleDeactivate(statement: PPDeactivate, program: PliPreprocessorProgram) {
        for (const name of statement.variables) {
            program.instructions.push(Instructions.deactivate(name));
        }
    }

    handleActivate(statement: PPActivate, program: PliPreprocessorProgram) {
        for (const [name, scanMode] of Object.entries(statement.variables)) {
            program.instructions.push(Instructions.activate(name, scanMode));
        }
    }

    handleAssignment(statement: PPAssign, program: PliPreprocessorProgram) {
        this.handleExpression(statement.value, program);
        program.instructions.push(Instructions.set(statement.name));
    }

    handleExpression(expression: PPExpression, program: PliPreprocessorProgram) {
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

    handleBinaryExpression(expression: PPBinaryExpression, program: PliPreprocessorProgram) {
        this.handleExpression(expression.lhs, program);
        this.handleExpression(expression.rhs, program);
        program.instructions.push(Instructions.compute(expression.operator));
    }

    handleVariableUsage(expression: PPVariableUsage, program: PliPreprocessorProgram) {
        program.instructions.push(Instructions.get(expression.variableName));
    }

    handleNumberLiteral(expression: PPNumber, program: PliPreprocessorProgram) {
        program.instructions.push(Instructions.push([createTokenInstance(this.numberTokenType, expression.value.toString(), 0, 0, 0, 0, 0, 0)]));
    }

    handleStringLiteral(expression: PPString, program: PliPreprocessorProgram) {
        program.instructions.push(Instructions.push(expression.value));
    }

    handleDeclaration(decl: PPDeclaration, program: PliPreprocessorProgram) {
        switch (decl.type) {
            case 'builtin':
                //TODO builtin declarations
                break;
            case 'entry':
                //TODO entry declarations
                break;
            case "character":
            case "fixed": {
                program.instructions.push(Instructions.push(
                    decl.type === "character"
                        ? []
                        : [createTokenInstance(this.numberTokenType, "0", 0, 0, 0, 0, 0, 0)]
                ));
                program.instructions.push(Instructions.set(decl.name));
                program.instructions.push(Instructions.activate(decl.name, decl.scanMode));
                break;
            }
        }
    }

    // protected isIdentifier(token: IToken) {
    //     return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    // }
}