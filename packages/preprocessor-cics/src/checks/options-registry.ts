import { ParserRuleContext } from "antlr4ng";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { AbendOptionsChecker } from "./check-abend-options";
import { Diagnostic } from "preprocessor-api";
import { AcquireOptionsChecker } from "./check-acquire-options";
import { AcquireTerminalOptionsChecker } from "./check-acquire-terminal-options";
import { AddressOptionsChecker } from "./check-address-options";

export class OptionsRegistry {
  private readonly optionsMap = new Map<number, CICSOptionsCheckerBase>();
  private readonly spOptionsMap = new Map<number, CICSOptionsCheckerBase>();

  private utilityParameters: CICSCheckUtilityParameters;

  public constructor(
    errors: Diagnostic[],
    cicsCheckUtilityParameters: CICSCheckUtilityParameters,
  ) {
    this.utilityParameters = cicsCheckUtilityParameters;
    // this.optionsMap.set(
    //     CICSReceiveOptionsCheckUtility.RULE_INDEX,
    //     new CICSReceiveOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSAllocateOptionsCheckUtility.RULE_INDEX,
    //     new CICSAllocateOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSBifOptionsCheckUtility.RULE_INDEX,
    //     new CICSBifOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSAsktimeOptionsCheckUtility.RULE_INDEX,
    //     new CICSAsktimeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      AbendOptionsChecker.RULE_INDEX,
      new AbendOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSConverseOptionsCheckUtility.RULE_INDEX,
    //     new CICSConverseOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSExtractOptionsUtility.RULE_INDEX,
    //     new CICSExtractOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDefineOptionsCheckUtility.RULE_INDEX,
    //     new CICSDefineOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSIssueOptionsCheckUtility.RULE_INDEX,
    //     new CICSIssueOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSAddSubeventOptionsCheckUtility.RULE_INDEX,
    //     new CICSAddSubeventOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSBuildOptionsCheckUtility.RULE_INDEX,
    //     new CICSBuildOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      AcquireOptionsChecker.RULE_INDEX,
      new AcquireOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSWaitOptionsCheckUtility.RULE_INDEX,
    //     new CICSWaitOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSAssignOptionsCheckUtility.RULE_INDEX,
    //     new CICSAssignOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSCancelOptionsCheckUtility.RULE_INDEX,
    //     new CICSCancelOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSendOptionsCheckUtility.RULE_INDEX,
    //     new CICSSendOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSConnectProcessOptionsCheckUtility.RULE_INDEX,
    //     new CICSConnectProcessOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSCheckOptionsUtility.RULE_INDEX,
    //     new CICSCheckOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSChangeOptionsCheckUtility.RULE_INDEX,
    //     new CICSChangeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSWebOptionsCheckUtility.RULE_INDEX,
    //     new CICSWebOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSEndbrOptionsUtility.RULE_INDEX,
    //     new CICSEndbrOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSEndBrowseOptionsUtility.RULE_INDEX,
    //     new CICSEndBrowseOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDeleteOptionsCheckUtility.RULE_INDEX,
    //     new CICSDeleteOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDeleteqDeqOptionsCheckUtility.RULE_INDEX_DELETEQ,
    //     new CICSDeleteqDeqOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDeleteqDeqOptionsCheckUtility.RULE_INDEX_DEQ,
    //     new CICSDeleteqDeqOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSReadNextReadPrevOptionsUtility.RULE_INDEX,
    //     new CICSReadNextReadPrevOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRewriteOptionsCheckUtility.RULE_INDEX,
    //     new CICSRewriteOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSReturnOptionsCheckUtility.RULE_INDEX,
    //     new CICSReturnOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSignonOptionsCheckUtility.RULE_INDEX,
    //     new CICSSignonOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSForceOptionsCheckUtility.RULE_INDEX,
    //     new CICSForceOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSEnterTracenumOptionsCheckUtility.RULE_INDEX,
    //     new CICSEnterTracenumOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDumpTransactionOptionsCheckUtility.RULE_INDEX,
    //     new CICSDumpTransactionOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSGetOptionsCheckUtility.RULE_INDEX,
    //     new CICSGetOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSFreeMainOptionsCheckUtility.RULE_INDEX,
    //     new CICSFreeMainOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      AddressOptionsChecker.RULE_INDEX,
      new AddressOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSWriteqOptionsCheckUtility.RULE_INDEX,
    //     new CICSWriteqOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSLinkOptionsCheckUtility.RULE_INDEX,
    //     new CICSLinkOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSFormatTimeOptionsCheckUtility.RULE_INDEX,
    //     new CICSFormatTimeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSHandleOptionsCheckUtility.RULE_INDEX,
    //     new CICSHandleOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDelayOptionsCheckUtility.RULE_INDEX,
    //     new CICSDelayOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSReadqOptionsCheckUtility.RULE_INDEX,
    //     new CICSReadqOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSConvertTimeOptionsCheckUtility.RULE_INDEX,
    //     new CICSConvertTimeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSEnqOptionsCheckUtility.RULE_INDEX,
    //     new CICSEnqOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSWriteOptionsCheckUtility.RULE_INDEX,
    //     new CICSWriteOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRetrieveOptionsCheckUtility.RULE_INDEX,
    //     new CICSRetrieveOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSInvokeOptionsCheckUtility.RULE_INDEX,
    //     new CICSInvokeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSWSAEPRUtility.RULE_INDEX,
    //     new CICSWSAEPRUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSysSetOptionsCheckUtility.RULE_INDEX,
    //     new CICSSysSetOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSWaitCicsOptionsUtility.RULE_INDEX,
    //     new CICSWaitCicsOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSTestOptionsUtility.RULE_INDEX,
    //     new CICSTestOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSUnlockOptionsUtility.RULE_INDEX,
    //     new CICSUnlockOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSMoveOptionsCheckUtility.RULE_INDEX,
    //     new CICSMoveOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSQueryOptionsCheckUtility.RULE_INDEX,
    //     new CICSQueryOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRunOptionsCheckUtility.RULE_INDEX,
    //     new CICSRunOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSXctlOptionsUtility.RULE_INDEX,
    //     new CICSXctlOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSuspendOptionsUtility.RULE_INDEX,
    //     new CICSSuspendOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSGetMainOptionsUtility.RULE_INDEX,
    //     new CICSGetMainOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSGetMain64OptionsUtility.RULE_INDEX,
    //     new CICSGetMain64OptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSInquireOptionsCheckUtility.RULE_INDEX,
    //     new CICSInquireOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSVerifyOptionsCheckUtility.RULE_INDEX,
    //     new CICSVerifyOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSGetnextOptionsCheckUtility.RULE_INDEX,
    //     new CICSGetnextOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSpoolOpenOptionsCheckUtility.RULE_INDEX,
    //     new CICSSpoolOpenOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSMonitorOptionsCheckUtility.RULE_INDEX,
    //     new CICSMonitorOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSLoadOptionsCheckUtility.RULE_INDEX,
    //     new CICSLoadOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSPointOptionsCheckUtility.RULE_INDEX,
    //     new CICSPointOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSResetOptionsCheckUtility.RULE_INDEX,
    //     new CICSResetOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSStartbrowseOptionsCheckUtility.RULE_INDEX,
    //     new CICSStartbrowseOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSPopHandleOptionsCheckUtility.RULE_INDEX,
    //     new CICSPopHandleOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRewindCounterOptionsCheckUtility.RULE_INDEX,
    //     new CICSRewindCounterOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSReleaseOptionsCheckUtility.RULE_INDEX,
    //     new CICSReleaseOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSPostOptionsCheckUtility.RULE_INDEX,
    //     new CICSPostOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRemoveOptionsCheckUtility.RULE_INDEX,
    //     new CICSRemoveOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSpoolWriteOptionsCheckUtility.RULE_INDEX,
    //     new CICSSpoolWriteOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSpoolcloseOptionsCheckUtility.RULE_INDEX,
    //     new CICSSpoolcloseOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSpoolreadOptionsCheckUtility.RULE_INDEX,
    //     new CICSSpoolreadOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSUpdateOptionsCheckUtility.RULE_INDEX,
    //     new CICSUpdateOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSyncPointOptionsCheckUtility.RULE_INDEX,
    //     new CICSSyncPointOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSignalOptionsCheckUtility.RULE_INDEX,
    //     new CICSSignalOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSStartbrOptionsCheckUtility.RULE_INDEX,
    //     new CICSStartbrOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSIgnoreOptionsCheckUtility.RULE_INDEX,
    //     new CICSIgnoreOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDocumentOptionsCheckUtility.RULE_INDEX,
    //     new CICSDocumentOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRequestOptionsCheckUtility.RULE_INDEX,
    //     new CICSRequestOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSReadOptionsCheckUtility.RULE_INDEX,
    //     new CICSReadOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSTransformOptionsCheckUtility.RULE_INDEX,
    //     new CICSTransformOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSPutContainerOptionsCheckUtility.RULE_INDEX,
    //     new CICSPutContainerOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSSoapfaultOptionsCheckUtility.RULE_INDEX,
    //     new CICSSoapfaultOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSResumeOptionsCheckUtility.RULE_INDEX,
    //     new CICSResumeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSRouteOptionsCheckUtility.RULE_INDEX,
    //     new CICSRouteOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSWSAContextOptionsCheckUtility.RULE_INDEX,
    //     new CICSWSAContextOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSResetbrOptionsCheckUtility.RULE_INDEX,
    //     new CICSResetbrOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSFetchOptionsCheckUtility.RULE_INDEX,
    //     new CICSFetchOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSStartOptionsCheckUtility.RULE_INDEX,
    //     new CICSStartOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSFreeOptionsCheckUtility.RULE_INDEX,
    //     new CICSFreeOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSGdsOptionsCheckUtility.RULE_INDEX,
    //     new CICSGdsOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSInquireSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSInquireSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSDisableProgramOptionsCheckUtility.RULE_INDEX,
    //     new CICSDisableProgramOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.spOptionsMap.set(
      AcquireTerminalOptionsChecker.RULE_INDEX,
      new AcquireTerminalOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.spOptionsMap.set(
    //     CICSDiscardOptionsUtility.RULE_INDEX,
    //     new CICSDiscardOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSCreateSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSCreateSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSEnableProgramOptionsUtility.RULE_INDEX,
    //     new CICSEnableProgramOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSExtractSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSExtractSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSResyncEntrynameOptionsCheckUtility.RULE_INDEX,
    //     new CICSResyncEntrynameOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSPerformSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSPerformSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSCollectStatisticsSpOptionsCheckUtility.RULE_INDEX,
    //     new CICSCollectStatisticsSpOptionsCheckUtility(
    //         context, errors, cicsCheckUtilityParameters));
    // this.spOptionsMap.set(
    //     CICSCsdSpOptionsCheckUtility.RULE_INDEX,
    //     new CICSCsdSpOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
  }

  /**
   * Entrypoint to check CICS rule options
   *
   * @param ctx ParserRuleContext subclass containing options
   * @param <E> A subclass of ParserRuleContext
   */
  public checkOptions<E extends ParserRuleContext>(ctx: E): void {
    if (ctx.parent == null) {
      return;
    }
    const utility = this.optionsMap.get(ctx.parent.ruleIndex);
    const spOptions = this.spOptionsMap.get(ctx.parent.ruleIndex);
    if (utility != null) utility.checkOptions(ctx);
    else if (spOptions != null) {
      if (this.utilityParameters.spEnabled) spOptions.checkOptions(ctx);
      else spOptions.throwIfMissingTranslatorOption(ctx, '"SP"');
    }
  }
}
