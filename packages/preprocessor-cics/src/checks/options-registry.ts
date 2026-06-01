import { ParserRuleContext } from "antlr4ng";
import { CICSCheckUtilityParameters, CICSOptionsCheckerBase } from "./base";
import { AbendOptionsChecker } from "./check-abend-options";
import { Diagnostic } from "preprocessor-api";
import { AcquireOptionsChecker } from "./check-acquire-options";
import { AcquireTerminalOptionsChecker } from "./check-acquire-terminal-options";
import { AddressOptionsChecker } from "./check-address-options";
import { AsktimeOptionsChecker } from "./check-asktime-options";
import { AssignOptionsChecker } from "./check-assign-options";
import { PopHandleOptionsChecker } from "./check-pop-handle-options";
import { SyncPointOptionsChecker } from "./check-sync-point-options";
import { DiscardOptionsChecker } from "./check-discard-options";
import { SuspendOptionsChecker } from "./check-suspend-options";
import { XctlOptionsChecker } from "./check-xctl-options";
import { LoadOptionsChecker } from "./check-load-options";
import { MonitorOptionsChecker } from "./check-monitor-options";
import { PointOptionsChecker } from "./check-point-options";
import { ReleaseOptionsChecker } from "./check-release-options";
import { TestOptionsChecker } from "./check-test-options";
import { UpdateOptionsChecker } from "./check-update-options";
import { UnlockOptionsChecker } from "./check-unlock-options";
import { WaitCicsOptionsChecker } from "./check-wait-cics-options";
import { SignalOptionsChecker } from "./check-signal-options";
import { SpoolcloseOptionsChecker } from "./check-spoolclose-options";
import { SpoolreadOptionsChecker } from "./check-spoolread-options";
import { SpoolWriteOptionsChecker } from "./check-spool-write-options";
import { RewindCounterOptionsChecker } from "./check-rewind-counter-options";
import { ResyncEntrynameOptionsChecker } from "./check-resync-entryname-options";
import { ForceOptionsChecker } from "./check-force-options";
import { FreeMainOptionsChecker } from "./check-free-main-options";
import { ResumeOptionsChecker } from "./check-resume-options";
import { EnqOptionsChecker } from "./check-enq-options";
import { EnterTracenumOptionsChecker } from "./check-enter-tracenum-options";
import { PostOptionsChecker } from "./check-post-options";
import { DelayOptionsChecker } from "./check-delay-options";
import { FreeOptionsChecker } from "./check-free-options";
import { RewriteOptionsChecker } from "./check-rewrite-options";
import { ReturnOptionsChecker } from "./check-return-options";
import { RouteOptionsChecker } from "./check-route-options";
import { ConvertTimeOptionsChecker } from "./check-convert-time-options";
import { FormatTimeOptionsChecker } from "./check-format-time-options";
import { CancelOptionsChecker } from "./check-cancel-options";
import { BifOptionsChecker } from "./check-bif-options";
import { BuildOptionsChecker } from "./check-build-options";
import { MoveOptionsChecker } from "./check-move-options";
import { InvokeOptionsChecker } from "./check-invoke-options";
import { LinkOptionsChecker } from "./check-link-options";
import { ChangeOptionsChecker } from "./check-change-options";
import { SignonOptionsChecker } from "./check-signon-options";
import { VerifyOptionsChecker } from "./check-verify-options";
import { RunOptionsChecker } from "./check-run-options";
import { TransformOptionsChecker } from "./check-transform-options";
import { SoapfaultOptionsChecker } from "./check-soapfault-options";
import { QueryOptionsChecker } from "./check-query-options";
import { ConnectProcessOptionsChecker } from "./check-connect-process-options";
import { ConverseOptionsChecker } from "./check-converse-options";
import { EndbrOptionsChecker } from "./check-endbr-options";
import { EndBrowseOptionsChecker } from "./check-end-browse-options";
import { ResetbrOptionsChecker } from "./check-resetbr-options";
import { StartbrOptionsChecker } from "./check-startbr-options";
import { FetchOptionsChecker } from "./check-fetch-options";
import { GetnextOptionsChecker } from "./check-getnext-options";
import { ReadOptionsChecker } from "./check-read-options";
import { ReadNextReadPrevOptionsChecker } from "./check-read-next-read-prev-options";
import { StartbrowseOptionsChecker } from "./check-startbrowse-options";
import { AddSubeventOptionsChecker } from "./check-add-subevent-options";
import { RemoveOptionsChecker } from "./check-remove-options";
import { RequestOptionsChecker } from "./check-request-options";
import { GetMainOptionsChecker } from "./check-get-main-options";
import { GetMain64OptionsChecker } from "./check-get-main-64-options";
import { GdsOptionsChecker } from "./check-gds-options";
import { EnableProgramOptionsChecker } from "./check-enable-program-options";
import { DisableProgramOptionsChecker } from "./check-disable-program-options";
import { CheckOptionsChecker } from "./check-check-options";
import { AllocateOptionsChecker } from "./check-allocate-options";
import { WriteqOptionsChecker } from "./check-writeq-options";
import { SpoolOpenOptionsChecker } from "./check-spoolopen-options";
import { WriteOptionsChecker } from "./check-write-options";
import { PutContainerOptionsChecker } from "./check-put-container-options";
import { GetOptionsChecker } from "./check-get-options";
import { ResetOptionsChecker } from "./check-reset-options";
import { DeleteqDeqOptionsChecker } from "./check-deleteq-deq-options";
import { WSAEPROptionsChecker } from "./check-wsaepr-options";
import { RetrieveOptionsChecker } from "./check-retrieve-options";
import { DumpTransactionOptionsChecker } from "./check-dump-transaction-options";
import { StartOptionsChecker } from "./check-start-options";

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
    this.optionsMap.set(
      AllocateOptionsChecker.RULE_INDEX,
      new AllocateOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      BifOptionsChecker.RULE_INDEX,
      new BifOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      AsktimeOptionsChecker.RULE_INDEX,
      new AsktimeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      AbendOptionsChecker.RULE_INDEX,
      new AbendOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ConverseOptionsChecker.RULE_INDEX,
      new ConverseOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSExtractOptionsUtility.RULE_INDEX,
    //     new CICSExtractOptionsUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDefineOptionsCheckUtility.RULE_INDEX,
    //     new CICSDefineOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSIssueOptionsCheckUtility.RULE_INDEX,
    //     new CICSIssueOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      AddSubeventOptionsChecker.RULE_INDEX,
      new AddSubeventOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      BuildOptionsChecker.RULE_INDEX,
      new BuildOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      AcquireOptionsChecker.RULE_INDEX,
      new AcquireOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSWaitOptionsCheckUtility.RULE_INDEX,
    //     new CICSWaitOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      AssignOptionsChecker.RULE_INDEX,
      new AssignOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      CancelOptionsChecker.RULE_INDEX,
      new CancelOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSSendOptionsCheckUtility.RULE_INDEX,
    //     new CICSSendOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      ConnectProcessOptionsChecker.RULE_INDEX,
      new ConnectProcessOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      CheckOptionsChecker.RULE_INDEX,
      new CheckOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ChangeOptionsChecker.RULE_INDEX,
      new ChangeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSWebOptionsCheckUtility.RULE_INDEX,
    //     new CICSWebOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      EndbrOptionsChecker.RULE_INDEX,
      new EndbrOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      EndBrowseOptionsChecker.RULE_INDEX,
      new EndBrowseOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSDeleteOptionsCheckUtility.RULE_INDEX,
    //     new CICSDeleteOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    const deleteqDeqChecker = new DeleteqDeqOptionsChecker(
      errors,
      cicsCheckUtilityParameters,
    );
    this.optionsMap.set(
      DeleteqDeqOptionsChecker.RULE_INDEX_DELETEQ,
      deleteqDeqChecker,
    );
    this.optionsMap.set(
      DeleteqDeqOptionsChecker.RULE_INDEX_DEQ,
      deleteqDeqChecker,
    );
    this.optionsMap.set(
      ReadNextReadPrevOptionsChecker.RULE_INDEX,
      new ReadNextReadPrevOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      RewriteOptionsChecker.RULE_INDEX,
      new RewriteOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ReturnOptionsChecker.RULE_INDEX,
      new ReturnOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SignonOptionsChecker.RULE_INDEX,
      new SignonOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ForceOptionsChecker.RULE_INDEX,
      new ForceOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      EnterTracenumOptionsChecker.RULE_INDEX,
      new EnterTracenumOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      DumpTransactionOptionsChecker.RULE_INDEX,
      new DumpTransactionOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      GetOptionsChecker.RULE_INDEX,
      new GetOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      FreeMainOptionsChecker.RULE_INDEX,
      new FreeMainOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      AddressOptionsChecker.RULE_INDEX,
      new AddressOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      WriteqOptionsChecker.RULE_INDEX,
      new WriteqOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      LinkOptionsChecker.RULE_INDEX,
      new LinkOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      FormatTimeOptionsChecker.RULE_INDEX,
      new FormatTimeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSHandleOptionsCheckUtility.RULE_INDEX,
    //     new CICSHandleOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      DelayOptionsChecker.RULE_INDEX,
      new DelayOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSReadqOptionsCheckUtility.RULE_INDEX,
    //     new CICSReadqOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      ConvertTimeOptionsChecker.RULE_INDEX,
      new ConvertTimeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      EnqOptionsChecker.RULE_INDEX,
      new EnqOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      WriteOptionsChecker.RULE_INDEX,
      new WriteOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      RetrieveOptionsChecker.RULE_INDEX,
      new RetrieveOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      InvokeOptionsChecker.RULE_INDEX,
      new InvokeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      WSAEPROptionsChecker.RULE_INDEX,
      new WSAEPROptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSSysSetOptionsCheckUtility.RULE_INDEX,
    //     new CICSSysSetOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      WaitCicsOptionsChecker.RULE_INDEX,
      new WaitCicsOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      TestOptionsChecker.RULE_INDEX,
      new TestOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      UnlockOptionsChecker.RULE_INDEX,
      new UnlockOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      MoveOptionsChecker.RULE_INDEX,
      new MoveOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      QueryOptionsChecker.RULE_INDEX,
      new QueryOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      RunOptionsChecker.RULE_INDEX,
      new RunOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      XctlOptionsChecker.RULE_INDEX,
      new XctlOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SuspendOptionsChecker.RULE_INDEX,
      new SuspendOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      GetMainOptionsChecker.RULE_INDEX,
      new GetMainOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      GetMain64OptionsChecker.RULE_INDEX,
      new GetMain64OptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSInquireOptionsCheckUtility.RULE_INDEX,
    //     new CICSInquireOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      VerifyOptionsChecker.RULE_INDEX,
      new VerifyOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      GetnextOptionsChecker.RULE_INDEX,
      new GetnextOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SpoolOpenOptionsChecker.RULE_INDEX,
      new SpoolOpenOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      MonitorOptionsChecker.RULE_INDEX,
      new MonitorOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      LoadOptionsChecker.RULE_INDEX,
      new LoadOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      PointOptionsChecker.RULE_INDEX,
      new PointOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ResetOptionsChecker.RULE_INDEX,
      new ResetOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      StartbrowseOptionsChecker.RULE_INDEX,
      new StartbrowseOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      PopHandleOptionsChecker.RULE_INDEX,
      new PopHandleOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      RewindCounterOptionsChecker.RULE_INDEX,
      new RewindCounterOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ReleaseOptionsChecker.RULE_INDEX,
      new ReleaseOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      PostOptionsChecker.RULE_INDEX,
      new PostOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      RemoveOptionsChecker.RULE_INDEX,
      new RemoveOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SpoolWriteOptionsChecker.RULE_INDEX,
      new SpoolWriteOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SpoolcloseOptionsChecker.RULE_INDEX,
      new SpoolcloseOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SpoolreadOptionsChecker.RULE_INDEX,
      new SpoolreadOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      UpdateOptionsChecker.RULE_INDEX,
      new UpdateOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SyncPointOptionsChecker.RULE_INDEX,
      new SyncPointOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SignalOptionsChecker.RULE_INDEX,
      new SignalOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      StartbrOptionsChecker.RULE_INDEX,
      new StartbrOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSIgnoreOptionsCheckUtility.RULE_INDEX,
    //     new CICSIgnoreOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    // this.optionsMap.set(
    //     CICSDocumentOptionsCheckUtility.RULE_INDEX,
    //     new CICSDocumentOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      RequestOptionsChecker.RULE_INDEX,
      new RequestOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ReadOptionsChecker.RULE_INDEX,
      new ReadOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      TransformOptionsChecker.RULE_INDEX,
      new TransformOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      PutContainerOptionsChecker.RULE_INDEX,
      new PutContainerOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      SoapfaultOptionsChecker.RULE_INDEX,
      new SoapfaultOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      ResumeOptionsChecker.RULE_INDEX,
      new ResumeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      RouteOptionsChecker.RULE_INDEX,
      new RouteOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.optionsMap.set(
    //     CICSWSAContextOptionsCheckUtility.RULE_INDEX,
    //     new CICSWSAContextOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.optionsMap.set(
      ResetbrOptionsChecker.RULE_INDEX,
      new ResetbrOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      FetchOptionsChecker.RULE_INDEX,
      new FetchOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      StartOptionsChecker.RULE_INDEX,
      new StartOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      FreeOptionsChecker.RULE_INDEX,
      new FreeOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.optionsMap.set(
      GdsOptionsChecker.RULE_INDEX,
      new GdsOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.spOptionsMap.set(
    //     CICSInquireSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSInquireSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.spOptionsMap.set(
      DisableProgramOptionsChecker.RULE_INDEX,
      new DisableProgramOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.spOptionsMap.set(
      AcquireTerminalOptionsChecker.RULE_INDEX,
      new AcquireTerminalOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    this.spOptionsMap.set(
      DiscardOptionsChecker.RULE_INDEX,
      new DiscardOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.spOptionsMap.set(
    //     CICSCreateSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSCreateSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.spOptionsMap.set(
      EnableProgramOptionsChecker.RULE_INDEX,
      new EnableProgramOptionsChecker(errors, cicsCheckUtilityParameters),
    );
    // this.spOptionsMap.set(
    //     CICSExtractSPOptionsCheckUtility.RULE_INDEX,
    //     new CICSExtractSPOptionsCheckUtility(context, errors, cicsCheckUtilityParameters));
    this.spOptionsMap.set(
      ResyncEntrynameOptionsChecker.RULE_INDEX,
      new ResyncEntrynameOptionsChecker(errors, cicsCheckUtilityParameters),
    );
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
