// Generated from C:/workspace_nodejs/zowe-pli-language-support/packages/preprocessor-cics/src/antlr/CICSParser.g4 by ANTLR 4.13.2

import { MessageServiceParser } from "../antlr/message-service-parser";

import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link CICSParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface CICSParserVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link CICSParser#startRule}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitStartRule(CICSParser.StartRuleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#allCicsRule}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAllCicsRule(CICSParser.AllCicsRuleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#allExciRules}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAllExciRules(CICSParser.AllExciRulesContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#allSPRules}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAllSPRules(CICSParser.AllSPRulesContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_receive}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_receive(CICSParser.Cics_receiveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_receive_group_one}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_receive_group_one(CICSParser.Cics_receive_group_oneContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_receive_partn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_receive_partn(CICSParser.Cics_receive_partnContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_receive_map}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_receive_map(CICSParser.Cics_receive_mapContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_receive_map_mappingdev}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_receive_map_mappingdev(CICSParser.Cics_receive_map_mappingdevContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send(CICSParser.Cics_sendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_group1}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_group1(CICSParser.Cics_send_group1Context ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_control_map}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_control_map(CICSParser.Cics_send_control_mapContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_mappingdev}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_mappingdev(CICSParser.Cics_send_mappingdevContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_page}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_page(CICSParser.Cics_send_pageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_partnset}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_partnset(CICSParser.Cics_send_partnsetContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_text}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_text(CICSParser.Cics_send_textContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_text_mapped}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_text_mapped(CICSParser.Cics_send_text_mappedContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_send_text_noedit}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_send_text_noedit(CICSParser.Cics_send_text_noeditContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converse(CICSParser.Cics_converseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converse_group}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converse_group(CICSParser.Cics_converse_groupContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converse_erase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converse_erase(CICSParser.Cics_converse_eraseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converse_fromlength}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converse_fromlength(CICSParser.Cics_converse_fromlengthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_into}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_into(CICSParser.Cics_intoContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converse_tolength}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converse_tolength(CICSParser.Cics_converse_tolengthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_maxlength}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_maxlength(CICSParser.Cics_maxlengthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_abend}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_abend(CICSParser.Cics_abendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_abend_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_abend_opts(CICSParser.Cics_abend_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_acquire}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_acquire(CICSParser.Cics_acquireContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_acquire_process}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_acquire_process(CICSParser.Cics_acquire_processContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_acquire_activityId}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_acquire_activityId(CICSParser.Cics_acquire_activityIdContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_acquire_terminal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_acquire_terminal(CICSParser.Cics_acquire_terminalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_acquire_terminal_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_acquire_terminal_body(CICSParser.Cics_acquire_terminal_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_add}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_add(CICSParser.Cics_addContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#ciss_add_event_subevent}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCiss_add_event_subevent(CICSParser.Ciss_add_event_subeventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_address}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_address(CICSParser.Cics_addressContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_address_standard}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_address_standard(CICSParser.Cics_address_standardContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_address_set}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_address_set(CICSParser.Cics_address_setContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_allocate}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_allocate(CICSParser.Cics_allocateContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_allocate_appc_mro_lut61_sysid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_allocate_appc_mro_lut61_sysid(CICSParser.Cics_allocate_appc_mro_lut61_sysidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_allocate_lut61_session}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_allocate_lut61_session(CICSParser.Cics_allocate_lut61_sessionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_allocate_appc_partner}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_allocate_appc_partner(CICSParser.Cics_allocate_appc_partnerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_asktime}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_asktime(CICSParser.Cics_asktimeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_asktime_abstime}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_asktime_abstime(CICSParser.Cics_asktime_abstimeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_assign}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_assign(CICSParser.Cics_assignContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_assign_parameter1}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_assign_parameter1(CICSParser.Cics_assign_parameter1Context ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_assign_parameter2}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_assign_parameter2(CICSParser.Cics_assign_parameter2Context ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd(CICSParser.Cics_csdContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_add}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_add(CICSParser.Cics_csd_addContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_alter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_alter(CICSParser.Cics_csd_alterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_append}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_append(CICSParser.Cics_csd_appendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_copy}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_copy(CICSParser.Cics_csd_copyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_define}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_define(CICSParser.Cics_csd_defineContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_delete}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_delete(CICSParser.Cics_csd_deleteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_disconnect}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_disconnect(CICSParser.Cics_csd_disconnectContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_endbrgroup}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_endbrgroup(CICSParser.Cics_csd_endbrgroupContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_endbrlist}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_endbrlist(CICSParser.Cics_csd_endbrlistContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_endbrrsrce}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_endbrrsrce(CICSParser.Cics_csd_endbrrsrceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_getnextgroup}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_getnextgroup(CICSParser.Cics_csd_getnextgroupContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_getnextlist}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_getnextlist(CICSParser.Cics_csd_getnextlistContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_getnextrsrce}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_getnextrsrce(CICSParser.Cics_csd_getnextrsrceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_inquiregroup}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_inquiregroup(CICSParser.Cics_csd_inquiregroupContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_inquirelist}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_inquirelist(CICSParser.Cics_csd_inquirelistContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_inquirersrce}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_inquirersrce(CICSParser.Cics_csd_inquirersrceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_install}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_install(CICSParser.Cics_csd_installContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_lock}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_lock(CICSParser.Cics_csd_lockContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_remove}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_remove(CICSParser.Cics_csd_removeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_rename}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_rename(CICSParser.Cics_csd_renameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_startbrgroup}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_startbrgroup(CICSParser.Cics_csd_startbrgroupContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_startbrlist}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_startbrlist(CICSParser.Cics_csd_startbrlistContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_startbrrsrce}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_startbrrsrce(CICSParser.Cics_csd_startbrrsrceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_unlock}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_unlock(CICSParser.Cics_csd_unlockContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_userdefine}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_userdefine(CICSParser.Cics_csd_userdefineContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_csd_cvda}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_csd_cvda(CICSParser.Cics_csd_cvdaContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_bif}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_bif(CICSParser.Cics_bifContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_bif_deedit}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_bif_deedit(CICSParser.Cics_bif_deeditContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_bif_digest}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_bif_digest(CICSParser.Cics_bif_digestContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_build}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_build(CICSParser.Cics_buildContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_build_attach}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_build_attach(CICSParser.Cics_build_attachContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_cancel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_cancel(CICSParser.Cics_cancelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_cancel_bts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_cancel_bts(CICSParser.Cics_cancel_btsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_cancel_reqid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_cancel_reqid(CICSParser.Cics_cancel_reqidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_change}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_change(CICSParser.Cics_changeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_change_phrase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_change_phrase(CICSParser.Cics_change_phraseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_change_password}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_change_password(CICSParser.Cics_change_passwordContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_change_task}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_change_task(CICSParser.Cics_change_taskContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_password_phrase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_password_phrase(CICSParser.Cics_password_phraseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_check}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_check(CICSParser.Cics_checkContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_check_activity}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_check_activity(CICSParser.Cics_check_activityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_check_timer}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_check_timer(CICSParser.Cics_check_timerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_collect_statistics}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_collect_statistics(CICSParser.Cics_collect_statisticsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_collect_statistics_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_collect_statistics_opts(CICSParser.Cics_collect_statistics_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_conditions}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_conditions(CICSParser.Cics_conditionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_connect}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_connect(CICSParser.Cics_connectContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_connect_process}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_connect_process(CICSParser.Cics_connect_processContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converttime}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converttime(CICSParser.Cics_converttimeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_converttime_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_converttime_opts(CICSParser.Cics_converttime_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_create}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_create(CICSParser.Cics_createContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_create_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_create_opts(CICSParser.Cics_create_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define(CICSParser.Cics_defineContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define_activity}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define_activity(CICSParser.Cics_define_activityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define_composite_event}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define_composite_event(CICSParser.Cics_define_composite_eventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define_counter_dcounter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define_counter_dcounter(CICSParser.Cics_define_counter_dcounterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define_input_event}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define_input_event(CICSParser.Cics_define_input_eventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define_process}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define_process(CICSParser.Cics_define_processContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_define_timer}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_define_timer(CICSParser.Cics_define_timerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delay}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delay(CICSParser.Cics_delayContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delay_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delay_opts(CICSParser.Cics_delay_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delete}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delete(CICSParser.Cics_deleteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_keylength}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_keylength(CICSParser.Cics_keylengthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_counter_dcounter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_counter_dcounter(CICSParser.Cics_counter_dcounterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delete_group_one}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delete_group_one(CICSParser.Cics_delete_group_oneContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delete_group_two}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delete_group_two(CICSParser.Cics_delete_group_twoContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delete_group_three}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delete_group_three(CICSParser.Cics_delete_group_threeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_delete_group_four}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_delete_group_four(CICSParser.Cics_delete_group_fourContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_deleteq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_deleteq(CICSParser.Cics_deleteqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_deleteq_td}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_deleteq_td(CICSParser.Cics_deleteq_tdContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_deleteq_ts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_deleteq_ts(CICSParser.Cics_deleteq_tsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_queue_qname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_queue_qname(CICSParser.Cics_queue_qnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_deq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_deq(CICSParser.Cics_deqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_deq_cmds}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_deq_cmds(CICSParser.Cics_deq_cmdsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_disable}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_disable(CICSParser.Cics_disableContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_disable_program}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_disable_program(CICSParser.Cics_disable_programContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_discard}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_discard(CICSParser.Cics_discardContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_discard_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_discard_body(CICSParser.Cics_discard_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document(CICSParser.Cics_documentContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document_create}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document_create(CICSParser.Cics_document_createContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document_delete}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document_delete(CICSParser.Cics_document_deleteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document_insert}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document_insert(CICSParser.Cics_document_insertContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document_retrieve}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document_retrieve(CICSParser.Cics_document_retrieveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document_set}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document_set(CICSParser.Cics_document_setContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_length_flength}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_length_flength(CICSParser.Cics_length_flengthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_dump}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_dump(CICSParser.Cics_dumpContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_dump_transaction_from}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_dump_transaction_from(CICSParser.Cics_dump_transaction_fromContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_dump_code_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_dump_code_opts(CICSParser.Cics_dump_code_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_dump_transaction_segmentlist}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_dump_transaction_segmentlist(CICSParser.Cics_dump_transaction_segmentlistContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_enable}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_enable(CICSParser.Cics_enableContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_enable_program}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_enable_program(CICSParser.Cics_enable_programContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_endbr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_endbr(CICSParser.Cics_endbrContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_endbr_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_endbr_opts(CICSParser.Cics_endbr_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_endbrowse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_endbrowse(CICSParser.Cics_endbrowseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_endbrowse_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_endbrowse_opts(CICSParser.Cics_endbrowse_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_enq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_enq(CICSParser.Cics_enqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_enq_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_enq_opts(CICSParser.Cics_enq_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_enter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_enter(CICSParser.Cics_enterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_enter_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_enter_opts(CICSParser.Cics_enter_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract(CICSParser.Cics_extractContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_attach}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_attach(CICSParser.Cics_extract_attachContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_attributes}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_attributes(CICSParser.Cics_extract_attributesContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_certificate}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_certificate(CICSParser.Cics_extract_certificateContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_logonmessage}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_logonmessage(CICSParser.Cics_extract_logonmessageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_process}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_process(CICSParser.Cics_extract_processContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_tcpip}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_tcpip(CICSParser.Cics_extract_tcpipContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_tct}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_tct(CICSParser.Cics_extract_tctContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_web_server}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_web_server(CICSParser.Cics_extract_web_serverContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_web_client}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_web_client(CICSParser.Cics_extract_web_clientContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_system_programming}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_system_programming(CICSParser.Cics_extract_system_programmingContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_exit}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_exit(CICSParser.Cics_extract_exitContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_extract_statistics}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_extract_statistics(CICSParser.Cics_extract_statisticsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_fetch}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_fetch(CICSParser.Cics_fetchContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_fetch_any_child}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_fetch_any_child(CICSParser.Cics_fetch_any_childContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_force}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_force(CICSParser.Cics_forceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_force_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_force_opts(CICSParser.Cics_force_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_formattime}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_formattime(CICSParser.Cics_formattimeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_formattime_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_formattime_opts(CICSParser.Cics_formattime_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_free}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_free(CICSParser.Cics_freeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_free_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_free_body(CICSParser.Cics_free_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_freemain}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_freemain(CICSParser.Cics_freemainContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_freemain_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_freemain_opts(CICSParser.Cics_freemain_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_gds}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_gds(CICSParser.Cics_gdsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_gds_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_gds_opts(CICSParser.Cics_gds_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_get}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_get(CICSParser.Cics_getContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_get_container_bts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_get_container_bts(CICSParser.Cics_get_container_btsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_get_container_channel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_get_container_channel(CICSParser.Cics_get_container_channelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_get_counter_dcounter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_get_counter_dcounter(CICSParser.Cics_get_counter_dcounterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getmain}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getmain(CICSParser.Cics_getmainContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getmain_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getmain_body(CICSParser.Cics_getmain_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getmain64}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getmain64(CICSParser.Cics_getmain64Context ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getmain64_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getmain64_body(CICSParser.Cics_getmain64_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getnext}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getnext(CICSParser.Cics_getnextContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getnext_activity}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getnext_activity(CICSParser.Cics_getnext_activityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getnext_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getnext_container(CICSParser.Cics_getnext_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getnext_event}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getnext_event(CICSParser.Cics_getnext_eventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getnext_process}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getnext_process(CICSParser.Cics_getnext_processContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_getnext_timer}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_getnext_timer(CICSParser.Cics_getnext_timerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_handle}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_handle(CICSParser.Cics_handleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_handle_abend}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_handle_abend(CICSParser.Cics_handle_abendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_handle_aid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_handle_aid(CICSParser.Cics_handle_aidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_handle_condition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_handle_condition(CICSParser.Cics_handle_conditionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_ignore}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_ignore(CICSParser.Cics_ignoreContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_ignore_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_ignore_options(CICSParser.Cics_ignore_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire(CICSParser.Cics_inquireContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_activityid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_activityid(CICSParser.Cics_inquire_activityidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_container(CICSParser.Cics_inquire_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_event}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_event(CICSParser.Cics_inquire_eventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_process}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_process(CICSParser.Cics_inquire_processContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_timer}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_timer(CICSParser.Cics_inquire_timerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_browse_start_end}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_browse_start_end(CICSParser.Cics_browse_start_endContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_system_programming}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_system_programming(CICSParser.Cics_inquire_system_programmingContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_association}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_association(CICSParser.Cics_inquire_associationContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_association_list}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_association_list(CICSParser.Cics_inquire_association_listContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_atomservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_atomservice(CICSParser.Cics_inquire_atomserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_autinstmodel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_autinstmodel(CICSParser.Cics_inquire_autinstmodelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_autoinstall}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_autoinstall(CICSParser.Cics_inquire_autoinstallContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_brfacility}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_brfacility(CICSParser.Cics_inquire_brfacilityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_bundle}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_bundle(CICSParser.Cics_inquire_bundleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_bundlepart}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_bundlepart(CICSParser.Cics_inquire_bundlepartContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_capdatapred}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_capdatapred(CICSParser.Cics_inquire_capdatapredContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_capinfosrce}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_capinfosrce(CICSParser.Cics_inquire_capinfosrceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_capoptpred}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_capoptpred(CICSParser.Cics_inquire_capoptpredContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_capturespec}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_capturespec(CICSParser.Cics_inquire_capturespecContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_connection}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_connection(CICSParser.Cics_inquire_connectionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_cfdtpool}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_cfdtpool(CICSParser.Cics_inquire_cfdtpoolContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_db2conn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_db2conn(CICSParser.Cics_inquire_db2connContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_db2entry}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_db2entry(CICSParser.Cics_inquire_db2entryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_db2tran}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_db2tran(CICSParser.Cics_inquire_db2tranContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_deletshipped}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_deletshipped(CICSParser.Cics_inquire_deletshippedContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_dispatcher}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_dispatcher(CICSParser.Cics_inquire_dispatcherContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_doctemplate}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_doctemplate(CICSParser.Cics_inquire_doctemplateContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_dsname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_dsname(CICSParser.Cics_inquire_dsnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_dumpds}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_dumpds(CICSParser.Cics_inquire_dumpdsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_enq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_enq(CICSParser.Cics_inquire_enqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_enqmodel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_enqmodel(CICSParser.Cics_inquire_enqmodelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_epadapter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_epadapter(CICSParser.Cics_inquire_epadapterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_epadapterset}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_epadapterset(CICSParser.Cics_inquire_epadaptersetContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_epadaptinset}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_epadaptinset(CICSParser.Cics_inquire_epadaptinsetContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_eventbinding}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_eventbinding(CICSParser.Cics_inquire_eventbindingContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_eventprocess}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_eventprocess(CICSParser.Cics_inquire_eventprocessContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_exci}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_exci(CICSParser.Cics_inquire_exciContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_exitprogram}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_exitprogram(CICSParser.Cics_inquire_exitprogramContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_featurekey}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_featurekey(CICSParser.Cics_inquire_featurekeyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_file}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_file(CICSParser.Cics_inquire_fileContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_host}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_host(CICSParser.Cics_inquire_hostContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_ipconn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_ipconn(CICSParser.Cics_inquire_ipconnContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_ipfacility}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_ipfacility(CICSParser.Cics_inquire_ipfacilityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_irc}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_irc(CICSParser.Cics_inquire_ircContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_journalmodel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_journalmodel(CICSParser.Cics_inquire_journalmodelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_journalname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_journalname(CICSParser.Cics_inquire_journalnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_jvmendpoint}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_jvmendpoint(CICSParser.Cics_inquire_jvmendpointContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_jvmserver}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_jvmserver(CICSParser.Cics_inquire_jvmserverContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_library}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_library(CICSParser.Cics_inquire_libraryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_modename}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_modename(CICSParser.Cics_inquire_modenameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_monitor}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_monitor(CICSParser.Cics_inquire_monitorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_mqconn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_mqconn(CICSParser.Cics_inquire_mqconnContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_mqini}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_mqini(CICSParser.Cics_inquire_mqiniContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_mqmonitor}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_mqmonitor(CICSParser.Cics_inquire_mqmonitorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_mvstcb}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_mvstcb(CICSParser.Cics_inquire_mvstcbContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_nodejsapp}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_nodejsapp(CICSParser.Cics_inquire_nodejsappContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_osgibundle}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_osgibundle(CICSParser.Cics_inquire_osgibundleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_osgiservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_osgiservice(CICSParser.Cics_inquire_osgiserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_partner}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_partner(CICSParser.Cics_inquire_partnerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_pipeline}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_pipeline(CICSParser.Cics_inquire_pipelineContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_policy}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_policy(CICSParser.Cics_inquire_policyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_policyrule}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_policyrule(CICSParser.Cics_inquire_policyruleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_processtype}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_processtype(CICSParser.Cics_inquire_processtypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_profile}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_profile(CICSParser.Cics_inquire_profileContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_program}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_program(CICSParser.Cics_inquire_programContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_reqid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_reqid(CICSParser.Cics_inquire_reqidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_rrms}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_rrms(CICSParser.Cics_inquire_rrmsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_secdiscovery}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_secdiscovery(CICSParser.Cics_inquire_secdiscoveryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_secrecording}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_secrecording(CICSParser.Cics_inquire_secrecordingContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_statistics}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_statistics(CICSParser.Cics_inquire_statisticsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_storage}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_storage(CICSParser.Cics_inquire_storageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_storage64}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_storage64(CICSParser.Cics_inquire_storage64Context ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_streamname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_streamname(CICSParser.Cics_inquire_streamnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_subpool}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_subpool(CICSParser.Cics_inquire_subpoolContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_sysdumpcode}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_sysdumpcode(CICSParser.Cics_inquire_sysdumpcodeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_system}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_system(CICSParser.Cics_inquire_systemContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tag}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tag(CICSParser.Cics_inquire_tagContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_task}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_task(CICSParser.Cics_inquire_taskContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_task_list}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_task_list(CICSParser.Cics_inquire_task_listContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tclass}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tclass(CICSParser.Cics_inquire_tclassContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tcpip}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tcpip(CICSParser.Cics_inquire_tcpipContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tcpipservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tcpipservice(CICSParser.Cics_inquire_tcpipserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tdqueue}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tdqueue(CICSParser.Cics_inquire_tdqueueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tempstorage}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tempstorage(CICSParser.Cics_inquire_tempstorageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_netname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_netname(CICSParser.Cics_inquire_netnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_terminal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_terminal(CICSParser.Cics_inquire_terminalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tracedest}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tracedest(CICSParser.Cics_inquire_tracedestContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_traceflag}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_traceflag(CICSParser.Cics_inquire_traceflagContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tracetype}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tracetype(CICSParser.Cics_inquire_tracetypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tranclass}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tranclass(CICSParser.Cics_inquire_tranclassContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_trandumpcode}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_trandumpcode(CICSParser.Cics_inquire_trandumpcodeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_transaction}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_transaction(CICSParser.Cics_inquire_transactionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tsmodel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tsmodel(CICSParser.Cics_inquire_tsmodelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tspool}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tspool(CICSParser.Cics_inquire_tspoolContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_tsqueue}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_tsqueue(CICSParser.Cics_inquire_tsqueueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_uow}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_uow(CICSParser.Cics_inquire_uowContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_uowdsnfail}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_uowdsnfail(CICSParser.Cics_inquire_uowdsnfailContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_uowenq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_uowenq(CICSParser.Cics_inquire_uowenqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_uowlink}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_uowlink(CICSParser.Cics_inquire_uowlinkContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_urimap}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_urimap(CICSParser.Cics_inquire_urimapContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_vtam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_vtam(CICSParser.Cics_inquire_vtamContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_web}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_web(CICSParser.Cics_inquire_webContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_webservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_webservice(CICSParser.Cics_inquire_webserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_wlmhealth}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_wlmhealth(CICSParser.Cics_inquire_wlmhealthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inquire_xmltransform}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inquire_xmltransform(CICSParser.Cics_inquire_xmltransformContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_invoke}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_invoke(CICSParser.Cics_invokeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_invoke_application}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_invoke_application(CICSParser.Cics_invoke_applicationContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_invoke_service}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_invoke_service(CICSParser.Cics_invoke_serviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue(CICSParser.Cics_issueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_abend}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_abend(CICSParser.Cics_issue_abendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_abort}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_abort(CICSParser.Cics_issue_abortContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_add}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_add(CICSParser.Cics_issue_addContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_confirmation}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_confirmation(CICSParser.Cics_issue_confirmationContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_copy}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_copy(CICSParser.Cics_issue_copyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_disconnect}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_disconnect(CICSParser.Cics_issue_disconnectContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_end}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_end(CICSParser.Cics_issue_endContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_endfile_endoutput}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_endfile_endoutput(CICSParser.Cics_issue_endfile_endoutputContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_erase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_erase(CICSParser.Cics_issue_eraseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_erase_aup}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_erase_aup(CICSParser.Cics_issue_erase_aupContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_error}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_error(CICSParser.Cics_issue_errorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_load}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_load(CICSParser.Cics_issue_loadContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_note}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_note(CICSParser.Cics_issue_noteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_pass}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_pass(CICSParser.Cics_issue_passContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_prepare}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_prepare(CICSParser.Cics_issue_prepareContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_query}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_query(CICSParser.Cics_issue_queryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_receive}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_receive(CICSParser.Cics_issue_receiveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_replace}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_replace(CICSParser.Cics_issue_replaceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_send}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_send(CICSParser.Cics_issue_sendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_signal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_signal(CICSParser.Cics_issue_signalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_wait}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_wait(CICSParser.Cics_issue_waitContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_print}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_print(CICSParser.Cics_issue_printContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_eods}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_eods(CICSParser.Cics_issue_eodsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_issue_common}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_issue_common(CICSParser.Cics_issue_commonContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link(CICSParser.Cics_linkContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link_program}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link_program(CICSParser.Cics_link_programContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link_acqprocess}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link_acqprocess(CICSParser.Cics_link_acqprocessContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link_activity}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link_activity(CICSParser.Cics_link_activityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_link}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_link(CICSParser.Cics_exci_linkContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link_commarea_exci}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link_commarea_exci(CICSParser.Cics_link_commarea_exciContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link_channel_exci}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link_channel_exci(CICSParser.Cics_link_channel_exciContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_link_program_exci}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_link_program_exci(CICSParser.Cics_link_program_exciContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_delete}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_delete(CICSParser.Cics_exci_deleteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_delete_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_delete_container(CICSParser.Cics_exci_delete_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_endbrowse_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_endbrowse_container(CICSParser.Cics_exci_endbrowse_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_get_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_get_container(CICSParser.Cics_exci_get_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#exci_data_area}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitExci_data_area(CICSParser.Exci_data_areaContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_ref}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_ref(CICSParser.Cics_exci_refContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_get_next_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_get_next_container(CICSParser.Cics_exci_get_next_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_move_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_move_container(CICSParser.Cics_exci_move_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_put_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_put_container(CICSParser.Cics_exci_put_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_query_channel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_query_channel(CICSParser.Cics_exci_query_channelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_exci_startbrowse_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_exci_startbrowse_container(CICSParser.Cics_exci_startbrowse_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_load}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_load(CICSParser.Cics_loadContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_load_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_load_options(CICSParser.Cics_load_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_monitor}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_monitor(CICSParser.Cics_monitorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_monitor_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_monitor_options(CICSParser.Cics_monitor_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_move}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_move(CICSParser.Cics_moveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_move_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_move_body(CICSParser.Cics_move_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform(CICSParser.Cics_performContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_deletshipped}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_deletshipped(CICSParser.Cics_perform_deletshippedContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_dump}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_dump(CICSParser.Cics_perform_dumpContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_endaffinity}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_endaffinity(CICSParser.Cics_perform_endaffinityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_jvmserver}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_jvmserver(CICSParser.Cics_perform_jvmserverContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_pipeline}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_pipeline(CICSParser.Cics_perform_pipelineContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_resettime}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_resettime(CICSParser.Cics_perform_resettimeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_secdiscovery}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_secdiscovery(CICSParser.Cics_perform_secdiscoveryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_security}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_security(CICSParser.Cics_perform_securityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_shutdown}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_shutdown(CICSParser.Cics_perform_shutdownContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_ssl}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_ssl(CICSParser.Cics_perform_sslContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_perform_statistics}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_perform_statistics(CICSParser.Cics_perform_statisticsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_point}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_point(CICSParser.Cics_pointContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_point_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_point_options(CICSParser.Cics_point_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_pop}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_pop(CICSParser.Cics_popContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_pop_option}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_pop_option(CICSParser.Cics_pop_optionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_post}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_post(CICSParser.Cics_postContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_post_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_post_options(CICSParser.Cics_post_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_purge}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_purge(CICSParser.Cics_purgeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_push}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_push(CICSParser.Cics_pushContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_put_container}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_put_container(CICSParser.Cics_put_containerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_put_container_bts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_put_container_bts(CICSParser.Cics_put_container_btsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_put_container_channel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_put_container_channel(CICSParser.Cics_put_container_channelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_query}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_query(CICSParser.Cics_queryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_query_channel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_query_channel(CICSParser.Cics_query_channelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_query_counter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_query_counter(CICSParser.Cics_query_counterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_query_security}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_query_security(CICSParser.Cics_query_securityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_read}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_read(CICSParser.Cics_readContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_read_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_read_body(CICSParser.Cics_read_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_readnext_readprev}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_readnext_readprev(CICSParser.Cics_readnext_readprevContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_readnext_readprev_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_readnext_readprev_body(CICSParser.Cics_readnext_readprev_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_into_set}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_into_set(CICSParser.Cics_into_setContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_readq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_readq(CICSParser.Cics_readqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_readq_ts_td}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_readq_ts_td(CICSParser.Cics_readq_ts_tdContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_release}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_release(CICSParser.Cics_releaseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_release_option}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_release_option(CICSParser.Cics_release_optionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resync_entryname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resync_entryname(CICSParser.Cics_resync_entrynameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resync_entryname_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resync_entryname_opts(CICSParser.Cics_resync_entryname_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_remove}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_remove(CICSParser.Cics_removeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_remove_option}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_remove_option(CICSParser.Cics_remove_optionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_request}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_request(CICSParser.Cics_requestContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_request_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_request_body(CICSParser.Cics_request_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_reset}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_reset(CICSParser.Cics_resetContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_reset_acqprocess}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_reset_acqprocess(CICSParser.Cics_reset_acqprocessContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_reset_activity}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_reset_activity(CICSParser.Cics_reset_activityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resetbr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resetbr(CICSParser.Cics_resetbrContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resetbr_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resetbr_options(CICSParser.Cics_resetbr_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_restype}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_restype(CICSParser.Cics_restypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_subrestype}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_subrestype(CICSParser.Cics_subrestypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resume}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resume(CICSParser.Cics_resumeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resume_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resume_body(CICSParser.Cics_resume_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_retrieve}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_retrieve(CICSParser.Cics_retrieveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_retrieve_standard}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_retrieve_standard(CICSParser.Cics_retrieve_standardContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_retrieve_reattach}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_retrieve_reattach(CICSParser.Cics_retrieve_reattachContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_retrieve_subevent}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_retrieve_subevent(CICSParser.Cics_retrieve_subeventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_return}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_return(CICSParser.Cics_returnContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_return_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_return_body(CICSParser.Cics_return_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_rewind}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_rewind(CICSParser.Cics_rewindContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_rewind_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_rewind_opts(CICSParser.Cics_rewind_optsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_rewrite}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_rewrite(CICSParser.Cics_rewriteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_rewrite_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_rewrite_body(CICSParser.Cics_rewrite_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_route}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_route(CICSParser.Cics_routeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_route_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_route_body(CICSParser.Cics_route_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_run}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_run(CICSParser.Cics_runContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_run_default}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_run_default(CICSParser.Cics_run_defaultContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_run_transid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_run_transid(CICSParser.Cics_run_transidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set(CICSParser.Cics_setContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_association_usercorrdata}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_association_usercorrdata(CICSParser.Cics_set_association_usercorrdataContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_atomservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_atomservice(CICSParser.Cics_set_atomserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_autoinstall}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_autoinstall(CICSParser.Cics_set_autoinstallContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_brfacility}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_brfacility(CICSParser.Cics_set_brfacilityContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_bundle}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_bundle(CICSParser.Cics_set_bundleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_connection}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_connection(CICSParser.Cics_set_connectionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_db2conn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_db2conn(CICSParser.Cics_set_db2connContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_db2entry}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_db2entry(CICSParser.Cics_set_db2entryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_db2tran}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_db2tran(CICSParser.Cics_set_db2tranContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_deletshipped}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_deletshipped(CICSParser.Cics_set_deletshippedContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_dispatcher}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_dispatcher(CICSParser.Cics_set_dispatcherContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_doctemplate}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_doctemplate(CICSParser.Cics_set_doctemplateContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_dsname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_dsname(CICSParser.Cics_set_dsnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_dumpds}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_dumpds(CICSParser.Cics_set_dumpdsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_enqmodel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_enqmodel(CICSParser.Cics_set_enqmodelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_epadapter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_epadapter(CICSParser.Cics_set_epadapterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_epadapterset}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_epadapterset(CICSParser.Cics_set_epadaptersetContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_eventbinding}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_eventbinding(CICSParser.Cics_set_eventbindingContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_eventprocess}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_eventprocess(CICSParser.Cics_set_eventprocessContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_file}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_file(CICSParser.Cics_set_fileContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_host}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_host(CICSParser.Cics_set_hostContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_ipconn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_ipconn(CICSParser.Cics_set_ipconnContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_irc}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_irc(CICSParser.Cics_set_ircContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_journalname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_journalname(CICSParser.Cics_set_journalnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_journalnum}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_journalnum(CICSParser.Cics_set_journalnumContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_jvmendpoint}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_jvmendpoint(CICSParser.Cics_set_jvmendpointContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_jvmserver}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_jvmserver(CICSParser.Cics_set_jvmserverContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_library}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_library(CICSParser.Cics_set_libraryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_modename}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_modename(CICSParser.Cics_set_modenameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_monitor}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_monitor(CICSParser.Cics_set_monitorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_mqconn}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_mqconn(CICSParser.Cics_set_mqconnContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_mqmonitor}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_mqmonitor(CICSParser.Cics_set_mqmonitorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_netname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_netname(CICSParser.Cics_set_netnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_otel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_otel(CICSParser.Cics_set_otelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_pipeline}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_pipeline(CICSParser.Cics_set_pipelineContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_processtype}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_processtype(CICSParser.Cics_set_processtypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_program}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_program(CICSParser.Cics_set_programContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_secdiscovery}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_secdiscovery(CICSParser.Cics_set_secdiscoveryContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_secrecording}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_secrecording(CICSParser.Cics_set_secrecordingContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_statistics}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_statistics(CICSParser.Cics_set_statisticsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_sysdumpcode}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_sysdumpcode(CICSParser.Cics_set_sysdumpcodeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_system}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_system(CICSParser.Cics_set_systemContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tags_refresh}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tags_refresh(CICSParser.Cics_set_tags_refreshContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_task}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_task(CICSParser.Cics_set_taskContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tclass}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tclass(CICSParser.Cics_set_tclassContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tcpip}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tcpip(CICSParser.Cics_set_tcpipContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tcpipservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tcpipservice(CICSParser.Cics_set_tcpipserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tdqueue}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tdqueue(CICSParser.Cics_set_tdqueueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tempstorage}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tempstorage(CICSParser.Cics_set_tempstorageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_terminal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_terminal(CICSParser.Cics_set_terminalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tracedest}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tracedest(CICSParser.Cics_set_tracedestContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_traceflag}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_traceflag(CICSParser.Cics_set_traceflagContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tracetype}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tracetype(CICSParser.Cics_set_tracetypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tranclass}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tranclass(CICSParser.Cics_set_tranclassContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_trandumpcode}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_trandumpcode(CICSParser.Cics_set_trandumpcodeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_transaction}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_transaction(CICSParser.Cics_set_transactionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_tsqueue}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_tsqueue(CICSParser.Cics_set_tsqueueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_uow}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_uow(CICSParser.Cics_set_uowContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_uowlink}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_uowlink(CICSParser.Cics_set_uowlinkContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_urimap}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_urimap(CICSParser.Cics_set_urimapContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_volume}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_volume(CICSParser.Cics_set_volumeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_vtam}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_vtam(CICSParser.Cics_set_vtamContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_web}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_web(CICSParser.Cics_set_webContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_webservice}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_webservice(CICSParser.Cics_set_webserviceContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_wlmhealth}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_wlmhealth(CICSParser.Cics_set_wlmhealthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_set_xmltransform}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_set_xmltransform(CICSParser.Cics_set_xmltransformContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_signal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_signal(CICSParser.Cics_signalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_signal_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_signal_options(CICSParser.Cics_signal_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_signoff}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_signoff(CICSParser.Cics_signoffContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_signon}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_signon(CICSParser.Cics_signonContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_signon_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_signon_body(CICSParser.Cics_signon_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_signon_token_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_signon_token_body(CICSParser.Cics_signon_token_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_soapfault}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_soapfault(CICSParser.Cics_soapfaultContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_soapfault_add}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_soapfault_add(CICSParser.Cics_soapfault_addContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_soapfault_create}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_soapfault_create(CICSParser.Cics_soapfault_createContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_soapfault_delete}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_soapfault_delete(CICSParser.Cics_soapfault_deleteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolclose}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolclose(CICSParser.Cics_spoolcloseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolclose_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolclose_options(CICSParser.Cics_spoolclose_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolopen}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolopen(CICSParser.Cics_spoolopenContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolopen_input}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolopen_input(CICSParser.Cics_spoolopen_inputContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolopen_output}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolopen_output(CICSParser.Cics_spoolopen_outputContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolread}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolread(CICSParser.Cics_spoolreadContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolread_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolread_options(CICSParser.Cics_spoolread_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolwrite}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolwrite(CICSParser.Cics_spoolwriteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_spoolwrite_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_spoolwrite_options(CICSParser.Cics_spoolwrite_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_start}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_start(CICSParser.Cics_startContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_start_transid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_start_transid(CICSParser.Cics_start_transidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_start_attach}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_start_attach(CICSParser.Cics_start_attachContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_start_brexit}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_start_brexit(CICSParser.Cics_start_brexitContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_start_channel}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_start_channel(CICSParser.Cics_start_channelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_zero_digit}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_zero_digit(CICSParser.Cics_zero_digitContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_startbr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_startbr(CICSParser.Cics_startbrContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_startbr_options}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_startbr_options(CICSParser.Cics_startbr_optionsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_startbrowse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_startbrowse(CICSParser.Cics_startbrowseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_startbrowse_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_startbrowse_body(CICSParser.Cics_startbrowse_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_startbrowse_processWithValue_subrule}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_startbrowse_processWithValue_subrule(CICSParser.Cics_startbrowse_processWithValue_subruleContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_suspend}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_suspend(CICSParser.Cics_suspendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_suspend_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_suspend_body(CICSParser.Cics_suspend_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_syncpoint}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_syncpoint(CICSParser.Cics_syncpointContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_syncpoint_rollback}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_syncpoint_rollback(CICSParser.Cics_syncpoint_rollbackContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_test}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_test(CICSParser.Cics_testContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_test_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_test_body(CICSParser.Cics_test_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_transform}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_transform(CICSParser.Cics_transformContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_transform_json}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_transform_json(CICSParser.Cics_transform_jsonContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_transform_xml}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_transform_xml(CICSParser.Cics_transform_xmlContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_unlock}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_unlock(CICSParser.Cics_unlockContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_unlock_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_unlock_body(CICSParser.Cics_unlock_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_update}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_update(CICSParser.Cics_updateContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_update_counter_dcounter}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_update_counter_dcounter(CICSParser.Cics_update_counter_dcounterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_verify}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_verify(CICSParser.Cics_verifyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_verify_password}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_verify_password(CICSParser.Cics_verify_passwordContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_verify_phrase}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_verify_phrase(CICSParser.Cics_verify_phraseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_verify_token}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_verify_token(CICSParser.Cics_verify_tokenContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait(CICSParser.Cics_waitContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait_convid}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait_convid(CICSParser.Cics_wait_convidContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait_event}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait_event(CICSParser.Cics_wait_eventContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait_external}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait_external(CICSParser.Cics_wait_externalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait_journalname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait_journalname(CICSParser.Cics_wait_journalnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait_signal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait_signal(CICSParser.Cics_wait_signalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wait_terminal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wait_terminal(CICSParser.Cics_wait_terminalContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_waitcics}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_waitcics(CICSParser.Cics_waitcicsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_waitcics_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_waitcics_body(CICSParser.Cics_waitcics_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web(CICSParser.Cics_webContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_close}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_close(CICSParser.Cics_web_closeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_converse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_converse(CICSParser.Cics_web_converseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_endbrowse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_endbrowse(CICSParser.Cics_web_endbrowseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_extract}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_extract(CICSParser.Cics_web_extractContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_open}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_open(CICSParser.Cics_web_openContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_parse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_parse(CICSParser.Cics_web_parseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_read}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_read(CICSParser.Cics_web_readContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_readnext}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_readnext(CICSParser.Cics_web_readnextContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_receive}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_receive(CICSParser.Cics_web_receiveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_retrieve}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_retrieve(CICSParser.Cics_web_retrieveContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_send}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_send(CICSParser.Cics_web_sendContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_startbrowse}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_startbrowse(CICSParser.Cics_web_startbrowseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_web_write}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_web_write(CICSParser.Cics_web_writeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_write}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_write(CICSParser.Cics_writeContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_write_file}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_write_file(CICSParser.Cics_write_fileContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_write_journalname}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_write_journalname(CICSParser.Cics_write_journalnameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_write_operator}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_write_operator(CICSParser.Cics_write_operatorContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_writeq}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_writeq(CICSParser.Cics_writeqContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_writeq_td}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_writeq_td(CICSParser.Cics_writeq_tdContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_writeq_ts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_writeq_ts(CICSParser.Cics_writeq_tsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wsacontext}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wsacontext(CICSParser.Cics_wsacontextContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wsacontext_build}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wsacontext_build(CICSParser.Cics_wsacontext_buildContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wsacontext_delete}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wsacontext_delete(CICSParser.Cics_wsacontext_deleteContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wsacontext_get}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wsacontext_get(CICSParser.Cics_wsacontext_getContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wsaepr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wsaepr(CICSParser.Cics_wsaeprContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_wsaepr_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_wsaepr_body(CICSParser.Cics_wsaepr_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_xctl}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_xctl(CICSParser.Cics_xctlContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_xctl_body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_xctl_body(CICSParser.Cics_xctl_bodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_file_name}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_file_name(CICSParser.Cics_file_nameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_resp}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_resp(CICSParser.Cics_respContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_handle_response}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_handle_response(CICSParser.Cics_handle_responseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_inline_handle_exception}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_inline_handle_exception(CICSParser.Cics_inline_handle_exceptionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_data_area}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_data_area(CICSParser.Cics_data_areaContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_data_value}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_data_value(CICSParser.Cics_data_valueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_cvda}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_cvda(CICSParser.Cics_cvdaContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_name}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_name(CICSParser.Cics_nameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_ref}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_ref(CICSParser.Cics_refContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_rebuild}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_rebuild(CICSParser.Cics_rebuildContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_hhmmss}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_hhmmss(CICSParser.Cics_hhmmssContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_label}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_label(CICSParser.Cics_labelContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_value}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_value(CICSParser.Cics_valueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cicsWord}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCicsWord(CICSParser.CicsWordContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cicsWords}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCicsWords(CICSParser.CicsWordsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cicsLexerDefinedVariableUsageTokens}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCicsLexerDefinedVariableUsageTokens(CICSParser.CicsLexerDefinedVariableUsageTokensContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#name}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitName(CICSParser.NameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#data_value}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitData_value(CICSParser.Data_valueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#data_area}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitData_area(CICSParser.Data_areaContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cvda}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCvda(CICSParser.CvdaContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#ptr_ref}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPtr_ref(CICSParser.Ptr_refContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#ptr_value}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPtr_value(CICSParser.Ptr_valueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cics_document_set_symbollist}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCics_document_set_symbollist(CICSParser.Cics_document_set_symbollistContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#hhmmss}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitHhmmss(CICSParser.HhmmssContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#paragraphNameUsage}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParagraphNameUsage(CICSParser.ParagraphNameUsageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#variableNameUsage}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitVariableNameUsage(CICSParser.VariableNameUsageContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#generalIdentifier}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitGeneralIdentifier(CICSParser.GeneralIdentifierContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#functionCall}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunctionCall(CICSParser.FunctionCallContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#referenceModifier}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitReferenceModifier(CICSParser.ReferenceModifierContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#characterPosition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCharacterPosition(CICSParser.CharacterPositionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#length}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLength(CICSParser.LengthContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#argument}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitArgument(CICSParser.ArgumentContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#qualifiedDataName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQualifiedDataName(CICSParser.QualifiedDataNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#tableCall}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTableCall(CICSParser.TableCallContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#specialRegister}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSpecialRegister(CICSParser.SpecialRegisterContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#inData}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInData(CICSParser.InDataContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#dataName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDataName(CICSParser.DataNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#functionName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunctionName(CICSParser.FunctionNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#figurativeConstant}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFigurativeConstant(CICSParser.FigurativeConstantContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#booleanLiteral}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBooleanLiteral(CICSParser.BooleanLiteralContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#numericLiteral}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNumericLiteral(CICSParser.NumericLiteralContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#integerLiteral}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIntegerLiteral(CICSParser.IntegerLiteralContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cicsDfhValue}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCicsDfhValue(CICSParser.CicsDfhValueContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cicsDfhResp}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCicsDfhResp(CICSParser.CicsDfhRespContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#literal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLiteral(CICSParser.LiteralContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#arithmeticExpression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitArithmeticExpression(CICSParser.ArithmeticExpressionContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#plusMinus}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPlusMinus(CICSParser.PlusMinusContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#multDivs}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMultDivs(CICSParser.MultDivsContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#multDiv}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMultDiv(CICSParser.MultDivContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#powers}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPowers(CICSParser.PowersContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#power}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPower(CICSParser.PowerContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#basis}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBasis(CICSParser.BasisContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#commaClause}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCommaClause(CICSParser.CommaClauseContext ctx);
	/**
	 * Visit a parse tree produced by {@link CICSParser#cvda_opts}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCvda_opts(CICSParser.Cvda_optsContext ctx);
}