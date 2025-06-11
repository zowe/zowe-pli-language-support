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

import { IToken, TokenType, createTokenInstance } from "chevrotain";
import { Instructions, Values } from "./pli-preprocessor-instructions";
import {
  PliPreprocessorProgram,
  PliPreprocessorProgramBuilder,
} from "./pli-preprocessor-program-builder";
import * as ast from "../syntax-tree/ast";
export class PliPreprocessorGenerator {
  private readonly numberTokenType: TokenType;

  constructor(numberTokenType: TokenType) {
    this.numberTokenType = numberTokenType;
  }

  generateProgram(statements: ast.Statement[]): PliPreprocessorProgram {
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
    statement: ast.Statement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    for (const statementLabel of statement.labels) {
      const label = builder.createNamedLabel(statementLabel);
      builder.pushLabel(label);
    }
    if (statement.value?.kind !== ast.SyntaxKind.ProcedureStatement) {
      throw new Error("Expected a procedure statement");
    }
    this.handleStatements(statement.value.statements, builder);
  }

  splitStatements(statements: ast.Statement[]): {
    pureStatements: ast.Statement[];
    pureProcedures: ast.Statement[];
  } {
    const pureStatements: ast.Statement[] = [];
    const pureProcedures: ast.Statement[] = [];
    for (const statement of statements) {
      if (this.isLabeledStatementsWithProcedureCall(statement)) {
        pureProcedures.push(statement);
      } else {
        pureStatements.push(statement);
      }
    }
    return { pureStatements, pureProcedures };
  }

  isLabeledStatementsWithProcedureCall(statement: ast.Statement): boolean {
    return statement.value?.kind === ast.SyntaxKind.ProcedureStatement;
  }

  handleStatement(
    statement: ast.Statement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    const unit = statement.value;
    if (unit === null) {
      return;
    }
    const doGroup = this.findDoGroup(statement);
    for (const label of statement.labels) {
      const labelObj = builder.createNamedLabel(label, doGroup);
      builder.pushLabel(labelObj);
    }
    switch (unit.kind) {
      case ast.SyntaxKind.ActivateStatement:
        this.handleActivate(unit, builder);
        break;
      case ast.SyntaxKind.DeactivateStatement:
        this.handleDeactivate(unit, builder);
        break;
      case ast.SyntaxKind.AssignmentStatement:
        this.handleAssignment(unit, builder);
        break;
      case ast.SyntaxKind.DeclareStatement:
        for (const declare of unit.items) {
          this.handleDeclaration(declare, builder);
        }
        break;
      case ast.SyntaxKind.SkipDirective:
      case ast.SyntaxKind.PopDirective:
      case ast.SyntaxKind.PushDirective:
      case ast.SyntaxKind.PageDirective:
      case ast.SyntaxKind.PrintDirective:
      case ast.SyntaxKind.NoPrintDirective:
        // All of the previous are handled in the parser
        // Therefore, do nothing
        break;
      case ast.SyntaxKind.IfStatement:
        this.handleIf(unit, builder);
        break;
      case ast.SyntaxKind.TokenStatement:
        this.handlePliCode(unit, builder);
        break;
      case ast.SyntaxKind.DoStatement:
        this.handleDoGroup(unit, builder);
        break;
      case ast.SyntaxKind.IncludeDirective:
        for (const item of unit.items) {
          if (item.result) {
            this.handleStatements(item.result.statements, builder);
          }
        }
        break;
      case ast.SyntaxKind.GoToStatement:
        this.handleGoTo(unit, builder);
        break;
      case ast.SyntaxKind.LeaveStatement:
        this.handleLeave(unit, builder);
        break;
      case ast.SyntaxKind.IterateStatement:
        this.handleIterate(unit, builder);
        break;
      case ast.SyntaxKind.ReturnStatement:
        this.handleReturn(unit, builder);
        break;
      case ast.SyntaxKind.ProcedureStatement: //TODO should be handled upfront
        break;
      default:
        // Ignore all other cases
        // Generally, we should never reach this point
        // But since we are using a subset of the original AST,
        // TypeScript doesn't pick it up correctly
        break;
    }
  }

