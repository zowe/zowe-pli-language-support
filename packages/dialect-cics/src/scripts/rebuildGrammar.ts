import { statSync } from "fs";
import { spawnSync } from "child_process";
import { exit } from "process";

const LEXER_INPUT = "./src/antlr/CICSLexer.g4",
  LEXER_OUTPUT = "./src/generated/CICSLexer.ts",
  PARSER_INPUT = "./src/antlr/CICSParser.g4",
  PARSER_OUTPUT = "./src/generated/CICSParser.ts";

if (shouldRebuild(LEXER_INPUT, LEXER_OUTPUT)) {
  console.log("Rebuilding lexer...");
  spawnSync(
    "npx",
    [
      "antlr-ng",
      "-Dlanguage=TypeScript",
      "-l",
      "-o",
      "src/generated",
      "./src/antlr/CICSLexer.g4",
    ],
    { stdio: "inherit" },
  );
} else {
  console.log("Lexer is up to date.");
}

if (shouldRebuild(PARSER_INPUT, PARSER_OUTPUT)) {
  console.log("Rebuilding parser...");
  spawnSync(
    "npx",
    [
      "antlr-ng",
      "-Dlanguage=TypeScript",
      "-v",
      "-o",
      "src/generated",
      "./src/antlr/CICSParser.g4",
    ],
    { stdio: "inherit" },
  );
} else {
  console.log("Parser is up to date.");
}
exit(0);

function shouldRebuild(inputFile: string, outputFile: string): boolean {
  try {
    return statSync(outputFile).mtimeMs < statSync(inputFile).mtimeMs;
  } catch {
    return true;
  }
}
