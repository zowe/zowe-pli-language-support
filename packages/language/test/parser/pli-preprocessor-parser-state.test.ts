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

import { describe, expect, test } from "vitest";
import { PreprocessorTokens } from "../../src/preprocessor/pli-preprocessor-tokens";
import { PliPreprocessorParserState } from "../../src/preprocessor/pli-preprocessor-parser-state";
import { URI } from "../../src/utils/uri";
import { PliLexer } from "../../src/preprocessor/pli-lexer";

namespace Fixtures {
  const lexer = new PliLexer();
  const uri = URI.file("file:///test.pli");
  export const Empty = () =>
    new PliPreprocessorParserState(lexer.preprocessorLexer, "", uri);
  export const OneToken = () =>
    new PliPreprocessorParserState(lexer.preprocessorLexer, "ABC", uri);
  export const TwoTokens = () =>
    new PliPreprocessorParserState(lexer.preprocessorLexer, "ABC 123", uri);
}

describe("Preprocessor parser state", () => {
  describe("EOF", () => {
    test("Check eof for empty", () => {
      //arrange + act
      const state = Fixtures.Empty();

      //assert
      expect(state.eof).toBe(true);
      expect(state.current).toBeUndefined();
      expect(state.last).toBeUndefined();
    });

    test("Check eof for non-empty", () => {
      //arrange + act
      const state = Fixtures.OneToken();

      //assert
      expect(state.eof).toBe(false);
      expect(state.current).not.toBeUndefined();
      expect(state.last).toBeUndefined();
    });
  });

  describe("canConsume", () => {
    test("canConsume for empty", () => {
      //arrange
      const state = Fixtures.Empty();

      //act
      expect(state.canConsume(PreprocessorTokens.Id)).toBeFalsy();

      //assert
      expect(state.eof).toBe(true);
      expect(state.current).toBeUndefined();
      expect(state.last).toBeUndefined();
    });

    test("canConsume positive for non-empty", () => {
      //arrange
      const state = Fixtures.OneToken();

      //act
      expect(state.canConsume(PreprocessorTokens.Id)).toBeTruthy();

      //assert
      expect(state.eof).toBe(false);
      expect(state.current).not.toBeUndefined();
      expect(state.current!.image).toBe("ABC");
      expect(state.last).toBeUndefined();
    });

    test("canConsume negative for non-empty", () => {
      //arrange
      const state = Fixtures.OneToken();

      //act
      expect(state.canConsume(PreprocessorTokens.Builtin)).toBeFalsy();

      //assert
      expect(state.eof).toBe(false);
      expect(state.current).not.toBeUndefined();
      expect(state.current!.image).toBe("ABC");
      expect(state.last).toBeUndefined();
    });
  });

  describe("consume", () => {
    test("Consume for empty", () => {
      //arrange
      const state = Fixtures.Empty();

      //act + assert
      expect(() =>
        state.consume(undefined, undefined, PreprocessorTokens.Id),
      ).toThrowError();
    });

    test("Consume positive for non-empty", () => {
      //arrange
      const state = Fixtures.OneToken();

      //act
      expect(
        state.consume(undefined, undefined, PreprocessorTokens.Id).image,
      ).toBe("ABC");

      //assert
      expect(state.eof).toBe(true);
      expect(state.current).toBeUndefined();
      expect(state.last).not.toBeUndefined();
      expect(state.last!.image).toBe("ABC");
    });

    test("Check Consume negative for non-empty", () => {
      //arrange
      const state = Fixtures.OneToken();

      //act + assert
      expect(() =>
        state.consume(undefined, undefined, PreprocessorTokens.Builtin),
      ).toThrowError();
    });
  });

  describe("tryConsume", () => {
    test("tryConsume for empty", () => {
      //arrange
      const state = Fixtures.Empty();

      //act + assert
      expect(
        state.tryConsume(undefined, undefined, PreprocessorTokens.Id),
      ).toBeFalsy();
    });

    test("tryConsume positve for non-empty", () => {
      //arrange
      const state = Fixtures.OneToken();

      //act + assert
      expect(
        state.tryConsume(undefined, undefined, PreprocessorTokens.Id),
      ).toBeTruthy();
      expect(state.eof).toBeTruthy();
      expect(state.current).toBeUndefined();
      expect(state.last).not.toBeUndefined();
      expect(state.last!.image).toBe("ABC");
    });

    test("tryConsume negative for non-empty", () => {
      //arrange
      const state = Fixtures.OneToken();

      //act + assert
      expect(
        state.tryConsume(undefined, undefined, PreprocessorTokens.Builtin),
      ).toBeFalsy();
      expect(state.eof).toBeFalsy();
      expect(state.current).not.toBeUndefined();
      expect(state.current!.image).toBe("ABC");
      expect(state.last).toBeUndefined();
    });

    test("tryConsume positive for two tokens", () => {
      //arrange
      const state = Fixtures.TwoTokens();

      //act + assert
      expect(
        state.tryConsume(undefined, undefined, PreprocessorTokens.Id),
      ).toBeTruthy();
      expect(state.eof).toBeFalsy();
      expect(state.current).not.toBeUndefined();
      expect(state.current!.image).toBe(" ");
      expect(state.current!.tokenType.name).toBe("WS");
      expect(state.last).not.toBeUndefined();
      expect(state.last!.image).toBe("ABC");
    });
  });
});
