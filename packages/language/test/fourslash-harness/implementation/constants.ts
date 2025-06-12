import {
  StatementStartCompletionKeywords,
  StatementStartPreprocessorCompletionKeywords,
} from "../../../src/language-server/completion/keywords";
import { HarnessTesterInterface } from "../harness-interface";

export const HarnessConstants: HarnessTesterInterface["constants"] = {
  CompletionKeywords: StatementStartCompletionKeywords,
  PreprocessorCompletionKeywords: StatementStartPreprocessorCompletionKeywords,
};
