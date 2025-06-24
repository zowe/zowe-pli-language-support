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

import { HarnessTesterInterface } from "../fourslash-harness/harness-interface";

declare global {
  var verify: HarnessTesterInterface["verify"];
  var linker: HarnessTesterInterface["linker"];
  var completion: HarnessTesterInterface["completion"];
  var code: HarnessTesterInterface["code"];
  var constants: HarnessTesterInterface["constants"];
}
