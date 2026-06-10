/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */
import { describe, expect, test } from "vitest";
import { EnglishMessageService } from "../engine/message-service";

describe("Message service", async () => {
  const messageService = new EnglishMessageService();

  test("Syntax error message", async () => {
    const actual = messageService.getMessage(
      "ErrorStrategy.reportMissingToken",
      "token",
      "main.pli",
    );
    expect(actual).toBe("Missing token token at main.pli");
  });

  test("End of file error message", async () => {
    const actual = messageService.getMessage("ErrorStrategy.endOfFile");
    expect(actual).toBe("Unexpected end of file");
  });

  test("Identical program message", async () => {
    const actual = messageService.getMessage(
      "ErrorStrategy.reportInputMismatch",
      "input",
    );
    expect(actual).toBe("Syntax error on input");
  });
});
