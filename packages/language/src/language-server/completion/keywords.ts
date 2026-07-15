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

interface Decorator {
  (item: SimpleCompletionItem): SimpleCompletionItem;
}

interface Combinator extends Decorator {
  decorate(
    fn: (item: SimpleCompletionItem) => SimpleCompletionItem,
  ): Combinator;
  build(): Builder;
}

interface Builder {
  (
    label: string,
    text?: string,
    moreProps?: Partial<SimpleCompletionItem>,
  ): SimpleCompletionItem;
}

function combine(...decorators: Decorator[]): Combinator {
  const decorator: Decorator = (item) => {
    for (const dec of decorators) {
      item = dec(item);
    }
    return item;
  };
  const combinator = decorator as Combinator;
  combinator.decorate = function (
    fn: (item: SimpleCompletionItem) => SimpleCompletionItem,
  ): Combinator {
    return combine(...decorators, fn);
  };
  combinator.build = function (): Builder {
    return (
      label: string,
      text?: string,
      moreProps?: Partial<SimpleCompletionItem>,
    ) => {
      let item: SimpleCompletionItem = {
        ...moreProps,
        label,
        text: text ?? label,
        kind: CompletionItemKind.Keyword,
      };
      for (const decorator of decorators) {
        item = decorator(item);
      }
      return item;
    };
  };
  return combinator;
}

const macro: Decorator = (item) => {
  item.detail = "MACRO";
  return item;
};

const prependPercent: Decorator = (item) => {
  item.text = `%${item.text}`;
  item.label = `%${item.label}`;
  return item;
};

const snippet: Decorator = (item) => {
  item.insertTextFormat = InsertTextFormat.Snippet;
  return item;
};

const keyword: Decorator = (item) => {
  item.kind = CompletionItemKind.Keyword;
  return item;
};

/**
 * Preprocessor keyword without percent sign
 */
export const ppkw = combine(macro, keyword).build();

/**
 * Preprocessor keyword with percent sign
 */
export const ppkwp = combine(macro, prependPercent, keyword).build();

/**
 * Preprocessor keyword, optionally with percent sign
 */
export const ppkwc = (
  withPercent: boolean,
  label: string,
  text?: string,
  moreProps?: Partial<SimpleCompletionItem>,
) => {
  if (withPercent) {
    return ppkwp(label, text, moreProps);
  } else {
    return ppkw(label, text, moreProps);
  }
};

/**
 * Plaintext keyword
 */
export const kw = combine(keyword).build();

/**
 * Snippet keyword
 */
const kws = combine(keyword, snippet).build();

type CompletionKeywordMap = MultiMap<CstNodeKind, string>;

const allPPStartKeywords = new MultiMap<CstNodeKind, string>([
  [CstNodeKind.DeactivateStatement_DEACTIVATE, "DEACTIVATE"],
  [CstNodeKind.ActivateStatement_ACTIVATE, "ACTIVATE"],
  [CstNodeKind.IncludeDirective_INCLUDE, "INCLUDE"],
  [CstNodeKind.InscanDirective_INSCAN, "INSCAN"],
  [CstNodeKind.DeclareStatement_DECLARE, "DECLARE"],
  [CstNodeKind.PageDirective_PAGE, "PAGE"],
  [CstNodeKind.PopDirective_POP, "POP"],
  [CstNodeKind.PushDirective_PUSH, "PUSH"],
  [CstNodeKind.PrintDirective_PRINT, "PRINT"],
  [CstNodeKind.NoPrintDirective_NOPRINT, "NOPRINT"],
  [CstNodeKind.DoStatement_DO, "DO"],
  [CstNodeKind.GoToStatement_GOTO, "GO TO"],
  [CstNodeKind.LeaveStatement_LEAVE, "LEAVE"],
  [CstNodeKind.IfStatement_IF, "IF"],
  [CstNodeKind.IterateStatement_ITERATE, "ITERATE"],
  [CstNodeKind.NoteDirective_PercentNOTE, "NOTE"],
  [CstNodeKind.ProcedureStatement_PROCEDURE, "PROCEDURE"],
  [CstNodeKind.ReplaceStatement_REPLACE, "REPLACE"],
  [CstNodeKind.SelectStatement_SELECT, "SELECT"],
]);

function createMap(
  map: CompletionKeywordMap,
  builder: Builder,
): MultiMap<CstNodeKind, SimpleCompletionItem> {
  const result = new MultiMap<CstNodeKind, SimpleCompletionItem>();
  for (const [kind, label] of map.entries()) {
    result.add(kind, builder(label));
  }
  return result;
}

export const CompletionKeywords = {
  StatementStartPreprocessor: createMap(allPPStartKeywords, ppkw),
  StatementStartPreprocessorWithPercent: createMap(allPPStartKeywords, ppkwp),
  StatementStartPreprocessorInProcedure: new MultiMap([
    [CstNodeKind.DeclareStatement_DECLARE, kw("DECLARE")],
    [CstNodeKind.AnswerStatement_ANSWER, kw("ANSWER")],
    [CstNodeKind.CallStatement_CALL, kw("CALL")],
    [CstNodeKind.DoStatement_DO, kw("DO")],
    [CstNodeKind.GoToStatement_GOTO, kw("GO TO")],
    [CstNodeKind.IfStatement_IF, kw("IF")],
    [CstNodeKind.IterateStatement_ITERATE, kw("ITERATE")],
    [CstNodeKind.LeaveStatement_LEAVE, kw("LEAVE")],
    [CstNodeKind.NoteDirective_PercentNOTE, kw("NOTE")],
    [CstNodeKind.ReturnStatement_RETURN, kw("RETURN")],
    [CstNodeKind.SelectStatement_SELECT, kw("SELECT")],
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
    [CstNodeKind.ExitStatement_EXIT, kw("EXIT")],
    [CstNodeKind.FetchStatement_FETCH, kw("FETCH")],
    [CstNodeKind.FlushStatement_FLUSH, kw("FLUSH")],
    [CstNodeKind.FormatStatement_FORMAT, kw("FORMAT")],
    [CstNodeKind.FreeStatement_FREE, kw("FREE")],
    [CstNodeKind.GetStatement_GET, kw("GET")],
    [CstNodeKind.GoToStatement_GOTO, kw("GO TO")],
    [CstNodeKind.GoToStatement_GOTO, kw("GOTO")],
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
    [CstNodeKind.TypeAttribute_TYPE, kw("ORDINAL")],
    [CstNodeKind.GenericAttribute_GENERIC, kw("GENERIC")],
    [CstNodeKind.IndForAttribute_INDFOR, kw("INDFOR")],
  ]),
};

export function getCompletionKeywords(
  kind: CstNodeKind,
): readonly SimpleCompletionItem[] {
  return Object.values(CompletionKeywords).flatMap((map) => map.get(kind));
}
