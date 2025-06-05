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

import {
  PreprocessorBinaryTokens,
  PreprocessorTokens,
} from "./pli-preprocessor-tokens";
import {
  PliPreprocessorParserState,
  PreprocessorParserState,
} from "./pli-preprocessor-parser-state";
import { PreprocessorError } from "./pli-preprocessor-error";
import { IToken } from "chevrotain";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { URI, UriUtils } from "../utils/uri";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import * as ast from "../syntax-tree/ast";
import {
  constructBinaryExpression,
  IntermediateBinaryExpression,
} from "../parser/abstract-parser";
import { CstNodeKind } from "../syntax-tree/cst";
import { PliPreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { LexingError } from "./pli-lexer";
import { TextDocuments } from "../language-server/text-documents";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  errors: LexingError[];
  perFileTokens: Record<string, IToken[]>;
};

export class PliPreprocessorParser {
  private readonly lexer: PliPreprocessorLexer;

  constructor(lexer: PliPreprocessorLexer) {
    this.lexer = lexer;
  }

  initializeState(text: string, uri: URI): PreprocessorParserState {
    return new PliPreprocessorParserState(this.lexer, text, uri);
  }

  start(state: PreprocessorParserState): PreprocessorParserResult {
    const statements: ast.Statement[] = [];
    const errors: LexingError[] = [];
    while (!state.eof) {
      try {
        if (
          state.isInProcedure() ||
          state.canConsume(PreprocessorTokens.Percentage)
        ) {
          const statement = this.statement(state);
          if (statement.value?.kind === ast.SyntaxKind.IncludeDirective) {
            errors.push(
              ...statement.value.items.flatMap((e) => e.result?.errors ?? []),
            );
          }
          statements.push(statement);
        } else {
          statements.push(this.consumeTokenStatement(state));
        }
      } catch (error) {
        if (error instanceof PreprocessorError) {
          errors.push(error);
        } else {
          throw error;
        }
      }
    }
    state.perFileTokens[state.uri.toString()] = state.tokens;
    return {
      statements,
      errors,
      perFileTokens: state.perFileTokens,
    };
  }

  private consumeTokenStatement(state: PreprocessorParserState): ast.Statement {
    const tokenStatement = ast.createTokenStatement();
    const tokens: IToken[] = [];
    const word = /\w$/u;
    // We can assume that the first token is always a non-% token
    // Otherwise we wouldn't be able to get here in the first place
    let currentToken: IToken | undefined = state.current;
    let nextToken: IToken | undefined = state.tokens[state.index + 1];
    while (currentToken) {
      state.index++;
      // Usually we break on % tokens
      // However, if the % token immediately follows a word character,
      // it indicates a replacement, so we continue parsing the statement
      if (
        nextToken?.tokenTypeIdx === PreprocessorTokens.Percentage.tokenTypeIdx
      ) {
        if (
          currentToken.endOffset! + 1 !== nextToken.startOffset ||
          !word.test(currentToken.image)
        ) {
          // If the next token is a standalone % token, we break but add the current token to the list
          tokens.push(currentToken);
          break;
        }
      }
      tokens.push(currentToken);
      currentToken = nextToken;
      nextToken = state.tokens[state.index + 1];
    }
    tokenStatement.tokens = tokens;
    const statement = ast.createStatement();
    statement.value = tokenStatement;
    return statement;
  }

  statement(state: PreprocessorParserState): ast.Statement {
    if (state.isOnlyInStatement()) {
      if (
        state.tryConsume(
          undefined,
          CstNodeKind.Percentage,
          PreprocessorTokens.Percentage,
        )
      ) {
        state.push("in-statement");
        try {
          return this.commonStatement(state);
        } finally {
          state.pop();
        }
      } else {
        return this.consumeTokenStatement(state);
      }
    } else {
      //state.isInProcedure()
      return this.commonStatement(state);
    }
  }

