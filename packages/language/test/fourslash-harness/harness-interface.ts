import { PLICodes } from "../../src/validation/messages";

export interface HarnessTesterInterface {
  verify: {
    expectExclusiveErrorCodesAt(
      label: string | number,
      codes: string[] | string,
    ): void;
  };

  linker: {
    /**
     * Expect that the defined links actually links to the correct target.
     */
    expectLinks(): void;
    /**
     * Expect that the defined links do not link to the given label.
     */
    expectNoLinksAt(label: string | number): void;
  };

  code: {
    Severe: typeof PLICodes.Severe;
    Warning: typeof PLICodes.Warning;
    Information: typeof PLICodes.Info;
    Error: typeof PLICodes.Error;
  };
}
