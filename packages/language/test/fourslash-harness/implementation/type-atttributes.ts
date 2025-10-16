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
  Volatility,
} from "../../../src/typesystem/descriptions";
import { HarnessTesterInterface } from "../harness-interface";

export const HarnessTypeAttributes: Omit<
  HarnessTesterInterface["types"],
  "expectTypeAt"
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
  volatilities: Volatility,
};
