import {
  AccessModes,
  Alignments,
  Assignabilities,
  Bases,
  BufferModes,
  DataTypes,
  Endianesses,
  FileUsages,
  FloatFormats,
  NumberModes,
  NumberScales,
  PictureWidenesses,
  Precisions,
  Scopes,
  Signs,
  StorageClasses,
  StorageConnections,
  StringFormats,
  StringKinds,
  Volatilities,
} from "../../../src/typesystem/descriptions";
import { HarnessTesterInterface } from "../harness-interface";

export const HarnessTypeAttributes: Omit<
  HarnessTesterInterface["types"],
  "expectTypeAt"
> = {
  dataTypes: DataTypes,
  accessModes: AccessModes,
  alignments: Alignments,
  assignabilities: Assignabilities,
  bases: Bases,
  bufferModes: BufferModes,
  connections: StorageConnections,
  endianesses: Endianesses,
  fileUsages: FileUsages,
  floatFormats: FloatFormats,
  //TODO locator types
  modes: NumberModes,
  //TODO ordinal names
  pictureWidenesses: PictureWidenesses,
  precision: Precisions,
  //TODO positions
  scales: NumberScales,
  scopes: Scopes,
  signs: Signs,
  storageClasses: StorageClasses,
  stringFormats: StringFormats,
  stringKinds: StringKinds,
  volatilities: Volatilities,
};
