import { CompletionItemKind, InsertTextFormat } from "vscode-languageserver";
import { CstNodeKind } from "../../syntax-tree/cst";
import { MultiMap } from "../../utils/collections";
import { SimpleCompletionItem } from "../types";

const createSimpleCompletionItemCreator =
  (properties: Omit<SimpleCompletionItem, "label" | "text">) =>
  (label: string, text?: string): SimpleCompletionItem => {
    return {
      ...properties,
      label,
      text: text ?? label,
    };
  };

/**
 * Plaintext Keyword
 */
const kw = createSimpleCompletionItemCreator({
  kind: CompletionItemKind.Keyword,
});

/**
 * Snippet Keyword
 */
const kws = createSimpleCompletionItemCreator({
  kind: CompletionItemKind.Keyword,
  insertTextFormat: InsertTextFormat.Snippet,
});

export const PreprocessorCompletionKeywords: MultiMap<
  CstNodeKind,
  SimpleCompletionItem
> = new MultiMap([
  [CstNodeKind.DeactivateStatement_DEACTIVATE, kw("%DEACTIVATE")],
  [CstNodeKind.DeactivateStatement_DEACTIVATE, kw("%DEACT")],
  [CstNodeKind.ActivateStatement_ACTIVATE, kw("%ACTIVATE")],
  [CstNodeKind.ActivateStatement_ACTIVATE, kw("%ACT")],
]);

export const CompletionKeywords: MultiMap<CstNodeKind, SimpleCompletionItem> =
  new MultiMap([
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
    [CstNodeKind.GoToStatement_GOTO, kw("GOTO")],
    [CstNodeKind.IfStatement_IF, kw("IF")],
    [CstNodeKind.IterateStatement_ITERATE, kw("ITERATE")],
    [CstNodeKind.LeaveStatement_LEAVE, kw("LEAVE")],
    [CstNodeKind.LocateStatement_LOCATE, kw("LOCATE")],
    [CstNodeKind.OnStatement_ON, kw("ON")],
    [CstNodeKind.OpenStatement_OPEN, kw("OPEN")],
    [CstNodeKind.PutStatement_PUT, kws("PUT", "PUT(${1:value})")],
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
  ]);
