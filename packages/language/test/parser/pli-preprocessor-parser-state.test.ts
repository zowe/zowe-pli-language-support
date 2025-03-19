import { describe, expect, test } from "vitest";
import { PreprocessorTokens } from "../../src/parser/pli-preprocessor-tokens";
import { PliPreprocessorParserState } from "../../src/parser/pli-preprocessor-parser-state";
import { createPliServices } from "../../src";
import { EmptyFileSystem, URI } from "langium";

namespace Fixtures {
    const services = createPliServices(EmptyFileSystem);

    const uri = URI.file("file:///test.pli");
    export const Empty = () => new PliPreprocessorParserState(services.pli.parser.PreprocessorLexer, "", uri);
    export const OneToken = () => new PliPreprocessorParserState(services.pli.parser.PreprocessorLexer, "ABC", uri);
    export const TwoTokens = () => new PliPreprocessorParserState(services.pli.parser.PreprocessorLexer, "ABC 123", uri);
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
            expect(state.current!.image).toBe('ABC');
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
            expect(state.current!.image).toBe('ABC');
            expect(state.last).toBeUndefined();
        });
    });

    describe("consume", () => {
        test("Consume for empty", () => {
            //arrange
            const state = Fixtures.Empty();
    
            //act + assert
            expect(() => state.consume(PreprocessorTokens.Id)).toThrowError();
        });
    
        test("Consume positive for non-empty", () => {
            //arrange
            const state = Fixtures.OneToken();
    
            //act
            expect(state.consume(PreprocessorTokens.Id).image).toBe("ABC");
    
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
            expect(() => state.consume(PreprocessorTokens.Builtin)).toThrowError();
        });
    });
    
    describe("tryConsume", () => {
        test("tryConsume for empty", () => {
            //arrange
            const state = Fixtures.Empty();
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Id)).toBeFalsy();
        });

        test("tryConsume positve for non-empty", () => {
            //arrange
            const state = Fixtures.OneToken();
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Id)).toBeTruthy();
            expect(state.eof).toBeTruthy();
            expect(state.current).toBeUndefined();
            expect(state.last).not.toBeUndefined();
            expect(state.last!.image).toBe("ABC");
        });

        test("tryConsume negative for non-empty", () => {
            //arrange
            const state = Fixtures.OneToken();
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Builtin)).toBeFalsy();
            expect(state.eof).toBeFalsy();
            expect(state.current).not.toBeUndefined();
            expect(state.current!.image).toBe("ABC");
            expect(state.last).toBeUndefined();
        });

        test("tryConsume positive for two tokens", () => {
            //arrange
            const state = Fixtures.TwoTokens();
    
            //act + assert
            expect(state.tryConsume(PreprocessorTokens.Id)).toBeTruthy();
            expect(state.eof).toBeFalsy();
            expect(state.current).not.toBeUndefined();
            expect(state.current!.image).toBe(" ");
            expect(state.current!.tokenType.name).toBe('WS');
            expect(state.last).not.toBeUndefined();
            expect(state.last!.image).toBe("ABC");
        });
    });
});