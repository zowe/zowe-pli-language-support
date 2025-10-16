import { CompilationUnit } from "../workspace/compilation-unit";
import { PliValidator } from "./pli-validator";
import { Validator } from "./validator";

export function registerPreprocessorValidationChecks(
  unit: CompilationUnit,
): Validator {
  const validator = new PliValidator();
  validator.addHandler({
    CallStatement: [
      validator.checkArgumentCount,
      validator.checkPreprocessorCallProcedure,
    ],
  });
  return validator;
}
