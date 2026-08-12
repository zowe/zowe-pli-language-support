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

/// <reference path="../../../framework.ts" />

/**
 * A string literal split across two ANSWER emissions should lex correctly since the
 * pipeline's final composed text is lexed exactly once. TODO: today the macro
 * interpreter's own per-emission `lex()` already drops the unterminated string halves
 * before the serializer can reassemble them - supporting this needs the interpreter to
 * preserve the raw emission text for unterminated tokens.
 */
//// %MYMACRO: PROC;
////   ANSWER ('PUT (''AB');
////   ANSWER ('C'');');
//// %END;
//// %ACTIVATE MYMACRO;
//// MYMACRO

preprocessor.expectTokens(`PUT ('ABC');`);
verify.noDiagnostics();
