import { IToken, TokenType, createTokenInstance } from "chevrotain";
import { Instructions, Label, Values } from "./pli-preprocessor-instructions";
import {
  AnyDoGroup,
  PPActivate,
  PPAssign,
  PPBinaryExpression,
  PPDeactivate,
  PPDeclaration,
  PPDoForever,
  PPDoGroup,
  PPDoUntilWhile,
  PPDoWhileUntil,
  PPExpression,
  PPGoTo,
  PPIfStatement,
  PPIterate,
  PPLabeledStatement,
  PPLeave,
  PPNumber,
  PPPliStatement,
  PPProcedure,
  PPReturn,
  PPStatement,
  PPString,
  PPVariableUsage,
} from "./pli-preprocessor-ast";
import { assertUnreachable } from "langium";
import {
  PliPreprocessorProgram,
  PliPreprocessorProgramBuilder,
} from "./pli-preprocessor-program-builder";
import { assertType } from "./util.js";

export class PliPreprocessorGenerator {
  private readonly numberTokenType: TokenType;

  constructor(numberTokenType: TokenType) {
    this.numberTokenType = numberTokenType;
  }

  generateProgram(statements: PPStatement[]): PliPreprocessorProgram {
    const builder = new PliPreprocessorProgramBuilder();
    const { pureStatements, pureProcedures } = this.splitStatements(statements);
    for (const statement of pureStatements) {
      this.handleStatement(statement, builder);
    }
    builder.pushInstruction(Instructions.halt());
    for (const statement of pureProcedures) {
      this.handleProcedure(statement, builder);
    }
    return builder.build();
  }

  handleProcedure(
    statement: PPStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    assertType<PPLabeledStatement>(statement);
    let label: Label = undefined!;
    while (statement.type === "labeled") {
      label = builder.getOrCreateLabel(statement.label);
      builder.pushLabel(label);
      statement = statement.statement;
    }
    assertType<PPProcedure>(statement);
    this.handleStatements(statement.body, builder);
  }

  splitStatements(statements: PPStatement[]): {
    pureStatements: PPStatement[];
    pureProcedures: PPLabeledStatement[];
  } {
    const pureStatements: PPStatement[] = [];
    const pureProcedures: PPLabeledStatement[] = [];
    for (const statement of statements) {
      if (this.isLabeledStatementsWithProcedureCall(statement)) {
        pureProcedures.push(statement);
      } else {
        pureStatements.push(statement);
      }
    }
    return { pureStatements, pureProcedures };
  }

  isLabeledStatementsWithProcedureCall(
    statement: PPStatement,
  ): statement is PPLabeledStatement {
    while (statement.type === "labeled") {
      statement = statement.statement;
    }
    return statement.type === "procedure";
  }

  handleStatement(
    statement: PPStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    switch (statement.type) {
      case "labeled":
        const label = builder.getOrCreateLabel(
          statement.label,
          this.findDoGroup(statement),
        );
        builder.pushLabel(label);
        this.handleStatement(statement.statement, builder);
        break;
      case "activate":
        this.handleActivate(statement, builder);
        break;
      case "deactivate":
        this.handleDeactivate(statement, builder);
        break;
      case "assign":
        this.handleAssignment(statement, builder);
        break;
      case "declare":
        for (const declare of statement.declarations) {
          this.handleDeclaration(declare, builder);
        }
        break;
      case "skip":
      //handled in the parser already!
      case "directive":
        //do nothing
        break;
      case "if":
        this.handleIf(statement, builder);
        break;
      case "pli":
        this.handlePliCode(statement, builder);
        break;
      case "empty":
        break;
      case "do":
        this.handleDoGroup(statement, builder);
        break;
      case "do-until-while":
        this.handleDoUntilWhile(statement, builder);
        break;
      case "do-while-until":
        this.handleDoWhileUntil(statement, builder);
        break;
      case "do-forever":
        this.handleDoForever(statement, builder);
        break;
      case "include":
        this.handleStatements(statement.subProgram.statements, builder);
        break;
      case "goto":
        this.handleGoTo(statement, builder);
        break;
      case "leave":
        this.handleLeave(statement, builder);
        break;
      case "iterate":
        this.handleIterate(statement, builder);
        break;
      case "return":
        this.handleReturn(statement, builder);
        break;
      case "procedure": //TODO should be handled upfront
        break;
      default:
        assertUnreachable(statement);
    }
  }

