import { IBM3323I_IBM3324I_check_argument_count } from "./compiler/IBM3323I-IBM3324I-check-argument-count";
import { IBM3970IS_IBM3971IS_check_pp_call_procedure } from "./compiler/IBM3970-IBM3971-call-procedure";
import { MACRO_Deprecate } from "./macro/deprecate";
import { MACRO_NamePrefix } from "./macro/nameprefix";
import { MACRO_Case } from "./macro/case";
import { ValidationChecks } from "./validator";

export function registerPreprocessorValidationChecks(): ValidationChecks {
  return {
    CallStatement: [
      IBM3323I_IBM3324I_check_argument_count,
      IBM3970IS_IBM3971IS_check_pp_call_procedure,
    ],
    DeclaredVariable: [MACRO_NamePrefix],
    Program: [MACRO_Case],
    ProcedureStatement: [MACRO_Deprecate, MACRO_NamePrefix],
  };
}
