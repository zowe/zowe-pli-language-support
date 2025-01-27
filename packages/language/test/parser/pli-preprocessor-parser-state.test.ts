import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { describe, expect, test } from "vitest";
import { PreprocessorTokens } from "../../src/parser/pli-preprocessor-tokens";
import { PliPreprocessorParserState } from "../../src/parser/pli-preprocessor-parser-state";

type TokenTypeName = keyof typeof PreprocessorTokens;
type TokenEncoded = `${string}:${TokenTypeName}`;

namespace Fixtures {
    export const Empty: IToken[] = [];
    export const OneToken = tokenSequence("A:Id");
    export const TwoTokens = tokenSequence("A:Id", "123:Number");

    function tokenSequence(...tokens: TokenEncoded[]): IToken[] {
        const pattern = /^(.[^:]*):(.*)$/;
        return tokens.map(t => {
            const match = pattern.exec(t);
            if(!match) {
                throw new Error("Wrong format: "+t);
            }
            const image = match[1];
            const tokenTypeName = match[2];
            if(!(tokenTypeName in PreprocessorTokens)) {
                throw new Error("Wrong tokenType: "+tokenTypeName);
            }
            return token(image, PreprocessorTokens[tokenTypeName as TokenTypeName]);
        })
    }
    
    function token(image: string, tokenType: TokenType): IToken {
        return createTokenInstance(tokenType, image, 0, 0, 0, 0, 0, 0);
    }
}

describe("Preprocessor parser state", () => {
    describe("EOF", () => {
        test("Check eof for empty", () => {
            //arrange + act
            const state = new PliPreprocessorParserState(Fixtures.Empty);
    
            //assert
            expect(state.eof).toBe(true);
            expect(state.current).toBeUndefined();
            expect(state.last).toBeUndefined();
        });
    
        test("Check eof for non-empty", () => {
            //arrange + act
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
    
            //assert
            expect(state.eof).toBe(false);
            expect(state.current).not.toBeUndefined();
            expect(state.last).toBeUndefined();
        });
    });
    

    describe("canConsume", () => {
        test("canConsume for empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.Empty);
            
            //act
            expect(state.canConsume(PreprocessorTokens.Id)).toBeFalsy();
            
            //assert
            expect(state.eof).toBe(true);
            expect(state.current).toBeUndefined();
            expect(state.last).toBeUndefined();
        });
    
        test("canConsume positive for non-empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
            
            //act
            expect(state.canConsume(PreprocessorTokens.Id)).toBeTruthy();
    
            //assert
            expect(state.eof).toBe(false);
            expect(state.current).not.toBeUndefined();
            expect(state.current!.image).toBe('A');
            expect(state.last).toBeUndefined();
        });
    
        test("canConsume negative for non-empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
            
            //act
            expect(state.canConsume(PreprocessorTokens.Builtin)).toBeFalsy();
    
            //assert
            expect(state.eof).toBe(false);
            expect(state.current).not.toBeUndefined();
            expect(state.current!.image).toBe('A');
            expect(state.last).toBeUndefined();
        });
    });

    describe("consume", () => {
        test("Consume for empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.Empty);
    
            //act + assert
            expect(() => state.consume(PreprocessorTokens.Id)).toThrowError();
        });
    
        test("Consume positive for non-empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
    
            //act
            expect(state.consume(PreprocessorTokens.Id).image).toBe("A");
    
            //assert
            expect(state.eof).toBe(true);
            expect(state.current).toBeUndefined();
            expect(state.last).not.toBeUndefined();
            expect(state.last!.image).toBe("A");
        });
    
        test("Check Consume negative for non-empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
    
            //act + assert
            expect(() => state.consume(PreprocessorTokens.Builtin)).toThrowError();
        });
    });
    
    describe("tryConsume", () => {
        test("tryConsume for empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.Empty);
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Id)).toBeFalsy();
        });

        test("tryConsume positve for non-empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Id)).toBeTruthy();
            expect(state.eof).toBeTruthy();
            expect(state.current).toBeUndefined();
            expect(state.last).not.toBeUndefined();
            expect(state.last!.image).toBe("A");
        });

        test("tryConsume negative for non-empty", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.OneToken);
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Builtin)).toBeFalsy();
            expect(state.eof).toBeFalsy();
            expect(state.current).not.toBeUndefined();
            expect(state.current!.image).toBe("A");
            expect(state.last).toBeUndefined();
        });

        test("tryConsume positive for two tokens", () => {
            //arrange
            const state = new PliPreprocessorParserState(Fixtures.TwoTokens);
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Id)).toBeTruthy();
            expect(state.eof).toBeFalsy();
            expect(state.current).not.toBeUndefined();
            expect(state.current!.image).toBe("123");
            expect(state.current!.tokenType).toBe(PreprocessorTokens.Number);
            expect(state.last).not.toBeUndefined();
            expect(state.last!.image).toBe("A");
        });
    });
});