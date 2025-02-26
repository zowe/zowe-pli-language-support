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

import { type Module, inject } from "langium";
import {
  createDefaultModule,
  createDefaultSharedModule,
  PartialLangiumSharedServices,
  type DefaultSharedModuleContext,
  type LangiumServices,
  type LangiumSharedServices,
  type PartialLangiumServices,
} from "langium/lsp";
import {
  Pl1GeneratedModule,
  Pl1GeneratedSharedModule,
} from "./generated/module.js";
import {
  Pl1Validator,
  registerValidationChecks,
} from "./validation/pli-validator.js";
import { Pl1Lexer } from "./parser/pli-lexer.js";
import { PliTokenBuilder } from "./parser/pli-token-builder.js";
import { PliScopeComputation } from "./references/pli-scope-computation.js";
import { PliDocumentValidator } from "./validation/pli-document-validator.js";
import { PliSemanticTokenProvider } from "./lsp/pli-semantic-highlighting.js";
import { PliNameProvider } from "./references/pli-name-provider.js";
import { PliReferences } from "./references/pli-references.js";
import { PliScopeProvider } from "./references/pli-scope-provider.js";
import { PliNodeKindProvider } from "./lsp/pli-node-kind-provider.js";
import { PliDocumentationProvider } from "./documentation.ts/pli-documentation-provider.js";
import { PliCompletionProvider } from "./lsp/pli-completion-provider.js";
import { PliIndexManager } from "./workspace/pli-index-manager.js";
import { PliWorkspaceManager } from "./workspace/pli-workspace-manager.js";
import { MarginsProcessor, PliMarginsProcessor } from './parser/pli-margins-processor.js';
import { PliPreprocessorLexer } from "./parser/pli-preprocessor-lexer.js";
import { PliPreprocessorParser } from "./parser/pli-preprocessor-parser.js";
import { PliSmartTokenPickerOptimizer, TokenPickerOptimizer } from "./parser/pli-token-picker-optimizer.js";
import { PliPreprocessorInterpreter } from "./parser/pli-preprocessor-interpreter.js";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type Pl1AddedServices = {
    validation: {
        Pl1Validator: Pl1Validator
    },
    parser: {
        MarginsProcessor: MarginsProcessor;
        TokenPickerOptimizer: TokenPickerOptimizer;
        PreprocessorLexer: PliPreprocessorLexer;
        PreprocessorParser: PliPreprocessorParser;
        PreprocessorInterpreter: PliPreprocessorInterpreter;
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type Pl1Services = LangiumServices & Pl1AddedServices;

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const PliModule: Module<
  Pl1Services,
  PartialLangiumServices & Pl1AddedServices
> = {
  documentation: {
    DocumentationProvider: (services) => new PliDocumentationProvider(services),
  },
  validation: {
    Pl1Validator: () => new Pl1Validator(),
    DocumentValidator: (services) => new PliDocumentValidator(services),
  },
  parser: {
    MarginsProcessor: () => new PliMarginsProcessor(),
    TokenPickerOptimizer: () => new PliSmartTokenPickerOptimizer(),
    PreprocessorLexer: (services) => new PliPreprocessorLexer(services),
    PreprocessorParser: () => new PliPreprocessorParser(),
    PreprocessorInterpreter: () => new PliPreprocessorInterpreter(),
    Lexer: (services) => new Pl1Lexer(services),
    TokenBuilder: () => new PliTokenBuilder(),
  },
  references: {
    ScopeComputation: (services) => new PliScopeComputation(services),
    NameProvider: () => new PliNameProvider(),
    References: (services) => new PliReferences(services),
    ScopeProvider: (services) => new PliScopeProvider(services),
  },
  lsp: {
    SemanticTokenProvider: (services) => new PliSemanticTokenProvider(services),
    CompletionProvider: (services) => new PliCompletionProvider(services),
  },
};

export const PliSharedModule: Module<
  LangiumSharedServices,
  PartialLangiumSharedServices
> = {
  lsp: {
    NodeKindProvider: () => new PliNodeKindProvider(),
  },
  workspace: {
    IndexManager: (services) => new PliIndexManager(services),
    WorkspaceManager: (services) => new PliWorkspaceManager(services),
  },
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createPliServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  pli: Pl1Services;
} {
  const shared = inject(
    createDefaultSharedModule(context),
    Pl1GeneratedSharedModule,
    PliSharedModule,
  );
  const pli = inject(
    createDefaultModule({ shared }),
    Pl1GeneratedModule,
    PliModule,
  );
  shared.ServiceRegistry.register(pli);
  registerValidationChecks(pli);
  if (!context.connection) {
    // We don't run inside a language server
    // Therefore, initialize the configuration provider instantly
    shared.workspace.ConfigurationProvider.initialized({});
  }
  return { shared, pli };
}
