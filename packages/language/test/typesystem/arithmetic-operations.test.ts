import { beforeAll, describe, expect, test } from "vitest";
import {
  ArithmeticOperator,
  CompilerOptionRules,
  ComputeOperationReturnType,
  createArithmeticOperationTable,
} from "../../src/typesystem/arithmetic-operations";
import {
  Base,
  DataType,
  Scale,
  ScaleMode,
  TypesDescriptions,
} from "../../src/typesystem/descriptions";

function arithmetic(
  scaleMode: ScaleMode,
  base: Base,
  p: number,
  q: number = 0,
) {
  const scale: Scale =
    scaleMode === ScaleMode.Fixed
      ? {
          mode: ScaleMode.Fixed,
          totalDigitsCount: p,
          fractionalDigitsCount: q,
        }
      : {
          mode: ScaleMode.Float,
          totalDigitsCount: p,
        };
  return TypesDescriptions.Arithmetic({
    base,
    scale,
  });
}

type ExpectWhenType = (
  lhs: TypesDescriptions.Arithmetic,
  op: ArithmeticOperator,
  rhs: TypesDescriptions.Arithmetic,
  expectedScaleMode: ScaleMode,
  expectedBase: Base,
  expectedP: number,
  expectedQ?: number,
) => void;

function expectArithmeticWhenFactory(
  inferArithmeticOp: ComputeOperationReturnType,
): ExpectWhenType {
  return function expectArithmeticWhen(
    lhs: TypesDescriptions.Arithmetic,
    op: ArithmeticOperator,
    rhs: TypesDescriptions.Arithmetic,
    expectedScaleMode: ScaleMode,
    expectedBase: Base,
    expectedP: number,
    expectedQ?: number,
  ) {
    const returnType = inferArithmeticOp({
      lhs,
      rhs,
      op,
    }) as TypesDescriptions.Arithmetic;
    expect(returnType.scale.mode).toBe(expectedScaleMode);
    expect(returnType.base).toBe(expectedBase);
    expect(returnType.scale.totalDigitsCount).toBe(expectedP);
    if (returnType.scale.mode === ScaleMode.Fixed) {
      expect(returnType.scale.fractionalDigitsCount).toBe(expectedQ);
    }
  };
}