  handleReturn(statement: PPReturn, builder: PliPreprocessorProgramBuilder) {
    this.handleExpression(statement.value, builder);
    builder.pushInstruction(Instructions.ret());
  }

  findDoGroup(statement: PPLabeledStatement): AnyDoGroup | undefined {
    const possibleDoGroups: PPStatement["type"][] = [
      "do",
      "do-until-while",
      "do-while-until",
      "do-forever",
    ];
    if (possibleDoGroups.includes(statement.statement.type)) {
      return statement.statement as AnyDoGroup;
    }
    if (statement.statement.type === "labeled") {
      return this.findDoGroup(statement.statement);
    }
    return undefined;
  }

  handleIterate(statement: PPIterate, builder: PliPreprocessorProgramBuilder) {
    if (statement.label) {
      const label = builder.getOrCreateLabel(statement.label);
      if (label.doGroup) {
        const labels = builder.lookupDoGroup(label.doGroup);
        if (labels) {
          const actualLabel = labels.$iterate$;
          builder.pushInstruction(Instructions.goto(actualLabel));
          return;
        }
      }
      throw new Error(
        `Label '${statement.label}' not found or no valid DO group.`,
      );
    } else {
      const top = builder.topDoGroup();
      if (top) {
        builder.pushInstruction(Instructions.goto(top.$iterate$));
        return;
      }
      throw new Error(`No DO group to iterate.`);
    }
  }

  handleLeave(statement: PPLeave, builder: PliPreprocessorProgramBuilder) {
    if (statement.label) {
      const label = builder.getOrCreateLabel(statement.label);
      if (label.doGroup) {
        const labels = builder.lookupDoGroup(label.doGroup);
        if (labels) {
          const actualLabel = labels.$leave$;
          builder.pushInstruction(Instructions.goto(actualLabel));
          return;
        }
      }
      throw new Error(
        `Label '${statement.label}' not found or no valid DO group.`,
      );
    } else {
      const top = builder.topDoGroup();
      if (top) {
        builder.pushInstruction(Instructions.goto(top.$leave$));
        return;
      }
      throw new Error(`No DO group to leave.`);
    }
  }

  handleGoTo(statement: PPGoTo, builder: PliPreprocessorProgramBuilder) {
    const label = builder.getOrCreateLabel(statement.label);
    builder.pushInstruction(Instructions.goto(label));
  }

  handleDoGroup(statement: PPDoGroup, builder: PliPreprocessorProgramBuilder) {
    const { $iterate$, $leave$ } = builder.pushDoGroup(statement);
    builder.pushLabel($iterate$);
    this.handleStatements(statement.statements, builder);
    builder.pushLabel($leave$);
    builder.popDoGroup();
  }

  handleDoForever(
    statement: PPDoForever,
    builder: PliPreprocessorProgramBuilder,
  ) {
    /**
     * $start$: <BODY>
     * GOTO $start$
     */
    const { $iterate$, $leave$ } = builder.pushDoGroup(statement);
    builder.pushLabel($iterate$);
    this.handleStatements(statement.body, builder);
    builder.pushInstruction(Instructions.goto($iterate$));
    builder.pushLabel($leave$);
    builder.popDoGroup();
  }

  handleDoUntilWhile(
    statement: PPDoUntilWhile,
    builder: PliPreprocessorProgramBuilder,
  ) {
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
    const { $iterate$, $leave$ } = builder.pushDoGroup(statement);
    builder.pushLabel($iterate$);
    this.handleExpression(statement.conditionUntil, builder);
    builder.pushInstruction(Instructions.push(Values.False()));
    builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
    if (statement.conditionWhile) {
      this.handleExpression(statement.conditionWhile, builder);
      builder.pushInstruction(Instructions.push(Values.True()));
      builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
    }
    this.handleStatements(statement.body, builder);
    builder.pushInstruction(Instructions.goto($iterate$));
    builder.pushLabel($leave$);
    builder.popDoGroup();
  }

  handleDoWhileUntil(
    statement: PPDoWhileUntil,
    builder: PliPreprocessorProgramBuilder,
  ) {
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
    const { $iterate$, $leave$ } = builder.pushDoGroup(statement);
    builder.pushLabel($iterate$);
    this.handleExpression(statement.conditionWhile, builder);
    builder.pushInstruction(Instructions.push(Values.True()));
    builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
    if (statement.conditionUntil) {
      this.handleExpression(statement.conditionUntil, builder);
      builder.pushInstruction(Instructions.push(Values.False()));
      builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
    }
    this.handleStatements(statement.body, builder);
    builder.pushInstruction(Instructions.goto($iterate$));
    builder.pushLabel($leave$);
    builder.popDoGroup();
  }

