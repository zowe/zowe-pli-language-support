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

import { SyntaxKind, SyntaxNode } from "./ast";

export function forEachNode(
  node: SyntaxNode,
  action: (node: SyntaxNode) => void,
): void {
  switch (node.kind) {
    case SyntaxKind.AFormatItem:
      if (node.fieldWidth) {
        action(node.fieldWidth);
      }
      break;
    case SyntaxKind.AllocateDimension:
      if (node.dimensions) {
        action(node.dimensions);
      }
      break;
    case SyntaxKind.AllocatedVariable:
      if (node.var) {
        action(node.var);
      }
      if (node.attribute) {
        action(node.attribute);
      }
      break;
    case SyntaxKind.AllocateLocationReferenceIn:
      if (node.area) {
        action(node.area);
      }
      break;
    case SyntaxKind.AllocateLocationReferenceSet:
      if (node.locatorVariable) {
        action(node.locatorVariable);
      }
      break;
    case SyntaxKind.AllocateStatement:
      node.variables.forEach(action);
      break;
    case SyntaxKind.AllocateType:
      if (node.dimensions) {
        action(node.dimensions);
      }
      break;
    case SyntaxKind.AssertStatement:
      if (node.actual) {
        action(node.actual);
      }
      if (node.displayExpression) {
        action(node.displayExpression);
      }
      if (node.expected) {
        action(node.expected);
      }
      break;
    case SyntaxKind.AssignmentStatement:
      node.refs.forEach(action);
      if (node.expression) {
        action(node.expression);
      }
      if (node.dimacrossExpr) {
        action(node.dimacrossExpr);
      }
      break;
    case SyntaxKind.AttachStatement:
      if (node.reference) {
        action(node.reference);
      }
      if (node.task) {
        action(node.task);
      }
      if (node.tstack) {
        action(node.tstack);
      }
      break;
    case SyntaxKind.BeginStatement:
      if (node.options) {
        action(node.options);
      }
      node.statements.forEach(action);
      if (node.end) {
        action(node.end);
      }
      break;
    case SyntaxKind.BFormatItem:
      if (node.fieldWidth) {
        action(node.fieldWidth);
      }
      break;
    case SyntaxKind.BinaryExpression:
      if (node.left) {
        action(node.left);
      }
      if (node.right) {
        action(node.right);
      }
      break;
    case SyntaxKind.Bound:
      if (node.refer) {
        action(node.refer);
      }
      if (node.expression && node.expression !== "*") {
        action(node.expression);
      }
      break;
    case SyntaxKind.CallStatement:
      if (node.call) {
        action(node.call);
      }
      break;
    case SyntaxKind.CancelThreadStatement:
      if (node.thread) {
        action(node.thread);
      }
      break;
    case SyntaxKind.CFormatItem:
      break;
    case SyntaxKind.CloseStatement:
      for (const file of node.files) {
        if (file !== "*") {
          action(file);
        }
      }
      break;
    case SyntaxKind.CMPATOptionsItem:
      break;
    case SyntaxKind.ColumnFormatItem:
      if (node.characterPosition) {
        action(node.characterPosition);
      }
      break;
    case SyntaxKind.CompilerOptions:
      break;
    case SyntaxKind.ComputationDataAttribute:
      if (node.dimensions) {
        action(node.dimensions);
      }
      break;
    case SyntaxKind.ConditionPrefix:
      node.items.forEach(action);
      break;
    case SyntaxKind.ConditionPrefixItem:
      node.conditions.forEach(action);
      break;
    case SyntaxKind.DataSpecificationDataList:
      node.items.forEach(action);
      break;
    case SyntaxKind.DataSpecificationDataListItem:
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.DataSpecificationOptions:
      if (node.dataList) {
        action(node.dataList);
      }
      node.dataLists.forEach(action);
      node.formatLists.forEach(action);
      node.dataListItems.forEach(action);
      break;
    case SyntaxKind.DateAttribute:
      break;
    case SyntaxKind.DeclaredItem:
      if (node.element !== null && node.element !== "*") {
        action(node.element);
      }
      node.items.forEach(action);
      node.attributes.forEach(action);
      break;
    case SyntaxKind.DeclaredVariable:
      break;
    case SyntaxKind.DeclareStatement:
      node.items.forEach(action);
      break;
    case SyntaxKind.DefaultAttributeExpression:
      node.items.forEach(action);
      break;
    case SyntaxKind.DefaultAttributeExpressionNot:
      break;
    case SyntaxKind.DefaultExpression:
      if (node.expression) {
        action(node.expression);
      }
      node.attributes.forEach(action);
      break;
    case SyntaxKind.DefaultExpressionPart:
      if (node.expression) {
        action(node.expression);
      }
      if (node.identifiers) {
        action(node.identifiers);
      }
      break;
    case SyntaxKind.DefaultRangeIdentifierItem:
      break;
    case SyntaxKind.DefaultRangeIdentifiers:
      for (const id of node.identifiers) {
        if (id !== "*") {
          action(id);
        }
      }
      break;
    case SyntaxKind.DefaultStatement:
      node.expressions.forEach(action);
      break;
    case SyntaxKind.DefaultValueAttribute:
      node.items.forEach(action);
      break;
    case SyntaxKind.DefaultValueAttributeItem:
      node.attributes.forEach(action);
      break;
    case SyntaxKind.DefineAliasStatement:
      node.attributes.forEach(action);
      break;
    case SyntaxKind.DefinedAttribute:
      if (node.reference) {
        action(node.reference);
      }
      if (node.position) {
        action(node.position);
      }
      break;
    case SyntaxKind.DefineOrdinalStatement:
      if (node.ordinalValues) {
        action(node.ordinalValues);
      }
      break;
    case SyntaxKind.DefineStructureStatement:
      node.substructures.forEach(action);
      break;
    case SyntaxKind.DelayStatement:
      if (node.delay) {
        action(node.delay);
      }
      break;
    case SyntaxKind.DeleteStatement:
      if (node.file) {
        action(node.file);
      }
      if (node.key) {
        action(node.key);
      }
      break;
    case SyntaxKind.DetachStatement:
      if (node.reference) {
        action(node.reference);
      }
      break;
    case SyntaxKind.DimensionBound:
      if (node.bound1) {
        action(node.bound1);
      }
      if (node.bound2) {
        action(node.bound2);
      }
      break;
    case SyntaxKind.Dimensions:
      node.dimensions.forEach(action);
      break;
    case SyntaxKind.DimensionsDataAttribute:
      if (node.dimensions) {
        action(node.dimensions);
      }
      break;
    case SyntaxKind.DisplayStatement:
      if (node.expression) {
        action(node.expression);
      }
      if (node.reply) {
        action(node.reply);
      }
      break;
    case SyntaxKind.DoSpecification:
      if (node.expression) {
        action(node.expression);
      }
      if (node.upthru) {
        action(node.upthru);
      }
      if (node.downthru) {
        action(node.downthru);
      }
      if (node.repeat) {
        action(node.repeat);
      }
      if (node.to) {
        action(node.to);
      }
      if (node.by) {
        action(node.by);
      }
      break;
    case SyntaxKind.DoStatement:
      node.statements.forEach(action);
      if (node.end) {
        action(node.end);
      }
      if (node.doType2) {
        action(node.doType2);
      }
      if (node.doType3) {
        action(node.doType3);
      }
      break;
    case SyntaxKind.DoType3:
      if (node.variable) {
        action(node.variable);
      }
      node.specifications.forEach(action);
      break;
    case SyntaxKind.DoType3Variable:
      break;
    case SyntaxKind.DoUntil:
      if (node.until) {
        action(node.until);
      }
      if (node.while) {
        action(node.while);
      }
      break;
    case SyntaxKind.DoWhile:
      if (node.while) {
        action(node.while);
      }
      if (node.until) {
        action(node.until);
      }
      break;
    case SyntaxKind.EFormatItem:
      if (node.fieldWidth) {
        action(node.fieldWidth);
      }
      if (node.fractionalDigits) {
        action(node.fractionalDigits);
      }
      if (node.significantDigits) {
        action(node.significantDigits);
      }
      break;
    case SyntaxKind.EndStatement:
      node.labels.forEach(action);
      if (node.label) {
        action(node.label);
      }
      break;
    case SyntaxKind.EntryAttribute:
      node.attributes.forEach(action);
      node.options.forEach(action);
      node.returns.forEach(action);
      node.environmentName.forEach(action);
      break;
    case SyntaxKind.EntryParameterDescription:
      node.attributes.forEach(action);
      break;
    case SyntaxKind.EntryStatement:
      node.parameters.forEach(action);
      node.returns.forEach(action);
      node.options.forEach(action);
      node.environmentName.forEach(action);
      break;
    case SyntaxKind.EntryUnionDescription:
      node.attributes.forEach(action);
      node.prefixedAttributes.forEach(action);
      break;
    case SyntaxKind.EnvironmentAttribute:
      node.items.forEach(action);
      break;
    case SyntaxKind.EnvironmentAttributeItem:
      node.args.forEach(action);
      break;
    case SyntaxKind.ExecStatement:
      break;
    case SyntaxKind.ExitStatement:
      break;
    case SyntaxKind.Exports:
      break;
    case SyntaxKind.FetchEntry:
      if (node.set) {
        action(node.set);
      }
      if (node.title) {
        action(node.title);
      }
      break;
    case SyntaxKind.FetchStatement:
      node.entries.forEach(action);
      break;
    case SyntaxKind.FFormatItem:
      if (node.fieldWidth) {
        action(node.fieldWidth);
      }
      if (node.fractionalDigits) {
        action(node.fractionalDigits);
      }
      if (node.scalingFactor) {
        action(node.scalingFactor);
      }
      break;
    case SyntaxKind.FileReferenceCondition:
      if (node.fileReference) {
        action(node.fileReference);
      }
      break;
    case SyntaxKind.FlushStatement:
      if (node.file && node.file !== "*") {
        action(node.file);
      }
      break;
    case SyntaxKind.FormatList:
      node.items.forEach(action);
      break;
    case SyntaxKind.FormatListItem:
      if (node.level) {
        action(node.level);
      }
      if (node.item) {
        action(node.item);
      }
      if (node.list) {
        action(node.list);
      }
      break;
    case SyntaxKind.FormatListItemLevel:
      break;
    case SyntaxKind.FormatStatement:
      if (node.list) {
        action(node.list);
      }
      break;
    case SyntaxKind.FreeStatement:
      node.references.forEach(action);
      break;
    case SyntaxKind.GetCopy:
      break;
    case SyntaxKind.GetFile:
      if (node.file) {
        action(node.file);
      }
      break;
    case SyntaxKind.GetFileStatement:
      break;
    case SyntaxKind.GetSkip:
      if (node.skipExpression) {
        action(node.skipExpression);
      }
      break;
    case SyntaxKind.GetStringStatement:
      if (node.expression) {
        action(node.expression);
      }
      if (node.dataSpecification) {
        action(node.dataSpecification);
      }
      break;
    case SyntaxKind.GFormatItem:
      if (node.fieldWidth) {
        action(node.fieldWidth);
      }
      break;
    case SyntaxKind.GoToStatement:
      if (node.label) {
        action(node.label);
      }
      break;
    case SyntaxKind.HandleAttribute:
      break;
    case SyntaxKind.IfStatement:
      if (node.expression) {
        action(node.expression);
      }
      if (node.unit) {
        action(node.unit);
      }
      if (node.else) {
        action(node.else);
      }
      break;
    case SyntaxKind.IncludeDirective:
      node.items.forEach(action);
      break;
    case SyntaxKind.IncludeItem:
      break;
    case SyntaxKind.InitAcrossExpression:
      node.expressions.forEach(action);
      break;
    case SyntaxKind.InitialAttribute:
      node.expressions.forEach(action);
      node.items.forEach(action);
      if (node.procedureCall) {
        action(node.procedureCall);
      }
      if (node.content) {
        action(node.content);
      }
      break;
    case SyntaxKind.InitialAttributeItemStar:
      break;
    case SyntaxKind.InitialAttributeSpecification:
      if (node.item) {
        action(node.item);
      }
      if (node.expression) {
        action(node.expression);
      }
      break;
    case SyntaxKind.InitialAttributeSpecificationIterationValue:
      node.items.forEach(action);
      break;
    case SyntaxKind.InitialToContent:
      break;
    case SyntaxKind.IterateStatement:
      if (node.label) {
        action(node.label);
      }
      break;
    case SyntaxKind.KeywordCondition:
      break;
    case SyntaxKind.LabelPrefix:
      break;
    case SyntaxKind.LabelReference:
      break;
    case SyntaxKind.LeaveStatement:
      if (node.label) {
        action(node.label);
      }
      break;
    case SyntaxKind.LFormatItem:
      break;
    case SyntaxKind.LikeAttribute:
      if (node.reference) {
        action(node.reference);
      }
      break;
    case SyntaxKind.LineDirective:
      break;
    case SyntaxKind.LineFormatItem:
      if (node.lineNumber) {
        action(node.lineNumber);
      }
      break;
    case SyntaxKind.LinkageOptionsItem:
      break;
    case SyntaxKind.Literal:
      if (node.multiplier) {
        action(node.multiplier);
      }
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.LocateStatement:
      if (node.variable) {
        action(node.variable);
      }
      break;
    case SyntaxKind.LocateStatementOption:
      if (node.element) {
        action(node.element);
      }
      break;
    case SyntaxKind.LocatorCall:
      if (node.element) {
        action(node.element);
      }
      if (node.previous) {
        action(node.previous);
      }
      break;
    case SyntaxKind.MemberCall:
      if (node.element) {
        action(node.element);
      }
      if (node.previous) {
        action(node.previous);
      }
      break;
    case SyntaxKind.NamedCondition:
      break;
    case SyntaxKind.NoMapOptionsItem:
      break;
    case SyntaxKind.NoPrintDirective:
      break;
    case SyntaxKind.NoteDirective:
      if (node.message) {
        action(node.message);
      }
      if (node.code) {
        action(node.code);
      }
      break;
    case SyntaxKind.NullStatement:
      break;
    case SyntaxKind.NumberLiteral:
      break;
    case SyntaxKind.OnStatement:
      node.conditions.forEach(action);
      if (node.onUnit) {
        action(node.onUnit);
      }
      break;
    case SyntaxKind.OpenStatement:
      node.options.forEach(action);
      break;
    case SyntaxKind.OpenOptionsGroup:
      node.options.forEach(action);
      break;
    case SyntaxKind.OpenOption:
      if (node.expression) {
        action(node.expression);
      }
      break;
    case SyntaxKind.Options:
      node.items.forEach(action);
      break;
    case SyntaxKind.OrdinalTypeAttribute:
      break;
    case SyntaxKind.OrdinalValue:
      break;
    case SyntaxKind.OrdinalValueList:
      node.members.forEach(action);
      break;
    case SyntaxKind.OtherwiseStatement:
      if (node.unit) {
        action(node.unit);
      }
      break;
    case SyntaxKind.Package:
      if (node.exports) {
        action(node.exports);
      }
      if (node.reserves) {
        action(node.reserves);
      }
      if (node.options) {
        action(node.options);
      }
      node.statements.forEach(action);
      if (node.end) {
        action(node.end);
      }
      break;
    case SyntaxKind.PageDirective:
      break;
    case SyntaxKind.PageFormatItem:
      break;
    case SyntaxKind.Parenthesis:
      if (node.value) {
        action(node.value);
      }
      if (node.do) {
        action(node.do);
      }
      break;
    case SyntaxKind.PFormatItem:
      break;
    case SyntaxKind.PictureAttribute:
      break;
    case SyntaxKind.PliProgram:
      node.statements.forEach(action);
      break;
    case SyntaxKind.PopDirective:
      break;
    case SyntaxKind.PrefixedAttribute:
      if (node.attribute) {
        action(node.attribute);
      }
      break;
    case SyntaxKind.PrintDirective:
      break;
    case SyntaxKind.ProcedureCall:
      if (node.args1) {
        action(node.args1);
      }
      if (node.args2) {
        action(node.args2);
      }
      break;
    case SyntaxKind.ProcedureCallArgs:
      for (const arg of node.list) {
        if (arg !== "*") {
          action(arg);
        }
      }
      break;
    case SyntaxKind.ProcedureParameter:
      break;
    case SyntaxKind.ProcedureStatement:
      node.parameters.forEach(action);
      node.statements.forEach(action);
      node.returns.forEach(action);
      node.options.forEach(action);
      if (node.end) {
        action(node.end);
      }
      node.environmentName.forEach(action);
      break;
    case SyntaxKind.ProcessDirective:
      node.compilerOptions.forEach(action);
      break;
    case SyntaxKind.ProcincDirective:
      break;
    case SyntaxKind.PushDirective:
      break;
    case SyntaxKind.PutFileStatement:
      node.items.forEach(action);
      break;
    case SyntaxKind.PutItem:
      if (node.expression) {
        action(node.expression);
      }
      break;
    case SyntaxKind.PutStringStatement:
      if (node.stringExpression) {
        action(node.stringExpression);
      }
      if (node.dataSpecification) {
        action(node.dataSpecification);
      }
      break;
    case SyntaxKind.QualifyStatement:
      node.statements.forEach(action);
      if (node.end) {
        action(node.end);
      }
      break;
    case SyntaxKind.ReadStatement:
      break;
    case SyntaxKind.ReadStatementOption:
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.ReferenceItem:
      if (node.dimensions) {
        action(node.dimensions);
      }
      break;
    case SyntaxKind.ReinitStatement:
      if (node.reference) {
        action(node.reference);
      }
      break;
    case SyntaxKind.ReleaseStatement:
      break;
    case SyntaxKind.Reserves:
      break;
    case SyntaxKind.ResignalStatement:
      break;
    case SyntaxKind.ReturnsAttribute:
      break;
    case SyntaxKind.ReturnsOption:
      node.returnAttributes.forEach(action);
      break;
    case SyntaxKind.ReturnStatement:
      if (node.expression) {
        action(node.expression);
      }
      break;
    case SyntaxKind.RevertStatement:
      node.conditions.forEach(action);
      break;
    case SyntaxKind.RewriteStatement:
      node.arguments.forEach(action);
      break;
    case SyntaxKind.RewriteStatementOption:
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.RFormatItem:
      break;
    case SyntaxKind.SelectStatement:
      if (node.on) {
        action(node.on);
      }
      if (node.end) {
        action(node.end);
      }
      break;
    case SyntaxKind.SignalStatement:
      node.condition.forEach(action);
      break;
    case SyntaxKind.SimpleOptionsItem:
      break;
    case SyntaxKind.SkipDirective:
      if (node.lines) {
        action(node.lines);
      }
      break;
    case SyntaxKind.SkipFormatItem:
      if (node.skip) {
        action(node.skip);
      }
      break;
    case SyntaxKind.Statement:
      if (node.condition) {
        action(node.condition);
      }
      node.labels.forEach(action);
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.StopStatement:
      break;
    case SyntaxKind.StringLiteral:
      break;
    case SyntaxKind.SubStructure:
      node.attributes.forEach(action);
      break;
    case SyntaxKind.TypeAttribute:
      break;
    case SyntaxKind.UnaryExpression:
      if (node.expr) {
        action(node.expr);
      }
      break;
    case SyntaxKind.ValueAttribute:
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.ValueListAttribute:
      node.values.forEach(action);
      break;
    case SyntaxKind.ValueListFromAttribute:
      if (node.from) {
        action(node.from);
      }
      break;
    case SyntaxKind.ValueRangeAttribute:
      node.values.forEach(action);
      break;
    case SyntaxKind.VFormatItem:
      break;
    case SyntaxKind.WaitStatement:
      if (node.task) {
        action(node.task);
      }
      break;
    case SyntaxKind.WhenStatement:
      node.conditions.forEach(action);
      if (node.unit) {
        action(node.unit);
      }
      break;
    case SyntaxKind.WriteStatement:
      node.arguments.forEach(action);
      break;
    case SyntaxKind.WriteStatementOption:
      if (node.value) {
        action(node.value);
      }
      break;
    case SyntaxKind.XFormatItem:
      if (node.width) {
        action(node.width);
      }
      break;
  }
}
