import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, test } from "vitest";
import { CICSPreprocessor } from "../preprocessor";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("CICS Dialect: Positives", () => {
  test("should parse statements", async () => {
    const content = await readFile(join(__dirname, "positives.txt"), "utf-8");
    const statements = content.split("\n");
    const cicsPreprocessor = new CICSPreprocessor();
    let line = 1;
    for (const statement of statements) {
      const { diagnostics } = await cicsPreprocessor.execute(statement);
      expect(
        diagnostics,
        `Error at line ${line}: ${diagnostics[0].message}`,
      ).toHaveLength(0);
      line++;
    }
  });
});