  handlePliCode(
    statement: PPPliStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    let list: IToken[] = [];
    let hadConcat = false;
    statement.tokens.forEach((token) => {
      if (token.image === "%" || token.image === ";") {
        if (token.image === ";") {
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
        if (token.image === "%") {
          hadConcat = true;
        } else {
          // token.image === ';'
          builder.pushInstruction(Instructions.print());
        }
        list = [];
      } else {
        list.push(token);
      }
    });
  }

  handleStatements(
    statements: PPStatement[],
    builder: PliPreprocessorProgramBuilder,
  ) {
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
      const $else$ = builder.getOrCreateLabel();
      builder.pushInstruction(Instructions.branchIfNotEqual($else$));
      this.handleStatement(statement.thenUnit, builder);
      const $exit$ = builder.getOrCreateLabel();
      builder.pushInstruction(Instructions.goto($exit$));
      builder.pushLabel($else$);
      this.handleStatement(statement.elseUnit, builder);
      builder.pushLabel($exit$);
    } else {
      const $exit$ = builder.getOrCreateLabel();
      builder.pushInstruction(Instructions.branchIfNotEqual($exit$));
      this.handleStatement(statement.thenUnit, builder);
      builder.pushLabel($exit$);
    }
  }

  handleDeactivate(
    statement: PPDeactivate,
    builder: PliPreprocessorProgramBuilder,
  ) {
    for (const name of statement.variables) {
      builder.pushInstruction(Instructions.deactivate(name));
    }
  }

  handleActivate(
    statement: PPActivate,
    builder: PliPreprocessorProgramBuilder,
  ) {
    for (const [name, scanMode] of Object.entries(statement.variables)) {
      builder.pushInstruction(Instructions.activate(name, scanMode));
    }
  }

  handleAssignment(
    statement: PPAssign,
    builder: PliPreprocessorProgramBuilder,
  ) {
    this.handleExpression(statement.value, builder);
    builder.pushInstruction(Instructions.set(statement.name));
  }

  handleExpression(
    expression: PPExpression,
    builder: PliPreprocessorProgramBuilder,
  ) {
    switch (expression.type) {
      case "string": {
        this.handleStringLiteral(expression, builder);
        break;
      }
      case "number": {
        this.handleNumberLiteral(expression, builder);
        break;
      }
      case "variable-usage": {
        this.handleVariableUsage(expression, builder);
        break;
      }
      case "binary": {
        this.handleBinaryExpression(expression, builder);
        break;
      }
    }
  }

  handleBinaryExpression(
    expression: PPBinaryExpression,
    builder: PliPreprocessorProgramBuilder,
  ) {
    this.handleExpression(expression.lhs, builder);
    this.handleExpression(expression.rhs, builder);
    builder.pushInstruction(Instructions.compute(expression.operator));
  }

  handleVariableUsage(
    expression: PPVariableUsage,
    builder: PliPreprocessorProgramBuilder,
  ) {
    builder.pushInstruction(Instructions.get(expression.variableName));
  }

  handleNumberLiteral(
    expression: PPNumber,
    builder: PliPreprocessorProgramBuilder,
  ) {
    builder.pushInstruction(
      Instructions.push([
        createTokenInstance(
          this.numberTokenType,
          expression.value.toString(),
          0,
          0,
          0,
          0,
          0,
          0,
        ),
      ]),
    );
  }

  handleStringLiteral(
    expression: PPString,
    builder: PliPreprocessorProgramBuilder,
  ) {
    builder.pushInstruction(Instructions.push(expression.value));
  }

  handleDeclaration(
    decl: PPDeclaration,
    builder: PliPreprocessorProgramBuilder,
  ) {
    switch (decl.attributes.type) {
      case "builtin":
        //TODO builtin declarations
        break;
      case "entry":
        //TODO entry declarations
        break;
      case "character":
      case "fixed": {
        for (const { name } of decl.names) {
          //TODO handle _dimensions
          builder.pushInstruction(
            Instructions.push(
              decl.attributes.type === "character"
                ? []
                : [
                    createTokenInstance(
                      this.numberTokenType,
                      "0",
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                    ),
                  ],
            ),
          );
          builder.pushInstruction(Instructions.set(name));
          builder.pushInstruction(
            Instructions.activate(name, decl.attributes.scanMode),
          );
        }
        break;
      }
    }
  }
}
