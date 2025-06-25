/// <reference path="../framework.ts" />

/**
 * Builtin declarations using `BUILTIN` may be repeated.
 */

//// DCL <|1:ABS|> BUILTIN;
//// PUT(<|1>ABS(-1));

verify.noDiagnostics();
linker.expectLinks();