  commonStatement(state: PreprocessorParserState): ast.Statement {
    const statement = ast.createStatement();
    while (state.canConsume(PreprocessorTokens.Id, PreprocessorTokens.Colon)) {
      const label = ast.createLabelPrefix();
      const labelToken = state.consume(
        label,
        CstNodeKind.LabelPrefix_Name,
        PreprocessorTokens.Id,
      );
      label.name = labelToken.image;
      label.nameToken = labelToken;
      state.consume(
        label,
        CstNodeKind.LabelPrefix_Colon,
        PreprocessorTokens.Colon,
      );
      statement.labels.push(label);
    }
    let unit: ast.Unit | undefined = undefined;
    switch (state.current?.tokenTypeIdx) {
      case PreprocessorTokens.Activate.tokenTypeIdx:
        unit = this.activateStatement(state);
        break;
      case PreprocessorTokens.Deactivate.tokenTypeIdx:
        unit = this.deactivateStatement(state);
        break;
      case PreprocessorTokens.Declare.tokenTypeIdx:
        unit = this.declareStatement(state);
        break;
      case PreprocessorTokens.Page.tokenTypeIdx:
        unit = this.pageDirective(state);
        break;
      case PreprocessorTokens.Pop.tokenTypeIdx:
        unit = this.popDirective(state);
        break;
      case PreprocessorTokens.Push.tokenTypeIdx:
        unit = this.pushDirective(state);
        break;
      case PreprocessorTokens.Print.tokenTypeIdx:
        unit = this.printDirective(state);
        break;
      case PreprocessorTokens.NoPrint.tokenTypeIdx:
        unit = this.noprintDirective(state);
        break;
      case PreprocessorTokens.Skip.tokenTypeIdx:
        unit = this.skipStatement(state);
        break;
      case PreprocessorTokens.Include.tokenTypeIdx:
        unit = this.includeStatement(state);
        break;
      case PreprocessorTokens.Id.tokenTypeIdx:
        unit = this.assignmentStatement(state);
        break;
      case PreprocessorTokens.If.tokenTypeIdx:
        unit = this.ifStatement(state);
        break;
      case PreprocessorTokens.Do.tokenTypeIdx:
        unit = this.doStatement(state);
        break;
      case PreprocessorTokens.Goto.tokenTypeIdx:
      case PreprocessorTokens.Go.tokenTypeIdx:
        unit = this.goToStatement(state);
        break;
      case PreprocessorTokens.Leave.tokenTypeIdx:
        unit = this.leaveStatement(state);
        break;
      case PreprocessorTokens.Iterate.tokenTypeIdx:
        unit = this.iterateStatement(state);
        break;
      default:
        if (state.isOnlyInStatement()) {
          if (state.current?.tokenType === PreprocessorTokens.Procedure) {
            unit = this.procedureStatement(state);
          }
        } else {
          //state.isInProcedure()
          const returnStatement = ast.createReturnStatement();
          if (
            state.tryConsume(
              returnStatement,
              CstNodeKind.ReturnStatement_RETURN,
              PreprocessorTokens.Return,
            )
          ) {
            state.consume(
              returnStatement,
              CstNodeKind.ReturnStatement_OpenParen,
              PreprocessorTokens.LParen,
            );
            returnStatement.expression = this.expression(state);
            unit = returnStatement;
            state.consume(
              returnStatement,
              CstNodeKind.ReturnStatement_CloseParen,
              PreprocessorTokens.RParen,
            );
            state.consume(
              returnStatement,
              CstNodeKind.ReturnStatement_Semicolon,
              PreprocessorTokens.Semicolon,
            );
          }
        }
    }
    if (unit === undefined) {
      throw new PreprocessorError(
        "Unexpected token '" + state.current?.image + "'.",
        state.current || state.last!,
        state.uri,
      );
    }
    // TODO: We can move this into validation!
    // if (labels.length === 0 && unit?.kind === ast.SyntaxKind.ProcedureStatement) {
    //   throw new PreprocessorError(
    //     "Procedure must have a label.",
    //     state.current!,
    //     state.uri.toString(),
    //   );
    // }
    statement.value = unit;
    return statement;
  }

