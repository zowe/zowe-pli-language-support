import { HarnessTesterInterface } from "../harness-interface";
import { CompletionKeywords } from "../../../src/language-server/completion/keywords";
import { Severity } from "../../../src/language-server/types";

export const HarnessConstants: HarnessTesterInterface["constants"] = {
  CompletionKeywords,
  Severity,
};
