import { Lexer } from "chevrotain";
import { all } from "./tokens";
import { PliParser } from "./parser";
import { test } from 'vitest';
import { createPliServices } from '../packages/language/src/pli-module';
import { EmptyFileSystem } from 'langium';

test('parser', () => {
    const services = createPliServices({ ...EmptyFileSystem });
    const lexer = new Lexer(all);
    const parser = new PliParser();

    const input = `
    /* Enterprise PL/I for z/OS Language Reference v6.1, pg.249 */


    asserts: package;                                                             
                                                                                    
        main: proc options(main);                                                    
                                                                                    
        dcl n fixed bin;                                                           
                                                                                    
        n = 1;                                                                     
        assert compare(n,1);                                                       
        assert compare(n,2) text("n not equal to 2");                                
        assert unreachable;                                                        
        end;                                                                         
                                                                                    
        ibmpasc:                                                                     
        proc( packagename_ptr, procname_ptr, assert_sourceline,                     
        actual_addr, actual_length,                                                 
        expected_addr, expected_length,                                             
        text_addr, text_length )                                                    
        ext( '_IBMPASC')                                                            
        options( byvalue linkage(optlink) );                                        
                                                                                    
        dcl packagename_ptr   pointer;                                              
        dcl procname_ptr      pointer;                                              
        dcl assert_sourceline fixed BINARY(31);                                        
        dcl actual_addr       pointer;                                              
        dcl actual_length     fixed BINARY(31);                                        
        dcl expected_addr     pointer;                                              
        dcl expected_length   fixed BINARY(31);                                        
        dcl text_addr         pointer;                                              
        dcl text_length       fixed BINARY(31);                                        
                                                                                    
        dcl assert_packagename char(100) var based(packagename_ptr);                
        dcl assert_procname char(100) var based(procname_ptr);                      
        dcl assert_text char(text_length) based(text_addr);                         
        dcl actual_text char(actual_length) based(actual_addr);                     
        dcl expected_text char(expected_length)                                     
                                            based(expected_addr);                   
                                                                                    
        put skip edit( 'compare code hit on line ',                                 
                        trim(assert_sourceline),                                     
                        ' in ',                                                      
                        assert_packagename,                                          
                        ':', assert_procname )                                       
                ( a );                                                            
                                                                                    
        if text_length = 0 then;                                                    
        else                                                                        
            put skip list( assert_text );                                            
                                                                                    
        if actual_length = 0 then;                                                  
        else                                                                        
            put skip list( actual_text );                                            
                                                                                    
        if expected_length = 0 then;                                                
        else                                                                        
            put skip list( expected_text );                                          
                                                                                    
    end;          
    end;
    `;
    let text = '';
    for (let i = 0; i < 100; i++) {
        text += input;
    }
    const size = text.split('\n').length;
    const lexerResult = lexer.tokenize(text);
    parser.input = lexerResult.tokens;
    parser.PliProgram();
    console.time('parse');
    lexer.tokenize(text);
    parser.input = lexerResult.tokens;
    parser.PliProgram();
    console.timeEnd('parse');
    services.pli.parser.LangiumParser.parse(text);
    console.time('parse2');
    services.pli.parser.LangiumParser.parse(text);
    console.timeEnd('parse2');
    console.log('LOC', size);
});