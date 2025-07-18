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
import {
  PliPreprocessorLexerState,
  PreprocessorLexerState,
} from "../../src/preprocessor/pli-preprocessor-lexer-state";
import { PreprocessorTokens } from "../../src/preprocessor/pli-preprocessor-tokens";
import { URI } from "../../src/utils/uri";

namespace Fixtures {
  export function empty(): PreprocessorLexerState {
    return new PliPreprocessorLexerState("", URI.parse("test"));
  }
  export function declarationFixed() {
    return new PliPreprocessorLexerState(
      "DCL VARIABLE FIXED;",
      URI.parse("test"),
    );
  }
  export function fourLines() {
    return new PliPreprocessorLexerState(
      "DCL VARIABLE1 FIXED;\nDCL VARIABLE2 FIXED;\nDCL VARIABLE3 FIXED;\nDCL VARIABLE4 FIXED;",
      URI.parse("test"),
    );
  }
}

describe("Preprocessor Lexer State", () => {
  describe("eof", () => {
    test("eof on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act + assert
      expect(state.eof()).toBeTruthy();
    });

    test("eof on non-empty", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      const eof = state.eof();

      //assert
      expect(eof).toBeFalsy();
    });
  });

  describe("position", () => {
    test("position on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act + assert
      expect(state.position()).toEqual(0);
    });

    test("position on non-empty at beginning", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      const position = state.position();

      //assert
      expect(position).toEqual(0);
    });

    test("position on non-empty in the middle", () => {
      //arrange
      const state = Fixtures.declarationFixed();
      state.advanceScan("DCL");

      //act
      const position = state.position();

      //assert
      expect(position).toEqual(3);
    });
  });

  describe("canConsume", () => {
    test("canConsume on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act
      const actual = state.canConsume(PreprocessorTokens.Declare);

      //assert
      expect(actual).toBeFalsy();
    });

    test("canConsume positive on non-empty at beginning", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      const actual = state.canConsume(PreprocessorTokens.Declare);

      //assert
      expect(actual).toBe("DCL");
    });

    test("canConsume negative on non-empty in the middle", () => {
      //arrange
      const state = Fixtures.declarationFixed();
      state.advanceScan("DCL"); // " " is a gap between DCL and VARIABLE

      //act
      const actual = state.canConsume(PreprocessorTokens.Id);

      //assert
      expect(actual).toBeUndefined();
    });

    test("canConsume positive on non-empty in the middle", () => {
      //arrange
      const state = Fixtures.declarationFixed();
      state.advanceScan("DCL");
      state.advanceScan(" ");

      //act
      const actual = state.canConsume(PreprocessorTokens.Id);

      //assert
      expect(actual).toBe("VARIABLE");
    });

    test("canConsume negative on non-empty", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      const actual = state.canConsume(PreprocessorTokens.Character);

      //assert
      expect(actual).toBeFalsy();
    });
  });

  describe("tryConsume", () => {
    test("tryConsume on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act
      const actual = state.tryConsume(PreprocessorTokens.Declare);

      //assert
      expect(actual).toBeFalsy();
    });

    test("tryConsume positive on non-empty at beginning", () => {
      //arrange
      const state = Fixtures.declarationFixed();
      const offset = state.position();

      //act
      const actual = state.tryConsume(PreprocessorTokens.Declare);

      //assert
      expect(actual).not.toBeUndefined();
      expect(actual!.image).toBe("DCL");
      expect(state.eof()).toBeFalsy();
      expect(offset).toBeLessThan(state.position());
    });

    test("tryConsume negative on non-empty in the middle", () => {
      //arrange
      const state = Fixtures.declarationFixed();
      state.advanceScan("DCL"); // " " is a gap between DCL and VARIABLE

      //act
      const actual = state.tryConsume(PreprocessorTokens.Id);

      //assert
      expect(actual).toBeUndefined();
    });

    test("tryConsume positive on non-empty in the middle", () => {
      //arrange
      const state = Fixtures.declarationFixed();
      state.advanceScan("DCL");
      state.advanceScan(" ");

      //act
      const actual = state.tryConsume(PreprocessorTokens.Id);

      //assert
      expect(actual).not.toBeUndefined();
      expect(actual!.image).toBe("VARIABLE");
    });

    test("tryConsume negative on non-empty", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      const actual = state.tryConsume(PreprocessorTokens.Character);

      //assert
      expect(actual).toBeUndefined();
    });
  });

  describe("emit", () => {
    //Attention! You can emit anything. It will become a token with the specified image and advance by the length of the image.
    test("emit on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act
      const token = state.emit("haha", PreprocessorTokens.Declare);

      //assert
      expect(token).not.toBeUndefined();
      expect(token.image).toBe("haha");
      expect(token.tokenType).toBe(PreprocessorTokens.Declare);
      expect(state.eof()).toBeTruthy();
    });

    test("emit on non-empty", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      const token = state.emit("haha", PreprocessorTokens.Declare);

      //assert
      expect(token).not.toBeUndefined();
      expect(token.image).toBe("haha");
      expect(token.tokenType).toBe(PreprocessorTokens.Declare);
      expect(state.eof()).toBeFalsy();
    });
  });

  describe("advanceLines", () => {
    test("advanceLines on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act
      state.advanceLines(100);

      //assert
      expect(state.eof()).toBeTruthy();
    });

    test("advanceLines on four lines, move 0 lines", () => {
      //arrange
      const state = Fixtures.fourLines();

      //act
      state.advanceLines(0);

      //assert
      // expect(state.position().line).toBe(1);
      expect(state.eof()).toBeFalsy();
    });

    test("advanceLines on four lines, move 1 lines", () => {
      //arrange
      const state = Fixtures.fourLines();

      //act
      state.advanceLines(1);

      //assert
      // expect(state.position().line).toBe(2);
      expect(state.eof()).toBeFalsy();
    });
    test("advanceLines on four lines, move 3 lines", () => {
      //arrange
      const state = Fixtures.fourLines();

      //act
      state.advanceLines(3);

      //assert
      // expect(state.position().line).toBe(4);
      expect(state.eof()).toBeFalsy();
    });

    test("advanceLines on four lines, move 4 lines", () => {
      //arrange
      const state = Fixtures.fourLines();

      //act
      state.advanceLines(4);

      //assert
      expect(state.eof()).toBeTruthy();
    });
  });

  describe("advanceScan", () => {
    test("advanceScan on empty", () => {
      //arrange
      const state = Fixtures.empty();

      //act
      state.advanceScan("anything");

      //assert
      expect(state.eof()).toBeTruthy();
    });

    test("advanceScan on non-empty", () => {
      //arrange
      const state = Fixtures.declarationFixed();

      //act
      state.advanceScan("anything");

      //assert
      expect(state.eof()).toBeFalsy();
      expect(state.position()).toBe("anything".length);
    });
  });
});
