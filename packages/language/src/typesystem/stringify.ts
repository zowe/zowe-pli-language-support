import { Token } from "../parser/tokens";
import { getContainer, NamedElement, SyntaxKind } from "../syntax-tree/ast";
import { formatPliCodeBlock } from "../utils/code-block";
import { CompilationUnit } from "../workspace/compilation-unit";
import {
  AttributeStringifiers,
  AttributeWitnesses,
  DataType,
  TypeDescriptions,
} from "./descriptions";

export function stringifyAttributeWitnesses(
  witnesses: AttributeWitnesses,
): string {
  return witnesses.order
    .filter((a) => typeof witnesses.witnesses[a]?.value !== "undefined")
    .map((a) => {
      const stringify = AttributeStringifiers[a] as (value: any) => string;
      const value = witnesses.witnesses[a]?.value;
      return stringify(value);
    })
    .filter((a) => typeof a !== "undefined")
    .join(" ");
}

function stringifyCompositeType(
  typeProps: TypeDescriptions.Composite,
): [number, string] {
  const memberStrings: string[] = [];
  for (const [member, { level }] of typeProps.membersMetadata) {
    const type = typeProps.members.get(member)!;
    if (TypeDescriptions.isComposite(type)) {
      const [level, nestedStr] = stringifyCompositeType(type);
      memberStrings.push(`${level} ${member.name}${nestedStr}`);
    } else {
      memberStrings.push(`${level} ${member.name} ${type.toString()}`);
    }
  }
  const [level, parentLine] = stringifyCompositeParent(typeProps);
  return [
    level,
    `${parentLine}${memberStrings.map((m) => "\n  " + m.replaceAll(/\n/g, "\n  ")).join("")}`,
  ];
}

function stringifyCompositeParent(
  typeProps: TypeDescriptions.Composite,
): [number, string] {
  const attributeStr = typeProps.toString();
  const unionStr = typeProps.type === DataType.Union ? "UNION" : "";
  return [
    typeProps.level,
    `${unionStr}${unionStr !== "" && attributeStr !== "" ? " " : ""}${attributeStr}`,
  ];
}

export function stringifyTypeDescription(
  nodeName: string,
  typeDescription: TypeDescriptions.Any,
): string | undefined {
  if (TypeDescriptions.isUnknown(typeDescription)) {
    return undefined;
  }

  let str = "";
  if (TypeDescriptions.isComposite(typeDescription)) {
    const [level, compositeStr] = stringifyCompositeType(typeDescription);
    str = `${level} ${nodeName}${compositeStr !== "" ? `${compositeStr.startsWith("\n") ? "" : " "}${compositeStr}` : ""};`;
  } else {
    const level =
      typeDescription.parentType && typeDescription.variableNode
        ? typeDescription.parentType.membersMetadata.get(
            typeDescription.variableNode,
          )?.level
        : undefined;
    const levelStr = level !== undefined ? `${level} ` : "";
    const typeDescriptionStr = typeDescription.toString();
    str = `${levelStr}${nodeName} ${typeDescriptionStr};`;
  }
  while (typeDescription.parentType) {
    typeDescription = typeDescription.parentType;
    const memberNode = typeDescription.variableNode;
    if (memberNode) {
      const [level, parentLine] = stringifyCompositeParent(typeDescription);
      str = `${level} ${memberNode.name}${parentLine !== "" ? " " + parentLine : ""}\n  ${str.replaceAll(/\n/g, "\n  ")}`;
    }
  }
  return formatPliCodeBlock(`DCL ${str.replaceAll(/\n/g, ",\n    ")}`);
}

export function stringifyDeclaration(
  node: NamedElement,
  unit: CompilationUnit,
): string | null {
  if (node.kind === SyntaxKind.DeclaredVariable) {
    let declaredItem = getContainer(node, SyntaxKind.DeclaredItem);
    do {
      const container = getContainer(declaredItem!, SyntaxKind.DeclaredItem);
      if (container) {
        declaredItem = container;
      } else {
        break;
      }
    } while (declaredItem);
    return stringifyStartEndToken(declaredItem, unit);
  } else if (node.kind === SyntaxKind.LabelPrefix) {
    const statement = getContainer(node, SyntaxKind.Statement);
    return stringifyStartEndToken(statement, unit);
  } else {
    return formatPliCodeBlock("...Ordinal value...");
  }
}

function stringifyStartEndToken(
  item: { startToken: Token | null; endToken: Token | null } | null,
  unit: CompilationUnit,
): string | null {
  if (!item || !item.startToken || !item.endToken) {
    return null;
  }
  if (!item.startToken.uri || item.startToken.uri !== item.endToken.uri) {
    return null;
  }
  const doc = unit.services.files.getDocument(item.startToken.uri);
  const text = doc?.getText();
  if (!text) {
    return null;
  }
  const snippet = text.substring(
    item.startToken.startOffset,
    item.endToken.endOffset + 1,
  );
  return formatPliCodeBlock(snippet);
}
