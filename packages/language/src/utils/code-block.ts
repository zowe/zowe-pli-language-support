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

export function formatCodeBlock(language: string) {
  return (text: string): string => {
    return `\`\`\`${language}\n${text}\n\`\`\`\n`;
  };
}

/**
 * Format a code block for Pli.
 *
 * @example
 * formatPliCodeBlock("DCL A") === "```pli\nDCL A\n```\n"
 */
export const formatPliCodeBlock = formatCodeBlock("pli");
