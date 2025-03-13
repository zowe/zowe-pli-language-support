import { createToken } from "chevrotain";

const Id = tokenType("id", /[a-z_][a-z_0-9]*/yi);

export function tokenType(name: string, pattern: string | RegExp) {
    return createToken({
        name,
        pattern,
    });
}

export const PreprocessorTokens = {
    Activate: tokenType("activate", /ACT(IVATE)?/yi),
    If: tokenType("if", /IF/yi),
    Do: tokenType("do", /DO/yi),
    End: tokenType("end", /END/yi),
    Then: tokenType("then", /THEN/yi),
    Else: tokenType("else", /ELSE/yi),
    Deactivate: tokenType("deactivate", /DEACT(IVATE)?/yi),
    Declare: tokenType("declare", /DCL|DECLARE/yi),
    Builtin: tokenType("builtin", /BUILTIN/yi),
    Entry: tokenType("builtin", /ENTRY/yi),
    Character: tokenType("character", /CHAR(ACTER)?/yi),
    Include: tokenType("include", /INCLUDE/yi),
    Internal: tokenType("internal", /INT(ERNAL)?/yi),
    External: tokenType("external", /EXT(ERNAL)?/yi),
    Directive: tokenType("directive", /PAGE|PRINT|NOPRINT|PUSH|POP/yi),
    Skip: tokenType("skip", /SKIP/yi),
    Scan: tokenType("scan", /SCAN/yi),
    Rescan: tokenType("rescan", /RESCAN/yi),
    Noscan: tokenType("noscan", /NOSCAN/yi),
    Fixed: tokenType("fixed", /FIXED/yi),

    LParen: tokenType("lparen", /\(/yi),
    RParen: tokenType("rparen", /\)/yi),
    Semicolon: tokenType("semicolon", /;/yi),
    Comma: tokenType("comma", /,/yi),
    Percentage: tokenType("percentage", /%/yi),
    Plus: tokenType("plus", /\+/yi),
    Minus: tokenType("minus", /\-/yi),
    Eq: tokenType("eq", /=/yi),
    
    //This token regexp was taken from the PL/1 Langium grammar
    //TODO need a way to sync them...
    String: tokenType("string", /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX]|[aA]|[eE]|[xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/y),
    Id,
    Number: tokenType("number", /[0-9]+/yi),
};

export const AllPreprocessorTokens = Object.values(PreprocessorTokens);
