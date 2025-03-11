import { AbstractParser } from './abstract-parser';
import * as tokens from './tokens';
import * as ast from './ast';

export class PliParser extends AbstractParser {
    constructor() {
        super(tokens.all);
        this.performSelfAnalysis();
    }

    private createPliProgram(): ast.PliProgram {
        return {} as any;
    }

    PliProgram = this.RULE('PliProgram', () => {
        const element = this.createPliProgram();

        this.MANY1(() => {
            this.SUBRULE1(this.Statement);
        });

        return element;
    });
    private createPackage(): ast.Package {
        return {} as any;
    }

    Package = this.RULE('Package', () => {
        const element = this.createPackage();

        this.CONSUME1(tokens.PACKAGE);
        this.OPTION1(() => {
            this.SUBRULE1(this.Exports);
        });
        this.OPTION2(() => {
            this.SUBRULE1(this.Reserves);
        });
        this.OPTION3(() => {
            this.SUBRULE1(this.Options);
        });
        this.CONSUME1(tokens.Semicolon);
        this.MANY1(() => {
            this.SUBRULE1(this.Statement);
        });
        this.SUBRULE1(this.EndStatement);
        this.CONSUME2(tokens.Semicolon);

        return element;
    });
    private createConditionPrefix(): ast.ConditionPrefix {
        return {} as any;
    }

