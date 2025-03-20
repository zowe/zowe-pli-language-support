import { createToken } from "chevrotain";

const Id = tokenType("id", /[a-z_][a-z_0-9]*/yi);

export function tokenType(name: string, pattern: string | RegExp) {
    return createToken({
        name,
        pattern,
    });
}

export const PreprocessorTokens = {
    Leave: tokenType("leave", /LEAVE/yi),
    Iterate: tokenType("iterate", /ITERATE/yi),
    Activate: tokenType("activate", /ACT(IVATE)?/yi),
    If: tokenType("if", /IF/yi),
    Go: tokenType("go", /GO/yi),
    To: tokenType("to", /TO/yi),
    Loop: tokenType("loop", /LOOP|FOREVER/yi),
    While: tokenType("while", /WHILE/yi),
    Until: tokenType("until", /UNTIL/yi),
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
    Colon: tokenType("colon", /:/yi),
    Comma: tokenType("comma", /,/yi),
    Percentage: tokenType("percentage", /%/yi),
    Plus: tokenType("plus", /\+/yi),
    Minus: tokenType("minus", /\-/yi),
    Divide: tokenType("divide", /\//yi),
    Power: tokenType("pow", /\*\*/yi),
    Multiply: tokenType("multiply", /\*/yi),
    Concat: tokenType("concat", /\|\|/yi),
    Or: tokenType("or", /\|/yi),
    And: tokenType("and", /\&/yi),
    Eq: tokenType("eq", /=/yi),
    Neq: tokenType("neq", /<>/yi),
    LE: tokenType("le", /<=/yi),
    GE: tokenType("ge", />=/yi),
    GT: tokenType("gt", />/yi),
    LT: tokenType("lt", /</yi),
    
    //This token regexp was taken from the PL/1 Langium grammar
    //TODO need a way to sync them...
    String: tokenType("string", /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX]|[aA]|[eE]|[xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/y),
    Id,
    Number: tokenType("number", /[0-9]+/yi),
};

export const AllPreprocessorTokens = Object.values(PreprocessorTokens);
