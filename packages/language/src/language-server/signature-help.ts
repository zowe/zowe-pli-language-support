import { URI } from "vscode-uri";
import type { SignatureHelp } from 'vscode-languageserver';
import { CompilationUnit } from "../workspace/compilation-unit";
import { binaryTokenSearch } from "../utils/search";

export function signatureHelp(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): SignatureHelp | null {
  const tokens = unit.services.files.getTokens(uri);
  if(!tokens) {
    return null;
  }
  const token = binaryTokenSearch(tokens, offset);
  if(!token) {
    return null;
  }
  return null;
}