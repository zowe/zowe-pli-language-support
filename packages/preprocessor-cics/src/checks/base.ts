import { Diagnostic, Severity, WithRange } from "preprocessor-api";
import { CICSLexer } from "../generated/CICSLexer";
import {
  Cics_browse_start_endContext,
  Cics_data_areaContext,
  Cics_data_valueContext,
  Cics_handle_responseContext,
  Cics_nameContext,
  CICSParser,
} from "../generated/CICSParser";
import { ParserRuleContext, ParseTree, TerminalNode } from "antlr4ng";
import { VisitorUtility } from "./utils";

export enum CICSLiteralCheckOption {
  IGNORE,
  APOST,
  QUOTE,
}

export class CICSCheckUtilityParameters {
  public noLengthEnabled: boolean = false;
  public spEnabled: boolean = false;
  public exciEnabled: boolean = false;
  public literalChecks: CICSLiteralCheckOption = CICSLiteralCheckOption.APOST;
}

export abstract class CICSOptionsCheckerBase {
  //private context: DialectProcessingContext;

  private readonly errors: Diagnostic[] = [];

  private readonly baseDuplicateOptions: Map<number, Severity> = new Map<
    number,
    Severity
  >([
    [CICSLexer.ASIS, Severity.Warning],
    [CICSLexer.BUFFER, Severity.Warning],
    [CICSLexer.LEAVEKB, Severity.Warning],
    [CICSLexer.NOTRUNCATE, Severity.Warning],
    [CICSLexer.NOQUEUE, Severity.Warning],
    // handle response options
    [CICSLexer.RESP, Severity.Error],
    [CICSLexer.RESP2, Severity.Error],
    [CICSLexer.WAIT, Severity.Error],
    [CICSLexer.NOHANDLE, Severity.Error],
  ]);

  private readonly baseDuplicateRulesOptions: Map<number, string> = new Map<
    number,
    string
  >([[CICSParser.RULE_cics_into, "INTO or SET"]]);
  private utilityParameters = new CICSCheckUtilityParameters();

  constructor(
    //context: DialectProcessingContext,
    errors: Diagnostic[],
    duplicateOptions: Map<number, Severity>,
    utilityParameters: CICSCheckUtilityParameters,
  ) {
    //this.context = context;
    this.errors = errors;
    duplicateOptions.forEach((value, key) =>
      this.baseDuplicateOptions.set(key, value),
    );
    this.utilityParameters = utilityParameters;
  }

  /**
   * General entrypoint to check CICS rule options
   *
   * @param ctx ParserRuleContext subclass containging options
   * @param <E> A subclass of ParserRuleContext
   */
  abstract checkOptions<E extends ParserRuleContext>(ctx: E): void;

  protected throwException(
    errorSeverity: Severity,
    range: WithRange,
    msg: string,
    wrongToken: string,
  ): void {
    const error: Diagnostic = {
      ...range,
      severity: errorSeverity,
      message: msg + wrongToken,
      code: "cics.invalid.options",
    };
    this.errors.push(error);
  }