describe("Arithmetic operations", () => {
  const floatDecimal10 = arithmetic(ScaleMode.Float, Base.Decimal, 10);
  const floatDecimal20 = arithmetic(ScaleMode.Float, Base.Decimal, 20);

  const floatBinary10 = arithmetic(ScaleMode.Float, Base.Binary, 10);
  const floatBinary20 = arithmetic(ScaleMode.Float, Base.Binary, 20);

  const fixedDecimal10_0 = arithmetic(ScaleMode.Fixed, Base.Decimal, 10, 0);
  const fixedDecimal20_0 = arithmetic(ScaleMode.Fixed, Base.Decimal, 20, 0);
  const fixedDecimal10_6 = arithmetic(ScaleMode.Fixed, Base.Decimal, 10, 6);
  const fixedDecimal20_10 = arithmetic(ScaleMode.Fixed, Base.Decimal, 20, 10);

  const fixedBinary20_0 = arithmetic(ScaleMode.Fixed, Base.Binary, 20, 0);
  const fixedBinary35_0 = arithmetic(ScaleMode.Fixed, Base.Binary, 35, 0);
  const fixedBinary10_6 = arithmetic(ScaleMode.Fixed, Base.Binary, 10, 6);
  const fixedBinary20_10 = arithmetic(ScaleMode.Fixed, Base.Binary, 20, 10);

  describe("Compiler-flag-unrelated", () => {
    /**
     * This DESCRIBE is equivalent to Table 1 of the given link.
     * @see https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic#resarithoprt__fig16
     */
    let expectArithmeticWhen: ExpectWhenType;

    beforeAll(() => {
      //should be same as 'ibm'
      const inferArithmeticOp = createArithmeticOperationTable(
        CompilerOptionRules.ANS,
      );
      expectArithmeticWhen = expectArithmeticWhenFactory(inferArithmeticOp);
    });

    test("float decimal OP float decimal", () => {
      expectArithmeticWhen(
        floatDecimal10,
        "+",
        floatDecimal20,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "-",
        floatDecimal20,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "*",
        floatDecimal10,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "/",
        floatDecimal10,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "**",
        floatDecimal20,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
    });

    test("float decimal OP fixed decimal", () => {
      expectArithmeticWhen(
        floatDecimal10,
        "+",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "-",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "*",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "/",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "**",
        fixedDecimal20_0,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
    });

    test("fixed decimal OP float decimal", () => {
      expectArithmeticWhen(
        fixedDecimal10_6,
        "+",
        floatDecimal10,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        fixedDecimal10_6,
        "-",
        floatDecimal20,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
      expectArithmeticWhen(
        fixedDecimal10_6,
        "*",
        floatDecimal10,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        fixedDecimal10_6,
        "/",
        floatDecimal10,
        ScaleMode.Float,
        Base.Decimal,
        10,
      );
      expectArithmeticWhen(
        fixedDecimal20_0,
        "**",
        floatDecimal10,
        ScaleMode.Float,
        Base.Decimal,
        20,
      );
    });

    test("float binary OP float binary", () => {
      expectArithmeticWhen(
        floatBinary10,
        "+",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        floatBinary20,
        "-",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        floatBinary10,
        "*",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        10,
      );
      expectArithmeticWhen(
        floatBinary10,
        "/",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        10,
      );
      expectArithmeticWhen(
        floatBinary10,
        "**",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
    });

    test("float binary OP fixed binary", () => {
      expectArithmeticWhen(
        floatBinary10,
        "+",
        fixedBinary20_0,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        floatBinary20,
        "-",
        fixedBinary20_10,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        floatBinary10,
        "*",
        fixedBinary20_0,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        floatBinary10,
        "/",
        fixedBinary10_6,
        ScaleMode.Float,
        Base.Binary,
        10,
      );
      expectArithmeticWhen(
        floatBinary10,
        "**",
        fixedBinary20_10,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
    });

    test("fixed binary OP float binary", () => {
      expectArithmeticWhen(
        fixedBinary20_0,
        "+",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        fixedBinary20_10,
        "-",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        fixedBinary20_0,
        "*",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
      expectArithmeticWhen(
        fixedBinary10_6,
        "/",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        10,
      );
      expectArithmeticWhen(
        fixedBinary20_10,
        "**",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        20,
      );
    });

    test("fixed decimal OP float binary", () => {
      expectArithmeticWhen(
        fixedDecimal10_6,
        "+",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        fixedDecimal20_10,
        "-",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        fixedDecimal20_0,
        "*",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        fixedDecimal20_10,
        "/",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        fixedDecimal10_6,
        "**",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
    });

    test("float decimal OP fixed binary", () => {
      expectArithmeticWhen(
        floatDecimal10,
        "+",
        fixedBinary10_6,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "-",
        fixedBinary20_10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "*",
        fixedBinary20_10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "/",
        fixedBinary10_6,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "**",
        fixedBinary10_6,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
    });

    test("float decimal OP float binary", () => {
      expectArithmeticWhen(
        floatDecimal10,
        "+",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "-",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "*",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatDecimal20,
        "/",
        floatBinary20,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatDecimal10,
        "**",
        floatBinary10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
    });

    //---------------------
    test("fixed binary OP float decimal", () => {
      expectArithmeticWhen(
        fixedBinary10_6,
        "+",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        fixedBinary20_10,
        "-",
        floatDecimal20,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        fixedBinary20_0,
        "*",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        fixedBinary20_10,
        "/",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        fixedBinary10_6,
        "**",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
    });

    test("float binary OP fixed decimal", () => {
      expectArithmeticWhen(
        floatBinary10,
        "+",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        floatBinary20,
        "-",
        fixedDecimal20_10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatBinary20,
        "*",
        fixedDecimal20_10,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatBinary20,
        "/",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        floatBinary10,
        "**",
        fixedDecimal10_6,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
    });

    test("float binary OP float decimal", () => {
      expectArithmeticWhen(
        floatBinary10,
        "+",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        floatBinary20,
        "-",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
      expectArithmeticWhen(
        floatBinary20,
        "*",
        floatDecimal20,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatBinary20,
        "/",
        floatDecimal20,
        ScaleMode.Float,
        Base.Binary,
        67,
      );
      expectArithmeticWhen(
        floatBinary10,
        "**",
        floatDecimal10,
        ScaleMode.Float,
        Base.Binary,
        34,
      );
    });
  });

  describe("Compiler-flag RULES(ANS)", () => {
    let inferArithmeticOp: ComputeOperationReturnType;
    let expectArithmeticWhen: ExpectWhenType;

    beforeAll(() => {
      inferArithmeticOp = createArithmeticOperationTable(
        CompilerOptionRules.ANS,
      );
      expectArithmeticWhen = expectArithmeticWhenFactory(inferArithmeticOp);
    });

    describe("All operands are fixed with no scale, q=0", () => {
      /**
       * This DESCRIBE is equivalent to Table 2 (unscaled fixed)
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic#resarithoprt__fig17
       */
      test("fixed decimal OP fixed decimal", () => {
        expectArithmeticWhen(
          fixedDecimal10_0,
          "+",
          fixedDecimal20_0,
          ScaleMode.Fixed,
          Base.Decimal,
          21,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal10_0,
          "-",
          fixedDecimal10_0,
          ScaleMode.Fixed,
          Base.Decimal,
          11,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal10_0,
          "*",
          fixedDecimal20_0,
          ScaleMode.Fixed,
          Base.Decimal,
          31,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal20_0,
          "/",
          fixedDecimal10_0,
          ScaleMode.Fixed,
          Base.Decimal,
          18,
          -2,
        );
        expectArithmeticWhen(
          fixedDecimal10_0,
          "**",
          fixedDecimal20_0,
          ScaleMode.Fixed,
          Base.Decimal,
          20,
          0,
        );
      });

      test("fixed binary OP fixed binary", () => {
        expectArithmeticWhen(
          fixedBinary20_0,
          "+",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          36,
          0,
        );
        expectArithmeticWhen(
          fixedBinary35_0,
          "-",
          fixedBinary20_0,
          ScaleMode.Fixed,
          Base.Binary,
          36,
          0,
        );
        expectArithmeticWhen(
          fixedBinary20_0,
          "*",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          56,
          0,
        );
        expectArithmeticWhen(
          fixedBinary20_0,
          "/",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          56,
          0,
        );
        expectArithmeticWhen(
          fixedBinary20_0,
          "**",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          35,
          0,
        );
      });

      test("fixed decimal OP fixed binary", () => {
        expectArithmeticWhen(
          fixedDecimal20_0,
          "+",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          69,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal10_0,
          "-",
          fixedBinary20_0,
          ScaleMode.Fixed,
          Base.Binary,
          36,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal10_0,
          "*",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          71,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal20_0,
          "/",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          31,
          0,
        );
        expectArithmeticWhen(
          fixedDecimal10_0,
          "**",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Binary,
          35,
          0,
        );
      });

      test("fixed binary OP fixed decimal", () => {
        expectArithmeticWhen(
          fixedBinary35_0,
          "+",
          fixedDecimal20_0,
          ScaleMode.Fixed,
          Base.Binary,
          69,
          0,
        );
        expectArithmeticWhen(
          fixedBinary20_0,
          "-",
          fixedDecimal10_0,
          ScaleMode.Fixed,
          Base.Binary,
          36,
          0,
        );
        expectArithmeticWhen(
          fixedBinary20_0,
          "*",
          fixedDecimal10_0,
          ScaleMode.Fixed,
          Base.Binary,
          56,
          0,
        );
        expectArithmeticWhen(
          fixedBinary35_0,
          "/",
          fixedDecimal20_0,
          ScaleMode.Fixed,
          Base.Binary,
          31,
          0,
        );
        expectArithmeticWhen(
          fixedBinary35_0,
          "**",
          fixedDecimal10_0,
          ScaleMode.Fixed,
          Base.Binary,
          35,
          0,
        );
      });
    });

    describe("All operands are fixed with at least one scale, q <> 0", () => {
      /**
       * This DESCRIBE is equivalent to Table 3 (scaled fixed)
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic#resarithoprt__fig18
       */
      test("fixed decimal OP fixed decimal", () => {
        expectArithmeticWhen(
          fixedDecimal10_6,
          "+",
          fixedDecimal20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          21,
          10,
        );
        expectArithmeticWhen(
          fixedDecimal10_6,
          "-",
          fixedDecimal10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          11,
          6,
        );
        expectArithmeticWhen(
          fixedDecimal10_6,
          "*",
          fixedDecimal20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          31,
          16,
        );
        expectArithmeticWhen(
          fixedDecimal20_10,
          "/",
          fixedDecimal10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          18,
          2,
        );
        /** @todo what is q? */
        expectArithmeticWhen(
          fixedDecimal10_6,
          "**",
          fixedDecimal20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          20,
          0,
        );
      });

      test("fixed decimal OP fixed binary", () => {
        expectArithmeticWhen(
          fixedDecimal10_6,
          "+",
          fixedBinary20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          14,
          6,
        );
        expectArithmeticWhen(
          fixedDecimal10_6,
          "-",
          fixedBinary35_0,
          ScaleMode.Fixed,
          Base.Decimal,
          18,
          6,
        );
        expectArithmeticWhen(
          fixedDecimal20_10,
          "*",
          fixedBinary10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          25,
          10,
        );
        expectArithmeticWhen(
          fixedDecimal20_10,
          "/",
          fixedBinary20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          18,
          8,
        );
        /** @todo what is q? */
        expectArithmeticWhen(
          fixedDecimal10_6,
          "**",
          fixedBinary10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          34,
          0,
        );
      });

      test("fixed binary OP fixed decimal", () => {
        expectArithmeticWhen(
          fixedBinary20_10,
          "+",
          fixedDecimal10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          14,
          6,
        );
        expectArithmeticWhen(
          fixedBinary35_0,
          "-",
          fixedDecimal10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          18,
          6,
        );
        expectArithmeticWhen(
          fixedBinary10_6,
          "*",
          fixedDecimal20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          25,
          10,
        );
        expectArithmeticWhen(
          fixedBinary20_10,
          "/",
          fixedDecimal20_10,
          ScaleMode.Fixed,
          Base.Decimal,
          18,
          1,
        );
        /** @todo what is q? */
        expectArithmeticWhen(
          fixedBinary10_6,
          "**",
          fixedDecimal10_6,
          ScaleMode.Fixed,
          Base.Decimal,
          34,
          0,
        );
      });

      test("fixed binary OP fixed binary", () => {
        /**
         * Reminder: this case is not supported by RULES(ANS).
         * @see appendix of table https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic#resarithoprt__fig18
         * @todo shall we throw an error instead?
         */
        const returnType = inferArithmeticOp({
          lhs: fixedBinary20_10,
          op: "+",
          rhs: fixedBinary20_10,
        });
        expect(returnType.type).toBe(DataType.Unknown);
      });
    });
  });

  describe("Compiler-flag RULES(IBM)", () => {
    let expectArithmeticWhen: ExpectWhenType;

    beforeAll(() => {
      const inferArithmeticOp = createArithmeticOperationTable(
        CompilerOptionRules.IBM,
      );
      expectArithmeticWhen = expectArithmeticWhenFactory(inferArithmeticOp);
    });

    test("fixed decimal OP fixed decimal", () => {
      expectArithmeticWhen(
        fixedDecimal20_10,
        "+",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Decimal,
        21,
        10,
      );
      expectArithmeticWhen(
        fixedDecimal20_0,
        "-",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Decimal,
        27,
        6,
      );
      expectArithmeticWhen(
        fixedDecimal20_10,
        "*",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Decimal,
        31,
        16,
      );
      expectArithmeticWhen(
        fixedDecimal20_10,
        "/",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Decimal,
        18,
        2,
      );
      /** @todo what is q? */
      expectArithmeticWhen(
        fixedDecimal20_10,
        "**",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Decimal,
        20,
        0,
      );
    });

    test("fixed binary OP fixed binary", () => {
      expectArithmeticWhen(
        fixedBinary20_10,
        "+",
        fixedBinary20_10,
        ScaleMode.Fixed,
        Base.Binary,
        21,
        10,
      );
      expectArithmeticWhen(
        fixedBinary20_0,
        "-",
        fixedBinary20_10,
        ScaleMode.Fixed,
        Base.Binary,
        31,
        10,
      );
      expectArithmeticWhen(
        fixedBinary20_10,
        "*",
        fixedBinary20_0,
        ScaleMode.Fixed,
        Base.Binary,
        41,
        10,
      );
      expectArithmeticWhen(
        fixedBinary20_0,
        "/",
        fixedBinary20_10,
        ScaleMode.Fixed,
        Base.Binary,
        31,
        1,
      );
      /** @todo what is q? */
      expectArithmeticWhen(
        fixedBinary20_0,
        "**",
        fixedBinary20_10,
        ScaleMode.Fixed,
        Base.Binary,
        20,
        0,
      );
    });

    test("fixed decimal OP fixed binary", () => {
      expectArithmeticWhen(
        fixedDecimal20_10,
        "+",
        fixedBinary35_0,
        ScaleMode.Fixed,
        Base.Binary,
        70,
        34,
      );
      expectArithmeticWhen(
        fixedDecimal10_6,
        "-",
        fixedBinary10_6,
        ScaleMode.Fixed,
        Base.Binary,
        36,
        20,
      );
      expectArithmeticWhen(
        fixedDecimal20_10,
        "*",
        fixedBinary20_10,
        ScaleMode.Fixed,
        Base.Binary,
        89,
        44,
      );
      expectArithmeticWhen(
        fixedDecimal20_10,
        "/",
        fixedBinary10_6,
        ScaleMode.Fixed,
        Base.Binary,
        31,
        -9,
      );
      /** @todo what is q? */
      expectArithmeticWhen(
        fixedDecimal10_6,
        "**",
        fixedBinary20_10,
        ScaleMode.Fixed,
        Base.Binary,
        34,
        0,
      );
    });

    test("fixed binary OP fixed decimal", () => {
      expectArithmeticWhen(
        fixedBinary35_0,
        "+",
        fixedDecimal20_10,
        ScaleMode.Fixed,
        Base.Binary,
        70,
        34,
      );
      expectArithmeticWhen(
        fixedBinary10_6,
        "-",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Binary,
        36,
        20,
      );
      expectArithmeticWhen(
        fixedBinary20_10,
        "*",
        fixedDecimal20_10,
        ScaleMode.Fixed,
        Base.Binary,
        89,
        44,
      );
      expectArithmeticWhen(
        fixedBinary10_6,
        "/",
        fixedDecimal20_10,
        ScaleMode.Fixed,
        Base.Binary,
        31,
        -7,
      );
      /** @todo what is q? */
      expectArithmeticWhen(
        fixedBinary20_10,
        "**",
        fixedDecimal10_6,
        ScaleMode.Fixed,
        Base.Binary,
        34,
        0,
      );
    });
  });
});
