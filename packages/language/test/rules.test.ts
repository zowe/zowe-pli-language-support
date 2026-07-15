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

import { TokenType } from "chevrotain";
import { describe, expect, test } from "vitest";
import { orRule, rule, sequence } from "../src/parser/parser-types";
import { SyntaxNode } from "../src/syntax-tree/ast";
import { ParserState, RecoveryResult } from "../src/parser/parser-state";
import {
  createTokenInstance as originalCreateTokenInstance,
  Token,
} from "../src/parser/tokens";
import { createToken } from "../src/parser/token-type-factory";

namespace Tokens {
  export const ID = createToken({
    name: "ID",
    pattern: /[$@#_a-z][\w_$@#]*/iy,
  });
  export const HELLO = createToken({
    name: "HELLO",
    pattern: /hello/i,
    categories: [ID],
  });
  export const PERSON = createToken({
    name: "PERSON",
    pattern: /person/i,
    categories: [ID],
  });
  export const EXCLAMATION = createToken({ name: "EXCLAMATION", pattern: /!/ });
}

namespace TokenInstances {
  function createTokenInstance(image: string, tokenType: TokenType): Token {
    return originalCreateTokenInstance(
      image,
      image,
      tokenType,
      1,
      0,
      undefined,
    );
  }

  export const Hello = createTokenInstance("hello", Tokens.HELLO);
  export const Person = createTokenInstance("person", Tokens.PERSON);
  export const IdAlice = createTokenInstance("Alice", Tokens.ID);
  export const IdBob = createTokenInstance("Bob", Tokens.ID);
  export const IdPerson = createTokenInstance("Person", Tokens.PERSON);
  export const Exclamation = createTokenInstance("!", Tokens.EXCLAMATION);
}

namespace AST {
  export interface Node {
    container: Node | null;
    kind: number;
  }
  export interface PersonNode extends Node {
    kind: 1;
    name: string | null;
  }
  export interface HelloNode extends Node {
    kind: 2;
    name: string | null;
  }
  export type StatementNode = PersonNode | HelloNode;

  export function createPersonNode(): PersonNode {
    return {
      kind: 1,
      container: null,
      name: null,
    };
  }

  export function createHelloNode(): HelloNode {
    return {
      kind: 2,
      container: null,
      name: null,
    };
  }
}

namespace Rules {
  export const hello = rule(sequence(Tokens.HELLO), (state) => {
    const element = AST.createHelloNode() as unknown as SyntaxNode;
    state.consume(element, 1, Tokens.HELLO);
    const name = state.consume(element, 2, Tokens.ID)!.image;
    state.consume(element, 3, Tokens.EXCLAMATION);
    return { ...element, name } as unknown as AST.HelloNode;
  });
  export const person = rule(sequence(Tokens.PERSON), (state) => {
    const element = AST.createPersonNode() as unknown as SyntaxNode;
    state.consume(element, 4, Tokens.PERSON);
    const name = state.consume(element, 5, Tokens.ID)!.image;
    return { ...element, name } as unknown as AST.PersonNode;
  });
  export const statement = orRule<AST.StatementNode, []>(
    () => hello,
    () => person,
  );
  export const program = rule(
    () => statement.first(),
    (state) => {
      const program: AST.StatementNode[] = [];
      while (!state.eof) {
        const stmt = statement.rule(state);
        stmt && program.push(stmt);
        state.recover(() => {
          return state.canConsumeFirst(statement.first())
            ? RecoveryResult.Recover
            : RecoveryResult.Continue;
        });
      }
      return program;
    },
  );
}

describe("Rule tests", () => {
  test("Simple rule set", () => {
    const state = new ParserState([
      TokenInstances.Person,
      TokenInstances.IdBob,
      TokenInstances.Hello,
      TokenInstances.IdAlice,
      TokenInstances.Exclamation,
    ]);

    const result = Rules.program.rule(state)!;

    expect(result.length).toBe(2);
    expect(result[0].kind).toBe(1);
    expect((result[0] as AST.PersonNode).name).toBe("Bob");
    expect(result[1].kind).toBe(2);
    expect((result[1] as AST.HelloNode).name).toBe("Alice");
  });

  test("Keyword IDs", () => {
    const state = new ParserState([
      TokenInstances.Person,
      TokenInstances.IdPerson,
    ]);

    const result = Rules.program.rule(state)!;

    expect(result.length).toBe(1);
    expect(result[0].kind).toBe(1);
    expect((result[0] as AST.PersonNode).name).toBe("Person");
  });

  test("Error", () => {
    const state = new ParserState([TokenInstances.IdBob]);

    Rules.program.rule(state)!;

    expect(state.diagnostics.length).toBe(1);
    expect(state.diagnostics[0].message).toBe(
      `Expected any of {HELLO, PERSON}, but found "Bob".`,
    );
  });
});
