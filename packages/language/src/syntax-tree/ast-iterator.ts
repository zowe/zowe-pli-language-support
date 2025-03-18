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

import { Reference, SyntaxKind, SyntaxNode } from "./ast";

export function allReferences(node: SyntaxNode): [SyntaxNode, Reference][] {
    const result: [SyntaxNode, Reference][] = [];
    for (const child of iterateNode(node)) {
        const ref = getReference(child);
        if (ref) {
            result.push([child, ref]);
        }
        result.push(...allReferences(child));
    }
    return result;
}

export function getReference(node: SyntaxNode): Reference | undefined {
    switch (node.kind) {
        case SyntaxKind.ReferenceItem:
            return node.ref ?? undefined;
    }
    return undefined;
}

export function* iterateNode(node: SyntaxNode): Iterable<SyntaxNode> {
    switch (node.kind) {
        case SyntaxKind.AFormatItem:
            if (node.fieldWidth) {
                yield node.fieldWidth;
            }
            break;
        case SyntaxKind.AllocateDimension:
            if (node.dimensions) {
                yield node.dimensions;
            }
            break;
        case SyntaxKind.AllocatedVariable:
            if (node.var) {
                yield node.var;
            }
            if (node.attribute) {
                yield node.attribute;
            }
            break;
        case SyntaxKind.AllocateLocationReferenceIn:
            if (node.area) {
                yield node.area;
            }
            break;
        case SyntaxKind.AllocateLocationReferenceSet:
            if (node.locatorVariable) {
                yield node.locatorVariable;
            }
            break;
        case SyntaxKind.AllocateStatement:
            yield* node.variables;
            break;
        case SyntaxKind.AllocateType:
            if (node.dimensions) {
                yield node.dimensions;
            }
            break;
        case SyntaxKind.AssertStatement:
            if (node.actual) {
                yield node.actual;
            }
            if (node.displayExpression) {
                yield node.displayExpression;
            }
            if (node.expected) {
                yield node.expected;
            }
            break;
        case SyntaxKind.AssignmentStatement:
            yield* node.refs;
            if (node.expression) {
                yield node.expression;
            }
            if (node.dimacrossExpr) {
                yield node.dimacrossExpr;
            }
            break;
        case SyntaxKind.AttachStatement:
            if (node.reference) {
                yield node.reference;
            }
            if (node.task) {
                yield node.task;
            }
            if (node.tstack) {
                yield node.tstack;
            }
            break;
        case SyntaxKind.BeginStatement:
            if (node.options) {
                yield node.options;
            }
            yield* node.statements;
            if (node.end) {
                yield node.end;
            }
            break;
        case SyntaxKind.BFormatItem:
            if (node.fieldWidth) {
                yield node.fieldWidth;
            }
            break;
        case SyntaxKind.BinaryExpression:
            if (node.left) {
                yield node.left;
            }
            if (node.right) {
                yield node.right;
            }
            break;
        case SyntaxKind.Bound:
            if (node.refer) {
                yield node.refer;
            }
            if (node.expression && node.expression !== '*') {
                yield node.expression;
            }
            break;
        case SyntaxKind.CallStatement:
            if (node.call) {
                yield node.call;
            }
            break;
        case SyntaxKind.CancelThreadStatement:
            if (node.thread) {
                yield node.thread;
            }
            break;
        case SyntaxKind.CFormatItem:
            break;
        case SyntaxKind.CloseStatement:
            break;
        case SyntaxKind.CMPATOptionsItem:
            break;
        case SyntaxKind.ColumnFormatItem:
            if (node.characterPosition) {
                yield node.characterPosition;
            }
            break;
        case SyntaxKind.CompilerOptions:
            break;
        case SyntaxKind.ComputationDataAttribute:
            if (node.dimensions) {
                yield node.dimensions;
            }
            break;
        case SyntaxKind.ConditionPrefix:
            yield* node.items;
            break;
        case SyntaxKind.ConditionPrefixItem:
            yield* node.conditions;
            break;
        case SyntaxKind.DataSpecificationDataList:
            yield* node.items;
            break;
        case SyntaxKind.DataSpecificationDataListItem:
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.DataSpecificationOptions:
            if (node.dataList) {
                yield node.dataList;
            }
            yield* node.dataLists;
            yield* node.formatLists;
            yield* node.dataListItems;
            break;
        case SyntaxKind.DateAttribute:
            break;
        case SyntaxKind.DeclaredItem:
            yield* node.attributes;
            yield* node.items;
            break;
        case SyntaxKind.DeclaredVariable:
            break;
        case SyntaxKind.DeclareStatement:
            yield* node.items;
            break;
        case SyntaxKind.DefaultAttributeExpression:
            yield* node.items;
            break;
        case SyntaxKind.DefaultAttributeExpressionNot:
            break;
        case SyntaxKind.DefaultExpression:
            if (node.expression) {
                yield node.expression;
            }
            yield* node.attributes;
            break;
        case SyntaxKind.DefaultExpressionPart:
            if (node.expression) {
                yield node.expression;
            }
            if (node.identifiers) {
                yield node.identifiers;
            }
            break;
        case SyntaxKind.DefaultRangeIdentifierItem:
            break;
        case SyntaxKind.DefaultRangeIdentifiers:
            break;
        case SyntaxKind.DefaultStatement:
            yield* node.expressions;
            break;
        case SyntaxKind.DefaultValueAttribute:
            yield* node.items;
            break;
        case SyntaxKind.DefaultValueAttributeItem:
            yield* node.attributes;
            break;
        case SyntaxKind.DefineAliasStatement:
            yield* node.attributes;
            break;
        case SyntaxKind.DefinedAttribute:
            if (node.reference) {
                yield node.reference;
            }
            if (node.position) {
                yield node.position;
            }
            break;
        case SyntaxKind.DefineOrdinalStatement:
            if (node.ordinalValues) {
                yield node.ordinalValues;
            }
            break;
        case SyntaxKind.DefineStructureStatement:
            yield* node.substructures;
            break;
        case SyntaxKind.DelayStatement:
            if (node.delay) {
                yield node.delay;
            }
            break;
        case SyntaxKind.DeleteStatement:
            if (node.file) {
                yield node.file;
            }
            if (node.key) {
                yield node.key;
            }
            break;
        case SyntaxKind.DetachStatement:
            if (node.reference) {
                yield node.reference;
            }
            break;
        case SyntaxKind.DimensionBound:
            if (node.bound1) {
                yield node.bound1;
            }
            if (node.bound2) {
                yield node.bound2;
            }
            break;
        case SyntaxKind.Dimensions:
            yield* node.dimensions;
            break;
        case SyntaxKind.DimensionsDataAttribute:
            if (node.dimensions) {
                yield node.dimensions;
            }
            break;
        case SyntaxKind.DisplayStatement:
            if (node.expression) {
                yield node.expression;
            }
            if (node.reply) {
                yield node.reply;
            }
            break;
        case SyntaxKind.DoSpecification:
            if (node.exp1) {
                yield node.exp1;
            }
            if (node.upthru) {
                yield node.upthru;
            }
            if (node.downthru) {
                yield node.downthru;
            }
            if (node.repeat) {
                yield node.repeat;
            }
            if (node.to) {
                yield node.to;
            }
            if (node.by) {
                yield node.by;
            }
            break;
        case SyntaxKind.DoStatement:
            yield* node.statements;
            if (node.end) {
                yield node.end;
            }
            if (node.doType2) {
                yield node.doType2;
            }
            if (node.doType3) {
                yield node.doType3;
            }
            break;
        case SyntaxKind.DoType3:
            if (node.variable) {
                yield node.variable;
            }
            yield* node.specifications;
            break;
        case SyntaxKind.DoType3Variable:
            break;
        case SyntaxKind.DoUntil:
            if (node.until) {
                yield node.until;
            }
            if (node.while) {
                yield node.while;
            }
            break;
        case SyntaxKind.DoWhile:
            if (node.while) {
                yield node.while;
            }
            if (node.until) {
                yield node.until;
            }
            break;
        case SyntaxKind.EFormatItem:
            if (node.fieldWidth) {
                yield node.fieldWidth;
            }
            if (node.fractionalDigits) {
                yield node.fractionalDigits;
            }
            if (node.significantDigits) {
                yield node.significantDigits;
            }
            break;
        case SyntaxKind.EndStatement:
            yield* node.labels;
            if (node.label) {
                yield node.label;
            }
            break;
        case SyntaxKind.EntryAttribute:
            yield* node.attributes;
            yield* node.options;
            yield* node.returns;
            yield* node.environmentName;
            break;
        case SyntaxKind.EntryParameterDescription:
            yield* node.attributes;
            break;
        case SyntaxKind.EntryStatement:
            yield* node.parameters;
            yield* node.returns;
            yield* node.options;
            yield* node.environmentName;
            break;
        case SyntaxKind.EntryUnionDescription:
            yield* node.attributes;
            yield* node.prefixedAttributes;
            break;
        case SyntaxKind.EnvironmentAttribute:
            yield* node.items;
            break;
        case SyntaxKind.EnvironmentAttributeItem:
            yield* node.args;
            break;
        case SyntaxKind.ExecStatement:
            break;
        case SyntaxKind.ExitStatement:
            break;
        case SyntaxKind.Exports:
            break;
        case SyntaxKind.FetchEntry:
            if (node.set) {
                yield node.set;
            }
            if (node.title) {
                yield node.title;
            }
            break;
        case SyntaxKind.FetchStatement:
            yield* node.entries;
            break;
        case SyntaxKind.FFormatItem:
            if (node.fieldWidth) {
                yield node.fieldWidth;
            }
            if (node.fractionalDigits) {
                yield node.fractionalDigits;
            }
            if (node.scalingFactor) {
                yield node.scalingFactor;
            }
            break;
        case SyntaxKind.FileReferenceCondition:
            if (node.fileReference) {
                yield node.fileReference;
            }
            break;
        case SyntaxKind.FlushStatement:
            break;
        case SyntaxKind.FormatList:
            yield* node.items;
            break;
        case SyntaxKind.FormatListItem:
            if (node.level) {
                yield node.level;
            }
            if (node.item) {
                yield node.item;
            }
            if (node.list) {
                yield node.list;
            }
            break;
        case SyntaxKind.FormatListItemLevel:
            break;
        case SyntaxKind.FormatStatement:
            if (node.list) {
                yield node.list;
            }
            break;
        case SyntaxKind.FreeStatement:
            yield* node.references;
            break;
        case SyntaxKind.GetCopy:
            break;
        case SyntaxKind.GetFile:
            if (node.file) {
                yield node.file;
            }
            break;
        case SyntaxKind.GetFileStatement:
            break;
        case SyntaxKind.GetSkip:
            if (node.skipExpression) {
                yield node.skipExpression;
            }
            break;
        case SyntaxKind.GetStringStatement:
            if (node.expression) {
                yield node.expression;
            }
            if (node.dataSpecification) {
                yield node.dataSpecification;
            }
            break;
        case SyntaxKind.GFormatItem:
            if (node.fieldWidth) {
                yield node.fieldWidth;
            }
            break;
        case SyntaxKind.GoToStatement:
            if (node.label) {
                yield node.label;
            }
            break;
        case SyntaxKind.HandleAttribute:
            break;
        case SyntaxKind.IfStatement:
            if (node.expression) {
                yield node.expression;
            }
            if (node.unit) {
                yield node.unit;
            }
            if (node.else) {
                yield node.else;
            }
            break;
        case SyntaxKind.IncludeDirective:
            yield* node.items;
            break;
        case SyntaxKind.IncludeItem:
            break;
        case SyntaxKind.InitAcrossExpression:
            yield* node.expressions;
            break;
        case SyntaxKind.InitialAttribute:
            yield* node.expressions;
            yield* node.items;
            if (node.procedureCall) {
                yield node.procedureCall;
            }
            if (node.content) {
                yield node.content;
            }
            break;
        case SyntaxKind.InitialAttributeItemStar:
            break;
        case SyntaxKind.InitialAttributeSpecification:
            if (node.item) {
                yield node.item;
            }
            if (node.expression) {
                yield node.expression;
            }
            break;
        case SyntaxKind.InitialAttributeSpecificationIterationValue:
            yield* node.items;
            break;
        case SyntaxKind.InitialToContent:
            break;
        case SyntaxKind.IterateStatement:
            if (node.label) {
                yield node.label;
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
                yield node.label;
            }
            break;
        case SyntaxKind.LFormatItem:
            break;
        case SyntaxKind.LikeAttribute:
            if (node.reference) {
                yield node.reference;
            }
            break;
        case SyntaxKind.LineDirective:
            break;
        case SyntaxKind.LineFormatItem:
            if (node.lineNumber) {
                yield node.lineNumber;
            }
            break;
        case SyntaxKind.LinkageOptionsItem:
            break;
        case SyntaxKind.Literal:
            if (node.multiplier) {
                yield node.multiplier;
            }
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.LocateStatement:
            if (node.variable) {
                yield node.variable;
            }
            break;
        case SyntaxKind.LocateStatementFile:
            if (node.file) {
                yield node.file;
            }
            break;
        case SyntaxKind.LocateStatementKeyFrom:
            if (node.keyfrom) {
                yield node.keyfrom;
            }
            break;
        case SyntaxKind.LocateStatementSet:
            if (node.set) {
                yield node.set;
            }
            break;
        case SyntaxKind.LocatorCall:
            if (node.element) {
                yield node.element;
            }
            if (node.previous) {
                yield node.previous;
            }
            break;
        case SyntaxKind.MemberCall:
            if (node.element) {
                yield node.element;
            }
            if (node.previous) {
                yield node.previous;
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
                yield node.message;
            }
            if (node.code) {
                yield node.code;
            }
            break;
        case SyntaxKind.NullStatement:
            break;
        case SyntaxKind.NumberLiteral:
            break;
        case SyntaxKind.OnStatement:
            yield* node.conditions;
            if (node.onUnit) {
                yield node.onUnit;
            }
            break;
        case SyntaxKind.OpenOptionsAccess:
            break;
        case SyntaxKind.OpenOptionsBuffering:
            break;
        case SyntaxKind.OpenOptionsFile:
            if (node.file) {
                yield node.file;
            }
            break;
        case SyntaxKind.OpenOptionsKeyed:
            break;
        case SyntaxKind.OpenOptionsLineSize:
            if (node.lineSize) {
                yield node.lineSize;
            }
            break;
        case SyntaxKind.OpenOptionsPageSize:
            if (node.pageSize) {
                yield node.pageSize;
            }
            break;
        case SyntaxKind.OpenOptionsPrint:
            break;
        case SyntaxKind.OpenOptionsStream:
            break;
        case SyntaxKind.OpenOptionsTitle:
            if (node.title) {
                yield node.title;
            }
            break;
        case SyntaxKind.OpenStatement:
            yield* node.options;
            break;
        case SyntaxKind.OpenOptionsGroup:
            yield* node.options;
            break;
        case SyntaxKind.Options:
            yield* node.items;
            break;
        case SyntaxKind.OrdinalTypeAttribute:
            break;
        case SyntaxKind.OrdinalValue:
            break;
        case SyntaxKind.OrdinalValueList:
            yield* node.members;
            break;
        case SyntaxKind.OtherwiseStatement:
            if (node.unit) {
                yield node.unit;
            }
            break;
        case SyntaxKind.Package:
            if (node.exports) {
                yield node.exports;
            }
            if (node.reserves) {
                yield node.reserves;
            }
            if (node.options) {
                yield node.options;
            }
            yield* node.statements;
            if (node.end) {
                yield node.end;
            }
            break;
        case SyntaxKind.PageDirective:
            break;
        case SyntaxKind.PageFormatItem:
            break;
        case SyntaxKind.Parenthesis:
            if (node.value) {
                yield node.value;
            }
            if (node.do) {
                yield node.do;
            }
            break;
        case SyntaxKind.PFormatItem:
            break;
        case SyntaxKind.PictureAttribute:
            break;
        case SyntaxKind.PliProgram:
            yield* node.statements;
            break;
        case SyntaxKind.PopDirective:
            break;
        case SyntaxKind.PrefixedAttribute:
            if (node.attribute) {
                yield node.attribute;
            }
            break;
        case SyntaxKind.PrintDirective:
            break;
        case SyntaxKind.ProcedureCall:
            break;
        case SyntaxKind.ProcedureParameter:
            break;
        case SyntaxKind.ProcedureStatement:
            yield* node.parameters;
            yield* node.statements;
            yield* node.returns;
            yield* node.options;
            if (node.end) {
                yield node.end;
            }
            yield* node.environmentName;
            break;
        case SyntaxKind.ProcessDirective:
            yield* node.compilerOptions;
            break;
        case SyntaxKind.ProcincDirective:
            break;
        case SyntaxKind.PushDirective:
            break;
        case SyntaxKind.PutFileStatement:
            yield* node.items;
            break;
        case SyntaxKind.PutItem:
            if (node.expression) {
                yield node.expression;
            }
            break;
        case SyntaxKind.PutStringStatement:
            if (node.stringExpression) {
                yield node.stringExpression;
            }
            if (node.dataSpecification) {
                yield node.dataSpecification;
            }
            break;
        case SyntaxKind.QualifyStatement:
            yield* node.statements;
            if (node.end) {
                yield node.end;
            }
            break;
        case SyntaxKind.ReadStatement:
            break;
        case SyntaxKind.ReadStatementOption:
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.ReferenceItem:
            if (node.dimensions) {
                yield node.dimensions;
            }
            break;
        case SyntaxKind.ReinitStatement:
            if (node.reference) {
                yield node.reference;
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
            yield* node.returnAttributes;
            break;
        case SyntaxKind.ReturnStatement:
            if (node.expression) {
                yield node.expression;
            }
            break;
        case SyntaxKind.RevertStatement:
            yield* node.conditions;
            break;
        case SyntaxKind.RewriteStatement:
            yield* node.arguments;
            break;
        case SyntaxKind.RewriteStatementOption:
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.RFormatItem:
            break;
        case SyntaxKind.SelectStatement:
            if (node.on) {
                yield node.on;
            }
            if (node.end) {
                yield node.end;
            }
            break;
        case SyntaxKind.SignalStatement:
            yield* node.condition;
            break;
        case SyntaxKind.SimpleOptionsItem:
            break;
        case SyntaxKind.SkipDirective:
            if (node.lines) {
                yield node.lines;
            }
            break;
        case SyntaxKind.SkipFormatItem:
            if (node.skip) {
                yield node.skip;
            }
            break;
        case SyntaxKind.Statement:
            if (node.condition) {
                yield node.condition;
            }
            yield* node.labels;
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.StopStatement:
            break;
        case SyntaxKind.StringLiteral:
            break;
        case SyntaxKind.SubStructure:
            yield* node.attributes;
            break;
        case SyntaxKind.TypeAttribute:
            break;
        case SyntaxKind.UnaryExpression:
            if (node.expr) {
                yield node.expr;
            }
            break;
        case SyntaxKind.ValueAttribute:
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.ValueListAttribute:
            yield* node.values;
            break;
        case SyntaxKind.ValueListFromAttribute:
            if (node.from) {
                yield node.from;
            }
            break;
        case SyntaxKind.ValueRangeAttribute:
            yield* node.values;
            break;
        case SyntaxKind.VFormatItem:
            break;
        case SyntaxKind.WaitStatement:
            if (node.task) {
                yield node.task;
            }
            break;
        case SyntaxKind.WhenStatement:
            yield* node.conditions;
            if (node.unit) {
                yield node.unit;
            }
            break;
        case SyntaxKind.WriteStatement:
            yield* node.arguments;
            break;
        case SyntaxKind.WriteStatementOption:
            if (node.value) {
                yield node.value;
            }
            break;
        case SyntaxKind.XFormatItem:
            if (node.width) {
                yield node.width;
            }
            break;
    }
}
