import { createToken } from "chevrotain";

export function tokenType(name: string, pattern: string | RegExp) {
    return createToken({
        name,
        pattern,
    });
}

export const PreprocessorTokens = {
    Declare: tokenType("declare", /DCL|DECLARE/yi),
    Eq: tokenType("eq", /=/yi),
    Builtin: tokenType("builtin", /BUILTIN/yi),
    Entry: tokenType("builtin", /ENTRY/yi),
    Character: tokenType("character", /CHAR(ACTER)?/yi),
    Internal: tokenType("internal", /INT(ERNAL)?/yi),
    External: tokenType("external", /EXT(ERNAL)?/yi),
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
    String: tokenType("string", /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX]|[aA]|[eE]|[xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/y),
    Id: tokenType("id", /[a-z_][a-z_0-9]*/yi),
    Number: tokenType("number", /[0-9]+/yi),
};
