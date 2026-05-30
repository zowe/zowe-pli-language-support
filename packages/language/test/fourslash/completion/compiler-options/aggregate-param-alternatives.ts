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

/// <reference path="../../framework.ts" />

////*PROCESS AGGREG<|1>;
////*PROCESS AGGREGATE<|2>;
////*PROCESS AGGREGATE(<|3>);
////*PROCESS AGGREGATE(DECIMAL<|4>);
////*PROCESS AGGREGATE(DECIMAL<|5>)
////*PROCESS AGGREGATE(DECIMAL<|6>
////*PROCESS ARCH(13<|7>);
////*PROCESS ARCH(13)<|8>;
////*PROCESS AGGREGATE(DECIMAL)<|9>;

// A partial name completes to the canonical option name.
completion.expectAt(1, { includes: ["AGGREGATE"] });

// Once the option name is fully typed, ';' (to terminate the directive) and
// one '(alternative)' item per alternative are offered directly - not a bare
// '(' step, the option name itself, other option names, or the bare
// alternative values.
completion.expectAt(2, {
  includes: [";", "(DECIMAL)", "(HEXADEC)"],
  excludes: ["(", "AGGREGATE", "NOAGGREGATE", "DECIMAL", "HEXADEC"],
});

// Inside the (still empty) parentheses, only the option's literal
// alternatives are offered - not option names.
completion.expectAt(3, {
  includes: ["DECIMAL", "HEXADEC"],
  excludes: ["AGGREGATE", "OPTIMIZE"],
});

// Once a full, valid alternative has been typed and the closing ')' already
// exists in the source (with a trailing ';'), nothing is offered - the
// directive is already complete, same as a mandatory-parameter option like
// `ARCH(13);`.
completion.expectAt(4, {
  excludes: ["DECIMAL", "HEXADEC", ")", ");", ";"],
});

// Same as above, but without a trailing ';' yet: still nothing is offered,
// since the parentheses are already closed.
completion.expectAt(5, {
  excludes: ["DECIMAL", "HEXADEC", ")", ");", ";"],
});

// Once a full, valid alternative has been typed and there is no closing ')'
// yet at all, both a bare ')' and the combined ');' are offered - not ';' on
// its own, and not the alternatives.
completion.expectAt(6, {
  includes: [")", ");"],
  excludes: ["DECIMAL", "HEXADEC", ";"],
});

// A mandatory-parameter option with alternatives (ARCH) behaves the same way
// once its value and closing ')' already exist: nothing is offered.
completion.expectAt(7, {
  excludes: ["10", "11", "12", "13", "14", ")", ");", ";"],
});

// Right after a completed option's closing ')', with a ';' already right
// there, the redundant/duplicate ';' suggestion is suppressed - but other
// option names (to continue the directive before the existing ';') are
// still offered.
completion.expectAt(8, {
  includes: ["AGGREGATE", "OPTIMIZE"],
  excludes: [";"],
});
completion.expectAt(9, {
  includes: ["AGGREGATE", "OPTIMIZE"],
  excludes: [";"],
});
