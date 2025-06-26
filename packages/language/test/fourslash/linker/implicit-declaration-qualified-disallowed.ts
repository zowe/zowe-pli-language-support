/// <reference path="../framework.ts" />

// @wrap: main
//// <|1:A|>.<|2:B|> = 1;

verify.expectExclusiveDiagnosticsAt("1", {
  severity: constants.Severity.E,
  message: "Unknown identifier 'A'",
});

verify.expectExclusiveDiagnosticsAt("2", {
  severity: constants.Severity.E,
  message: "Unknown identifier 'B'",
});
