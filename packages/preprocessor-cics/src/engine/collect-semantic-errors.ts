import { ParserRuleContext, ParseTree } from "antlr4ng";
import { CICSParserVisitor } from "../generated/CICSParserVisitor";
import {
  CICSCheckUtilityParameters,
  CICSLiteralCheckOption,
} from "../checks/base";
import { OptionsRegistry  } from "../checks/options-registry";
import { Diagnostic } from "preprocessor-api";

export class CollectingSemanticErrorVisitor extends CICSParserVisitor<
  ParseTree[] | null
> {
  private readonly cicsOptionsCheckUtility: OptionsRegistry;
  private readonly cicsOptionsCheckUtilityParams: CICSCheckUtilityParameters;
  public readonly errors: Diagnostic[] = [];

  constructor() {
    super();
    this.cicsOptionsCheckUtilityParams = this.getCheckParams();
    this.cicsOptionsCheckUtility = new OptionsRegistry(
      this.errors,
      this.cicsOptionsCheckUtilityParams,
    );
  }

  // override visitQualifiedDataName(ctx: QualifiedDataNameContext): ParseTree[] {
  //   return this.addTreeNode(ctx, QualifiedReferenceNode::new);
  // }

  // override visitCicsExecBlock(ctx: CicsExecBlockContext): ParseTree[] {
  //   areaBWarning(ctx);
  //   changeContextToDialectStatement(ctx);
  //   if (ctx.stop.getType() != CICSLexer.END_EXEC) {
  //     SyntaxError error =
  //         SyntaxError.syntaxError()
  //             .errorSource(ErrorSource.PARSING)
  //             .location(getTokenEndLocality(ctx.stop).toOriginalLocation())
  //             .suggestion(messageService.getMessage("cicsParser.missingEndExec"))
  //             .severity(ErrorSeverity.ERROR)
  //             .build();
  //     errors.add(error);
  //   }

  //   boolean isReturn =
  //       (ctx.allCicsRule() != null
  //           && ctx.allCicsRule().size() > 0
  //           && ctx.allCicsRule().get(0).cics_return() != null);
  //   boolean isHandle =
  //       (ctx.allCicsRule() != null
  //           && ctx.allCicsRule().size() > 0
  //           && ctx.allCicsRule().get(0).cics_handle() != null);
  //   boolean isAbend =
  //       (ctx.allCicsRule() != null
  //           && ctx.allCicsRule().size() > 0
  //           && ctx.allCicsRule().get(0).cics_abend() != null);

  //   if (isReturn) {
  //     return addTreeNode(ctx, ExecCicsReturnNode::new);
  //   } else if (isAbend) {
  //     boolean cancel =
  //         Optional.ofNullable(ctx.allCicsRule().get(0).cics_abend())
  //             .map(CICSParser.Cics_abendContext::cics_abend_opts)
  //             .map(CICSParser.Cics_abend_optsContext::CANCEL)
  //             .filter(s -> s.size() > 0)
  //             .isPresent();

  //     return addTreeNode(ctx, locality -> new ExecCicsAbendNode(locality, cancel));
  //   } else if (isHandle) {
  //     boolean isProgram =
  //         Optional.ofNullable(ctx.allCicsRule().get(0).cics_handle())
  //             .map(CICSParser.Cics_handleContext::cics_handle_abend)
  //             .map(CICSParser.Cics_handle_abendContext::PROGRAM)
  //             .filter(s -> s.size() > 0)
  //             .isPresent();

  //     boolean isLabel =
  //         Optional.ofNullable(ctx.allCicsRule().get(0).cics_handle())
  //             .map(CICSParser.Cics_handleContext::cics_handle_abend)
  //             .map(CICSParser.Cics_handle_abendContext::LABEL)
  //             .filter(s -> s.size() > 0)
  //             .isPresent();

  //     boolean isReset =
  //         Optional.ofNullable(ctx.allCicsRule().get(0).cics_handle())
  //             .map(CICSParser.Cics_handleContext::cics_handle_abend)
  //             .map(CICSParser.Cics_handle_abendContext::RESET)
  //             .filter(s -> s.size() > 0)
  //             .isPresent();

  //     ExecCicsHandleNode.HandleAbendType type;
  //     if (isProgram) {
  //       type = ExecCicsHandleNode.HandleAbendType.PROGRAM;
  //     } else if (isLabel) {
  //       type = ExecCicsHandleNode.HandleAbendType.LABEL;
  //     } else if (isReset) {
  //       type = ExecCicsHandleNode.HandleAbendType.RESET;
  //     } else {
  //       type = ExecCicsHandleNode.HandleAbendType.CANCEL;
  //     }

  //     return addTreeNode(ctx, (location) -> new ExecCicsHandleNode(location, type));
  //   }
  //   return addTreeNode(ctx, ExecCicsNode::new);
  // }

  // override visitCicsDfhResp: (ctx: CicsDfhRespContext) => ParseTree[]|null = (ctx) => {
  //   this.addReplacementContext(ctx);
  //   return this.visitChildren(ctx);
  // }

  // override visitAllExciRules(ctx: AllExciRulesContext) {
  //   // TODO: uncomment and adjust below when we decide to support this feature based on compiler
  //   // directive
  //   //    boolean isExciModeEnabled = context
  //   //            .getConfig()
  //   //            .getCompilerOptions()
  //   //            .stream()
  //   //            .anyMatch(str -> str.equalsIgnoreCase("EXCI"));
  //   //    if (!isExciModeEnabled) {
  //   //      Locality tokenLocality = getTokenLocality(ctx.start);
  //   //      errors.add(SyntaxError.syntaxError()
  //   //              .errorSource(ErrorSource.PARSING)
  //   //              .location(tokenLocality.toOriginalLocation())
  //   //              .suggestion(messageService.getMessage("cics.exci.errormessage"))
  //   //              .severity(ErrorSeverity.WARNING)
  //   //              .build());
  //   //    }
  //   return this.visitChildren(ctx);
  // }

  // override visitCicsDfhValue: (ctx: CicsDfhValueContext) => ParseTree[]|null = (ctx) => {
  //   this.addReplacementContext(ctx);
  //   return this.visitChildren(ctx);
  // }

  // override visitDataName: (ctx: DataNameContext) => ParseTree[]|null = (ctx) => {
  //   return this.addTreeNode(ctx, locality => new VariableUsageNode(this.getName(ctx), locality));
  // }

  // // TODO : correct the implementation
  // override visitParagraphNameUsage: (ctx: ParagraphNameUsageContext) => ParseTree[]|null = (ctx) => {
  //   const name = this.getName(ctx);
  //   const locality =
  //       VisitorHelper.buildNameRangeLocality(ctx, name, this.context.getProgramDocumentUri());
  //   const location = this.context.getExtendedDocument().mapLocation(locality.getRange());

  //   const node =
  //       new CodeBlockUsageNode(
  //           Locality.builder().range(location.getRange()).uri(location.getUri()).build(),
  //           name,
  //           null);
  //   (this.visitChildren(ctx) ?? []).forEach(node::addChild);
  //   return ImmutableList.of(node);
  // }

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
      this.cicsOptionsCheckUtility.checkOptions(node);
    }
    return super.visitChildren(node);
  }

  override defaultResult() {
    return [];
  }

  override aggregateResult(aggregate: ParseTree[], nextResult: ParseTree[]) {
    return [...aggregate, ...nextResult];
  }

  // override visitCics_return: (ctx: Cics_returnContext) => ParseTree[] = (ctx) => {
  //   //TODO
  //   return []; //this.addTreeNode(ctx, StopNode::new);
  // }

  // private addTreeNode(ctx: ParserRuleContext, nodeConstructor: (locality: Locality) => Node) {
  //   const node = nodeConstructor(this.getOriginalLocality(ctx));
  //   this.visitChildren(ctx).forEach(node::addChild);
  //   return ImmutableList.of(node);
  // }

  // private Locality getOriginalLocality(ParserRuleContext ctx) {
  //   Location location =
  //       context.getExtendedDocument().mapLocation(AntlrRangeUtils.constructRange(ctx));
  //   return Locality.builder().uri(location.getUri()).range(location.getRange()).build();
  // }

  // private String getName(ParserRuleContext context) {
  //   return ofNullable(context).map(RuleContext::getText).map(String::toUpperCase).orElse("");
  // }

  // /**
  //  * Builds context name locality based on the name and uri of the document
  //  *
  //  * @param ctx is a parse rule context
  //  * @param name is a name of the entity
  //  * @param uri is an uri of the document
  //  * @return locality object
  //  */
  // private Locality buildNameRangeLocality(ParserRuleContext ctx, String name, String uri) {
  //   return VisitorHelper.buildNameRangeLocality(ctx, name, uri);
  // }

  // private void changeContextToDialectStatement(ParserRuleContext ctx) {
  //   context
  //       .getExtendedDocument()
  //       .fillArea(AntlrRangeUtils.constructRange(ctx), CobolDialect.FILLER.charAt(0));
  // }

  // private void addReplacementContext(ParserRuleContext ctx) {
  //   getAllTerminalNodes(ctx)
  //       .forEach(
  //           node ->
  //               context
  //                   .getExtendedDocument()
  //                   .replace(
  //                       constructRange(node.getSymbol()),
  //                       StringUtils.repeat(CobolDialect.FILLER, node.getText().length())));
  // }

  // private List<TerminalNode> getAllTerminalNodes(ParserRuleContext ctx) {
  //   List<TerminalNode> result = new ArrayList<>();
  //   for (int childNodes = 0; childNodes < ctx.getChildCount(); childNodes++) {
  //     ParseTree child = ctx.getChild(childNodes);
  //     if (child instanceof TerminalNode) {
  //       result.add((TerminalNode) child);
  //     } else {
  //       result.addAll(getAllTerminalNodes((ParserRuleContext) child));
  //     }
  //   }
  //   return result;
  // }

  // private void areaBWarning(ParserRuleContext ctx) {
  //   List<Token> tokenList =
  //       getAllTerminalNodes(ctx).stream().map(TerminalNode::getSymbol).collect(toList());
  //   areaBWarning(tokenList);
  // }

  // private void areaBWarning(@NonNull List<Token> tokenList) {
  //   tokenList.forEach(
  //       token ->
  //           Optional.ofNullable(getTokenLocality(token))
  //               .filter(startsInAreaA(token))
  //               .ifPresent(
  //                   locality ->
  //                       throwException(
  //                           locality,
  //                           MessageTemplate.of("CobolVisitor.AreaBWarningMsg", token.getText()),
  //                           ErrorSeverity.WARNING)));
  // }

  // private Locality getTokenLocality(Token token) {
  //   return Locality.builder()
  //       .uri(context.getProgramDocumentUri())
  //       .range(VisitorHelper.buildTokenRange(token))
  //       .build();
  // }

  // private Locality getTokenEndLocality(Token token) {
  //   return Locality.builder()
  //       .uri(context.getProgramDocumentUri())
  //       .range(buildTokenEndRange(token))
  //       .build();
  // }

  // private Predicate<Locality> startsInAreaA(Token token) {
  //   return it -> {
  //     int charPosition = it.getRange().getStart().getCharacter();
  //     return charPosition > 6 && charPosition < 11 && token.getChannel() != HIDDEN;
  //   };
  // }

  // private void throwException(
  //     @NonNull Locality locality, MessageTemplate messageTemplate, ErrorSeverity severity) {
  //   SyntaxError error =
  //       SyntaxError.syntaxError()
  //           .errorSource(ErrorSource.PARSING)
  //           .location(locality.toOriginalLocation())
  //           .messageTemplate(messageTemplate)
  //           .severity(severity)
  //           .build();

  //   LOG.debug("Syntax error by CobolVisitor#throwException: {}", error);
  //   if (!errors.contains(error)) {
  //     errors.add(error);
  //   }
  // }

  // private Range buildTokenEndRange(Token token) {
  //   Position p =
  //       new Position(
  //           token.getLine() - 1,
  //           token.getCharPositionInLine() + token.getStopIndex() - token.getStartIndex() + 1);
  //   return new Range(p, p);
  // }

  private getCheckParams(): CICSCheckUtilityParameters {
    const cicsCheckUtilityParameters = new CICSCheckUtilityParameters();
    cicsCheckUtilityParameters.spEnabled = true;
    cicsCheckUtilityParameters.literalChecks = CICSLiteralCheckOption.IGNORE;
    return cicsCheckUtilityParameters;
    //TODO
    // }
    // for (String opt : opts) {
    //   switch (opt.toUpperCase()) {
    //     case "LENGTH":
    //       cicsCheckUtilityParameters.noLengthEnabled = false;
    //       break;
    //     case "NOLENGTH":
    //       cicsCheckUtilityParameters.noLengthEnabled = true;
    //       break;
    //     case "SP":
    //       cicsCheckUtilityParameters.spEnabled = true;
    //       break;
    //     case "EXCI":
    //       cicsCheckUtilityParameters.exciEnabled = true;
    //       break;
    //     case "APOST":
    //       cicsCheckUtilityParameters.literalChecks = CICSLiteralCheckOption.APOST;
    //       break;
    //     case "QUOTE":
    //       cicsCheckUtilityParameters.literalChecks = CICSLiteralCheckOption.QUOTE;
    //       break;
    //     default:
    //       break;
    //   }
    // }
    // return cicsCheckUtilityParameters;
  }

  // override visitVariableNameUsage(ctx: VariableNameUsageContext): ParseTree[] {
  //   if ((ctx.NONNUMERICLITERAL() != null || ctx.NUMERICLITERAL() != null)) {
  //     const opt = cicsOptionsCheckUtilityParams.literalChecks;
  //     if (opt === CICSLiteralCheckOption.QUOTE && ctx.getText().endsWith("\'"))
  //       throwException(
  //           getTokenLocality(ctx.start),
  //           MessageTemplate.of("cics.invalidLiteralDelimeter", "\""),
  //           ErrorSeverity.ERROR);
  //     else if (opt === CICSLiteralCheckOption.APOST && ctx.getText().endsWith("\""))
  //       throwException(
  //           getTokenLocality(ctx.start),
  //           MessageTemplate.of("cics.invalidLiteralDelimeter", "'"),
  //           ErrorSeverity.ERROR);
  //   }
  //   return visitChildren(ctx);
  // }
}
