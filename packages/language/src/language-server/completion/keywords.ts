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

import { CompletionItemKind, InsertTextFormat } from "vscode-languageserver";
import { CstNodeKind } from "../../syntax-tree/cst";
import { MultiMap } from "../../utils/collections";
import { SimpleCompletionItem } from "../types";

const createSimpleCompletionItemCreator =
  (properties: Omit<SimpleCompletionItem, "label" | "text">) =>
  (label: string, text?: string): SimpleCompletionItem => ({
    ...properties,
    label,
    text: text ?? label,
  });

/**
 * Plaintext keyword
 */
const kw = createSimpleCompletionItemCreator({
  kind: CompletionItemKind.Keyword,
});

/**
 * Snippet keyword
 */
const kws = createSimpleCompletionItemCreator({
  kind: CompletionItemKind.Keyword,
  insertTextFormat: InsertTextFormat.Snippet,
});

export const CompletionKeywords = {
  StatementStartPreprocessor: new MultiMap([
    [CstNodeKind.DeactivateStatement_DEACTIVATE, kw("%DEACTIVATE")],
    [CstNodeKind.DeactivateStatement_DEACTIVATE, kw("%DEACT")],
    [CstNodeKind.ActivateStatement_ACTIVATE, kw("%ACTIVATE")],
    [CstNodeKind.ActivateStatement_ACTIVATE, kw("%ACT")],
  ]),
  StatementStart: new MultiMap([
    [CstNodeKind.ProcedureStatement_PROCEDURE, kw("PROCEDURE")],
    [CstNodeKind.EntryStatement_ENTRY, kw("ENTRY")],
    [CstNodeKind.AllocateStatement_ALLOCATE, kw("ALLOCATE")],
    [CstNodeKind.AssertStatement_ASSERT, kw("ASSERT")],
    [CstNodeKind.AttachStatement_ATTACH, kw("ATTACH")],
    [CstNodeKind.BeginStatement_BEGIN, kw("BEGIN")],
    [CstNodeKind.EndStatement_END, kw("END")],
    [CstNodeKind.CallStatement_CALL, kw("CALL")],
    [CstNodeKind.CloseStatement_CLOSE, kw("CLOSE")],
    [CstNodeKind.DefaultStatement_DEFAULT, kw("DEFAULT")],
    [CstNodeKind.DelayStatement_DELAY, kw("DELAY")],
    [CstNodeKind.DeleteStatement_DELETE, kw("DELETE")],
    [CstNodeKind.DetachStatement_DETACH, kw("DETACH")],
    [CstNodeKind.DisplayStatement_DISPLAY, kw("DISPLAY")],
    [CstNodeKind.DoStatement_DO, kw("DO")],
    [CstNodeKind.ExecStatement_EXEC, kw("EXEC")],
    [CstNodeKind.ExitStatement_EXIT, kw("EXIT")],
    [CstNodeKind.FetchStatement_FETCH, kw("FETCH")],
    [CstNodeKind.FlushStatement_FLUSH, kw("FLUSH")],
    [CstNodeKind.FormatStatement_FORMAT, kw("FORMAT")],
    [CstNodeKind.FreeStatement_FREE, kw("FREE")],
    [CstNodeKind.GetStatement_GET, kw("GET")],
    [CstNodeKind.GoToStatement_GOTO, kw("GO TO")],
    [CstNodeKind.GoToStatement_GOTO, kw("GOTO")],
    [CstNodeKind.GoToStatement_GO, kw("GO")],
    [CstNodeKind.GoToStatement_TO, kw("TO")], // This only appears after the `GO` keyword (can be done later)
    [CstNodeKind.IfStatement_IF, kw("IF")],
    [CstNodeKind.IterateStatement_ITERATE, kw("ITERATE")],
    [CstNodeKind.LeaveStatement_LEAVE, kw("LEAVE")],
    [CstNodeKind.LocateStatement_LOCATE, kw("LOCATE")],
    [CstNodeKind.OnStatement_ON, kw("ON")],
    [CstNodeKind.OpenStatement_OPEN, kw("OPEN")],
    [CstNodeKind.PutStatement_PUT, kws("PUT ", "PUT(${1:value})")],
    [CstNodeKind.QualifyStatement_QUALIFY, kw("QUALIFY")],
    [CstNodeKind.ReadStatement_READ, kw("READ")],
    [CstNodeKind.ReinitStatement_REINIT, kw("REINIT")],
    [CstNodeKind.ReleaseStatement_RELEASE, kw("RELEASE")],
    [CstNodeKind.ResignalStatement_RESIGNAL, kw("RESIGNAL")],
    [CstNodeKind.ReturnStatement_RETURN, kw("RETURN")],
    [CstNodeKind.RevertStatement_REVERT, kw("REVERT")],
    [CstNodeKind.RewriteStatement_REWRITE, kw("REWRITE")],
    [CstNodeKind.SelectStatement_SELECT, kw("SELECT")],
    [CstNodeKind.WhenStatement_WHEN, kw("WHEN")],
    [CstNodeKind.OtherwiseStatement_OTHERWISE, kw("OTHERWISE")],
    [CstNodeKind.SignalStatement_SIGNAL, kw("SIGNAL")],
    [CstNodeKind.StopStatement_STOP, kw("STOP")],
    [CstNodeKind.WaitStatement_WAIT, kw("WAIT")],
    [CstNodeKind.WriteStatement_WRITE, kw("WRITE")],
    [CstNodeKind.DeclareStatement_DECLARE, kw("DECLARE")],
    [CstNodeKind.DeclareStatement_DECLARE, kw("DCL")],
  ]),
  /**
   * Used after `DCL ABC <|>`
   */
  DeclarationKeyword: new MultiMap([
    [CstNodeKind.InitialAttribute_INITIAL, kws("INITIAL($1)")],
    [CstNodeKind.DateAttribute_DATE, kw("DATE")],
    [CstNodeKind.HandleAttribute_HANDLE, kw("HANDLE($1)")],
    [CstNodeKind.DefinedAttribute_DEFINED, kw("DEFINED")],
    [CstNodeKind.PictureAttribute_PICTURE, kw("PICTURE")],
    [CstNodeKind.EnvironmentAttribute_ENVIRONMENT, kw("ENVIRONMENT")],
    // [CstNodeKind.DimensionsDataAttribute_DIMENSION, kw("??")], // @didrikmunther: unsure about this one
    [CstNodeKind.ValueListFromAttribute_VALUELISTFROM, kw("VALUELISTFROM")],
    [CstNodeKind.ValueListAttribute_VALUELIST, kw("VALUELIST")],
    [CstNodeKind.ValueRangeAttribute_VALUERANGE, kw("VALUERANGE")],
    [CstNodeKind.ReturnsAttribute_RETURNS, kw("RETURNS")],
    // [CstNodeKind.DefaultAttribute_Value, kw("??")], // @didrikmunther: unsure about this one
    [CstNodeKind.EntryAttribute_Limited0, kw("LIMITED")],
    [CstNodeKind.LikeAttribute_LIKE, kw("LIKE")],
    [CstNodeKind.TypeAttribute_TYPE, kw("TYPE")],
    [CstNodeKind.OrdinalTypeAttribute_ORDINAL, kw("ORDINAL")],
    [CstNodeKind.GenericAttribute_GENERIC, kw("GENERIC")],
    [CstNodeKind.IndForAttribute_INDFOR, kw("INDFOR")],
  ]),
};

export function getCompletionKeywords(
  kind: CstNodeKind,
): readonly SimpleCompletionItem[] {
  return Object.values(CompletionKeywords).flatMap((map) => map.get(kind));
}
