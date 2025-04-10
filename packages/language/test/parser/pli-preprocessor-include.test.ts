import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import {
  setFileSystemProvider,
  VirtualFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import { URI } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";

type TokenizeFunction = (text: string) => string[];

describe("PL/1 Includes", () => {
  let tokenize: TokenizeFunction;

  beforeAll(async () => {
    const vtsfs = new VirtualFileSystemProvider();
    setFileSystemProvider(vtsfs);
    vtsfs.writeFile(URI.file("/test/payroll.pli"), " DECLARE PAYROLL FIXED;");
    const lexer = new PliLexer();
    tokenize = (text: string) => {
      const uri = URI.file("/test/test.pli");
      const { all: allTokens } = lexer.tokenize(
        createCompilationUnit(uri),
        text,
        uri,
      );
      return allTokens.map(
        (t) => t.image + ":" + t.tokenType.name.toUpperCase(),
      );
    };
  });

  afterAll(() => {
    setFileSystemProvider(undefined);
  });

  test("Include twice with different IDs", () => {
    expect(
      tokenize(`
            %DECLARE PAYROLL CHARACTER;
            %PAYROLL = 'CUM_PAY';
            %INCLUDE "payroll.pli";
            %DEACTIVATE PAYROLL;
            %INCLUDE "payroll.pli";
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "CUM_PAY:ID",
      "FIXED:FIXED",
      ";:;",
      "DECLARE:DECLARE",
      "PAYROLL:ID",
      "FIXED:FIXED",
      ";:;",
    ]);
  });
});
