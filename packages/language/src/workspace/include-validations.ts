import { Severity, diagnostic } from "../language-server/types";
import { IncludeDirective, SyntaxKind, IncludeItem } from "../syntax-tree/ast";
import { traverseAllNodes } from "../syntax-tree/ast-iterator";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { CompilationUnit } from "./compilation-unit";

export function extractIncludeDirectives(compilationUnit: CompilationUnit) {
  const directives: IncludeDirective[] = [];
  traverseAllNodes(compilationUnit.preprocessorAst, (node) => {
    if (node.kind === SyntaxKind.IncludeDirective) {
      directives.push(node as IncludeDirective);
    }
  });
  return directives;
}
const SeverityToString: Record<Severity, string> = {
  [Severity.S]: "severe errors",
  [Severity.E]: "errors",
  [Severity.W]: "warnings",
  [Severity.I]: "informational messages",
  [Severity.U]: "user-defined severity messages",
};
type Include = {
  includingUri: string;
  includeUri: string;
  item: IncludeItem;
};

export function markErroneousIncludes(
  compilationUnit: CompilationUnit,
  includes: IncludeDirective[],
) {
  const { includedMap } = organizeIncludes(includes);
  const { severitiesByUri, addSeverity } =
    organizeSeveritiesByUri(compilationUnit);
  const handledIncludingFiles = assignSeveritiesToUri(
    severitiesByUri,
    includedMap,
    addSeverity,
  );
  renderErrorsOnIncludeItems(handledIncludingFiles, compilationUnit);
}

function renderErrorsOnIncludeItems(
  handledIncludingFiles: Map<IncludeItem, Severity>,
  compilationUnit: CompilationUnit,
) {
  for (const [item, severity] of handledIncludingFiles.entries()) {
    const message = `Included file '${item.relativeFilePath}' contains ${SeverityToString[severity]}.`;
    compilationUnit.diagnostics.add(
      DiagnosticCategory.Validation,
      diagnostic(severity, message, item.token),
    );
  }
}

function assignSeveritiesToUri(
  severitiesByUri: Map<string, Severity>,
  includedMap: Map<string, Include[]>,
  addSeverity: (uri: string, severity: Severity) => void,
) {
  const queue = [...severitiesByUri.keys()];
  const handledIncludingFiles: Map<IncludeItem, Severity> = new Map();
  while (queue.length > 0) {
    const uri = queue.pop()!;
    const severity = severitiesByUri.get(uri)!;
    if (!includedMap.has(uri)) {
      continue;
    }
    const includeds = includedMap.get(uri)!;
    for (const { item } of includeds) {
      const parentUri = item.token?.uri?.toString();
      if (parentUri) {
        handledIncludingFiles.set(item, severity);
        addSeverity(parentUri, severity);
        queue.push(parentUri);
      }
    }
  }
  return handledIncludingFiles;
}
function organizeSeveritiesByUri(compilationUnit: CompilationUnit) {
  const severitiesByUri = new Map<string, Severity>();
  function addSeverity(uri: string, severity: Severity) {
    if (!severitiesByUri.has(uri)) {
      severitiesByUri.set(uri, severity);
    } else {
      severitiesByUri.set(
        uri,
        Math.max(severitiesByUri.get(uri)!, severity) as Severity,
      );
    }
  }
  for (const diagnostic of compilationUnit.diagnostics.getAll()) {
    if (!diagnostic.uri) continue;
    addSeverity(diagnostic.uri, diagnostic.severity);
  }
  return { severitiesByUri, addSeverity };
}
function organizeIncludes(includes: IncludeDirective[]) {
  const includedMap = new Map<string, Include[]>();
  for (const include of includes) {
    const parentUri = include.token?.uri?.toString();
    for (const item of include.items) {
      const includeUri = item.filePath;
      if (parentUri && includeUri) {
        const includeRecord = { includingUri: parentUri, includeUri, item };
        if (!includedMap.has(includeUri)) {
          includedMap.set(includeUri, []);
        }
        includedMap.get(includeUri)!.push(includeRecord);
      }
    }
  }
  return { includedMap };
}
