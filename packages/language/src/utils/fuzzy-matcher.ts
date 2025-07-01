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

export function fuzzyMatch(query: string, text: string): boolean {
  if (query.length === 0) {
    return true;
  }

  let matchedFirstCharacter = false;
  let previous: number | undefined;
  let character = 0;
  const len = text.length;
  for (let i = 0; i < len; i++) {
    const strChar = text.charCodeAt(i);
    const testChar = query.charCodeAt(character);
    if (
      strChar === testChar ||
      toUpperCharCode(strChar) === toUpperCharCode(testChar)
    ) {
      matchedFirstCharacter ||=
        previous === undefined || // Beginning of word
        isWordTransition(previous, strChar);
      if (matchedFirstCharacter) {
        character++;
      }
      if (character === query.length) {
        return true;
      }
    }
    previous = strChar;
  }
  return false;
}

function isWordTransition(previous: number, current: number): boolean {
  return (
    (a <= previous && previous <= z && A <= current && current <= Z) || // camelCase transition
    (previous === _ && current !== _)
  ); // snake_case transition
}

function toUpperCharCode(charCode: number) {
  if (a <= charCode && charCode <= z) {
    return charCode - 32;
  }
  return charCode;
}

const a = "a".charCodeAt(0);
const z = "z".charCodeAt(0);
const A = "A".charCodeAt(0);
const Z = "Z".charCodeAt(0);
const _ = "_".charCodeAt(0);