  procedureStatement(state: PreprocessorParserState): ast.ProcedureStatement {
    const statement = ast.createProcedureStatement();
    state.push("in-procedure");
    state.consume(
      statement,
      CstNodeKind.ProcedureStatement_PROCEDURE,
      PreprocessorTokens.Procedure,
    );
    if (
      state.tryConsume(
        statement,
        CstNodeKind.ProcedureStatement_OpenParenParams,
        PreprocessorTokens.LParen,
      )
    ) {
      do {
        const parameter = ast.createProcedureParameter();
        const nameToken = state.consume(
          parameter,
          CstNodeKind.ProcedureParameter_Id,
          PreprocessorTokens.Id,
        );
        parameter.name = nameToken.image;
        parameter.nameToken = nameToken;
        statement.parameters.push(parameter);
      } while (
        state.tryConsume(
          statement,
          CstNodeKind.ProcedureStatement_Comma,
          PreprocessorTokens.Comma,
        )
      );
      state.consume(
        statement,
        CstNodeKind.ProcedureStatement_CloseParenParams,
        PreprocessorTokens.RParen,
      );
    }
    statement.statement = state.tryConsume(
      statement,
      CstNodeKind.ProcedureStatement_STATEMENT,
      PreprocessorTokens.Statement,
    );
    const returnsOption = ast.createReturnsOption();
    if (
      state.tryConsume(
        returnsOption,
        CstNodeKind.ReturnsOption_RETURNS,
        PreprocessorTokens.Returns,
      )
    ) {
      state.consume(
        returnsOption,
        CstNodeKind.ReturnsOption_OpenParen,
        PreprocessorTokens.LParen,
      );
      let returnType: string | undefined = undefined;
      const dataAttribute = ast.createComputationDataAttribute();
      if (
        state.tryConsume(
          dataAttribute,
          CstNodeKind.DefaultAttribute_Value,
          PreprocessorTokens.Character,
        )
      ) {
        returnType = "character";
      } else if (
        state.tryConsume(
          dataAttribute,
          CstNodeKind.DefaultAttribute_Value,
          PreprocessorTokens.Fixed,
        )
      ) {
        returnType = "fixed";
      }
      if (returnType) {
        dataAttribute.type = returnType as ast.DefaultAttribute;
        returnsOption.returnAttributes.push(dataAttribute);
      }
      state.consume(
        returnsOption,
        CstNodeKind.ReturnsOption_CloseParen,
        PreprocessorTokens.RParen,
      );
      statement.options.push(returnsOption);
    }
    state.consume(
      statement,
      CstNodeKind.ProcedureStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    );
    const body = this.statements(state);
    statement.statements = body;
    state.consume(
      statement,
      CstNodeKind.ProcedureStatement_PROCEDURE_END,
      PreprocessorTokens.End,
    );
    state.consume(
      statement,
      CstNodeKind.ProcedureStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    state.pop();
    return statement;
  }

  iterateStatement(state: PreprocessorParserState): ast.IterateStatement {
    const statement = ast.createIterateStatement();
    state.consume(
      statement,
      CstNodeKind.IterateStatement_ITERATE,
      PreprocessorTokens.Iterate,
    );
    if (state.canConsume(PreprocessorTokens.Id)) {
      statement.label = this.labelReference(state);
    }
    state.consume(
      statement,
      CstNodeKind.IterateStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }

  leaveStatement(state: PreprocessorParserState): ast.LeaveStatement {
    const statement = ast.createLeaveStatement();
    state.consume(
      statement,
      CstNodeKind.LeaveStatement_LEAVE,
      PreprocessorTokens.Leave,
    );
    if (state.canConsume(PreprocessorTokens.Id)) {
      statement.label = this.labelReference(state);
    }
    state.consume(
      statement,
      CstNodeKind.LeaveStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }

  goToStatement(state: PreprocessorParserState): ast.GoToStatement {
    const statement = ast.createGoToStatement();
    // First, attempt to consume the GOTO keyword
    if (
      !state.tryConsume(
        statement,
        CstNodeKind.GoToStatement_GOTO,
        PreprocessorTokens.Goto,
      )
    ) {
      // Otherwise, consume the GO and TO keywords
      state.consume(
        statement,
        CstNodeKind.GoToStatement_GO,
        PreprocessorTokens.Go,
      );
      state.consume(
        statement,
        CstNodeKind.GoToStatement_TO,
        PreprocessorTokens.To,
      );
    }
    statement.label = this.labelReference(state);
    state.consume(
      statement,
      CstNodeKind.GoToStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }

  private labelReference(state: PreprocessorParserState): ast.LabelReference {
    const reference = ast.createLabelReference();
    const label = state.consume(
      reference,
      CstNodeKind.LabelReference_LabelRef,
      PreprocessorTokens.Id,
    );
    reference.label = ast.createReference(reference, label, true);
    return reference;
  }

  includeStatement(state: PreprocessorParserState): ast.IncludeDirective {
    const directive = ast.createIncludeDirective();
    state.consume(
      directive,
      CstNodeKind.IncludeDirective_INCLUDE,
      PreprocessorTokens.Include,
    );
    while (true) {
      const item = ast.createIncludeItem();
      if (state.canConsume(PreprocessorTokens.Id)) {
        // member include
        const token = state.consume(
          item,
          CstNodeKind.IncludeItem_FileID0,
          PreprocessorTokens.Id,
        );
        const fileName = token.image;
        item.file = fileName;
        item.token = token;
      } else if (state.canConsume(PreprocessorTokens.String)) {
        // literal file include (relative, absolute, or lib sourced)
        const token = state.consume(
          item,
          CstNodeKind.IncludeItem_FileString0,
          PreprocessorTokens.String,
        );
        const file = token.image;
        const fileName = file.substring(1, file.length - 1);
        item.file = fileName;
        item.string = true;
        item.token = token;
      } else {
        break;
      }
      directive.items.push(item);
      // Optional comma
      state.tryConsume(
        directive,
        CstNodeKind.IncludeDirective_Comma,
        PreprocessorTokens.Comma,
      );
    }
    state.consume(
      directive,
      CstNodeKind.IncludeDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    // TODO: cache included files
    for (const item of directive.items) {
      if (!item.file) {
        continue;
      }

      // TODO @montymxb Jun 3rd, 2025: Use SYSLIB from compiler opts to add to the lookup path for includes

      // Resolve the URI of the include file
      let uri = resolveIncludeFileUri(item, state);

      /**
       * Helper function to throw a preprocessor error when an include file cannot be resolved.
       */
      const failToResolveInclude = () => {
        throw new PreprocessorError(
          `Cannot resolve include file '${item.file}' at '${state.uri.toString()}'.`,
          item.token! || state.current || state.last!,
          state.uri,
        );
      };

      if (!uri) {
        // fail to resolve & skip to nxt
        failToResolveInclude();
        continue;
      }

      // attempt to resolve this file
      try {
        const content =
          TextDocuments.get(uri)?.getText() ??
          FileSystemProviderInstance.readFileSync(uri) ??
          "";
        const subState = this.initializeState(content, uri);
        const subProgram = this.start(subState);
        // Ensure that we store the tokens of included files in our state
        // That way we can use them later for LSP services!
        for (const [uri, tokens] of Object.entries(subState.perFileTokens)) {
          state.perFileTokens[uri] = tokens;
        }
        item.result = subProgram;
      } catch {
        failToResolveInclude();
      }
    }

    return directive;
  }

  doStatement(state: PreprocessorParserState): ast.DoStatement {
    const statement = ast.createDoStatement();
    state.consume(statement, CstNodeKind.DoStatement_DO, PreprocessorTokens.Do);
    if (state.canConsumeKeyword(PreprocessorTokens.While)) {
      //type-2-do-while-first
      const type2 = this.doWhile(state);
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon0,
        PreprocessorTokens.Semicolon,
      );
      const body = this.statements(state);
      statement.doType2 = type2;
      statement.statements = body;
      state.consumeKeyword(
        statement,
        CstNodeKind.EndStatement_END,
        PreprocessorTokens.End,
      );
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon1,
        PreprocessorTokens.Semicolon,
      );
      return statement;
    } else if (state.canConsumeKeyword(PreprocessorTokens.Until)) {
      //type-2-do-until-first
      const type2 = this.doUntil(state);
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon0,
        PreprocessorTokens.Semicolon,
      );
      const body = this.statements(state);
      statement.doType2 = type2;
      statement.statements = body;
      state.consumeKeyword(
        statement,
        CstNodeKind.EndStatement_END,
        PreprocessorTokens.End,
      );
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon1,
        PreprocessorTokens.Semicolon,
      );
      return statement;
    } else if (
      state.tryConsumeKeyword(
        statement,
        CstNodeKind.DoStatement_LOOP,
        PreprocessorTokens.Loop,
      )
    ) {
      //type-4 loops
      statement.doType4 = true;
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon0,
        PreprocessorTokens.Semicolon,
      );
      const body = this.statements(state);
      statement.statements = body;
      state.consumeKeyword(
        statement,
        CstNodeKind.EndStatement_END,
        PreprocessorTokens.End,
      );
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon1,
        PreprocessorTokens.Semicolon,
      );
      return statement;
    } else if (
      state.tryConsume(
        statement,
        CstNodeKind.DoStatement_Semicolon0,
        PreprocessorTokens.Semicolon,
      )
    ) {
      //type-1-do
      const statements = this.statements(state);
      statement.statements = statements;
      state.consumeKeyword(
        statement,
        CstNodeKind.EndStatement_END,
        PreprocessorTokens.End,
      );
      state.consume(
        statement,
        CstNodeKind.DoStatement_Semicolon1,
        PreprocessorTokens.Semicolon,
      );
      return statement;
    }
    //TODO type-3-do
    throw new PreprocessorError(
      "Unexpected token '" + state.current?.image + "'.",
      state.current || state.last!,
      state.uri,
    );
  }

  private doWhile(state: PreprocessorParserState): ast.DoWhile {
    const statement = ast.createDoWhile();
    state.consumeKeyword(
      statement,
      CstNodeKind.DoWhile_WHILE,
      PreprocessorTokens.While,
    );
    state.consume(
      statement,
      CstNodeKind.DoWhile_OpenParenWhile,
      PreprocessorTokens.LParen,
    );
    statement.while = this.expression(state);
    state.consume(
      statement,
      CstNodeKind.DoWhile_CloseParenWhile,
      PreprocessorTokens.RParen,
    );
    if (
      state.tryConsumeKeyword(
        statement,
        CstNodeKind.DoWhile_UNTIL,
        PreprocessorTokens.Until,
      )
    ) {
      state.consume(
        statement,
        CstNodeKind.DoWhile_OpenParenUntil,
        PreprocessorTokens.LParen,
      );
      statement.until = this.expression(state);
      state.consume(
        statement,
        CstNodeKind.DoWhile_CloseParenUntil,
        PreprocessorTokens.RParen,
      );
    }
    return statement;
  }

  private doUntil(state: PreprocessorParserState): ast.DoUntil {
    const statement = ast.createDoUntil();
    state.consumeKeyword(
      statement,
      CstNodeKind.DoUntil_UNTIL,
      PreprocessorTokens.Until,
    );
    state.consume(
      statement,
      CstNodeKind.DoUntil_OpenParenUntil,
      PreprocessorTokens.LParen,
    );
    statement.until = this.expression(state);
    state.consume(
      statement,
      CstNodeKind.DoUntil_CloseParenUntil,
      PreprocessorTokens.RParen,
    );
    if (
      state.tryConsumeKeyword(
        statement,
        CstNodeKind.DoUntil_WHILE,
        PreprocessorTokens.While,
      )
    ) {
      state.consume(
        statement,
        CstNodeKind.DoUntil_OpenParenWhile,
        PreprocessorTokens.LParen,
      );
      statement.while = this.expression(state);
      state.consume(
        statement,
        CstNodeKind.DoWhile_CloseParenWhile,
        PreprocessorTokens.RParen,
      );
    }
    return statement;
  }

  private statements(state: PreprocessorParserState): ast.Statement[] {
    const statements: ast.Statement[] = [];
    while (!state.eof && !state.canConsumeKeyword(PreprocessorTokens.End)) {
      const statement = this.statement(state);
      statements.push(statement);
    }
    return statements;
  }

  ifStatement(state: PreprocessorParserState): ast.IfStatement {
    const statement = ast.createIfStatement();
    state.consume(statement, CstNodeKind.IfStatement_IF, PreprocessorTokens.If);
    statement.expression = this.expression(state);
    state.consumeKeyword(
      statement,
      CstNodeKind.IfStatement_THEN,
      PreprocessorTokens.Then,
    );
    statement.unitRange = {
      start: state.current!.startOffset,
      end: NaN,
    };
    statement.unit = this.statement(state);
    statement.unitRange.end = state.last!.endOffset! + 1;
    if (state.canConsumeKeyword(PreprocessorTokens.Else)) {
      state.consumeKeyword(
        statement,
        CstNodeKind.IfStatement_ELSE,
        PreprocessorTokens.Else,
      );
      statement.elseRange = {
        start: state.current!.startOffset,
        end: NaN,
      };
      statement.else = this.statement(state);
      statement.elseRange.end = state.last!.endOffset! + 1;
    }
    return statement;
  }

  deactivateStatement(state: PreprocessorParserState): ast.DeactivateStatement {
    const statement = ast.createDeactivateStatement();
    state.consume(
      statement,
      CstNodeKind.DeactivateStatement_DEACTIVATE,
      PreprocessorTokens.Deactivate,
    );
    statement.references.push(this.parseReferenceItem(state, false));
    while (
      state.tryConsume(
        statement,
        CstNodeKind.DeactivateStatement_Comma,
        PreprocessorTokens.Comma,
      )
    ) {
      statement.references.push(this.parseReferenceItem(state, false));
    }
    state.consume(
      statement,
      CstNodeKind.DeactivateStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }

  activateStatement(state: PreprocessorParserState): ast.ActivateStatement {
    const statement = ast.createActivateStatement();
    state.consume(
      statement,
      CstNodeKind.ActivateStatement_ACTIVATE,
      PreprocessorTokens.Activate,
    );
    statement.items.push(this.parseActivateItem(state));
    while (
      state.tryConsume(
        statement,
        CstNodeKind.ActivateStatement_Comma,
        PreprocessorTokens.Comma,
      )
    ) {
      statement.items.push(this.parseActivateItem(state));
    }
    state.consume(
      statement,
      CstNodeKind.ActivateStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }

  private parseActivateItem(state: PreprocessorParserState): ast.ActivateItem {
    const item = ast.createActivateItem();
    item.reference = this.parseReferenceItem(state, false);
    item.scanMode = this.tryScanMode(state);
    return item;
  }

  private parseReferenceItem(
    state: PreprocessorParserState,
    withDimensions: boolean,
  ): ast.ReferenceItem {
    const reference = ast.createReferenceItem();
    const variable = state.consume(
      reference,
      CstNodeKind.ReferenceItem_Ref,
      PreprocessorTokens.Id,
    );
    reference.ref = ast.createReference(reference, variable, true);
    variable.payload.kind = CstNodeKind.ReferenceItem_Ref;
    variable.payload.element = reference;
    if (withDimensions && state.canConsume(PreprocessorTokens.LParen)) {
      reference.dimensions = this.dimensions(state);
    }
    return reference;
  }

  tryScanMode(state: PreprocessorParserState): ast.ScanMode | null {
    let scanMode: ast.ScanMode | null = null;
    switch (state.current!.tokenType) {
      case PreprocessorTokens.Scan:
        scanMode = "SCAN";
        state.index++;
        break;
      case PreprocessorTokens.Rescan:
        scanMode = "RESCAN";
        state.index++;
        break;
      case PreprocessorTokens.Noscan:
        scanMode = "NOSCAN";
        state.index++;
        break;
    }
    return scanMode;
  }

  skipStatement(state: PreprocessorParserState): ast.SkipDirective {
    const statement = ast.createSkipDirective();
    state.consume(
      statement,
      CstNodeKind.SkipDirective_SKIP,
      PreprocessorTokens.Skip,
    );
    let lineCount: number = 1;
    if (
      state.tryConsume(
        statement,
        CstNodeKind.SkipDirective_OpenParen,
        PreprocessorTokens.LParen,
      )
    ) {
      state.consume(
        statement,
        CstNodeKind.NumberLiteral_ValueNumber,
        PreprocessorTokens.Number,
      );
      lineCount = parseInt(state.last!.image, 10);
      statement.lineCount = lineCount;
      state.consume(
        statement,
        CstNodeKind.SkipDirective_CloseParen,
        PreprocessorTokens.RParen,
      );
    }
    state.consume(
      statement,
      CstNodeKind.SkipDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    state.advanceLines(lineCount + 1);
    return statement;
  }

  popDirective(state: PreprocessorParserState): ast.PopDirective {
    const directive = ast.createPopDirective();
    state.consume(
      directive,
      CstNodeKind.PopDirective_POP,
      PreprocessorTokens.Pop,
    );
    state.consume(
      directive,
      CstNodeKind.PopDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return directive;
  }

  pushDirective(state: PreprocessorParserState): ast.PushDirective {
    const directive = ast.createPushDirective();
    state.consume(
      directive,
      CstNodeKind.PushDirective_PUSH,
      PreprocessorTokens.Push,
    );
    state.consume(
      directive,
      CstNodeKind.PushDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return directive;
  }

  pageDirective(state: PreprocessorParserState): ast.PageDirective {
    const directive = ast.createPageDirective();
    state.consume(
      directive,
      CstNodeKind.PageDirective_PAGE,
      PreprocessorTokens.Page,
    );
    state.consume(
      directive,
      CstNodeKind.PageDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return directive;
  }

  printDirective(state: PreprocessorParserState): ast.PrintDirective {
    const directive = ast.createPrintDirective();
    state.consume(
      directive,
      CstNodeKind.PrintDirective_PRINT,
      PreprocessorTokens.Print,
    );
    state.consume(
      directive,
      CstNodeKind.PrintDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return directive;
  }

  noprintDirective(state: PreprocessorParserState): ast.NoPrintDirective {
    const directive = ast.createNoPrintDirective();
    state.consume(
      directive,
      CstNodeKind.NoPrintDirective_NOPRINT,
      PreprocessorTokens.NoPrint,
    );
    state.consume(
      directive,
      CstNodeKind.NoPrintDirective_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return directive;
  }

  assignmentStatement(state: PreprocessorParserState): ast.AssignmentStatement {
    const assignment = ast.createAssignmentStatement();
    assignment.refs.push(this.locatorCall(state, false));
    // TODO: add support for more assignment operators (+=, -=, etc)
    state.consume(
      assignment,
      CstNodeKind.AssignmentStatement_Operator,
      PreprocessorTokens.Eq,
    );
    assignment.operator = "=";
    const right = this.expression(state);
    assignment.expression = right;
    state.consume(
      assignment,
      CstNodeKind.AssignmentStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return assignment;
  }

  private locatorCall(
    state: PreprocessorParserState,
    withDimensions: boolean,
  ): ast.LocatorCall {
    const locatorCall = ast.createLocatorCall();
    locatorCall.element = this.memberCall(state, withDimensions);
    return locatorCall;
  }

  private memberCall(
    state: PreprocessorParserState,
    withDimensions: boolean,
  ): ast.MemberCall {
    const memberCall = ast.createMemberCall();
    memberCall.element = this.parseReferenceItem(state, withDimensions);
    return memberCall;
  }

  declareStatement(state: PreprocessorParserState): ast.DeclareStatement {
    const statement = ast.createDeclareStatement();
    // Only one declared item is allowed in a preprocessor declare statement
    const declaredItem = ast.createDeclaredItem();
    statement.items.push(declaredItem);
    state.consume(
      statement,
      CstNodeKind.DeclareStatement_DECLARE,
      PreprocessorTokens.Declare,
    );
    do {
      if (
        state.tryConsume(
          declaredItem,
          CstNodeKind.DeclaredItem_OpenParen,
          PreprocessorTokens.LParen,
        )
      ) {
        do {
          declaredItem.elements.push(this.declaredVariable(state));
          // TODO: Figure out whether dimensions are allowed in multi variable declarations
          // if (state.tryConsume(PreprocessorTokens.LParen)) {
          //   const dimensions = this.dimensions(state);
          //   state.consume(PreprocessorTokens.RParen);
          //   names.push({
          //     name: variable,
          //     dimensions,
          //   });
          // } else {
          //   names.push({
          //     name: variable,
          //   });
          // }
        } while (
          state.tryConsume(
            declaredItem,
            CstNodeKind.DeclaredItem_Comma,
            PreprocessorTokens.Comma,
          )
        );
        state.consume(
          declaredItem,
          CstNodeKind.DeclaredItem_CloseParen,
          PreprocessorTokens.RParen,
        );
      } else {
        declaredItem.elements.push(this.declaredVariable(state));
      }
      const attributes = this.attributes(state);
      for (const attribute of attributes) {
        const dataAttribute = ast.createComputationDataAttribute();
        dataAttribute.type = attribute as ast.DefaultAttribute;
        declaredItem.attributes.push(dataAttribute);
      }
    } while (
      state.tryConsume(
        statement,
        CstNodeKind.DeclareStatement_Comma,
        PreprocessorTokens.Comma,
      )
    );
    state.consume(
      statement,
      CstNodeKind.DeclareStatement_Semicolon,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }

  private declaredVariable(
    state: PreprocessorParserState,
  ): ast.DeclaredVariable {
    const declaredVariable = ast.createDeclaredVariable();
    const variable = state.consume(
      declaredVariable,
      CstNodeKind.DeclaredVariable_Name,
      PreprocessorTokens.Id,
    );
    const name = variable.image;
    declaredVariable.name = name;
    declaredVariable.nameToken = variable;
    return declaredVariable;
  }

  dimensions(state: PreprocessorParserState): ast.Dimensions {
    const dimensions = ast.createDimensions();
    state.consume(
      dimensions,
      CstNodeKind.Dimensions_OpenParen,
      PreprocessorTokens.LParen,
    );
    dimensions.dimensions.push(this.parseBound(state));
    while (
      state.tryConsume(
        dimensions,
        CstNodeKind.Dimensions_Comma,
        PreprocessorTokens.Comma,
      )
    ) {
      dimensions.dimensions.push(this.parseBound(state));
    }
    state.consume(
      dimensions,
      CstNodeKind.Dimensions_CloseParen,
      PreprocessorTokens.RParen,
    );
    return dimensions;
  }

  private parseBound(state: PreprocessorParserState): ast.DimensionBound {
    const bound = ast.createDimensionBound();
    const leftBound = ast.createBound();
    const left = this.parseExpressionWildcard(
      leftBound,
      CstNodeKind.Bound_Star,
      state,
    );
    leftBound.expression = left;
    if (
      state.tryConsume(
        bound,
        CstNodeKind.DimensionBound_Colon,
        PreprocessorTokens.Colon,
      )
    ) {
      const rightBound = ast.createBound();
      const right = this.parseExpressionWildcard(
        rightBound,
        CstNodeKind.Bound_Star,
        state,
      );
      rightBound.expression = right;
      bound.lower = leftBound;
      bound.upper = rightBound;
    } else {
      bound.upper = leftBound;
    }
    return bound;
  }

  private parseExpressionWildcard(
    element: ast.SyntaxNode,
    kind: CstNodeKind,
    state: PreprocessorParserState,
  ): ast.Wildcard<ast.Expression> {
    if (state.tryConsume(element, kind, PreprocessorTokens.Multiply)) {
      return "*";
    } else {
      return this.expression(state);
    }
  }

  attributes(state: PreprocessorParserState) {
    const attributes: string[] = [];
    let lastIndex = 0;
    do {
      lastIndex = state.index;
      switch (state.current?.tokenType) {
        case PreprocessorTokens.Builtin:
          attributes.push("BUILTIN");
          state.index++;
          break;
        case PreprocessorTokens.Entry:
          attributes.push("ENTRY");
          state.index++;
          break;
        case PreprocessorTokens.Internal:
          attributes.push("INTERNAL");
          state.index++;
          break;
        case PreprocessorTokens.External:
          attributes.push("EXTERNAL");
          state.index++;
          break;
        case PreprocessorTokens.Character:
          attributes.push("CHARACTER");
          state.index++;
          break;
        case PreprocessorTokens.Fixed:
          attributes.push("FIXED");
          state.index++;
          break;
        case PreprocessorTokens.Scan:
          attributes.push("SCAN");
          state.index++;
          break;
        case PreprocessorTokens.Rescan:
          attributes.push("RESCAN");
          state.index++;
          break;
        case PreprocessorTokens.Noscan:
          attributes.push("NOSCAN");
          state.index++;
          break;
      }
    } while (lastIndex != state.index);
    return attributes;
  }

  expression(state: PreprocessorParserState): ast.Expression {
    return this.parseBinary(state);
  }

  private parseBinary(state: PreprocessorParserState): ast.Expression {
    const infixOperatorItem: IntermediateBinaryExpression = {
      infix: true,
      items: [],
      operators: [],
    };
    infixOperatorItem.items.push(this.primary(state));
    while (true) {
      let operator: string | undefined = undefined;
      for (const tokenType of PreprocessorBinaryTokens) {
        if (
          state.tryConsume(
            infixOperatorItem as any,
            CstNodeKind.BinaryExpression_Operator,
            tokenType,
          )
        ) {
          operator = tokenType.name;
          break;
        }
      }
      if (operator) {
        const item = this.primary(state);
        infixOperatorItem.items.push(item);
        infixOperatorItem.operators.push(operator);
      } else {
        break;
      }
    }
    return constructBinaryExpression(infixOperatorItem);
  }

  primary(state: PreprocessorParserState): ast.Expression {
    if (state.canConsume(PreprocessorTokens.Number)) {
      return this.numberLiteral(state);
    } else if (state.canConsume(PreprocessorTokens.String)) {
      return this.stringLiteral(state);
    } else if (state.canConsume(PreprocessorTokens.Id)) {
      return this.locatorCall(state, true);
    } else if (state.canConsume(PreprocessorTokens.LParen)) {
      state.consume(
        undefined,
        CstNodeKind.ParenthesizedExpression_OpenParen,
        PreprocessorTokens.LParen,
      );
      const expression = this.expression(state);
      state.consume(
        undefined,
        CstNodeKind.ParenthesizedExpression_CloseParen,
        PreprocessorTokens.RParen,
      );
      return expression;
    }
    throw new PreprocessorError(
      "Cannot handle this type of preprocessor expression yet!",
      state.current || state.last!,
      state.uri,
    );
  }

  private numberLiteral(state: PreprocessorParserState): ast.Literal {
    const literal = ast.createLiteral();
    const numberLiteral = ast.createNumberLiteral();
    literal.value = numberLiteral;
    const number = state.consume(
      numberLiteral,
      CstNodeKind.NumberLiteral_ValueNumber,
      PreprocessorTokens.Number,
    );
    numberLiteral.value = number.image;
    return literal;
  }

  private stringLiteral(state: PreprocessorParserState): ast.Literal {
    const literal = ast.createLiteral();
    const stringLiteral = ast.createStringLiteral();
    literal.value = stringLiteral;
    const stringToken = state.consume(
      stringLiteral,
      CstNodeKind.StringLiteral_ValueString,
      PreprocessorTokens.String,
    );
    const content = this.unpackCharacterValue(stringToken.image);
    stringLiteral.value = content;
    stringLiteral.tokens = this.tokenizePurePliCode(content);
    return literal;
  }

  private tokenizePurePliCode(content: string) {
    const result: IToken[] = [];
    const lexerState = new PliPreprocessorLexerState(
      content,
      undefined, // URI is unknown, use undefined
    );
    while (!lexerState.eof()) {
      const tokens = this.lexer.tokenizePliTokensUntilSemicolon(lexerState);
      result.push(...tokens);
    }
    return result;
  }

  private unpackCharacterValue(literal: string): string {
    return literal.substring(1, literal.length - 1);
  }
}

/**
 * Attempts to resolve the URI of an include file factoring in process group libs, relative & absolute paths
 *
 * @param item Include item to resolve a URI for
 * @param state Current PP state, used to resolve relative paths, program configs, and report errors
 * @returns URI of the included file if found, otherwise undefined
 */
function resolveIncludeFileUri(
  item: ast.IncludeItem,
  state: PreprocessorParserState,
): URI | undefined {
  const absPathRegex = /^\/|[A-Z]:|~/i;
  const relativePathRegex = /^\.\.\/|^\.\//;

  const currentDir = UriUtils.dirname(state.uri);

  if (!item.file) {
    throw new Error("Include item does not have a file specified.");
  }

  // check to validate copybook extension, if a program config & process group is available
  const programConfig = PluginConfigurationProviderInstance.getProgramConfig(
    state.uri.toString(),
  );
  const pgroup = programConfig
    ? PluginConfigurationProviderInstance.getProcessGroupConfig(
        programConfig.pgroup,
      )
    : undefined;
  const ext = UriUtils.extname(URI.parse(item.file));
  if (
    ext !== "" &&
    programConfig &&
    pgroup &&
    (!pgroup["copybook-extensions"]?.includes(ext) ||
      !pgroup["copybook-extensions"])
  ) {
    const msg = pgroup["copybook-extensions"]?.length
      ? `expected one of: ${pgroup["copybook-extensions"]?.join(", ")}`
      : `expected no extension`;
    throw new PreprocessorError(
      `Unsupported copybook extension for included file, '${item.file}', ${msg}`,
      item.token! || state.current || state.last!,
      state.uri,
    );
  }

  if (absPathRegex.test(item.file)) {
    // absolute path, use as is
    return URI.parse(item.file);
  } else if (relativePathRegex.test(item.file)) {
    // relative path, combine with currentDir
    return UriUtils.joinPath(currentDir, item.file);
  } else if (programConfig && pgroup) {
    // lib file as either a string or a member from a known process group
    for (const lib of pgroup.libs ?? []) {
      if (lib === "*") {
        // wildcard lib, use currentDir
        return UriUtils.joinPath(currentDir, item.file);
      } else {
        const libFileUri = UriUtils.joinPath(
          URI.parse(PluginConfigurationProviderInstance.getWorkspacePath()),
          lib,
          item.file,
        );
        if (FileSystemProviderInstance.fileExistsSync(libFileUri)) {
          // match found in this lib, take it
          return libFileUri;
        }
      }
    }
    // no match
    return undefined;
  } else {
    // no recognized process group or program config, nothing to lookup
    return undefined;
  }
}
