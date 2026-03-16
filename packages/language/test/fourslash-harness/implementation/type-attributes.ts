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
import {
  AccessMode,
  Alignments,
  Assignability,
  Base,
  BufferMode,
  DataType,
  Endianess,
  FileUsage,
  FloatFormat,
  NumberMode,
  PictureWideness,
  Precisions,
  ScaleMode,
  Scopes,
  Sign,
  StorageClass,
  StorageConnection,
  StringFormat,
  StringKind,
  TransmissionDirection,
  Volatility,
} from "../../../src/typesystem/descriptions";
import { HarnessTesterInterface } from "../harness-interface";

export const HarnessTypeAttributes: Omit<
  HarnessTesterInterface["types"],
  "expectTypeAt" | "expectPreprocessorTypeAt"
> = {
  dataTypes: DataType,
  accessModes: AccessMode,
  alignments: Alignments,
  assignabilities: Assignability,
  bases: Base,
  bufferModes: BufferMode,
  connections: StorageConnection,
  endianesses: Endianess,
  fileUsages: FileUsage,
  floatFormats: FloatFormat,
  //TODO locator types
  modes: NumberMode,
  //TODO ordinal names
  pictureWidenesses: PictureWideness,
  precision: Precisions,
  //TODO positions
  scales: ScaleMode,
  scopes: Scopes,
  signs: Sign,
  storageClasses: StorageClass,
  stringFormats: StringFormat,
  stringKinds: StringKind,
  transmissionDirections: TransmissionDirection,
  volatilities: Volatility,
};
