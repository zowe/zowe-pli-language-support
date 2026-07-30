// Generated from C:/workspace_nodejs/zowe-pli-language-support/packages/preprocessor-cics/src/antlr/CICSParser.g4 by ANTLR 4.13.2

import { MessageServiceParser } from "../antlr/message-service-parser";

import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link CICSParser}.
 */
public interface CICSParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link CICSParser#startRule}.
	 * @param ctx the parse tree
	 */
	void enterStartRule(CICSParser.StartRuleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#startRule}.
	 * @param ctx the parse tree
	 */
	void exitStartRule(CICSParser.StartRuleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#allCicsRule}.
	 * @param ctx the parse tree
	 */
	void enterAllCicsRule(CICSParser.AllCicsRuleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#allCicsRule}.
	 * @param ctx the parse tree
	 */
	void exitAllCicsRule(CICSParser.AllCicsRuleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#allExciRules}.
	 * @param ctx the parse tree
	 */
	void enterAllExciRules(CICSParser.AllExciRulesContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#allExciRules}.
	 * @param ctx the parse tree
	 */
	void exitAllExciRules(CICSParser.AllExciRulesContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#allSPRules}.
	 * @param ctx the parse tree
	 */
	void enterAllSPRules(CICSParser.AllSPRulesContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#allSPRules}.
	 * @param ctx the parse tree
	 */
	void exitAllSPRules(CICSParser.AllSPRulesContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_receive}.
	 * @param ctx the parse tree
	 */
	void enterCics_receive(CICSParser.Cics_receiveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_receive}.
	 * @param ctx the parse tree
	 */
	void exitCics_receive(CICSParser.Cics_receiveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_receive_group_one}.
	 * @param ctx the parse tree
	 */
	void enterCics_receive_group_one(CICSParser.Cics_receive_group_oneContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_receive_group_one}.
	 * @param ctx the parse tree
	 */
	void exitCics_receive_group_one(CICSParser.Cics_receive_group_oneContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_receive_partn}.
	 * @param ctx the parse tree
	 */
	void enterCics_receive_partn(CICSParser.Cics_receive_partnContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_receive_partn}.
	 * @param ctx the parse tree
	 */
	void exitCics_receive_partn(CICSParser.Cics_receive_partnContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_receive_map}.
	 * @param ctx the parse tree
	 */
	void enterCics_receive_map(CICSParser.Cics_receive_mapContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_receive_map}.
	 * @param ctx the parse tree
	 */
	void exitCics_receive_map(CICSParser.Cics_receive_mapContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_receive_map_mappingdev}.
	 * @param ctx the parse tree
	 */
	void enterCics_receive_map_mappingdev(CICSParser.Cics_receive_map_mappingdevContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_receive_map_mappingdev}.
	 * @param ctx the parse tree
	 */
	void exitCics_receive_map_mappingdev(CICSParser.Cics_receive_map_mappingdevContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send}.
	 * @param ctx the parse tree
	 */
	void enterCics_send(CICSParser.Cics_sendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send}.
	 * @param ctx the parse tree
	 */
	void exitCics_send(CICSParser.Cics_sendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_group1}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_group1(CICSParser.Cics_send_group1Context ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_group1}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_group1(CICSParser.Cics_send_group1Context ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_control_map}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_control_map(CICSParser.Cics_send_control_mapContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_control_map}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_control_map(CICSParser.Cics_send_control_mapContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_mappingdev}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_mappingdev(CICSParser.Cics_send_mappingdevContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_mappingdev}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_mappingdev(CICSParser.Cics_send_mappingdevContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_page}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_page(CICSParser.Cics_send_pageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_page}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_page(CICSParser.Cics_send_pageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_partnset}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_partnset(CICSParser.Cics_send_partnsetContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_partnset}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_partnset(CICSParser.Cics_send_partnsetContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_text}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_text(CICSParser.Cics_send_textContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_text}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_text(CICSParser.Cics_send_textContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_text_mapped}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_text_mapped(CICSParser.Cics_send_text_mappedContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_text_mapped}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_text_mapped(CICSParser.Cics_send_text_mappedContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_send_text_noedit}.
	 * @param ctx the parse tree
	 */
	void enterCics_send_text_noedit(CICSParser.Cics_send_text_noeditContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_send_text_noedit}.
	 * @param ctx the parse tree
	 */
	void exitCics_send_text_noedit(CICSParser.Cics_send_text_noeditContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converse}.
	 * @param ctx the parse tree
	 */
	void enterCics_converse(CICSParser.Cics_converseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converse}.
	 * @param ctx the parse tree
	 */
	void exitCics_converse(CICSParser.Cics_converseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converse_group}.
	 * @param ctx the parse tree
	 */
	void enterCics_converse_group(CICSParser.Cics_converse_groupContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converse_group}.
	 * @param ctx the parse tree
	 */
	void exitCics_converse_group(CICSParser.Cics_converse_groupContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converse_erase}.
	 * @param ctx the parse tree
	 */
	void enterCics_converse_erase(CICSParser.Cics_converse_eraseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converse_erase}.
	 * @param ctx the parse tree
	 */
	void exitCics_converse_erase(CICSParser.Cics_converse_eraseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converse_fromlength}.
	 * @param ctx the parse tree
	 */
	void enterCics_converse_fromlength(CICSParser.Cics_converse_fromlengthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converse_fromlength}.
	 * @param ctx the parse tree
	 */
	void exitCics_converse_fromlength(CICSParser.Cics_converse_fromlengthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_into}.
	 * @param ctx the parse tree
	 */
	void enterCics_into(CICSParser.Cics_intoContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_into}.
	 * @param ctx the parse tree
	 */
	void exitCics_into(CICSParser.Cics_intoContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converse_tolength}.
	 * @param ctx the parse tree
	 */
	void enterCics_converse_tolength(CICSParser.Cics_converse_tolengthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converse_tolength}.
	 * @param ctx the parse tree
	 */
	void exitCics_converse_tolength(CICSParser.Cics_converse_tolengthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_maxlength}.
	 * @param ctx the parse tree
	 */
	void enterCics_maxlength(CICSParser.Cics_maxlengthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_maxlength}.
	 * @param ctx the parse tree
	 */
	void exitCics_maxlength(CICSParser.Cics_maxlengthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_abend}.
	 * @param ctx the parse tree
	 */
	void enterCics_abend(CICSParser.Cics_abendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_abend}.
	 * @param ctx the parse tree
	 */
	void exitCics_abend(CICSParser.Cics_abendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_abend_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_abend_opts(CICSParser.Cics_abend_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_abend_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_abend_opts(CICSParser.Cics_abend_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_acquire}.
	 * @param ctx the parse tree
	 */
	void enterCics_acquire(CICSParser.Cics_acquireContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_acquire}.
	 * @param ctx the parse tree
	 */
	void exitCics_acquire(CICSParser.Cics_acquireContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_acquire_process}.
	 * @param ctx the parse tree
	 */
	void enterCics_acquire_process(CICSParser.Cics_acquire_processContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_acquire_process}.
	 * @param ctx the parse tree
	 */
	void exitCics_acquire_process(CICSParser.Cics_acquire_processContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_acquire_activityId}.
	 * @param ctx the parse tree
	 */
	void enterCics_acquire_activityId(CICSParser.Cics_acquire_activityIdContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_acquire_activityId}.
	 * @param ctx the parse tree
	 */
	void exitCics_acquire_activityId(CICSParser.Cics_acquire_activityIdContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_acquire_terminal}.
	 * @param ctx the parse tree
	 */
	void enterCics_acquire_terminal(CICSParser.Cics_acquire_terminalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_acquire_terminal}.
	 * @param ctx the parse tree
	 */
	void exitCics_acquire_terminal(CICSParser.Cics_acquire_terminalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_acquire_terminal_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_acquire_terminal_body(CICSParser.Cics_acquire_terminal_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_acquire_terminal_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_acquire_terminal_body(CICSParser.Cics_acquire_terminal_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_add}.
	 * @param ctx the parse tree
	 */
	void enterCics_add(CICSParser.Cics_addContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_add}.
	 * @param ctx the parse tree
	 */
	void exitCics_add(CICSParser.Cics_addContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#ciss_add_event_subevent}.
	 * @param ctx the parse tree
	 */
	void enterCiss_add_event_subevent(CICSParser.Ciss_add_event_subeventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#ciss_add_event_subevent}.
	 * @param ctx the parse tree
	 */
	void exitCiss_add_event_subevent(CICSParser.Ciss_add_event_subeventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_address}.
	 * @param ctx the parse tree
	 */
	void enterCics_address(CICSParser.Cics_addressContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_address}.
	 * @param ctx the parse tree
	 */
	void exitCics_address(CICSParser.Cics_addressContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_address_standard}.
	 * @param ctx the parse tree
	 */
	void enterCics_address_standard(CICSParser.Cics_address_standardContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_address_standard}.
	 * @param ctx the parse tree
	 */
	void exitCics_address_standard(CICSParser.Cics_address_standardContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_address_set}.
	 * @param ctx the parse tree
	 */
	void enterCics_address_set(CICSParser.Cics_address_setContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_address_set}.
	 * @param ctx the parse tree
	 */
	void exitCics_address_set(CICSParser.Cics_address_setContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_allocate}.
	 * @param ctx the parse tree
	 */
	void enterCics_allocate(CICSParser.Cics_allocateContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_allocate}.
	 * @param ctx the parse tree
	 */
	void exitCics_allocate(CICSParser.Cics_allocateContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_allocate_appc_mro_lut61_sysid}.
	 * @param ctx the parse tree
	 */
	void enterCics_allocate_appc_mro_lut61_sysid(CICSParser.Cics_allocate_appc_mro_lut61_sysidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_allocate_appc_mro_lut61_sysid}.
	 * @param ctx the parse tree
	 */
	void exitCics_allocate_appc_mro_lut61_sysid(CICSParser.Cics_allocate_appc_mro_lut61_sysidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_allocate_lut61_session}.
	 * @param ctx the parse tree
	 */
	void enterCics_allocate_lut61_session(CICSParser.Cics_allocate_lut61_sessionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_allocate_lut61_session}.
	 * @param ctx the parse tree
	 */
	void exitCics_allocate_lut61_session(CICSParser.Cics_allocate_lut61_sessionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_allocate_appc_partner}.
	 * @param ctx the parse tree
	 */
	void enterCics_allocate_appc_partner(CICSParser.Cics_allocate_appc_partnerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_allocate_appc_partner}.
	 * @param ctx the parse tree
	 */
	void exitCics_allocate_appc_partner(CICSParser.Cics_allocate_appc_partnerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_asktime}.
	 * @param ctx the parse tree
	 */
	void enterCics_asktime(CICSParser.Cics_asktimeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_asktime}.
	 * @param ctx the parse tree
	 */
	void exitCics_asktime(CICSParser.Cics_asktimeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_asktime_abstime}.
	 * @param ctx the parse tree
	 */
	void enterCics_asktime_abstime(CICSParser.Cics_asktime_abstimeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_asktime_abstime}.
	 * @param ctx the parse tree
	 */
	void exitCics_asktime_abstime(CICSParser.Cics_asktime_abstimeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_assign}.
	 * @param ctx the parse tree
	 */
	void enterCics_assign(CICSParser.Cics_assignContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_assign}.
	 * @param ctx the parse tree
	 */
	void exitCics_assign(CICSParser.Cics_assignContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_assign_parameter1}.
	 * @param ctx the parse tree
	 */
	void enterCics_assign_parameter1(CICSParser.Cics_assign_parameter1Context ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_assign_parameter1}.
	 * @param ctx the parse tree
	 */
	void exitCics_assign_parameter1(CICSParser.Cics_assign_parameter1Context ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_assign_parameter2}.
	 * @param ctx the parse tree
	 */
	void enterCics_assign_parameter2(CICSParser.Cics_assign_parameter2Context ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_assign_parameter2}.
	 * @param ctx the parse tree
	 */
	void exitCics_assign_parameter2(CICSParser.Cics_assign_parameter2Context ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd(CICSParser.Cics_csdContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd(CICSParser.Cics_csdContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_add}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_add(CICSParser.Cics_csd_addContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_add}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_add(CICSParser.Cics_csd_addContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_alter}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_alter(CICSParser.Cics_csd_alterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_alter}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_alter(CICSParser.Cics_csd_alterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_append}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_append(CICSParser.Cics_csd_appendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_append}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_append(CICSParser.Cics_csd_appendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_copy}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_copy(CICSParser.Cics_csd_copyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_copy}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_copy(CICSParser.Cics_csd_copyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_define}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_define(CICSParser.Cics_csd_defineContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_define}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_define(CICSParser.Cics_csd_defineContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_delete}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_delete(CICSParser.Cics_csd_deleteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_delete}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_delete(CICSParser.Cics_csd_deleteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_disconnect}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_disconnect(CICSParser.Cics_csd_disconnectContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_disconnect}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_disconnect(CICSParser.Cics_csd_disconnectContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_endbrgroup}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_endbrgroup(CICSParser.Cics_csd_endbrgroupContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_endbrgroup}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_endbrgroup(CICSParser.Cics_csd_endbrgroupContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_endbrlist}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_endbrlist(CICSParser.Cics_csd_endbrlistContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_endbrlist}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_endbrlist(CICSParser.Cics_csd_endbrlistContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_endbrrsrce}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_endbrrsrce(CICSParser.Cics_csd_endbrrsrceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_endbrrsrce}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_endbrrsrce(CICSParser.Cics_csd_endbrrsrceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_getnextgroup}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_getnextgroup(CICSParser.Cics_csd_getnextgroupContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_getnextgroup}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_getnextgroup(CICSParser.Cics_csd_getnextgroupContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_getnextlist}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_getnextlist(CICSParser.Cics_csd_getnextlistContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_getnextlist}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_getnextlist(CICSParser.Cics_csd_getnextlistContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_getnextrsrce}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_getnextrsrce(CICSParser.Cics_csd_getnextrsrceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_getnextrsrce}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_getnextrsrce(CICSParser.Cics_csd_getnextrsrceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_inquiregroup}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_inquiregroup(CICSParser.Cics_csd_inquiregroupContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_inquiregroup}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_inquiregroup(CICSParser.Cics_csd_inquiregroupContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_inquirelist}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_inquirelist(CICSParser.Cics_csd_inquirelistContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_inquirelist}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_inquirelist(CICSParser.Cics_csd_inquirelistContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_inquirersrce}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_inquirersrce(CICSParser.Cics_csd_inquirersrceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_inquirersrce}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_inquirersrce(CICSParser.Cics_csd_inquirersrceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_install}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_install(CICSParser.Cics_csd_installContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_install}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_install(CICSParser.Cics_csd_installContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_lock}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_lock(CICSParser.Cics_csd_lockContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_lock}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_lock(CICSParser.Cics_csd_lockContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_remove}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_remove(CICSParser.Cics_csd_removeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_remove}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_remove(CICSParser.Cics_csd_removeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_rename}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_rename(CICSParser.Cics_csd_renameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_rename}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_rename(CICSParser.Cics_csd_renameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_startbrgroup}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_startbrgroup(CICSParser.Cics_csd_startbrgroupContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_startbrgroup}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_startbrgroup(CICSParser.Cics_csd_startbrgroupContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_startbrlist}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_startbrlist(CICSParser.Cics_csd_startbrlistContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_startbrlist}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_startbrlist(CICSParser.Cics_csd_startbrlistContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_startbrrsrce}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_startbrrsrce(CICSParser.Cics_csd_startbrrsrceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_startbrrsrce}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_startbrrsrce(CICSParser.Cics_csd_startbrrsrceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_unlock}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_unlock(CICSParser.Cics_csd_unlockContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_unlock}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_unlock(CICSParser.Cics_csd_unlockContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_userdefine}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_userdefine(CICSParser.Cics_csd_userdefineContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_userdefine}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_userdefine(CICSParser.Cics_csd_userdefineContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_csd_cvda}.
	 * @param ctx the parse tree
	 */
	void enterCics_csd_cvda(CICSParser.Cics_csd_cvdaContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_csd_cvda}.
	 * @param ctx the parse tree
	 */
	void exitCics_csd_cvda(CICSParser.Cics_csd_cvdaContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_bif}.
	 * @param ctx the parse tree
	 */
	void enterCics_bif(CICSParser.Cics_bifContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_bif}.
	 * @param ctx the parse tree
	 */
	void exitCics_bif(CICSParser.Cics_bifContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_bif_deedit}.
	 * @param ctx the parse tree
	 */
	void enterCics_bif_deedit(CICSParser.Cics_bif_deeditContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_bif_deedit}.
	 * @param ctx the parse tree
	 */
	void exitCics_bif_deedit(CICSParser.Cics_bif_deeditContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_bif_digest}.
	 * @param ctx the parse tree
	 */
	void enterCics_bif_digest(CICSParser.Cics_bif_digestContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_bif_digest}.
	 * @param ctx the parse tree
	 */
	void exitCics_bif_digest(CICSParser.Cics_bif_digestContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_build}.
	 * @param ctx the parse tree
	 */
	void enterCics_build(CICSParser.Cics_buildContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_build}.
	 * @param ctx the parse tree
	 */
	void exitCics_build(CICSParser.Cics_buildContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_build_attach}.
	 * @param ctx the parse tree
	 */
	void enterCics_build_attach(CICSParser.Cics_build_attachContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_build_attach}.
	 * @param ctx the parse tree
	 */
	void exitCics_build_attach(CICSParser.Cics_build_attachContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_cancel}.
	 * @param ctx the parse tree
	 */
	void enterCics_cancel(CICSParser.Cics_cancelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_cancel}.
	 * @param ctx the parse tree
	 */
	void exitCics_cancel(CICSParser.Cics_cancelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_cancel_bts}.
	 * @param ctx the parse tree
	 */
	void enterCics_cancel_bts(CICSParser.Cics_cancel_btsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_cancel_bts}.
	 * @param ctx the parse tree
	 */
	void exitCics_cancel_bts(CICSParser.Cics_cancel_btsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_cancel_reqid}.
	 * @param ctx the parse tree
	 */
	void enterCics_cancel_reqid(CICSParser.Cics_cancel_reqidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_cancel_reqid}.
	 * @param ctx the parse tree
	 */
	void exitCics_cancel_reqid(CICSParser.Cics_cancel_reqidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_change}.
	 * @param ctx the parse tree
	 */
	void enterCics_change(CICSParser.Cics_changeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_change}.
	 * @param ctx the parse tree
	 */
	void exitCics_change(CICSParser.Cics_changeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_change_phrase}.
	 * @param ctx the parse tree
	 */
	void enterCics_change_phrase(CICSParser.Cics_change_phraseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_change_phrase}.
	 * @param ctx the parse tree
	 */
	void exitCics_change_phrase(CICSParser.Cics_change_phraseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_change_password}.
	 * @param ctx the parse tree
	 */
	void enterCics_change_password(CICSParser.Cics_change_passwordContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_change_password}.
	 * @param ctx the parse tree
	 */
	void exitCics_change_password(CICSParser.Cics_change_passwordContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_change_task}.
	 * @param ctx the parse tree
	 */
	void enterCics_change_task(CICSParser.Cics_change_taskContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_change_task}.
	 * @param ctx the parse tree
	 */
	void exitCics_change_task(CICSParser.Cics_change_taskContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_password_phrase}.
	 * @param ctx the parse tree
	 */
	void enterCics_password_phrase(CICSParser.Cics_password_phraseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_password_phrase}.
	 * @param ctx the parse tree
	 */
	void exitCics_password_phrase(CICSParser.Cics_password_phraseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_check}.
	 * @param ctx the parse tree
	 */
	void enterCics_check(CICSParser.Cics_checkContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_check}.
	 * @param ctx the parse tree
	 */
	void exitCics_check(CICSParser.Cics_checkContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_check_activity}.
	 * @param ctx the parse tree
	 */
	void enterCics_check_activity(CICSParser.Cics_check_activityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_check_activity}.
	 * @param ctx the parse tree
	 */
	void exitCics_check_activity(CICSParser.Cics_check_activityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_check_timer}.
	 * @param ctx the parse tree
	 */
	void enterCics_check_timer(CICSParser.Cics_check_timerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_check_timer}.
	 * @param ctx the parse tree
	 */
	void exitCics_check_timer(CICSParser.Cics_check_timerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_collect_statistics}.
	 * @param ctx the parse tree
	 */
	void enterCics_collect_statistics(CICSParser.Cics_collect_statisticsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_collect_statistics}.
	 * @param ctx the parse tree
	 */
	void exitCics_collect_statistics(CICSParser.Cics_collect_statisticsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_collect_statistics_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_collect_statistics_opts(CICSParser.Cics_collect_statistics_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_collect_statistics_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_collect_statistics_opts(CICSParser.Cics_collect_statistics_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_conditions}.
	 * @param ctx the parse tree
	 */
	void enterCics_conditions(CICSParser.Cics_conditionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_conditions}.
	 * @param ctx the parse tree
	 */
	void exitCics_conditions(CICSParser.Cics_conditionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_connect}.
	 * @param ctx the parse tree
	 */
	void enterCics_connect(CICSParser.Cics_connectContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_connect}.
	 * @param ctx the parse tree
	 */
	void exitCics_connect(CICSParser.Cics_connectContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_connect_process}.
	 * @param ctx the parse tree
	 */
	void enterCics_connect_process(CICSParser.Cics_connect_processContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_connect_process}.
	 * @param ctx the parse tree
	 */
	void exitCics_connect_process(CICSParser.Cics_connect_processContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converttime}.
	 * @param ctx the parse tree
	 */
	void enterCics_converttime(CICSParser.Cics_converttimeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converttime}.
	 * @param ctx the parse tree
	 */
	void exitCics_converttime(CICSParser.Cics_converttimeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_converttime_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_converttime_opts(CICSParser.Cics_converttime_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_converttime_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_converttime_opts(CICSParser.Cics_converttime_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_create}.
	 * @param ctx the parse tree
	 */
	void enterCics_create(CICSParser.Cics_createContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_create}.
	 * @param ctx the parse tree
	 */
	void exitCics_create(CICSParser.Cics_createContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_create_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_create_opts(CICSParser.Cics_create_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_create_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_create_opts(CICSParser.Cics_create_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define}.
	 * @param ctx the parse tree
	 */
	void enterCics_define(CICSParser.Cics_defineContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define}.
	 * @param ctx the parse tree
	 */
	void exitCics_define(CICSParser.Cics_defineContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define_activity}.
	 * @param ctx the parse tree
	 */
	void enterCics_define_activity(CICSParser.Cics_define_activityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define_activity}.
	 * @param ctx the parse tree
	 */
	void exitCics_define_activity(CICSParser.Cics_define_activityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define_composite_event}.
	 * @param ctx the parse tree
	 */
	void enterCics_define_composite_event(CICSParser.Cics_define_composite_eventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define_composite_event}.
	 * @param ctx the parse tree
	 */
	void exitCics_define_composite_event(CICSParser.Cics_define_composite_eventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void enterCics_define_counter_dcounter(CICSParser.Cics_define_counter_dcounterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void exitCics_define_counter_dcounter(CICSParser.Cics_define_counter_dcounterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define_input_event}.
	 * @param ctx the parse tree
	 */
	void enterCics_define_input_event(CICSParser.Cics_define_input_eventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define_input_event}.
	 * @param ctx the parse tree
	 */
	void exitCics_define_input_event(CICSParser.Cics_define_input_eventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define_process}.
	 * @param ctx the parse tree
	 */
	void enterCics_define_process(CICSParser.Cics_define_processContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define_process}.
	 * @param ctx the parse tree
	 */
	void exitCics_define_process(CICSParser.Cics_define_processContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_define_timer}.
	 * @param ctx the parse tree
	 */
	void enterCics_define_timer(CICSParser.Cics_define_timerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_define_timer}.
	 * @param ctx the parse tree
	 */
	void exitCics_define_timer(CICSParser.Cics_define_timerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delay}.
	 * @param ctx the parse tree
	 */
	void enterCics_delay(CICSParser.Cics_delayContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delay}.
	 * @param ctx the parse tree
	 */
	void exitCics_delay(CICSParser.Cics_delayContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delay_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_delay_opts(CICSParser.Cics_delay_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delay_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_delay_opts(CICSParser.Cics_delay_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delete}.
	 * @param ctx the parse tree
	 */
	void enterCics_delete(CICSParser.Cics_deleteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delete}.
	 * @param ctx the parse tree
	 */
	void exitCics_delete(CICSParser.Cics_deleteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_keylength}.
	 * @param ctx the parse tree
	 */
	void enterCics_keylength(CICSParser.Cics_keylengthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_keylength}.
	 * @param ctx the parse tree
	 */
	void exitCics_keylength(CICSParser.Cics_keylengthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void enterCics_counter_dcounter(CICSParser.Cics_counter_dcounterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void exitCics_counter_dcounter(CICSParser.Cics_counter_dcounterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delete_group_one}.
	 * @param ctx the parse tree
	 */
	void enterCics_delete_group_one(CICSParser.Cics_delete_group_oneContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delete_group_one}.
	 * @param ctx the parse tree
	 */
	void exitCics_delete_group_one(CICSParser.Cics_delete_group_oneContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delete_group_two}.
	 * @param ctx the parse tree
	 */
	void enterCics_delete_group_two(CICSParser.Cics_delete_group_twoContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delete_group_two}.
	 * @param ctx the parse tree
	 */
	void exitCics_delete_group_two(CICSParser.Cics_delete_group_twoContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delete_group_three}.
	 * @param ctx the parse tree
	 */
	void enterCics_delete_group_three(CICSParser.Cics_delete_group_threeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delete_group_three}.
	 * @param ctx the parse tree
	 */
	void exitCics_delete_group_three(CICSParser.Cics_delete_group_threeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_delete_group_four}.
	 * @param ctx the parse tree
	 */
	void enterCics_delete_group_four(CICSParser.Cics_delete_group_fourContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_delete_group_four}.
	 * @param ctx the parse tree
	 */
	void exitCics_delete_group_four(CICSParser.Cics_delete_group_fourContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_deleteq}.
	 * @param ctx the parse tree
	 */
	void enterCics_deleteq(CICSParser.Cics_deleteqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_deleteq}.
	 * @param ctx the parse tree
	 */
	void exitCics_deleteq(CICSParser.Cics_deleteqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_deleteq_td}.
	 * @param ctx the parse tree
	 */
	void enterCics_deleteq_td(CICSParser.Cics_deleteq_tdContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_deleteq_td}.
	 * @param ctx the parse tree
	 */
	void exitCics_deleteq_td(CICSParser.Cics_deleteq_tdContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_deleteq_ts}.
	 * @param ctx the parse tree
	 */
	void enterCics_deleteq_ts(CICSParser.Cics_deleteq_tsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_deleteq_ts}.
	 * @param ctx the parse tree
	 */
	void exitCics_deleteq_ts(CICSParser.Cics_deleteq_tsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_queue_qname}.
	 * @param ctx the parse tree
	 */
	void enterCics_queue_qname(CICSParser.Cics_queue_qnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_queue_qname}.
	 * @param ctx the parse tree
	 */
	void exitCics_queue_qname(CICSParser.Cics_queue_qnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_deq}.
	 * @param ctx the parse tree
	 */
	void enterCics_deq(CICSParser.Cics_deqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_deq}.
	 * @param ctx the parse tree
	 */
	void exitCics_deq(CICSParser.Cics_deqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_deq_cmds}.
	 * @param ctx the parse tree
	 */
	void enterCics_deq_cmds(CICSParser.Cics_deq_cmdsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_deq_cmds}.
	 * @param ctx the parse tree
	 */
	void exitCics_deq_cmds(CICSParser.Cics_deq_cmdsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_disable}.
	 * @param ctx the parse tree
	 */
	void enterCics_disable(CICSParser.Cics_disableContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_disable}.
	 * @param ctx the parse tree
	 */
	void exitCics_disable(CICSParser.Cics_disableContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_disable_program}.
	 * @param ctx the parse tree
	 */
	void enterCics_disable_program(CICSParser.Cics_disable_programContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_disable_program}.
	 * @param ctx the parse tree
	 */
	void exitCics_disable_program(CICSParser.Cics_disable_programContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_discard}.
	 * @param ctx the parse tree
	 */
	void enterCics_discard(CICSParser.Cics_discardContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_discard}.
	 * @param ctx the parse tree
	 */
	void exitCics_discard(CICSParser.Cics_discardContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_discard_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_discard_body(CICSParser.Cics_discard_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_discard_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_discard_body(CICSParser.Cics_discard_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document}.
	 * @param ctx the parse tree
	 */
	void enterCics_document(CICSParser.Cics_documentContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document}.
	 * @param ctx the parse tree
	 */
	void exitCics_document(CICSParser.Cics_documentContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document_create}.
	 * @param ctx the parse tree
	 */
	void enterCics_document_create(CICSParser.Cics_document_createContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document_create}.
	 * @param ctx the parse tree
	 */
	void exitCics_document_create(CICSParser.Cics_document_createContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document_delete}.
	 * @param ctx the parse tree
	 */
	void enterCics_document_delete(CICSParser.Cics_document_deleteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document_delete}.
	 * @param ctx the parse tree
	 */
	void exitCics_document_delete(CICSParser.Cics_document_deleteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document_insert}.
	 * @param ctx the parse tree
	 */
	void enterCics_document_insert(CICSParser.Cics_document_insertContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document_insert}.
	 * @param ctx the parse tree
	 */
	void exitCics_document_insert(CICSParser.Cics_document_insertContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document_retrieve}.
	 * @param ctx the parse tree
	 */
	void enterCics_document_retrieve(CICSParser.Cics_document_retrieveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document_retrieve}.
	 * @param ctx the parse tree
	 */
	void exitCics_document_retrieve(CICSParser.Cics_document_retrieveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document_set}.
	 * @param ctx the parse tree
	 */
	void enterCics_document_set(CICSParser.Cics_document_setContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document_set}.
	 * @param ctx the parse tree
	 */
	void exitCics_document_set(CICSParser.Cics_document_setContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_length_flength}.
	 * @param ctx the parse tree
	 */
	void enterCics_length_flength(CICSParser.Cics_length_flengthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_length_flength}.
	 * @param ctx the parse tree
	 */
	void exitCics_length_flength(CICSParser.Cics_length_flengthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_dump}.
	 * @param ctx the parse tree
	 */
	void enterCics_dump(CICSParser.Cics_dumpContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_dump}.
	 * @param ctx the parse tree
	 */
	void exitCics_dump(CICSParser.Cics_dumpContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_dump_transaction_from}.
	 * @param ctx the parse tree
	 */
	void enterCics_dump_transaction_from(CICSParser.Cics_dump_transaction_fromContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_dump_transaction_from}.
	 * @param ctx the parse tree
	 */
	void exitCics_dump_transaction_from(CICSParser.Cics_dump_transaction_fromContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_dump_code_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_dump_code_opts(CICSParser.Cics_dump_code_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_dump_code_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_dump_code_opts(CICSParser.Cics_dump_code_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_dump_transaction_segmentlist}.
	 * @param ctx the parse tree
	 */
	void enterCics_dump_transaction_segmentlist(CICSParser.Cics_dump_transaction_segmentlistContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_dump_transaction_segmentlist}.
	 * @param ctx the parse tree
	 */
	void exitCics_dump_transaction_segmentlist(CICSParser.Cics_dump_transaction_segmentlistContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_enable}.
	 * @param ctx the parse tree
	 */
	void enterCics_enable(CICSParser.Cics_enableContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_enable}.
	 * @param ctx the parse tree
	 */
	void exitCics_enable(CICSParser.Cics_enableContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_enable_program}.
	 * @param ctx the parse tree
	 */
	void enterCics_enable_program(CICSParser.Cics_enable_programContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_enable_program}.
	 * @param ctx the parse tree
	 */
	void exitCics_enable_program(CICSParser.Cics_enable_programContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_endbr}.
	 * @param ctx the parse tree
	 */
	void enterCics_endbr(CICSParser.Cics_endbrContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_endbr}.
	 * @param ctx the parse tree
	 */
	void exitCics_endbr(CICSParser.Cics_endbrContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_endbr_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_endbr_opts(CICSParser.Cics_endbr_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_endbr_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_endbr_opts(CICSParser.Cics_endbr_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_endbrowse}.
	 * @param ctx the parse tree
	 */
	void enterCics_endbrowse(CICSParser.Cics_endbrowseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_endbrowse}.
	 * @param ctx the parse tree
	 */
	void exitCics_endbrowse(CICSParser.Cics_endbrowseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_endbrowse_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_endbrowse_opts(CICSParser.Cics_endbrowse_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_endbrowse_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_endbrowse_opts(CICSParser.Cics_endbrowse_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_enq}.
	 * @param ctx the parse tree
	 */
	void enterCics_enq(CICSParser.Cics_enqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_enq}.
	 * @param ctx the parse tree
	 */
	void exitCics_enq(CICSParser.Cics_enqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_enq_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_enq_opts(CICSParser.Cics_enq_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_enq_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_enq_opts(CICSParser.Cics_enq_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_enter}.
	 * @param ctx the parse tree
	 */
	void enterCics_enter(CICSParser.Cics_enterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_enter}.
	 * @param ctx the parse tree
	 */
	void exitCics_enter(CICSParser.Cics_enterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_enter_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_enter_opts(CICSParser.Cics_enter_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_enter_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_enter_opts(CICSParser.Cics_enter_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract(CICSParser.Cics_extractContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract(CICSParser.Cics_extractContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_attach}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_attach(CICSParser.Cics_extract_attachContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_attach}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_attach(CICSParser.Cics_extract_attachContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_attributes}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_attributes(CICSParser.Cics_extract_attributesContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_attributes}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_attributes(CICSParser.Cics_extract_attributesContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_certificate}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_certificate(CICSParser.Cics_extract_certificateContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_certificate}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_certificate(CICSParser.Cics_extract_certificateContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_logonmessage}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_logonmessage(CICSParser.Cics_extract_logonmessageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_logonmessage}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_logonmessage(CICSParser.Cics_extract_logonmessageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_process}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_process(CICSParser.Cics_extract_processContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_process}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_process(CICSParser.Cics_extract_processContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_tcpip}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_tcpip(CICSParser.Cics_extract_tcpipContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_tcpip}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_tcpip(CICSParser.Cics_extract_tcpipContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_tct}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_tct(CICSParser.Cics_extract_tctContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_tct}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_tct(CICSParser.Cics_extract_tctContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_web_server}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_web_server(CICSParser.Cics_extract_web_serverContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_web_server}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_web_server(CICSParser.Cics_extract_web_serverContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_web_client}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_web_client(CICSParser.Cics_extract_web_clientContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_web_client}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_web_client(CICSParser.Cics_extract_web_clientContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_system_programming}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_system_programming(CICSParser.Cics_extract_system_programmingContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_system_programming}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_system_programming(CICSParser.Cics_extract_system_programmingContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_exit}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_exit(CICSParser.Cics_extract_exitContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_exit}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_exit(CICSParser.Cics_extract_exitContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_extract_statistics}.
	 * @param ctx the parse tree
	 */
	void enterCics_extract_statistics(CICSParser.Cics_extract_statisticsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_extract_statistics}.
	 * @param ctx the parse tree
	 */
	void exitCics_extract_statistics(CICSParser.Cics_extract_statisticsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_fetch}.
	 * @param ctx the parse tree
	 */
	void enterCics_fetch(CICSParser.Cics_fetchContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_fetch}.
	 * @param ctx the parse tree
	 */
	void exitCics_fetch(CICSParser.Cics_fetchContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_fetch_any_child}.
	 * @param ctx the parse tree
	 */
	void enterCics_fetch_any_child(CICSParser.Cics_fetch_any_childContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_fetch_any_child}.
	 * @param ctx the parse tree
	 */
	void exitCics_fetch_any_child(CICSParser.Cics_fetch_any_childContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_force}.
	 * @param ctx the parse tree
	 */
	void enterCics_force(CICSParser.Cics_forceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_force}.
	 * @param ctx the parse tree
	 */
	void exitCics_force(CICSParser.Cics_forceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_force_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_force_opts(CICSParser.Cics_force_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_force_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_force_opts(CICSParser.Cics_force_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_formattime}.
	 * @param ctx the parse tree
	 */
	void enterCics_formattime(CICSParser.Cics_formattimeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_formattime}.
	 * @param ctx the parse tree
	 */
	void exitCics_formattime(CICSParser.Cics_formattimeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_formattime_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_formattime_opts(CICSParser.Cics_formattime_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_formattime_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_formattime_opts(CICSParser.Cics_formattime_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_free}.
	 * @param ctx the parse tree
	 */
	void enterCics_free(CICSParser.Cics_freeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_free}.
	 * @param ctx the parse tree
	 */
	void exitCics_free(CICSParser.Cics_freeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_free_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_free_body(CICSParser.Cics_free_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_free_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_free_body(CICSParser.Cics_free_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_freemain}.
	 * @param ctx the parse tree
	 */
	void enterCics_freemain(CICSParser.Cics_freemainContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_freemain}.
	 * @param ctx the parse tree
	 */
	void exitCics_freemain(CICSParser.Cics_freemainContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_freemain_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_freemain_opts(CICSParser.Cics_freemain_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_freemain_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_freemain_opts(CICSParser.Cics_freemain_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_gds}.
	 * @param ctx the parse tree
	 */
	void enterCics_gds(CICSParser.Cics_gdsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_gds}.
	 * @param ctx the parse tree
	 */
	void exitCics_gds(CICSParser.Cics_gdsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_gds_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_gds_opts(CICSParser.Cics_gds_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_gds_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_gds_opts(CICSParser.Cics_gds_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_get}.
	 * @param ctx the parse tree
	 */
	void enterCics_get(CICSParser.Cics_getContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_get}.
	 * @param ctx the parse tree
	 */
	void exitCics_get(CICSParser.Cics_getContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_get_container_bts}.
	 * @param ctx the parse tree
	 */
	void enterCics_get_container_bts(CICSParser.Cics_get_container_btsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_get_container_bts}.
	 * @param ctx the parse tree
	 */
	void exitCics_get_container_bts(CICSParser.Cics_get_container_btsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_get_container_channel}.
	 * @param ctx the parse tree
	 */
	void enterCics_get_container_channel(CICSParser.Cics_get_container_channelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_get_container_channel}.
	 * @param ctx the parse tree
	 */
	void exitCics_get_container_channel(CICSParser.Cics_get_container_channelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_get_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void enterCics_get_counter_dcounter(CICSParser.Cics_get_counter_dcounterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_get_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void exitCics_get_counter_dcounter(CICSParser.Cics_get_counter_dcounterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getmain}.
	 * @param ctx the parse tree
	 */
	void enterCics_getmain(CICSParser.Cics_getmainContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getmain}.
	 * @param ctx the parse tree
	 */
	void exitCics_getmain(CICSParser.Cics_getmainContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getmain_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_getmain_body(CICSParser.Cics_getmain_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getmain_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_getmain_body(CICSParser.Cics_getmain_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getmain64}.
	 * @param ctx the parse tree
	 */
	void enterCics_getmain64(CICSParser.Cics_getmain64Context ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getmain64}.
	 * @param ctx the parse tree
	 */
	void exitCics_getmain64(CICSParser.Cics_getmain64Context ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getmain64_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_getmain64_body(CICSParser.Cics_getmain64_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getmain64_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_getmain64_body(CICSParser.Cics_getmain64_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getnext}.
	 * @param ctx the parse tree
	 */
	void enterCics_getnext(CICSParser.Cics_getnextContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getnext}.
	 * @param ctx the parse tree
	 */
	void exitCics_getnext(CICSParser.Cics_getnextContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getnext_activity}.
	 * @param ctx the parse tree
	 */
	void enterCics_getnext_activity(CICSParser.Cics_getnext_activityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getnext_activity}.
	 * @param ctx the parse tree
	 */
	void exitCics_getnext_activity(CICSParser.Cics_getnext_activityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getnext_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_getnext_container(CICSParser.Cics_getnext_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getnext_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_getnext_container(CICSParser.Cics_getnext_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getnext_event}.
	 * @param ctx the parse tree
	 */
	void enterCics_getnext_event(CICSParser.Cics_getnext_eventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getnext_event}.
	 * @param ctx the parse tree
	 */
	void exitCics_getnext_event(CICSParser.Cics_getnext_eventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getnext_process}.
	 * @param ctx the parse tree
	 */
	void enterCics_getnext_process(CICSParser.Cics_getnext_processContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getnext_process}.
	 * @param ctx the parse tree
	 */
	void exitCics_getnext_process(CICSParser.Cics_getnext_processContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_getnext_timer}.
	 * @param ctx the parse tree
	 */
	void enterCics_getnext_timer(CICSParser.Cics_getnext_timerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_getnext_timer}.
	 * @param ctx the parse tree
	 */
	void exitCics_getnext_timer(CICSParser.Cics_getnext_timerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_handle}.
	 * @param ctx the parse tree
	 */
	void enterCics_handle(CICSParser.Cics_handleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_handle}.
	 * @param ctx the parse tree
	 */
	void exitCics_handle(CICSParser.Cics_handleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_handle_abend}.
	 * @param ctx the parse tree
	 */
	void enterCics_handle_abend(CICSParser.Cics_handle_abendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_handle_abend}.
	 * @param ctx the parse tree
	 */
	void exitCics_handle_abend(CICSParser.Cics_handle_abendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_handle_aid}.
	 * @param ctx the parse tree
	 */
	void enterCics_handle_aid(CICSParser.Cics_handle_aidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_handle_aid}.
	 * @param ctx the parse tree
	 */
	void exitCics_handle_aid(CICSParser.Cics_handle_aidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_handle_condition}.
	 * @param ctx the parse tree
	 */
	void enterCics_handle_condition(CICSParser.Cics_handle_conditionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_handle_condition}.
	 * @param ctx the parse tree
	 */
	void exitCics_handle_condition(CICSParser.Cics_handle_conditionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_ignore}.
	 * @param ctx the parse tree
	 */
	void enterCics_ignore(CICSParser.Cics_ignoreContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_ignore}.
	 * @param ctx the parse tree
	 */
	void exitCics_ignore(CICSParser.Cics_ignoreContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_ignore_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_ignore_options(CICSParser.Cics_ignore_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_ignore_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_ignore_options(CICSParser.Cics_ignore_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire(CICSParser.Cics_inquireContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire(CICSParser.Cics_inquireContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_activityid}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_activityid(CICSParser.Cics_inquire_activityidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_activityid}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_activityid(CICSParser.Cics_inquire_activityidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_container(CICSParser.Cics_inquire_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_container(CICSParser.Cics_inquire_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_event}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_event(CICSParser.Cics_inquire_eventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_event}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_event(CICSParser.Cics_inquire_eventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_process}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_process(CICSParser.Cics_inquire_processContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_process}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_process(CICSParser.Cics_inquire_processContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_timer}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_timer(CICSParser.Cics_inquire_timerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_timer}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_timer(CICSParser.Cics_inquire_timerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_browse_start_end}.
	 * @param ctx the parse tree
	 */
	void enterCics_browse_start_end(CICSParser.Cics_browse_start_endContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_browse_start_end}.
	 * @param ctx the parse tree
	 */
	void exitCics_browse_start_end(CICSParser.Cics_browse_start_endContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_system_programming}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_system_programming(CICSParser.Cics_inquire_system_programmingContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_system_programming}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_system_programming(CICSParser.Cics_inquire_system_programmingContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_association}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_association(CICSParser.Cics_inquire_associationContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_association}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_association(CICSParser.Cics_inquire_associationContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_association_list}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_association_list(CICSParser.Cics_inquire_association_listContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_association_list}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_association_list(CICSParser.Cics_inquire_association_listContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_atomservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_atomservice(CICSParser.Cics_inquire_atomserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_atomservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_atomservice(CICSParser.Cics_inquire_atomserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_autinstmodel}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_autinstmodel(CICSParser.Cics_inquire_autinstmodelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_autinstmodel}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_autinstmodel(CICSParser.Cics_inquire_autinstmodelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_autoinstall}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_autoinstall(CICSParser.Cics_inquire_autoinstallContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_autoinstall}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_autoinstall(CICSParser.Cics_inquire_autoinstallContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_brfacility}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_brfacility(CICSParser.Cics_inquire_brfacilityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_brfacility}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_brfacility(CICSParser.Cics_inquire_brfacilityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_bundle}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_bundle(CICSParser.Cics_inquire_bundleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_bundle}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_bundle(CICSParser.Cics_inquire_bundleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_bundlepart}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_bundlepart(CICSParser.Cics_inquire_bundlepartContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_bundlepart}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_bundlepart(CICSParser.Cics_inquire_bundlepartContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_capdatapred}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_capdatapred(CICSParser.Cics_inquire_capdatapredContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_capdatapred}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_capdatapred(CICSParser.Cics_inquire_capdatapredContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_capinfosrce}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_capinfosrce(CICSParser.Cics_inquire_capinfosrceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_capinfosrce}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_capinfosrce(CICSParser.Cics_inquire_capinfosrceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_capoptpred}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_capoptpred(CICSParser.Cics_inquire_capoptpredContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_capoptpred}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_capoptpred(CICSParser.Cics_inquire_capoptpredContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_capturespec}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_capturespec(CICSParser.Cics_inquire_capturespecContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_capturespec}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_capturespec(CICSParser.Cics_inquire_capturespecContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_connection}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_connection(CICSParser.Cics_inquire_connectionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_connection}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_connection(CICSParser.Cics_inquire_connectionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_cfdtpool}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_cfdtpool(CICSParser.Cics_inquire_cfdtpoolContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_cfdtpool}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_cfdtpool(CICSParser.Cics_inquire_cfdtpoolContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_db2conn}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_db2conn(CICSParser.Cics_inquire_db2connContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_db2conn}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_db2conn(CICSParser.Cics_inquire_db2connContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_db2entry}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_db2entry(CICSParser.Cics_inquire_db2entryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_db2entry}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_db2entry(CICSParser.Cics_inquire_db2entryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_db2tran}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_db2tran(CICSParser.Cics_inquire_db2tranContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_db2tran}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_db2tran(CICSParser.Cics_inquire_db2tranContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_deletshipped}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_deletshipped(CICSParser.Cics_inquire_deletshippedContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_deletshipped}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_deletshipped(CICSParser.Cics_inquire_deletshippedContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_dispatcher}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_dispatcher(CICSParser.Cics_inquire_dispatcherContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_dispatcher}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_dispatcher(CICSParser.Cics_inquire_dispatcherContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_doctemplate}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_doctemplate(CICSParser.Cics_inquire_doctemplateContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_doctemplate}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_doctemplate(CICSParser.Cics_inquire_doctemplateContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_dsname}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_dsname(CICSParser.Cics_inquire_dsnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_dsname}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_dsname(CICSParser.Cics_inquire_dsnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_dumpds}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_dumpds(CICSParser.Cics_inquire_dumpdsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_dumpds}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_dumpds(CICSParser.Cics_inquire_dumpdsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_enq}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_enq(CICSParser.Cics_inquire_enqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_enq}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_enq(CICSParser.Cics_inquire_enqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_enqmodel}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_enqmodel(CICSParser.Cics_inquire_enqmodelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_enqmodel}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_enqmodel(CICSParser.Cics_inquire_enqmodelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_epadapter}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_epadapter(CICSParser.Cics_inquire_epadapterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_epadapter}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_epadapter(CICSParser.Cics_inquire_epadapterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_epadapterset}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_epadapterset(CICSParser.Cics_inquire_epadaptersetContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_epadapterset}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_epadapterset(CICSParser.Cics_inquire_epadaptersetContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_epadaptinset}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_epadaptinset(CICSParser.Cics_inquire_epadaptinsetContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_epadaptinset}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_epadaptinset(CICSParser.Cics_inquire_epadaptinsetContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_eventbinding}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_eventbinding(CICSParser.Cics_inquire_eventbindingContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_eventbinding}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_eventbinding(CICSParser.Cics_inquire_eventbindingContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_eventprocess}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_eventprocess(CICSParser.Cics_inquire_eventprocessContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_eventprocess}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_eventprocess(CICSParser.Cics_inquire_eventprocessContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_exci}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_exci(CICSParser.Cics_inquire_exciContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_exci}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_exci(CICSParser.Cics_inquire_exciContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_exitprogram}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_exitprogram(CICSParser.Cics_inquire_exitprogramContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_exitprogram}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_exitprogram(CICSParser.Cics_inquire_exitprogramContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_featurekey}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_featurekey(CICSParser.Cics_inquire_featurekeyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_featurekey}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_featurekey(CICSParser.Cics_inquire_featurekeyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_file}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_file(CICSParser.Cics_inquire_fileContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_file}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_file(CICSParser.Cics_inquire_fileContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_host}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_host(CICSParser.Cics_inquire_hostContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_host}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_host(CICSParser.Cics_inquire_hostContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_ipconn}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_ipconn(CICSParser.Cics_inquire_ipconnContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_ipconn}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_ipconn(CICSParser.Cics_inquire_ipconnContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_ipfacility}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_ipfacility(CICSParser.Cics_inquire_ipfacilityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_ipfacility}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_ipfacility(CICSParser.Cics_inquire_ipfacilityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_irc}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_irc(CICSParser.Cics_inquire_ircContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_irc}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_irc(CICSParser.Cics_inquire_ircContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_journalmodel}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_journalmodel(CICSParser.Cics_inquire_journalmodelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_journalmodel}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_journalmodel(CICSParser.Cics_inquire_journalmodelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_journalname}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_journalname(CICSParser.Cics_inquire_journalnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_journalname}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_journalname(CICSParser.Cics_inquire_journalnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_jvmendpoint}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_jvmendpoint(CICSParser.Cics_inquire_jvmendpointContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_jvmendpoint}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_jvmendpoint(CICSParser.Cics_inquire_jvmendpointContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_jvmserver}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_jvmserver(CICSParser.Cics_inquire_jvmserverContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_jvmserver}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_jvmserver(CICSParser.Cics_inquire_jvmserverContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_library}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_library(CICSParser.Cics_inquire_libraryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_library}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_library(CICSParser.Cics_inquire_libraryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_modename}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_modename(CICSParser.Cics_inquire_modenameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_modename}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_modename(CICSParser.Cics_inquire_modenameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_monitor}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_monitor(CICSParser.Cics_inquire_monitorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_monitor}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_monitor(CICSParser.Cics_inquire_monitorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_mqconn}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_mqconn(CICSParser.Cics_inquire_mqconnContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_mqconn}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_mqconn(CICSParser.Cics_inquire_mqconnContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_mqini}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_mqini(CICSParser.Cics_inquire_mqiniContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_mqini}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_mqini(CICSParser.Cics_inquire_mqiniContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_mqmonitor}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_mqmonitor(CICSParser.Cics_inquire_mqmonitorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_mqmonitor}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_mqmonitor(CICSParser.Cics_inquire_mqmonitorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_mvstcb}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_mvstcb(CICSParser.Cics_inquire_mvstcbContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_mvstcb}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_mvstcb(CICSParser.Cics_inquire_mvstcbContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_nodejsapp}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_nodejsapp(CICSParser.Cics_inquire_nodejsappContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_nodejsapp}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_nodejsapp(CICSParser.Cics_inquire_nodejsappContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_osgibundle}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_osgibundle(CICSParser.Cics_inquire_osgibundleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_osgibundle}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_osgibundle(CICSParser.Cics_inquire_osgibundleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_osgiservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_osgiservice(CICSParser.Cics_inquire_osgiserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_osgiservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_osgiservice(CICSParser.Cics_inquire_osgiserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_partner}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_partner(CICSParser.Cics_inquire_partnerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_partner}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_partner(CICSParser.Cics_inquire_partnerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_pipeline}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_pipeline(CICSParser.Cics_inquire_pipelineContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_pipeline}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_pipeline(CICSParser.Cics_inquire_pipelineContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_policy}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_policy(CICSParser.Cics_inquire_policyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_policy}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_policy(CICSParser.Cics_inquire_policyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_policyrule}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_policyrule(CICSParser.Cics_inquire_policyruleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_policyrule}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_policyrule(CICSParser.Cics_inquire_policyruleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_processtype}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_processtype(CICSParser.Cics_inquire_processtypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_processtype}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_processtype(CICSParser.Cics_inquire_processtypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_profile}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_profile(CICSParser.Cics_inquire_profileContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_profile}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_profile(CICSParser.Cics_inquire_profileContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_program}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_program(CICSParser.Cics_inquire_programContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_program}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_program(CICSParser.Cics_inquire_programContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_reqid}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_reqid(CICSParser.Cics_inquire_reqidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_reqid}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_reqid(CICSParser.Cics_inquire_reqidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_rrms}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_rrms(CICSParser.Cics_inquire_rrmsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_rrms}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_rrms(CICSParser.Cics_inquire_rrmsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_secdiscovery}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_secdiscovery(CICSParser.Cics_inquire_secdiscoveryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_secdiscovery}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_secdiscovery(CICSParser.Cics_inquire_secdiscoveryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_secrecording}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_secrecording(CICSParser.Cics_inquire_secrecordingContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_secrecording}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_secrecording(CICSParser.Cics_inquire_secrecordingContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_statistics}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_statistics(CICSParser.Cics_inquire_statisticsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_statistics}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_statistics(CICSParser.Cics_inquire_statisticsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_storage}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_storage(CICSParser.Cics_inquire_storageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_storage}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_storage(CICSParser.Cics_inquire_storageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_storage64}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_storage64(CICSParser.Cics_inquire_storage64Context ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_storage64}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_storage64(CICSParser.Cics_inquire_storage64Context ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_streamname}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_streamname(CICSParser.Cics_inquire_streamnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_streamname}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_streamname(CICSParser.Cics_inquire_streamnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_subpool}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_subpool(CICSParser.Cics_inquire_subpoolContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_subpool}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_subpool(CICSParser.Cics_inquire_subpoolContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_sysdumpcode}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_sysdumpcode(CICSParser.Cics_inquire_sysdumpcodeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_sysdumpcode}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_sysdumpcode(CICSParser.Cics_inquire_sysdumpcodeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_system}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_system(CICSParser.Cics_inquire_systemContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_system}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_system(CICSParser.Cics_inquire_systemContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tag}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tag(CICSParser.Cics_inquire_tagContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tag}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tag(CICSParser.Cics_inquire_tagContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_task}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_task(CICSParser.Cics_inquire_taskContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_task}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_task(CICSParser.Cics_inquire_taskContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_task_list}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_task_list(CICSParser.Cics_inquire_task_listContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_task_list}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_task_list(CICSParser.Cics_inquire_task_listContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tclass}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tclass(CICSParser.Cics_inquire_tclassContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tclass}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tclass(CICSParser.Cics_inquire_tclassContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tcpip}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tcpip(CICSParser.Cics_inquire_tcpipContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tcpip}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tcpip(CICSParser.Cics_inquire_tcpipContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tcpipservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tcpipservice(CICSParser.Cics_inquire_tcpipserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tcpipservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tcpipservice(CICSParser.Cics_inquire_tcpipserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tdqueue}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tdqueue(CICSParser.Cics_inquire_tdqueueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tdqueue}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tdqueue(CICSParser.Cics_inquire_tdqueueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tempstorage}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tempstorage(CICSParser.Cics_inquire_tempstorageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tempstorage}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tempstorage(CICSParser.Cics_inquire_tempstorageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_netname}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_netname(CICSParser.Cics_inquire_netnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_netname}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_netname(CICSParser.Cics_inquire_netnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_terminal}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_terminal(CICSParser.Cics_inquire_terminalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_terminal}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_terminal(CICSParser.Cics_inquire_terminalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tracedest}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tracedest(CICSParser.Cics_inquire_tracedestContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tracedest}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tracedest(CICSParser.Cics_inquire_tracedestContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_traceflag}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_traceflag(CICSParser.Cics_inquire_traceflagContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_traceflag}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_traceflag(CICSParser.Cics_inquire_traceflagContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tracetype}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tracetype(CICSParser.Cics_inquire_tracetypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tracetype}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tracetype(CICSParser.Cics_inquire_tracetypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tranclass}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tranclass(CICSParser.Cics_inquire_tranclassContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tranclass}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tranclass(CICSParser.Cics_inquire_tranclassContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_trandumpcode}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_trandumpcode(CICSParser.Cics_inquire_trandumpcodeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_trandumpcode}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_trandumpcode(CICSParser.Cics_inquire_trandumpcodeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_transaction}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_transaction(CICSParser.Cics_inquire_transactionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_transaction}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_transaction(CICSParser.Cics_inquire_transactionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tsmodel}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tsmodel(CICSParser.Cics_inquire_tsmodelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tsmodel}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tsmodel(CICSParser.Cics_inquire_tsmodelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tspool}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tspool(CICSParser.Cics_inquire_tspoolContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tspool}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tspool(CICSParser.Cics_inquire_tspoolContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_tsqueue}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_tsqueue(CICSParser.Cics_inquire_tsqueueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_tsqueue}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_tsqueue(CICSParser.Cics_inquire_tsqueueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_uow}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_uow(CICSParser.Cics_inquire_uowContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_uow}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_uow(CICSParser.Cics_inquire_uowContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_uowdsnfail}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_uowdsnfail(CICSParser.Cics_inquire_uowdsnfailContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_uowdsnfail}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_uowdsnfail(CICSParser.Cics_inquire_uowdsnfailContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_uowenq}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_uowenq(CICSParser.Cics_inquire_uowenqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_uowenq}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_uowenq(CICSParser.Cics_inquire_uowenqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_uowlink}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_uowlink(CICSParser.Cics_inquire_uowlinkContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_uowlink}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_uowlink(CICSParser.Cics_inquire_uowlinkContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_urimap}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_urimap(CICSParser.Cics_inquire_urimapContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_urimap}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_urimap(CICSParser.Cics_inquire_urimapContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_vtam}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_vtam(CICSParser.Cics_inquire_vtamContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_vtam}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_vtam(CICSParser.Cics_inquire_vtamContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_web}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_web(CICSParser.Cics_inquire_webContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_web}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_web(CICSParser.Cics_inquire_webContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_webservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_webservice(CICSParser.Cics_inquire_webserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_webservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_webservice(CICSParser.Cics_inquire_webserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_wlmhealth}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_wlmhealth(CICSParser.Cics_inquire_wlmhealthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_wlmhealth}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_wlmhealth(CICSParser.Cics_inquire_wlmhealthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inquire_xmltransform}.
	 * @param ctx the parse tree
	 */
	void enterCics_inquire_xmltransform(CICSParser.Cics_inquire_xmltransformContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inquire_xmltransform}.
	 * @param ctx the parse tree
	 */
	void exitCics_inquire_xmltransform(CICSParser.Cics_inquire_xmltransformContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_invoke}.
	 * @param ctx the parse tree
	 */
	void enterCics_invoke(CICSParser.Cics_invokeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_invoke}.
	 * @param ctx the parse tree
	 */
	void exitCics_invoke(CICSParser.Cics_invokeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_invoke_application}.
	 * @param ctx the parse tree
	 */
	void enterCics_invoke_application(CICSParser.Cics_invoke_applicationContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_invoke_application}.
	 * @param ctx the parse tree
	 */
	void exitCics_invoke_application(CICSParser.Cics_invoke_applicationContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_invoke_service}.
	 * @param ctx the parse tree
	 */
	void enterCics_invoke_service(CICSParser.Cics_invoke_serviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_invoke_service}.
	 * @param ctx the parse tree
	 */
	void exitCics_invoke_service(CICSParser.Cics_invoke_serviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue(CICSParser.Cics_issueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue(CICSParser.Cics_issueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_abend}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_abend(CICSParser.Cics_issue_abendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_abend}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_abend(CICSParser.Cics_issue_abendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_abort}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_abort(CICSParser.Cics_issue_abortContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_abort}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_abort(CICSParser.Cics_issue_abortContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_add}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_add(CICSParser.Cics_issue_addContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_add}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_add(CICSParser.Cics_issue_addContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_confirmation}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_confirmation(CICSParser.Cics_issue_confirmationContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_confirmation}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_confirmation(CICSParser.Cics_issue_confirmationContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_copy}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_copy(CICSParser.Cics_issue_copyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_copy}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_copy(CICSParser.Cics_issue_copyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_disconnect}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_disconnect(CICSParser.Cics_issue_disconnectContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_disconnect}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_disconnect(CICSParser.Cics_issue_disconnectContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_end}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_end(CICSParser.Cics_issue_endContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_end}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_end(CICSParser.Cics_issue_endContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_endfile_endoutput}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_endfile_endoutput(CICSParser.Cics_issue_endfile_endoutputContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_endfile_endoutput}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_endfile_endoutput(CICSParser.Cics_issue_endfile_endoutputContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_erase}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_erase(CICSParser.Cics_issue_eraseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_erase}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_erase(CICSParser.Cics_issue_eraseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_erase_aup}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_erase_aup(CICSParser.Cics_issue_erase_aupContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_erase_aup}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_erase_aup(CICSParser.Cics_issue_erase_aupContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_error}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_error(CICSParser.Cics_issue_errorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_error}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_error(CICSParser.Cics_issue_errorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_load}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_load(CICSParser.Cics_issue_loadContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_load}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_load(CICSParser.Cics_issue_loadContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_note}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_note(CICSParser.Cics_issue_noteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_note}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_note(CICSParser.Cics_issue_noteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_pass}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_pass(CICSParser.Cics_issue_passContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_pass}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_pass(CICSParser.Cics_issue_passContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_prepare}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_prepare(CICSParser.Cics_issue_prepareContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_prepare}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_prepare(CICSParser.Cics_issue_prepareContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_query}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_query(CICSParser.Cics_issue_queryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_query}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_query(CICSParser.Cics_issue_queryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_receive}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_receive(CICSParser.Cics_issue_receiveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_receive}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_receive(CICSParser.Cics_issue_receiveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_replace}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_replace(CICSParser.Cics_issue_replaceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_replace}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_replace(CICSParser.Cics_issue_replaceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_send}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_send(CICSParser.Cics_issue_sendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_send}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_send(CICSParser.Cics_issue_sendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_signal}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_signal(CICSParser.Cics_issue_signalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_signal}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_signal(CICSParser.Cics_issue_signalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_wait}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_wait(CICSParser.Cics_issue_waitContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_wait}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_wait(CICSParser.Cics_issue_waitContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_print}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_print(CICSParser.Cics_issue_printContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_print}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_print(CICSParser.Cics_issue_printContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_eods}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_eods(CICSParser.Cics_issue_eodsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_eods}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_eods(CICSParser.Cics_issue_eodsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_issue_common}.
	 * @param ctx the parse tree
	 */
	void enterCics_issue_common(CICSParser.Cics_issue_commonContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_issue_common}.
	 * @param ctx the parse tree
	 */
	void exitCics_issue_common(CICSParser.Cics_issue_commonContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link}.
	 * @param ctx the parse tree
	 */
	void enterCics_link(CICSParser.Cics_linkContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link}.
	 * @param ctx the parse tree
	 */
	void exitCics_link(CICSParser.Cics_linkContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link_program}.
	 * @param ctx the parse tree
	 */
	void enterCics_link_program(CICSParser.Cics_link_programContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link_program}.
	 * @param ctx the parse tree
	 */
	void exitCics_link_program(CICSParser.Cics_link_programContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link_acqprocess}.
	 * @param ctx the parse tree
	 */
	void enterCics_link_acqprocess(CICSParser.Cics_link_acqprocessContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link_acqprocess}.
	 * @param ctx the parse tree
	 */
	void exitCics_link_acqprocess(CICSParser.Cics_link_acqprocessContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link_activity}.
	 * @param ctx the parse tree
	 */
	void enterCics_link_activity(CICSParser.Cics_link_activityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link_activity}.
	 * @param ctx the parse tree
	 */
	void exitCics_link_activity(CICSParser.Cics_link_activityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_link}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_link(CICSParser.Cics_exci_linkContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_link}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_link(CICSParser.Cics_exci_linkContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link_commarea_exci}.
	 * @param ctx the parse tree
	 */
	void enterCics_link_commarea_exci(CICSParser.Cics_link_commarea_exciContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link_commarea_exci}.
	 * @param ctx the parse tree
	 */
	void exitCics_link_commarea_exci(CICSParser.Cics_link_commarea_exciContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link_channel_exci}.
	 * @param ctx the parse tree
	 */
	void enterCics_link_channel_exci(CICSParser.Cics_link_channel_exciContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link_channel_exci}.
	 * @param ctx the parse tree
	 */
	void exitCics_link_channel_exci(CICSParser.Cics_link_channel_exciContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_link_program_exci}.
	 * @param ctx the parse tree
	 */
	void enterCics_link_program_exci(CICSParser.Cics_link_program_exciContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_link_program_exci}.
	 * @param ctx the parse tree
	 */
	void exitCics_link_program_exci(CICSParser.Cics_link_program_exciContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_delete}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_delete(CICSParser.Cics_exci_deleteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_delete}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_delete(CICSParser.Cics_exci_deleteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_delete_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_delete_container(CICSParser.Cics_exci_delete_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_delete_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_delete_container(CICSParser.Cics_exci_delete_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_endbrowse_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_endbrowse_container(CICSParser.Cics_exci_endbrowse_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_endbrowse_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_endbrowse_container(CICSParser.Cics_exci_endbrowse_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_get_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_get_container(CICSParser.Cics_exci_get_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_get_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_get_container(CICSParser.Cics_exci_get_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#exci_data_area}.
	 * @param ctx the parse tree
	 */
	void enterExci_data_area(CICSParser.Exci_data_areaContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#exci_data_area}.
	 * @param ctx the parse tree
	 */
	void exitExci_data_area(CICSParser.Exci_data_areaContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_ref}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_ref(CICSParser.Cics_exci_refContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_ref}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_ref(CICSParser.Cics_exci_refContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_get_next_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_get_next_container(CICSParser.Cics_exci_get_next_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_get_next_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_get_next_container(CICSParser.Cics_exci_get_next_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_move_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_move_container(CICSParser.Cics_exci_move_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_move_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_move_container(CICSParser.Cics_exci_move_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_put_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_put_container(CICSParser.Cics_exci_put_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_put_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_put_container(CICSParser.Cics_exci_put_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_query_channel}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_query_channel(CICSParser.Cics_exci_query_channelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_query_channel}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_query_channel(CICSParser.Cics_exci_query_channelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_exci_startbrowse_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_exci_startbrowse_container(CICSParser.Cics_exci_startbrowse_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_exci_startbrowse_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_exci_startbrowse_container(CICSParser.Cics_exci_startbrowse_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_load}.
	 * @param ctx the parse tree
	 */
	void enterCics_load(CICSParser.Cics_loadContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_load}.
	 * @param ctx the parse tree
	 */
	void exitCics_load(CICSParser.Cics_loadContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_load_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_load_options(CICSParser.Cics_load_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_load_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_load_options(CICSParser.Cics_load_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_monitor}.
	 * @param ctx the parse tree
	 */
	void enterCics_monitor(CICSParser.Cics_monitorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_monitor}.
	 * @param ctx the parse tree
	 */
	void exitCics_monitor(CICSParser.Cics_monitorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_monitor_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_monitor_options(CICSParser.Cics_monitor_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_monitor_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_monitor_options(CICSParser.Cics_monitor_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_move}.
	 * @param ctx the parse tree
	 */
	void enterCics_move(CICSParser.Cics_moveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_move}.
	 * @param ctx the parse tree
	 */
	void exitCics_move(CICSParser.Cics_moveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_move_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_move_body(CICSParser.Cics_move_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_move_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_move_body(CICSParser.Cics_move_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform(CICSParser.Cics_performContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform(CICSParser.Cics_performContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_deletshipped}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_deletshipped(CICSParser.Cics_perform_deletshippedContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_deletshipped}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_deletshipped(CICSParser.Cics_perform_deletshippedContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_dump}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_dump(CICSParser.Cics_perform_dumpContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_dump}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_dump(CICSParser.Cics_perform_dumpContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_endaffinity}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_endaffinity(CICSParser.Cics_perform_endaffinityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_endaffinity}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_endaffinity(CICSParser.Cics_perform_endaffinityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_jvmserver}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_jvmserver(CICSParser.Cics_perform_jvmserverContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_jvmserver}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_jvmserver(CICSParser.Cics_perform_jvmserverContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_pipeline}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_pipeline(CICSParser.Cics_perform_pipelineContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_pipeline}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_pipeline(CICSParser.Cics_perform_pipelineContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_resettime}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_resettime(CICSParser.Cics_perform_resettimeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_resettime}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_resettime(CICSParser.Cics_perform_resettimeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_secdiscovery}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_secdiscovery(CICSParser.Cics_perform_secdiscoveryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_secdiscovery}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_secdiscovery(CICSParser.Cics_perform_secdiscoveryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_security}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_security(CICSParser.Cics_perform_securityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_security}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_security(CICSParser.Cics_perform_securityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_shutdown}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_shutdown(CICSParser.Cics_perform_shutdownContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_shutdown}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_shutdown(CICSParser.Cics_perform_shutdownContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_ssl}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_ssl(CICSParser.Cics_perform_sslContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_ssl}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_ssl(CICSParser.Cics_perform_sslContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_perform_statistics}.
	 * @param ctx the parse tree
	 */
	void enterCics_perform_statistics(CICSParser.Cics_perform_statisticsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_perform_statistics}.
	 * @param ctx the parse tree
	 */
	void exitCics_perform_statistics(CICSParser.Cics_perform_statisticsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_point}.
	 * @param ctx the parse tree
	 */
	void enterCics_point(CICSParser.Cics_pointContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_point}.
	 * @param ctx the parse tree
	 */
	void exitCics_point(CICSParser.Cics_pointContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_point_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_point_options(CICSParser.Cics_point_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_point_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_point_options(CICSParser.Cics_point_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_pop}.
	 * @param ctx the parse tree
	 */
	void enterCics_pop(CICSParser.Cics_popContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_pop}.
	 * @param ctx the parse tree
	 */
	void exitCics_pop(CICSParser.Cics_popContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_pop_option}.
	 * @param ctx the parse tree
	 */
	void enterCics_pop_option(CICSParser.Cics_pop_optionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_pop_option}.
	 * @param ctx the parse tree
	 */
	void exitCics_pop_option(CICSParser.Cics_pop_optionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_post}.
	 * @param ctx the parse tree
	 */
	void enterCics_post(CICSParser.Cics_postContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_post}.
	 * @param ctx the parse tree
	 */
	void exitCics_post(CICSParser.Cics_postContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_post_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_post_options(CICSParser.Cics_post_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_post_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_post_options(CICSParser.Cics_post_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_purge}.
	 * @param ctx the parse tree
	 */
	void enterCics_purge(CICSParser.Cics_purgeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_purge}.
	 * @param ctx the parse tree
	 */
	void exitCics_purge(CICSParser.Cics_purgeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_push}.
	 * @param ctx the parse tree
	 */
	void enterCics_push(CICSParser.Cics_pushContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_push}.
	 * @param ctx the parse tree
	 */
	void exitCics_push(CICSParser.Cics_pushContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_put_container}.
	 * @param ctx the parse tree
	 */
	void enterCics_put_container(CICSParser.Cics_put_containerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_put_container}.
	 * @param ctx the parse tree
	 */
	void exitCics_put_container(CICSParser.Cics_put_containerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_put_container_bts}.
	 * @param ctx the parse tree
	 */
	void enterCics_put_container_bts(CICSParser.Cics_put_container_btsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_put_container_bts}.
	 * @param ctx the parse tree
	 */
	void exitCics_put_container_bts(CICSParser.Cics_put_container_btsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_put_container_channel}.
	 * @param ctx the parse tree
	 */
	void enterCics_put_container_channel(CICSParser.Cics_put_container_channelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_put_container_channel}.
	 * @param ctx the parse tree
	 */
	void exitCics_put_container_channel(CICSParser.Cics_put_container_channelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_query}.
	 * @param ctx the parse tree
	 */
	void enterCics_query(CICSParser.Cics_queryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_query}.
	 * @param ctx the parse tree
	 */
	void exitCics_query(CICSParser.Cics_queryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_query_channel}.
	 * @param ctx the parse tree
	 */
	void enterCics_query_channel(CICSParser.Cics_query_channelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_query_channel}.
	 * @param ctx the parse tree
	 */
	void exitCics_query_channel(CICSParser.Cics_query_channelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_query_counter}.
	 * @param ctx the parse tree
	 */
	void enterCics_query_counter(CICSParser.Cics_query_counterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_query_counter}.
	 * @param ctx the parse tree
	 */
	void exitCics_query_counter(CICSParser.Cics_query_counterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_query_security}.
	 * @param ctx the parse tree
	 */
	void enterCics_query_security(CICSParser.Cics_query_securityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_query_security}.
	 * @param ctx the parse tree
	 */
	void exitCics_query_security(CICSParser.Cics_query_securityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_read}.
	 * @param ctx the parse tree
	 */
	void enterCics_read(CICSParser.Cics_readContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_read}.
	 * @param ctx the parse tree
	 */
	void exitCics_read(CICSParser.Cics_readContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_read_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_read_body(CICSParser.Cics_read_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_read_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_read_body(CICSParser.Cics_read_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_readnext_readprev}.
	 * @param ctx the parse tree
	 */
	void enterCics_readnext_readprev(CICSParser.Cics_readnext_readprevContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_readnext_readprev}.
	 * @param ctx the parse tree
	 */
	void exitCics_readnext_readprev(CICSParser.Cics_readnext_readprevContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_readnext_readprev_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_readnext_readprev_body(CICSParser.Cics_readnext_readprev_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_readnext_readprev_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_readnext_readprev_body(CICSParser.Cics_readnext_readprev_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_into_set}.
	 * @param ctx the parse tree
	 */
	void enterCics_into_set(CICSParser.Cics_into_setContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_into_set}.
	 * @param ctx the parse tree
	 */
	void exitCics_into_set(CICSParser.Cics_into_setContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_readq}.
	 * @param ctx the parse tree
	 */
	void enterCics_readq(CICSParser.Cics_readqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_readq}.
	 * @param ctx the parse tree
	 */
	void exitCics_readq(CICSParser.Cics_readqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_readq_ts_td}.
	 * @param ctx the parse tree
	 */
	void enterCics_readq_ts_td(CICSParser.Cics_readq_ts_tdContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_readq_ts_td}.
	 * @param ctx the parse tree
	 */
	void exitCics_readq_ts_td(CICSParser.Cics_readq_ts_tdContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_release}.
	 * @param ctx the parse tree
	 */
	void enterCics_release(CICSParser.Cics_releaseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_release}.
	 * @param ctx the parse tree
	 */
	void exitCics_release(CICSParser.Cics_releaseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_release_option}.
	 * @param ctx the parse tree
	 */
	void enterCics_release_option(CICSParser.Cics_release_optionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_release_option}.
	 * @param ctx the parse tree
	 */
	void exitCics_release_option(CICSParser.Cics_release_optionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resync_entryname}.
	 * @param ctx the parse tree
	 */
	void enterCics_resync_entryname(CICSParser.Cics_resync_entrynameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resync_entryname}.
	 * @param ctx the parse tree
	 */
	void exitCics_resync_entryname(CICSParser.Cics_resync_entrynameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resync_entryname_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_resync_entryname_opts(CICSParser.Cics_resync_entryname_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resync_entryname_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_resync_entryname_opts(CICSParser.Cics_resync_entryname_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_remove}.
	 * @param ctx the parse tree
	 */
	void enterCics_remove(CICSParser.Cics_removeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_remove}.
	 * @param ctx the parse tree
	 */
	void exitCics_remove(CICSParser.Cics_removeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_remove_option}.
	 * @param ctx the parse tree
	 */
	void enterCics_remove_option(CICSParser.Cics_remove_optionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_remove_option}.
	 * @param ctx the parse tree
	 */
	void exitCics_remove_option(CICSParser.Cics_remove_optionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_request}.
	 * @param ctx the parse tree
	 */
	void enterCics_request(CICSParser.Cics_requestContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_request}.
	 * @param ctx the parse tree
	 */
	void exitCics_request(CICSParser.Cics_requestContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_request_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_request_body(CICSParser.Cics_request_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_request_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_request_body(CICSParser.Cics_request_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_reset}.
	 * @param ctx the parse tree
	 */
	void enterCics_reset(CICSParser.Cics_resetContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_reset}.
	 * @param ctx the parse tree
	 */
	void exitCics_reset(CICSParser.Cics_resetContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_reset_acqprocess}.
	 * @param ctx the parse tree
	 */
	void enterCics_reset_acqprocess(CICSParser.Cics_reset_acqprocessContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_reset_acqprocess}.
	 * @param ctx the parse tree
	 */
	void exitCics_reset_acqprocess(CICSParser.Cics_reset_acqprocessContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_reset_activity}.
	 * @param ctx the parse tree
	 */
	void enterCics_reset_activity(CICSParser.Cics_reset_activityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_reset_activity}.
	 * @param ctx the parse tree
	 */
	void exitCics_reset_activity(CICSParser.Cics_reset_activityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resetbr}.
	 * @param ctx the parse tree
	 */
	void enterCics_resetbr(CICSParser.Cics_resetbrContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resetbr}.
	 * @param ctx the parse tree
	 */
	void exitCics_resetbr(CICSParser.Cics_resetbrContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resetbr_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_resetbr_options(CICSParser.Cics_resetbr_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resetbr_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_resetbr_options(CICSParser.Cics_resetbr_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_restype}.
	 * @param ctx the parse tree
	 */
	void enterCics_restype(CICSParser.Cics_restypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_restype}.
	 * @param ctx the parse tree
	 */
	void exitCics_restype(CICSParser.Cics_restypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_subrestype}.
	 * @param ctx the parse tree
	 */
	void enterCics_subrestype(CICSParser.Cics_subrestypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_subrestype}.
	 * @param ctx the parse tree
	 */
	void exitCics_subrestype(CICSParser.Cics_subrestypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resume}.
	 * @param ctx the parse tree
	 */
	void enterCics_resume(CICSParser.Cics_resumeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resume}.
	 * @param ctx the parse tree
	 */
	void exitCics_resume(CICSParser.Cics_resumeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resume_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_resume_body(CICSParser.Cics_resume_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resume_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_resume_body(CICSParser.Cics_resume_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_retrieve}.
	 * @param ctx the parse tree
	 */
	void enterCics_retrieve(CICSParser.Cics_retrieveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_retrieve}.
	 * @param ctx the parse tree
	 */
	void exitCics_retrieve(CICSParser.Cics_retrieveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_retrieve_standard}.
	 * @param ctx the parse tree
	 */
	void enterCics_retrieve_standard(CICSParser.Cics_retrieve_standardContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_retrieve_standard}.
	 * @param ctx the parse tree
	 */
	void exitCics_retrieve_standard(CICSParser.Cics_retrieve_standardContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_retrieve_reattach}.
	 * @param ctx the parse tree
	 */
	void enterCics_retrieve_reattach(CICSParser.Cics_retrieve_reattachContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_retrieve_reattach}.
	 * @param ctx the parse tree
	 */
	void exitCics_retrieve_reattach(CICSParser.Cics_retrieve_reattachContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_retrieve_subevent}.
	 * @param ctx the parse tree
	 */
	void enterCics_retrieve_subevent(CICSParser.Cics_retrieve_subeventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_retrieve_subevent}.
	 * @param ctx the parse tree
	 */
	void exitCics_retrieve_subevent(CICSParser.Cics_retrieve_subeventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_return}.
	 * @param ctx the parse tree
	 */
	void enterCics_return(CICSParser.Cics_returnContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_return}.
	 * @param ctx the parse tree
	 */
	void exitCics_return(CICSParser.Cics_returnContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_return_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_return_body(CICSParser.Cics_return_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_return_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_return_body(CICSParser.Cics_return_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_rewind}.
	 * @param ctx the parse tree
	 */
	void enterCics_rewind(CICSParser.Cics_rewindContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_rewind}.
	 * @param ctx the parse tree
	 */
	void exitCics_rewind(CICSParser.Cics_rewindContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_rewind_opts}.
	 * @param ctx the parse tree
	 */
	void enterCics_rewind_opts(CICSParser.Cics_rewind_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_rewind_opts}.
	 * @param ctx the parse tree
	 */
	void exitCics_rewind_opts(CICSParser.Cics_rewind_optsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_rewrite}.
	 * @param ctx the parse tree
	 */
	void enterCics_rewrite(CICSParser.Cics_rewriteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_rewrite}.
	 * @param ctx the parse tree
	 */
	void exitCics_rewrite(CICSParser.Cics_rewriteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_rewrite_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_rewrite_body(CICSParser.Cics_rewrite_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_rewrite_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_rewrite_body(CICSParser.Cics_rewrite_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_route}.
	 * @param ctx the parse tree
	 */
	void enterCics_route(CICSParser.Cics_routeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_route}.
	 * @param ctx the parse tree
	 */
	void exitCics_route(CICSParser.Cics_routeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_route_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_route_body(CICSParser.Cics_route_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_route_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_route_body(CICSParser.Cics_route_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_run}.
	 * @param ctx the parse tree
	 */
	void enterCics_run(CICSParser.Cics_runContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_run}.
	 * @param ctx the parse tree
	 */
	void exitCics_run(CICSParser.Cics_runContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_run_default}.
	 * @param ctx the parse tree
	 */
	void enterCics_run_default(CICSParser.Cics_run_defaultContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_run_default}.
	 * @param ctx the parse tree
	 */
	void exitCics_run_default(CICSParser.Cics_run_defaultContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_run_transid}.
	 * @param ctx the parse tree
	 */
	void enterCics_run_transid(CICSParser.Cics_run_transidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_run_transid}.
	 * @param ctx the parse tree
	 */
	void exitCics_run_transid(CICSParser.Cics_run_transidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set}.
	 * @param ctx the parse tree
	 */
	void enterCics_set(CICSParser.Cics_setContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set}.
	 * @param ctx the parse tree
	 */
	void exitCics_set(CICSParser.Cics_setContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_association_usercorrdata}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_association_usercorrdata(CICSParser.Cics_set_association_usercorrdataContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_association_usercorrdata}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_association_usercorrdata(CICSParser.Cics_set_association_usercorrdataContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_atomservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_atomservice(CICSParser.Cics_set_atomserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_atomservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_atomservice(CICSParser.Cics_set_atomserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_autoinstall}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_autoinstall(CICSParser.Cics_set_autoinstallContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_autoinstall}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_autoinstall(CICSParser.Cics_set_autoinstallContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_brfacility}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_brfacility(CICSParser.Cics_set_brfacilityContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_brfacility}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_brfacility(CICSParser.Cics_set_brfacilityContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_bundle}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_bundle(CICSParser.Cics_set_bundleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_bundle}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_bundle(CICSParser.Cics_set_bundleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_connection}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_connection(CICSParser.Cics_set_connectionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_connection}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_connection(CICSParser.Cics_set_connectionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_db2conn}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_db2conn(CICSParser.Cics_set_db2connContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_db2conn}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_db2conn(CICSParser.Cics_set_db2connContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_db2entry}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_db2entry(CICSParser.Cics_set_db2entryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_db2entry}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_db2entry(CICSParser.Cics_set_db2entryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_db2tran}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_db2tran(CICSParser.Cics_set_db2tranContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_db2tran}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_db2tran(CICSParser.Cics_set_db2tranContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_deletshipped}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_deletshipped(CICSParser.Cics_set_deletshippedContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_deletshipped}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_deletshipped(CICSParser.Cics_set_deletshippedContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_dispatcher}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_dispatcher(CICSParser.Cics_set_dispatcherContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_dispatcher}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_dispatcher(CICSParser.Cics_set_dispatcherContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_doctemplate}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_doctemplate(CICSParser.Cics_set_doctemplateContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_doctemplate}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_doctemplate(CICSParser.Cics_set_doctemplateContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_dsname}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_dsname(CICSParser.Cics_set_dsnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_dsname}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_dsname(CICSParser.Cics_set_dsnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_dumpds}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_dumpds(CICSParser.Cics_set_dumpdsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_dumpds}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_dumpds(CICSParser.Cics_set_dumpdsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_enqmodel}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_enqmodel(CICSParser.Cics_set_enqmodelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_enqmodel}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_enqmodel(CICSParser.Cics_set_enqmodelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_epadapter}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_epadapter(CICSParser.Cics_set_epadapterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_epadapter}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_epadapter(CICSParser.Cics_set_epadapterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_epadapterset}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_epadapterset(CICSParser.Cics_set_epadaptersetContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_epadapterset}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_epadapterset(CICSParser.Cics_set_epadaptersetContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_eventbinding}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_eventbinding(CICSParser.Cics_set_eventbindingContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_eventbinding}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_eventbinding(CICSParser.Cics_set_eventbindingContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_eventprocess}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_eventprocess(CICSParser.Cics_set_eventprocessContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_eventprocess}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_eventprocess(CICSParser.Cics_set_eventprocessContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_file}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_file(CICSParser.Cics_set_fileContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_file}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_file(CICSParser.Cics_set_fileContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_host}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_host(CICSParser.Cics_set_hostContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_host}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_host(CICSParser.Cics_set_hostContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_ipconn}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_ipconn(CICSParser.Cics_set_ipconnContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_ipconn}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_ipconn(CICSParser.Cics_set_ipconnContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_irc}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_irc(CICSParser.Cics_set_ircContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_irc}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_irc(CICSParser.Cics_set_ircContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_journalname}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_journalname(CICSParser.Cics_set_journalnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_journalname}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_journalname(CICSParser.Cics_set_journalnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_journalnum}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_journalnum(CICSParser.Cics_set_journalnumContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_journalnum}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_journalnum(CICSParser.Cics_set_journalnumContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_jvmendpoint}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_jvmendpoint(CICSParser.Cics_set_jvmendpointContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_jvmendpoint}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_jvmendpoint(CICSParser.Cics_set_jvmendpointContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_jvmserver}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_jvmserver(CICSParser.Cics_set_jvmserverContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_jvmserver}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_jvmserver(CICSParser.Cics_set_jvmserverContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_library}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_library(CICSParser.Cics_set_libraryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_library}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_library(CICSParser.Cics_set_libraryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_modename}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_modename(CICSParser.Cics_set_modenameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_modename}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_modename(CICSParser.Cics_set_modenameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_monitor}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_monitor(CICSParser.Cics_set_monitorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_monitor}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_monitor(CICSParser.Cics_set_monitorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_mqconn}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_mqconn(CICSParser.Cics_set_mqconnContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_mqconn}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_mqconn(CICSParser.Cics_set_mqconnContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_mqmonitor}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_mqmonitor(CICSParser.Cics_set_mqmonitorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_mqmonitor}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_mqmonitor(CICSParser.Cics_set_mqmonitorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_netname}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_netname(CICSParser.Cics_set_netnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_netname}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_netname(CICSParser.Cics_set_netnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_otel}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_otel(CICSParser.Cics_set_otelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_otel}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_otel(CICSParser.Cics_set_otelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_pipeline}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_pipeline(CICSParser.Cics_set_pipelineContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_pipeline}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_pipeline(CICSParser.Cics_set_pipelineContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_processtype}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_processtype(CICSParser.Cics_set_processtypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_processtype}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_processtype(CICSParser.Cics_set_processtypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_program}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_program(CICSParser.Cics_set_programContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_program}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_program(CICSParser.Cics_set_programContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_secdiscovery}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_secdiscovery(CICSParser.Cics_set_secdiscoveryContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_secdiscovery}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_secdiscovery(CICSParser.Cics_set_secdiscoveryContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_secrecording}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_secrecording(CICSParser.Cics_set_secrecordingContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_secrecording}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_secrecording(CICSParser.Cics_set_secrecordingContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_statistics}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_statistics(CICSParser.Cics_set_statisticsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_statistics}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_statistics(CICSParser.Cics_set_statisticsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_sysdumpcode}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_sysdumpcode(CICSParser.Cics_set_sysdumpcodeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_sysdumpcode}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_sysdumpcode(CICSParser.Cics_set_sysdumpcodeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_system}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_system(CICSParser.Cics_set_systemContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_system}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_system(CICSParser.Cics_set_systemContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tags_refresh}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tags_refresh(CICSParser.Cics_set_tags_refreshContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tags_refresh}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tags_refresh(CICSParser.Cics_set_tags_refreshContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_task}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_task(CICSParser.Cics_set_taskContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_task}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_task(CICSParser.Cics_set_taskContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tclass}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tclass(CICSParser.Cics_set_tclassContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tclass}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tclass(CICSParser.Cics_set_tclassContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tcpip}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tcpip(CICSParser.Cics_set_tcpipContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tcpip}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tcpip(CICSParser.Cics_set_tcpipContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tcpipservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tcpipservice(CICSParser.Cics_set_tcpipserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tcpipservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tcpipservice(CICSParser.Cics_set_tcpipserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tdqueue}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tdqueue(CICSParser.Cics_set_tdqueueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tdqueue}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tdqueue(CICSParser.Cics_set_tdqueueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tempstorage}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tempstorage(CICSParser.Cics_set_tempstorageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tempstorage}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tempstorage(CICSParser.Cics_set_tempstorageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_terminal}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_terminal(CICSParser.Cics_set_terminalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_terminal}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_terminal(CICSParser.Cics_set_terminalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tracedest}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tracedest(CICSParser.Cics_set_tracedestContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tracedest}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tracedest(CICSParser.Cics_set_tracedestContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_traceflag}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_traceflag(CICSParser.Cics_set_traceflagContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_traceflag}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_traceflag(CICSParser.Cics_set_traceflagContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tracetype}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tracetype(CICSParser.Cics_set_tracetypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tracetype}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tracetype(CICSParser.Cics_set_tracetypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tranclass}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tranclass(CICSParser.Cics_set_tranclassContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tranclass}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tranclass(CICSParser.Cics_set_tranclassContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_trandumpcode}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_trandumpcode(CICSParser.Cics_set_trandumpcodeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_trandumpcode}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_trandumpcode(CICSParser.Cics_set_trandumpcodeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_transaction}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_transaction(CICSParser.Cics_set_transactionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_transaction}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_transaction(CICSParser.Cics_set_transactionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_tsqueue}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_tsqueue(CICSParser.Cics_set_tsqueueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_tsqueue}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_tsqueue(CICSParser.Cics_set_tsqueueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_uow}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_uow(CICSParser.Cics_set_uowContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_uow}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_uow(CICSParser.Cics_set_uowContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_uowlink}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_uowlink(CICSParser.Cics_set_uowlinkContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_uowlink}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_uowlink(CICSParser.Cics_set_uowlinkContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_urimap}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_urimap(CICSParser.Cics_set_urimapContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_urimap}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_urimap(CICSParser.Cics_set_urimapContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_volume}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_volume(CICSParser.Cics_set_volumeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_volume}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_volume(CICSParser.Cics_set_volumeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_vtam}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_vtam(CICSParser.Cics_set_vtamContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_vtam}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_vtam(CICSParser.Cics_set_vtamContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_web}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_web(CICSParser.Cics_set_webContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_web}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_web(CICSParser.Cics_set_webContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_webservice}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_webservice(CICSParser.Cics_set_webserviceContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_webservice}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_webservice(CICSParser.Cics_set_webserviceContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_wlmhealth}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_wlmhealth(CICSParser.Cics_set_wlmhealthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_wlmhealth}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_wlmhealth(CICSParser.Cics_set_wlmhealthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_set_xmltransform}.
	 * @param ctx the parse tree
	 */
	void enterCics_set_xmltransform(CICSParser.Cics_set_xmltransformContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_set_xmltransform}.
	 * @param ctx the parse tree
	 */
	void exitCics_set_xmltransform(CICSParser.Cics_set_xmltransformContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_signal}.
	 * @param ctx the parse tree
	 */
	void enterCics_signal(CICSParser.Cics_signalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_signal}.
	 * @param ctx the parse tree
	 */
	void exitCics_signal(CICSParser.Cics_signalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_signal_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_signal_options(CICSParser.Cics_signal_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_signal_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_signal_options(CICSParser.Cics_signal_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_signoff}.
	 * @param ctx the parse tree
	 */
	void enterCics_signoff(CICSParser.Cics_signoffContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_signoff}.
	 * @param ctx the parse tree
	 */
	void exitCics_signoff(CICSParser.Cics_signoffContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_signon}.
	 * @param ctx the parse tree
	 */
	void enterCics_signon(CICSParser.Cics_signonContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_signon}.
	 * @param ctx the parse tree
	 */
	void exitCics_signon(CICSParser.Cics_signonContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_signon_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_signon_body(CICSParser.Cics_signon_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_signon_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_signon_body(CICSParser.Cics_signon_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_signon_token_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_signon_token_body(CICSParser.Cics_signon_token_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_signon_token_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_signon_token_body(CICSParser.Cics_signon_token_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_soapfault}.
	 * @param ctx the parse tree
	 */
	void enterCics_soapfault(CICSParser.Cics_soapfaultContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_soapfault}.
	 * @param ctx the parse tree
	 */
	void exitCics_soapfault(CICSParser.Cics_soapfaultContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_soapfault_add}.
	 * @param ctx the parse tree
	 */
	void enterCics_soapfault_add(CICSParser.Cics_soapfault_addContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_soapfault_add}.
	 * @param ctx the parse tree
	 */
	void exitCics_soapfault_add(CICSParser.Cics_soapfault_addContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_soapfault_create}.
	 * @param ctx the parse tree
	 */
	void enterCics_soapfault_create(CICSParser.Cics_soapfault_createContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_soapfault_create}.
	 * @param ctx the parse tree
	 */
	void exitCics_soapfault_create(CICSParser.Cics_soapfault_createContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_soapfault_delete}.
	 * @param ctx the parse tree
	 */
	void enterCics_soapfault_delete(CICSParser.Cics_soapfault_deleteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_soapfault_delete}.
	 * @param ctx the parse tree
	 */
	void exitCics_soapfault_delete(CICSParser.Cics_soapfault_deleteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolclose}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolclose(CICSParser.Cics_spoolcloseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolclose}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolclose(CICSParser.Cics_spoolcloseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolclose_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolclose_options(CICSParser.Cics_spoolclose_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolclose_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolclose_options(CICSParser.Cics_spoolclose_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolopen}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolopen(CICSParser.Cics_spoolopenContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolopen}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolopen(CICSParser.Cics_spoolopenContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolopen_input}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolopen_input(CICSParser.Cics_spoolopen_inputContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolopen_input}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolopen_input(CICSParser.Cics_spoolopen_inputContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolopen_output}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolopen_output(CICSParser.Cics_spoolopen_outputContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolopen_output}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolopen_output(CICSParser.Cics_spoolopen_outputContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolread}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolread(CICSParser.Cics_spoolreadContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolread}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolread(CICSParser.Cics_spoolreadContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolread_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolread_options(CICSParser.Cics_spoolread_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolread_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolread_options(CICSParser.Cics_spoolread_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolwrite}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolwrite(CICSParser.Cics_spoolwriteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolwrite}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolwrite(CICSParser.Cics_spoolwriteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_spoolwrite_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_spoolwrite_options(CICSParser.Cics_spoolwrite_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_spoolwrite_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_spoolwrite_options(CICSParser.Cics_spoolwrite_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_start}.
	 * @param ctx the parse tree
	 */
	void enterCics_start(CICSParser.Cics_startContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_start}.
	 * @param ctx the parse tree
	 */
	void exitCics_start(CICSParser.Cics_startContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_start_transid}.
	 * @param ctx the parse tree
	 */
	void enterCics_start_transid(CICSParser.Cics_start_transidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_start_transid}.
	 * @param ctx the parse tree
	 */
	void exitCics_start_transid(CICSParser.Cics_start_transidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_start_attach}.
	 * @param ctx the parse tree
	 */
	void enterCics_start_attach(CICSParser.Cics_start_attachContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_start_attach}.
	 * @param ctx the parse tree
	 */
	void exitCics_start_attach(CICSParser.Cics_start_attachContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_start_brexit}.
	 * @param ctx the parse tree
	 */
	void enterCics_start_brexit(CICSParser.Cics_start_brexitContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_start_brexit}.
	 * @param ctx the parse tree
	 */
	void exitCics_start_brexit(CICSParser.Cics_start_brexitContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_start_channel}.
	 * @param ctx the parse tree
	 */
	void enterCics_start_channel(CICSParser.Cics_start_channelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_start_channel}.
	 * @param ctx the parse tree
	 */
	void exitCics_start_channel(CICSParser.Cics_start_channelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_zero_digit}.
	 * @param ctx the parse tree
	 */
	void enterCics_zero_digit(CICSParser.Cics_zero_digitContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_zero_digit}.
	 * @param ctx the parse tree
	 */
	void exitCics_zero_digit(CICSParser.Cics_zero_digitContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_startbr}.
	 * @param ctx the parse tree
	 */
	void enterCics_startbr(CICSParser.Cics_startbrContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_startbr}.
	 * @param ctx the parse tree
	 */
	void exitCics_startbr(CICSParser.Cics_startbrContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_startbr_options}.
	 * @param ctx the parse tree
	 */
	void enterCics_startbr_options(CICSParser.Cics_startbr_optionsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_startbr_options}.
	 * @param ctx the parse tree
	 */
	void exitCics_startbr_options(CICSParser.Cics_startbr_optionsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_startbrowse}.
	 * @param ctx the parse tree
	 */
	void enterCics_startbrowse(CICSParser.Cics_startbrowseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_startbrowse}.
	 * @param ctx the parse tree
	 */
	void exitCics_startbrowse(CICSParser.Cics_startbrowseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_startbrowse_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_startbrowse_body(CICSParser.Cics_startbrowse_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_startbrowse_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_startbrowse_body(CICSParser.Cics_startbrowse_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_startbrowse_processWithValue_subrule}.
	 * @param ctx the parse tree
	 */
	void enterCics_startbrowse_processWithValue_subrule(CICSParser.Cics_startbrowse_processWithValue_subruleContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_startbrowse_processWithValue_subrule}.
	 * @param ctx the parse tree
	 */
	void exitCics_startbrowse_processWithValue_subrule(CICSParser.Cics_startbrowse_processWithValue_subruleContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_suspend}.
	 * @param ctx the parse tree
	 */
	void enterCics_suspend(CICSParser.Cics_suspendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_suspend}.
	 * @param ctx the parse tree
	 */
	void exitCics_suspend(CICSParser.Cics_suspendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_suspend_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_suspend_body(CICSParser.Cics_suspend_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_suspend_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_suspend_body(CICSParser.Cics_suspend_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_syncpoint}.
	 * @param ctx the parse tree
	 */
	void enterCics_syncpoint(CICSParser.Cics_syncpointContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_syncpoint}.
	 * @param ctx the parse tree
	 */
	void exitCics_syncpoint(CICSParser.Cics_syncpointContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_syncpoint_rollback}.
	 * @param ctx the parse tree
	 */
	void enterCics_syncpoint_rollback(CICSParser.Cics_syncpoint_rollbackContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_syncpoint_rollback}.
	 * @param ctx the parse tree
	 */
	void exitCics_syncpoint_rollback(CICSParser.Cics_syncpoint_rollbackContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_test}.
	 * @param ctx the parse tree
	 */
	void enterCics_test(CICSParser.Cics_testContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_test}.
	 * @param ctx the parse tree
	 */
	void exitCics_test(CICSParser.Cics_testContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_test_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_test_body(CICSParser.Cics_test_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_test_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_test_body(CICSParser.Cics_test_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_transform}.
	 * @param ctx the parse tree
	 */
	void enterCics_transform(CICSParser.Cics_transformContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_transform}.
	 * @param ctx the parse tree
	 */
	void exitCics_transform(CICSParser.Cics_transformContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_transform_json}.
	 * @param ctx the parse tree
	 */
	void enterCics_transform_json(CICSParser.Cics_transform_jsonContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_transform_json}.
	 * @param ctx the parse tree
	 */
	void exitCics_transform_json(CICSParser.Cics_transform_jsonContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_transform_xml}.
	 * @param ctx the parse tree
	 */
	void enterCics_transform_xml(CICSParser.Cics_transform_xmlContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_transform_xml}.
	 * @param ctx the parse tree
	 */
	void exitCics_transform_xml(CICSParser.Cics_transform_xmlContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_unlock}.
	 * @param ctx the parse tree
	 */
	void enterCics_unlock(CICSParser.Cics_unlockContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_unlock}.
	 * @param ctx the parse tree
	 */
	void exitCics_unlock(CICSParser.Cics_unlockContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_unlock_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_unlock_body(CICSParser.Cics_unlock_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_unlock_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_unlock_body(CICSParser.Cics_unlock_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_update}.
	 * @param ctx the parse tree
	 */
	void enterCics_update(CICSParser.Cics_updateContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_update}.
	 * @param ctx the parse tree
	 */
	void exitCics_update(CICSParser.Cics_updateContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_update_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void enterCics_update_counter_dcounter(CICSParser.Cics_update_counter_dcounterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_update_counter_dcounter}.
	 * @param ctx the parse tree
	 */
	void exitCics_update_counter_dcounter(CICSParser.Cics_update_counter_dcounterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_verify}.
	 * @param ctx the parse tree
	 */
	void enterCics_verify(CICSParser.Cics_verifyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_verify}.
	 * @param ctx the parse tree
	 */
	void exitCics_verify(CICSParser.Cics_verifyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_verify_password}.
	 * @param ctx the parse tree
	 */
	void enterCics_verify_password(CICSParser.Cics_verify_passwordContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_verify_password}.
	 * @param ctx the parse tree
	 */
	void exitCics_verify_password(CICSParser.Cics_verify_passwordContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_verify_phrase}.
	 * @param ctx the parse tree
	 */
	void enterCics_verify_phrase(CICSParser.Cics_verify_phraseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_verify_phrase}.
	 * @param ctx the parse tree
	 */
	void exitCics_verify_phrase(CICSParser.Cics_verify_phraseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_verify_token}.
	 * @param ctx the parse tree
	 */
	void enterCics_verify_token(CICSParser.Cics_verify_tokenContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_verify_token}.
	 * @param ctx the parse tree
	 */
	void exitCics_verify_token(CICSParser.Cics_verify_tokenContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait(CICSParser.Cics_waitContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait(CICSParser.Cics_waitContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait_convid}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait_convid(CICSParser.Cics_wait_convidContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait_convid}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait_convid(CICSParser.Cics_wait_convidContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait_event}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait_event(CICSParser.Cics_wait_eventContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait_event}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait_event(CICSParser.Cics_wait_eventContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait_external}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait_external(CICSParser.Cics_wait_externalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait_external}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait_external(CICSParser.Cics_wait_externalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait_journalname}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait_journalname(CICSParser.Cics_wait_journalnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait_journalname}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait_journalname(CICSParser.Cics_wait_journalnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait_signal}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait_signal(CICSParser.Cics_wait_signalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait_signal}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait_signal(CICSParser.Cics_wait_signalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wait_terminal}.
	 * @param ctx the parse tree
	 */
	void enterCics_wait_terminal(CICSParser.Cics_wait_terminalContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wait_terminal}.
	 * @param ctx the parse tree
	 */
	void exitCics_wait_terminal(CICSParser.Cics_wait_terminalContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_waitcics}.
	 * @param ctx the parse tree
	 */
	void enterCics_waitcics(CICSParser.Cics_waitcicsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_waitcics}.
	 * @param ctx the parse tree
	 */
	void exitCics_waitcics(CICSParser.Cics_waitcicsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_waitcics_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_waitcics_body(CICSParser.Cics_waitcics_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_waitcics_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_waitcics_body(CICSParser.Cics_waitcics_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web}.
	 * @param ctx the parse tree
	 */
	void enterCics_web(CICSParser.Cics_webContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web}.
	 * @param ctx the parse tree
	 */
	void exitCics_web(CICSParser.Cics_webContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_close}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_close(CICSParser.Cics_web_closeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_close}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_close(CICSParser.Cics_web_closeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_converse}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_converse(CICSParser.Cics_web_converseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_converse}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_converse(CICSParser.Cics_web_converseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_endbrowse}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_endbrowse(CICSParser.Cics_web_endbrowseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_endbrowse}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_endbrowse(CICSParser.Cics_web_endbrowseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_extract}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_extract(CICSParser.Cics_web_extractContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_extract}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_extract(CICSParser.Cics_web_extractContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_open}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_open(CICSParser.Cics_web_openContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_open}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_open(CICSParser.Cics_web_openContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_parse}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_parse(CICSParser.Cics_web_parseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_parse}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_parse(CICSParser.Cics_web_parseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_read}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_read(CICSParser.Cics_web_readContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_read}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_read(CICSParser.Cics_web_readContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_readnext}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_readnext(CICSParser.Cics_web_readnextContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_readnext}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_readnext(CICSParser.Cics_web_readnextContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_receive}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_receive(CICSParser.Cics_web_receiveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_receive}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_receive(CICSParser.Cics_web_receiveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_retrieve}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_retrieve(CICSParser.Cics_web_retrieveContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_retrieve}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_retrieve(CICSParser.Cics_web_retrieveContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_send}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_send(CICSParser.Cics_web_sendContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_send}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_send(CICSParser.Cics_web_sendContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_startbrowse}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_startbrowse(CICSParser.Cics_web_startbrowseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_startbrowse}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_startbrowse(CICSParser.Cics_web_startbrowseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_web_write}.
	 * @param ctx the parse tree
	 */
	void enterCics_web_write(CICSParser.Cics_web_writeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_web_write}.
	 * @param ctx the parse tree
	 */
	void exitCics_web_write(CICSParser.Cics_web_writeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_write}.
	 * @param ctx the parse tree
	 */
	void enterCics_write(CICSParser.Cics_writeContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_write}.
	 * @param ctx the parse tree
	 */
	void exitCics_write(CICSParser.Cics_writeContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_write_file}.
	 * @param ctx the parse tree
	 */
	void enterCics_write_file(CICSParser.Cics_write_fileContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_write_file}.
	 * @param ctx the parse tree
	 */
	void exitCics_write_file(CICSParser.Cics_write_fileContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_write_journalname}.
	 * @param ctx the parse tree
	 */
	void enterCics_write_journalname(CICSParser.Cics_write_journalnameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_write_journalname}.
	 * @param ctx the parse tree
	 */
	void exitCics_write_journalname(CICSParser.Cics_write_journalnameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_write_operator}.
	 * @param ctx the parse tree
	 */
	void enterCics_write_operator(CICSParser.Cics_write_operatorContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_write_operator}.
	 * @param ctx the parse tree
	 */
	void exitCics_write_operator(CICSParser.Cics_write_operatorContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_writeq}.
	 * @param ctx the parse tree
	 */
	void enterCics_writeq(CICSParser.Cics_writeqContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_writeq}.
	 * @param ctx the parse tree
	 */
	void exitCics_writeq(CICSParser.Cics_writeqContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_writeq_td}.
	 * @param ctx the parse tree
	 */
	void enterCics_writeq_td(CICSParser.Cics_writeq_tdContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_writeq_td}.
	 * @param ctx the parse tree
	 */
	void exitCics_writeq_td(CICSParser.Cics_writeq_tdContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_writeq_ts}.
	 * @param ctx the parse tree
	 */
	void enterCics_writeq_ts(CICSParser.Cics_writeq_tsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_writeq_ts}.
	 * @param ctx the parse tree
	 */
	void exitCics_writeq_ts(CICSParser.Cics_writeq_tsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wsacontext}.
	 * @param ctx the parse tree
	 */
	void enterCics_wsacontext(CICSParser.Cics_wsacontextContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wsacontext}.
	 * @param ctx the parse tree
	 */
	void exitCics_wsacontext(CICSParser.Cics_wsacontextContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wsacontext_build}.
	 * @param ctx the parse tree
	 */
	void enterCics_wsacontext_build(CICSParser.Cics_wsacontext_buildContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wsacontext_build}.
	 * @param ctx the parse tree
	 */
	void exitCics_wsacontext_build(CICSParser.Cics_wsacontext_buildContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wsacontext_delete}.
	 * @param ctx the parse tree
	 */
	void enterCics_wsacontext_delete(CICSParser.Cics_wsacontext_deleteContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wsacontext_delete}.
	 * @param ctx the parse tree
	 */
	void exitCics_wsacontext_delete(CICSParser.Cics_wsacontext_deleteContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wsacontext_get}.
	 * @param ctx the parse tree
	 */
	void enterCics_wsacontext_get(CICSParser.Cics_wsacontext_getContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wsacontext_get}.
	 * @param ctx the parse tree
	 */
	void exitCics_wsacontext_get(CICSParser.Cics_wsacontext_getContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wsaepr}.
	 * @param ctx the parse tree
	 */
	void enterCics_wsaepr(CICSParser.Cics_wsaeprContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wsaepr}.
	 * @param ctx the parse tree
	 */
	void exitCics_wsaepr(CICSParser.Cics_wsaeprContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_wsaepr_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_wsaepr_body(CICSParser.Cics_wsaepr_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_wsaepr_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_wsaepr_body(CICSParser.Cics_wsaepr_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_xctl}.
	 * @param ctx the parse tree
	 */
	void enterCics_xctl(CICSParser.Cics_xctlContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_xctl}.
	 * @param ctx the parse tree
	 */
	void exitCics_xctl(CICSParser.Cics_xctlContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_xctl_body}.
	 * @param ctx the parse tree
	 */
	void enterCics_xctl_body(CICSParser.Cics_xctl_bodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_xctl_body}.
	 * @param ctx the parse tree
	 */
	void exitCics_xctl_body(CICSParser.Cics_xctl_bodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_file_name}.
	 * @param ctx the parse tree
	 */
	void enterCics_file_name(CICSParser.Cics_file_nameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_file_name}.
	 * @param ctx the parse tree
	 */
	void exitCics_file_name(CICSParser.Cics_file_nameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_resp}.
	 * @param ctx the parse tree
	 */
	void enterCics_resp(CICSParser.Cics_respContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_resp}.
	 * @param ctx the parse tree
	 */
	void exitCics_resp(CICSParser.Cics_respContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_handle_response}.
	 * @param ctx the parse tree
	 */
	void enterCics_handle_response(CICSParser.Cics_handle_responseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_handle_response}.
	 * @param ctx the parse tree
	 */
	void exitCics_handle_response(CICSParser.Cics_handle_responseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_inline_handle_exception}.
	 * @param ctx the parse tree
	 */
	void enterCics_inline_handle_exception(CICSParser.Cics_inline_handle_exceptionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_inline_handle_exception}.
	 * @param ctx the parse tree
	 */
	void exitCics_inline_handle_exception(CICSParser.Cics_inline_handle_exceptionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_data_area}.
	 * @param ctx the parse tree
	 */
	void enterCics_data_area(CICSParser.Cics_data_areaContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_data_area}.
	 * @param ctx the parse tree
	 */
	void exitCics_data_area(CICSParser.Cics_data_areaContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_data_value}.
	 * @param ctx the parse tree
	 */
	void enterCics_data_value(CICSParser.Cics_data_valueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_data_value}.
	 * @param ctx the parse tree
	 */
	void exitCics_data_value(CICSParser.Cics_data_valueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_cvda}.
	 * @param ctx the parse tree
	 */
	void enterCics_cvda(CICSParser.Cics_cvdaContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_cvda}.
	 * @param ctx the parse tree
	 */
	void exitCics_cvda(CICSParser.Cics_cvdaContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_name}.
	 * @param ctx the parse tree
	 */
	void enterCics_name(CICSParser.Cics_nameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_name}.
	 * @param ctx the parse tree
	 */
	void exitCics_name(CICSParser.Cics_nameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_ref}.
	 * @param ctx the parse tree
	 */
	void enterCics_ref(CICSParser.Cics_refContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_ref}.
	 * @param ctx the parse tree
	 */
	void exitCics_ref(CICSParser.Cics_refContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_rebuild}.
	 * @param ctx the parse tree
	 */
	void enterCics_rebuild(CICSParser.Cics_rebuildContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_rebuild}.
	 * @param ctx the parse tree
	 */
	void exitCics_rebuild(CICSParser.Cics_rebuildContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_hhmmss}.
	 * @param ctx the parse tree
	 */
	void enterCics_hhmmss(CICSParser.Cics_hhmmssContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_hhmmss}.
	 * @param ctx the parse tree
	 */
	void exitCics_hhmmss(CICSParser.Cics_hhmmssContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_label}.
	 * @param ctx the parse tree
	 */
	void enterCics_label(CICSParser.Cics_labelContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_label}.
	 * @param ctx the parse tree
	 */
	void exitCics_label(CICSParser.Cics_labelContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_value}.
	 * @param ctx the parse tree
	 */
	void enterCics_value(CICSParser.Cics_valueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_value}.
	 * @param ctx the parse tree
	 */
	void exitCics_value(CICSParser.Cics_valueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cicsWord}.
	 * @param ctx the parse tree
	 */
	void enterCicsWord(CICSParser.CicsWordContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cicsWord}.
	 * @param ctx the parse tree
	 */
	void exitCicsWord(CICSParser.CicsWordContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cicsWords}.
	 * @param ctx the parse tree
	 */
	void enterCicsWords(CICSParser.CicsWordsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cicsWords}.
	 * @param ctx the parse tree
	 */
	void exitCicsWords(CICSParser.CicsWordsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cicsLexerDefinedVariableUsageTokens}.
	 * @param ctx the parse tree
	 */
	void enterCicsLexerDefinedVariableUsageTokens(CICSParser.CicsLexerDefinedVariableUsageTokensContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cicsLexerDefinedVariableUsageTokens}.
	 * @param ctx the parse tree
	 */
	void exitCicsLexerDefinedVariableUsageTokens(CICSParser.CicsLexerDefinedVariableUsageTokensContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#name}.
	 * @param ctx the parse tree
	 */
	void enterName(CICSParser.NameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#name}.
	 * @param ctx the parse tree
	 */
	void exitName(CICSParser.NameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#data_value}.
	 * @param ctx the parse tree
	 */
	void enterData_value(CICSParser.Data_valueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#data_value}.
	 * @param ctx the parse tree
	 */
	void exitData_value(CICSParser.Data_valueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#data_area}.
	 * @param ctx the parse tree
	 */
	void enterData_area(CICSParser.Data_areaContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#data_area}.
	 * @param ctx the parse tree
	 */
	void exitData_area(CICSParser.Data_areaContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cvda}.
	 * @param ctx the parse tree
	 */
	void enterCvda(CICSParser.CvdaContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cvda}.
	 * @param ctx the parse tree
	 */
	void exitCvda(CICSParser.CvdaContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#ptr_ref}.
	 * @param ctx the parse tree
	 */
	void enterPtr_ref(CICSParser.Ptr_refContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#ptr_ref}.
	 * @param ctx the parse tree
	 */
	void exitPtr_ref(CICSParser.Ptr_refContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#ptr_value}.
	 * @param ctx the parse tree
	 */
	void enterPtr_value(CICSParser.Ptr_valueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#ptr_value}.
	 * @param ctx the parse tree
	 */
	void exitPtr_value(CICSParser.Ptr_valueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cics_document_set_symbollist}.
	 * @param ctx the parse tree
	 */
	void enterCics_document_set_symbollist(CICSParser.Cics_document_set_symbollistContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cics_document_set_symbollist}.
	 * @param ctx the parse tree
	 */
	void exitCics_document_set_symbollist(CICSParser.Cics_document_set_symbollistContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#hhmmss}.
	 * @param ctx the parse tree
	 */
	void enterHhmmss(CICSParser.HhmmssContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#hhmmss}.
	 * @param ctx the parse tree
	 */
	void exitHhmmss(CICSParser.HhmmssContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#paragraphNameUsage}.
	 * @param ctx the parse tree
	 */
	void enterParagraphNameUsage(CICSParser.ParagraphNameUsageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#paragraphNameUsage}.
	 * @param ctx the parse tree
	 */
	void exitParagraphNameUsage(CICSParser.ParagraphNameUsageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#variableNameUsage}.
	 * @param ctx the parse tree
	 */
	void enterVariableNameUsage(CICSParser.VariableNameUsageContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#variableNameUsage}.
	 * @param ctx the parse tree
	 */
	void exitVariableNameUsage(CICSParser.VariableNameUsageContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#generalIdentifier}.
	 * @param ctx the parse tree
	 */
	void enterGeneralIdentifier(CICSParser.GeneralIdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#generalIdentifier}.
	 * @param ctx the parse tree
	 */
	void exitGeneralIdentifier(CICSParser.GeneralIdentifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#functionCall}.
	 * @param ctx the parse tree
	 */
	void enterFunctionCall(CICSParser.FunctionCallContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#functionCall}.
	 * @param ctx the parse tree
	 */
	void exitFunctionCall(CICSParser.FunctionCallContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#referenceModifier}.
	 * @param ctx the parse tree
	 */
	void enterReferenceModifier(CICSParser.ReferenceModifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#referenceModifier}.
	 * @param ctx the parse tree
	 */
	void exitReferenceModifier(CICSParser.ReferenceModifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#characterPosition}.
	 * @param ctx the parse tree
	 */
	void enterCharacterPosition(CICSParser.CharacterPositionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#characterPosition}.
	 * @param ctx the parse tree
	 */
	void exitCharacterPosition(CICSParser.CharacterPositionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#length}.
	 * @param ctx the parse tree
	 */
	void enterLength(CICSParser.LengthContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#length}.
	 * @param ctx the parse tree
	 */
	void exitLength(CICSParser.LengthContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#argument}.
	 * @param ctx the parse tree
	 */
	void enterArgument(CICSParser.ArgumentContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#argument}.
	 * @param ctx the parse tree
	 */
	void exitArgument(CICSParser.ArgumentContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#qualifiedDataName}.
	 * @param ctx the parse tree
	 */
	void enterQualifiedDataName(CICSParser.QualifiedDataNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#qualifiedDataName}.
	 * @param ctx the parse tree
	 */
	void exitQualifiedDataName(CICSParser.QualifiedDataNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#tableCall}.
	 * @param ctx the parse tree
	 */
	void enterTableCall(CICSParser.TableCallContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#tableCall}.
	 * @param ctx the parse tree
	 */
	void exitTableCall(CICSParser.TableCallContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#specialRegister}.
	 * @param ctx the parse tree
	 */
	void enterSpecialRegister(CICSParser.SpecialRegisterContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#specialRegister}.
	 * @param ctx the parse tree
	 */
	void exitSpecialRegister(CICSParser.SpecialRegisterContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#inData}.
	 * @param ctx the parse tree
	 */
	void enterInData(CICSParser.InDataContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#inData}.
	 * @param ctx the parse tree
	 */
	void exitInData(CICSParser.InDataContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#dataName}.
	 * @param ctx the parse tree
	 */
	void enterDataName(CICSParser.DataNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#dataName}.
	 * @param ctx the parse tree
	 */
	void exitDataName(CICSParser.DataNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#functionName}.
	 * @param ctx the parse tree
	 */
	void enterFunctionName(CICSParser.FunctionNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#functionName}.
	 * @param ctx the parse tree
	 */
	void exitFunctionName(CICSParser.FunctionNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#figurativeConstant}.
	 * @param ctx the parse tree
	 */
	void enterFigurativeConstant(CICSParser.FigurativeConstantContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#figurativeConstant}.
	 * @param ctx the parse tree
	 */
	void exitFigurativeConstant(CICSParser.FigurativeConstantContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#booleanLiteral}.
	 * @param ctx the parse tree
	 */
	void enterBooleanLiteral(CICSParser.BooleanLiteralContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#booleanLiteral}.
	 * @param ctx the parse tree
	 */
	void exitBooleanLiteral(CICSParser.BooleanLiteralContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#numericLiteral}.
	 * @param ctx the parse tree
	 */
	void enterNumericLiteral(CICSParser.NumericLiteralContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#numericLiteral}.
	 * @param ctx the parse tree
	 */
	void exitNumericLiteral(CICSParser.NumericLiteralContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#integerLiteral}.
	 * @param ctx the parse tree
	 */
	void enterIntegerLiteral(CICSParser.IntegerLiteralContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#integerLiteral}.
	 * @param ctx the parse tree
	 */
	void exitIntegerLiteral(CICSParser.IntegerLiteralContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cicsDfhValue}.
	 * @param ctx the parse tree
	 */
	void enterCicsDfhValue(CICSParser.CicsDfhValueContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cicsDfhValue}.
	 * @param ctx the parse tree
	 */
	void exitCicsDfhValue(CICSParser.CicsDfhValueContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cicsDfhResp}.
	 * @param ctx the parse tree
	 */
	void enterCicsDfhResp(CICSParser.CicsDfhRespContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cicsDfhResp}.
	 * @param ctx the parse tree
	 */
	void exitCicsDfhResp(CICSParser.CicsDfhRespContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#literal}.
	 * @param ctx the parse tree
	 */
	void enterLiteral(CICSParser.LiteralContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#literal}.
	 * @param ctx the parse tree
	 */
	void exitLiteral(CICSParser.LiteralContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#arithmeticExpression}.
	 * @param ctx the parse tree
	 */
	void enterArithmeticExpression(CICSParser.ArithmeticExpressionContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#arithmeticExpression}.
	 * @param ctx the parse tree
	 */
	void exitArithmeticExpression(CICSParser.ArithmeticExpressionContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#plusMinus}.
	 * @param ctx the parse tree
	 */
	void enterPlusMinus(CICSParser.PlusMinusContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#plusMinus}.
	 * @param ctx the parse tree
	 */
	void exitPlusMinus(CICSParser.PlusMinusContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#multDivs}.
	 * @param ctx the parse tree
	 */
	void enterMultDivs(CICSParser.MultDivsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#multDivs}.
	 * @param ctx the parse tree
	 */
	void exitMultDivs(CICSParser.MultDivsContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#multDiv}.
	 * @param ctx the parse tree
	 */
	void enterMultDiv(CICSParser.MultDivContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#multDiv}.
	 * @param ctx the parse tree
	 */
	void exitMultDiv(CICSParser.MultDivContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#powers}.
	 * @param ctx the parse tree
	 */
	void enterPowers(CICSParser.PowersContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#powers}.
	 * @param ctx the parse tree
	 */
	void exitPowers(CICSParser.PowersContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#power}.
	 * @param ctx the parse tree
	 */
	void enterPower(CICSParser.PowerContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#power}.
	 * @param ctx the parse tree
	 */
	void exitPower(CICSParser.PowerContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#basis}.
	 * @param ctx the parse tree
	 */
	void enterBasis(CICSParser.BasisContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#basis}.
	 * @param ctx the parse tree
	 */
	void exitBasis(CICSParser.BasisContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#commaClause}.
	 * @param ctx the parse tree
	 */
	void enterCommaClause(CICSParser.CommaClauseContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#commaClause}.
	 * @param ctx the parse tree
	 */
	void exitCommaClause(CICSParser.CommaClauseContext ctx);
	/**
	 * Enter a parse tree produced by {@link CICSParser#cvda_opts}.
	 * @param ctx the parse tree
	 */
	void enterCvda_opts(CICSParser.Cvda_optsContext ctx);
	/**
	 * Exit a parse tree produced by {@link CICSParser#cvda_opts}.
	 * @param ctx the parse tree
	 */
	void exitCvda_opts(CICSParser.Cvda_optsContext ctx);
}