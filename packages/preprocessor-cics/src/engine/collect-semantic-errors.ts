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
import { ParserRuleContext, ParseTree } from "antlr4ng";
import { CICSParserVisitor } from "../generated/CICSParserVisitor";
import {
  CICSCheckUtilityParameters,
  CICSLiteralCheckOption,
} from "../checks/base";
import { OptionsRegistry } from "../checks/options-registry";
import { Diagnostic } from "preprocessor-api";

export class CollectingSemanticErrorVisitor extends CICSParserVisitor<
  ParseTree[] | null
> {
  private readonly optionsRegistry: OptionsRegistry;
  private readonly cicsOptionsCheckUtilityParams: CICSCheckUtilityParameters;
  public readonly errors: Diagnostic[] = [];

  constructor() {
    super();
    this.cicsOptionsCheckUtilityParams = this.getCheckParams();
    this.optionsRegistry = new OptionsRegistry(
      this.errors,
      this.cicsOptionsCheckUtilityParams,
    );
  }

  /**
   * Traverses children of the parse tree.
   *
   * <p>Inspects CICS Rules to make sure mandatory options exist since the Parser Rules only enforce
   * if any combination of possible inputs exist. Also checks for Invalid options given the other
   * provided optionals and checks for duplicates.
   *
   * @param node the node under inspection
   * @return List of children nodes
   */
  override visitChildren(node: ParseTree) {
    if (node.parent != null && node instanceof ParserRuleContext) {
      this.optionsRegistry.checkOptions(node);
    }
    return super.visitChildren(node);
  }

  override defaultResult() {
    return [];
  }

  override aggregateResult(aggregate: ParseTree[], nextResult: ParseTree[]) {
    return [...aggregate, ...nextResult];
  }

  private getCheckParams(): CICSCheckUtilityParameters {
    const cicsCheckUtilityParameters = new CICSCheckUtilityParameters();
    cicsCheckUtilityParameters.spEnabled = true;
    cicsCheckUtilityParameters.literalChecks = CICSLiteralCheckOption.IGNORE;
    return cicsCheckUtilityParameters;
  }
}
