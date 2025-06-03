import { PLICodes } from "../../../src/validation/messages";
import { HarnessTesterInterface } from "../harness-interface";

export const HarnessCodes: HarnessTesterInterface["code"] = {
  Severe: PLICodes.Severe,
  Warning: PLICodes.Warning,
  Information: PLICodes.Info,
  Error: PLICodes.Error,
};
