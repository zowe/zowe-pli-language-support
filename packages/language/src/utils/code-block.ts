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
