import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import {
  setFileSystemProvider,
  VirtualFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import { URI } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import {
  PluginConfigurationProviderInstance,
  ProgramConfig,
  ProcessGroup,
} from "../../src/workspace/plugin-configuration-provider";

type TokenizeFunction = (text: string) => string[];

/**
 * Helper to set up the virtual file system w/ files, and lexer for testing.
 * @returns tokenizer func
 */
function setupFileSystemAndLexer(): TokenizeFunction {
  const vtsfs = new VirtualFileSystemProvider();
  setFileSystemProvider(vtsfs);
  vtsfs.writeFileSync(URI.file("/test/payroll.pli"), " DECLARE PAYROLL FIXED;");
  vtsfs.writeFileSync(
    URI.file("/test/cpy/lib1.pli"),
    " DECLARE LIB1_VAR FIXED;",
  );
  vtsfs.writeFileSync(URI.file("/test/cpy/LIB2"), " DECLARE LIB2_VAR FIXED;");
  vtsfs.writeFileSync(
    URI.file("/test/cpy/PLILIB.pli"),
    " DECLARE PLILIB_VAR FIXED;",
  );
  vtsfs.writeFileSync(URI.file("/test/LIB3"), " DECLARE LIB3_VAR FIXED;");
  vtsfs.writeFileSync(URI.file("/LIB4"), " DECLARE LIB4_VAR FIXED;");

  const lexer = new PliLexer();
  const tokenize = (text: string) => {
    const uri = URI.file("/test/test.pli");
    const compilationUnit = createCompilationUnit(uri);
    const { all: allTokens } = lexer.tokenize(compilationUnit, text, uri);
    return allTokens.map((t) => t.image + ":" + t.tokenType.name.toUpperCase());
  };
  return tokenize;
}

/**
 * Helper to set up plugin configuration.
 */
async function setupPluginConfiguration() {
  await PluginConfigurationProviderInstance.init("/test");

  const programConfigs: ProgramConfig[] = [
    {
      program: "test.pli",
      pgroup: "testgroup",
    },
  ];
  PluginConfigurationProviderInstance.setProgramConfigs(
    "/test",
    programConfigs,
  );

  const processGroups: ProcessGroup[] = [
    {
      name: "testgroup",
      libs: ["cpy"],
      "copybook-extensions": [".pli"],
    },
  ];
  PluginConfigurationProviderInstance.setProcessGroupConfigs(processGroups);
}

describe("PL/1 Includes without Plugin Config", () => {
  let tokenize: TokenizeFunction;

  beforeAll(() => {
    tokenize = setupFileSystemAndLexer();
  });

  afterAll(() => {
    setFileSystemProvider(undefined);
  });

  test("Include relative path with extension", () => {
    expect(
      tokenize(`
            %INCLUDE "./cpy/lib1.pli";
            LIB1_VAR = 1;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB1_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB1_VAR:ID",
      "=:=",
      "1:NUMBER",
      ";:;",
    ]);
  });

  test("Include relative path without extension", () => {
    expect(
      tokenize(`
            %INCLUDE "./cpy/LIB2";
            LIB2_VAR = 2;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB2_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB2_VAR:ID",
      "=:=",
      "2:NUMBER",
      ";:;",
    ]);
  });

  test("Include relative path with '../'", () => {
    expect(
      tokenize(`
            %INCLUDE "../LIB4";
            LIB4_VAR = 1;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB4_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB4_VAR:ID",
      "=:=",
      "1:NUMBER",
      ";:;",
    ]);
  });

  // intended failure
  test.fails(
    "Include should fail to resolve bare identifier without lib lookup",
    () => {
      expect(
        tokenize(`
            %INCLUDE LIB2;
            LIB2_VAR = 3;
        `),
      ).toStrictEqual([
        "DECLARE:DECLARE",
        "LIB2_VAR:ID",
        "FIXED:FIXED",
        ";:;",
        "LIB2_VAR:ID",
        "=:=",
        "3:NUMBER",
        ";:;",
      ]);
    },
  );

  // expected failure, we cannot resolve member includes w/out plugin config
  test.fails("Include bare identifier without quotes or extension", () => {
    expect(
      tokenize(`
            %INCLUDE LIB3;
            LIB3_VAR = 4;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB3_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB3_VAR:ID",
      "=:=",
      "4:NUMBER",
      ";:;",
    ]);
  });
});

describe("PL/1 Includes with Plugin Config", () => {
  let tokenize: TokenizeFunction;

  beforeAll(async () => {
    tokenize = setupFileSystemAndLexer();
    await setupPluginConfiguration();
  });

  afterAll(() => {
    setFileSystemProvider(undefined);
    PluginConfigurationProviderInstance.setProgramConfigs("", []);
    PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
  });

  test("Include twice with different IDs", () => {
    expect(
      tokenize(`
            %DECLARE PAYROLL CHARACTER;
            %PAYROLL = 'CUM_PAY';
            %INCLUDE "./payroll.pli";
            %DEACTIVATE PAYROLL;
            %INCLUDE "./payroll.pli";
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

  test("Include from lib paths", () => {
    expect(
      tokenize(`
            %INCLUDE "lib1.pli";
            LIB1_VAR = 1;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB1_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB1_VAR:ID",
      "=:=",
      "1:NUMBER",
      ";:;",
    ]);
  });

  test("Include from lib paths w/out extension", () => {
    expect(
      tokenize(`
            %INCLUDE 'LIB2';
            LIB2_VAR = 2;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB2_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB2_VAR:ID",
      "=:=",
      "2:NUMBER",
      ";:;",
    ]);
  });

  test("Include using non-quoted identifier syntax", () => {
    expect(
      tokenize(`
            %INCLUDE LIB2;
            LIB2_VAR = 3;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "LIB2_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "LIB2_VAR:ID",
      "=:=",
      "3:NUMBER",
      ";:;",
    ]);
  });

  test("Include using non-quoted identifier syntax w/out extension", () => {
    // lib includes should resolve with or w/out their extension
    expect(
      tokenize(`
            %INCLUDE PLILIB;
            PLILIB_VAR = 32;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "PLILIB_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "PLILIB_VAR:ID",
      "=:=",
      "32:NUMBER",
      ";:;",
    ]);
  });

  test("Include using quoted identifier syntax w/out extension", () => {
    // lib includes should resolve with or w/out their extension
    expect(
      tokenize(`
            %INCLUDE 'PLILIB';
            PLILIB_VAR = 32;
        `),
    ).toStrictEqual([
      "DECLARE:DECLARE",
      "PLILIB_VAR:ID",
      "FIXED:FIXED",
      ";:;",
      "PLILIB_VAR:ID",
      "=:=",
      "32:NUMBER",
      ";:;",
    ]);
  });

  test("Include doesn't pickup wrong file", () => {
    // incomplete identifier, should not resolve (skipping included contents here) even w/ glob lookup
    expect(
      tokenize(`
            %INCLUDE PLIL;
            PLILIB_VAR = 32;
        `),
    ).toStrictEqual(["PLILIB_VAR:ID", "=:=", "32:NUMBER", ";:;"]);
  });
});