    ConditionPrefix = this.RULE('ConditionPrefix', () => {
        const element = this.createConditionPrefix();

        this.AT_LEAST_ONE1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.ConditionPrefixItem);
            this.CONSUME1(tokens.CloseParen);
            this.CONSUME1(tokens.Colon);
        });

        return element;
    });
    private createConditionPrefixItem(): ast.ConditionPrefixItem {
        return {} as any;
    }

    ConditionPrefixItem = this.RULE('ConditionPrefixItem', () => {
        const element = this.createConditionPrefixItem();

        this.SUBRULE1(this.Condition);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Condition);
        });

        return element;
    });
    private createExports(): ast.Exports {
        return {} as any;
    }

    Exports = this.RULE('Exports', () => {
        const element = this.createExports();

        this.CONSUME1(tokens.EXPORTS);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ID);
                    this.MANY1(() => {
                        this.CONSUME1(tokens.Comma);
                        this.CONSUME2(tokens.ID);
                    });
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReserves(): ast.Reserves {
        return {} as any;
    }

    Reserves = this.RULE('Reserves', () => {
        const element = this.createReserves();

        this.CONSUME1(tokens.RESERVES);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ID);
                    this.MANY1(() => {
                        this.CONSUME1(tokens.Comma);
                        this.CONSUME2(tokens.ID);
                    });
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createOptions(): ast.Options {
        return {} as any;
    }

    Options = this.RULE('Options', () => {
        const element = this.createOptions();

        this.CONSUME1(tokens.OPTIONS);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.OptionsItem);
        this.MANY1(() => {
            this.OPTION1(() => {
                this.CONSUME1(tokens.Comma);
            });
            this.SUBRULE2(this.OptionsItem);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createOptionsItem(): ast.OptionsItem {
        return {} as any;
    }

    OptionsItem = this.RULE('OptionsItem', () => {
        const element = this.createOptionsItem();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.SimpleOptionsItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.CMPATOptionsItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LinkageOptionsItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.NoMapOptionsItem); 
                }
            },
        ]);

        return element;
    });
    private createLinkageOptionsItem(): ast.LinkageOptionsItem {
        return {} as any;
    }

    LinkageOptionsItem = this.RULE('LinkageOptionsItem', () => {
        const element = this.createLinkageOptionsItem();

        this.CONSUME1(tokens.LINKAGE);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.CDECL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OPTLINK); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STDCALL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SYSTEM); 
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createCMPATOptionsItem(): ast.CMPATOptionsItem {
        return {} as any;
    }

    CMPATOptionsItem = this.RULE('CMPATOptionsItem', () => {
        const element = this.createCMPATOptionsItem();

        this.CONSUME1(tokens.CMPAT);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.V1); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.V2); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.V3); 
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createNoMapOptionsItem(): ast.NoMapOptionsItem {
        return {} as any;
    }

    NoMapOptionsItem = this.RULE('NoMapOptionsItem', () => {
        const element = this.createNoMapOptionsItem();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.NOMAP); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NOMAPIN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NOMAPOUT); 
                }
            },
        ]);
        this.OPTION2(() => {
            this.CONSUME1(tokens.OpenParen);
            this.OPTION1(() => {
                this.CONSUME1(tokens.ID);
                this.MANY1(() => {
                    this.CONSUME1(tokens.Comma);
                    this.CONSUME2(tokens.ID);
                });
            });
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createSimpleOptionsItem(): ast.SimpleOptionsItem {
        return {} as any;
    }

    SimpleOptionsItem = this.RULE('SimpleOptionsItem', () => {
        const element = this.createSimpleOptionsItem();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ORDER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.REORDER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NOCHARGRAPHIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CHARGRAPHIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NOINLINE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INLINE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.MAIN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NOEXECOPS); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.COBOL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FORTRAN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BYADDR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BYVALUE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DESCRIPTOR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NODESCRIPTOR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.IRREDUCIBLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.REDUCIBLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NORETURN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.REENTRANT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FETCHABLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RENT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AMODE31); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AMODE64); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DLLINTERNAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FROMALIEN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RETCODE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ASSEMBLER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ASM); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.WINMAIN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INTER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RECURSIVE); 
                }
            },
        ]);

        return element;
    });
    private createProcedureStatement(): ast.ProcedureStatement {
        return {} as any;
    }

    ProcedureStatement = this.RULE('ProcedureStatement', () => {
        const element = this.createProcedureStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.PROC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PROCEDURE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XPROC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XPROCEDURE); 
                }
            },
        ]);
        this.OPTION2(() => {
            this.CONSUME1(tokens.OpenParen);
            this.OPTION1(() => {
                this.SUBRULE1(this.ProcedureParameter);
                this.MANY1(() => {
                    this.CONSUME1(tokens.Comma);
                    this.SUBRULE2(this.ProcedureParameter);
                });
            });
            this.CONSUME1(tokens.CloseParen);
        });
        this.MANY2(() => {
            this.OR2([
                {
                    ALT: () => {
                        this.SUBRULE1(this.ReturnsOption); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.Options); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.RECURSIVE); 
                    }
                },
                {
                    ALT: () => {
                        this.OR3([
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.ORDER); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.REORDER); 
                                }
                            },
                        ]);
                    }
                },
                {
                    ALT: () => {
                        this.OR4([
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.EXTERNAL); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.EXT); 
                                }
                            },
                        ]);
                        this.OPTION3(() => {
                            this.CONSUME2(tokens.OpenParen);
                            this.SUBRULE1(this.Expression);
                            this.CONSUME2(tokens.CloseParen);
                        });
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.ScopeAttribute); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);
        this.MANY3(() => {
            this.SUBRULE1(this.Statement);
        });
        this.OPTION4(() => {
            this.OR5([
                {
                    ALT: () => {
                        this.CONSUME2(tokens.PROC); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME2(tokens.PROCEDURE); 
                    }
                },
            ]);
        });
        this.SUBRULE1(this.EndStatement);
        this.CONSUME2(tokens.Semicolon);

        return element;
    });
    private createScopeAttribute(): ast.ScopeAttribute {
        return {} as any;
    }

    ScopeAttribute = this.RULE('ScopeAttribute', () => {
        const element = this.createScopeAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.STATIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DYNAMIC); 
                }
            },
        ]);

        return element;
    });
    private createLabelPrefix(): ast.LabelPrefix {
        return {} as any;
    }

    LabelPrefix = this.RULE('LabelPrefix', () => {
        const element = this.createLabelPrefix();

        this.CONSUME1(tokens.ID);
        this.CONSUME1(tokens.Colon);

        return element;
    });
    private createEntryStatement(): ast.EntryStatement {
        return {} as any;
    }

    EntryStatement = this.RULE('EntryStatement', () => {
        const element = this.createEntryStatement();

        this.CONSUME1(tokens.ENTRY);
        this.OPTION2(() => {
            this.CONSUME1(tokens.OpenParen);
            this.OPTION1(() => {
                this.SUBRULE1(this.ProcedureParameter);
                this.MANY1(() => {
                    this.CONSUME1(tokens.Comma);
                    this.SUBRULE2(this.ProcedureParameter);
                });
            });
            this.CONSUME1(tokens.CloseParen);
        });
        this.MANY2(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.OR2([
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.EXTERNAL); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.EXT); 
                                }
                            },
                        ]);
                        this.OPTION3(() => {
                            this.CONSUME2(tokens.OpenParen);
                            this.SUBRULE1(this.Expression);
                            this.CONSUME2(tokens.CloseParen);
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.VARIABLE); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.LIMITED); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.ReturnsOption); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.Options); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createStatement(): ast.Statement {
        return {} as any;
    }

    Statement = this.RULE('Statement', () => {
        const element = this.createStatement();

        this.OPTION1(() => {
            this.SUBRULE1(this.ConditionPrefix);
        });
        this.MANY1(() => {
            this.SUBRULE1(this.LabelPrefix);
        });
        this.SUBRULE1(this.Unit);

        return element;
    });
    private createUnit(): ast.Unit {
        return {} as any;
    }

    Unit = this.RULE('Unit', () => {
        const element = this.createUnit();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.DeclareStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AllocateStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AssertStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AssignmentStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AttachStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.BeginStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.CallStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.CancelThreadStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.CloseStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefaultStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefineAliasStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefineOrdinalStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefineStructureStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DelayStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DeleteStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DetachStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DisplayStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DoStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EntryStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ExecStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ExitStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.FetchStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.FlushStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.FormatStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.FreeStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.GetStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.GoToStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.IfStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.IncludeDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.IterateStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LeaveStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LineDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LocateStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.NoPrintDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.NoteDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.NullStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OnStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PageDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PopDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PrintDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ProcessDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ProcincDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PushDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PutStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.QualifyStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReinitStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReleaseStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ResignalStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReturnStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.RevertStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.RewriteStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.SelectStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.SignalStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.SkipDirective); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.StopStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.WaitStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.WriteStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ProcedureStatement); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.Package); 
                }
            },
        ]);

        return element;
    });
    private createAllocateStatement(): ast.AllocateStatement {
        return {} as any;
    }

    AllocateStatement = this.RULE('AllocateStatement', () => {
        const element = this.createAllocateStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ALLOCATE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ALLOC); 
                }
            },
        ]);
        this.SUBRULE1(this.AllocatedVariable);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.AllocatedVariable);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createAllocatedVariable(): ast.AllocatedVariable {
        return {} as any;
    }

    AllocatedVariable = this.RULE('AllocatedVariable', () => {
        const element = this.createAllocatedVariable();

        this.OPTION1(() => {
            this.CONSUME1(tokens.NUMBER);
        });
        this.SUBRULE1(this.ReferenceItem);
        this.OPTION2(() => {
            this.SUBRULE1(this.AllocateAttribute);
        });

        return element;
    });
    private createAllocateAttribute(): ast.AllocateAttribute {
        return {} as any;
    }

    AllocateAttribute = this.RULE('AllocateAttribute', () => {
        const element = this.createAllocateAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.AllocateDimension); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AllocateType); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AllocateLocationReferenceIn); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.AllocateLocationReferenceSet); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttribute); 
                }
            },
        ]);

        return element;
    });
    private createAllocateLocationReferenceIn(): ast.AllocateLocationReferenceIn {
        return {} as any;
    }

    AllocateLocationReferenceIn = this.RULE('AllocateLocationReferenceIn', () => {
        const element = this.createAllocateLocationReferenceIn();

        this.CONSUME1(tokens.IN);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createAllocateLocationReferenceSet(): ast.AllocateLocationReferenceSet {
        return {} as any;
    }

    AllocateLocationReferenceSet = this.RULE('AllocateLocationReferenceSet', () => {
        const element = this.createAllocateLocationReferenceSet();

        this.CONSUME1(tokens.SET);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createAllocateDimension(): ast.AllocateDimension {
        return {} as any;
    }

    AllocateDimension = this.RULE('AllocateDimension', () => {
        const element = this.createAllocateDimension();

        this.SUBRULE1(this.Dimensions);

        return element;
    });
    private createAllocateType(): ast.AllocateType {
        return {} as any;
    }

    AllocateType = this.RULE('AllocateType', () => {
        const element = this.createAllocateType();

        this.SUBRULE1(this.AllocateAttributeType);
        this.OPTION1(() => {
            this.SUBRULE1(this.Dimensions);
        });

        return element;
    });
    private createAllocateAttributeType(): ast.AllocateAttributeType {
        return {} as any;
    }

    AllocateAttributeType = this.RULE('AllocateAttributeType', () => {
        const element = this.createAllocateAttributeType();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.CHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CHARACTER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BIT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.GRAPHIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UCHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.WIDECHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AREA); 
                }
            },
        ]);

        return element;
    });
    private createAssertStatement(): ast.AssertStatement {
        return {} as any;
    }

    AssertStatement = this.RULE('AssertStatement', () => {
        const element = this.createAssertStatement();

        this.CONSUME1(tokens.ASSERT);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.TRUE);
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE1(this.Expression);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FALSE);
                    this.CONSUME2(tokens.OpenParen);
                    this.SUBRULE2(this.Expression);
                    this.CONSUME2(tokens.CloseParen);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.COMPARE);
                    this.CONSUME3(tokens.OpenParen);
                    this.SUBRULE3(this.Expression);
                    this.CONSUME1(tokens.Comma);
                    this.SUBRULE4(this.Expression);
                    this.OPTION1(() => {
                        this.CONSUME2(tokens.Comma);
                        this.CONSUME1(tokens.STRING_TERM);
                    });
                    this.CONSUME3(tokens.CloseParen);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNREACHABLE); 
                }
            },
        ]);
        this.OPTION2(() => {
            this.CONSUME1(tokens.TEXT);
            this.SUBRULE5(this.Expression);
        });

        return element;
    });
    private createAssignmentStatement(): ast.AssignmentStatement {
        return {} as any;
    }

    AssignmentStatement = this.RULE('AssignmentStatement', () => {
        const element = this.createAssignmentStatement();

        this.SUBRULE1(this.LocatorCall);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.LocatorCall);
        });
        this.SUBRULE1(this.AssignmentOperator);
        this.SUBRULE1(this.Expression);
        this.OPTION1(() => {
            this.CONSUME2(tokens.Comma);
            this.CONSUME1(tokens.BY);
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.NAME); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.DIMACROSS);
                        this.SUBRULE2(this.Expression);
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createAssignmentOperator(): ast.AssignmentOperator {
        return {} as any;
    }

    AssignmentOperator = this.RULE('AssignmentOperator', () => {
        const element = this.createAssignmentOperator();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Equals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PlusEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.MinusEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.StarEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SlashEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PipeEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AmpersandEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PipePipeEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.StarStarEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NotEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CaretEquals); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.LessThanGreaterThan); 
                }
            },
        ]);

        return element;
    });
    private createAttachStatement(): ast.AttachStatement {
        return {} as any;
    }

    AttachStatement = this.RULE('AttachStatement', () => {
        const element = this.createAttachStatement();

        this.CONSUME1(tokens.ATTACH);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.THREAD);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE2(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);
        this.OPTION2(() => {
            this.CONSUME1(tokens.ENVIRONMENT);
            this.CONSUME2(tokens.OpenParen);
            this.OPTION1(() => {
                this.CONSUME1(tokens.TSTACK);
                this.CONSUME3(tokens.OpenParen);
                this.SUBRULE1(this.Expression);
                this.CONSUME2(tokens.CloseParen);
            });
            this.CONSUME3(tokens.CloseParen);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createBeginStatement(): ast.BeginStatement {
        return {} as any;
    }

    BeginStatement = this.RULE('BeginStatement', () => {
        const element = this.createBeginStatement();

        this.CONSUME1(tokens.BEGIN);
        this.OPTION1(() => {
            this.SUBRULE1(this.Options);
        });
        this.OPTION2(() => {
            this.CONSUME1(tokens.RECURSIVE);
        });
        this.OPTION3(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.ORDER); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.REORDER); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);
        this.MANY1(() => {
            this.SUBRULE1(this.Statement);
        });
        this.SUBRULE1(this.EndStatement);
        this.CONSUME2(tokens.Semicolon);

        return element;
    });
    private createEndStatement(): ast.EndStatement {
        return {} as any;
    }

    EndStatement = this.RULE('EndStatement', () => {
        const element = this.createEndStatement();

        this.MANY1(() => {
            this.SUBRULE1(this.LabelPrefix);
        });
        this.CONSUME1(tokens.END);
        this.OPTION1(() => {
            this.SUBRULE1(this.LabelReference);
        });

        return element;
    });
    private createCallStatement(): ast.CallStatement {
        return {} as any;
    }

    CallStatement = this.RULE('CallStatement', () => {
        const element = this.createCallStatement();

        this.CONSUME1(tokens.CALL);
        this.SUBRULE1(this.ProcedureCall);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createCancelThreadStatement(): ast.CancelThreadStatement {
        return {} as any;
    }

    CancelThreadStatement = this.RULE('CancelThreadStatement', () => {
        const element = this.createCancelThreadStatement();

        this.CONSUME1(tokens.CANCEL);
        this.CONSUME1(tokens.THREAD);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createCloseStatement(): ast.CloseStatement {
        return {} as any;
    }

    CloseStatement = this.RULE('CloseStatement', () => {
        const element = this.createCloseStatement();

        this.CONSUME1(tokens.CLOSE);
        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.MemberCall); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);
        this.MANY1(() => {
            this.OPTION1(() => {
                this.CONSUME1(tokens.Comma);
            });
            this.CONSUME2(tokens.FILE);
            this.CONSUME2(tokens.OpenParen);
            this.OR2([
                {
                    ALT: () => {
                        this.SUBRULE2(this.MemberCall); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME2(tokens.Star); 
                    }
                },
            ]);
            this.CONSUME2(tokens.CloseParen);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDefaultStatement(): ast.DefaultStatement {
        return {} as any;
    }

    DefaultStatement = this.RULE('DefaultStatement', () => {
        const element = this.createDefaultStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEFAULT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DFT); 
                }
            },
        ]);
        this.SUBRULE1(this.DefaultExpression);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.DefaultExpression);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDefaultExpression(): ast.DefaultExpression {
        return {} as any;
    }

    DefaultExpression = this.RULE('DefaultExpression', () => {
        const element = this.createDefaultExpression();

        this.SUBRULE1(this.DefaultExpressionPart);
        this.MANY1(() => {
            this.SUBRULE1(this.DefaultDeclarationAttribute);
        });

        return element;
    });
    private createDefaultExpressionPart(): ast.DefaultExpressionPart {
        return {} as any;
    }

    DefaultExpressionPart = this.RULE('DefaultExpressionPart', () => {
        const element = this.createDefaultExpressionPart();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DESCRIPTORS);
                    this.SUBRULE1(this.DefaultAttributeExpression);
                }
            },
            {
                ALT: () => {
                    this.OR2([
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.RANGE);
                                this.CONSUME1(tokens.OpenParen);
                                this.SUBRULE1(this.DefaultRangeIdentifiers);
                                this.CONSUME1(tokens.CloseParen);
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME2(tokens.OpenParen);
                                this.SUBRULE2(this.DefaultAttributeExpression);
                                this.CONSUME2(tokens.CloseParen);
                            }
                        },
                    ]);
                }
            },
        ]);

        return element;
    });
    private createDefaultRangeIdentifiers(): ast.DefaultRangeIdentifiers {
        return {} as any;
    }

    DefaultRangeIdentifiers = this.RULE('DefaultRangeIdentifiers', () => {
        const element = this.createDefaultRangeIdentifiers();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefaultRangeIdentifierItem); 
                }
            },
        ]);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.OR2([
                {
                    ALT: () => {
                        this.CONSUME2(tokens.Star); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE2(this.DefaultRangeIdentifierItem); 
                    }
                },
            ]);
        });

        return element;
    });
    private createDefaultRangeIdentifierItem(): ast.DefaultRangeIdentifierItem {
        return {} as any;
    }

    DefaultRangeIdentifierItem = this.RULE('DefaultRangeIdentifierItem', () => {
        const element = this.createDefaultRangeIdentifierItem();

        this.CONSUME1(tokens.ID);
        this.OPTION1(() => {
            this.CONSUME1(tokens.Colon);
            this.CONSUME2(tokens.ID);
        });

        return element;
    });
    private createDefaultAttributeExpression(): ast.DefaultAttributeExpression {
        return {} as any;
    }

    DefaultAttributeExpression = this.RULE('DefaultAttributeExpression', () => {
        const element = this.createDefaultAttributeExpression();

        this.SUBRULE1(this.DefaultAttributeExpressionNot);
        this.OPTION1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.AND); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.OR); 
                    }
                },
            ]);
            this.SUBRULE2(this.DefaultAttributeExpressionNot);
        });

        return element;
    });
    private createDefaultAttributeExpressionNot(): ast.DefaultAttributeExpressionNot {
        return {} as any;
    }

    DefaultAttributeExpressionNot = this.RULE('DefaultAttributeExpressionNot', () => {
        const element = this.createDefaultAttributeExpressionNot();

        this.OPTION1(() => {
            this.CONSUME1(tokens.NOT);
        });
        this.SUBRULE1(this.DefaultAttribute);

        return element;
    });
    private createDefaultAttribute(): ast.DefaultAttribute {
        return {} as any;
    }

    DefaultAttribute = this.RULE('DefaultAttribute', () => {
        const element = this.createDefaultAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ABNORMAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ALIGNED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AREA); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ASSIGNABLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AUTOMATIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BACKWARDS); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BASED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BIT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BUFFERED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BUILTIN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BYADDR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BYVALUE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BIN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BINARY); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CHARACTER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.COMPLEX); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CONDITION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CONNECTED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CONSTANT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CONTROLLED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CTL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DECIMAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DIMACROSS); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.EVENT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.EXCLUSIVE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.EXTERNAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.EXT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FILE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FIXED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FLOAT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FORMAT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.GENERIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.GRAPHIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.HEX); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.HEXADEC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.IEEE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INONLY); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INOUT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INTERNAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.IRREDUCIBLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INPUT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.KEYED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.LABEL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.LIST); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.MEMBER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NATIVE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NONASSIGNABLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NONASGN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NONCONNECTED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NONNATIVE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NONVARYING); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NORMAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OFFSET); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OPTIONAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OPTIONS); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OUTONLY); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OUTPUT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PARAMETER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.POINTER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PTR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.POSITION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PRECISION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PREC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PRINT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RANGE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.REAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RECORD); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RESERVED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SEQUENTIAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SIGNED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STATIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STREAM); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STRUCTURE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.TASK); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.TRANSIENT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNAL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UCHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNALIGNED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNBUFFERED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNSIGNED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UPDATE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARIABLE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARYING); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARYING4); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARYINGZ); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARZ); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.WIDECHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.BIGENDIAN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.LITTLEENDIAN); 
                }
            },
        ]);

        return element;
    });
    private createDefineAliasStatement(): ast.DefineAliasStatement {
        return {} as any;
    }

    DefineAliasStatement = this.RULE('DefineAliasStatement', () => {
        const element = this.createDefineAliasStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEFINE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XDEFINE); 
                }
            },
        ]);
        this.CONSUME1(tokens.ALIAS);
        this.CONSUME1(tokens.ID);
        this.OPTION2(() => {
            this.SUBRULE1(this.DeclarationAttribute);
            this.MANY1(() => {
                this.OPTION1(() => {
                    this.CONSUME1(tokens.Comma);
                });
                this.SUBRULE2(this.DeclarationAttribute);
            });
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDefineOrdinalStatement(): ast.DefineOrdinalStatement {
        return {} as any;
    }

    DefineOrdinalStatement = this.RULE('DefineOrdinalStatement', () => {
        const element = this.createDefineOrdinalStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEFINE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XDEFINE); 
                }
            },
        ]);
        this.CONSUME1(tokens.ORDINAL);
        this.SUBRULE1(this.FQN);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.OrdinalValueList);
        this.CONSUME1(tokens.CloseParen);
        this.OPTION1(() => {
            this.OR2([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.SIGNED); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.UNSIGNED); 
                    }
                },
            ]);
        });
        this.OPTION2(() => {
            this.OR3([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.PRECISION); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.PREC); 
                    }
                },
            ]);
            this.CONSUME2(tokens.OpenParen);
            this.CONSUME1(tokens.NUMBER);
            this.CONSUME2(tokens.CloseParen);
        });
        this.OPTION3(() => {
            this.OR4([
                {
                    ALT: () => {
                        this.CONSUME2(tokens.SIGNED); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME2(tokens.UNSIGNED); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createOrdinalValueList(): ast.OrdinalValueList {
        return {} as any;
    }

    OrdinalValueList = this.RULE('OrdinalValueList', () => {
        const element = this.createOrdinalValueList();

        this.SUBRULE1(this.OrdinalValue);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.OrdinalValue);
        });

        return element;
    });
    private createOrdinalValue(): ast.OrdinalValue {
        return {} as any;
    }

    OrdinalValue = this.RULE('OrdinalValue', () => {
        const element = this.createOrdinalValue();

        this.CONSUME1(tokens.ID);
        this.OPTION1(() => {
            this.CONSUME1(tokens.VALUE);
            this.CONSUME1(tokens.OpenParen);
            this.CONSUME1(tokens.NUMBER);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createDefineStructureStatement(): ast.DefineStructureStatement {
        return {} as any;
    }

    DefineStructureStatement = this.RULE('DefineStructureStatement', () => {
        const element = this.createDefineStructureStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEFINE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XDEFINE); 
                }
            },
        ]);
        this.OR2([
            {
                ALT: () => {
                    this.CONSUME1(tokens.STRUCTURE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STRUCT); 
                }
            },
        ]);
        this.CONSUME1(tokens.NUMBER);
        this.SUBRULE1(this.FQN);
        this.OPTION1(() => {
            this.CONSUME1(tokens.UNION);
        });
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE1(this.SubStructure);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createSubStructure(): ast.SubStructure {
        return {} as any;
    }

    SubStructure = this.RULE('SubStructure', () => {
        const element = this.createSubStructure();

        this.CONSUME1(tokens.NUMBER);
        this.CONSUME1(tokens.ID);
        this.MANY1(() => {
            this.SUBRULE1(this.DeclarationAttribute);
        });

        return element;
    });
    private createDelayStatement(): ast.DelayStatement {
        return {} as any;
    }

    DelayStatement = this.RULE('DelayStatement', () => {
        const element = this.createDelayStatement();

        this.CONSUME1(tokens.DELAY);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDeleteStatement(): ast.DeleteStatement {
        return {} as any;
    }

    DeleteStatement = this.RULE('DeleteStatement', () => {
        const element = this.createDeleteStatement();

        this.CONSUME1(tokens.DELETE);
        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);
        this.OPTION1(() => {
            this.CONSUME1(tokens.KEY);
            this.CONSUME2(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME2(tokens.CloseParen);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDetachStatement(): ast.DetachStatement {
        return {} as any;
    }

    DetachStatement = this.RULE('DetachStatement', () => {
        const element = this.createDetachStatement();

        this.CONSUME1(tokens.DETACH);
        this.CONSUME1(tokens.THREAD);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDisplayStatement(): ast.DisplayStatement {
        return {} as any;
    }

    DisplayStatement = this.RULE('DisplayStatement', () => {
        const element = this.createDisplayStatement();

        this.CONSUME1(tokens.DISPLAY);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);
        this.OPTION1(() => {
            this.CONSUME1(tokens.REPLY);
            this.CONSUME2(tokens.OpenParen);
            this.SUBRULE1(this.LocatorCall);
            this.CONSUME2(tokens.CloseParen);
        });
        this.OPTION3(() => {
            this.CONSUME1(tokens.ROUTCDE);
            this.CONSUME3(tokens.OpenParen);
            this.CONSUME1(tokens.NUMBER);
            this.MANY1(() => {
                this.CONSUME1(tokens.Comma);
                this.CONSUME2(tokens.NUMBER);
            });
            this.CONSUME3(tokens.CloseParen);
            this.OPTION2(() => {
                this.CONSUME1(tokens.DESC);
                this.CONSUME4(tokens.OpenParen);
                this.CONSUME3(tokens.NUMBER);
                this.MANY2(() => {
                    this.CONSUME2(tokens.Comma);
                    this.CONSUME4(tokens.NUMBER);
                });
                this.CONSUME4(tokens.CloseParen);
            });
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDoStatement(): ast.DoStatement {
        return {} as any;
    }

    DoStatement = this.RULE('DoStatement', () => {
        const element = this.createDoStatement();

        this.CONSUME1(tokens.DO);
        this.OPTION1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE1(this.DoType2); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.DoType3); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);
        this.MANY1(() => {
            this.SUBRULE1(this.Statement);
        });
        this.SUBRULE1(this.EndStatement);
        this.CONSUME2(tokens.Semicolon);

        return element;
    });
    private createDoType2(): ast.DoType2 {
        return {} as any;
    }

    DoType2 = this.RULE('DoType2', () => {
        const element = this.createDoType2();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.DoWhile); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DoUntil); 
                }
            },
        ]);

        return element;
    });
    private createDoWhile(): ast.DoWhile {
        return {} as any;
    }

    DoWhile = this.RULE('DoWhile', () => {
        const element = this.createDoWhile();

        this.CONSUME1(tokens.WHILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);
        this.OPTION1(() => {
            this.CONSUME1(tokens.UNTIL);
            this.CONSUME2(tokens.OpenParen);
            this.SUBRULE2(this.Expression);
            this.CONSUME2(tokens.CloseParen);
        });

        return element;
    });
    private createDoUntil(): ast.DoUntil {
        return {} as any;
    }

    DoUntil = this.RULE('DoUntil', () => {
        const element = this.createDoUntil();

        this.CONSUME1(tokens.UNTIL);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);
        this.OPTION1(() => {
            this.CONSUME1(tokens.WHILE);
            this.CONSUME2(tokens.OpenParen);
            this.SUBRULE2(this.Expression);
            this.CONSUME2(tokens.CloseParen);
        });

        return element;
    });
    private createDoType3(): ast.DoType3 {
        return {} as any;
    }

    DoType3 = this.RULE('DoType3', () => {
        const element = this.createDoType3();

        this.SUBRULE1(this.DoType3Variable);
        this.CONSUME1(tokens.Equals);
        this.SUBRULE1(this.DoSpecification);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.DoSpecification);
        });

        return element;
    });
    private createDoType3Variable(): ast.DoType3Variable {
        return {} as any;
    }

    DoType3Variable = this.RULE('DoType3Variable', () => {
        const element = this.createDoType3Variable();

        this.CONSUME1(tokens.ID);

        return element;
    });
    private createDoSpecification(): ast.DoSpecification {
        return {} as any;
    }

    DoSpecification = this.RULE('DoSpecification', () => {
        const element = this.createDoSpecification();

        this.SUBRULE1(this.Expression);
        this.OPTION3(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.TO);
                        this.SUBRULE2(this.Expression);
                        this.OPTION1(() => {
                            this.CONSUME1(tokens.BY);
                            this.SUBRULE3(this.Expression);
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME2(tokens.BY);
                        this.SUBRULE4(this.Expression);
                        this.OPTION2(() => {
                            this.CONSUME2(tokens.TO);
                            this.SUBRULE5(this.Expression);
                        });
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.UPTHRU);
                        this.SUBRULE6(this.Expression);
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.DOWNTHRU);
                        this.SUBRULE7(this.Expression);
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.REPEAT);
                        this.SUBRULE8(this.Expression);
                    }
                },
            ]);
        });
        this.OPTION4(() => {
            this.OR2([
                {
                    ALT: () => {
                        this.SUBRULE1(this.DoWhile); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.DoUntil); 
                    }
                },
            ]);
        });

        return element;
    });
    private createExecStatement(): ast.ExecStatement {
        return {} as any;
    }

    ExecStatement = this.RULE('ExecStatement', () => {
        const element = this.createExecStatement();

        this.CONSUME1(tokens.EXEC);
        this.CONSUME1(tokens.ExecFragment);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createExitStatement(): ast.ExitStatement {
        return {} as any;
    }

    ExitStatement = this.RULE('ExitStatement', () => {
        const element = this.createExitStatement();

        /* Action: ExitStatement */
        this.CONSUME1(tokens.EXIT);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createFetchStatement(): ast.FetchStatement {
        return {} as any;
    }

    FetchStatement = this.RULE('FetchStatement', () => {
        const element = this.createFetchStatement();

        this.CONSUME1(tokens.FETCH);
        this.SUBRULE1(this.FetchEntry);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.FetchEntry);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createFetchEntry(): ast.FetchEntry {
        return {} as any;
    }

    FetchEntry = this.RULE('FetchEntry', () => {
        const element = this.createFetchEntry();

        this.CONSUME1(tokens.ID);
        this.OPTION1(() => {
            this.CONSUME1(tokens.SET);
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.LocatorCall);
            this.CONSUME1(tokens.CloseParen);
        });
        this.OPTION2(() => {
            this.CONSUME1(tokens.TITLE);
            this.CONSUME2(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME2(tokens.CloseParen);
        });

        return element;
    });
    private createFlushStatement(): ast.FlushStatement {
        return {} as any;
    }

    FlushStatement = this.RULE('FlushStatement', () => {
        const element = this.createFlushStatement();

        this.CONSUME1(tokens.FLUSH);
        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.LocatorCall); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createFormatStatement(): ast.FormatStatement {
        return {} as any;
    }

    FormatStatement = this.RULE('FormatStatement', () => {
        const element = this.createFormatStatement();

        this.CONSUME1(tokens.FORMAT);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.FormatList);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createFormatList(): ast.FormatList {
        return {} as any;
    }

    FormatList = this.RULE('FormatList', () => {
        const element = this.createFormatList();

        this.SUBRULE1(this.FormatListItem);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.FormatListItem);
        });

        return element;
    });
    private createFormatListItem(): ast.FormatListItem {
        return {} as any;
    }

    FormatListItem = this.RULE('FormatListItem', () => {
        const element = this.createFormatListItem();

        this.OPTION1(() => {
            this.SUBRULE1(this.FormatListItemLevel);
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.FormatItem); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE1(this.FormatList);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);

        return element;
    });
    private createFormatListItemLevel(): ast.FormatListItemLevel {
        return {} as any;
    }

    FormatListItemLevel = this.RULE('FormatListItemLevel', () => {
        const element = this.createFormatListItemLevel();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.NUMBER); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE1(this.Expression);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);

        return element;
    });
    private createFormatItem(): ast.FormatItem {
        return {} as any;
    }

    FormatItem = this.RULE('FormatItem', () => {
        const element = this.createFormatItem();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.AFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.BFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.CFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.FFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ColumnFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.GFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LineFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PageFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.RFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.SkipFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.VFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.XFormatItem); 
                }
            },
        ]);

        return element;
    });
    private createAFormatItem(): ast.AFormatItem {
        return {} as any;
    }

    AFormatItem = this.RULE('AFormatItem', () => {
        const element = this.createAFormatItem();

        this.CONSUME1(tokens.A);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createBFormatItem(): ast.BFormatItem {
        return {} as any;
    }

    BFormatItem = this.RULE('BFormatItem', () => {
        const element = this.createBFormatItem();

        this.CONSUME1(tokens.B);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createCFormatItem(): ast.CFormatItem {
        return {} as any;
    }

    CFormatItem = this.RULE('CFormatItem', () => {
        const element = this.createCFormatItem();

        this.CONSUME1(tokens.C);
        this.CONSUME1(tokens.OpenParen);
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.FFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EFormatItem); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PFormatItem); 
                }
            },
        ]);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createFFormatItem(): ast.FFormatItem {
        return {} as any;
    }

    FFormatItem = this.RULE('FFormatItem', () => {
        const element = this.createFFormatItem();

        this.CONSUME1(tokens.F);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.OPTION2(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Expression);
            this.OPTION1(() => {
                this.CONSUME2(tokens.Comma);
                this.SUBRULE3(this.Expression);
            });
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createEFormatItem(): ast.EFormatItem {
        return {} as any;
    }

    EFormatItem = this.RULE('EFormatItem', () => {
        const element = this.createEFormatItem();

        this.CONSUME1(tokens.E);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.Comma);
        this.SUBRULE2(this.Expression);
        this.OPTION1(() => {
            this.CONSUME2(tokens.Comma);
            this.SUBRULE3(this.Expression);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createPFormatItem(): ast.PFormatItem {
        return {} as any;
    }

    PFormatItem = this.RULE('PFormatItem', () => {
        const element = this.createPFormatItem();

        this.CONSUME1(tokens.P);
        this.CONSUME1(tokens.STRING_TERM);

        return element;
    });
    private createColumnFormatItem(): ast.ColumnFormatItem {
        return {} as any;
    }

    ColumnFormatItem = this.RULE('ColumnFormatItem', () => {
        const element = this.createColumnFormatItem();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.COLUMN); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.COL); 
                }
            },
        ]);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createGFormatItem(): ast.GFormatItem {
        return {} as any;
    }

    GFormatItem = this.RULE('GFormatItem', () => {
        const element = this.createGFormatItem();

        this.CONSUME1(tokens.G);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createLFormatItem(): ast.LFormatItem {
        return {} as any;
    }

    LFormatItem = this.RULE('LFormatItem', () => {
        const element = this.createLFormatItem();

        /* Action: LFormatItem */
        this.CONSUME1(tokens.L);

        return element;
    });
    private createLineFormatItem(): ast.LineFormatItem {
        return {} as any;
    }

    LineFormatItem = this.RULE('LineFormatItem', () => {
        const element = this.createLineFormatItem();

        this.CONSUME1(tokens.LINE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createPageFormatItem(): ast.PageFormatItem {
        return {} as any;
    }

    PageFormatItem = this.RULE('PageFormatItem', () => {
        const element = this.createPageFormatItem();

        /* Action: PageFormatItem */
        this.CONSUME1(tokens.PAGE);

        return element;
    });
    private createRFormatItem(): ast.RFormatItem {
        return {} as any;
    }

    RFormatItem = this.RULE('RFormatItem', () => {
        const element = this.createRFormatItem();

        this.CONSUME1(tokens.R);
        this.CONSUME1(tokens.OpenParen);
        this.CONSUME1(tokens.ID);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createSkipFormatItem(): ast.SkipFormatItem {
        return {} as any;
    }

    SkipFormatItem = this.RULE('SkipFormatItem', () => {
        const element = this.createSkipFormatItem();

        this.CONSUME1(tokens.SKIP);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createVFormatItem(): ast.VFormatItem {
        return {} as any;
    }

    VFormatItem = this.RULE('VFormatItem', () => {
        const element = this.createVFormatItem();

        /* Action: VFormatItem */
        this.CONSUME1(tokens.V);

        return element;
    });
    private createXFormatItem(): ast.XFormatItem {
        return {} as any;
    }

    XFormatItem = this.RULE('XFormatItem', () => {
        const element = this.createXFormatItem();

        this.CONSUME1(tokens.X);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createFreeStatement(): ast.FreeStatement {
        return {} as any;
    }

    FreeStatement = this.RULE('FreeStatement', () => {
        const element = this.createFreeStatement();

        this.CONSUME1(tokens.FREE);
        this.SUBRULE1(this.LocatorCall);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.LocatorCall);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createGetStatement(): ast.GetStatement {
        return {} as any;
    }

    GetStatement = this.RULE('GetStatement', () => {
        const element = this.createGetStatement();

        this.CONSUME1(tokens.GET);
        this.OR1([
            {
                ALT: () => {
                    /* Action: GetFileStatement */
                    this.AT_LEAST_ONE1(() => {
                        this.OR2([
                            {
                                ALT: () => {
                                    this.SUBRULE1(this.GetFile); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.SUBRULE1(this.GetCopy); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.SUBRULE1(this.GetSkip); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.SUBRULE1(this.DataSpecificationOptions); 
                                }
                            },
                        ]);
                    });
                }
            },
            {
                ALT: () => {
                    /* Action: GetStringStatement */
                    this.CONSUME1(tokens.STRING);
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE1(this.Expression);
                    this.CONSUME1(tokens.CloseParen);
                    this.SUBRULE2(this.DataSpecificationOptions);
                }
            },
        ]);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createGetFile(): ast.GetFile {
        return {} as any;
    }

    GetFile = this.RULE('GetFile', () => {
        const element = this.createGetFile();

        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createGetCopy(): ast.GetCopy {
        return {} as any;
    }

    GetCopy = this.RULE('GetCopy', () => {
        const element = this.createGetCopy();

        this.CONSUME1(tokens.COPY);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.CONSUME1(tokens.ID);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createGetSkip(): ast.GetSkip {
        return {} as any;
    }

    GetSkip = this.RULE('GetSkip', () => {
        const element = this.createGetSkip();

        this.CONSUME1(tokens.SKIP);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createGoToStatement(): ast.GoToStatement {
        return {} as any;
    }

    GoToStatement = this.RULE('GoToStatement', () => {
        const element = this.createGoToStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.GO);
                    this.CONSUME1(tokens.TO);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.GOTO); 
                }
            },
        ]);
        this.SUBRULE1(this.LabelReference);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createIfStatement(): ast.IfStatement {
        return {} as any;
    }

    IfStatement = this.RULE('IfStatement', () => {
        const element = this.createIfStatement();

        this.CONSUME1(tokens.IF);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.THEN);
        this.SUBRULE1(this.Statement);
        this.OPTION1(() => {
            this.CONSUME1(tokens.ELSE);
            this.SUBRULE2(this.Statement);
        });

        return element;
    });
    private createIncludeDirective(): ast.IncludeDirective {
        return {} as any;
    }

    IncludeDirective = this.RULE('IncludeDirective', () => {
        const element = this.createIncludeDirective();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.PercentINCLUDE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PercentXINCLUDE); 
                }
            },
        ]);
        this.SUBRULE1(this.IncludeItem);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.IncludeItem);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createIncludeItem(): ast.IncludeItem {
        return {} as any;
    }

    IncludeItem = this.RULE('IncludeItem', () => {
        const element = this.createIncludeItem();

        this.OR1([
            {
                ALT: () => {
                    this.OR2([
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.STRING_TERM); 
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.ID); 
                            }
                        },
                    ]);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ddname);
                    this.CONSUME1(tokens.OpenParen);
                    this.OR3([
                        {
                            ALT: () => {
                                this.CONSUME2(tokens.STRING_TERM); 
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME2(tokens.ID); 
                            }
                        },
                    ]);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);

        return element;
    });
    private createIterateStatement(): ast.IterateStatement {
        return {} as any;
    }

    IterateStatement = this.RULE('IterateStatement', () => {
        const element = this.createIterateStatement();

        this.CONSUME1(tokens.ITERATE);
        this.OPTION1(() => {
            this.SUBRULE1(this.LabelReference);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createLeaveStatement(): ast.LeaveStatement {
        return {} as any;
    }

    LeaveStatement = this.RULE('LeaveStatement', () => {
        const element = this.createLeaveStatement();

        this.CONSUME1(tokens.LEAVE);
        this.OPTION1(() => {
            this.SUBRULE1(this.LabelReference);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createLineDirective(): ast.LineDirective {
        return {} as any;
    }

    LineDirective = this.RULE('LineDirective', () => {
        const element = this.createLineDirective();

        this.CONSUME1(tokens.PercentLINE);
        this.CONSUME1(tokens.OpenParen);
        this.CONSUME1(tokens.NUMBER);
        this.CONSUME1(tokens.Comma);
        this.CONSUME1(tokens.STRING_TERM);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createLocateStatement(): ast.LocateStatement {
        return {} as any;
    }

    LocateStatement = this.RULE('LocateStatement', () => {
        const element = this.createLocateStatement();

        this.CONSUME1(tokens.LOCATE);
        this.SUBRULE1(this.LocatorCall);
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE1(this.LocateStatementFile); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.LocateStatementSet); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.LocateStatementKeyFrom); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createLocateStatementFile(): ast.LocateStatementFile {
        return {} as any;
    }

    LocateStatementFile = this.RULE('LocateStatementFile', () => {
        const element = this.createLocateStatementFile();

        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.ReferenceItem);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createLocateStatementSet(): ast.LocateStatementSet {
        return {} as any;
    }

    LocateStatementSet = this.RULE('LocateStatementSet', () => {
        const element = this.createLocateStatementSet();

        this.CONSUME1(tokens.SET);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createLocateStatementKeyFrom(): ast.LocateStatementKeyFrom {
        return {} as any;
    }

    LocateStatementKeyFrom = this.RULE('LocateStatementKeyFrom', () => {
        const element = this.createLocateStatementKeyFrom();

        this.CONSUME1(tokens.KEYFROM);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createNoPrintDirective(): ast.NoPrintDirective {
        return {} as any;
    }

    NoPrintDirective = this.RULE('NoPrintDirective', () => {
        const element = this.createNoPrintDirective();

        /* Action: NoPrintDirective */
        this.CONSUME1(tokens.PercentNOPRINT);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createNoteDirective(): ast.NoteDirective {
        return {} as any;
    }

    NoteDirective = this.RULE('NoteDirective', () => {
        const element = this.createNoteDirective();

        this.CONSUME1(tokens.PercentNOTE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.OPTION1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Expression);
        });
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createNullStatement(): ast.NullStatement {
        return {} as any;
    }

    NullStatement = this.RULE('NullStatement', () => {
        const element = this.createNullStatement();

        /* Action: NullStatement */
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createOnStatement(): ast.OnStatement {
        return {} as any;
    }

    OnStatement = this.RULE('OnStatement', () => {
        const element = this.createOnStatement();

        this.CONSUME1(tokens.ON);
        this.SUBRULE1(this.Condition);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Condition);
        });
        this.OPTION1(() => {
            this.CONSUME1(tokens.SNAP);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.SYSTEM);
                    this.CONSUME1(tokens.Semicolon);
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.Statement); 
                }
            },
        ]);

        return element;
    });
    private createCondition(): ast.Condition {
        return {} as any;
    }

    Condition = this.RULE('Condition', () => {
        const element = this.createCondition();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.KeywordCondition); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.NamedCondition); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.FileReferenceCondition); 
                }
            },
        ]);

        return element;
    });
    private createKeywordCondition(): ast.KeywordCondition {
        return {} as any;
    }

    KeywordCondition = this.RULE('KeywordCondition', () => {
        const element = this.createKeywordCondition();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ANYCONDITION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ANYCOND); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.AREA); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ASSERTION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ATTENTION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CONFORMANCE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.CONVERSION); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ERROR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FINISH); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FIXEDOVERFLOW); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FOFL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INVALIDOP); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OVERFLOW); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OFL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SIZE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STORAGE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STRINGRANGE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.STRINGSIZE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SUBSCRIPTRANGE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNDERFLOW); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UFL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ZERODIVIDE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ZDIV); 
                }
            },
        ]);

        return element;
    });
    private createNamedCondition(): ast.NamedCondition {
        return {} as any;
    }

    NamedCondition = this.RULE('NamedCondition', () => {
        const element = this.createNamedCondition();

        this.CONSUME1(tokens.CONDITION);
        this.CONSUME1(tokens.OpenParen);
        this.CONSUME1(tokens.ID);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createFileReferenceCondition(): ast.FileReferenceCondition {
        return {} as any;
    }

    FileReferenceCondition = this.RULE('FileReferenceCondition', () => {
        const element = this.createFileReferenceCondition();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ENDFILE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ENDPAGE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.KEY); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NAME); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RECORD); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.TRANSMIT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNDEFINEDFILE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UNDF); 
                }
            },
        ]);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.ReferenceItem);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createOpenStatement(): ast.OpenStatement {
        return {} as any;
    }

    OpenStatement = this.RULE('OpenStatement', () => {
        const element = this.createOpenStatement();

        this.CONSUME1(tokens.OPEN);
        this.SUBRULE1(this.OpenOptionsGroup);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.OpenOptionsGroup);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createOpenOptionsGroup(): ast.OpenOptionsGroup {
        return {} as any;
    }

    OpenOptionsGroup = this.RULE('OpenOptionsGroup', () => {
        const element = this.createOpenOptionsGroup();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsFile); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsStream); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsAccess); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsBuffering); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsKeyed); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsPrint); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsTitle); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsLineSize); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OpenOptionsPageSize); 
                }
            },
        ]);

        return element;
    });
    private createOpenOptionsFile(): ast.OpenOptionsFile {
        return {} as any;
    }

    OpenOptionsFile = this.RULE('OpenOptionsFile', () => {
        const element = this.createOpenOptionsFile();

        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.ReferenceItem);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createOpenOptionsStream(): ast.OpenOptionsStream {
        return {} as any;
    }

    OpenOptionsStream = this.RULE('OpenOptionsStream', () => {
        const element = this.createOpenOptionsStream();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.STREAM); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.RECORD); 
                }
            },
        ]);

        return element;
    });
    private createOpenOptionsAccess(): ast.OpenOptionsAccess {
        return {} as any;
    }

    OpenOptionsAccess = this.RULE('OpenOptionsAccess', () => {
        const element = this.createOpenOptionsAccess();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.INPUT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OUTPUT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UPDATE); 
                }
            },
        ]);

        return element;
    });
    private createOpenOptionsBuffering(): ast.OpenOptionsBuffering {
        return {} as any;
    }

    OpenOptionsBuffering = this.RULE('OpenOptionsBuffering', () => {
        const element = this.createOpenOptionsBuffering();

        this.OR1([
            {
                ALT: () => {
                    this.OR2([
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.SEQUENTIAL); 
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.SEQL); 
                            }
                        },
                    ]);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DIRECT); 
                }
            },
        ]);
        this.OPTION1(() => {
            this.OR3([
                {
                    ALT: () => {
                        this.OR4([
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.UNBUFFERED); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.UNBUF); 
                                }
                            },
                        ]);
                    }
                },
                {
                    ALT: () => {
                        this.OR5([
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.BUF); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.BUFFERED); 
                                }
                            },
                        ]);
                    }
                },
            ]);
        });

        return element;
    });
    private createOpenOptionsKeyed(): ast.OpenOptionsKeyed {
        return {} as any;
    }

    OpenOptionsKeyed = this.RULE('OpenOptionsKeyed', () => {
        const element = this.createOpenOptionsKeyed();

        this.CONSUME1(tokens.KEYED);

        return element;
    });
    private createOpenOptionsPrint(): ast.OpenOptionsPrint {
        return {} as any;
    }

    OpenOptionsPrint = this.RULE('OpenOptionsPrint', () => {
        const element = this.createOpenOptionsPrint();

        this.CONSUME1(tokens.PRINT);

        return element;
    });
    private createOpenOptionsTitle(): ast.OpenOptionsTitle {
        return {} as any;
    }

    OpenOptionsTitle = this.RULE('OpenOptionsTitle', () => {
        const element = this.createOpenOptionsTitle();

        this.CONSUME1(tokens.TITLE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createOpenOptionsLineSize(): ast.OpenOptionsLineSize {
        return {} as any;
    }

    OpenOptionsLineSize = this.RULE('OpenOptionsLineSize', () => {
        const element = this.createOpenOptionsLineSize();

        this.CONSUME1(tokens.LINESIZE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createOpenOptionsPageSize(): ast.OpenOptionsPageSize {
        return {} as any;
    }

    OpenOptionsPageSize = this.RULE('OpenOptionsPageSize', () => {
        const element = this.createOpenOptionsPageSize();

        this.CONSUME1(tokens.PAGESIZE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createPageDirective(): ast.PageDirective {
        return {} as any;
    }

    PageDirective = this.RULE('PageDirective', () => {
        const element = this.createPageDirective();

        /* Action: PageDirective */
        this.CONSUME1(tokens.PercentPAGE);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createPopDirective(): ast.PopDirective {
        return {} as any;
    }

    PopDirective = this.RULE('PopDirective', () => {
        const element = this.createPopDirective();

        /* Action: PopDirective */
        this.CONSUME1(tokens.PercentPOP);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createPrintDirective(): ast.PrintDirective {
        return {} as any;
    }

    PrintDirective = this.RULE('PrintDirective', () => {
        const element = this.createPrintDirective();

        /* Action: PrintDirective */
        this.CONSUME1(tokens.PercentPRINT);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createProcessDirective(): ast.ProcessDirective {
        return {} as any;
    }

    ProcessDirective = this.RULE('ProcessDirective', () => {
        const element = this.createProcessDirective();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.StarPROCESS); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PercentPROCESS); 
                }
            },
        ]);
        this.OPTION1(() => {
            this.SUBRULE1(this.CompilerOptions);
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.CompilerOptions);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createCompilerOptions(): ast.CompilerOptions {
        return {} as any;
    }

    CompilerOptions = this.RULE('CompilerOptions', () => {
        const element = this.createCompilerOptions();

        this.CONSUME1(tokens.TODO);

        return element;
    });
    private createProcincDirective(): ast.ProcincDirective {
        return {} as any;
    }

    ProcincDirective = this.RULE('ProcincDirective', () => {
        const element = this.createProcincDirective();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.PercentPROCINC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.StarPROCINC); 
                }
            },
        ]);
        this.CONSUME1(tokens.ID);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createPushDirective(): ast.PushDirective {
        return {} as any;
    }

    PushDirective = this.RULE('PushDirective', () => {
        const element = this.createPushDirective();

        /* Action: PushDirective */
        this.CONSUME1(tokens.PercentPUSH);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createPutStatement(): ast.PutStatement {
        return {} as any;
    }

    PutStatement = this.RULE('PutStatement', () => {
        const element = this.createPutStatement();

        this.CONSUME1(tokens.PUT);
        this.OPTION1(() => {
            this.OR1([
                {
                    ALT: () => {
                        /* Action: PutFileStatement */
                        this.AT_LEAST_ONE1(() => {
                            this.OR2([
                                {
                                    ALT: () => {
                                        this.SUBRULE1(this.PutItem); 
                                    }
                                },
                                {
                                    ALT: () => {
                                        this.SUBRULE1(this.DataSpecificationOptions); 
                                    }
                                },
                            ]);
                        });
                    }
                },
                {
                    ALT: () => {
                        /* Action: PutStringStatement */
                        this.CONSUME1(tokens.STRING);
                        this.CONSUME1(tokens.OpenParen);
                        this.SUBRULE1(this.Expression);
                        this.CONSUME1(tokens.CloseParen);
                        this.SUBRULE2(this.DataSpecificationOptions);
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createPutItem(): ast.PutItem {
        return {} as any;
    }

    PutItem = this.RULE('PutItem', () => {
        const element = this.createPutItem();

        this.SUBRULE1(this.PutAttribute);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createPutAttribute(): ast.PutAttribute {
        return {} as any;
    }

    PutAttribute = this.RULE('PutAttribute', () => {
        const element = this.createPutAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.PAGE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.LINE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.SKIP); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.FILE); 
                }
            },
        ]);

        return element;
    });
    private createDataSpecificationOptions(): ast.DataSpecificationOptions {
        return {} as any;
    }

    DataSpecificationOptions = this.RULE('DataSpecificationOptions', () => {
        const element = this.createDataSpecificationOptions();

        this.OR1([
            {
                ALT: () => {
                    this.OPTION1(() => {
                        this.CONSUME1(tokens.LIST);
                    });
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE1(this.DataSpecificationDataList);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DATA);
                    this.OPTION2(() => {
                        this.CONSUME2(tokens.OpenParen);
                        this.SUBRULE1(this.DataSpecificationDataListItem);
                        this.MANY1(() => {
                            this.CONSUME1(tokens.Comma);
                            this.SUBRULE2(this.DataSpecificationDataListItem);
                        });
                        this.CONSUME2(tokens.CloseParen);
                    });
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.EDIT);
                    this.AT_LEAST_ONE1(() => {
                        this.CONSUME3(tokens.OpenParen);
                        this.SUBRULE2(this.DataSpecificationDataList);
                        this.CONSUME3(tokens.CloseParen);
                        this.CONSUME4(tokens.OpenParen);
                        this.SUBRULE1(this.FormatList);
                        this.CONSUME4(tokens.CloseParen);
                    });
                }
            },
        ]);

        return element;
    });
    private createDataSpecificationDataList(): ast.DataSpecificationDataList {
        return {} as any;
    }

    DataSpecificationDataList = this.RULE('DataSpecificationDataList', () => {
        const element = this.createDataSpecificationDataList();

        this.SUBRULE1(this.DataSpecificationDataListItem);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.DataSpecificationDataListItem);
        });

        return element;
    });
    private createDataSpecificationDataListItem(): ast.DataSpecificationDataListItem {
        return {} as any;
    }

    DataSpecificationDataListItem = this.RULE('DataSpecificationDataListItem', () => {
        const element = this.createDataSpecificationDataListItem();

        this.SUBRULE1(this.Expression);

        return element;
    });
    private createQualifyStatement(): ast.QualifyStatement {
        return {} as any;
    }

    QualifyStatement = this.RULE('QualifyStatement', () => {
        const element = this.createQualifyStatement();

        this.CONSUME1(tokens.QUALIFY);
        this.CONSUME1(tokens.Semicolon);
        this.MANY1(() => {
            this.SUBRULE1(this.Statement);
        });
        this.SUBRULE1(this.EndStatement);
        this.CONSUME2(tokens.Semicolon);

        return element;
    });
    private createReadStatement(): ast.ReadStatement {
        return {} as any;
    }

    ReadStatement = this.RULE('ReadStatement', () => {
        const element = this.createReadStatement();

        this.CONSUME1(tokens.READ);
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatementFile); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatementIgnore); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatementInto); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatementSet); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatementKey); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReadStatementKeyTo); 
                }
            },
        ]);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createReadStatementFile(): ast.ReadStatementFile {
        return {} as any;
    }

    ReadStatementFile = this.RULE('ReadStatementFile', () => {
        const element = this.createReadStatementFile();

        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReadStatementIgnore(): ast.ReadStatementIgnore {
        return {} as any;
    }

    ReadStatementIgnore = this.RULE('ReadStatementIgnore', () => {
        const element = this.createReadStatementIgnore();

        this.CONSUME1(tokens.IGNORE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReadStatementInto(): ast.ReadStatementInto {
        return {} as any;
    }

    ReadStatementInto = this.RULE('ReadStatementInto', () => {
        const element = this.createReadStatementInto();

        this.CONSUME1(tokens.INTO);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReadStatementSet(): ast.ReadStatementSet {
        return {} as any;
    }

    ReadStatementSet = this.RULE('ReadStatementSet', () => {
        const element = this.createReadStatementSet();

        this.CONSUME1(tokens.SET);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReadStatementKey(): ast.ReadStatementKey {
        return {} as any;
    }

    ReadStatementKey = this.RULE('ReadStatementKey', () => {
        const element = this.createReadStatementKey();

        this.CONSUME1(tokens.KEY);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReadStatementKeyTo(): ast.ReadStatementKeyTo {
        return {} as any;
    }

    ReadStatementKeyTo = this.RULE('ReadStatementKeyTo', () => {
        const element = this.createReadStatementKeyTo();

        this.CONSUME1(tokens.KEYTO);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createReinitStatement(): ast.ReinitStatement {
        return {} as any;
    }

    ReinitStatement = this.RULE('ReinitStatement', () => {
        const element = this.createReinitStatement();

        this.CONSUME1(tokens.REINIT);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createReleaseStatement(): ast.ReleaseStatement {
        return {} as any;
    }

    ReleaseStatement = this.RULE('ReleaseStatement', () => {
        const element = this.createReleaseStatement();

        this.CONSUME1(tokens.RELEASE);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ID);
                    this.MANY1(() => {
                        this.CONSUME1(tokens.Comma);
                        this.CONSUME2(tokens.ID);
                    });
                }
            },
        ]);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createResignalStatement(): ast.ResignalStatement {
        return {} as any;
    }

    ResignalStatement = this.RULE('ResignalStatement', () => {
        const element = this.createResignalStatement();

        /* Action: ResignalStatement */
        this.CONSUME1(tokens.RESIGNAL);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createReturnStatement(): ast.ReturnStatement {
        return {} as any;
    }

    ReturnStatement = this.RULE('ReturnStatement', () => {
        const element = this.createReturnStatement();

        this.CONSUME1(tokens.RETURN);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createRevertStatement(): ast.RevertStatement {
        return {} as any;
    }

    RevertStatement = this.RULE('RevertStatement', () => {
        const element = this.createRevertStatement();

        this.CONSUME1(tokens.REVER);
        this.SUBRULE1(this.Condition);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Condition);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createRewriteStatement(): ast.RewriteStatement {
        return {} as any;
    }

    RewriteStatement = this.RULE('RewriteStatement', () => {
        const element = this.createRewriteStatement();

        this.CONSUME1(tokens.REWRITE);
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE1(this.RewriteStatementFile); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.RewriteStatementFrom); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.RewriteStatementKey); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createRewriteStatementFile(): ast.RewriteStatementFile {
        return {} as any;
    }

    RewriteStatementFile = this.RULE('RewriteStatementFile', () => {
        const element = this.createRewriteStatementFile();

        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createRewriteStatementFrom(): ast.RewriteStatementFrom {
        return {} as any;
    }

    RewriteStatementFrom = this.RULE('RewriteStatementFrom', () => {
        const element = this.createRewriteStatementFrom();

        this.CONSUME1(tokens.FROM);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createRewriteStatementKey(): ast.RewriteStatementKey {
        return {} as any;
    }

    RewriteStatementKey = this.RULE('RewriteStatementKey', () => {
        const element = this.createRewriteStatementKey();

        this.CONSUME1(tokens.KEY);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createSelectStatement(): ast.SelectStatement {
        return {} as any;
    }

    SelectStatement = this.RULE('SelectStatement', () => {
        const element = this.createSelectStatement();

        this.CONSUME1(tokens.SELECT);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });
        this.CONSUME1(tokens.Semicolon);
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE1(this.WhenStatement); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.OtherwiseStatement); 
                    }
                },
            ]);
        });
        this.SUBRULE1(this.EndStatement);
        this.CONSUME2(tokens.Semicolon);

        return element;
    });
    private createWhenStatement(): ast.WhenStatement {
        return {} as any;
    }

    WhenStatement = this.RULE('WhenStatement', () => {
        const element = this.createWhenStatement();

        this.CONSUME1(tokens.WHEN);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Expression);
        });
        this.CONSUME1(tokens.CloseParen);
        this.SUBRULE1(this.Statement);

        return element;
    });
    private createOtherwiseStatement(): ast.OtherwiseStatement {
        return {} as any;
    }

    OtherwiseStatement = this.RULE('OtherwiseStatement', () => {
        const element = this.createOtherwiseStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.OTHERWISE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OTHER); 
                }
            },
        ]);
        this.SUBRULE1(this.Statement);

        return element;
    });
    private createSignalStatement(): ast.SignalStatement {
        return {} as any;
    }

    SignalStatement = this.RULE('SignalStatement', () => {
        const element = this.createSignalStatement();

        this.CONSUME1(tokens.SIGNAL);
        this.SUBRULE1(this.Condition);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createSkipDirective(): ast.SkipDirective {
        return {} as any;
    }

    SkipDirective = this.RULE('SkipDirective', () => {
        const element = this.createSkipDirective();

        this.CONSUME1(tokens.PercentSKIP);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME1(tokens.CloseParen);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createStopStatement(): ast.StopStatement {
        return {} as any;
    }

    StopStatement = this.RULE('StopStatement', () => {
        const element = this.createStopStatement();

        /* Action: StopStatement */
        this.CONSUME1(tokens.STOP);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createWaitStatement(): ast.WaitStatement {
        return {} as any;
    }

    WaitStatement = this.RULE('WaitStatement', () => {
        const element = this.createWaitStatement();

        this.CONSUME1(tokens.WAIT);
        this.CONSUME1(tokens.THREAD);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createWriteStatement(): ast.WriteStatement {
        return {} as any;
    }

    WriteStatement = this.RULE('WriteStatement', () => {
        const element = this.createWriteStatement();

        this.CONSUME1(tokens.WRITE);
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.WriteStatementFile); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.WriteStatementFrom); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.WriteStatementKeyFrom); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.WriteStatementKeyTo); 
                }
            },
        ]);
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createWriteStatementFile(): ast.WriteStatementFile {
        return {} as any;
    }

    WriteStatementFile = this.RULE('WriteStatementFile', () => {
        const element = this.createWriteStatementFile();

        this.CONSUME1(tokens.FILE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createWriteStatementFrom(): ast.WriteStatementFrom {
        return {} as any;
    }

    WriteStatementFrom = this.RULE('WriteStatementFrom', () => {
        const element = this.createWriteStatementFrom();

        this.CONSUME1(tokens.FROM);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createWriteStatementKeyFrom(): ast.WriteStatementKeyFrom {
        return {} as any;
    }

    WriteStatementKeyFrom = this.RULE('WriteStatementKeyFrom', () => {
        const element = this.createWriteStatementKeyFrom();

        this.CONSUME1(tokens.KEYFROM);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createWriteStatementKeyTo(): ast.WriteStatementKeyTo {
        return {} as any;
    }

    WriteStatementKeyTo = this.RULE('WriteStatementKeyTo', () => {
        const element = this.createWriteStatementKeyTo();

        this.CONSUME1(tokens.KEYTO);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.LocatorCall);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createInitialAttribute(): ast.InitialAttribute {
        return {} as any;
    }

    InitialAttribute = this.RULE('InitialAttribute', () => {
        const element = this.createInitialAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.OR2([
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.INITIAL); 
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.INIT); 
                            }
                        },
                    ]);
                    this.OR3([
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.OpenParen);
                                this.SUBRULE1(this.InitialAttributeItem);
                                this.MANY1(() => {
                                    this.CONSUME1(tokens.Comma);
                                    this.SUBRULE2(this.InitialAttributeItem);
                                });
                                this.CONSUME1(tokens.CloseParen);
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.CALL);
                                this.SUBRULE1(this.ProcedureCall);
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME1(tokens.TO);
                                this.CONSUME2(tokens.OpenParen);
                                this.SUBRULE1(this.InitialToContent);
                                this.CONSUME2(tokens.CloseParen);
                                this.CONSUME3(tokens.OpenParen);
                                this.SUBRULE3(this.InitialAttributeItem);
                                this.MANY2(() => {
                                    this.CONSUME2(tokens.Comma);
                                    this.SUBRULE4(this.InitialAttributeItem);
                                });
                                this.CONSUME3(tokens.CloseParen);
                            }
                        },
                    ]);
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.INITACROSS);
                    this.CONSUME4(tokens.OpenParen);
                    this.SUBRULE1(this.InitAcrossExpression);
                    this.MANY3(() => {
                        this.CONSUME3(tokens.Comma);
                        this.SUBRULE2(this.InitAcrossExpression);
                    });
                    this.CONSUME4(tokens.CloseParen);
                }
            },
        ]);

        return element;
    });
    private createInitialToContent(): ast.InitialToContent {
        return {} as any;
    }

    InitialToContent = this.RULE('InitialToContent', () => {
        const element = this.createInitialToContent();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.Varying);
                    this.OPTION1(() => {
                        this.SUBRULE1(this.CharType);
                    });
                }
            },
            {
                ALT: () => {
                    this.SUBRULE2(this.CharType);
                    this.OPTION2(() => {
                        this.SUBRULE2(this.Varying);
                    });
                }
            },
        ]);

        return element;
    });
    private createVarying(): ast.Varying {
        return {} as any;
    }

    Varying = this.RULE('Varying', () => {
        const element = this.createVarying();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARYING); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARYING4); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.VARYINGZ); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.NONVARYING); 
                }
            },
        ]);

        return element;
    });
    private createCharType(): ast.CharType {
        return {} as any;
    }

    CharType = this.RULE('CharType', () => {
        const element = this.createCharType();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.CHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.UCHAR); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.WCHAR); 
                }
            },
        ]);

        return element;
    });
    private createInitAcrossExpression(): ast.InitAcrossExpression {
        return {} as any;
    }

    InitAcrossExpression = this.RULE('InitAcrossExpression', () => {
        const element = this.createInitAcrossExpression();

        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.Expression);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createInitialAttributeItem(): ast.InitialAttributeItem {
        return {} as any;
    }

    InitialAttributeItem = this.RULE('InitialAttributeItem', () => {
        const element = this.createInitialAttributeItem();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttributeItemStar); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttributeSpecification); 
                }
            },
        ]);

        return element;
    });
    private createInitialAttributeItemStar(): ast.InitialAttributeItemStar {
        return {} as any;
    }

    InitialAttributeItemStar = this.RULE('InitialAttributeItemStar', () => {
        const element = this.createInitialAttributeItemStar();

        /* Action: InitialAttributeItemStar */
        this.CONSUME1(tokens.Star);

        return element;
    });
    private createInitialAttributeSpecification(): ast.InitialAttributeSpecification {
        return {} as any;
    }

    InitialAttributeSpecification = this.RULE('InitialAttributeSpecification', () => {
        const element = this.createInitialAttributeSpecification();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.CONSUME1(tokens.Star);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.Expression); 
                }
            },
        ]);
        this.OPTION1(() => {
            this.SUBRULE1(this.InitialAttributeSpecificationIteration);
        });

        return element;
    });
    private createInitialAttributeSpecificationIteration(): ast.InitialAttributeSpecificationIteration {
        return {} as any;
    }

    InitialAttributeSpecificationIteration = this.RULE('InitialAttributeSpecificationIteration', () => {
        const element = this.createInitialAttributeSpecificationIteration();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttributeItemStar); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttributeSpecificationIterationValue); 
                }
            },
        ]);

        return element;
    });
    private createInitialAttributeSpecificationIterationValue(): ast.InitialAttributeSpecificationIterationValue {
        return {} as any;
    }

    InitialAttributeSpecificationIterationValue = this.RULE('InitialAttributeSpecificationIterationValue', () => {
        const element = this.createInitialAttributeSpecificationIterationValue();

        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.InitialAttributeItem);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.InitialAttributeItem);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createDeclareStatement(): ast.DeclareStatement {
        return {} as any;
    }

    DeclareStatement = this.RULE('DeclareStatement', () => {
        const element = this.createDeclareStatement();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DCL); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DECLARE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XDECLARE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.XDCL); 
                }
            },
        ]);
        this.SUBRULE1(this.DeclaredItem);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.DeclaredItem);
        });
        this.CONSUME1(tokens.Semicolon);

        return element;
    });
    private createDeclaredItem(): ast.DeclaredItem {
        return {} as any;
    }

    DeclaredItem = this.RULE('DeclaredItem', () => {
        const element = this.createDeclaredItem();

        this.OPTION1(() => {
            this.CONSUME1(tokens.NUMBER);
        });
        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.DeclaredVariable); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE1(this.DeclaredItem);
                    this.MANY1(() => {
                        this.CONSUME1(tokens.Comma);
                        this.SUBRULE2(this.DeclaredItem);
                    });
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);
        this.MANY2(() => {
            this.SUBRULE1(this.DeclarationAttribute);
        });

        return element;
    });
    private createDeclaredVariable(): ast.DeclaredVariable {
        return {} as any;
    }

    DeclaredVariable = this.RULE('DeclaredVariable', () => {
        const element = this.createDeclaredVariable();

        this.CONSUME1(tokens.ID);

        return element;
    });
    private createDefaultDeclarationAttribute(): ast.DefaultDeclarationAttribute {
        return {} as any;
    }

    DefaultDeclarationAttribute = this.RULE('DefaultDeclarationAttribute', () => {
        const element = this.createDefaultDeclarationAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DateAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.HandleAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefinedAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PictureAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EnvironmentAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DimensionsDataAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefaultValueAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueListFromAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueListAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueRangeAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReturnsAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ComputationDataAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EntryAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LikeAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.TypeAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OrdinalTypeAttribute); 
                }
            },
        ]);

        return element;
    });
    private createDeclarationAttribute(): ast.DeclarationAttribute {
        return {} as any;
    }

    DeclarationAttribute = this.RULE('DeclarationAttribute', () => {
        const element = this.createDeclarationAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.InitialAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DateAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.HandleAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DefinedAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.PictureAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EnvironmentAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.DimensionsDataAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueListFromAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueListAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ValueRangeAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ReturnsAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ComputationDataAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EntryAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LikeAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.TypeAttribute); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.OrdinalTypeAttribute); 
                }
            },
        ]);

        return element;
    });
    private createDateAttribute(): ast.DateAttribute {
        return {} as any;
    }

    DateAttribute = this.RULE('DateAttribute', () => {
        const element = this.createDateAttribute();

        this.CONSUME1(tokens.DATE);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.CONSUME1(tokens.STRING_TERM);
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createDefinedAttribute(): ast.DefinedAttribute {
        return {} as any;
    }

    DefinedAttribute = this.RULE('DefinedAttribute', () => {
        const element = this.createDefinedAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEFINED); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.DEF); 
                }
            },
        ]);
        this.OR2([
            {
                ALT: () => {
                    this.SUBRULE1(this.MemberCall); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.SUBRULE2(this.MemberCall);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);
        this.OPTION1(() => {
            this.OR3([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.POSITION); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.POS); 
                    }
                },
            ]);
            this.CONSUME2(tokens.OpenParen);
            this.SUBRULE1(this.Expression);
            this.CONSUME2(tokens.CloseParen);
        });

        return element;
    });
    private createPictureAttribute(): ast.PictureAttribute {
        return {} as any;
    }

    PictureAttribute = this.RULE('PictureAttribute', () => {
        const element = this.createPictureAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.PICTURE); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.WIDEPIC); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.PIC); 
                }
            },
        ]);
        this.OPTION1(() => {
            this.CONSUME1(tokens.STRING_TERM);
        });

        return element;
    });
    private createDimensionsDataAttribute(): ast.DimensionsDataAttribute {
        return {} as any;
    }

    DimensionsDataAttribute = this.RULE('DimensionsDataAttribute', () => {
        const element = this.createDimensionsDataAttribute();

        this.OPTION1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.DIMENSION); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.DIM); 
                    }
                },
            ]);
        });
        this.SUBRULE1(this.Dimensions);

        return element;
    });
    private createTypeAttribute(): ast.TypeAttribute {
        return {} as any;
    }

    TypeAttribute = this.RULE('TypeAttribute', () => {
        const element = this.createTypeAttribute();

        this.CONSUME1(tokens.TYPE);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ID); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.CONSUME2(tokens.ID);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);

        return element;
    });
    private createOrdinalTypeAttribute(): ast.OrdinalTypeAttribute {
        return {} as any;
    }

    OrdinalTypeAttribute = this.RULE('OrdinalTypeAttribute', () => {
        const element = this.createOrdinalTypeAttribute();

        this.CONSUME1(tokens.ORDINAL);
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ID); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.OpenParen);
                    this.CONSUME2(tokens.ID);
                    this.CONSUME1(tokens.CloseParen);
                }
            },
        ]);
        this.CONSUME1(tokens.BYVALUE);

        return element;
    });
    private createReturnsAttribute(): ast.ReturnsAttribute {
        return {} as any;
    }

    ReturnsAttribute = this.RULE('ReturnsAttribute', () => {
        const element = this.createReturnsAttribute();

        this.CONSUME1(tokens.RETURNS);
        this.CONSUME1(tokens.OpenParen);
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE1(this.ComputationDataAttribute); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.DateAttribute); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.ValueListAttribute); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.ValueRangeAttribute); 
                    }
                },
            ]);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createComputationDataAttribute(): ast.ComputationDataAttribute {
        return {} as any;
    }

    ComputationDataAttribute = this.RULE('ComputationDataAttribute', () => {
        const element = this.createComputationDataAttribute();

        this.SUBRULE1(this.DataAttributeType);
        this.OPTION1(() => {
            this.SUBRULE1(this.Dimensions);
        });

        return element;
    });
    private createDefaultValueAttribute(): ast.DefaultValueAttribute {
        return {} as any;
    }

    DefaultValueAttribute = this.RULE('DefaultValueAttribute', () => {
        const element = this.createDefaultValueAttribute();

        this.CONSUME1(tokens.VALUE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.DefaultValueAttributeItem);
        this.MANY1(() => {
            this.CONSUME1(tokens.Comma);
            this.SUBRULE2(this.DefaultValueAttributeItem);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createValueAttribute(): ast.ValueAttribute {
        return {} as any;
    }

    ValueAttribute = this.RULE('ValueAttribute', () => {
        const element = this.createValueAttribute();

        this.CONSUME1(tokens.VALUE);
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createDefaultValueAttributeItem(): ast.DefaultValueAttributeItem {
        return {} as any;
    }

    DefaultValueAttributeItem = this.RULE('DefaultValueAttributeItem', () => {
        const element = this.createDefaultValueAttributeItem();

        this.AT_LEAST_ONE1(() => {
            this.SUBRULE1(this.DeclarationAttribute);
        });

        return element;
    });
    private createValueListAttribute(): ast.ValueListAttribute {
        return {} as any;
    }

    ValueListAttribute = this.RULE('ValueListAttribute', () => {
        const element = this.createValueListAttribute();

        this.CONSUME1(tokens.VALUELIST);
        this.CONSUME1(tokens.OpenParen);
        this.OPTION1(() => {
            this.SUBRULE1(this.Expression);
            this.MANY1(() => {
                this.CONSUME1(tokens.Comma);
                this.SUBRULE2(this.Expression);
            });
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createValueListFromAttribute(): ast.ValueListFromAttribute {
        return {} as any;
    }

    ValueListFromAttribute = this.RULE('ValueListFromAttribute', () => {
        const element = this.createValueListFromAttribute();

        this.CONSUME1(tokens.VALUELISTFROM);
        this.SUBRULE1(this.LocatorCall);

        return element;
    });
    private createValueRangeAttribute(): ast.ValueRangeAttribute {
        return {} as any;
    }

    ValueRangeAttribute = this.RULE('ValueRangeAttribute', () => {
        const element = this.createValueRangeAttribute();

        this.CONSUME1(tokens.VALUERANGE);
        this.CONSUME1(tokens.OpenParen);
        this.OPTION1(() => {
            this.SUBRULE1(this.Expression);
            this.MANY1(() => {
                this.CONSUME1(tokens.Comma);
                this.SUBRULE2(this.Expression);
            });
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createDataAttributeType(): ast.DataAttributeType {
        return {} as any;
    }

    DataAttributeType = this.RULE('DataAttributeType', () => {
        const element = this.createDataAttributeType();

        this.SUBRULE1(this.DefaultAttribute);

        return element;
    });
    private createLikeAttribute(): ast.LikeAttribute {
        return {} as any;
    }

    LikeAttribute = this.RULE('LikeAttribute', () => {
        const element = this.createLikeAttribute();

        this.CONSUME1(tokens.LIKE);
        this.SUBRULE1(this.LocatorCall);

        return element;
    });
    private createHandleAttribute(): ast.HandleAttribute {
        return {} as any;
    }

    HandleAttribute = this.RULE('HandleAttribute', () => {
        const element = this.createHandleAttribute();

        this.CONSUME1(tokens.HANDLE);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.CONSUME1(tokens.NUMBER);
            this.CONSUME1(tokens.CloseParen);
        });
        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ID); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME2(tokens.OpenParen);
                    this.CONSUME2(tokens.ID);
                    this.CONSUME2(tokens.CloseParen);
                }
            },
        ]);

        return element;
    });
    private createDimensions(): ast.Dimensions {
        return {} as any;
    }

    Dimensions = this.RULE('Dimensions', () => {
        const element = this.createDimensions();

        this.CONSUME1(tokens.OpenParen);
        this.OPTION1(() => {
            this.SUBRULE1(this.DimensionBound);
            this.MANY1(() => {
                this.CONSUME1(tokens.Comma);
                this.SUBRULE2(this.DimensionBound);
            });
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createDimensionBound(): ast.DimensionBound {
        return {} as any;
    }

    DimensionBound = this.RULE('DimensionBound', () => {
        const element = this.createDimensionBound();

        this.SUBRULE1(this.Bound);
        this.OPTION1(() => {
            this.CONSUME1(tokens.Colon);
            this.SUBRULE2(this.Bound);
        });

        return element;
    });
    private createBound(): ast.Bound {
        return {} as any;
    }

    Bound = this.RULE('Bound', () => {
        const element = this.createBound();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.Expression);
                    this.OPTION1(() => {
                        this.CONSUME1(tokens.REFER);
                        this.CONSUME1(tokens.OpenParen);
                        this.SUBRULE1(this.LocatorCall);
                        this.CONSUME1(tokens.CloseParen);
                    });
                }
            },
        ]);

        return element;
    });
    private createEnvironmentAttribute(): ast.EnvironmentAttribute {
        return {} as any;
    }

    EnvironmentAttribute = this.RULE('EnvironmentAttribute', () => {
        const element = this.createEnvironmentAttribute();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.ENVIRONMENT); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.ENV); 
                }
            },
        ]);
        this.CONSUME1(tokens.OpenParen);
        this.MANY1(() => {
            this.SUBRULE1(this.EnvironmentAttributeItem);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createEnvironmentAttributeItem(): ast.EnvironmentAttributeItem {
        return {} as any;
    }

    EnvironmentAttributeItem = this.RULE('EnvironmentAttributeItem', () => {
        const element = this.createEnvironmentAttributeItem();

        this.CONSUME1(tokens.ID);
        this.OPTION3(() => {
            this.CONSUME1(tokens.OpenParen);
            this.OPTION2(() => {
                this.SUBRULE1(this.Expression);
                this.MANY1(() => {
                    this.OPTION1(() => {
                        this.CONSUME1(tokens.Comma);
                    });
                    this.SUBRULE2(this.Expression);
                });
            });
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createEntryAttribute(): ast.EntryAttribute {
        return {} as any;
    }

    EntryAttribute = this.RULE('EntryAttribute', () => {
        const element = this.createEntryAttribute();

        this.MANY1(() => {
            this.CONSUME1(tokens.LIMITED);
        });
        this.CONSUME1(tokens.ENTRY);
        this.OPTION1(() => {
            this.CONSUME1(tokens.OpenParen);
            this.SUBRULE1(this.EntryDescription);
            this.MANY2(() => {
                this.CONSUME1(tokens.Comma);
                this.SUBRULE2(this.EntryDescription);
            });
            this.CONSUME1(tokens.CloseParen);
        });
        this.MANY3(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.SUBRULE1(this.Options); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.VARIABLE); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME2(tokens.LIMITED); 
                    }
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.ReturnsOption); 
                    }
                },
                {
                    ALT: () => {
                        this.OR2([
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.EXTERNAL); 
                                }
                            },
                            {
                                ALT: () => {
                                    this.CONSUME1(tokens.EXT); 
                                }
                            },
                        ]);
                        this.OPTION2(() => {
                            this.CONSUME2(tokens.OpenParen);
                            this.SUBRULE1(this.Expression);
                            this.CONSUME2(tokens.CloseParen);
                        });
                    }
                },
            ]);
        });

        return element;
    });
    private createReturnsOption(): ast.ReturnsOption {
        return {} as any;
    }

    ReturnsOption = this.RULE('ReturnsOption', () => {
        const element = this.createReturnsOption();

        this.CONSUME1(tokens.RETURNS);
        this.CONSUME1(tokens.OpenParen);
        this.MANY1(() => {
            this.SUBRULE1(this.DeclarationAttribute);
        });
        this.CONSUME1(tokens.CloseParen);

        return element;
    });
    private createEntryDescription(): ast.EntryDescription {
        return {} as any;
    }

    EntryDescription = this.RULE('EntryDescription', () => {
        const element = this.createEntryDescription();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.EntryParameterDescription); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.EntryUnionDescription); 
                }
            },
        ]);

        return element;
    });
    private createEntryParameterDescription(): ast.EntryParameterDescription {
        return {} as any;
    }

    EntryParameterDescription = this.RULE('EntryParameterDescription', () => {
        const element = this.createEntryParameterDescription();

        this.OR1([
            {
                ALT: () => {
                    this.AT_LEAST_ONE1(() => {
                        this.SUBRULE1(this.DeclarationAttribute);
                    }); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Star);
                    this.MANY1(() => {
                        this.SUBRULE2(this.DeclarationAttribute);
                    });
                }
            },
        ]);

        return element;
    });
    private createEntryUnionDescription(): ast.EntryUnionDescription {
        return {} as any;
    }

    EntryUnionDescription = this.RULE('EntryUnionDescription', () => {
        const element = this.createEntryUnionDescription();

        this.CONSUME1(tokens.NUMBER);
        this.MANY1(() => {
            this.SUBRULE1(this.DeclarationAttribute);
        });
        this.CONSUME1(tokens.Comma);
        this.MANY2(() => {
            this.SUBRULE1(this.PrefixedAttribute);
        });

        return element;
    });
    private createPrefixedAttribute(): ast.PrefixedAttribute {
        return {} as any;
    }

    PrefixedAttribute = this.RULE('PrefixedAttribute', () => {
        const element = this.createPrefixedAttribute();

        this.CONSUME1(tokens.NUMBER);
        this.MANY1(() => {
            this.SUBRULE1(this.DeclarationAttribute);
        });

        return element;
    });
    private createProcedureParameter(): ast.ProcedureParameter {
        return {} as any;
    }

    ProcedureParameter = this.RULE('ProcedureParameter', () => {
        const element = this.createProcedureParameter();

        this.CONSUME1(tokens.ID);

        return element;
    });
    private createReferenceItem(): ast.ReferenceItem {
        return {} as any;
    }

    ReferenceItem = this.RULE('ReferenceItem', () => {
        const element = this.createReferenceItem();

        this.CONSUME1(tokens.ID);
        this.OPTION1(() => {
            this.SUBRULE1(this.Dimensions);
        });

        return element;
    });
    private createExpression(): ast.Expression {
        return {} as any;
    }

    Expression = this.RULE('Expression', () => {
        const element = this.createExpression();

        this.SUBRULE1(this.BinaryExpression);

        return element;
    });
    private createBinaryExpression(): ast.Expression {
        return {} as any;
    }

    BinaryExpression = this.RULE('BinaryExpression', () => {
        const element = this.createBinaryExpression();

        /* Action: BinaryExpression */
        this.SUBRULE1(this.PrimaryExpression);
        this.MANY1(() => {
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Pipe); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Not); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Caret); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Ampersand); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.LessThan); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.NotLessThan); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.LessThanEquals); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Equals); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.NotEquals); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.CaretEquals); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.LessThanGreaterThan); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.GreaterThanEquals); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.GreaterThan); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.NotGreaterThan); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.PipePipe); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.ExclamationMarkExclamationMark); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Plus); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Minus); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Star); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.Slash); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.StarStar); 
                    }
                },
            ]);
            this.SUBRULE2(this.PrimaryExpression);
        });

        return element;
    });
    private createPrimaryExpression(): ast.Expression {
        return {} as any;
    }

    PrimaryExpression = this.RULE('PrimaryExpression', () => {
        const element = this.createPrimaryExpression();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.Literal); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.ParenthesizedExpression); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.UnaryExpression); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.LocatorCall); 
                }
            },
        ]);

        return element;
    });
    private createParenthesizedExpression(): ast.Expression {
        return {} as any;
    }

    ParenthesizedExpression = this.RULE('ParenthesizedExpression', () => {
        const element = this.createParenthesizedExpression();

        /* Action: Parenthesis */
        this.CONSUME1(tokens.OpenParen);
        this.SUBRULE1(this.Expression);
        this.OPTION1(() => {
            this.CONSUME1(tokens.DO);
            this.SUBRULE1(this.DoType3);
        });
        this.CONSUME1(tokens.CloseParen);
        this.OPTION2(() => {
            /* Action: Literal.multiplier */
            this.SUBRULE1(this.LiteralValue);
        });

        return element;
    });
    private createMemberCall(): ast.MemberCall {
        return {} as any;
    }

    MemberCall = this.RULE('MemberCall', () => {
        const element = this.createMemberCall();

        this.SUBRULE1(this.ReferenceItem);
        this.MANY1(() => {
            /* Action: MemberCall.previous */
            this.CONSUME1(tokens.Dot);
            this.SUBRULE2(this.ReferenceItem);
        });

        return element;
    });
    private createLocatorCall(): ast.LocatorCall {
        return {} as any;
    }

    LocatorCall = this.RULE('LocatorCall', () => {
        const element = this.createLocatorCall();

        this.SUBRULE1(this.MemberCall);
        this.MANY1(() => {
            /* Action: LocatorCall.previous */
            this.OR1([
                {
                    ALT: () => {
                        this.CONSUME1(tokens.MinusGreaterThan); 
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME1(tokens.EqualsGreaterThan); 
                    }
                },
            ]);
            this.SUBRULE2(this.MemberCall);
        });

        return element;
    });
    private createProcedureCall(): ast.ProcedureCall {
        return {} as any;
    }

    ProcedureCall = this.RULE('ProcedureCall', () => {
        const element = this.createProcedureCall();

        this.CONSUME1(tokens.ID);
        this.OPTION2(() => {
            this.CONSUME1(tokens.OpenParen);
            this.OPTION1(() => {
                this.OR1([
                    {
                        ALT: () => {
                            this.SUBRULE1(this.Expression); 
                        }
                    },
                    {
                        ALT: () => {
                            this.CONSUME1(tokens.Star); 
                        }
                    },
                ]);
                this.MANY1(() => {
                    this.CONSUME1(tokens.Comma);
                    this.OR2([
                        {
                            ALT: () => {
                                this.SUBRULE2(this.Expression); 
                            }
                        },
                        {
                            ALT: () => {
                                this.CONSUME2(tokens.Star); 
                            }
                        },
                    ]);
                });
            });
            this.CONSUME1(tokens.CloseParen);
        });

        return element;
    });
    private createLabelReference(): ast.LabelReference {
        return {} as any;
    }

    LabelReference = this.RULE('LabelReference', () => {
        const element = this.createLabelReference();

        this.CONSUME1(tokens.ID);

        return element;
    });
    private createUnaryExpression(): ast.UnaryExpression {
        return {} as any;
    }

    UnaryExpression = this.RULE('UnaryExpression', () => {
        const element = this.createUnaryExpression();

        this.OR1([
            {
                ALT: () => {
                    this.CONSUME1(tokens.Plus); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Minus); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Not); 
                }
            },
            {
                ALT: () => {
                    this.CONSUME1(tokens.Caret); 
                }
            },
        ]);
        this.SUBRULE1(this.Expression);

        return element;
    });
    private createLiteral(): ast.Literal {
        return {} as any;
    }

    Literal = this.RULE('Literal', () => {
        const element = this.createLiteral();

        this.SUBRULE1(this.LiteralValue);

        return element;
    });
    private createLiteralValue(): ast.LiteralValue {
        return {} as any;
    }

    LiteralValue = this.RULE('LiteralValue', () => {
        const element = this.createLiteralValue();

        this.OR1([
            {
                ALT: () => {
                    this.SUBRULE1(this.StringLiteral); 
                }
            },
            {
                ALT: () => {
                    this.SUBRULE1(this.NumberLiteral); 
                }
            },
        ]);

        return element;
    });
    private createStringLiteral(): ast.StringLiteral {
        return {} as any;
    }

    StringLiteral = this.RULE('StringLiteral', () => {
        const element = this.createStringLiteral();

        this.CONSUME1(tokens.STRING_TERM);

        return element;
    });
    private createNumberLiteral(): ast.NumberLiteral {
        return {} as any;
    }

    NumberLiteral = this.RULE('NumberLiteral', () => {
        const element = this.createNumberLiteral();

        this.CONSUME1(tokens.NUMBER);

        return element;
    });
    private createFQN(): ast.FQN {
        return {} as any;
    }

    FQN = this.RULE('FQN', () => {
        const element = this.createFQN();

        this.CONSUME1(tokens.ID);
        this.MANY1(() => {
            this.CONSUME1(tokens.Dot);
            this.CONSUME2(tokens.ID);
        });

        return element;
    });
}
