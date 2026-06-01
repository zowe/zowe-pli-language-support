#!/usr/bin/env npx tsx
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

import fs from "fs";
import { EOL } from "os";

// This script reads the JSON schema files for pgm_conf and proc_grps, extracts the relevant parts,
// and injects them into the package.json configuration contribution for the VS Code extension.
// That way, we only have to maintain the schema files, and the package.json will be automatically updated.

const packageJsonText = fs.readFileSync(
  "./packages/vscode-extension/package.json",
  "utf8",
);
const packageJson = JSON.parse(packageJsonText);

const pgmConfText = fs.readFileSync(
  "./packages/vscode-extension/schemas/pgm_conf.schema.json",
  "utf8",
);
let pgmConf = JSON.parse(pgmConfText);

const procGrpsText = fs.readFileSync(
  "./packages/vscode-extension/schemas/proc_grps.schema.json",
  "utf8",
);
let procGrps = JSON.parse(procGrpsText);

// Override the description with the title, and remove unnecessary properties
pgmConf = {
  description: pgmConf.title,
  ...pgmConf,
};
delete pgmConf.title;
delete pgmConf.$schema;
procGrps = {
  description: procGrps.title,
  ...procGrps,
};
delete procGrps.title;
delete procGrps.$schema;

packageJson.contributes.configuration.properties["pli.pgm_conf"] = pgmConf;
packageJson.contributes.configuration.properties["pli.proc_grps"] = procGrps;

const outputText = JSON.stringify(packageJson, null, 2) + EOL;

fs.writeFileSync(
  "./packages/vscode-extension/package.json",
  outputText,
  "utf8",
);