  /**
   * Helper method to collect analysis errors if the rule context does not contain mandatory options
   *
   * @param rules Generic list of rules to check. Will either be a collection of ParserRuleContext
   *     or TerminalNode
   * @param ctx Context to extrapolate locality against
   * @param options Options checked to insert into error message
   * @return true if mandatory option found
   */
  protected checkHasMandatoryOptions(
    rules: any[],
    ctx: ParserRuleContext,
    options: string,
  ): boolean {
    if (rules.length === 0) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Missing required option: ",
        options,
      );
      return false;
    }
    return true;
  }

  /**
   * @param requiredContext - The rule that is required
   * @param optionalContext - The rule that is optional
   * @param ctx - The overall context.
   * @param options - String of the element that is required.
   */
  protected checkPrerequisiteIsMet(
    requiredContext: any[],
    optionalContext: any[],
    ctx: ParserRuleContext,
    options: string,
  ) {
    this.checkPrerequisiteIsMetPrivate(
      this.isNodePresent(requiredContext),
      this.isNodePresent(optionalContext),
      ctx,
      options,
    );
  }

  private checkPrerequisiteIsMetPrivate(
    isRequiredContextPresent: boolean,
    isOptionalContextPresent: boolean,
    ctx: ParserRuleContext,
    options: string,
  ) {
    if (!isRequiredContextPresent && isOptionalContextPresent) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Missing required option for: ",
        options,
      );
    }
  }

  private isNodePresent(node: any | Array<any>): boolean {
    if (node == null) {
      return false;
    }
    if (Array.isArray(node)) {
      return node.length > 0 && node.some((e) => e != null);
    }
    return true;
  }

  /**
   * Helper method to collect analysis errors if the rule context contains illegal options
   *
   * @param rules Generic list of rules to check. Will either be a collection of ParserRuleContext
   *     or TerminalNode
   * @param options Options checked to insert into error message
   */
  protected checkHasIllegalOptions<E extends ParserRuleContext | TerminalNode>(
    rules: E | Array<E> | null,
    options: string,
  ): void {
    const throwError = (error: E) => {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(error),
        "Invalid option provided: ",
        options,
      );
    };
    if (Array.isArray(rules)) {
      rules.forEach((rule) => throwError(rule));
    } else if (rules != null) {
      throwError(rules);
    }
  }

  /**
   * Helper function to check and see if more than one rule was visited out of a set provided.
   *
   * @param options Options checked to insert into error message
   * @param rules Generic list of rules to check. Will be a collection of ParserRuleContext and/or
   *     TerminalNode objects.
   * @param <E> Generic type to allow cross-rule context collection.
   */
  protected checkMutuallyExclusiveOptions<
    E extends ParserRuleContext | TerminalNode,
  >(options: string, ...rules: Array<E | E[] | null>): void {
    if (rules.length <= 1) {
      return;
    }

    let rulesSeen = 0;

    for (const rule of rules) {
      if (rule == null) {
        continue;
      }

      let target: E;
      if (rule instanceof ParserRuleContext || rule instanceof TerminalNode) {
        rulesSeen++;
        target = rule as E;
      } else if (Array.isArray(rule)) {
        if (rule.length === 0) {
          continue;
        }
        rulesSeen++;
        target = rule[0];
      } else {
        continue;
      }

      if (rulesSeen > 1) {
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(target),
          'Options "' + options + '" are mutually exclusive.',
          "",
        );
        break;
      }
    }
  }

  /**
   * Helper method to collect analysis errors if the rule context contains obsolete options
   *
   * @param rule TerminalNode to check.
   * @param options Options checked to insert into error message
   */
  protected checkHasObsoleteOptions(
    rule: TerminalNode[],
    ctx: ParserRuleContext,
    options: string,
  ): void {
    if (rule.length > 0) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Obsolete option provided: ",
        options,
      );
    }
  }

  /**
   * Helper function to check and see if more than one rule was visited out of a set provided.
   *
   * @param options Options checked to insert into error message
   * @param rules Generic list of rules to check. Will be a collection of ParserRuleContext and/or
   *     TerminalNode objects.
   * @param <E> Generic type to allow cross-rule context collection.
   */
  protected checkHasAtLeastOneOption<
    E extends ParserRuleContext | TerminalNode,
  >(options: string, ctx: ParserRuleContext, ...rules: Array<E | E[] | null>): void {
    let rulesSeen = 0;

    for (const rule of rules) {
      if (rule == null) {
        continue;
      }
      if (Array.isArray(rule) && rule.length === 0) {
        continue;
      }
      rulesSeen++;
    }

    if (rulesSeen < 1) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Must include one or more of the following: ",
        options,
      );
    }
  }

  /**
   * Iterates over the provided response handlers, extracts what is provided, and validates there is
   * not RESP2 without RESP
   *
   * @param ruleHandlers Response handlers from parser rule
   */
  protected checkResponseHandlers(
    ruleHandlers: Cics_handle_responseContext,
  ): void {
    let respFound = false;
    let respTwoResponseHandlers: TerminalNode[] = [];
    if (ruleHandlers.cics_inline_handle_exception() != null) {
      let rules = ruleHandlers.cics_inline_handle_exception().cics_resp();
      for (let rule of rules) {
        if (rule.RESP() != null) respFound = true;
        if (rule.RESP2() != null) respTwoResponseHandlers.push(rule.RESP2()!);
      }
    }
    if (!respFound) {
      this.checkHasIllegalOptions(respTwoResponseHandlers, "RESP2");
    }
  }

  protected getAllTokenChildren(
    ctx: ParserRuleContext,
    children: TerminalNode[],
    validateResponseHandler: boolean,
  ): void {
    if (ctx.children == null) return;
    ctx.children.forEach((child) => {
      if (
        child instanceof TerminalNode &&
        this.baseDuplicateOptions.has(child.getSymbol().type)
      ) {
        children.push(child);
      } else if (child instanceof ParserRuleContext) {
        if (
          validateResponseHandler &&
          child.constructor.name === "Cics_handle_responseContext"
        ) {
          this.checkResponseHandlers(child as Cics_handle_responseContext);
          if (
            !(child instanceof Cics_data_areaContext) &&
            !(child instanceof Cics_nameContext) &&
            !(child instanceof Cics_data_valueContext)
          ) {
            this.getAllTokenChildren(child, children, validateResponseHandler);
          }
        }
      }
    });
  }

  /**
   * Checks context passed as parameter for duplicate options by traversing the Parse Tree. Also
   * iterates over the response handler by calling checkResponseHandler(), if the
   * Cics_handle_response context is found, to ensure there is not a RESP2 option provided without a
   * RESP option
   *
   * @param ctx ParserRuleContext To evaluate
   * @param duplicateOptions Custom duplicate options to evaluate against
   */
  private checkDuplicateEntries(
    ctx: ParserRuleContext,
    entries: Set<number>,
    duplicateOptions: Map<number, Severity>,
  ): void {
    let children: TerminalNode[] = [];
    this.getAllTokenChildren(ctx, children, true);
    children.forEach((child) => {
      let option = child.getSymbol().type;
      if (duplicateOptions.has(option)) {
        if (entries.has(option)) {
          this.throwException(
            duplicateOptions.get(option)!,
            VisitorUtility.constructLocality(child),
            "Excessive options provided for: ",
            child.getSymbol().text!,
          );
        } else {
          entries.add(option);
        }
      }
    });
  }

  private processDuplicateRules(
    ctx: ParserRuleContext,
    subruleOptions: Map<number, string>,
  ): void {
    let seenRules: Set<number> = new Set();
    for (let child of ctx.getRuleContexts(ParserRuleContext)) {
      let ruleId = child.ruleIndex;
      let name = subruleOptions.get(ruleId);
      if (name == null) continue;
      if (seenRules.add(ruleId)) continue;
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(child),
        'Options "' +
          name +
          '" cannot be used more than once in a given command.',
        "",
      );
    }
  }

  /**
   * Additional check duplicates method that can utilize custom duplicate error severity options not
   * used for the whole command set
   *
   * @param ctx ParserRuleContext To evaluate
   * @param customDuplicateOptions Custom duplicate options to evaluate against
   */
  protected checkDuplicates(
    ctx: ParserRuleContext,
    customDuplicateOptions?: Map<number, Severity>,
    customDuplicateRuleOptions?: Map<number, string>,
  ): void {
    // Check for duplicate options
    const foundEntries = new Set<number>();
    const updatedDuplicateOptions = new Map<number, Severity>(
      this.baseDuplicateOptions,
    );
    if (customDuplicateOptions != null) {
      customDuplicateOptions.forEach((value, key) => {
        updatedDuplicateOptions.set(key, value);
      });
    }
    this.checkDuplicateEntries(ctx, foundEntries, updatedDuplicateOptions);

    // Check for duplicate rules
    const updatedRuleOptions = new Map<number, string>(
      this.baseDuplicateRulesOptions,
    );
    if (customDuplicateRuleOptions != null) {
      customDuplicateRuleOptions.forEach((value, key) => {
        updatedRuleOptions.set(key, value);
      });
    }
    this.processDuplicateRules(ctx, updatedRuleOptions);
  }

  /**
   * Flags errors for rule lists passed as parameters if there are multiple instances of mutually
   * exclusive options.
   *
   * @param options Options checked to insert into error message
   * @param rules Lists of TerminalNode to iterate through
   * @return Number of TerminalNode instances found
   */
  protected checkHasMutuallyExclusiveOptions(
    options: string,
    ...rules: TerminalNode[][]
  ): number {
    const nodes: TerminalNode[] = rules
      .filter((ls) => ls != null && ls.length > 0)
      .flatMap((ls) => ls);

    // Only raise error if this validates mutual exclusivity and is not an artifact of duplicate
    // options
    if (!nodes.every((e) => e.getSymbol().type === nodes[0].getSymbol().type)) {
      nodes.forEach((node) => {
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(node),
          "Exactly one option required, options are mutually exclusive: ",
          options,
        );
      });
    }
    return nodes.length;
  }

  /**
   * Checks whether list of options is either empty or contains all options
   *
   * @param options Options checked to insert into error message
   * @param ctx ParserRuleContext
   * @param rules Lists of rules to iterate through
   */
  protected checkAllOptionsArePresentOrAbsent<E extends ParseTree>(
    options: string,
    ctx: ParserRuleContext,
    ...rules: Array<E> | Array<Array<E>>
  ): void {
    const noOptions = rules.every(
      (rule) => rule == null || (Array.isArray(rule) && rule.length === 0),
    );
    if (!noOptions) {
      const allOptions = rules.every(
        (rule) => rule != null && (!Array.isArray(rule) || rule.length > 0),
      );
      if (!allOptions) {
        this.throwException(
          Severity.Error,
          VisitorUtility.constructLocality(ctx),
          "If one option is specified, all options must be present: ",
          options,
        );
      }
    }
  }

  protected checkHasExactlyOneOption<E extends ParseTree>(
    options: string,
    parentCtx: ParserRuleContext,
    ...rules: Array<Array<E>>
  ): void {
    const children: TerminalNode[] = [];
    rules
      .filter((rule) => rule.length > 0)
      .forEach((rule) => {
        //TODO? rule.removeIf(Objects:: isNull);
        if (rule[0] instanceof TerminalNode) {
          children.push(...(rule as unknown as TerminalNode[]));
        } else {
          rule.forEach((context) =>
            this.getAllTokenChildren(
              context as unknown as ParserRuleContext,
              children,
              false,
            ),
          );
        }
      });

    if (this.checkHasMutuallyExclusiveOptions(options, children) == 0) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(parentCtx),
        "Exactly one option required, none provided: ",
        options,
      );
    }
  }

  /**
   * Throws error for commands without correct translator options
   *
   * @param rule Context to throw the error on
   * @param missingTranslatorOption The option name that is missing
   * @param <E> Generic for rule type
   */
  throwIfMissingTranslatorOption<E extends ParseTree>(
    rule: E,
    missingTranslatorOption: string,
  ): void {
    this.throwException(
      Severity.Error,
      VisitorUtility.constructLocality(rule),
      "Invalid CICS command without translator option: ",
      missingTranslatorOption,
    );
  }

  /**
   * Throws error for commands with incorrect browse usage
   *
   * @param rule Context to throw the error on
   * @param message Invalid Browse Usage Message
   * @param <E> Generic for rule type
   */
  public throwBrowsingViolation<E extends ParseTree>(
    rule: E,
    message: string,
  ): void {
    this.throwException(
      Severity.Error,
      VisitorUtility.constructLocality(rule),
      "Invalid option or parameter provided: ",
      message,
    );
  }

  /**
   * Validates parser rules to ensure browser functionality
   *
   * @param ctx Context to evaluate
   * @param coreTokenIndex The CICSParser index(ices) for the core token(s)
   */
  public checkBrowsingInvalidOptions(
    ctx: ParserRuleContext,
    ...coreTokenIndex: number[]
  ): void {
    if (ctx.children == null) return;
    for (let index = 0; index < ctx.children.length; index++) {
      if (!(ctx.children[index] instanceof TerminalNode)) continue;
      const tokenIndex = (ctx.children[index] as TerminalNode).symbol.type;
      const isCoreToken = coreTokenIndex.includes(tokenIndex);
      if (
        !isCoreToken &&
        tokenIndex != CICSParser.START &&
        tokenIndex != CICSParser.AT &&
        tokenIndex != CICSParser.END &&
        tokenIndex != CICSParser.NEXT
      ) {
        this.throwBrowsingViolation(
          ctx.children[index],
          "Accessory options not allowed when browsing with START or END",
        );
      }
    }
  }

  /**
   * Ensures the main option has it's required parameter when not browsing with START or END
   *
   * @param ctx Context to evaluate
   * @param coreTokenIndex The CICSParser index for the core rules with required parameter
   */
  public checkStatementHasParameter(
    ctx: ParserRuleContext,
    ...coreTokenIndex: number[]
  ): void {
    // Make sure the main option has it's required parameter if not browsing with START or END
    if (ctx.children == null) return;
    let traversalIndex = 0;
    for (const rule of ctx.children) {
      if (rule instanceof TerminalNode) {
        if (coreTokenIndex.includes(rule.symbol.type)) {
          if (traversalIndex + 1 < ctx.children.length) {
            const child = ctx.children[traversalIndex + 1].getChild(0);
            if (
              child == null ||
              (child instanceof TerminalNode &&
                (child as TerminalNode).symbol.type != CICSLexer.LPARENCHAR)
            ) {
              this.throwBrowsingViolation(
                ctx.children[traversalIndex],
                "Missing required option parameter",
              );
            }
          } else
            this.throwBrowsingViolation(
              ctx.children[traversalIndex],
              "Missing required option parameter",
            );
          break;
        }
      }
      traversalIndex++;
    }
  }

  /**
   * Ensures the main option does not have parameter if browsing with START or END
   *
   * @param ctx Context to evaluate
   * @param coreTokenIndex The CICSParser index for the core rules without parameters
   */
  public checkBrowsingHasNotParameter(
    ctx: ParserRuleContext,
    ...coreTokenIndex: number[]
  ): void {
    // Make sure the main option does not have parameter if browsing with START or END
    let traversalIndex = 0;
    if (ctx.children == null) return;
    for (const rule of ctx.children) {
      if (rule instanceof TerminalNode) {
        if (coreTokenIndex.includes(rule.symbol.type)) {
          if (traversalIndex + 1 < ctx.children.length) {
            const child = ctx.children[traversalIndex + 1].getChild(0);
            if (
              child != null &&
              child instanceof TerminalNode &&
              (child as TerminalNode).symbol.type == CICSLexer.LPARENCHAR
            ) {
              this.throwBrowsingViolation(
                ctx.children[traversalIndex + 1],
                "Parameter usage when browsing with START or END",
              );
            }
          }
          break;
        }
      }
      traversalIndex++;
    }
  }

  /**
   * Checks common Browsing options of START, END, NEXT for mutual exclusivity
   *
   * @param ctx ParserRuleContext to validate
   * @param <E> Generic type of ParserRuleContext subclass
   */
  checkBrowseMutuallyExclusive(ctx: ParserRuleContext): void {
    if (ctx.children == null) return;
    const browsingIndices = [CICSParser.START, CICSParser.END, CICSParser.NEXT];
    const browsingContexts = ctx.children
      .filter((child) => child instanceof TerminalNode)
      .map((child) => child as TerminalNode)
      .filter((t) => browsingIndices.includes(t.symbol.type));
    this.checkHasMutuallyExclusiveOptions(
      "START or END or NEXT",
      browsingContexts,
    );
  }

  /**
   * Performs a common BROWSING check to validate parameters and options for certain BROWSING
   * scenarios with START and END
   *
   * @param ctx Context to validate
   * @param coreToken The core token of the rule
   * @param <E> Generic type of ParserRuleContext subclass
   */
  checkBrowsingCommon(ctx: ParserRuleContext, coreToken: number) {
    this.checkBrowseMutuallyExclusive(ctx);
    const startEndCtx = ctx.getChild(0, Cics_browse_start_endContext as any);
    if (startEndCtx != null) {
      this.checkBrowsingInvalidOptions(ctx, coreToken);
      this.checkBrowsingHasNotParameter(ctx, coreToken);
    } else this.checkStatementHasParameter(ctx, coreToken);
  }

  /**
   * Gets whether nolength options is provided in Cics directives
   *
   * @return isNolength enabled
   */
  protected noLengthOptionsEnabled() {
    return this.utilityParameters.noLengthEnabled;
  }

  /**
   * Helper method to collect analysis errors if option becomes mandatory when no length directive
   * specified
   *
   * @param field required field
   * @param optionalField optional field
   * @param ctx Context to extrapolate locality against
   * @param fieldName required field name
   * @param optionalFieldName required field name
   */
  protected checkOptionalWithLength(
    field: TerminalNode[],
    optionalField: TerminalNode[],
    ctx: ParserRuleContext,
    fieldName: string,
    optionalFieldName: string,
  ): void {
    if (field.length === 0 && optionalField.length > 0) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Missing required option: ",
        optionalFieldName + " without " + fieldName,
      );
    } else if (
      this.noLengthOptionsEnabled() &&
      field.length > 0 &&
      optionalField.length === 0
    ) {
      this.throwException(
        Severity.Error,
        VisitorUtility.constructLocality(ctx),
        "Missing required option: ",
        optionalFieldName,
      );
    }
  }
}
