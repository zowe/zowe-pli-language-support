/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import {
  BinaryOperator,
  Bound,
  Condition,
  DimensionBound,
  DoSpecification,
  DoStatement,
  Expression,
  FileReferenceConditions,
  KeywordConditions,
  LabelPrefix,
  LabelReference,
  LocatorCall,
  MemberCall,
  ReferenceItem,
  Statement,
  SyntaxKind,
  UnaryOperator,
} from "../syntax-tree/ast";
import { getLabelPrefixName } from "../syntax-tree/ast-utils";

/** Longest text rendered into a single diagram label before it is elided. */
export const MAX_LABEL_LENGTH = 48;

/** Shortens `text` to at most `max` characters, ending with an ellipsis when cut. */
export function truncate(text: string, max = MAX_LABEL_LENGTH): string {
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + "…";
}

/** Collapses whitespace runs and drops block comments, so source snippets fit one line. */
export function normalizeSource(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?(\*\/|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BINARY_OPERATORS: Record<BinaryOperator, string> = {
  [BinaryOperator.NotEquals]: "¬=",
  [BinaryOperator.NotLessThan]: "¬<",
  [BinaryOperator.LessThanEquals]: "<=",
  [BinaryOperator.GreaterThanEquals]: ">=",
  [BinaryOperator.NotGreaterThan]: "¬>",
  [BinaryOperator.PipePipe]: "||",
  [BinaryOperator.StarStar]: "**",
  [BinaryOperator.Star]: "*",
  [BinaryOperator.Equals]: "=",
  [BinaryOperator.Pipe]: "|",
  [BinaryOperator.Not]: "¬",
  [BinaryOperator.Ampersand]: "&",
  [BinaryOperator.LessThan]: "<",
  [BinaryOperator.GreaterThan]: ">",
  [BinaryOperator.Plus]: "+",
  [BinaryOperator.Minus]: "-",
  [BinaryOperator.Slash]: "/",
};

const UNARY_OPERATORS: Record<UnaryOperator, string> = {
  [UnaryOperator.Plus]: "+",
  [UnaryOperator.Minus]: "-",
  [UnaryOperator.Not]: "¬",
};

/** Renders an expression back to PL/I source form (normalized spacing, source parentheses kept). */
export function expressionToText(expr: Expression | null | undefined): string {
  if (!expr) {
    return "";
  }
  switch (expr.kind) {
    case SyntaxKind.BinaryExpression: {
      const op = expr.op === null ? "?" : BINARY_OPERATORS[expr.op];
      return `${expressionToText(expr.left)} ${op} ${expressionToText(expr.right)}`;
    }
    case SyntaxKind.UnaryExpression: {
      const op = expr.op === null ? "" : UNARY_OPERATORS[expr.op];
      return `${op}${expressionToText(expr.expr)}`;
    }
    case SyntaxKind.NumberLiteral:
    case SyntaxKind.StringLiteral:
      return expr.value ?? "";
    case SyntaxKind.Parenthesis:
      return `(${expr.expressions.map(expressionToText).join(", ")})`;
    case SyntaxKind.RepeatedExpression:
      return `(${expressionToText(expr.count)})${expressionToText(expr.expression)}`;
    case SyntaxKind.WildcardItem:
      return "*";
    case SyntaxKind.LocatorCall:
      return locatorCallToText(expr);
  }
}

export function locatorCallToText(
  call: LocatorCall | null | undefined,
): string {
  if (!call) {
    return "";
  }
  const element = memberCallToText(call.element);
  if (!call.previous) {
    return element;
  }
  const arrow = call.handle ? "=>" : "->";
  return `${locatorCallToText(call.previous)}${arrow}${element}`;
}

export function memberCallToText(call: MemberCall | null | undefined): string {
  if (!call) {
    return "";
  }
  const element = referenceItemToText(call.element);
  return call.previous
    ? `${memberCallToText(call.previous)}.${element}`
    : element;
}

function referenceItemToText(item: ReferenceItem | null | undefined): string {
  if (!item) {
    return "";
  }
  const args = item.dimensions
    .map((dims) => `(${dims.dimensions.map(dimensionBoundToText).join(", ")})`)
    .join("");
  return `${item.ref?.text ?? ""}${args}`;
}

function dimensionBoundToText(bound: DimensionBound): string {
  const upper = boundToText(bound.upper);
  return bound.lower ? `${boundToText(bound.lower)}:${upper}` : upper;
}

function boundToText(bound: Bound | null): string {
  if (!bound) {
    return "";
  }
  if (bound.expression) {
    return expressionToText(bound.expression);
  }
  return bound.token?.image ?? "";
}

/** Name of the label targeted by GO TO / LEAVE / ITERATE. */
export function labelReferenceName(
  ref: LabelReference | null | undefined,
): string {
  return memberCallToText(ref?.label);
}

/** Labels prefixing a statement, e.g. `["LOOP1"]`. */
export function statementLabelNames(stmt: Statement): string[] {
  return labelNames(stmt.labels);
}

export function labelNames(labels: LabelPrefix[]): string[] {
  return labels
    .map((label) => getLabelPrefixName(label))
    .filter((name): name is string => !!name);
}

/** Renders an ON / SIGNAL / REVERT condition, e.g. `ENDFILE(SYSIN)` or `CONDITION(MYCOND)`. */
export function conditionToText(condition: Condition): string {
  switch (condition.kind) {
    case SyntaxKind.KeywordCondition:
      return condition.keyword === null
        ? "?"
        : KeywordConditions[condition.keyword];
    case SyntaxKind.FileReferenceCondition: {
      const keyword =
        condition.keyword === null
          ? "?"
          : FileReferenceConditions[condition.keyword];
      const file = locatorCallToText(condition.fileReference);
      return file ? `${keyword}(${file})` : keyword;
    }
    case SyntaxKind.NamedCondition:
      return `CONDITION(${condition.name ?? ""})`;
  }
}

/**
 * Key identifying a condition independent of spelling, used to match SIGNAL statements with
 * the ON-units that handle them.
 */
export function conditionKey(condition: Condition): string {
  return conditionToText(condition).toUpperCase().replace(/\s+/g, "");
}

/** Whether the DO statement repeats its body (as opposed to a plain DO; ... END; group). */
export function isIterativeDo(stmt: DoStatement): boolean {
  return stmt.doType2 !== null || stmt.doType3 !== null || stmt.doType4;
}

/** Header text of an iterative DO group, e.g. `I = 1 TO N BY 2` or `WHILE (¬EOF)`. */
export function doHeaderText(stmt: DoStatement): string {
  if (stmt.doType4) {
    return "LOOP";
  }
  if (stmt.doType2) {
    return whileUntilText(
      stmt.doType2.while,
      stmt.doType2.until,
      stmt.doType2.kind === SyntaxKind.DoUntil,
    );
  }
  if (stmt.doType3) {
    const variable = memberCallToText(stmt.doType3.variable);
    const specs = stmt.doType3.specifications
      .map(doSpecificationToText)
      .join(", ");
    return `${variable} = ${specs}`;
  }
  return "";
}

function whileUntilText(
  whileExpr: Expression | null,
  untilExpr: Expression | null,
  untilFirst: boolean,
): string {
  const parts: string[] = [];
  const pushWhile = () =>
    whileExpr && parts.push(`WHILE (${expressionToText(whileExpr)})`);
  const pushUntil = () =>
    untilExpr && parts.push(`UNTIL (${expressionToText(untilExpr)})`);
  if (untilFirst) {
    pushUntil();
    pushWhile();
  } else {
    pushWhile();
    pushUntil();
  }
  return parts.join(" ");
}

function doSpecificationToText(spec: DoSpecification): string {
  const parts = [expressionToText(spec.expression)];
  if (spec.to) parts.push(`TO ${expressionToText(spec.to)}`);
  if (spec.by) parts.push(`BY ${expressionToText(spec.by)}`);
  if (spec.upthru) parts.push(`UPTHRU ${expressionToText(spec.upthru)}`);
  if (spec.downthru) parts.push(`DOWNTHRU ${expressionToText(spec.downthru)}`);
  if (spec.repeat) parts.push(`REPEAT ${expressionToText(spec.repeat)}`);
  if (spec.whileOrUntil) {
    const clause = spec.whileOrUntil;
    parts.push(
      whileUntilText(
        clause.while,
        clause.until,
        clause.kind === SyntaxKind.DoUntil,
      ),
    );
  }
  return parts.filter((part) => part.length > 0).join(" ");
}
