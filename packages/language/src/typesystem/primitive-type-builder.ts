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

import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import { Token } from "../parser/tokens";
import { assertType } from "../preprocessor/util";
import { DeclaredVariable, NamedElement } from "../syntax-tree/ast";
import { PLICodes } from "../validation/pli-codes";
import { CompilationUnit } from "../workspace/compilation-unit";
import { AttributeCollectorResult } from "./attribute-witnesses";
import {
  DataType,
  TypeDescriptions,
  AttributeKind,
  AttributeWitnesses,
} from "./descriptions";



type BuiltType = {
  type: TypeDescriptions.Any | undefined;
  diagnostics: Diagnostic[];
};

export interface PrimitiveTypeBuilder {
  build(): BuiltType;
}

export class DefaultPrimitiveTypeBuilder implements PrimitiveTypeBuilder {
  private attributeWitnesses: AttributeWitnesses;
  private possibleDataTypes: Set<DataType>;
  private diagnostics: Diagnostic[] = [];
  constructor(private elementName: Token, collected: AttributeCollectorResult, private unit: CompilationUnit) {
    this.attributeWitnesses = collected.witnesses;
    this.possibleDataTypes = collected.dataTypeGuess;
    this.diagnostics = collected.diagnostics;
  }

  build() {
    const namedElement = this.attributeWitnesses.witnesses[AttributeKind.SetType];
    if (namedElement && namedElement.value) {
      const typeNode = this.unit.services.inferer.inferType(
        namedElement.value,
        this.unit,
      );
      return {
        type: typeNode,
        diagnostics: this.diagnostics,
      };
    }
    const locatorCall = this.attributeWitnesses.witnesses[AttributeKind.SetLike];
    if (locatorCall && locatorCall.value) {
      if (
        !locatorCall.value.element ||
        !locatorCall.value.element.element ||
        !locatorCall.value.element.element.ref ||
        !locatorCall.value.element.element.ref.node
      ) {
        this.diagnostics.push(
          diagnosticFromCode(PLICodes.Warning.IBM3330I, this.elementName),
        );
        return {
          type: TypeDescriptions.Unknown(),
          diagnostics: this.diagnostics,
        };
      }
      const typeNode = this.unit.services.inferer.inferType(
        locatorCall.value.element!.element!.ref!.node!,
        this.unit,
      );
      if (
        !TypeDescriptions.isComposite(typeNode)
      ) {
        this.diagnostics.push(
          diagnosticFromCode(PLICodes.Severe.IBM1650I, this.elementName),
        );
        return {
          type: TypeDescriptions.Unknown(),
          diagnostics: this.diagnostics,
        };
      } else {
        return {
          type: this.cloneTypeUsingDifferentVariable(typeNode, this.elementName.element as DeclaredVariable, 1),
          diagnostics: this.diagnostics,          
        };
      }
    }
    if (this.possibleDataTypes.size !== 1) {
      // TODO: Reenable once we ensure that we don't show any false positives
      // if (this.elementName) {
      //   this.diagnostics.push(
      //     diagnosticFromCode(
      //       Error.IBM1482I,
      //       this.elementName,
      //       this.elementName.image,
      //     ),
      //   );
      // }
      return {
        type: TypeDescriptions.Unknown(),
        diagnostics: this.diagnostics,
      };
    }
    let dataType = Array.from(this.possibleDataTypes)[0];
    assertType<Exclude<DataType, DataType.Structure | DataType.Union>>(
      dataType,
    );
    return {
      type: TypeDescriptions.createPrimitive(dataType, this.attributeWitnesses),
      diagnostics: this.diagnostics,
    };
  }
  cloneTypeUsingDifferentVariable(type: TypeDescriptions.Any, variable: DeclaredVariable, level: number, parentType?: TypeDescriptions.Composite): TypeDescriptions.Any {
    if(TypeDescriptions.isComposite(type)) {
      const newComposite = {
        ...type,
        //TODO handle deletion of other attributes only for a root element
        dimension: undefined,
        //</TODO>
        level,
        parentType,
        variableNode: variable,
      } as TypeDescriptions.Composite;
      newComposite.members = new Map([...type.members.entries()].map(([name, member]) => [
        name,
        this.cloneTypeUsingDifferentVariable(member, name, level+1, newComposite),
      ] as const));
      newComposite.membersMetadata = new Map([...type.membersMetadata.entries()].map(([name, metadata]) => [
        name,
        {
          ...metadata,
          level: level + 1,
        },
      ] as const));
      return newComposite;
    } else {
      return {
        ...type,
        variableNode: variable,
        parentType,
      } as Exclude<TypeDescriptions.Any, TypeDescriptions.Composite>;
    }
  }
}