  handleReturn(
    statement: ast.ReturnStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    if (statement.expression) {
      this.handleExpression(statement.expression, builder);
    }
    builder.pushInstruction(Instructions.ret());
  }

  findDoGroup(statement: ast.Statement): ast.DoStatement | undefined {
    if (statement.value?.kind === ast.SyntaxKind.DoStatement) {
      return statement.value;
    }
    return undefined;
  }

  handleIterate(
    statement: ast.IterateStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    if (statement.label) {
      const label = builder.resolveLabel(statement.label);
      if (!label) {
        return;
      }
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

  handleLeave(
    statement: ast.LeaveStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    if (statement.label) {
      const label = builder.resolveLabel(statement.label);
      if (!label) {
        return;
      }
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

  handleGoTo(
    statement: ast.GoToStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    if (statement.label) {
      const label = builder.resolveLabel(statement.label);
      if (label) {
        builder.pushInstruction(Instructions.goto(label));
      }
    }
  }

  handleDoGroup(
    statement: ast.DoStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    const { $iterate$, $leave$ } = builder.pushDoGroup(statement);
    builder.pushLabel($iterate$);
    if (statement.doType2) {
      const type2 = statement.doType2;
      if (type2.kind === ast.SyntaxKind.DoUntil && type2.until) {
        this.handleExpression(type2.until, builder);
        builder.pushInstruction(Instructions.push(Values.False()));
        builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
        if (type2.while) {
          this.handleExpression(type2.while, builder);
          builder.pushInstruction(Instructions.push(Values.True()));
          builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
        }
      } else if (type2.kind === ast.SyntaxKind.DoWhile && type2.while) {
        this.handleExpression(type2.while, builder);
        builder.pushInstruction(Instructions.push(Values.True()));
        builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
        if (type2.until) {
          this.handleExpression(type2.until, builder);
          builder.pushInstruction(Instructions.push(Values.False()));
          builder.pushInstruction(Instructions.branchIfNotEqual($leave$));
        }
      }
    }
    this.handleStatements(statement.statements, builder);
    if (statement.doType4 || statement.doType2) {
      builder.pushInstruction(Instructions.goto($iterate$));
    }
    builder.pushLabel($leave$);
    builder.popDoGroup();
  }

  handlePliCode(
    statement: ast.TokenStatement,
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
    // if any tokens are left, simply push them
    if (list.length > 0) {
      builder.pushInstruction(Instructions.push(list));
      builder.pushInstruction(Instructions.scan());
      builder.pushInstruction(Instructions.print());
    }
  }

  handleStatements(
    statements: ast.Statement[],
    builder: PliPreprocessorProgramBuilder,
  ) {
    for (const statement of statements) {
      this.handleStatement(statement, builder);
    }
  }

  handleIf(statement: ast.IfStatement, builder: PliPreprocessorProgramBuilder) {
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
    if (!statement.expression) {
      return;
    }
    this.handleExpression(statement.expression, builder);
    builder.pushInstruction(Instructions.push(Values.True()));
    if (statement.else) {
      const $else$ = builder.createLabel();
      builder.pushInstruction(Instructions.branchIfNotEqual($else$, statement));
      if (statement.unit) {
        this.handleStatement(statement.unit, builder);
      }
      const $exit$ = builder.createLabel();
      builder.pushInstruction(Instructions.goto($exit$));
      builder.pushLabel($else$);
      this.handleStatement(statement.else, builder);
      builder.pushLabel($exit$);
    } else {
      const $exit$ = builder.createLabel();
      builder.pushInstruction(Instructions.branchIfNotEqual($exit$, statement));
      if (statement.unit) {
        this.handleStatement(statement.unit, builder);
      }
      builder.pushLabel($exit$);
    }
  }

  handleDeactivate(
    statement: ast.DeactivateStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    for (const ref of statement.references) {
      if (ref.ref?.text) {
        builder.pushInstruction(Instructions.deactivate(ref.ref.text));
      }
    }
  }

  handleActivate(
    statement: ast.ActivateStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    for (const item of statement.items) {
      const text = item.reference?.ref?.text;
      if (text) {
        builder.pushInstruction(
          Instructions.activate(text, item.scanMode ?? "SCAN"),
        );
      }
    }
  }

  handleAssignment(
    statement: ast.AssignmentStatement,
    builder: PliPreprocessorProgramBuilder,
  ) {
    const expr = statement.expression;
    const ref = statement.refs[0];
    const refName = ref?.element?.element?.ref?.text;
    if (expr && refName) {
      this.handleExpression(expr, builder);
      builder.pushInstruction(Instructions.set(refName));
    }
  }

  handleExpression(
    expression: ast.Expression,
    builder: PliPreprocessorProgramBuilder,
  ) {
    switch (expression.kind) {
      case ast.SyntaxKind.Literal: {
        switch (expression.value?.kind) {
          case ast.SyntaxKind.StringLiteral:
            this.handleStringLiteral(expression.value, builder);
            break;
          case ast.SyntaxKind.NumberLiteral:
            this.handleNumberLiteral(expression.value, builder);
            break;
        }
        break;
      }
      case ast.SyntaxKind.LocatorCall: {
        this.handleVariableUsage(expression, builder);
        break;
      }
      case ast.SyntaxKind.BinaryExpression: {
        this.handleBinaryExpression(expression, builder);
        break;
      }
    }
  }

  handleBinaryExpression(
    expression: ast.BinaryExpression,
    builder: PliPreprocessorProgramBuilder,
  ) {
    this.handleExpression(expression.left, builder);
    this.handleExpression(expression.right, builder);
    builder.pushInstruction(Instructions.compute(expression.op));
  }

  handleVariableUsage(
    expression: ast.LocatorCall,
    builder: PliPreprocessorProgramBuilder,
  ) {
    const member = expression.element;
    if (member) {
      const ref = member.element;
      if (ref) {
        const name = ref.ref?.text;
        if (name) {
          builder.pushInstruction(Instructions.get(name));
        }
      }
    }
  }

  handleNumberLiteral(
    expression: ast.NumberLiteral,
    builder: PliPreprocessorProgramBuilder,
  ) {
    builder.pushInstruction(
      Instructions.push([
        createTokenInstance(
          this.numberTokenType,
          expression.value?.toString() ?? "0",
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
    expression: ast.StringLiteral,
    builder: PliPreprocessorProgramBuilder,
  ) {
    builder.pushInstruction(Instructions.push(expression.tokens));
  }

  private getVariableNames(decl: ast.DeclaredItem): string[] {
    const names: string[] = [];
    for (const element of decl.elements) {
      if (element.kind === ast.SyntaxKind.WildcardItem) {
        continue;
      }
      if (element.kind === ast.SyntaxKind.DeclaredItem) {
        names.push(...this.getVariableNames(element));
      } else if (element.name) {
        names.push(element.name);
      }
    }
    return names;
  }

  handleDeclaration(
    decl: ast.DeclaredItem,
    builder: PliPreprocessorProgramBuilder,
  ) {
    const types: string[] = [];
    for (const attribute of decl.attributes) {
      if (
        attribute.kind === ast.SyntaxKind.ComputationDataAttribute &&
        attribute.type
      ) {
        types.push(attribute.type);
      }
    }
    // RESCAN is the default mode for all variables
    let scanMode: ast.ScanMode = "RESCAN";
    if (types.includes("SCAN")) {
      scanMode = "SCAN";
    } else if (types.includes("NOSCAN")) {
      scanMode = "NOSCAN";
    }
    if (types.includes("CHARACTER") || types.includes("FIXED")) {
      const names = this.getVariableNames(decl);
      for (const name of names) {
        if (types.includes("FIXED")) {
          builder.pushInstruction(
            Instructions.push([
              createTokenInstance(this.numberTokenType, "0", 0, 0, 0, 0, 0, 0),
            ]),
          );
        }
        builder.pushInstruction(Instructions.set(name));
        builder.pushInstruction(Instructions.activate(name, scanMode));
      }
    }
  }
}
