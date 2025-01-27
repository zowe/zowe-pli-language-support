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
  AstUtils,
  DefaultScopeProvider,
  DocumentCache,
  EMPTY_SCOPE,
  MapScope,
  ReferenceInfo,
  Scope,
  URI,
  UriUtils,
} from "langium";
import {
  DeclaredVariable,
  IncludeDirective,
  isDeclaredVariable,
  isIncludeDirective,
  isMemberCall,
} from "../generated/ast";
import { LangiumServices } from "langium/lsp";

export class PliScopeProvider extends DefaultScopeProvider {
  protected readonly globalDocumentScopeCache: DocumentCache<string, Scope>;

  constructor(services: LangiumServices) {
    super(services);
    this.globalDocumentScopeCache = new DocumentCache<string, Scope>(
      services.shared,
    );
  }

  protected override getGlobalScope(
    referenceType: string,
    context: ReferenceInfo,
  ): Scope {
    return this.globalDocumentScopeCache.get(
      AstUtils.getDocument(context.container).uri,
      referenceType,
      () => {
        const allIncludes = AstUtils.streamAst(
          AstUtils.getDocument(context.container).parseResult.value,
        ).filter(isIncludeDirective);
        const allFiles = this.getUrisFromIncludes(
          AstUtils.getDocument(context.container).uri,
          allIncludes.toArray(),
        );
        return new MapScope(
          this.indexManager.allElements(referenceType, allFiles),
        );
      },
    );
  }

  private getUrisFromIncludes(
    relative: URI,
    includes: IncludeDirective[],
  ): Set<string> {
    const uris = new Set<string>();
    uris.add(relative.toString());
    const dirname = UriUtils.dirname(relative);
    for (const include of includes) {
      for (const file of include.items) {
        const uri = UriUtils.joinPath(
          dirname,
          file.file.substring(1, file.file.length - 1),
        );
        uris.add(uri.toString());
      }
    }
    // Always add the builtins
    uris.add("pli-builtin:/builtins.pli");
    return uris;
  }

  override getScope(context: ReferenceInfo): Scope {
    if (context.property === "ref") {
      const memberCall = AstUtils.getContainerOfType(
        context.container,
        isMemberCall,
      );
      if (memberCall?.previous) {
        const previouslyReferenced = memberCall.previous.element.ref.ref;
        if (previouslyReferenced && isDeclaredVariable(previouslyReferenced)) {
          return this.createScopeForNodes(
            this.findChildren(previouslyReferenced),
          );
        } else {
          return EMPTY_SCOPE;
        }
      }
    }
    return super.getScope(context);
  }

  private findChildren(declared: DeclaredVariable): DeclaredVariable[] {
    const declaredItem = declared.$container;
    let level = Number(declaredItem.level);
    if (isNaN(level) || level < 1) {
      level = 1;
    }
    const result: DeclaredVariable[] = [];
    const container = declaredItem.$container;
    const index = container.items.indexOf(declaredItem);
    for (let i = index + 1; i < container.items.length; i++) {
      const item = container.items[i];
      const childLevel = Number(item.level);
      if (isNaN(childLevel) || childLevel < level) {
        break;
      }
      if (childLevel === level + 1) {
        if (isDeclaredVariable(item.element)) {
          result.push(item.element);
        }
      }
    }
    return result;
  }
}
