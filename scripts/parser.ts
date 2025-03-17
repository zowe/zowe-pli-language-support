import { AbstractParser, IntermediateBinaryExpression } from './abstract-parser';
import * as tokens from './tokens';
import * as ast from './ast';
import { CstNodeKind } from './cst';

export class PliParser extends AbstractParser {
    constructor() {
        super(tokens.all);
        this.performSelfAnalysis();
    }

    private createPliProgram(): ast.PliProgram {
        return {
            kind: ast.SyntaxKind.PliProgram,
            statements: [],
        };
    }

    PliProgram = this.RULE('PliProgram', () => {
        let element = this.push(this.createPliProgram());

        this.MANY(() => {
            this.SUBRULE_ASSIGN(this.Statement, {
                assign: result => {
                    element.statements.push(result);
                }
            });
        });

        return this.pop();
    });
    private createPackage(): ast.Package {
        return {
            kind: ast.SyntaxKind.Package,
            exports: null,
            reserves: null,
            options: null,
            statements: [],
            end: null,
        };
    }

    Package = this.RULE('Package', () => {
        let element = this.push(this.createPackage());

        this.CONSUME_ASSIGN1(tokens.PACKAGE, token => {
            this.tokenPayload(token, element, CstNodeKind.Package_PACKAGE_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Exports, {
                assign: result => {
                    element.exports = result;
                }
            });
        });
        this.OPTION2(() => {
            this.SUBRULE_ASSIGN1(this.Reserves, {
                assign: result => {
                    element.reserves = result;
                }
            });
        });
        this.OPTION3(() => {
            this.SUBRULE_ASSIGN1(this.Options, {
                assign: result => {
                    element.options = result;
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.Package_Semicolon_0);
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.Statement, {
                assign: result => {
                    element.statements.push(result);
                }
            });
        });
        this.SUBRULE_ASSIGN1(this.EndStatement, {
            assign: result => {
                element.end = result;
            }
        });
        this.CONSUME_ASSIGN2(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.Package_Semicolon_1);
        });

        return this.pop();
    });
    private createConditionPrefix(): ast.ConditionPrefix {
        return {
            kind: ast.SyntaxKind.ConditionPrefix,
            items: [],
        };
    }

    ConditionPrefix = this.RULE('ConditionPrefix', () => {
        let element = this.push(this.createConditionPrefix());

        this.AT_LEAST_ONE1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ConditionPrefix_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.ConditionPrefixItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ConditionPrefix_CloseParen_0);
            });
            this.CONSUME_ASSIGN1(tokens.Colon, token => {
                this.tokenPayload(token, element, CstNodeKind.ConditionPrefix_Colon_0);
            });
        });

        return this.pop();
    });
    private createConditionPrefixItem(): ast.ConditionPrefixItem {
        return {
            kind: ast.SyntaxKind.ConditionPrefixItem,
            conditions: [],
        };
    }

    ConditionPrefixItem = this.RULE('ConditionPrefixItem', () => {
        let element = this.push(this.createConditionPrefixItem());

        this.SUBRULE_ASSIGN1(this.Condition, {
            assign: result => {
                element.conditions.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.ConditionPrefixItem_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Condition, {
                assign: result => {
                    element.conditions.push(result);
                }
            });
        });

        return this.pop();
    });
    private createExports(): ast.Exports {
        return {
            kind: ast.SyntaxKind.Exports,
            all: false,
            procedures: [],
        };
    }

    Exports = this.RULE('Exports', () => {
        let element = this.push(this.createExports());

        this.CONSUME_ASSIGN1(tokens.EXPORTS, token => {
            this.tokenPayload(token, element, CstNodeKind.Exports_EXPORTS_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Exports_OpenParen_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.Exports_all_Star_0);
                        element.all = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.Exports_procedures_ID_0);
                        element.procedures.push(token.image);
                    });
                    this.MANY1(() => {
                        this.CONSUME_ASSIGN1(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.Exports_Comma_0);
                        });
                        this.CONSUME_ASSIGN2(tokens.ID, token => {
                            this.tokenPayload(token, element, CstNodeKind.Exports_procedures_ID_1);
                            element.procedures.push(token.image);
                        });
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Exports_CloseParen_0);
        });

        return this.pop();
    });
    private createReserves(): ast.Reserves {
        return {
            kind: ast.SyntaxKind.Reserves,
            all: false,
            variables: [],
        };
    }

    Reserves = this.RULE('Reserves', () => {
        let element = this.push(this.createReserves());

        this.CONSUME_ASSIGN1(tokens.RESERVES, token => {
            this.tokenPayload(token, element, CstNodeKind.Reserves_RESERVES_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Reserves_OpenParen_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.Reserves_all_Star_0);
                        element.all = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.Reserves_variables_ID_0);
                        element.variables.push(token.image);
                    });
                    this.MANY1(() => {
                        this.CONSUME_ASSIGN1(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.Reserves_Comma_0);
                        });
                        this.CONSUME_ASSIGN2(tokens.ID, token => {
                            this.tokenPayload(token, element, CstNodeKind.Reserves_variables_ID_1);
                            element.variables.push(token.image);
                        });
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Reserves_CloseParen_0);
        });

        return this.pop();
    });
    private createOptions(): ast.Options {
        return {
            kind: ast.SyntaxKind.Options,
            items: [],
        };
    }

    Options = this.RULE('Options', () => {
        let element = this.push(this.createOptions());

        this.CONSUME_ASSIGN1(tokens.OPTIONS, token => {
            this.tokenPayload(token, element, CstNodeKind.Options_OPTIONS_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Options_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.OptionsItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.OPTION1(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.Options_Comma_0);
                });
            });
            this.SUBRULE_ASSIGN2(this.OptionsItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Options_CloseParen_0);
        });

        return this.pop();
    });

    OptionsItem = this.RULE('OptionsItem', () => {
        let element = this.push<ast.OptionsItem>(undefined!);

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN(tokens.SimpleOptions, token => {
                        // TODO: change node kind
                        this.tokenPayload(token, element, CstNodeKind.SimpleOptionsItem_value_AMODE31_0);
                        element = this.replace({
                            kind: ast.SyntaxKind.SimpleOptionsItem,
                            value: token.image as ast.SimpleOptionsItem['value'],
                        });
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.CMPATOptionsItem, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LinkageOptionsItem, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.NoMapOptionsItem, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop<ast.OptionsItem>();
    });
    private createLinkageOptionsItem(): ast.LinkageOptionsItem {
        return {
            kind: ast.SyntaxKind.LinkageOptionsItem,
            value: null,
        };
    }

    LinkageOptionsItem = this.RULE('LinkageOptionsItem', () => {
        let element = this.push(this.createLinkageOptionsItem());

        this.CONSUME_ASSIGN1(tokens.LINKAGE, token => {
            this.tokenPayload(token, element, CstNodeKind.LinkageOptionsItem_LINKAGE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LinkageOptionsItem_OpenParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.LinkageOption, token => {
            // LinkageOptionsItem_value_CDECL_0
            // LinkageOptionsItem_value_OPTLINK_0
            // LinkageOptionsItem_value_STDCALL_0
            this.tokenPayload(token, element, CstNodeKind.LinkageOptionsItem_value_SYSTEM_0);
            element.value = token.image as 'CDECL' | 'OPTLINK' | 'STDCALL' | 'SYSTEM';
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LinkageOptionsItem_CloseParen_0);
        });

        return this.pop<ast.LinkageOptionsItem>();
    });
    private createCMPATOptionsItem(): ast.CMPATOptionsItem {
        return {
            kind: ast.SyntaxKind.CMPATOptionsItem,
            value: null,
        };
    }

    CMPATOptionsItem = this.RULE('CMPATOptionsItem', () => {
        let element = this.push(this.createCMPATOptionsItem());

        this.CONSUME_ASSIGN1(tokens.CMPAT, token => {
            this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_CMPAT_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_OpenParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.VX, token => {
            this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_value_V3_0);
            element.value = token.image as "V1" | "V2" | "V3";
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_CloseParen_0);
        });

        return this.pop<ast.CMPATOptionsItem>();
    });
    private createNoMapOptionsItem(): ast.NoMapOptionsItem {
        return {
            kind: ast.SyntaxKind.NoMapOptionsItem,
            type: null,
            parameters: [],
        };
    }

    NoMapOptionsItem = this.RULE('NoMapOptionsItem', () => {
        let element = this.push(this.createNoMapOptionsItem());

        this.CONSUME_ASSIGN1(tokens.NoMapOption, token => {
            // NoMapOptionsItem_type_NOMAP_0
            // NoMapOptionsItem_type_NOMAPIN_0
            this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_type_NOMAPOUT_0);
            element.type = token.image as "NOMAP" | "NOMAPIN" | "NOMAPOUT";
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_OpenParen_0);
            });
            this.OPTION1(() => {
                this.CONSUME_ASSIGN1(tokens.ID, token => {
                    this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_parameters_ID_0);
                    element.parameters ??= []; element.parameters.push(token.image);
                });
                this.MANY1(() => {
                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_Comma_0);
                    });
                    this.CONSUME_ASSIGN2(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_parameters_ID_1);
                        element.parameters ??= []; element.parameters.push(token.image);
                    });
                });
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_CloseParen_0);
            });
        });

        return this.pop<ast.NoMapOptionsItem>();
    });

    private createProcedureStatement(): ast.ProcedureStatement {
        return {
            kind: ast.SyntaxKind.ProcedureStatement,
            xProc: false,
            parameters: [],
            statements: [],
            returns: [],
            options: [],
            recursive: [],
            order: [],
            scope: [],
            end: null,
            environmentName: [],
        };
    }

    ProcedureStatement = this.RULE('ProcedureStatement', () => {
        let element = this.push(this.createProcedureStatement());

        this.CONSUME_ASSIGN1(tokens.PROCEDURE, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_PROCEDURE_0);
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_OpenParen_0);
            });
            this.OPTION1(() => {
                this.SUBRULE_ASSIGN1(this.ProcedureParameter, {
                    assign: result => {
                        element.parameters.push(result);
                    }
                });
                this.MANY1(() => {
                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_Comma_0);
                    });
                    this.SUBRULE_ASSIGN2(this.ProcedureParameter, {
                        assign: result => {
                            element.parameters.push(result);
                        }
                    });
                });
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_CloseParen_0);
            });
        });
        this.MANY2(() => {
            this.OR2([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.ReturnsOption, {
                            assign: result => {
                                element.returns.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.Options, {
                            assign: result => {
                                element.options.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.RECURSIVE, token => {
                            this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_recursive_RECURSIVE_0);
                            element.recursive.push(token.image as 'RECURSIVE');
                        });
                    }
                },
                {
                    ALT: () => {
                        this.OR3([
                            {
                                ALT: () => {
                                    this.CONSUME_ASSIGN1(tokens.ORDER, token => {
                                        this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_order_ORDER_0);
                                        element.order.push(token.image as 'ORDER');
                                    });
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME_ASSIGN1(tokens.REORDER, token => {
                                        this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_order_REORDER_0);
                                        element.order.push(token.image as 'REORDER');
                                    });
                                }
                            },
                        ]);
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.EXTERNAL, token => {
                            this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_EXTERNAL_0);
                        });
                        this.OPTION3(() => {
                            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                                this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_OpenParen_1);
                            });
                            this.SUBRULE_ASSIGN1(this.Expression, {
                                assign: result => {
                                    element.environmentName.push(result);
                                }
                            });
                            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                                this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_CloseParen_1);
                            });
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN(tokens.ScopeAttribute, token => {
                            // TODO: rename node kind
                            this.tokenPayload(token, element, CstNodeKind.ScopeAttribute_DYNAMIC_0);
                            element.scope.push(token.image as ast.ScopeAttribute);
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_Semicolon_0);
        });
        this.MANY3(() => {
            this.SUBRULE_ASSIGN1(this.Statement, {
                assign: result => {
                    element.statements ??= []; element.statements.push(result);
                }
            });
        });
        this.OPTION4(() => {
            this.CONSUME_ASSIGN2(tokens.PROCEDURE, token => {
                this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_PROCEDURE_1);
            });
        });
        this.SUBRULE_ASSIGN1(this.EndStatement, {
            assign: result => {
                element.end = result;
            }
        });
        this.CONSUME_ASSIGN2(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcedureStatement_Semicolon_1);
        });

        return this.pop();
    });

    private createLabelPrefix(): ast.LabelPrefix {
        return {
            kind: ast.SyntaxKind.LabelPrefix,
            name: null,
        };
    }

    LabelPrefix = this.RULE('LabelPrefix', () => {
        let element = this.push(this.createLabelPrefix());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.LabelPrefix_name_ID_0);
            element.name = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.Colon, token => {
            this.tokenPayload(token, element, CstNodeKind.LabelPrefix_Colon_0);
        });

        return this.pop();
    });
    private createEntryStatement(): ast.EntryStatement {
        return {
            kind: ast.SyntaxKind.EntryStatement,
            parameters: [],
            variable: [],
            limited: [],
            returns: [],
            options: [],
            environmentName: [],
        };
    }

    EntryStatement = this.RULE('EntryStatement', () => {
        let element = this.push(this.createEntryStatement());

        this.CONSUME_ASSIGN1(tokens.ENTRY, token => {
            this.tokenPayload(token, element, CstNodeKind.EntryStatement_ENTRY_0);
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.EntryStatement_OpenParen_0);
            });
            this.OPTION1(() => {
                this.SUBRULE_ASSIGN1(this.ProcedureParameter, {
                    assign: result => {
                        element.parameters.push(result);
                    }
                });
                this.MANY1(() => {
                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.EntryStatement_Comma_0);
                    });
                    this.SUBRULE_ASSIGN2(this.ProcedureParameter, {
                        assign: result => {
                            element.parameters.push(result);
                        }
                    });
                });
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.EntryStatement_CloseParen_0);
            });
        });
        this.MANY2(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.EXTERNAL, token => {
                            this.tokenPayload(token, element, CstNodeKind.EntryStatement_EXTERNAL_0);
                        });
                        this.OPTION3(() => {
                            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                                this.tokenPayload(token, element, CstNodeKind.EntryStatement_OpenParen_1);
                            });
                            this.SUBRULE_ASSIGN1(this.Expression, {
                                assign: result => {
                                    element.environmentName.push(result);
                                }
                            });
                            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                                this.tokenPayload(token, element, CstNodeKind.EntryStatement_CloseParen_1);
                            });
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.VARIABLE, token => {
                            this.tokenPayload(token, element, CstNodeKind.EntryStatement_variable_VARIABLE_0);
                            element.variable.push(token.image as 'VARIABLE');
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.LIMITED, token => {
                            this.tokenPayload(token, element, CstNodeKind.EntryStatement_limited_LIMITED_0);
                            element.limited.push(token.image as 'LIMITED');
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.ReturnsOption, {
                            assign: result => {
                                element.returns.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.Options, {
                            assign: result => {
                                element.options.push(result);
                            }
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.EntryStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createStatement(): ast.Statement {
        return {
            kind: ast.SyntaxKind.Statement,
            condition: null,
            labels: [],
            value: null,
        };
    }

    Statement = this.RULE('Statement', () => {
        let element = this.push(this.createStatement());

        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.ConditionPrefix, {
                assign: result => {
                    element.condition = result;
                }
            });
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.LabelPrefix, {
                assign: result => {
                    element.labels.push(result);
                }
            });
        });
        this.SUBRULE_ASSIGN1(this.Unit, {
            assign: result => {
                element.value = result;
            }
        });

        return this.pop();
    });
    private createUnit(): ast.Unit {
        return {
            
        } as any;
    }

    Unit = this.RULE('Unit', () => {
        let element = this.push(this.createUnit());

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DeclareStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AllocateStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AssertStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AssignmentStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AttachStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.BeginStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.CallStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.CancelThreadStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.CloseStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefaultStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefineAliasStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefineOrdinalStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefineStructureStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DelayStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DeleteStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DetachStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DisplayStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DoStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EntryStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ExecStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ExitStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FetchStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FlushStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FormatStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FreeStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.GetStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.GoToStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.IfStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.IncludeDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.IterateStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LeaveStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LineDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LocateStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.NoPrintDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.NoteDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.NullStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OnStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PageDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PopDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PrintDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ProcessDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ProcincDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PushDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PutStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.QualifyStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ReadStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ReinitStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ReleaseStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ResignalStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ReturnStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.RevertStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.RewriteStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.SelectStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.SignalStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.SkipDirective, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.StopStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.WaitStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.WriteStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ProcedureStatement, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.Package, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });

    private createAllocateStatement(): ast.AllocateStatement {
        return {
            kind: ast.SyntaxKind.AllocateStatement,
            variables: [],
        };
    }

    AllocateStatement = this.RULE('AllocateStatement', () => {
        let element = this.push(this.createAllocateStatement());

        this.CONSUME_ASSIGN1(tokens.ALLOCATE, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateStatement_ALLOCATE_0);
        });
        this.SUBRULE_ASSIGN1(this.AllocatedVariable, {
            assign: result => {
                element.variables.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.AllocateStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.AllocatedVariable, {
                assign: result => {
                    element.variables.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createAllocatedVariable(): ast.AllocatedVariable {
        return {
            kind: ast.SyntaxKind.AllocatedVariable,
            level: null,
            var: null,
            attribute: null,
        };
    }

    AllocatedVariable = this.RULE('AllocatedVariable', () => {
        let element = this.push(this.createAllocatedVariable());

        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                this.tokenPayload(token, element, CstNodeKind.AllocatedVariable_level_NUMBER_0);
                element.level = token.image;
            });
        });
        this.SUBRULE_ASSIGN1(this.ReferenceItem, {
            assign: result => {
                element.var = result;
            }
        });
        this.OPTION2(() => {
            this.SUBRULE_ASSIGN1(this.AllocateAttribute, {
                assign: result => {
                    element.attribute = result;
                }
            });
        });

        return this.pop();
    });

    AllocateAttribute = this.RULE('AllocateAttribute', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AllocateDimension, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AllocateType, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AllocateLocationReferenceIn, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AllocateLocationReferenceSet, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop<ast.AllocateAttribute>();
    });
    private createAllocateLocationReferenceIn(): ast.AllocateLocationReferenceIn {
        return {
            kind: ast.SyntaxKind.AllocateLocationReferenceIn,
            area: null,
        };
    }

    AllocateLocationReferenceIn = this.RULE('AllocateLocationReferenceIn', () => {
        let element = this.push(this.createAllocateLocationReferenceIn());

        this.CONSUME_ASSIGN1(tokens.IN, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateLocationReferenceIn_IN_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateLocationReferenceIn_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.area = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateLocationReferenceIn_CloseParen_0);
        });

        return this.pop();
    });
    private createAllocateLocationReferenceSet(): ast.AllocateLocationReferenceSet {
        return {
            kind: ast.SyntaxKind.AllocateLocationReferenceSet,
            locatorVariable: null,
        };
    }

    AllocateLocationReferenceSet = this.RULE('AllocateLocationReferenceSet', () => {
        let element = this.push(this.createAllocateLocationReferenceSet());

        this.CONSUME_ASSIGN1(tokens.SET, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateLocationReferenceSet_SET_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateLocationReferenceSet_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.locatorVariable = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.AllocateLocationReferenceSet_CloseParen_0);
        });

        return this.pop();
    });
    private createAllocateDimension(): ast.AllocateDimension {
        return {
            kind: ast.SyntaxKind.AllocateDimension,
            dimensions: null,
        };
    }

    AllocateDimension = this.RULE('AllocateDimension', () => {
        let element = this.push(this.createAllocateDimension());

        this.SUBRULE_ASSIGN1(this.Dimensions, {
            assign: result => {
                element.dimensions = result;
            }
        });

        return this.pop();
    });
    private createAllocateType(): ast.AllocateType {
        return {
            kind: ast.SyntaxKind.AllocateType,
            type: null,
            dimensions: null,
        };
    }

    AllocateType = this.RULE('AllocateType', () => {
        let element = this.push(this.createAllocateType());

        this.CONSUME_ASSIGN(tokens.AllocateAttributeType, token => {
            // TODO: rename node kind
            this.tokenPayload(token, element, CstNodeKind.AllocateAttributeType_AREA_0);
            element.type = token.image as ast.AllocateAttributeType;
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Dimensions, {
                assign: result => {
                    element.dimensions = result;
                }
            });
        });

        return this.pop();
    });

    private createAssertStatement(): ast.AssertStatement {
        return {
            kind: ast.SyntaxKind.AssertStatement,
            true: false,
            actual: null,
            false: false,
            unreachable: false,
            displayExpression: null,
            compare: false,
            expected: null,
            operator: null,
        };
    }

    AssertStatement = this.RULE('AssertStatement', () => {
        let element = this.push(this.createAssertStatement());

        this.CONSUME_ASSIGN1(tokens.ASSERT, token => {
            this.tokenPayload(token, element, CstNodeKind.AssertStatement_ASSERT_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.TRUE, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_true_TRUE_0);
                        element.true = true;
                    });
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN1(this.Expression, {
                        assign: result => {
                            element.actual = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_CloseParen_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.FALSE, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_false_FALSE_0);
                        element.false = true;
                    });
                    this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_OpenParen_1);
                    });
                    this.SUBRULE_ASSIGN2(this.Expression, {
                        assign: result => {
                            element.actual = result;
                        }
                    });
                    this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_CloseParen_1);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.COMPARE, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_compare_COMPARE_0);
                        element.compare = true;
                    });
                    this.CONSUME_ASSIGN3(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_OpenParen_2);
                    });
                    this.SUBRULE_ASSIGN3(this.Expression, {
                        assign: result => {
                            element.actual = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_Comma_0);
                    });
                    this.SUBRULE_ASSIGN4(this.Expression, {
                        assign: result => {
                            element.expected = result;
                        }
                    });
                    this.OPTION1(() => {
                        this.CONSUME_ASSIGN2(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.AssertStatement_Comma_1);
                        });
                        this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
                            this.tokenPayload(token, element, CstNodeKind.AssertStatement_operator_STRING_TERM_0);
                            element.operator = token.image;
                        });
                    });
                    this.CONSUME_ASSIGN3(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_CloseParen_2);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.UNREACHABLE, token => {
                        this.tokenPayload(token, element, CstNodeKind.AssertStatement_unreachable_UNREACHABLE_0);
                        element.unreachable = true;
                    });
                }
            },
        ]);
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.TEXT, token => {
                this.tokenPayload(token, element, CstNodeKind.AssertStatement_TEXT_0);
            });
            this.SUBRULE_ASSIGN5(this.Expression, {
                assign: result => {
                    element.displayExpression = result;
                }
            });
        });

        return this.pop();
    });
    private createAssignmentStatement(): ast.AssignmentStatement {
        return {
            kind: ast.SyntaxKind.AssignmentStatement,
            refs: [],
            operator: null,
            expression: null,
            dimacrossExpr: null,
        };
    }

    AssignmentStatement = this.RULE('AssignmentStatement', () => {
        let element = this.push(this.createAssignmentStatement());

        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.refs.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.LocatorCall, {
                assign: result => {
                    element.refs.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN(tokens.AssignmentOperator, token => {
            // TODO: rename node kind
            this.tokenPayload(token, element, CstNodeKind.AssignmentOperator_AmpersandEquals_0);
            element.operator = token.image as ast.AssignmentOperator;
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.expression = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN2(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_Comma_1);
            });
            this.CONSUME_ASSIGN1(tokens.BY, token => {
                this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_BY_0);
            });
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.NAME, token => {
                            this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_NAME_0);
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.DIMACROSS, token => {
                            this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_DIMACROSS_0);
                        });
                        this.SUBRULE_ASSIGN2(this.Expression, {
                            assign: result => {
                                element.dimacrossExpr = result;
                            }
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createAttachStatement(): ast.AttachStatement {
        return {
            kind: ast.SyntaxKind.AttachStatement,
            reference: null,
            task: null,
            environment: false,
            tstack: null,
        };
    }

    AttachStatement = this.RULE('AttachStatement', () => {
        let element = this.push(this.createAttachStatement());

        this.CONSUME_ASSIGN1(tokens.ATTACH, token => {
            this.tokenPayload(token, element, CstNodeKind.AttachStatement_ATTACH_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.reference = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.THREAD, token => {
            this.tokenPayload(token, element, CstNodeKind.AttachStatement_THREAD_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.AttachStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN2(this.LocatorCall, {
            assign: result => {
                element.task = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.AttachStatement_CloseParen_0);
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.ENVIRONMENT, token => {
                this.tokenPayload(token, element, CstNodeKind.AttachStatement_environment_ENVIRONMENT_0);
                element.environment = true;
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.AttachStatement_OpenParen_1);
            });
            this.OPTION1(() => {
                this.CONSUME_ASSIGN1(tokens.TSTACK, token => {
                    this.tokenPayload(token, element, CstNodeKind.AttachStatement_TSTACK_0);
                });
                this.CONSUME_ASSIGN3(tokens.OpenParen, token => {
                    this.tokenPayload(token, element, CstNodeKind.AttachStatement_OpenParen_2);
                });
                this.SUBRULE_ASSIGN1(this.Expression, {
                    assign: result => {
                        element.tstack = result;
                    }
                });
                this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                    this.tokenPayload(token, element, CstNodeKind.AttachStatement_CloseParen_1);
                });
            });
            this.CONSUME_ASSIGN3(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.AttachStatement_CloseParen_2);
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.AttachStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createBeginStatement(): ast.BeginStatement {
        return {
            kind: ast.SyntaxKind.BeginStatement,
            options: null,
            recursive: false,
            statements: [],
            end: null,
            order: false,
            reorder: false,
        };
    }

    BeginStatement = this.RULE('BeginStatement', () => {
        let element = this.push(this.createBeginStatement());

        this.CONSUME_ASSIGN1(tokens.BEGIN, token => {
            this.tokenPayload(token, element, CstNodeKind.BeginStatement_BEGIN_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Options, {
                assign: result => {
                    element.options = result;
                }
            });
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.RECURSIVE, token => {
                this.tokenPayload(token, element, CstNodeKind.BeginStatement_recursive_RECURSIVE_0);
                element.recursive = true;
            });
        });
        this.OPTION3(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.ORDER, token => {
                            this.tokenPayload(token, element, CstNodeKind.BeginStatement_order_ORDER_0);
                            element.order = true;
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.REORDER, token => {
                            this.tokenPayload(token, element, CstNodeKind.BeginStatement_reorder_REORDER_0);
                            element.reorder = true;
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.BeginStatement_Semicolon_0);
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.Statement, {
                assign: result => {
                    element.statements.push(result);
                }
            });
        });
        this.SUBRULE_ASSIGN1(this.EndStatement, {
            assign: result => {
                element.end = result;
            }
        });
        this.CONSUME_ASSIGN2(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.BeginStatement_Semicolon_1);
        });

        return this.pop();
    });
    private createEndStatement(): ast.EndStatement {
        return {
            kind: ast.SyntaxKind.EndStatement,
            labels: [],
            label: null,
        };
    }

    EndStatement = this.RULE('EndStatement', () => {
        let element = this.push(this.createEndStatement());

        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.LabelPrefix, {
                assign: result => {
                    element.labels.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.END, token => {
            this.tokenPayload(token, element, CstNodeKind.EndStatement_END_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.LabelReference, {
                assign: result => {
                    element.label = result;
                }
            });
        });

        return this.pop();
    });
    private createCallStatement(): ast.CallStatement {
        return {
            kind: ast.SyntaxKind.CallStatement,
            call: null,
        };
    }

    CallStatement = this.RULE('CallStatement', () => {
        let element = this.push(this.createCallStatement());

        this.CONSUME_ASSIGN1(tokens.CALL, token => {
            this.tokenPayload(token, element, CstNodeKind.CallStatement_CALL_0);
        });
        this.SUBRULE_ASSIGN1(this.ProcedureCall, {
            assign: result => {
                element.call = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.CallStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createCancelThreadStatement(): ast.CancelThreadStatement {
        return {
            kind: ast.SyntaxKind.CancelThreadStatement,
            thread: null,
        };
    }

    CancelThreadStatement = this.RULE('CancelThreadStatement', () => {
        let element = this.push(this.createCancelThreadStatement());

        this.CONSUME_ASSIGN1(tokens.CANCEL, token => {
            this.tokenPayload(token, element, CstNodeKind.CancelThreadStatement_CANCEL_0);
        });
        this.CONSUME_ASSIGN1(tokens.THREAD, token => {
            this.tokenPayload(token, element, CstNodeKind.CancelThreadStatement_THREAD_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CancelThreadStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.thread = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CancelThreadStatement_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.CancelThreadStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createCloseStatement(): ast.CloseStatement {
        return {
            kind: ast.SyntaxKind.CloseStatement,
            files: [],
        };
    }

    CloseStatement = this.RULE('CloseStatement', () => {
        let element = this.push(this.createCloseStatement());

        this.CONSUME_ASSIGN1(tokens.CLOSE, token => {
            this.tokenPayload(token, element, CstNodeKind.CloseStatement_CLOSE_0);
        });
        this.CONSUME_ASSIGN1(tokens.FILE, token => {
            this.tokenPayload(token, element, CstNodeKind.CloseStatement_FILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CloseStatement_OpenParen_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.MemberCall, {
                        assign: result => {
                            element.files.push(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.CloseStatement_files_Star_0);
                        element.files.push(token.image as '*');
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CloseStatement_CloseParen_0);
        });
        this.MANY1(() => {
            this.OPTION1(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.CloseStatement_Comma_0);
                });
            });
            this.CONSUME_ASSIGN2(tokens.FILE, token => {
                this.tokenPayload(token, element, CstNodeKind.CloseStatement_FILE_1);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.CloseStatement_OpenParen_1);
            });
            this.OR2([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN2(this.MemberCall, {
                            assign: result => {
                                element.files.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN2(tokens.Star, token => {
                            this.tokenPayload(token, element, CstNodeKind.CloseStatement_files_Star_1);
                            element.files.push(token.image as '*');
                        });
                    }
                },
            ]);
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.CloseStatement_CloseParen_1);
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.CloseStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createDefaultStatement(): ast.DefaultStatement {
        return {
            kind: ast.SyntaxKind.DefaultStatement,
            expressions: [],
        };
    }

    DefaultStatement = this.RULE('DefaultStatement', () => {
        let element = this.push(this.createDefaultStatement());

        this.CONSUME_ASSIGN1(tokens.DEFAULT, token => {
            this.tokenPayload(token, element, CstNodeKind.DefaultStatement_DEFAULT_0);
        });
        this.SUBRULE_ASSIGN1(this.DefaultExpression, {
            assign: result => {
                element.expressions.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DefaultStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.DefaultExpression, {
                assign: result => {
                    element.expressions.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DefaultStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createDefaultExpression(): ast.DefaultExpression {
        return {
            kind: ast.SyntaxKind.DefaultExpression,
            expression: null,
            attributes: [],
        };
    }

    DefaultExpression = this.RULE('DefaultExpression', () => {
        let element = this.push(this.createDefaultExpression());

        this.SUBRULE_ASSIGN1(this.DefaultExpressionPart, {
            assign: result => {
                element.expression = result;
            }
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.DefaultDeclarationAttribute, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
        });

        return this.pop();
    });
    private createDefaultExpressionPart(): ast.DefaultExpressionPart {
        return {
            kind: ast.SyntaxKind.DefaultExpressionPart,
            expression: null,
            identifiers: null,
        };
    }

    DefaultExpressionPart = this.RULE('DefaultExpressionPart', () => {
        let element = this.push(this.createDefaultExpressionPart());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.DESCRIPTORS, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefaultExpressionPart_DESCRIPTORS_0);
                    });
                    this.SUBRULE_ASSIGN1(this.DefaultAttributeExpression, {
                        assign: result => {
                            element.expression = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.OR2([
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN1(tokens.RANGE, token => {
                                    this.tokenPayload(token, element, CstNodeKind.DefaultExpressionPart_RANGE_0);
                                });
                                this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.DefaultExpressionPart_OpenParen_0);
                                });
                                this.SUBRULE_ASSIGN1(this.DefaultRangeIdentifiers, {
                                    assign: result => {
                                        element.identifiers = result;
                                    }
                                });
                                this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.DefaultExpressionPart_CloseParen_0);
                                });
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.DefaultExpressionPart_OpenParen_1);
                                });
                                this.SUBRULE_ASSIGN2(this.DefaultAttributeExpression, {
                                    assign: result => {
                                        element.expression = result;
                                    }
                                });
                                this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.DefaultExpressionPart_CloseParen_1);
                                });
                            }
                        },
                    ]);
                }
            },
        ]);

        return this.pop();
    });
    private createDefaultRangeIdentifiers(): ast.DefaultRangeIdentifiers {
        return {
            kind: ast.SyntaxKind.DefaultRangeIdentifiers,
            identifiers: [],
        };
    }

    DefaultRangeIdentifiers = this.RULE('DefaultRangeIdentifiers', () => {
        let element = this.push(this.createDefaultRangeIdentifiers());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefaultRangeIdentifiers_identifiers_Star_0);
                        element.identifiers.push(token.image as '*');
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefaultRangeIdentifierItem, {
                        assign: result => {
                            element.identifiers.push(result);
                        }
                    });
                }
            },
        ]);
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DefaultRangeIdentifiers_Comma_0);
            });
            this.OR2([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN2(tokens.Star, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefaultRangeIdentifiers_identifiers_Star_1);
                            element.identifiers.push(token.image as '*');
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN2(this.DefaultRangeIdentifierItem, {
                            assign: result => {
                                element.identifiers.push(result);
                            }
                        });
                    }
                },
            ]);
        });

        return this.pop();
    });
    private createDefaultRangeIdentifierItem(): ast.DefaultRangeIdentifierItem {
        return {
            kind: ast.SyntaxKind.DefaultRangeIdentifierItem,
            from: null,
            to: null,
        };
    }

    DefaultRangeIdentifierItem = this.RULE('DefaultRangeIdentifierItem', () => {
        let element = this.push(this.createDefaultRangeIdentifierItem());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.DefaultRangeIdentifierItem_from_ID_0);
            element.from = token.image;
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.Colon, token => {
                this.tokenPayload(token, element, CstNodeKind.DefaultRangeIdentifierItem_Colon_0);
            });
            this.CONSUME_ASSIGN2(tokens.ID, token => {
                this.tokenPayload(token, element, CstNodeKind.DefaultRangeIdentifierItem_to_ID_0);
                element.to = token.image;
            });
        });

        return this.pop();
    });
    private createDefaultAttributeExpression(): ast.DefaultAttributeExpression {
        return {
            kind: ast.SyntaxKind.DefaultAttributeExpression,
            items: [],
            operators: [],
        };
    }

    DefaultAttributeExpression = this.RULE('DefaultAttributeExpression', () => {
        let element = this.push(this.createDefaultAttributeExpression());

        this.SUBRULE_ASSIGN1(this.DefaultAttributeExpressionNot, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.DefaultAttributeBinaryOperator, token => {
                // TODO: rename node kind
                this.tokenPayload(token, element, CstNodeKind.DefaultAttributeExpression_operators_AND_0);
                element.operators.push(token.image as ast.DefaultAttributeExpression['operators'][0]);
            });
            this.SUBRULE_ASSIGN2(this.DefaultAttributeExpressionNot, {
                assign: result => {
                    element.items ??= []; element.items.push(result);
                }
            });
        });

        return this.pop();
    });
    private createDefaultAttributeExpressionNot(): ast.DefaultAttributeExpressionNot {
        return {
            kind: ast.SyntaxKind.DefaultAttributeExpressionNot,
            not: false,
            value: null,
        };
    }

    DefaultAttributeExpressionNot = this.RULE('DefaultAttributeExpressionNot', () => {
        let element = this.push(this.createDefaultAttributeExpressionNot());

        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.NOT, token => {
                this.tokenPayload(token, element, CstNodeKind.DefaultAttributeExpressionNot_not_NOT_0);
                element.not = true;
            });
        });
        this.CONSUME_ASSIGN(tokens.DefaultAttribute, token => {
            // TODO: rename node kind
            this.tokenPayload(token, element, CstNodeKind.DefaultAttribute_ABNORMAL_0);
            element.value = token.image as ast.DefaultAttribute;
        });

        return this.pop();
    });

    private createDefineAliasStatement(): ast.DefineAliasStatement {
        return {
            kind: ast.SyntaxKind.DefineAliasStatement,
            name: null,
            xDefine: false,
            attributes: [],
        };
    }

    DefineAliasStatement = this.RULE('DefineAliasStatement', () => {
        let element = this.push(this.createDefineAliasStatement());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.DEFINE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_DEFINE_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.XDEFINE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_xDefine_XDEFINE_0);
                        element.xDefine = true;
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.ALIAS, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_ALIAS_0);
        });
        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_name_ID_0);
            element.name = token.image;
        });
        this.OPTION2(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
            this.MANY1(() => {
                this.OPTION1(() => {
                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_Comma_0);
                    });
                });
                this.SUBRULE_ASSIGN2(this.DeclarationAttribute, {
                    assign: result => {
                        element.attributes.push(result);
                    }
                });
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createDefineOrdinalStatement(): ast.DefineOrdinalStatement {
        return {
            kind: ast.SyntaxKind.DefineOrdinalStatement,
            name: null,
            ordinalValues: null,
            xDefine: false,
            signed: false,
            unsigned: false,
            precision: null,
        };
    }

    DefineOrdinalStatement = this.RULE('DefineOrdinalStatement', () => {
        let element = this.push(this.createDefineOrdinalStatement());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.DEFINE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_DEFINE_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.XDEFINE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_xDefine_XDEFINE_0);
                        element.xDefine = true;
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.ORDINAL, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_ORDINAL_0);
        });
        this.SUBRULE_ASSIGN1(this.FQN, {
            assign: result => {
                element.name = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.OrdinalValueList, {
            assign: result => {
                element.ordinalValues = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_CloseParen_0);
        });
        this.OPTION1(() => {
            this.OR2([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.SIGNED, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_signed_SIGNED_0);
                            element.signed = true;
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.UNSIGNED, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_unsigned_UNSIGNED_0);
                            element.unsigned = true;
                        });
                    }
                },
            ]);
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.PRECISION, token => {
                this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_PRECISION_0);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_OpenParen_1);
            });
            this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_precision_NUMBER_0);
                element.precision = token.image;
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_CloseParen_1);
            });
        });
        this.OPTION3(() => {
            this.OR4([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN2(tokens.SIGNED, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_signed_SIGNED_1);
                            element.signed = true;
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN2(tokens.UNSIGNED, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_unsigned_UNSIGNED_1);
                            element.unsigned = true;
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineOrdinalStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createOrdinalValueList(): ast.OrdinalValueList {
        return {
            kind: ast.SyntaxKind.OrdinalValueList,
            members: [],
        };
    }

    OrdinalValueList = this.RULE('OrdinalValueList', () => {
        let element = this.push(this.createOrdinalValueList());

        this.SUBRULE_ASSIGN1(this.OrdinalValue, {
            assign: result => {
                element.members.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.OrdinalValueList_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.OrdinalValue, {
                assign: result => {
                    element.members.push(result);
                }
            });
        });

        return this.pop();
    });
    private createOrdinalValue(): ast.OrdinalValue {
        return {
            kind: ast.SyntaxKind.OrdinalValue,
            name: null,
            value: null,
        };
    }

    OrdinalValue = this.RULE('OrdinalValue', () => {
        let element = this.push(this.createOrdinalValue());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.OrdinalValue_name_ID_0);
            element.name = token.image;
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.VALUE, token => {
                this.tokenPayload(token, element, CstNodeKind.OrdinalValue_VALUE_0);
            });
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.OrdinalValue_OpenParen_0);
            });
            this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                this.tokenPayload(token, element, CstNodeKind.OrdinalValue_value_NUMBER_0);
                element.value = token.image;
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.OrdinalValue_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createDefineStructureStatement(): ast.DefineStructureStatement {
        return {
            kind: ast.SyntaxKind.DefineStructureStatement,
            xDefine: false,
            level: null,
            name: null,
            union: false,
            substructures: [],
        };
    }

    DefineStructureStatement = this.RULE('DefineStructureStatement', () => {
        let element = this.push(this.createDefineStructureStatement());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.DEFINE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_DEFINE_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.XDEFINE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_xDefine_XDEFINE_0);
                        element.xDefine = true;
                    });
                }
            },
        ]);
        this.OR2([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.STRUCTURE, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_STRUCTURE_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.STRUCT, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_STRUCT_0);
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_level_NUMBER_0);
            element.level = token.image;
        });
        this.SUBRULE_ASSIGN1(this.FQN, {
            assign: result => {
                element.name = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.UNION, token => {
                this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_union_UNION_0);
                element.union = true;
            });
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN1(this.SubStructure, {
                assign: result => {
                    element.substructures.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DefineStructureStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createSubStructure(): ast.SubStructure {
        return {
            kind: ast.SyntaxKind.SubStructure,
            level: null,
            name: null,
            attributes: [],
        };
    }

    SubStructure = this.RULE('SubStructure', () => {
        let element = this.push(this.createSubStructure());

        this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
            this.tokenPayload(token, element, CstNodeKind.SubStructure_level_NUMBER_0);
            element.level = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.SubStructure_name_ID_0);
            element.name = token.image;
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
        });

        return this.pop();
    });

    private createDelayStatement(): ast.DelayStatement {
        return {
            kind: ast.SyntaxKind.DelayStatement,
            delay: null,
        };
    }

    DelayStatement = this.RULE('DelayStatement', () => {
        let element = this.push(this.createDelayStatement());

        this.CONSUME_ASSIGN1(tokens.DELAY, token => {
            this.tokenPayload(token, element, CstNodeKind.DelayStatement_DELAY_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DelayStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.delay = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DelayStatement_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DelayStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createDeleteStatement(): ast.DeleteStatement {
        return {
            kind: ast.SyntaxKind.DeleteStatement,
            file: null,
            key: null,
        };
    }

    DeleteStatement = this.RULE('DeleteStatement', () => {
        let element = this.push(this.createDeleteStatement());

        this.CONSUME_ASSIGN1(tokens.DELETE, token => {
            this.tokenPayload(token, element, CstNodeKind.DeleteStatement_DELETE_0);
        });
        this.CONSUME_ASSIGN1(tokens.FILE, token => {
            this.tokenPayload(token, element, CstNodeKind.DeleteStatement_FILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DeleteStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.file = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DeleteStatement_CloseParen_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.KEY, token => {
                this.tokenPayload(token, element, CstNodeKind.DeleteStatement_KEY_0);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DeleteStatement_OpenParen_1);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.key = result;
                }
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DeleteStatement_CloseParen_1);
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DeleteStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createDetachStatement(): ast.DetachStatement {
        return {
            kind: ast.SyntaxKind.DetachStatement,
            reference: null,
        };
    }

    DetachStatement = this.RULE('DetachStatement', () => {
        let element = this.push(this.createDetachStatement());

        this.CONSUME_ASSIGN1(tokens.DETACH, token => {
            this.tokenPayload(token, element, CstNodeKind.DetachStatement_DETACH_0);
        });
        this.CONSUME_ASSIGN1(tokens.THREAD, token => {
            this.tokenPayload(token, element, CstNodeKind.DetachStatement_THREAD_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DetachStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.reference = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DetachStatement_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DetachStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createDisplayStatement(): ast.DisplayStatement {
        return {
            kind: ast.SyntaxKind.DisplayStatement,
            expression: null,
            reply: null,
            rout: [],
            desc: [],
        };
    }

    DisplayStatement = this.RULE('DisplayStatement', () => {
        let element = this.push(this.createDisplayStatement());

        this.CONSUME_ASSIGN1(tokens.DISPLAY, token => {
            this.tokenPayload(token, element, CstNodeKind.DisplayStatement_DISPLAY_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DisplayStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.expression = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DisplayStatement_CloseParen_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.REPLY, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_REPLY_0);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_OpenParen_1);
            });
            this.SUBRULE_ASSIGN1(this.LocatorCall, {
                assign: result => {
                    element.reply = result;
                }
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_CloseParen_1);
            });
        });
        this.OPTION3(() => {
            this.CONSUME_ASSIGN1(tokens.ROUTCDE, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_ROUTCDE_0);
            });
            this.CONSUME_ASSIGN3(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_OpenParen_2);
            });
            this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_rout_NUMBER_0);
                element.rout.push(token.image);
            });
            this.MANY1(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.DisplayStatement_Comma_0);
                });
                this.CONSUME_ASSIGN2(tokens.NUMBER, token => {
                    this.tokenPayload(token, element, CstNodeKind.DisplayStatement_rout_NUMBER_1);
                    element.rout.push(token.image);
                });
            });
            this.CONSUME_ASSIGN3(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DisplayStatement_CloseParen_2);
            });
            this.OPTION2(() => {
                this.CONSUME_ASSIGN1(tokens.DESC, token => {
                    this.tokenPayload(token, element, CstNodeKind.DisplayStatement_DESC_0);
                });
                this.CONSUME_ASSIGN4(tokens.OpenParen, token => {
                    this.tokenPayload(token, element, CstNodeKind.DisplayStatement_OpenParen_3);
                });
                this.CONSUME_ASSIGN3(tokens.NUMBER, token => {
                    this.tokenPayload(token, element, CstNodeKind.DisplayStatement_desc_NUMBER_0);
                    element.desc.push(token.image);
                });
                this.MANY2(() => {
                    this.CONSUME_ASSIGN2(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.DisplayStatement_Comma_1);
                    });
                    this.CONSUME_ASSIGN4(tokens.NUMBER, token => {
                        this.tokenPayload(token, element, CstNodeKind.DisplayStatement_desc_NUMBER_1);
                        element.desc.push(token.image);
                    });
                });
                this.CONSUME_ASSIGN4(tokens.CloseParen, token => {
                    this.tokenPayload(token, element, CstNodeKind.DisplayStatement_CloseParen_3);
                });
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DisplayStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createDoStatement(): ast.DoStatement {
        return {
            kind: ast.SyntaxKind.DoStatement,
            statements: [],
            end: null,
            doType2: null,
            doType3: null,
        };
    }

    DoStatement = this.RULE('DoStatement', () => {
        let element = this.push(this.createDoStatement());

        this.CONSUME_ASSIGN1(tokens.DO, token => {
            this.tokenPayload(token, element, CstNodeKind.DoStatement_DO_0);
        });
        this.OPTION1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.DoType2, {
                            assign: result => {
                                element.doType2 = result;
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.DoType3, {
                            assign: result => {
                                element.doType3 = result;
                            }
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DoStatement_Semicolon_0);
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.Statement, {
                assign: result => {
                    element.statements.push(result);
                }
            });
        });
        this.SUBRULE_ASSIGN1(this.EndStatement, {
            assign: result => {
                element.end = result;
            }
        });
        this.CONSUME_ASSIGN2(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DoStatement_Semicolon_1);
        });

        return this.pop();
    });

    DoType2 = this.RULE('DoType2', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DoWhile, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DoUntil, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createDoWhile(): ast.DoWhile {
        return {
            kind: ast.SyntaxKind.DoWhile,
            while: null,
            until: null,
        };
    }

    DoWhile = this.RULE('DoWhile', () => {
        let element = this.push(this.createDoWhile());

        this.CONSUME_ASSIGN1(tokens.WHILE, token => {
            this.tokenPayload(token, element, CstNodeKind.DoWhile_WHILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DoWhile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.while = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DoWhile_CloseParen_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.UNTIL, token => {
                this.tokenPayload(token, element, CstNodeKind.DoWhile_UNTIL_0);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DoWhile_OpenParen_1);
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
                assign: result => {
                    element.until = result;
                }
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DoWhile_CloseParen_1);
            });
        });

        return this.pop();
    });
    private createDoUntil(): ast.DoUntil {
        return {
            kind: ast.SyntaxKind.DoUntil,
            until: null,
            while: null,
        };
    }

    DoUntil = this.RULE('DoUntil', () => {
        let element = this.push(this.createDoUntil());

        this.CONSUME_ASSIGN1(tokens.UNTIL, token => {
            this.tokenPayload(token, element, CstNodeKind.DoUntil_UNTIL_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DoUntil_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.until = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DoUntil_CloseParen_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.WHILE, token => {
                this.tokenPayload(token, element, CstNodeKind.DoUntil_WHILE_0);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DoUntil_OpenParen_1);
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
                assign: result => {
                    element.while = result;
                }
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DoUntil_CloseParen_1);
            });
        });

        return this.pop();
    });
    private createDoType3(): ast.DoType3 {
        return {
            kind: ast.SyntaxKind.DoType3,
            variable: null,
            specifications: [],
        };
    }

    DoType3 = this.RULE('DoType3', () => {
        let element = this.push(this.createDoType3());

        this.SUBRULE_ASSIGN1(this.DoType3Variable, {
            assign: result => {
                element.variable = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.Equals, token => {
            this.tokenPayload(token, element, CstNodeKind.DoType3_Equals_0);
        });
        this.SUBRULE_ASSIGN1(this.DoSpecification, {
            assign: result => {
                element.specifications.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DoType3_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.DoSpecification, {
                assign: result => {
                    element.specifications.push(result);
                }
            });
        });

        return this.pop();
    });

    private createDoType3Variable(): ast.DoType3Variable {
        return {
            kind: ast.SyntaxKind.DoType3Variable,
            name: null,
        };
    }

    DoType3Variable = this.RULE('DoType3Variable', () => {
        let element = this.push(this.createDoType3Variable());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.DoType3Variable_name_ID_0);
            element.name = token.image;
        });

        return this.pop();
    });

    private createDoSpecification(): ast.DoSpecification {
        return {
            kind: ast.SyntaxKind.DoSpecification,
            exp1: null,
            upthru: null,
            downthru: null,
            repeat: null,
            whileOrUntil: null,
            to: null,
            by: null,
        };
    }

    DoSpecification = this.RULE('DoSpecification', () => {
        let element = this.push(this.createDoSpecification());

        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.exp1 = result;
            }
        });
        this.OPTION3(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.TO, token => {
                            this.tokenPayload(token, element, CstNodeKind.DoSpecification_TO_0);
                        });
                        this.SUBRULE_ASSIGN2(this.Expression, {
                            assign: result => {
                                element.to = result;
                            }
                        });
                        this.OPTION1(() => {
                            this.CONSUME_ASSIGN1(tokens.BY, token => {
                                this.tokenPayload(token, element, CstNodeKind.DoSpecification_BY_0);
                            });
                            this.SUBRULE_ASSIGN3(this.Expression, {
                                assign: result => {
                                    element.by = result;
                                }
                            });
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN2(tokens.BY, token => {
                            this.tokenPayload(token, element, CstNodeKind.DoSpecification_BY_1);
                        });
                        this.SUBRULE_ASSIGN4(this.Expression, {
                            assign: result => {
                                element.by = result;
                            }
                        });
                        this.OPTION2(() => {
                            this.CONSUME_ASSIGN2(tokens.TO, token => {
                                this.tokenPayload(token, element, CstNodeKind.DoSpecification_TO_1);
                            });
                            this.SUBRULE_ASSIGN5(this.Expression, {
                                assign: result => {
                                    element.to = result;
                                }
                            });
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.UPTHRU, token => {
                            this.tokenPayload(token, element, CstNodeKind.DoSpecification_UPTHRU_0);
                        });
                        this.SUBRULE_ASSIGN6(this.Expression, {
                            assign: result => {
                                element.upthru = result;
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.DOWNTHRU, token => {
                            this.tokenPayload(token, element, CstNodeKind.DoSpecification_DOWNTHRU_0);
                        });
                        this.SUBRULE_ASSIGN7(this.Expression, {
                            assign: result => {
                                element.downthru = result;
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.REPEAT, token => {
                            this.tokenPayload(token, element, CstNodeKind.DoSpecification_REPEAT_0);
                        });
                        this.SUBRULE_ASSIGN8(this.Expression, {
                            assign: result => {
                                element.repeat = result;
                            }
                        });
                    }
                },
            ]);
        });
        this.OPTION4(() => {
            this.OR2([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.DoWhile, {
                            assign: result => {
                                element.whileOrUntil = result;
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.DoUntil, {
                            assign: result => {
                                element.whileOrUntil = result;
                            }
                        });
                    }
                },
            ]);
        });

        return this.pop();
    });
    private createExecStatement(): ast.ExecStatement {
        return {
            kind: ast.SyntaxKind.ExecStatement,
            query: null,
        };
    }

    ExecStatement = this.RULE('ExecStatement', () => {
        let element = this.push(this.createExecStatement());

        this.CONSUME_ASSIGN1(tokens.EXEC, token => {
            this.tokenPayload(token, element, CstNodeKind.ExecStatement_EXEC_0);
        });
        this.CONSUME_ASSIGN1(tokens.ExecFragment, token => {
            this.tokenPayload(token, element, CstNodeKind.ExecStatement_query_ExecFragment_0);
            element.query = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ExecStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createExitStatement(): ast.ExitStatement {
        return { kind: ast.SyntaxKind.ExitStatement };
    }

    ExitStatement = this.RULE('ExitStatement', () => {
        let element = this.push(this.createExitStatement());

        this.CONSUME_ASSIGN1(tokens.EXIT, token => {
            this.tokenPayload(token, element, CstNodeKind.ExitStatement_EXIT_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ExitStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createFetchStatement(): ast.FetchStatement {
        return {
            kind: ast.SyntaxKind.FetchStatement,
            entries: [],
        };
    }

    FetchStatement = this.RULE('FetchStatement', () => {
        let element = this.push(this.createFetchStatement());

        this.CONSUME_ASSIGN1(tokens.FETCH, token => {
            this.tokenPayload(token, element, CstNodeKind.FetchStatement_FETCH_0);
        });
        this.SUBRULE_ASSIGN1(this.FetchEntry, {
            assign: result => {
                element.entries ??= []; element.entries.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.FetchEntry, {
                assign: result => {
                    element.entries ??= []; element.entries.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.FetchStatement_Semicolon_0);
        });

        return this.pop();
    });

    private createFetchEntry(): ast.FetchEntry {
        return {
            kind: ast.SyntaxKind.FetchEntry,
            name: null,
            set: null,
            title: null,
        };
    }

    FetchEntry = this.RULE('FetchEntry', () => {
        let element = this.push(this.createFetchEntry());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.FetchEntry_name_ID_0);
            element.name = token.image;
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.SET, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchEntry_SET_0);
            });
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchEntry_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.LocatorCall, {
                assign: result => {
                    element.set = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchEntry_CloseParen_0);
            });
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.TITLE, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchEntry_TITLE_0);
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchEntry_OpenParen_1);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.title = result;
                }
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.FetchEntry_CloseParen_1);
            });
        });

        return this.pop();
    });

    private createFlushStatement(): ast.FlushStatement {
        return {
            kind: ast.SyntaxKind.FlushStatement,
            file: null,
        };
    }

    FlushStatement = this.RULE('FlushStatement', () => {
        let element = this.push(this.createFlushStatement());

        this.CONSUME_ASSIGN1(tokens.FLUSH, token => {
            this.tokenPayload(token, element, CstNodeKind.FlushStatement_FLUSH_0);
        });
        this.CONSUME_ASSIGN1(tokens.FILE, token => {
            this.tokenPayload(token, element, CstNodeKind.FlushStatement_FILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.FlushStatement_OpenParen_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LocatorCall, {
                        assign: result => {
                            element.file = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.FlushStatement_file_Star_0);
                        element.file = token.image as '*';
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.FlushStatement_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.FlushStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createFormatStatement(): ast.FormatStatement {
        return {
            kind: ast.SyntaxKind.FormatStatement,
            list: null,
        };
    }

    FormatStatement = this.RULE('FormatStatement', () => {
        let element = this.push(this.createFormatStatement());

        this.CONSUME_ASSIGN1(tokens.FORMAT, token => {
            this.tokenPayload(token, element, CstNodeKind.FormatStatement_FORMAT_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.FormatStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.FormatList, {
            assign: result => {
                element.list = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.FormatStatement_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.FormatStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createFormatList(): ast.FormatList {
        return {
            kind: ast.SyntaxKind.FormatList,
            items: [],
        };
    }

    FormatList = this.RULE('FormatList', () => {
        let element = this.push(this.createFormatList());

        this.SUBRULE_ASSIGN1(this.FormatListItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.FormatList_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.FormatListItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });

        return this.pop();
    });

    private createFormatListItem(): ast.FormatListItem {
        return {
            kind: ast.SyntaxKind.FormatListItem,
            level: null,
            item: null,
            list: null,
        };
    }

    FormatListItem = this.RULE('FormatListItem', () => {
        let element = this.push(this.createFormatListItem());

        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.FormatListItemLevel, {
                assign: result => {
                    element.level = result;
                }
            });
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FormatItem, {
                        assign: result => {
                            element.item = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.FormatListItem_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN1(this.FormatList, {
                        assign: result => {
                            element.list = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.FormatListItem_CloseParen_0);
                    });
                }
            },
        ]);

        return this.pop();
    });

    private createFormatListItemLevel(): ast.FormatListItemLevel {
        return {
            kind: ast.SyntaxKind.FormatListItemLevel,
            level: null,
        };
    }

    FormatListItemLevel = this.RULE('FormatListItemLevel', () => {
        let element = this.push(this.createFormatListItemLevel());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                        this.tokenPayload(token, element, CstNodeKind.FormatListItemLevel_level_NUMBER_0);
                        element.level = token.image;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.FormatListItemLevel_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN1(this.Expression, {
                        assign: result => {
                            element.level = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.FormatListItemLevel_CloseParen_0);
                    });
                }
            },
        ]);

        return this.pop();
    });

    FormatItem = this.RULE('FormatItem', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.AFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.BFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.CFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ColumnFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.GFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LineFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PageFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.RFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.SkipFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.VFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.XFormatItem, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createAFormatItem(): ast.AFormatItem {
        return {
            kind: ast.SyntaxKind.AFormatItem,
            fieldWidth: null,
        };
    }

    AFormatItem = this.RULE('AFormatItem', () => {
        let element = this.push(this.createAFormatItem());

        this.CONSUME_ASSIGN1(tokens.A, token => {
            this.tokenPayload(token, element, CstNodeKind.AFormatItem_A_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.AFormatItem_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.fieldWidth = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.AFormatItem_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createBFormatItem(): ast.BFormatItem {
        return {
            kind: ast.SyntaxKind.BFormatItem,
            fieldWidth: null,
        };
    }

    BFormatItem = this.RULE('BFormatItem', () => {
        let element = this.push(this.createBFormatItem());

        this.CONSUME_ASSIGN1(tokens.B, token => {
            this.tokenPayload(token, element, CstNodeKind.BFormatItem_B_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.BFormatItem_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.fieldWidth = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.BFormatItem_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createCFormatItem(): ast.CFormatItem {
        return {
            kind: ast.SyntaxKind.CFormatItem,
            item: null,
        };
    }

    CFormatItem = this.RULE('CFormatItem', () => {
        let element = this.push(this.createCFormatItem());

        this.CONSUME_ASSIGN1(tokens.C, token => {
            this.tokenPayload(token, element, CstNodeKind.CFormatItem_C_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CFormatItem_OpenParen_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FFormatItem, {
                        assign: result => {
                            element.item = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EFormatItem, {
                        assign: result => {
                            element.item = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PFormatItem, {
                        assign: result => {
                            element.item = result;
                        }
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.CFormatItem_CloseParen_0);
        });

        return this.pop();
    });

    private createFFormatItem(): ast.FFormatItem {
        return {
            kind: ast.SyntaxKind.FFormatItem,
            fieldWidth: null,
            fractionalDigits: null,
            scalingFactor: null,
        };
    }

    FFormatItem = this.RULE('FFormatItem', () => {
        let element = this.push(this.createFFormatItem());

        this.CONSUME_ASSIGN1(tokens.F, token => {
            this.tokenPayload(token, element, CstNodeKind.FFormatItem_F_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.FFormatItem_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.fieldWidth = result;
            }
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.FFormatItem_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
                assign: result => {
                    element.fractionalDigits = result;
                }
            });
            this.OPTION1(() => {
                this.CONSUME_ASSIGN2(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.FFormatItem_Comma_1);
                });
                this.SUBRULE_ASSIGN3(this.Expression, {
                    assign: result => {
                        element.scalingFactor = result;
                    }
                });
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.FFormatItem_CloseParen_0);
        });

        return this.pop();
    });

    private createEFormatItem(): ast.EFormatItem {
        return {
            kind: ast.SyntaxKind.EFormatItem,
            fieldWidth: null,
            fractionalDigits: null,
            significantDigits: null,
        };
    }

    EFormatItem = this.RULE('EFormatItem', () => {
        let element = this.push(this.createEFormatItem());

        this.CONSUME_ASSIGN1(tokens.E, token => {
            this.tokenPayload(token, element, CstNodeKind.EFormatItem_E_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.EFormatItem_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.fieldWidth = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.Comma, token => {
            this.tokenPayload(token, element, CstNodeKind.EFormatItem_Comma_0);
        });
        this.SUBRULE_ASSIGN2(this.Expression, {
            assign: result => {
                element.fractionalDigits = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN2(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.EFormatItem_Comma_1);
            });
            this.SUBRULE_ASSIGN3(this.Expression, {
                assign: result => {
                    element.significantDigits = result;
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.EFormatItem_CloseParen_0);
        });

        return this.pop();
    });
    private createPFormatItem(): ast.PFormatItem {
        return {
            kind: ast.SyntaxKind.PFormatItem,
            specification: null,
        };
    }

    PFormatItem = this.RULE('PFormatItem', () => {
        let element = this.push(this.createPFormatItem());

        this.CONSUME_ASSIGN1(tokens.P, token => {
            this.tokenPayload(token, element, CstNodeKind.PFormatItem_P_0);
        });
        this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
            this.tokenPayload(token, element, CstNodeKind.PFormatItem_specification_STRING_TERM_0);
            element.specification = token.image;
        });

        return this.pop();
    });
    private createColumnFormatItem(): ast.ColumnFormatItem {
        return {
            kind: ast.SyntaxKind.ColumnFormatItem,
            characterPosition: null,
        };
    }

    ColumnFormatItem = this.RULE('ColumnFormatItem', () => {
        let element = this.push(this.createColumnFormatItem());

        this.CONSUME_ASSIGN1(tokens.COLUMN, token => {
            this.tokenPayload(token, element, CstNodeKind.ColumnFormatItem_COLUMN_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ColumnFormatItem_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.characterPosition = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ColumnFormatItem_CloseParen_0);
        });

        return this.pop();
    });
    private createGFormatItem(): ast.GFormatItem {
        return {
            kind: ast.SyntaxKind.GFormatItem,
            fieldWidth: null,
        };
    }

    GFormatItem = this.RULE('GFormatItem', () => {
        let element = this.push(this.createGFormatItem());

        this.CONSUME_ASSIGN1(tokens.G, token => {
            this.tokenPayload(token, element, CstNodeKind.GFormatItem_G_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.GFormatItem_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.fieldWidth = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.GFormatItem_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createLFormatItem(): ast.LFormatItem {
        return { kind: ast.SyntaxKind.LFormatItem };
    }

    LFormatItem = this.RULE('LFormatItem', () => {
        let element = this.push(this.createLFormatItem());

        this.CONSUME_ASSIGN1(tokens.L, token => {
            this.tokenPayload(token, element, CstNodeKind.LFormatItem_L_0);
        });

        return this.pop();
    });
    private createLineFormatItem(): ast.LineFormatItem {
        return {
            kind: ast.SyntaxKind.LineFormatItem,
            lineNumber: null,
        };
    }

    LineFormatItem = this.RULE('LineFormatItem', () => {
        let element = this.push(this.createLineFormatItem());

        this.CONSUME_ASSIGN1(tokens.LINE, token => {
            this.tokenPayload(token, element, CstNodeKind.LineFormatItem_LINE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LineFormatItem_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.lineNumber = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LineFormatItem_CloseParen_0);
        });

        return this.pop();
    });
    private createPageFormatItem(): ast.PageFormatItem {
        return { kind: ast.SyntaxKind.PageFormatItem };
    }

    PageFormatItem = this.RULE('PageFormatItem', () => {
        let element = this.push(this.createPageFormatItem());

        this.CONSUME_ASSIGN1(tokens.PAGE, token => {
            this.tokenPayload(token, element, CstNodeKind.PageFormatItem_PAGE_0);
        });

        return this.pop();
    });
    private createRFormatItem(): ast.RFormatItem {
        return {
            kind: ast.SyntaxKind.RFormatItem,
            labelReference: null,
        };
    }

    RFormatItem = this.RULE('RFormatItem', () => {
        let element = this.push(this.createRFormatItem());

        this.CONSUME_ASSIGN1(tokens.R, token => {
            this.tokenPayload(token, element, CstNodeKind.RFormatItem_R_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.RFormatItem_OpenParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.RFormatItem_labelReference_ID_0);
            element.labelReference = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.RFormatItem_CloseParen_0);
        });

        return this.pop();
    });
    private createSkipFormatItem(): ast.SkipFormatItem {
        return {
            kind: ast.SyntaxKind.SkipFormatItem,
            skip: null,
        };
    }

    SkipFormatItem = this.RULE('SkipFormatItem', () => {
        let element = this.push(this.createSkipFormatItem());

        this.CONSUME_ASSIGN1(tokens.SKIP, token => {
            this.tokenPayload(token, element, CstNodeKind.SkipFormatItem_SKIP_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.SkipFormatItem_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.skip = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.SkipFormatItem_CloseParen_0);
            });
        });

        return this.pop();
    });

    private createVFormatItem(): ast.VFormatItem {
        return { kind: ast.SyntaxKind.VFormatItem }
    }

    VFormatItem = this.RULE('VFormatItem', () => {
        let element = this.push(this.createVFormatItem());

        this.CONSUME_ASSIGN1(tokens.V, token => {
            this.tokenPayload(token, element, CstNodeKind.VFormatItem_V_0);
        });

        return this.pop();
    });
    private createXFormatItem(): ast.XFormatItem {
        return {
            kind: ast.SyntaxKind.XFormatItem,
            width: null,
        };
    }

    XFormatItem = this.RULE('XFormatItem', () => {
        let element = this.push(this.createXFormatItem());

        this.CONSUME_ASSIGN1(tokens.X, token => {
            this.tokenPayload(token, element, CstNodeKind.XFormatItem_X_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.XFormatItem_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.width = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.XFormatItem_CloseParen_0);
        });

        return this.pop();
    });
    private createFreeStatement(): ast.FreeStatement {
        return {
            kind: ast.SyntaxKind.FreeStatement,
            references: [],
        };
    }

    FreeStatement = this.RULE('FreeStatement', () => {
        let element = this.push(this.createFreeStatement());

        this.CONSUME_ASSIGN1(tokens.FREE, token => {
            this.tokenPayload(token, element, CstNodeKind.FreeStatement_FREE_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.references.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.FreeStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.LocatorCall, {
                assign: result => {
                    element.references.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.FreeStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createGetFileStatement(): ast.GetFileStatement {
        return {
            kind: ast.SyntaxKind.GetFileStatement,
            specifications: []
        };
    }

    private createGetStringStatement(): ast.GetStringStatement {
        return {
            kind: ast.SyntaxKind.GetStringStatement,
            dataSpecification: null,
            expression: null
        };
    }

    GetStatement = this.RULE('GetStatement', () => {
        let element: ast.GetStatement = this.push(this.createGetFileStatement());

        this.CONSUME_ASSIGN1(tokens.GET, token => {
            this.tokenPayload(token, element, CstNodeKind.GetStatement_GET_0);
        });
        this.OR1([
            {
                ALT: () => {
                    const fileStatement = element as ast.GetFileStatement;
                    this.AT_LEAST_ONE1(() => {
                        this.OR2([
                            {
                                ALT: () => {
                                    this.SUBRULE_ASSIGN1(this.GetFile, {
                                        assign: result => {
                                            fileStatement.specifications.push(result);
                                        }
                                    });
                                }
                            },
                            {
                                ALT: () => {
                                    this.SUBRULE_ASSIGN1(this.GetCopy, {
                                        assign: result => {
                                            fileStatement.specifications.push(result);
                                        }
                                    });
                                }
                            },
                            {
                                ALT: () => {
                                    this.SUBRULE_ASSIGN1(this.GetSkip, {
                                        assign: result => {
                                            fileStatement.specifications.push(result);
                                        }
                                    });
                                }
                            },
                            {
                                ALT: () => {
                                    this.SUBRULE_ASSIGN1(this.DataSpecificationOptions, {
                                        assign: result => {
                                            fileStatement.specifications.push(result);
                                        }
                                    });
                                }
                            },
                        ]);
                    });
                }
            },
            {
                ALT: () => {
                    const stringStatement = this.replace(this.createGetStringStatement());
                    this.CONSUME_ASSIGN1(tokens.STRING, token => {
                        this.tokenPayload(token, stringStatement, CstNodeKind.GetStatement_STRING_0);
                    });
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, stringStatement, CstNodeKind.GetStatement_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN1(this.Expression, {
                        assign: result => {
                            stringStatement.expression = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, stringStatement, CstNodeKind.GetStatement_CloseParen_0);
                    });
                    this.SUBRULE_ASSIGN2(this.DataSpecificationOptions, {
                        assign: result => {
                            stringStatement.dataSpecification = result;
                        }
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, this.peek(), CstNodeKind.GetStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createGetFile(): ast.GetFile {
        return {
            kind: ast.SyntaxKind.GetFile,
            file: null,
        };
    }

    GetFile = this.RULE('GetFile', () => {
        let element = this.push(this.createGetFile());

        this.CONSUME_ASSIGN1(tokens.FILE, token => {
            this.tokenPayload(token, element, CstNodeKind.GetFile_FILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.GetFile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.file = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.GetFile_CloseParen_0);
        });

        return this.pop();
    });
    private createGetCopy(): ast.GetCopy {
        return {
            kind: ast.SyntaxKind.GetCopy,
            copyReference: null,
        };
    }

    GetCopy = this.RULE('GetCopy', () => {
        let element = this.push(this.createGetCopy());

        this.CONSUME_ASSIGN1(tokens.COPY, token => {
            this.tokenPayload(token, element, CstNodeKind.GetCopy_COPY_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.GetCopy_OpenParen_0);
            });
            this.CONSUME_ASSIGN1(tokens.ID, token => {
                this.tokenPayload(token, element, CstNodeKind.GetCopy_copyReference_ID_0);
                element.copyReference = token.image;
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.GetCopy_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createGetSkip(): ast.GetSkip {
        return {
            kind: ast.SyntaxKind.GetSkip,
            skipExpression: null,
        };
    }

    GetSkip = this.RULE('GetSkip', () => {
        let element = this.push(this.createGetSkip());

        this.CONSUME_ASSIGN1(tokens.SKIP, token => {
            this.tokenPayload(token, element, CstNodeKind.GetSkip_SKIP_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.GetSkip_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.skipExpression = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.GetSkip_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createGoToStatement(): ast.GoToStatement {
        return {
            kind: ast.SyntaxKind.GoToStatement,
            label: null,
        };
    }

    GoToStatement = this.RULE('GoToStatement', () => {
        let element = this.push(this.createGoToStatement());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.GO, token => {
                        this.tokenPayload(token, element, CstNodeKind.GoToStatement_GO_0);
                    });
                    this.CONSUME_ASSIGN1(tokens.TO, token => {
                        this.tokenPayload(token, element, CstNodeKind.GoToStatement_TO_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.GOTO, token => {
                        this.tokenPayload(token, element, CstNodeKind.GoToStatement_GOTO_0);
                    });
                }
            },
        ]);
        this.SUBRULE_ASSIGN1(this.LabelReference, {
            assign: result => {
                element.label = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.GoToStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createIfStatement(): ast.IfStatement {
        return {
            kind: ast.SyntaxKind.IfStatement,
            expression: null,
            unit: null,
            else: null,
        };
    }

    IfStatement = this.RULE('IfStatement', () => {
        let element = this.push(this.createIfStatement());

        this.CONSUME_ASSIGN1(tokens.IF, token => {
            this.tokenPayload(token, element, CstNodeKind.IfStatement_IF_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.expression = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.THEN, token => {
            this.tokenPayload(token, element, CstNodeKind.IfStatement_THEN_0);
        });
        this.SUBRULE_ASSIGN1(this.Statement, {
            assign: result => {
                element.unit = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.ELSE, token => {
                this.tokenPayload(token, element, CstNodeKind.IfStatement_ELSE_0);
            });
            this.SUBRULE_ASSIGN2(this.Statement, {
                assign: result => {
                    element.else = result;
                }
            });
        });

        return this.pop();
    });
    private createIncludeDirective(): ast.IncludeDirective {
        return {
            kind: ast.SyntaxKind.IncludeDirective,
            items: [],
        };
    }

    IncludeDirective = this.RULE('IncludeDirective', () => {
        let element = this.push(this.createIncludeDirective());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.PercentINCLUDE, token => {
                        this.tokenPayload(token, element, CstNodeKind.IncludeDirective_PercentINCLUDE_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.PercentXINCLUDE, token => {
                        this.tokenPayload(token, element, CstNodeKind.IncludeDirective_PercentXINCLUDE_0);
                    });
                }
            },
        ]);
        this.SUBRULE_ASSIGN1(this.IncludeItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.IncludeDirective_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.IncludeItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.IncludeDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createIncludeItem(): ast.IncludeItem {
        return {
            kind: ast.SyntaxKind.IncludeItem,
            file: null,
            ddname: false,
        };
    }

    IncludeItem = this.RULE('IncludeItem', () => {
        let element = this.push(this.createIncludeItem());

        this.OR1([
            {
                ALT: () => {
                    this.OR2([
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
                                    this.tokenPayload(token, element, CstNodeKind.IncludeItem_file_STRING_TERM_0);
                                    element.file = token.image;
                                });
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN1(tokens.ID, token => {
                                    this.tokenPayload(token, element, CstNodeKind.IncludeItem_file_ID_0);
                                    element.file = token.image;
                                });
                            }
                        },
                    ]);
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ddname, token => {
                        this.tokenPayload(token, element, CstNodeKind.IncludeItem_ddname_ddname_0);
                        element.ddname = true;
                    });
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.IncludeItem_OpenParen_0);
                    });
                    this.OR3([
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN2(tokens.STRING_TERM, token => {
                                    this.tokenPayload(token, element, CstNodeKind.IncludeItem_file_STRING_TERM_1);
                                    element.file = token.image;
                                });
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN2(tokens.ID, token => {
                                    this.tokenPayload(token, element, CstNodeKind.IncludeItem_file_ID_1);
                                    element.file = token.image;
                                });
                            }
                        },
                    ]);
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.IncludeItem_CloseParen_0);
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createIterateStatement(): ast.IterateStatement {
        return {
            kind: ast.SyntaxKind.IterateStatement,
            label: null,
        };
    }

    IterateStatement = this.RULE('IterateStatement', () => {
        let element = this.push(this.createIterateStatement());

        this.CONSUME_ASSIGN1(tokens.ITERATE, token => {
            this.tokenPayload(token, element, CstNodeKind.IterateStatement_ITERATE_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.LabelReference, {
                assign: result => {
                    element.label = result;
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.IterateStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createLeaveStatement(): ast.LeaveStatement {
        return {
            kind: ast.SyntaxKind.LeaveStatement,
            label: null,
        };
    }

    LeaveStatement = this.RULE('LeaveStatement', () => {
        let element = this.push(this.createLeaveStatement());

        this.CONSUME_ASSIGN1(tokens.LEAVE, token => {
            this.tokenPayload(token, element, CstNodeKind.LeaveStatement_LEAVE_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.LabelReference, {
                assign: result => {
                    element.label = result;
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.LeaveStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createLineDirective(): ast.LineDirective {
        return {
            kind: ast.SyntaxKind.LineDirective,
            line: null,
            file: null,
        };
    }

    LineDirective = this.RULE('LineDirective', () => {
        let element = this.push(this.createLineDirective());

        this.CONSUME_ASSIGN1(tokens.PercentLINE, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_PercentLINE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_OpenParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_line_NUMBER_0);
            element.line = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.Comma, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_Comma_0);
        });
        this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_file_STRING_TERM_0);
            element.file = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.LineDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createLocateStatement(): ast.LocateStatement {
        return {
            kind: ast.SyntaxKind.LocateStatement,
            variable: null,
            arguments: [],
        };
    }

    LocateStatement = this.RULE('LocateStatement', () => {
        let element = this.push(this.createLocateStatement());

        this.CONSUME_ASSIGN1(tokens.LOCATE, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatement_LOCATE_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.variable = result;
            }
        });
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.LocateStatementFile, {
                            assign: result => {
                                element.arguments.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.LocateStatementSet, {
                            assign: result => {
                                element.arguments.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.LocateStatementKeyFrom, {
                            assign: result => {
                                element.arguments.push(result);
                            }
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createLocateStatementFile(): ast.LocateStatementFile {
        return {
            kind: ast.SyntaxKind.LocateStatementFile,
            file: null,
        };
    }

    LocateStatementFile = this.RULE('LocateStatementFile', () => {
        let element = this.push(this.createLocateStatementFile());

        this.CONSUME_ASSIGN1(tokens.FILE, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementFile_FILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementFile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.ReferenceItem, {
            assign: result => {
                element.file = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementFile_CloseParen_0);
        });

        return this.pop();
    });
    private createLocateStatementSet(): ast.LocateStatementSet {
        return {
            kind: ast.SyntaxKind.LocateStatementSet,
            set: null,
        };
    }

    LocateStatementSet = this.RULE('LocateStatementSet', () => {
        let element = this.push(this.createLocateStatementSet());

        this.CONSUME_ASSIGN1(tokens.SET, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementSet_SET_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementSet_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.set = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementSet_CloseParen_0);
        });

        return this.pop();
    });
    private createLocateStatementKeyFrom(): ast.LocateStatementKeyFrom {
        return {
            kind: ast.SyntaxKind.LocateStatementKeyFrom,
            keyfrom: null,
        };
    }

    LocateStatementKeyFrom = this.RULE('LocateStatementKeyFrom', () => {
        let element = this.push(this.createLocateStatementKeyFrom());

        this.CONSUME_ASSIGN1(tokens.KEYFROM, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementKeyFrom_KEYFROM_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementKeyFrom_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.keyfrom = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.LocateStatementKeyFrom_CloseParen_0);
        });

        return this.pop();
    });
    private createNoPrintDirective(): ast.NoPrintDirective {
        return { kind: ast.SyntaxKind.NoPrintDirective };
    }

    NoPrintDirective = this.RULE('NoPrintDirective', () => {
        let element = this.push(this.createNoPrintDirective());

        this.CONSUME_ASSIGN1(tokens.PercentNOPRINT, token => {
            this.tokenPayload(token, element, CstNodeKind.NoPrintDirective_PercentNOPRINT_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.NoPrintDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createNoteDirective(): ast.NoteDirective {
        return {
            kind: ast.SyntaxKind.NoteDirective,
            message: null,
            code: null,
        };
    }

    NoteDirective = this.RULE('NoteDirective', () => {
        let element = this.push(this.createNoteDirective());

        this.CONSUME_ASSIGN1(tokens.PercentNOTE, token => {
            this.tokenPayload(token, element, CstNodeKind.NoteDirective_PercentNOTE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.NoteDirective_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.message = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.NoteDirective_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
                assign: result => {
                    element.code = result;
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.NoteDirective_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.NoteDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createNullStatement(): ast.NullStatement {
        return { kind: ast.SyntaxKind.NullStatement };
    }

    NullStatement = this.RULE('NullStatement', () => {
        let element = this.push(this.createNullStatement());

        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.NullStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createOnStatement(): ast.OnStatement {
        return {
            kind: ast.SyntaxKind.OnStatement,
            conditions: [],
            snap: false,
            system: false,
            onUnit: null,
        };
    }

    OnStatement = this.RULE('OnStatement', () => {
        let element = this.push(this.createOnStatement());

        this.CONSUME_ASSIGN1(tokens.ON, token => {
            this.tokenPayload(token, element, CstNodeKind.OnStatement_ON_0);
        });
        this.SUBRULE_ASSIGN1(this.Condition, {
            assign: result => {
                element.conditions.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.OnStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Condition, {
                assign: result => {
                    element.conditions.push(result);
                }
            });
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.SNAP, token => {
                this.tokenPayload(token, element, CstNodeKind.OnStatement_snap_SNAP_0);
                element.snap = true;
            });
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.SYSTEM, token => {
                        this.tokenPayload(token, element, CstNodeKind.OnStatement_system_SYSTEM_0);
                        element.system = true;
                    });
                    this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
                        this.tokenPayload(token, element, CstNodeKind.OnStatement_Semicolon_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.Statement, {
                        assign: result => {
                            element.onUnit = result;
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });

    Condition = this.RULE('Condition', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.KeywordCondition, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.NamedCondition, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.FileReferenceCondition, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createKeywordCondition(): ast.KeywordCondition {
        return {
            kind: ast.SyntaxKind.KeywordCondition,
            keyword: null,
        };
    }

    KeywordCondition = this.RULE('KeywordCondition', () => {
        let element = this.push(this.createKeywordCondition());

        this.CONSUME_ASSIGN1(tokens.KeywordConditions, token => {
            this.tokenPayload(token, element, CstNodeKind.KeywordCondition_keyword_ANYCONDITION_0);
            element.keyword = token.image as ast.KeywordCondition['keyword'];
        });

        return this.pop();
    });
    private createNamedCondition(): ast.NamedCondition {
        return {
            kind: ast.SyntaxKind.NamedCondition,
            name: null,
        };
    }

    NamedCondition = this.RULE('NamedCondition', () => {
        let element = this.push(this.createNamedCondition());

        this.CONSUME_ASSIGN1(tokens.CONDITION, token => {
            this.tokenPayload(token, element, CstNodeKind.NamedCondition_CONDITION_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.NamedCondition_OpenParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.NamedCondition_name_ID_0);
            element.name = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.NamedCondition_CloseParen_0);
        });

        return this.pop();
    });

    private createFileReferenceCondition(): ast.FileReferenceCondition {
        return {
            kind: ast.SyntaxKind.FileReferenceCondition,
            keyword: null,
            fileReference: null,
        };
    }

    FileReferenceCondition = this.RULE('FileReferenceCondition', () => {
        let element = this.push(this.createFileReferenceCondition());

        this.CONSUME_ASSIGN1(tokens.FileReferenceConditions, token => {
            // TODO: rename node kind
            this.tokenPayload(token, element, CstNodeKind.FileReferenceCondition_keyword_ENDFILE_0);
            element.keyword = token.image as ast.FileReferenceCondition['keyword'];
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.FileReferenceCondition_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.ReferenceItem, {
                assign: result => {
                    element.fileReference = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.FileReferenceCondition_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createOpenStatement(): ast.OpenStatement {
        return {
            kind: ast.SyntaxKind.OpenStatement,
            options: [],
        };
    }

    OpenStatement = this.RULE('OpenStatement', () => {
        let element = this.push(this.createOpenStatement());

        this.CONSUME_ASSIGN1(tokens.OPEN, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenStatement_OPEN_0);
        });
        this.SUBRULE_ASSIGN1(this.OpenOptionsGroup, {
            assign: result => {
                element.options.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.OpenStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.OpenOptionsGroup, {
                assign: result => {
                    element.options.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createOpenOptionsGroup(): ast.OpenOptionsGroup {
        return {
            kind: ast.SyntaxKind.OpenOptionsGroup,
            options: [],
        };
    }

    OpenOptionsGroup = this.RULE('OpenOptionsGroup', () => {
        let element = this.push(this.createOpenOptionsGroup());

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsFile, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsStream, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsAccess, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsBuffering, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsKeyed, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsPrint, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsTitle, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsLineSize, {
                        assign: result => element.options.push(result)
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OpenOptionsPageSize, {
                        assign: result => element.options.push(result)
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createOpenOptionsFile(): ast.OpenOptionsFile {
        return {
            kind: ast.SyntaxKind.OpenOptionsFile,
            file: null,
        };
    }

    OpenOptionsFile = this.RULE('OpenOptionsFile', () => {
        let element = this.push(this.createOpenOptionsFile());

        this.CONSUME_ASSIGN1(tokens.FILE, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsFile_FILE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsFile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.ReferenceItem, {
            assign: result => {
                element.file = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsFile_CloseParen_0);
        });

        return this.pop();
    });
    private createOpenOptionsStream(): ast.OpenOptionsStream {
        return {
            kind: ast.SyntaxKind.OpenOptionsStream,
            stream: false,
            record: false,
        };
    }

    OpenOptionsStream = this.RULE('OpenOptionsStream', () => {
        let element = this.push(this.createOpenOptionsStream());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.STREAM, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsStream_stream_STREAM_0);
                        element.stream = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.RECORD, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsStream_record_RECORD_0);
                        element.record = true;
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createOpenOptionsAccess(): ast.OpenOptionsAccess {
        return {
            kind: ast.SyntaxKind.OpenOptionsAccess,
            input: false,
            output: false,
            update: false,
        };
    }

    OpenOptionsAccess = this.RULE('OpenOptionsAccess', () => {
        let element = this.push(this.createOpenOptionsAccess());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.INPUT, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsAccess_input_INPUT_0);
                        element.input = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OUTPUT, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsAccess_output_OUTPUT_0);
                        element.output = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.UPDATE, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsAccess_update_UPDATE_0);
                        element.update = true;
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createOpenOptionsBuffering(): ast.OpenOptionsBuffering {
        return {
            kind: ast.SyntaxKind.OpenOptionsBuffering,
            sequential: false,
            direct: false,
            unbuffered: false,
            buffered: false,
        };
    }

    OpenOptionsBuffering = this.RULE('OpenOptionsBuffering', () => {
        let element = this.push(this.createOpenOptionsBuffering());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.SEQUENTIAL, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsBuffering_sequential_SEQUENTIAL_0);
                        element.sequential = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.DIRECT, token => {
                        this.tokenPayload(token, element, CstNodeKind.OpenOptionsBuffering_direct_DIRECT_0);
                        element.direct = true;
                    });
                }
            },
        ]);
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.BUFFERED, token => {
                this.tokenPayload(token, element, CstNodeKind.OpenOptionsBuffering_buffered_BUFFERED_0);
                element.buffered = true;
            });
        });

        return this.pop();
    });
    private createOpenOptionsKeyed(): ast.OpenOptionsKeyed {
        return {
            kind: ast.SyntaxKind.OpenOptionsKeyed,
            keyed: false,
        };
    }

    OpenOptionsKeyed = this.RULE('OpenOptionsKeyed', () => {
        let element = this.push(this.createOpenOptionsKeyed());

        this.CONSUME_ASSIGN1(tokens.KEYED, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsKeyed_keyed_KEYED_0);
            element.keyed = true;
        });

        return this.pop();
    });

    private createOpenOptionsPrint(): ast.OpenOptionsPrint {
        return {
            kind: ast.SyntaxKind.OpenOptionsPrint,
            print: false,
        };
    }

    OpenOptionsPrint = this.RULE('OpenOptionsPrint', () => {
        let element = this.push(this.createOpenOptionsPrint());

        this.CONSUME_ASSIGN1(tokens.PRINT, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsPrint_print_PRINT_0);
            element.print = true;
        });

        return this.pop();
    });
    private createOpenOptionsTitle(): ast.OpenOptionsTitle {
        return {
            kind: ast.SyntaxKind.OpenOptionsTitle,
            title: null,
        };
    }

    OpenOptionsTitle = this.RULE('OpenOptionsTitle', () => {
        let element = this.push(this.createOpenOptionsTitle());

        this.CONSUME_ASSIGN1(tokens.TITLE, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsTitle_TITLE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsTitle_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.title = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsTitle_CloseParen_0);
        });

        return this.pop();
    });
    private createOpenOptionsLineSize(): ast.OpenOptionsLineSize {
        return {
            kind: ast.SyntaxKind.OpenOptionsLineSize,
            lineSize: null,
        };
    }

    OpenOptionsLineSize = this.RULE('OpenOptionsLineSize', () => {
        let element = this.push(this.createOpenOptionsLineSize());

        this.CONSUME_ASSIGN1(tokens.LINESIZE, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsLineSize_LINESIZE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsLineSize_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.lineSize = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsLineSize_CloseParen_0);
        });

        return this.pop();
    });
    private createOpenOptionsPageSize(): ast.OpenOptionsPageSize {
        return {
            kind: ast.SyntaxKind.OpenOptionsPageSize,
            pageSize: null,
        };
    }

    OpenOptionsPageSize = this.RULE('OpenOptionsPageSize', () => {
        let element = this.push(this.createOpenOptionsPageSize());

        this.CONSUME_ASSIGN1(tokens.PAGESIZE, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsPageSize_PAGESIZE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsPageSize_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.pageSize = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.OpenOptionsPageSize_CloseParen_0);
        });

        return this.pop();
    });
    private createPageDirective(): ast.PageDirective {
        return { kind: ast.SyntaxKind.PageDirective };
    }

    PageDirective = this.RULE('PageDirective', () => {
        let element = this.push(this.createPageDirective());

        this.CONSUME_ASSIGN1(tokens.PercentPAGE, token => {
            this.tokenPayload(token, element, CstNodeKind.PageDirective_PercentPAGE_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.PageDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createPopDirective(): ast.PopDirective {
        return { kind: ast.SyntaxKind.PopDirective };
    }

    PopDirective = this.RULE('PopDirective', () => {
        let element = this.push(this.createPopDirective());

        this.CONSUME_ASSIGN1(tokens.PercentPOP, token => {
            this.tokenPayload(token, element, CstNodeKind.PopDirective_PercentPOP_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.PopDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createPrintDirective(): ast.PrintDirective {
        return { kind: ast.SyntaxKind.PrintDirective };
    }

    PrintDirective = this.RULE('PrintDirective', () => {
        let element = this.push(this.createPrintDirective());

        this.CONSUME_ASSIGN1(tokens.PercentPRINT, token => {
            this.tokenPayload(token, element, CstNodeKind.PrintDirective_PercentPRINT_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.PrintDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createProcessDirective(): ast.ProcessDirective {
        return {
            kind: ast.SyntaxKind.ProcessDirective,
            compilerOptions: [],
        };
    }

    ProcessDirective = this.RULE('ProcessDirective', () => {
        let element = this.push(this.createProcessDirective());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.StarPROCESS, token => {
                        this.tokenPayload(token, element, CstNodeKind.ProcessDirective_StarPROCESS_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.PercentPROCESS, token => {
                        this.tokenPayload(token, element, CstNodeKind.ProcessDirective_PercentPROCESS_0);
                    });
                }
            },
        ]);
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.CompilerOptions, {
                assign: result => {
                    element.compilerOptions ??= []; element.compilerOptions.push(result);
                }
            });
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.ProcessDirective_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.CompilerOptions, {
                assign: result => {
                    element.compilerOptions ??= []; element.compilerOptions.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcessDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createCompilerOptions(): ast.CompilerOptions {
        return {
            kind: ast.SyntaxKind.CompilerOptions,
            value: null,
        };
    }

    // TODO: IMPLEMENT REAL COMPILER OPTIONS SUPPORT IN PARSER
    CompilerOptions = this.RULE('CompilerOptions', () => {
        let element = this.push(this.createCompilerOptions());

        this.CONSUME_ASSIGN1(tokens.TODO, token => {
            this.tokenPayload(token, element, CstNodeKind.CompilerOptions_value_TODO_0);
            element.value = token.image as 'TODO';
        });

        return this.pop();
    });
    private createProcincDirective(): ast.ProcincDirective {
        return {
            kind: ast.SyntaxKind.ProcincDirective,
            datasetName: null,
        };
    }

    ProcincDirective = this.RULE('ProcincDirective', () => {
        let element = this.push(this.createProcincDirective());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.PercentPROCINC, token => {
                        this.tokenPayload(token, element, CstNodeKind.ProcincDirective_PercentPROCINC_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.StarPROCINC, token => {
                        this.tokenPayload(token, element, CstNodeKind.ProcincDirective_StarPROCINC_0);
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcincDirective_datasetName_ID_0);
            element.datasetName = token.image;
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcincDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createPushDirective(): ast.PushDirective {
        return { kind: ast.SyntaxKind.PushDirective };
    }

    PushDirective = this.RULE('PushDirective', () => {
        let element = this.push(this.createPushDirective());

        this.CONSUME_ASSIGN1(tokens.PercentPUSH, token => {
            this.tokenPayload(token, element, CstNodeKind.PushDirective_PercentPUSH_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.PushDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createPutFileStatement(): ast.PutFileStatement {
        return {
            kind: ast.SyntaxKind.PutFileStatement,
            items: []   
        };
    }

    private createPutStringStatement(): ast.PutStringStatement {
        return {
            kind: ast.SyntaxKind.PutStringStatement,
            dataSpecification: null,
            stringExpression: null
        };
    }

    PutStatement = this.RULE('PutStatement', () => {
        let element: ast.PutStatement = this.push(this.createPutFileStatement());

        this.CONSUME_ASSIGN1(tokens.PUT, token => {
            this.tokenPayload(token, element, CstNodeKind.PutStatement_PUT_0);
        });
        this.OPTION1(() => {
            this.OR1([
                {
                    ALT: () => {
                        const putFileStatement = element as ast.PutFileStatement;
                        this.AT_LEAST_ONE1(() => {
                            this.OR2([
                                {
                                    ALT: () => {
                                        this.SUBRULE_ASSIGN1(this.PutItem, {
                                            assign: result => {
                                                putFileStatement.items.push(result);
                                            }
                                        });
                                    }
                                },
                                {
                                    ALT: () => {
                                        this.SUBRULE_ASSIGN1(this.DataSpecificationOptions, {
                                            assign: result => {
                                                putFileStatement.items.push(result);
                                            }
                                        });
                                    }
                                },
                            ]);
                        });
                    }
                },
                {
                    ALT: () => {
                        const putStringStatement = this.replace(this.createPutStringStatement());
                        this.CONSUME_ASSIGN1(tokens.STRING, token => {
                            this.tokenPayload(token, putStringStatement, CstNodeKind.PutStatement_STRING_0);
                        });
                        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                            this.tokenPayload(token, putStringStatement, CstNodeKind.PutStatement_OpenParen_0);
                        });
                        this.SUBRULE_ASSIGN1(this.Expression, {
                            assign: result => {
                                putStringStatement.stringExpression = result;
                            }
                        });
                        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                            this.tokenPayload(token, putStringStatement, CstNodeKind.PutStatement_CloseParen_0);
                        });
                        this.SUBRULE_ASSIGN2(this.DataSpecificationOptions, {
                            assign: result => {
                                putStringStatement.dataSpecification = result;
                            }
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, this.peek(), CstNodeKind.PutStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createPutItem(): ast.PutItem {
        return {
            kind: ast.SyntaxKind.PutItem,
            attribute: null,
            expression: null,
        };
    }

    PutItem = this.RULE('PutItem', () => {
        let element = this.push(this.createPutItem());

        this.CONSUME_ASSIGN(tokens.PutAttribute, token => {
            this.tokenPayload(token, element, CstNodeKind.PutAttribute_FILE_0);
            element.attribute = token.image as ast.PutAttribute;
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.PutItem_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.expression = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.PutItem_CloseParen_0);
            });
        });

        return this.pop();
    });

    private createDataSpecificationOptions(): ast.DataSpecificationOptions {
        return {
            kind: ast.SyntaxKind.DataSpecificationOptions,
            dataList: null,
            edit: false,
            dataLists: [],
            formatLists: [],
            data: false,
            dataListItems: [],
        };
    }

    DataSpecificationOptions = this.RULE('DataSpecificationOptions', () => {
        let element = this.push(this.createDataSpecificationOptions());

        this.OR1([
            {
                ALT: () => {
                    this.OPTION1(() => {
                        this.CONSUME_ASSIGN1(tokens.LIST, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_LIST_0);
                        });
                    });
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN1(this.DataSpecificationDataList, {
                        assign: result => {
                            element.dataList = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_CloseParen_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.DATA, token => {
                        this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_data_DATA_0);
                        element.data = true;
                    });
                    this.OPTION2(() => {
                        this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_OpenParen_1);
                        });
                        this.SUBRULE_ASSIGN1(this.DataSpecificationDataListItem, {
                            assign: result => {
                                element.dataListItems.push(result);
                            }
                        });
                        this.MANY1(() => {
                            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                                this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_Comma_0);
                            });
                            this.SUBRULE_ASSIGN2(this.DataSpecificationDataListItem, {
                                assign: result => {
                                    element.dataListItems.push(result);
                                }
                            });
                        });
                        this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_CloseParen_1);
                        });
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.EDIT, token => {
                        this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_edit_EDIT_0);
                        element.edit = true;
                    });
                    this.AT_LEAST_ONE1(() => {
                        this.CONSUME_ASSIGN3(tokens.OpenParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_OpenParen_2);
                        });
                        this.SUBRULE_ASSIGN2(this.DataSpecificationDataList, {
                            assign: result => {
                                element.dataLists.push(result);
                            }
                        });
                        this.CONSUME_ASSIGN3(tokens.CloseParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_CloseParen_2);
                        });
                        this.CONSUME_ASSIGN4(tokens.OpenParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_OpenParen_3);
                        });
                        this.SUBRULE_ASSIGN1(this.FormatList, {
                            assign: result => {
                                element.formatLists.push(result);
                            }
                        });
                        this.CONSUME_ASSIGN4(tokens.CloseParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.DataSpecificationOptions_CloseParen_3);
                        });
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createDataSpecificationDataList(): ast.DataSpecificationDataList {
        return {
            kind: ast.SyntaxKind.DataSpecificationDataList,
            items: [],
        };
    }

    DataSpecificationDataList = this.RULE('DataSpecificationDataList', () => {
        let element = this.push(this.createDataSpecificationDataList());

        this.SUBRULE_ASSIGN1(this.DataSpecificationDataListItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DataSpecificationDataList_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.DataSpecificationDataListItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });

        return this.pop();
    });
    private createDataSpecificationDataListItem(): ast.DataSpecificationDataListItem {
        return {
            kind: ast.SyntaxKind.DataSpecificationDataListItem,
            value: null,
        };
    }

    DataSpecificationDataListItem = this.RULE('DataSpecificationDataListItem', () => {
        let element = this.push(this.createDataSpecificationDataListItem());

        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.value = result;
            }
        });

        return this.pop();
    });
    private createQualifyStatement(): ast.QualifyStatement {
        return {
            kind: ast.SyntaxKind.QualifyStatement,
            statements: [],
            end: null,
        };
    }

    QualifyStatement = this.RULE('QualifyStatement', () => {
        let element = this.push(this.createQualifyStatement());

        this.CONSUME_ASSIGN1(tokens.QUALIFY, token => {
            this.tokenPayload(token, element, CstNodeKind.QualifyStatement_QUALIFY_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.QualifyStatement_Semicolon_0);
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.Statement, {
                assign: result => {
                    element.statements.push(result);
                }
            });
        });
        this.SUBRULE_ASSIGN1(this.EndStatement, {
            assign: result => {
                element.end = result;
            }
        });
        this.CONSUME_ASSIGN2(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.QualifyStatement_Semicolon_1);
        });

        return this.pop();
    });
    private createReadStatement(): ast.ReadStatement {
        return {
            kind: ast.SyntaxKind.ReadStatement,
            arguments: [],
        };
    }

    ReadStatement = this.RULE('ReadStatement', () => {
        let element = this.push(this.createReadStatement());

        this.CONSUME_ASSIGN1(tokens.READ, token => {
            this.tokenPayload(token, element, CstNodeKind.ReadStatement_READ_0);
        });
        this.MANY(() => {
            this.SUBRULE_ASSIGN(this.ReadStatementOption, {
                assign: result => {
                    element.arguments.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ReadStatement_Semicolon_0);
        });

        return this.pop<ast.ReadStatement>();
    });
    private createReadStatementOption(): ast.ReadStatementOption {
        return {
            kind: ast.SyntaxKind.ReadStatementOption,
            type: null,
            value: null
        };
    }

    ReadStatementOption = this.RULE('ReadStatementOption', () => {
        let element = this.push(this.createReadStatementOption());

        this.CONSUME_ASSIGN1(tokens.ReadStatementType, token => {
            // TODO: rename node kind
            this.tokenPayload(token, element, CstNodeKind.ReadStatementFile_FILE_0);
            element.type = token.image as ast.ReadStatementOption['type'];
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ReadStatementFile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.value = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ReadStatementFile_CloseParen_0);
        });

        return this.pop<ast.ReadStatementOption>();
    });
    
    private createReinitStatement(): ast.ReinitStatement {
        return {
            kind: ast.SyntaxKind.ReinitStatement,
            reference: null,
        };
    }

    ReinitStatement = this.RULE('ReinitStatement', () => {
        let element = this.push(this.createReinitStatement());

        this.CONSUME_ASSIGN1(tokens.REINIT, token => {
            this.tokenPayload(token, element, CstNodeKind.ReinitStatement_REINIT_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.reference = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ReinitStatement_Semicolon_0);
        });

        return this.pop<ast.ReinitStatement>();
    });
    private createReleaseStatement(): ast.ReleaseStatement {
        return {
            kind: ast.SyntaxKind.ReleaseStatement,
            star: false,
            references: [],
        };
    }

    ReleaseStatement = this.RULE('ReleaseStatement', () => {
        let element = this.push(this.createReleaseStatement());

        this.CONSUME_ASSIGN1(tokens.RELEASE, token => {
            this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_RELEASE_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_star_Star_0);
                        element.star = true;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_references_ID_0);
                        element.references.push(token.image);
                    });
                    this.MANY1(() => {
                        this.CONSUME_ASSIGN1(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_Comma_0);
                        });
                        this.CONSUME_ASSIGN2(tokens.ID, token => {
                            this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_references_ID_1);
                            element.references.push(token.image);
                        });
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createResignalStatement(): ast.ResignalStatement {
        return { kind: ast.SyntaxKind.ResignalStatement };
    }

    ResignalStatement = this.RULE('ResignalStatement', () => {
        let element = this.push(this.createResignalStatement());

        this.CONSUME_ASSIGN1(tokens.RESIGNAL, token => {
            this.tokenPayload(token, element, CstNodeKind.ResignalStatement_RESIGNAL_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ResignalStatement_Semicolon_0);
        });

        return this.pop<ast.ResignalStatement>();
    });
    private createReturnStatement(): ast.ReturnStatement {
        return {
            kind: ast.SyntaxKind.ReturnStatement,
            expression: null,
        };
    }

    ReturnStatement = this.RULE('ReturnStatement', () => {
        let element = this.push(this.createReturnStatement());

        this.CONSUME_ASSIGN1(tokens.RETURN, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnStatement_RETURN_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ReturnStatement_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.expression = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ReturnStatement_CloseParen_0);
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createRevertStatement(): ast.RevertStatement {
        return {
            kind: ast.SyntaxKind.RevertStatement,
            conditions: [],
        };
    }

    RevertStatement = this.RULE('RevertStatement', () => {
        let element = this.push(this.createRevertStatement());

        this.CONSUME_ASSIGN1(tokens.REVERT, token => {
            this.tokenPayload(token, element, CstNodeKind.RevertStatement_REVERT_0);
        });
        this.SUBRULE_ASSIGN1(this.Condition, {
            assign: result => {
                element.conditions.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.RevertStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Condition, {
                assign: result => {
                    element.conditions.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.RevertStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createRewriteStatement(): ast.RewriteStatement {
        return {
            kind: ast.SyntaxKind.RewriteStatement,
            arguments: [],
        };
    }

    RewriteStatement = this.RULE('RewriteStatement', () => {
        let element = this.push(this.createRewriteStatement());

        this.CONSUME_ASSIGN1(tokens.REWRITE, token => {
            this.tokenPayload(token, element, CstNodeKind.RewriteStatement_REWRITE_0);
        });
        this.MANY(() => {
            this.SUBRULE_ASSIGN(this.RewriteStatementOption, {
                assign: result => {
                    element.arguments.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.RewriteStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createRewriteStatementOption(): ast.RewriteStatementOption {
        return {
            kind: ast.SyntaxKind.RewriteStatementOption,
            type: null,
            value: null
        };
    }

    RewriteStatementOption = this.RULE('RewriteStatementOption', () => {
        let element = this.push(this.createRewriteStatementOption());

        this.CONSUME_ASSIGN1(tokens.RewriteStatementType, token => {
            this.tokenPayload(token, element, CstNodeKind.RewriteStatementFile_FILE_0);
            element.type = token.image as ast.RewriteStatementOption['type'];
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.RewriteStatementFile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.value = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.RewriteStatementFile_CloseParen_0);
        });

        return this.pop<ast.RewriteStatementOption>();
    });

    private createSelectStatement(): ast.SelectStatement {
        return {
            kind: ast.SyntaxKind.SelectStatement,
            on: null,
            statements: [],
            end: null,
        };
    }

    SelectStatement = this.RULE('SelectStatement', () => {
        let element = this.push(this.createSelectStatement());

        this.CONSUME_ASSIGN1(tokens.SELECT, token => {
            this.tokenPayload(token, element, CstNodeKind.SelectStatement_SELECT_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.SelectStatement_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.on = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.SelectStatement_CloseParen_0);
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.SelectStatement_Semicolon_0);
        });
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.WhenStatement, {
                            assign: result => {
                                element.statements.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.OtherwiseStatement, {
                            assign: result => {
                                element.statements.push(result);
                            }
                        });
                    }
                },
            ]);
        });
        this.SUBRULE_ASSIGN1(this.EndStatement, {
            assign: result => {
                element.end = result;
            }
        });
        this.CONSUME_ASSIGN2(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.SelectStatement_Semicolon_1);
        });

        return this.pop();
    });
    private createWhenStatement(): ast.WhenStatement {
        return {
            kind: ast.SyntaxKind.WhenStatement,
            conditions: [],
            unit: null,
        };
    }

    WhenStatement = this.RULE('WhenStatement', () => {
        let element = this.push(this.createWhenStatement());

        this.CONSUME_ASSIGN1(tokens.WHEN, token => {
            this.tokenPayload(token, element, CstNodeKind.WhenStatement_WHEN_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.WhenStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.conditions.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.WhenStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
                assign: result => {
                    element.conditions.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.WhenStatement_CloseParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Statement, {
            assign: result => {
                element.unit = result;
            }
        });

        return this.pop();
    });
    private createOtherwiseStatement(): ast.OtherwiseStatement {
        return {
            kind: ast.SyntaxKind.OtherwiseStatement,
            unit: null,
        };
    }

    OtherwiseStatement = this.RULE('OtherwiseStatement', () => {
        let element = this.push(this.createOtherwiseStatement());

        this.CONSUME_ASSIGN1(tokens.OTHERWISE, token => {
            this.tokenPayload(token, element, CstNodeKind.OtherwiseStatement_OTHERWISE_0);
        });
        this.SUBRULE_ASSIGN1(this.Statement, {
            assign: result => {
                element.unit = result;
            }
        });

        return this.pop();
    });
    private createSignalStatement(): ast.SignalStatement {
        return {
            kind: ast.SyntaxKind.SignalStatement,
            condition: [],
        };
    }

    SignalStatement = this.RULE('SignalStatement', () => {
        let element = this.push(this.createSignalStatement());

        this.CONSUME_ASSIGN1(tokens.SIGNAL, token => {
            this.tokenPayload(token, element, CstNodeKind.SignalStatement_SIGNAL_0);
        });
        this.SUBRULE_ASSIGN1(this.Condition, {
            assign: result => {
                element.condition.push(result);
            }
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.SignalStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createSkipDirective(): ast.SkipDirective {
        return {
            kind: ast.SyntaxKind.SkipDirective,
            lines: null,
        };
    }

    SkipDirective = this.RULE('SkipDirective', () => {
        let element = this.push(this.createSkipDirective());

        this.CONSUME_ASSIGN1(tokens.PercentSKIP, token => {
            this.tokenPayload(token, element, CstNodeKind.SkipDirective_PercentSKIP_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.SkipDirective_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.lines = result;
                }
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.SkipDirective_CloseParen_0);
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.SkipDirective_Semicolon_0);
        });

        return this.pop();
    });
    private createStopStatement(): ast.StopStatement {
        return { kind: ast.SyntaxKind.StopStatement };
    }

    StopStatement = this.RULE('StopStatement', () => {
        let element = this.push(this.createStopStatement());

        this.CONSUME_ASSIGN1(tokens.STOP, token => {
            this.tokenPayload(token, element, CstNodeKind.StopStatement_STOP_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.StopStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createWaitStatement(): ast.WaitStatement {
        return {
            kind: ast.SyntaxKind.WaitStatement,
            task: null,
        };
    }

    WaitStatement = this.RULE('WaitStatement', () => {
        let element = this.push(this.createWaitStatement());

        this.CONSUME_ASSIGN1(tokens.WAIT, token => {
            this.tokenPayload(token, element, CstNodeKind.WaitStatement_WAIT_0);
        });
        this.CONSUME_ASSIGN1(tokens.THREAD, token => {
            this.tokenPayload(token, element, CstNodeKind.WaitStatement_THREAD_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.WaitStatement_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.task = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.WaitStatement_CloseParen_0);
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.WaitStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createWriteStatement(): ast.WriteStatement {
        return {
            kind: ast.SyntaxKind.WriteStatement,
            arguments: [],
        };
    }

    WriteStatement = this.RULE('WriteStatement', () => {
        let element = this.push(this.createWriteStatement());

        this.CONSUME_ASSIGN1(tokens.WRITE, token => {
            this.tokenPayload(token, element, CstNodeKind.WriteStatement_WRITE_0);
        });
        this.MANY(() => {
            this.SUBRULE_ASSIGN1(this.WriteStatementOption, {
                assign: result => {
                    element.arguments.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.WriteStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createWriteStatementOption(): ast.WriteStatementOption {
        return {
            kind: ast.SyntaxKind.WriteStatementOption,
            type: null,
            value: null
        };
    }

    WriteStatementOption = this.RULE('WriteStatementOption', () => {
        let element = this.push(this.createWriteStatementOption());

        this.CONSUME_ASSIGN1(tokens.WriteStatementType, token => {
            this.tokenPayload(token, element, CstNodeKind.WriteStatementFile_FILE_0);
            element.type = token.image as ast.WriteStatementOption['type'];
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.WriteStatementFile_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.value = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.WriteStatementFile_CloseParen_0);
        });

        return this.pop<ast.WriteStatementOption>();
    });

    private createInitialAttribute(): ast.InitialAttribute {
        return {
            kind: ast.SyntaxKind.InitialAttribute,
            across: false,
            expressions: [],
            direct: false,
            items: [],
            call: false,
            procedureCall: null,
            to: false,
            content: null,
        };
    }

    InitialAttribute = this.RULE('InitialAttribute', () => {
        let element = this.push(this.createInitialAttribute());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.INITIAL, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttribute_INITIAL_0);
                    });
                    this.OR3([
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_direct_OpenParen_0);
                                    element.direct = true;
                                });
                                this.SUBRULE_ASSIGN1(this.InitialAttributeItem, {
                                    assign: result => {
                                        element.items.push(result);
                                    }
                                });
                                this.MANY1(() => {
                                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                                        this.tokenPayload(token, element, CstNodeKind.InitialAttribute_Comma_0);
                                    });
                                    this.SUBRULE_ASSIGN2(this.InitialAttributeItem, {
                                        assign: result => {
                                            element.items.push(result);
                                        }
                                    });
                                });
                                this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_CloseParen_0);
                                });
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN1(tokens.CALL, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_call_CALL_0);
                                    element.call = true;
                                });
                                this.SUBRULE_ASSIGN1(this.ProcedureCall, {
                                    assign: result => {
                                        element.procedureCall = result;
                                    }
                                });
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN1(tokens.TO, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_to_TO_0);
                                    element.to = true;
                                });
                                this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_OpenParen_0);
                                });
                                this.SUBRULE_ASSIGN1(this.InitialToContent, {
                                    assign: result => {
                                        element.content = result;
                                    }
                                });
                                this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_CloseParen_1);
                                });
                                this.CONSUME_ASSIGN3(tokens.OpenParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_OpenParen_1);
                                });
                                this.SUBRULE_ASSIGN3(this.InitialAttributeItem, {
                                    assign: result => {
                                        element.items.push(result);
                                    }
                                });
                                this.MANY2(() => {
                                    this.CONSUME_ASSIGN2(tokens.Comma, token => {
                                        this.tokenPayload(token, element, CstNodeKind.InitialAttribute_Comma_1);
                                    });
                                    this.SUBRULE_ASSIGN4(this.InitialAttributeItem, {
                                        assign: result => {
                                            element.items.push(result);
                                        }
                                    });
                                });
                                this.CONSUME_ASSIGN3(tokens.CloseParen, token => {
                                    this.tokenPayload(token, element, CstNodeKind.InitialAttribute_CloseParen_2);
                                });
                            }
                        },
                    ]);
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.INITACROSS, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttribute_across_INITACROSS_0);
                        element.across = true;
                    });
                    this.CONSUME_ASSIGN4(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttribute_OpenParen_2);
                    });
                    this.SUBRULE_ASSIGN1(this.InitAcrossExpression, {
                        assign: result => {
                            element.expressions.push(result);
                        }
                    });
                    this.MANY3(() => {
                        this.CONSUME_ASSIGN3(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.InitialAttribute_Comma_2);
                        });
                        this.SUBRULE_ASSIGN2(this.InitAcrossExpression, {
                            assign: result => {
                                element.expressions.push(result);
                            }
                        });
                    });
                    this.CONSUME_ASSIGN4(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttribute_CloseParen_3);
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createInitialToContent(): ast.InitialToContent {
        return {
            kind: ast.SyntaxKind.InitialToContent,
            varying: null,
            type: null,
        };
    }

    InitialToContent = this.RULE('InitialToContent', () => {
        let element = this.push(this.createInitialToContent());

        // Varying and char tokens can appear in any order
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Varying, token => {
                        this.tokenPayload(token, element, CstNodeKind.Varying_VARYING_0);
                        element.varying = token.image as ast.Varying;
                    });
                    this.OPTION1(() => {
                        this.CONSUME_ASSIGN1(tokens.Char, token => {
                            this.tokenPayload(token, element, CstNodeKind.CharType_CHAR_0);
                            element.type = token.image as ast.CharType;
                        });
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN2(tokens.Char, token => {
                        this.tokenPayload(token, element, CstNodeKind.CharType_CHAR_0);
                        element.type = token.image as ast.CharType;
                    });
                    this.OPTION2(() => {
                        this.CONSUME_ASSIGN2(tokens.Varying, token => {
                            this.tokenPayload(token, element, CstNodeKind.Varying_VARYING_0);
                            element.varying = token.image as ast.Varying;
                        });
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createInitAcrossExpression(): ast.InitAcrossExpression {
        return {
            kind: ast.SyntaxKind.InitAcrossExpression,
            expressions: [],
        };
    }

    InitAcrossExpression = this.RULE('InitAcrossExpression', () => {
        let element = this.push(this.createInitAcrossExpression());

        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.InitAcrossExpression_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.expressions.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.InitAcrossExpression_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
                assign: result => {
                    element.expressions.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.InitAcrossExpression_CloseParen_0);
        });

        return this.pop();
    });

    InitialAttributeItem = this.RULE('InitialAttributeItem', () => {
        let element = this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttributeItemStar, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttributeSpecification, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop<ast.InitialAttributeItem>();
    });

    private createInitialAttributeItemStar(): ast.InitialAttributeItemStar {
        return { kind: ast.SyntaxKind.InitialAttributeItemStar }
    }

    InitialAttributeItemStar = this.RULE('InitialAttributeItemStar', () => {
        let element = this.push(this.createInitialAttributeItemStar());

        this.CONSUME_ASSIGN1(tokens.Star, token => {
            this.tokenPayload(token, element, CstNodeKind.InitialAttributeItemStar_Star_0);
        });

        return this.pop<ast.InitialAttributeItemStar>();
    });
    private createInitialAttributeSpecification(): ast.InitialAttributeSpecification {
        return {
            kind: ast.SyntaxKind.InitialAttributeSpecification,
            star: false,
            item: null,
            expression: null,
        };
    }

    InitialAttributeSpecification = this.RULE('InitialAttributeSpecification', () => {
        let element = this.push(this.createInitialAttributeSpecification());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttributeSpecification_OpenParen_0);
                    });
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttributeSpecification_star_Star_0);
                        element.star = true;
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.InitialAttributeSpecification_CloseParen_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.Expression, {
                        assign: result => {
                            element.expression = result;
                        }
                    });
                }
            },
        ]);
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.InitialAttributeSpecificationIteration, {
                assign: result => {
                    element.item = result;
                }
            });
        });

        return this.pop<ast.InitialAttributeSpecification>();
    });

    InitialAttributeSpecificationIteration = this.RULE('InitialAttributeSpecificationIteration', () => {
        let element = this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttributeItemStar, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttributeSpecificationIterationValue, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop<ast.InitialAttributeSpecificationIteration>();
    });
    private createInitialAttributeSpecificationIterationValue(): ast.InitialAttributeSpecificationIterationValue {
        return {
            kind: ast.SyntaxKind.InitialAttributeSpecificationIterationValue,
            items: [],
        };
    }

    InitialAttributeSpecificationIterationValue = this.RULE('InitialAttributeSpecificationIterationValue', () => {
        let element = this.push(this.createInitialAttributeSpecificationIterationValue());

        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.InitialAttributeSpecificationIterationValue_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.InitialAttributeItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.InitialAttributeSpecificationIterationValue_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.InitialAttributeItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.InitialAttributeSpecificationIterationValue_CloseParen_0);
        });

        return this.pop();
    });
    private createDeclareStatement(): ast.DeclareStatement {
        return {
            kind: ast.SyntaxKind.DeclareStatement,
            items: [],
            xDeclare: false,
        };
    }

    DeclareStatement = this.RULE('DeclareStatement', () => {
        let element = this.push(this.createDeclareStatement());

        this.CONSUME_ASSIGN1(tokens.DECLARE, token => {
            this.tokenPayload(token, element, CstNodeKind.DeclareStatement_DECLARE_0);
        });
        this.SUBRULE_ASSIGN1(this.DeclaredItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DeclareStatement_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.DeclaredItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Semicolon, token => {
            this.tokenPayload(token, element, CstNodeKind.DeclareStatement_Semicolon_0);
        });

        return this.pop();
    });
    private createDeclaredItem(): ast.DeclaredItem {
        return {
            kind: ast.SyntaxKind.DeclaredItem,
            level: null,
            element: null,
            attributes: [],
            items: [],
        };
    }

    DeclaredItem = this.RULE('DeclaredItem', () => {
        let element = this.push(this.createDeclaredItem());

        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                this.tokenPayload(token, element, CstNodeKind.DeclaredItem_level_NUMBER_0);
                element.level = token.image;
            });
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DeclaredVariable, {
                        assign: result => {
                            element.element = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.DeclaredItem_element_Star_0);
                        element.element = token.image as '*';
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.DeclaredItem_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN1(this.DeclaredItem, {
                        assign: result => {
                            element.items.push(result);
                        }
                    });
                    this.MANY1(() => {
                        this.CONSUME_ASSIGN1(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.DeclaredItem_Comma_0);
                        });
                        this.SUBRULE_ASSIGN2(this.DeclaredItem, {
                            assign: result => {
                                element.items.push(result);
                            }
                        });
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.DeclaredItem_CloseParen_0);
                    });
                }
            },
        ]);
        this.MANY2(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
        });

        return this.pop();
    });
    private createDeclaredVariable(): ast.DeclaredVariable {
        return {
            kind: ast.SyntaxKind.DeclaredVariable,
            name: null,
        };
    }

    DeclaredVariable = this.RULE('DeclaredVariable', () => {
        let element = this.push(this.createDeclaredVariable());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.DeclaredVariable_name_ID_0);
            element.name = token.image;
        });

        return this.pop();
    });

    DefaultDeclarationAttribute = this.RULE('DefaultDeclarationAttribute', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DateAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.HandleAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefinedAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PictureAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EnvironmentAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DimensionsDataAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefaultValueAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueListFromAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueListAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueRangeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ReturnsAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ComputationDataAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EntryAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LikeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.TypeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OrdinalTypeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });

    DeclarationAttribute = this.RULE('DeclarationAttribute', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.InitialAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DateAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.HandleAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DefinedAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.PictureAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EnvironmentAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DimensionsDataAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueListFromAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueListAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ValueRangeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ReturnsAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ComputationDataAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EntryAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LikeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.TypeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.OrdinalTypeAttribute, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createDateAttribute(): ast.DateAttribute {
        return {
            kind: ast.SyntaxKind.DateAttribute,
            pattern: null,
        };
    }

    DateAttribute = this.RULE('DateAttribute', () => {
        let element = this.push(this.createDateAttribute());

        this.CONSUME_ASSIGN1(tokens.DATE, token => {
            this.tokenPayload(token, element, CstNodeKind.DateAttribute_DATE_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DateAttribute_OpenParen_0);
            });
            this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
                this.tokenPayload(token, element, CstNodeKind.DateAttribute_pattern_STRING_TERM_0);
                element.pattern = token.image;
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DateAttribute_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createDefinedAttribute(): ast.DefinedAttribute {
        return {
            kind: ast.SyntaxKind.DefinedAttribute,
            reference: null,
            position: null,
        };
    }

    DefinedAttribute = this.RULE('DefinedAttribute', () => {
        let element = this.push(this.createDefinedAttribute());

        this.CONSUME_ASSIGN1(tokens.DEFINED, token => {
            this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_DEFINED_0);
        });
        this.OR2([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.MemberCall, {
                        assign: result => {
                            element.reference = result;
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_OpenParen_0);
                    });
                    this.SUBRULE_ASSIGN2(this.MemberCall, {
                        assign: result => {
                            element.reference = result;
                        }
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_CloseParen_0);
                    });
                }
            },
        ]);
        this.OPTION1(() => {
            this.OR3([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.POSITION, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_POSITION_0);
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.POS, token => {
                            this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_POS_0);
                        });
                    }
                },
            ]);
            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_OpenParen_1);
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.position = result;
                }
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_CloseParen_1);
            });
        });

        return this.pop();
    });
    private createPictureAttribute(): ast.PictureAttribute {
        return {
            kind: ast.SyntaxKind.PictureAttribute,
            picture: null,
        };
    }

    PictureAttribute = this.RULE('PictureAttribute', () => {
        let element = this.push(this.createPictureAttribute());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.PICTURE, token => {
                        this.tokenPayload(token, element, CstNodeKind.PictureAttribute_PICTURE_0);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.WIDEPIC, token => {
                        this.tokenPayload(token, element, CstNodeKind.PictureAttribute_WIDEPIC_0);
                    });
                }
            }
        ]);
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
                this.tokenPayload(token, element, CstNodeKind.PictureAttribute_picture_STRING_TERM_0);
                element.picture = token.image;
            });
        });

        return this.pop();
    });
    private createDimensionsDataAttribute(): ast.DimensionsDataAttribute {
        return {
            kind: ast.SyntaxKind.DimensionsDataAttribute,
            dimensions: null,
        };
    }

    DimensionsDataAttribute = this.RULE('DimensionsDataAttribute', () => {
        let element = this.push(this.createDimensionsDataAttribute());

        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.DIMENSION, token => {
                this.tokenPayload(token, element, CstNodeKind.DimensionsDataAttribute_DIMENSION_0);
            });
        });
        this.SUBRULE_ASSIGN1(this.Dimensions, {
            assign: result => {
                element.dimensions = result;
            }
        });

        return this.pop();
    });
    private createTypeAttribute(): ast.TypeAttribute {
        return {
            kind: ast.SyntaxKind.TypeAttribute,
            type: null,
        };
    }

    TypeAttribute = this.RULE('TypeAttribute', () => {
        let element = this.push(this.createTypeAttribute());

        this.CONSUME_ASSIGN1(tokens.TYPE, token => {
            this.tokenPayload(token, element, CstNodeKind.TypeAttribute_TYPE_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.TypeAttribute_type_ID_0);
                        element.type = token.image;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.TypeAttribute_OpenParen_0);
                    });
                    this.CONSUME_ASSIGN2(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.TypeAttribute_type_ID_1);
                        element.type = token.image;
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.TypeAttribute_CloseParen_0);
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createOrdinalTypeAttribute(): ast.OrdinalTypeAttribute {
        return {
            kind: ast.SyntaxKind.OrdinalTypeAttribute,
            type: null,
            byvalue: false,
        };
    }

    OrdinalTypeAttribute = this.RULE('OrdinalTypeAttribute', () => {
        let element = this.push(this.createOrdinalTypeAttribute());

        this.CONSUME_ASSIGN1(tokens.ORDINAL, token => {
            this.tokenPayload(token, element, CstNodeKind.OrdinalTypeAttribute_ORDINAL_0);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.OrdinalTypeAttribute_type_ID_0);
                        element.type = token.image;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.OrdinalTypeAttribute_OpenParen_0);
                    });
                    this.CONSUME_ASSIGN2(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.OrdinalTypeAttribute_type_ID_1);
                        element.type = token.image;
                    });
                    this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.OrdinalTypeAttribute_CloseParen_0);
                    });
                }
            },
        ]);
        this.CONSUME_ASSIGN1(tokens.BYVALUE, token => {
            this.tokenPayload(token, element, CstNodeKind.OrdinalTypeAttribute_byvalue_BYVALUE_0);
            element.byvalue = true;
        });

        return this.pop();
    });
    private createReturnsAttribute(): ast.ReturnsAttribute {
        return {
            kind: ast.SyntaxKind.ReturnsAttribute,
            attrs: [],
        };
    }

    ReturnsAttribute = this.RULE('ReturnsAttribute', () => {
        let element = this.push(this.createReturnsAttribute());

        this.CONSUME_ASSIGN1(tokens.RETURNS, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnsAttribute_RETURNS_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnsAttribute_OpenParen_0);
        });
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.ComputationDataAttribute, {
                            assign: result => {
                                element.attrs.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.DateAttribute, {
                            assign: result => {
                                element.attrs.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.ValueListAttribute, {
                            assign: result => {
                                element.attrs.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.ValueRangeAttribute, {
                            assign: result => {
                                element.attrs.push(result);
                            }
                        });
                    }
                },
            ]);
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnsAttribute_CloseParen_0);
        });

        return this.pop();
    });
    private createComputationDataAttribute(): ast.ComputationDataAttribute {
        return {
            kind: ast.SyntaxKind.ComputationDataAttribute,
            type: null,
            dimensions: null,
        };
    }

    ComputationDataAttribute = this.RULE('ComputationDataAttribute', () => {
        let element = this.push(this.createComputationDataAttribute());

        this.CONSUME_ASSIGN(tokens.DefaultAttribute, token => {
            // TODO: rename node kind
            this.tokenPayload(token, element, CstNodeKind.DefaultAttribute_ABNORMAL_0);
            element.type = token.image as ast.DefaultAttribute;
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Dimensions, {
                assign: result => {
                    element.dimensions = result;
                }
            });
        });

        return this.pop();
    });
    private createDefaultValueAttribute(): ast.DefaultValueAttribute {
        return {
            kind: ast.SyntaxKind.DefaultValueAttribute,
            items: [],
        };
    }

    DefaultValueAttribute = this.RULE('DefaultValueAttribute', () => {
        let element = this.push(this.createDefaultValueAttribute());

        this.CONSUME_ASSIGN1(tokens.VALUE, token => {
            this.tokenPayload(token, element, CstNodeKind.DefaultValueAttribute_VALUE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DefaultValueAttribute_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.DefaultValueAttributeItem, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, token => {
                this.tokenPayload(token, element, CstNodeKind.DefaultValueAttribute_Comma_0);
            });
            this.SUBRULE_ASSIGN2(this.DefaultValueAttributeItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.DefaultValueAttribute_CloseParen_0);
        });

        return this.pop();
    });
    private createValueAttribute(): ast.ValueAttribute {
        return {
            kind: ast.SyntaxKind.ValueAttribute,
            value: null,
        };
    }

    ValueAttribute = this.RULE('ValueAttribute', () => {
        let element = this.push(this.createValueAttribute());

        this.CONSUME_ASSIGN1(tokens.VALUE, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueAttribute_VALUE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueAttribute_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.value = result;
            }
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueAttribute_CloseParen_0);
        });

        return this.pop();
    });
    private createDefaultValueAttributeItem(): ast.DefaultValueAttributeItem {
        return {
            kind: ast.SyntaxKind.DefaultValueAttributeItem,
            attributes: [],
        };
    }

    DefaultValueAttributeItem = this.RULE('DefaultValueAttributeItem', () => {
        let element = this.push(this.createDefaultValueAttributeItem());

        this.AT_LEAST_ONE1(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
        });

        return this.pop();
    });
    private createValueListAttribute(): ast.ValueListAttribute {
        return {
            kind: ast.SyntaxKind.ValueListAttribute,
            values: [],
        };
    }

    ValueListAttribute = this.RULE('ValueListAttribute', () => {
        let element = this.push(this.createValueListAttribute());

        this.CONSUME_ASSIGN1(tokens.VALUELIST, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueListAttribute_VALUELIST_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueListAttribute_OpenParen_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.values.push(result);
                }
            });
            this.MANY1(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.ValueListAttribute_Comma_0);
                });
                this.SUBRULE_ASSIGN2(this.Expression, {
                    assign: result => {
                        element.values.push(result);
                    }
                });
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueListAttribute_CloseParen_0);
        });

        return this.pop();
    });
    private createValueListFromAttribute(): ast.ValueListFromAttribute {
        return {
            kind: ast.SyntaxKind.ValueListFromAttribute,
            from: null,
        };
    }

    ValueListFromAttribute = this.RULE('ValueListFromAttribute', () => {
        let element = this.push(this.createValueListFromAttribute());

        this.CONSUME_ASSIGN1(tokens.VALUELISTFROM, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueListFromAttribute_VALUELISTFROM_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.from = result;
            }
        });

        return this.pop();
    });
    private createValueRangeAttribute(): ast.ValueRangeAttribute {
        return {
            kind: ast.SyntaxKind.ValueRangeAttribute,
            values: [],
        };
    }

    ValueRangeAttribute = this.RULE('ValueRangeAttribute', () => {
        let element = this.push(this.createValueRangeAttribute());

        this.CONSUME_ASSIGN1(tokens.VALUERANGE, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueRangeAttribute_VALUERANGE_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueRangeAttribute_OpenParen_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Expression, {
                assign: result => {
                    element.values.push(result);
                }
            });
            this.MANY1(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.ValueRangeAttribute_Comma_0);
                });
                this.SUBRULE_ASSIGN2(this.Expression, {
                    assign: result => {
                        element.values.push(result);
                    }
                });
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ValueRangeAttribute_CloseParen_0);
        });

        return this.pop();
    });

    private createLikeAttribute(): ast.LikeAttribute {
        return {
            kind: ast.SyntaxKind.LikeAttribute,
            reference: null,
        };
    }

    LikeAttribute = this.RULE('LikeAttribute', () => {
        let element = this.push(this.createLikeAttribute());

        this.CONSUME_ASSIGN1(tokens.LIKE, token => {
            this.tokenPayload(token, element, CstNodeKind.LikeAttribute_LIKE_0);
        });
        this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: result => {
                element.reference = result;
            }
        });

        return this.pop();
    });
    private createHandleAttribute(): ast.HandleAttribute {
        return {
            kind: ast.SyntaxKind.HandleAttribute,
            size: null,
            type: null,
        };
    }

    HandleAttribute = this.RULE('HandleAttribute', () => {
        let element = this.push(this.createHandleAttribute());

        this.CONSUME_ASSIGN1(tokens.HANDLE, token => {
            this.tokenPayload(token, element, CstNodeKind.HandleAttribute_HANDLE_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.HandleAttribute_OpenParen_0);
            });
            this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
                this.tokenPayload(token, element, CstNodeKind.HandleAttribute_size_NUMBER_0);
                element.size = token.image;
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.HandleAttribute_CloseParen_0);
            });
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.HandleAttribute_type_ID_0);
                        element.type = token.image;
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.HandleAttribute_OpenParen_1);
                    });
                    this.CONSUME_ASSIGN2(tokens.ID, token => {
                        this.tokenPayload(token, element, CstNodeKind.HandleAttribute_type_ID_1);
                        element.type = token.image;
                    });
                    this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                        this.tokenPayload(token, element, CstNodeKind.HandleAttribute_CloseParen_1);
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createDimensions(): ast.Dimensions {
        return {
            kind: ast.SyntaxKind.Dimensions,
            dimensions: [],
        };
    }

    Dimensions = this.RULE('Dimensions', () => {
        let element = this.push(this.createDimensions());

        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Dimensions_OpenParen_0);
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.DimensionBound, {
                assign: result => {
                    element.dimensions.push(result);
                }
            });
            this.MANY1(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.Dimensions_Comma_0);
                });
                this.SUBRULE_ASSIGN2(this.DimensionBound, {
                    assign: result => {
                        element.dimensions.push(result);
                    }
                });
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.Dimensions_CloseParen_0);
        });

        return this.pop();
    });
    private createDimensionBound(): ast.DimensionBound {
        return {
            kind: ast.SyntaxKind.DimensionBound,
            bound1: null,
            bound2: null,
        };
    }

    DimensionBound = this.RULE('DimensionBound', () => {
        let element = this.push(this.createDimensionBound());

        this.SUBRULE_ASSIGN1(this.Bound, {
            assign: result => {
                element.bound1 = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.Colon, token => {
                this.tokenPayload(token, element, CstNodeKind.DimensionBound_Colon_0);
            });
            this.SUBRULE_ASSIGN2(this.Bound, {
                assign: result => {
                    element.bound2 = result;
                }
            });
        });

        return this.pop();
    });
    private createBound(): ast.Bound {
        return {
            kind: ast.SyntaxKind.Bound,
            expression: null,
            refer: null,
        };
    }

    Bound = this.RULE('Bound', () => {
        let element = this.push(this.createBound());

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.Bound_expression_Star_0);
                        element.expression = token.image as '*';
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.Expression, {
                        assign: result => {
                            element.expression = result;
                        }
                    });
                    this.OPTION1(() => {
                        this.CONSUME_ASSIGN1(tokens.REFER, token => {
                            this.tokenPayload(token, element, CstNodeKind.Bound_REFER_0);
                        });
                        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.Bound_OpenParen_0);
                        });
                        this.SUBRULE_ASSIGN1(this.LocatorCall, {
                            assign: result => {
                                element.refer = result;
                            }
                        });
                        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                            this.tokenPayload(token, element, CstNodeKind.Bound_CloseParen_0);
                        });
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createEnvironmentAttribute(): ast.EnvironmentAttribute {
        return {
            kind: ast.SyntaxKind.EnvironmentAttribute,
            items: [],
        };
    }

    EnvironmentAttribute = this.RULE('EnvironmentAttribute', () => {
        let element = this.push(this.createEnvironmentAttribute());

        this.CONSUME_ASSIGN1(tokens.ENVIRONMENT, token => {
            this.tokenPayload(token, element, CstNodeKind.EnvironmentAttribute_ENVIRONMENT_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.EnvironmentAttribute_OpenParen_0);
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.EnvironmentAttributeItem, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.EnvironmentAttribute_CloseParen_0);
        });

        return this.pop();
    });
    private createEnvironmentAttributeItem(): ast.EnvironmentAttributeItem {
        return {
            kind: ast.SyntaxKind.EnvironmentAttributeItem,
            environment: null,
            args: [],
        };
    }

    EnvironmentAttributeItem = this.RULE('EnvironmentAttributeItem', () => {
        let element = this.push(this.createEnvironmentAttributeItem());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.EnvironmentAttributeItem_environment_ID_0);
            element.environment = token.image;
        });
        this.OPTION3(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.EnvironmentAttributeItem_OpenParen_0);
            });
            this.OPTION2(() => {
                this.SUBRULE_ASSIGN1(this.Expression, {
                    assign: result => {
                        element.args.push(result);
                    }
                });
                this.MANY1(() => {
                    this.OPTION1(() => {
                        this.CONSUME_ASSIGN1(tokens.Comma, token => {
                            this.tokenPayload(token, element, CstNodeKind.EnvironmentAttributeItem_Comma_0);
                        });
                    });
                    this.SUBRULE_ASSIGN2(this.Expression, {
                        assign: result => {
                            element.args.push(result);
                        }
                    });
                });
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.EnvironmentAttributeItem_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createEntryAttribute(): ast.EntryAttribute {
        return {
            kind: ast.SyntaxKind.EntryAttribute,
            limited: [],
            attributes: [],
            options: [],
            variable: [],
            returns: [],
            environmentName: [],
        };
    }

    EntryAttribute = this.RULE('EntryAttribute', () => {
        let element = this.push(this.createEntryAttribute());

        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.LIMITED, token => {
                this.tokenPayload(token, element, CstNodeKind.EntryAttribute_limited_LIMITED_0);
                element.limited.push(token.image as 'LIMITED');
            });
        });
        this.CONSUME_ASSIGN1(tokens.ENTRY, token => {
            this.tokenPayload(token, element, CstNodeKind.EntryAttribute_ENTRY_0);
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.EntryAttribute_OpenParen_0);
            });
            this.SUBRULE_ASSIGN1(this.EntryDescription, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
            this.MANY2(() => {
                this.CONSUME_ASSIGN1(tokens.Comma, token => {
                    this.tokenPayload(token, element, CstNodeKind.EntryAttribute_Comma_0);
                });
                this.SUBRULE_ASSIGN2(this.EntryDescription, {
                    assign: result => {
                        element.attributes.push(result);
                    }
                });
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.EntryAttribute_CloseParen_0);
            });
        });
        this.MANY3(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.Options, {
                            assign: result => {
                                element.options.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.VARIABLE, token => {
                            this.tokenPayload(token, element, CstNodeKind.EntryAttribute_variable_VARIABLE_0);
                            element.variable.push(token.image as 'VARIABLE');
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN2(tokens.LIMITED, token => {
                            this.tokenPayload(token, element, CstNodeKind.EntryAttribute_limited_LIMITED_1);
                            element.limited.push(token.image as 'LIMITED');
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE_ASSIGN1(this.ReturnsOption, {
                            assign: result => {
                                element.returns.push(result);
                            }
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.EXTERNAL, token => {
                            this.tokenPayload(token, element, CstNodeKind.EntryAttribute_EXTERNAL_0);
                        });
                        this.OPTION2(() => {
                            this.CONSUME_ASSIGN2(tokens.OpenParen, token => {
                                this.tokenPayload(token, element, CstNodeKind.EntryAttribute_OpenParen_1);
                            });
                            this.SUBRULE_ASSIGN1(this.Expression, {
                                assign: result => {
                                    element.environmentName.push(result);
                                }
                            });
                            this.CONSUME_ASSIGN2(tokens.CloseParen, token => {
                                this.tokenPayload(token, element, CstNodeKind.EntryAttribute_CloseParen_1);
                            });
                        });
                    }
                },
            ]);
        });

        return this.pop();
    });
    private createReturnsOption(): ast.ReturnsOption {
        return {
            kind: ast.SyntaxKind.ReturnsOption,
            returnAttributes: [],
        };
    }

    ReturnsOption = this.RULE('ReturnsOption', () => {
        let element = this.push(this.createReturnsOption());

        this.CONSUME_ASSIGN1(tokens.RETURNS, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnsOption_RETURNS_0);
        });
        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnsOption_OpenParen_0);
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.returnAttributes.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ReturnsOption_CloseParen_0);
        });

        return this.pop();
    });

    EntryDescription = this.RULE('EntryDescription', () => {
        let element = this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EntryParameterDescription, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.EntryUnionDescription, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop<ast.EntryDescription>();
    });
    private createEntryParameterDescription(): ast.EntryParameterDescription {
        return {
            kind: ast.SyntaxKind.EntryParameterDescription,
            attributes: [],
            star: false,
        };
    }

    EntryParameterDescription = this.RULE('EntryParameterDescription', () => {
        let element = this.push(this.createEntryParameterDescription());

        this.OR1([
            {
                ALT: () => {
                    this.AT_LEAST_ONE1(() => {
                        this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                            assign: result => {
                                element.attributes.push(result);
                            }
                        });
                    }); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME_ASSIGN1(tokens.Star, token => {
                        this.tokenPayload(token, element, CstNodeKind.EntryParameterDescription_star_Star_0);
                        element.star = true;
                    });
                    this.MANY1(() => {
                        this.SUBRULE_ASSIGN2(this.DeclarationAttribute, {
                            assign: result => {
                                element.attributes.push(result);
                            }
                        });
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createEntryUnionDescription(): ast.EntryUnionDescription {
        return {
            kind: ast.SyntaxKind.EntryUnionDescription,
            init: null,
            attributes: [],
            prefixedAttributes: [],
        };
    }

    EntryUnionDescription = this.RULE('EntryUnionDescription', () => {
        let element = this.push(this.createEntryUnionDescription());

        this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
            this.tokenPayload(token, element, CstNodeKind.EntryUnionDescription_init_NUMBER_0);
            element.init = token.image;
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.attributes.push(result);
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.Comma, token => {
            this.tokenPayload(token, element, CstNodeKind.EntryUnionDescription_Comma_0);
        });
        this.MANY2(() => {
            this.SUBRULE_ASSIGN1(this.PrefixedAttribute, {
                assign: result => {
                    element.prefixedAttributes.push(result);
                }
            });
        });

        return this.pop();
    });
    private createPrefixedAttribute(): ast.PrefixedAttribute {
        return {
            kind: ast.SyntaxKind.PrefixedAttribute,
            level: null,
            attribute: null,
        };
    }

    PrefixedAttribute = this.RULE('PrefixedAttribute', () => {
        let element = this.push(this.createPrefixedAttribute());

        this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
            this.tokenPayload(token, element, CstNodeKind.PrefixedAttribute_level_NUMBER_0);
            element.level = token.image;
        });
        this.MANY1(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
                assign: result => {
                    element.attribute = result;
                }
            });
        });

        return this.pop();
    });
    private createProcedureParameter(): ast.ProcedureParameter {
        return {
            kind: ast.SyntaxKind.ProcedureParameter,
            id: null,
        };
    }

    ProcedureParameter = this.RULE('ProcedureParameter', () => {
        let element = this.push(this.createProcedureParameter());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcedureParameter_id_ID_0);
            element.id = token.image;
        });

        return this.pop();
    });
    private createReferenceItem(): ast.ReferenceItem {
        return {
            kind: ast.SyntaxKind.ReferenceItem,
            ref: null,
            dimensions: null,
        };
    }

    ReferenceItem = this.RULE('ReferenceItem', () => {
        let element = this.push(this.createReferenceItem());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.ReferenceItem_ref_ID_0);
            element.ref = token.image;
        });
        this.OPTION1(() => {
            this.SUBRULE_ASSIGN1(this.Dimensions, {
                assign: result => {
                    element.dimensions = result;
                }
            });
        });

        return this.pop();
    });

    BinaryExpression = this.RULE('BinaryExpression', () => {
        const element: IntermediateBinaryExpression = this.push({
            infix: true,
            items: [],
            operators: []
        });

        this.SUBRULE_ASSIGN1(this.PrimaryExpression, {
            assign: result => {
                element.items.push(result);
            }
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN(tokens.BinaryOperator, token => {
                this.tokenPayload(token, element as any, CstNodeKind.BinaryExpression_op_Pipe_0);
                // TODO: maybe use token.image as well?
                // Depends on whether we need it
                // For now, the name of the token is required to perform the transformation
                element.operators.push(token.tokenType.name); 
            });
            this.SUBRULE_ASSIGN2(this.PrimaryExpression, {
                assign: result => {
                    element.items.push(result);
                }
            });
        });

        return this.pop();
    });

    Expression = this.BinaryExpression;

    PrimaryExpression = this.RULE('PrimaryExpression', () => {
        let element = this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.Literal, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.ParenthesizedExpression, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.UnaryExpression, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.LocatorCall, {
                        assign: result => {
                            element = this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop<ast.Expression>();
    });
    private createParenthesizedExpression(): ast.Parenthesis {
        return {
            kind: ast.SyntaxKind.Parenthesis,
            value: null,
            do: null
        };
    }

    ParenthesizedExpression = this.RULE('ParenthesizedExpression', () => {
        let element = this.push(this.createParenthesizedExpression());

        this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ParenthesizedExpression_OpenParen_0);
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.value = result;
            }
        });
        this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.DO, token => {
                this.tokenPayload(token, element, CstNodeKind.ParenthesizedExpression_DO_0);
            });
            this.SUBRULE_ASSIGN1(this.DoType3, {
                assign: result => {
                    element.do = result;
                }
            });
        });
        this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
            this.tokenPayload(token, element, CstNodeKind.ParenthesizedExpression_CloseParen_0);
        });
        this.OPTION2(() => {
            const multiplier = element;
            const literal = this.replace(this.createLiteral());
            this.ACTION(() => {
                literal.multiplier = multiplier;
            });
            this.SUBRULE_ASSIGN1(this.LiteralValue, {
                assign: result => {
                    literal.value = result;
                }
            });
        });

        return this.pop();
    });
    private createMemberCall(): ast.MemberCall {
        return {
            kind: ast.SyntaxKind.MemberCall,
            element: null,
            previous: null,
        };
    }

    MemberCall = this.RULE('MemberCall', () => {
        let element = this.push(this.createMemberCall());

        this.SUBRULE_ASSIGN1(this.ReferenceItem, {
            assign: result => {
                element.element = result;
            }
        });
        this.MANY1(() => {
            this.ACTION(() => {
                const previous = element;
                element = this.replace(this.createMemberCall());
                element.previous = previous;
            });
            this.CONSUME_ASSIGN1(tokens.Dot, token => {
                this.tokenPayload(token, element, CstNodeKind.MemberCall_Dot_0);
            });
            this.SUBRULE_ASSIGN2(this.ReferenceItem, {
                assign: result => {
                    element.element = result;
                }
            });
        });

        return this.pop();
    });
    private createLocatorCall(): ast.LocatorCall {
        return {
            kind: ast.SyntaxKind.LocatorCall,
            element: null,
            previous: null,
            pointer: false,
            handle: false,
        };
    }

    LocatorCall = this.RULE('LocatorCall', () => {
        let element = this.push(this.createLocatorCall());

        this.SUBRULE_ASSIGN1(this.MemberCall, {
            assign: result => {
                element.element = result;
            }
        });
        this.MANY1(() => {
            this.ACTION(() => {
                const previous = element;
                element = this.replace(this.createLocatorCall());
                element.previous = previous;
            });
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.MinusGreaterThan, token => {
                            this.tokenPayload(token, element, CstNodeKind.LocatorCall_pointer_MinusGreaterThan_0);
                            element.pointer = true;
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME_ASSIGN1(tokens.EqualsGreaterThan, token => {
                            this.tokenPayload(token, element, CstNodeKind.LocatorCall_handle_EqualsGreaterThan_0);
                            element.handle = true;
                        });
                    }
                },
            ]);
            this.SUBRULE_ASSIGN2(this.MemberCall, {
                assign: result => {
                    element.element = result;
                }
            });
        });

        return this.pop();
    });
    private createProcedureCall(): ast.ProcedureCall {
        return {
            kind: ast.SyntaxKind.ProcedureCall,
            procedure: null,
            args: [],
        };
    }

    ProcedureCall = this.RULE('ProcedureCall', () => {
        let element = this.push(this.createProcedureCall());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.ProcedureCall_procedure_ID_0);
            element.procedure = token.image;
        });
        this.OPTION2(() => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ProcedureCall_OpenParen_0);
            });
            this.OPTION1(() => {
                this.OR1([
                    {
                        ALT: () => {
                            this.SUBRULE_ASSIGN1(this.Expression, {
                                assign: result => {
                                    element.args.push(result);
                                }
                            });
                        }
                    },
                    {
                        ALT: () => {
                            this.CONSUME_ASSIGN1(tokens.Star, token => {
                                this.tokenPayload(token, element, CstNodeKind.ProcedureCall_args_Star_0);
                                element.args.push(token.image as '*');
                            });
                        }
                    },
                ]);
                this.MANY1(() => {
                    this.CONSUME_ASSIGN1(tokens.Comma, token => {
                        this.tokenPayload(token, element, CstNodeKind.ProcedureCall_Comma_0);
                    });
                    this.OR2([
                        {
                            ALT: () => {
                                this.SUBRULE_ASSIGN2(this.Expression, {
                                    assign: result => {
                                        element.args.push(result);
                                    }
                                });
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME_ASSIGN2(tokens.Star, token => {
                                    this.tokenPayload(token, element, CstNodeKind.ProcedureCall_args_Star_1);
                                    element.args.push(token.image as '*');
                                });
                            }
                        },
                    ]);
                });
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, token => {
                this.tokenPayload(token, element, CstNodeKind.ProcedureCall_CloseParen_0);
            });
        });

        return this.pop();
    });
    private createLabelReference(): ast.LabelReference {
        return {
            kind: ast.SyntaxKind.LabelReference,
            label: null,
        };
    }

    LabelReference = this.RULE('LabelReference', () => {
        let element = this.push(this.createLabelReference());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            this.tokenPayload(token, element, CstNodeKind.LabelReference_label_ID_0);
            element.label = token.image;
        });

        return this.pop();
    });
    private createUnaryExpression(): ast.UnaryExpression {
        return {
            kind: ast.SyntaxKind.UnaryExpression,
            op: null,
            expr: null,
        };
    }

    UnaryExpression = this.RULE('UnaryExpression', () => {
        let element = this.push(this.createUnaryExpression());

        this.CONSUME_ASSIGN1(tokens.UnaryOperator, token => {
            this.tokenPayload(token, element, CstNodeKind.UnaryExpression_op_Plus_0);
            element.op = token.image as ast.UnaryExpression['op'];
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
            assign: result => {
                element.expr = result;
            }
        });

        return this.pop();
    });
    private createLiteral(): ast.Literal {
        return {
            kind: ast.SyntaxKind.Literal,
            multiplier: null,
            value: null,
        };
    }

    Literal = this.RULE('Literal', () => {
        let element = this.push(this.createLiteral());

        this.SUBRULE_ASSIGN1(this.LiteralValue, {
            assign: result => {
                element.value = result;
            }
        });

        return this.pop();
    });

    LiteralValue = this.RULE('LiteralValue', () => {
        this.push({});

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.StringLiteral, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE_ASSIGN1(this.NumberLiteral, {
                        assign: result => {
                            this.replace(result);
                        }
                    });
                }
            },
        ]);

        return this.pop();
    });
    private createStringLiteral(): ast.StringLiteral {
        return {
            kind: ast.SyntaxKind.StringLiteral,
            value: null,
        };
    }

    StringLiteral = this.RULE('StringLiteral', () => {
        let element = this.push(this.createStringLiteral());

        this.CONSUME_ASSIGN1(tokens.STRING_TERM, token => {
            this.tokenPayload(token, element, CstNodeKind.StringLiteral_value_STRING_TERM_0);
            element.value = token.image;
        });

        return this.pop();
    });
    private createNumberLiteral(): ast.NumberLiteral {
        return {
            kind: ast.SyntaxKind.NumberLiteral,
            value: null,
        };
    }

    NumberLiteral = this.RULE('NumberLiteral', () => {
        let element = this.push(this.createNumberLiteral());

        this.CONSUME_ASSIGN1(tokens.NUMBER, token => {
            this.tokenPayload(token, element, CstNodeKind.NumberLiteral_value_NUMBER_0);
            element.value = token.image;
        });

        return this.pop();
    });
    private createFQN(): ast.FQN {
        return {
            
        } as any;
    }

    FQN = this.RULE('FQN', () => {
        let element = this.push(this.createFQN());

        this.CONSUME_ASSIGN1(tokens.ID, token => {
            // this.tokenPayload(token, element, CstNodeKind.FQN_ID_0);
        });
        this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Dot, token => {
                // this.tokenPayload(token, element, CstNodeKind.FQN_Dot_0);
            });
            this.CONSUME_ASSIGN2(tokens.ID, token => {
                // this.tokenPayload(token, element, CstNodeKind.FQN_ID_1);
            });
        });

        return this.pop();
    });
}
