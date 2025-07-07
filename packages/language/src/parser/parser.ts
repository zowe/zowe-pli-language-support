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

import {
  AbstractParser,
  IntermediateBinaryExpression,
} from "./abstract-parser";
import * as tokens from "./tokens";
import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import { ParserMethod, tokenMatcher } from "chevrotain";

export class PliParser extends AbstractParser {
  constructor() {
    super(tokens.all);
    this.performSelfAnalysis();
  }

  parse(): ast.PliProgram {
    const result = this.PliProgram();
    if (result === undefined) {
      return this.pop<ast.PliProgram>();
    }
    return result;
  }

  private createPliProgram(): ast.PliProgram {
    return {
      kind: ast.SyntaxKind.PliProgram,
      container: null,
      statements: [],
    };
  }

  PliProgram = this.RULE("PliProgram", () => {
    let element = this.push(this.createPliProgram());

    this.MANY(() => {
      this.SUBRULE_ASSIGN(this.Statement, {
        assign: (result) => {
          element.statements.push(result);
        },
      });
    });

    return this.pop<ast.PliProgram>();
  });
  private createPackage(): ast.Package {
    return {
      kind: ast.SyntaxKind.Package,
      container: null,
      exports: null,
      reserves: null,
      options: null,
      statements: [],
      end: null,
    };
  }

  Package = this.RULE("Package", () => {
    let element = this.push(this.createPackage());

    this.CONSUME_ASSIGN1(tokens.PACKAGE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Package_PACKAGE);
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.Exports, {
        assign: (result) => {
          element.exports = result;
        },
      });
    });
    this.OPTION2(() => {
      this.SUBRULE_ASSIGN1(this.Reserves, {
        assign: (result) => {
          element.reserves = result;
        },
      });
    });
    this.OPTION3(() => {
      this.SUBRULE_ASSIGN1(this.Options, {
        assign: (result) => {
          element.options = result;
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Package_Semicolon0);
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.Statement, {
        assign: (result) => {
          element.statements.push(result);
        },
      });
    });
    this.SUBRULE_ASSIGN1(this.EndStatement, {
      assign: (result) => {
        element.end = result;
      },
    });
    this.CONSUME_ASSIGN2(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Package_Semicolon1);
    });

    return this.pop<ast.Package>();
  });
  private createConditionPrefix(): ast.ConditionPrefix {
    return {
      kind: ast.SyntaxKind.ConditionPrefix,
      container: null,
      items: [],
    };
  }

  ConditionPrefix = this.RULE("ConditionPrefix", () => {
    let element = this.push(this.createConditionPrefix());

    this.AT_LEAST_ONE1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ConditionPrefix_OpenParen,
        );
      });
      this.SUBRULE_ASSIGN1(this.ConditionPrefixItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ConditionPrefix_CloseParen,
        );
      });
      this.CONSUME_ASSIGN1(tokens.Colon, (token) => {
        this.tokenPayload(token, element, CstNodeKind.ConditionPrefix_Colon);
      });
    });

    return this.pop<ast.ConditionPrefix>();
  });
  private createConditionPrefixItem(): ast.ConditionPrefixItem {
    return {
      kind: ast.SyntaxKind.ConditionPrefixItem,
      container: null,
      conditions: [],
    };
  }

  ConditionPrefixItem = this.RULE("ConditionPrefixItem", () => {
    let element = this.push(this.createConditionPrefixItem());

    this.SUBRULE_ASSIGN1(this.Condition, {
      assign: (result) => {
        element.conditions.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ConditionPrefixItem_Comma,
        );
      });
      this.SUBRULE_ASSIGN2(this.Condition, {
        assign: (result) => {
          element.conditions.push(result);
        },
      });
    });

    return this.pop<ast.ConditionPrefixItem>();
  });

  private createExportsItem(): ast.ExportsItem {
    return {
      kind: ast.SyntaxKind.ExportsItem,
      container: null,
      reference: null,
    };
  }

  ExportsItem = this.RULE("ExportsItem", () => {
    let element = this.push(this.createExportsItem());

    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Exports_Procedure);
      element.reference = ast.createReference(element, token);
    });

    return this.pop<ast.ExportsItem>();
  });

  private createExports(): ast.Exports {
    return {
      kind: ast.SyntaxKind.Exports,
      container: null,
      all: false,
      procedures: [],
    };
  }

  Exports = this.RULE("Exports", () => {
    let element = this.push(this.createExports());

    this.CONSUME_ASSIGN1(tokens.EXPORTS, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Exports_EXPORTS);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Exports_OpenParen);
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            this.tokenPayload(token, element, CstNodeKind.Exports_AllStar);
            element.all = true;
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.ExportsItem, {
            assign: (result) => {
              element.procedures.push(result);
            },
          });
          this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
              this.tokenPayload(token, element, CstNodeKind.Exports_Comma);
            });
            this.SUBRULE_ASSIGN2(this.ExportsItem, {
              assign: (result) => {
                element.procedures.push(result);
              },
            });
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Exports_CloseParen);
    });

    return this.pop<ast.Exports>();
  });
  private createReserves(): ast.Reserves {
    return {
      kind: ast.SyntaxKind.Reserves,
      container: null,
      all: false,
      variables: [],
    };
  }

  Reserves = this.RULE("Reserves", () => {
    let element = this.push(this.createReserves());

    this.CONSUME_ASSIGN1(tokens.RESERVES, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Reserves_RESERVES);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Reserves_OpenParen);
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            this.tokenPayload(token, element, CstNodeKind.Reserves_AllStar);
            element.all = true;
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.ID, (token) => {
            this.tokenPayload(token, element, CstNodeKind.Reserves_Variables0);
            element.variables.push(token.image);
          });
          this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
              this.tokenPayload(token, element, CstNodeKind.Reserves_Comma);
            });
            this.CONSUME_ASSIGN2(tokens.ID, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.Reserves_Variables1,
              );
              element.variables.push(token.image);
            });
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Reserves_CloseParen);
    });

    return this.pop<ast.Reserves>();
  });
  private createOptions(): ast.Options {
    return {
      kind: ast.SyntaxKind.Options,
      container: null,
      items: [],
    };
  }

  Options = this.RULE("Options", () => {
    let element = this.push(this.createOptions());

    this.CONSUME_ASSIGN1(tokens.OPTIONS, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Options_OPTIONS);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Options_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.OptionsItem, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.MANY1(() => {
      this.OPTION1(() => {
        this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
          this.tokenPayload(token, element, CstNodeKind.Options_Comma);
        });
      });
      this.SUBRULE_ASSIGN2(this.OptionsItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Options_CloseParen);
    });

    return this.pop<ast.Options>();
  });

  OptionsItem = this.RULE("OptionsItem", () => {
    let element = this.push<ast.OptionsItem>(null!);

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN(tokens.SimpleOptions, (token) => {
            element = this.replace({
              kind: ast.SyntaxKind.SimpleOptionsItem,
              container: null,
              value: token.image as ast.SimpleOptionsItem["value"],
            });
            this.tokenPayload(
              token,
              element,
              CstNodeKind.SimpleOptionsItem_Value,
            );
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.CMPATOptionsItem, {
            assign: (result) => {
              element = this.replace(result);
            },
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.LinkageOptionsItem, {
            assign: (result) => {
              element = this.replace(result);
            },
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.NoMapOptionsItem, {
            assign: (result) => {
              element = this.replace(result);
            },
          });
        },
      },
    ]);

    return this.pop<ast.OptionsItem>();
  });
  private createLinkageOptionsItem(): ast.LinkageOptionsItem {
    return {
      kind: ast.SyntaxKind.LinkageOptionsItem,
      container: null,
      value: null,
    };
  }

  LinkageOptionsItem = this.RULE("LinkageOptionsItem", () => {
    let element = this.push(this.createLinkageOptionsItem());

    this.CONSUME_ASSIGN1(tokens.LINKAGE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LinkageOptionsItem_Linkage);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.LinkageOptionsItem_OpenParen,
      );
    });
    this.CONSUME_ASSIGN1(tokens.LinkageOption, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LinkageOptionsItem_Value);
      element.value = token.image as ast.LinkageOptionsItem["value"];
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.LinkageOptionsItem_CloseParen,
      );
    });

    return this.pop<ast.LinkageOptionsItem>();
  });
  private createCMPATOptionsItem(): ast.CMPATOptionsItem {
    return {
      kind: ast.SyntaxKind.CMPATOptionsItem,
      container: null,
      value: null,
    };
  }

  CMPATOptionsItem = this.RULE("CMPATOptionsItem", () => {
    let element = this.push(this.createCMPATOptionsItem());

    this.CONSUME_ASSIGN1(tokens.CMPAT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_CMPAT);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_OpenParen);
    });
    this.CONSUME_ASSIGN1(tokens.VX, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CMPATOptionsItem_Value);
      element.value = token.image as "V1" | "V2" | "V3";
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.CMPATOptionsItem_CloseParen,
      );
    });

    return this.pop<ast.CMPATOptionsItem>();
  });
  private createNoMapOptionsItem(): ast.NoMapOptionsItem {
    return {
      kind: ast.SyntaxKind.NoMapOptionsItem,
      container: null,
      type: null,
      parameters: [],
    };
  }

  NoMapOptionsItem = this.RULE("NoMapOptionsItem", () => {
    let element = this.push(this.createNoMapOptionsItem());

    this.CONSUME_ASSIGN1(tokens.NoMapOption, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NoMapOptionsItem_Type);
      element.type = token.image as "NOMAP" | "NOMAPIN" | "NOMAPOUT";
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.NoMapOptionsItem_OpenParen,
        );
      });
      this.OPTION1(() => {
        this.CONSUME_ASSIGN1(tokens.ID, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.NoMapOptionsItem_Parameters0,
          );
          element.parameters.push(token.image);
        });
        this.MANY1(() => {
          this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.NoMapOptionsItem_Comma,
            );
          });
          this.CONSUME_ASSIGN2(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.NoMapOptionsItem_Parameters1,
            );
            element.parameters.push(token.image);
          });
        });
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.NoMapOptionsItem_CloseParen,
        );
      });
    });

    return this.pop<ast.NoMapOptionsItem>();
  });

  ProcedureStatement = this.RULE("ProcedureStatement", () => {
    let element = this.push(ast.createProcedureStatement());

    this.CONSUME_ASSIGN1(tokens.PROCEDURE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ProcedureStatement_PROCEDURE,
      );
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ProcedureStatement_OpenParenParams,
        );
      });
      this.OPTION1(() => {
        this.SUBRULE_ASSIGN1(this.ProcedureParameter, {
          assign: (result) => {
            element.parameters.push(result);
          },
        });
        this.MANY1(() => {
          this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.ProcedureStatement_Comma,
            );
          });
          this.SUBRULE_ASSIGN2(this.ProcedureParameter, {
            assign: (result) => {
              element.parameters.push(result);
            },
          });
        });
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ProcedureStatement_CloseParenParams,
        );
      });
    });
    this.MANY2(() => {
      this.OR2([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.ReturnsOption, {
              assign: (result) => {
                element.options.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.Options, {
              assign: (result) => {
                element.options.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.RECURSIVE, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.ProcedureStatement_Recursive,
              );
              const recursive = ast.createProcedureRecursiveOption();
              element.options.push(recursive);
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.ORDER, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.ProcedureStatement_Order,
              );
              const order = ast.createProcedureOrderOption();
              order.order = token.image as "ORDER" | "REORDER";
              element.options.push(order);
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN(this.EnvironmentOption, {
              assign: (result) => {
                element.options.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN(tokens.ScopeAttribute, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.ScopeAttribute_Scope,
              );
              const scope = ast.createProcedureScopeOption();
              scope.scope = token.image as ast.ScopeAttribute;
              element.options.push(scope);
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ProcedureStatement_Semicolon0,
      );
    });
    this.MANY3(() => {
      this.SUBRULE_ASSIGN1(this.Statement, {
        assign: (result) => {
          element.statements.push(result);
        },
      });
    });
    this.OPTION4(() => {
      this.CONSUME_ASSIGN2(tokens.PROCEDURE, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ProcedureStatement_PROCEDURE_END,
        );
      });
    });
    this.SUBRULE_ASSIGN1(this.EndStatement, {
      assign: (result) => {
        element.end = result;
      },
    });
    this.CONSUME_ASSIGN2(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ProcedureStatement_Semicolon1,
      );
    });

    return this.pop<ast.ProcedureStatement>();
  });

  private createLabelPrefix(): ast.LabelPrefix {
    return {
      kind: ast.SyntaxKind.LabelPrefix,
      container: null,
      nameToken: null,
      name: null,
    };
  }

  LabelPrefix = this.RULE("LabelPrefix", () => {
    let element = this.push(this.createLabelPrefix());

    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LabelPrefix_Name);
      element.name = token.image;
      element.nameToken = token;
    });
    this.CONSUME_ASSIGN1(tokens.Colon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LabelPrefix_Colon);
    });

    return this.pop<ast.LabelPrefix>();
  });
  private createEntryStatement(): ast.EntryStatement {
    return {
      kind: ast.SyntaxKind.EntryStatement,
      container: null,
      parameters: [],
      variable: [],
      limited: [],
      returns: [],
      options: [],
      environmentName: [],
    };
  }

  EntryStatement = this.RULE("EntryStatement", () => {
    let element = this.push(this.createEntryStatement());

    this.CONSUME_ASSIGN1(tokens.ENTRY, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EntryStatement_ENTRY);
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EntryStatement_OpenParenParams,
        );
      });
      this.OPTION1(() => {
        this.SUBRULE_ASSIGN1(this.ProcedureParameter, {
          assign: (result) => {
            element.parameters.push(result);
          },
        });
        this.MANY1(() => {
          this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
            this.tokenPayload(token, element, CstNodeKind.EntryStatement_Comma);
          });
          this.SUBRULE_ASSIGN2(this.ProcedureParameter, {
            assign: (result) => {
              element.parameters.push(result);
            },
          });
        });
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EntryStatement_CloseParenParams,
        );
      });
    });
    this.MANY2(() => {
      this.OR1([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.EnvironmentOption, {
              assign: (result) => {
                element.environmentName.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.VARIABLE, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.EntryStatement_Variable,
              );
              element.variable.push(token.image as "VARIABLE");
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.LIMITED, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.EntryStatement_Limited,
              );
              element.limited.push(token.image as "LIMITED");
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.ReturnsOption, {
              assign: (result) => {
                element.returns.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.Options, {
              assign: (result) => {
                element.options.push(result);
              },
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EntryStatement_Semicolon);
    });

    return this.pop<ast.EntryStatement>();
  });

  EnvironmentOption = this.RULE("EnvironmentOption", () => {
    const element = this.push(ast.createEnvironmentOption());
    this.CONSUME_ASSIGN1(tokens.EXTERNAL, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EntryStatement_EXTERNAL);
    });
    this.OPTION3(() => {
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EntryStatement_OpenParenEnv,
        );
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.environment = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EntryStatement_CloseParenEnv,
        );
      });
    });
    return this.pop<ast.EnvironmentOption>();
  });

  private createStatement(): ast.Statement {
    return {
      kind: ast.SyntaxKind.Statement,
      container: null,
      condition: null,
      labels: [],
      value: null,
    };
  }

  Statement = this.RULE("Statement", () => {
    let element = this.push(this.createStatement());

    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.ConditionPrefix, {
        assign: (result) => {
          element.condition = result;
        },
      });
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.LabelPrefix, {
        assign: (result) => {
          element.labels.push(result);
        },
      });
    });
    this.SUBRULE_ASSIGN1(this.Unit, {
      assign: (result) => {
        element.value = result;
      },
    });

    return this.pop<ast.Statement>();
  });

  Unit = this.OR_RULE<ast.Unit>("Unit", () => [
    this.DeclareStatement,
    this.AllocateStatement,
    this.AssertStatement,
    this.AttachStatement,
    this.BeginStatement,
    this.CallStatement,
    this.CancelThreadStatement,
    this.CloseStatement,
    this.DefaultStatement,
    this.DefineAliasStatement,
    this.DefineOrdinalStatement,
    this.DefineStructureStatement,
    this.DelayStatement,
    this.DeleteStatement,
    this.DetachStatement,
    this.DisplayStatement,
    this.DoStatement,
    this.EntryStatement,
    this.ExecStatement,
    this.ExitStatement,
    this.FetchStatement,
    this.FlushStatement,
    this.FormatStatement,
    this.FreeStatement,
    this.GetStatement,
    this.GoToStatement,
    this.IfStatement,
    this.IterateStatement,
    this.LeaveStatement,
    this.LocateStatement,
    this.NullStatement,
    this.OnStatement,
    this.OpenStatement,
    this.ProcincDirective, // TODO integrate into preprocessor
    this.PutStatement,
    this.QualifyStatement,
    this.ReadStatement,
    this.ReinitStatement,
    this.ReleaseStatement,
    this.ResignalStatement,
    this.ReturnStatement,
    this.RevertStatement,
    this.RewriteStatement,
    this.SelectStatement,
    this.SignalStatement,
    this.StopStatement,
    this.WaitStatement,
    this.WriteStatement,
    this.ProcedureStatement,
    this.Package,
    this.AssignmentStatement,
  ]);

  private createAllocateStatement(): ast.AllocateStatement {
    return {
      kind: ast.SyntaxKind.AllocateStatement,
      container: null,
      variables: [],
    };
  }

  AllocateStatement = this.RULE("AllocateStatement", () => {
    let element = this.push(this.createAllocateStatement());

    this.CONSUME_ASSIGN1(tokens.ALLOCATE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AllocateStatement_ALLOCATE);
    });
    this.SUBRULE_ASSIGN1(this.AllocatedVariable, {
      assign: (result) => {
        element.variables.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.AllocateStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.AllocatedVariable, {
        assign: (result) => {
          element.variables.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AllocateStatement_Semicolon,
      );
    });

    return this.pop<ast.AllocateStatement>();
  });
  private createAllocatedVariable(): ast.AllocatedVariable {
    return {
      kind: ast.SyntaxKind.AllocatedVariable,
      container: null,
      level: null,
      var: null,
      attribute: null,
    };
  }

  AllocatedVariable = this.RULE("AllocatedVariable", () => {
    let element = this.push(this.createAllocatedVariable());

    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AllocatedVariable_LevelNumber,
        );
        element.level = token.image;
      });
    });
    this.SUBRULE_ASSIGN1(this.ReferenceItem, {
      assign: (result) => {
        element.var = result;
      },
    });
    this.OPTION2(() => {
      this.SUBRULE_ASSIGN1(this.AllocateAttribute, {
        assign: (result) => {
          element.attribute = result;
        },
      });
    });

    return this.pop<ast.AllocatedVariable>();
  });

  AllocateAttribute = this.OR_RULE<ast.AllocateAttribute>(
    "AllocateAttribute",
    () => [
      this.AllocateDimension,
      this.AllocateType,
      this.AllocateLocationReferenceIn,
      this.AllocateLocationReferenceSet,
      this.InitialAttribute,
    ],
  );

  private createAllocateLocationReferenceIn(): ast.AllocateLocationReferenceIn {
    return {
      kind: ast.SyntaxKind.AllocateLocationReferenceIn,
      container: null,
      area: null,
    };
  }

  AllocateLocationReferenceIn = this.RULE("AllocateLocationReferenceIn", () => {
    let element = this.push(this.createAllocateLocationReferenceIn());

    this.CONSUME_ASSIGN1(tokens.IN, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AllocateLocationReferenceIn_IN,
      );
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AllocateLocationReferenceIn_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.area = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AllocateLocationReferenceIn_CloseParen,
      );
    });

    return this.pop<ast.AllocateLocationReferenceIn>();
  });
  private createAllocateLocationReferenceSet(): ast.AllocateLocationReferenceSet {
    return {
      kind: ast.SyntaxKind.AllocateLocationReferenceSet,
      container: null,
      locatorVariable: null,
    };
  }

  AllocateLocationReferenceSet = this.RULE(
    "AllocateLocationReferenceSet",
    () => {
      let element = this.push(this.createAllocateLocationReferenceSet());

      this.CONSUME_ASSIGN1(tokens.SET, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AllocateLocationReferenceSet_SET,
        );
      });
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AllocateLocationReferenceSet_OpenParen,
        );
      });
      this.SUBRULE_ASSIGN1(this.LocatorCall, {
        assign: (result) => {
          element.locatorVariable = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AllocateLocationReferenceSet_CloseParen,
        );
      });

      return this.pop<ast.AllocateLocationReferenceSet>();
    },
  );
  private createAllocateDimension(): ast.AllocateDimension {
    return {
      kind: ast.SyntaxKind.AllocateDimension,
      container: null,
      dimensions: null,
    };
  }

  AllocateDimension = this.RULE("AllocateDimension", () => {
    let element = this.push(this.createAllocateDimension());

    this.SUBRULE_ASSIGN1(this.Dimensions, {
      assign: (result) => {
        element.dimensions = result;
      },
    });

    return this.pop<ast.AllocateDimension>();
  });
  private createAllocateType(): ast.AllocateType {
    return {
      kind: ast.SyntaxKind.AllocateType,
      container: null,
      type: null,
      dimensions: null,
    };
  }

  AllocateType = this.RULE("AllocateType", () => {
    let element = this.push(this.createAllocateType());

    this.CONSUME_ASSIGN(tokens.AllocateAttributeType, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AllocateAttributeType_Type);
      element.type = token.image as ast.AllocateAttributeType;
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.Dimensions, {
        assign: (result) => {
          element.dimensions = result;
        },
      });
    });

    return this.pop<ast.AllocateType>();
  });

  private createAssertStatement(): ast.AssertStatement {
    return {
      kind: ast.SyntaxKind.AssertStatement,
      container: null,
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

  AssertStatement = this.RULE("AssertStatement", () => {
    let element = this.push(this.createAssertStatement());

    this.CONSUME_ASSIGN1(tokens.ASSERT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AssertStatement_ASSERT);
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Boolean, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_Boolean,
            );
            if (token.image.toUpperCase() === "TRUE") {
              element.true = true;
            } else {
              element.false = true;
            }
          });
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_OpenParen0,
            );
          });
          this.SUBRULE_ASSIGN1(this.Expression, {
            assign: (result) => {
              element.actual = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_CloseParen0,
            );
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.COMPARE, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_COMPARE,
            );
            element.compare = true;
          });
          this.CONSUME_ASSIGN3(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_OpenParen1,
            );
          });
          this.SUBRULE_ASSIGN3(this.Expression, {
            assign: (result) => {
              element.actual = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_Comma0,
            );
          });
          this.SUBRULE_ASSIGN4(this.Expression, {
            assign: (result) => {
              element.expected = result;
            },
          });
          this.OPTION1(() => {
            this.CONSUME_ASSIGN2(tokens.Comma, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.AssertStatement_Comma1,
              );
            });
            this.CONSUME_ASSIGN1(tokens.STRING_TERM, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.AssertStatement_OperatorString,
              );
              element.operator = token.image;
            });
          });
          this.CONSUME_ASSIGN3(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_CloseParen1,
            );
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.UNREACHABLE, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.AssertStatement_UNREACHABLE,
            );
            element.unreachable = true;
          });
        },
      },
    ]);
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.TEXT, (token) => {
        this.tokenPayload(token, element, CstNodeKind.AssertStatement_TEXT);
      });
      this.SUBRULE_ASSIGN5(this.Expression, {
        assign: (result) => {
          element.displayExpression = result;
        },
      });
    });

    return this.pop<ast.AssertStatement>();
  });
  private createAssignmentStatement(): ast.AssignmentStatement {
    return {
      kind: ast.SyntaxKind.AssignmentStatement,
      container: null,
      refs: [],
      operator: null,
      expression: null,
      dimacrossExpr: null,
    };
  }

  AssignmentStatement = this.RULE("AssignmentStatement", () => {
    let element = this.push(this.createAssignmentStatement());

    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.refs.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AssignmentStatement_Comma0,
        );
      });
      this.SUBRULE_ASSIGN2(this.LocatorCall, {
        assign: (result) => {
          element.refs.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN(tokens.AssignmentOperator, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AssignmentStatement_Operator,
      );
      element.operator = token.image as ast.AssignmentOperator;
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.expression = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN2(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AssignmentStatement_Comma1,
        );
      });
      this.CONSUME_ASSIGN1(tokens.BY, (token) => {
        this.tokenPayload(token, element, CstNodeKind.AssignmentStatement_BY);
      });
      this.OR1([
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.NAME, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.AssignmentStatement_NAME,
              );
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.DIMACROSS, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.AssignmentStatement_DIMACROSS,
              );
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
              assign: (result) => {
                element.dimacrossExpr = result;
              },
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AssignmentStatement_Semicolon,
      );
    });

    return this.pop<ast.AssignmentStatement>();
  });

  private createAttachStatement(): ast.AttachStatement {
    return {
      kind: ast.SyntaxKind.AttachStatement,
      container: null,
      reference: null,
      task: null,
      environment: false,
      tstack: null,
    };
  }

  AttachStatement = this.RULE("AttachStatement", () => {
    let element = this.push(this.createAttachStatement());

    this.CONSUME_ASSIGN1(tokens.ATTACH, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AttachStatement_ATTACH);
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.reference = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.THREAD, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AttachStatement_THREAD);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AttachStatement_OpenParenTask,
      );
    });
    this.SUBRULE_ASSIGN2(this.LocatorCall, {
      assign: (result) => {
        element.task = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.AttachStatement_CloseParenTask,
      );
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.ENVIRONMENT, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AttachStatement_ENVIRONMENT,
        );
        element.environment = true;
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AttachStatement_OpenParenEnvironment,
        );
      });
      this.OPTION1(() => {
        this.CONSUME_ASSIGN1(tokens.TSTACK, (token) => {
          this.tokenPayload(token, element, CstNodeKind.AttachStatement_TSTACK);
        });
        this.CONSUME_ASSIGN3(tokens.OpenParen, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.AttachStatement_OpenParenTStack,
          );
        });
        this.SUBRULE_ASSIGN1(this.Expression, {
          assign: (result) => {
            element.tstack = result;
          },
        });
        this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.AttachStatement_CloseParenTStack,
          );
        });
      });
      this.CONSUME_ASSIGN3(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.AttachStatement_CloseParenEnvironment,
        );
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AttachStatement_Semicolon);
    });

    return this.pop<ast.AttachStatement>();
  });
  private createBeginStatement(): ast.BeginStatement {
    return {
      kind: ast.SyntaxKind.BeginStatement,
      container: null,
      options: null,
      recursive: false,
      statements: [],
      end: null,
      order: false,
      reorder: false,
    };
  }

  BeginStatement = this.RULE("BeginStatement", () => {
    let element = this.push(this.createBeginStatement());

    this.CONSUME_ASSIGN1(tokens.BEGIN, (token) => {
      this.tokenPayload(token, element, CstNodeKind.BeginStatement_BEGIN);
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.Options, {
        assign: (result) => {
          element.options = result;
        },
      });
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.RECURSIVE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.BeginStatement_RECURSIVE);
        element.recursive = true;
      });
    });
    this.OPTION3(() => {
      this.CONSUME_ASSIGN1(tokens.ORDER, (token) => {
        this.tokenPayload(token, element, CstNodeKind.BeginStatement_ORDER);
        if (token.image.toUpperCase() === "ORDER") {
          element.order = true;
        } else if (token.image.toUpperCase() === "REORDER") {
          element.reorder = true;
        }
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.BeginStatement_Semicolon0);
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.Statement, {
        assign: (result) => {
          element.statements.push(result);
        },
      });
    });
    this.SUBRULE_ASSIGN1(this.EndStatement, {
      assign: (result) => {
        element.end = result;
      },
    });
    this.CONSUME_ASSIGN2(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.BeginStatement_Semicolon1);
    });

    return this.pop<ast.BeginStatement>();
  });
  private createEndStatement(): ast.EndStatement {
    return {
      kind: ast.SyntaxKind.EndStatement,
      container: null,
      labels: [],
      label: null,
    };
  }

  EndStatement = this.RULE("EndStatement", () => {
    let element = this.push(this.createEndStatement());

    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.LabelPrefix, {
        assign: (result) => {
          element.labels.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.END, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EndStatement_END);
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.LabelReference, {
        assign: (result) => {
          element.label = result;
        },
      });
    });

    return this.pop<ast.EndStatement>();
  });
  private createCallStatement(): ast.CallStatement {
    return {
      kind: ast.SyntaxKind.CallStatement,
      container: null,
      call: null,
    };
  }

  CallStatement = this.RULE("CallStatement", () => {
    let element = this.push(this.createCallStatement());

    this.CONSUME_ASSIGN1(tokens.CALL, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CallStatement_CALL);
    });
    this.SUBRULE_ASSIGN1(this.ProcedureCall, {
      assign: (result) => {
        element.call = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CallStatement_Semicolon);
    });

    return this.pop<ast.CallStatement>();
  });
  private createCancelThreadStatement(): ast.CancelThreadStatement {
    return {
      kind: ast.SyntaxKind.CancelThreadStatement,
      container: null,
      thread: null,
    };
  }

  CancelThreadStatement = this.RULE("CancelThreadStatement", () => {
    let element = this.push(this.createCancelThreadStatement());

    this.CONSUME_ASSIGN1(tokens.CANCEL, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.CancelThreadStatement_CANCEL,
      );
    });
    this.CONSUME_ASSIGN1(tokens.THREAD, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.CancelThreadStatement_THREAD,
      );
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.CancelThreadStatement_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.thread = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.CancelThreadStatement_CloseParen,
      );
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.CancelThreadStatement_Semicolon,
      );
    });

    return this.pop<ast.CancelThreadStatement>();
  });
  private createCloseStatement(): ast.CloseStatement {
    return {
      kind: ast.SyntaxKind.CloseStatement,
      container: null,
      files: [],
    };
  }

  CloseStatement = this.RULE("CloseStatement", () => {
    let element = this.push(this.createCloseStatement());

    this.CONSUME_ASSIGN1(tokens.CLOSE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CloseStatement_CLOSE);
    });
    this.CONSUME_ASSIGN1(tokens.FILE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CloseStatement_FILE0);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CloseStatement_OpenParen0);
    });
    this.OR1([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.MemberCall, {
            assign: (result) => {
              element.files.push(result);
            },
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.CloseStatement_FilesStar0,
            );
            element.files.push(token.image as "*");
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CloseStatement_CloseParen0);
    });
    this.MANY1(() => {
      this.OPTION1(() => {
        this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
          this.tokenPayload(token, element, CstNodeKind.CloseStatement_Comma);
        });
      });
      this.CONSUME_ASSIGN2(tokens.FILE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.CloseStatement_FILE1);
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.CloseStatement_OpenParen);
      });
      this.OR2([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN2(this.MemberCall, {
              assign: (result) => {
                element.files.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN2(tokens.Star, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.CloseStatement_FilesStar1,
              );
              element.files.push(token.image as "*");
            });
          },
        },
      ]);
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.CloseStatement_CloseParen1,
        );
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CloseStatement_Semicolon);
    });

    return this.pop<ast.CloseStatement>();
  });
  private createDefaultStatement(): ast.DefaultStatement {
    return {
      kind: ast.SyntaxKind.DefaultStatement,
      container: null,
      expressions: [],
    };
  }

  DefaultStatement = this.RULE("DefaultStatement", () => {
    let element = this.push(this.createDefaultStatement());

    this.CONSUME_ASSIGN1(tokens.DEFAULT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DefaultStatement_DEFAULT);
    });
    this.SUBRULE_ASSIGN1(this.DefaultExpression, {
      assign: (result) => {
        element.expressions.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DefaultStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.DefaultExpression, {
        assign: (result) => {
          element.expressions.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DefaultStatement_Semicolon);
    });

    return this.pop<ast.DefaultStatement>();
  });
  private createDefaultExpression(): ast.DefaultExpression {
    return {
      kind: ast.SyntaxKind.DefaultExpression,
      container: null,
      expression: null,
      attributes: [],
    };
  }

  DefaultExpression = this.RULE("DefaultExpression", () => {
    let element = this.push(this.createDefaultExpression());

    this.SUBRULE_ASSIGN1(this.DefaultExpressionPart, {
      assign: (result) => {
        element.expression = result;
      },
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.DefaultDeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });

    return this.pop<ast.DefaultExpression>();
  });
  private createDefaultExpressionPart(): ast.DefaultExpressionPart {
    return {
      kind: ast.SyntaxKind.DefaultExpressionPart,
      container: null,
      expression: null,
      identifiers: null,
    };
  }

  DefaultExpressionPart = this.RULE("DefaultExpressionPart", () => {
    let element = this.push(this.createDefaultExpressionPart());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.DESCRIPTORS, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DefaultExpressionPart_DESCRIPTORS,
            );
          });
          this.SUBRULE_ASSIGN1(this.DefaultAttributeExpression, {
            assign: (result) => {
              element.expression = result;
            },
          });
        },
      },
      {
        ALT: () => {
          this.OR2([
            {
              ALT: () => {
                this.CONSUME_ASSIGN1(tokens.RANGE, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.DefaultExpressionPart_RANGE,
                  );
                });
                this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.DefaultExpressionPart_OpenParenRange,
                  );
                });
                this.SUBRULE_ASSIGN1(this.DefaultRangeIdentifiers, {
                  assign: (result) => {
                    element.identifiers = result;
                  },
                });
                this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.DefaultExpressionPart_CloseParenRange,
                  );
                });
              },
            },
            {
              ALT: () => {
                this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.DefaultExpressionPart_OpenParenAttribute,
                  );
                });
                this.SUBRULE_ASSIGN2(this.DefaultAttributeExpression, {
                  assign: (result) => {
                    element.expression = result;
                  },
                });
                this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.DefaultExpressionPart_CloseParenAttribute,
                  );
                });
              },
            },
          ]);
        },
      },
    ]);

    return this.pop<ast.DefaultExpressionPart>();
  });
  private createDefaultRangeIdentifiers(): ast.DefaultRangeIdentifiers {
    return {
      kind: ast.SyntaxKind.DefaultRangeIdentifiers,
      container: null,
      identifiers: [],
    };
  }

  DefaultRangeIdentifiers = this.RULE("DefaultRangeIdentifiers", () => {
    let element = this.push(this.createDefaultRangeIdentifiers());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DefaultRangeIdentifiers_Star0,
            );
            element.identifiers.push(token.image as "*");
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.DefaultRangeIdentifierItem, {
            assign: (result) => {
              element.identifiers.push(result);
            },
          });
        },
      },
    ]);
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefaultRangeIdentifiers_Comma,
        );
      });
      this.OR2([
        {
          ALT: () => {
            this.CONSUME_ASSIGN2(tokens.Star, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefaultRangeIdentifiers_Star1,
              );
              element.identifiers.push(token.image as "*");
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN2(this.DefaultRangeIdentifierItem, {
              assign: (result) => {
                element.identifiers.push(result);
              },
            });
          },
        },
      ]);
    });

    return this.pop<ast.DefaultRangeIdentifiers>();
  });
  private createDefaultRangeIdentifierItem(): ast.DefaultRangeIdentifierItem {
    return {
      kind: ast.SyntaxKind.DefaultRangeIdentifierItem,
      container: null,
      from: null,
      to: null,
    };
  }

  DefaultRangeIdentifierItem = this.RULE("DefaultRangeIdentifierItem", () => {
    let element = this.push(this.createDefaultRangeIdentifierItem());

    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefaultRangeIdentifierItem_FromID,
      );
      element.from = token.image;
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.Colon, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefaultRangeIdentifierItem_Colon,
        );
      });
      this.CONSUME_ASSIGN2(tokens.ID, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefaultRangeIdentifierItem_ToID,
        );
        element.to = token.image;
      });
    });

    return this.pop<ast.DefaultRangeIdentifierItem>();
  });
  private createDefaultAttributeExpression(): ast.DefaultAttributeExpression {
    return {
      kind: ast.SyntaxKind.DefaultAttributeExpression,
      container: null,
      items: [],
      operators: [],
    };
  }

  DefaultAttributeExpression = this.RULE("DefaultAttributeExpression", () => {
    let element = this.push(this.createDefaultAttributeExpression());

    this.SUBRULE_ASSIGN1(this.DefaultAttributeExpressionNot, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.DefaultAttributeBinaryOperator, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefaultAttributeExpression_Operators,
        );
        element.operators.push(
          token.image as ast.DefaultAttributeExpression["operators"][0],
        );
      });
      this.SUBRULE_ASSIGN2(this.DefaultAttributeExpressionNot, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });

    return this.pop<ast.DefaultAttributeExpression>();
  });
  private createDefaultAttributeExpressionNot(): ast.DefaultAttributeExpressionNot {
    return {
      kind: ast.SyntaxKind.DefaultAttributeExpressionNot,
      container: null,
      not: false,
      value: null,
    };
  }

  DefaultAttributeExpressionNot = this.RULE(
    "DefaultAttributeExpressionNot",
    () => {
      let element = this.push(this.createDefaultAttributeExpressionNot());

      this.OPTION1(() => {
        this.CONSUME_ASSIGN1(tokens.NOT, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.DefaultAttributeExpressionNot_NOT,
          );
          element.not = true;
        });
      });
      this.CONSUME_ASSIGN(tokens.DefaultAttribute, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DefaultAttribute_Value);
        element.value = token.image as ast.DefaultAttribute;
      });

      return this.pop<ast.DefaultAttributeExpressionNot>();
    },
  );

  private createDefineAliasStatement(): ast.DefineAliasStatement {
    return {
      kind: ast.SyntaxKind.DefineAliasStatement,
      container: null,
      name: null,
      xDefine: false,
      attributes: [],
    };
  }

  DefineAliasStatement = this.RULE("DefineAliasStatement", () => {
    let element = this.push(this.createDefineAliasStatement());

    this.CONSUME_ASSIGN1(tokens.DEFINE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineAliasStatement_DEFINE,
      );
      if (token.image.charAt(0).toUpperCase() === "X") {
        element.xDefine = true;
      }
    });
    this.CONSUME_ASSIGN1(tokens.ALIAS, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_ALIAS);
    });
    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DefineAliasStatement_Name);
      element.name = token.image;
    });
    this.OPTION2(() => {
      this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
      this.MANY1(() => {
        this.OPTION1(() => {
          this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DefineAliasStatement_Comma,
            );
          });
        });
        this.SUBRULE_ASSIGN2(this.DeclarationAttribute, {
          assign: (result) => {
            element.attributes.push(result);
          },
        });
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineAliasStatement_Semicolon,
      );
    });

    return this.pop<ast.DefineAliasStatement>();
  });
  private createDefineOrdinalStatement(): ast.DefineOrdinalStatement {
    return {
      kind: ast.SyntaxKind.DefineOrdinalStatement,
      container: null,
      name: null,
      ordinalValues: null,
      xDefine: false,
      attributes: [],
      precision: null,
    };
  }

  DefineOrdinalStatement = this.RULE("DefineOrdinalStatement", () => {
    let element = this.push(this.createDefineOrdinalStatement());

    this.CONSUME_ASSIGN1(tokens.DEFINE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineOrdinalStatement_DEFINE,
      );
      if (token.image.charAt(0).toUpperCase() === "X") {
        element.xDefine = true;
      }
    });
    this.CONSUME_ASSIGN1(tokens.ORDINAL, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineOrdinalStatement_ORDINAL,
      );
    });
    this.SUBRULE_ASSIGN1(this.FQN, {
      assign: (result) => {
        element.name = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineOrdinalStatement_OpenParenValues,
      );
    });
    this.SUBRULE_ASSIGN1(this.OrdinalValueList, {
      assign: (result) => {
        element.ordinalValues = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineOrdinalStatement_CloseParenValues,
      );
    });

    // zero or more attributes following
    this.MANY(() => {
      // either signed/unsigned OR a precision attribute
      this.OR2([
        {
          // signed
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.SIGNED, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefineOrdinalStatement_Signed0,
              );
              element.attributes.push(token.image as "SIGNED");
            });
          },
        },
        {
          // unsigned
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.UNSIGNED, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefineOrdinalStatement_Unsigned0,
              );
              element.attributes.push(token.image as "UNSIGNED");
            });
          },
        },
        {
          // attribute w/ precision val (will only take one)
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.PRECISION, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefineOrdinalStatement_PRECISION,
              );
              element.attributes.push(token.image as "PRECISION" | "PREC");
            });
            this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefineOrdinalStatement_OpenParenPrecision,
              );
            });
            this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefineOrdinalStatement_PrecisionNumber,
              );
              // will override prior precisions (but this parses in 6.1 PL/I strangely enough)
              element.precision = token.image;
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DefineOrdinalStatement_CloseParenPrecision,
              );
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineOrdinalStatement_Semicolon,
      );
    });

    return this.pop<ast.DefineOrdinalStatement>();
  });
  private createOrdinalValueList(): ast.OrdinalValueList {
    return {
      kind: ast.SyntaxKind.OrdinalValueList,
      container: null,
      members: [],
    };
  }

  OrdinalValueList = this.RULE("OrdinalValueList", () => {
    let element = this.push(this.createOrdinalValueList());

    this.SUBRULE_ASSIGN1(this.OrdinalValue, {
      assign: (result) => {
        element.members.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OrdinalValueList_Comma);
      });
      this.SUBRULE_ASSIGN2(this.OrdinalValue, {
        assign: (result) => {
          element.members.push(result);
        },
      });
    });

    return this.pop<ast.OrdinalValueList>();
  });
  private createOrdinalValue(): ast.OrdinalValue {
    return {
      kind: ast.SyntaxKind.OrdinalValue,
      container: null,
      name: null,
      nameToken: null,
      value: null,
    };
  }

  OrdinalValue = this.RULE("OrdinalValue", () => {
    let element = this.push(this.createOrdinalValue());

    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.OrdinalValue_Name);
      element.name = token.image;
      element.nameToken = token;
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.VALUE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OrdinalValue_VALUE);
      });
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OrdinalValue_OpenParen);
      });
      this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OrdinalValue_ValueNumber);
        element.value = token.image;
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OrdinalValue_CloseParen);
      });
    });

    return this.pop<ast.OrdinalValue>();
  });
  private createDefineStructureStatement(): ast.DefineStructureStatement {
    return {
      kind: ast.SyntaxKind.DefineStructureStatement,
      container: null,
      xDefine: false,
      level: null,
      name: null,
      union: false,
      substructures: [],
    };
  }

  DefineStructureStatement = this.RULE("DefineStructureStatement", () => {
    let element = this.push(this.createDefineStructureStatement());

    this.CONSUME_ASSIGN1(tokens.DEFINE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineStructureStatement_DEFINE,
      );
      if (token.image.charAt(0).toUpperCase() === "X") {
        element.xDefine = true;
      }
    });
    this.CONSUME_ASSIGN1(tokens.STRUCTURE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineStructureStatement_STRUCTURE,
      );
    });
    this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineStructureStatement_LevelNumber,
      );
      element.level = token.image;
    });
    this.SUBRULE_ASSIGN1(this.FQN, {
      assign: (result) => {
        element.name = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.UNION, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefineStructureStatement_UNION,
        );
        element.union = true;
      });
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefineStructureStatement_Comma,
        );
      });
      this.SUBRULE_ASSIGN1(this.SubStructure, {
        assign: (result) => {
          element.substructures.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefineStructureStatement_Semicolon,
      );
    });

    return this.pop<ast.DefineStructureStatement>();
  });
  private createSubStructure(): ast.SubStructure {
    return {
      kind: ast.SyntaxKind.SubStructure,
      container: null,
      level: null,
      name: null,
      attributes: [],
    };
  }

  SubStructure = this.RULE("SubStructure", () => {
    let element = this.push(this.createSubStructure());

    this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SubStructure_LevelNumber);
      element.level = token.image;
    });
    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SubStructure_Name);
      element.name = token.image;
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });

    return this.pop<ast.SubStructure>();
  });

  private createDelayStatement(): ast.DelayStatement {
    return {
      kind: ast.SyntaxKind.DelayStatement,
      container: null,
      delay: null,
    };
  }

  DelayStatement = this.RULE("DelayStatement", () => {
    let element = this.push(this.createDelayStatement());

    this.CONSUME_ASSIGN1(tokens.DELAY, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DelayStatement_DELAY);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DelayStatement_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.delay = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DelayStatement_CloseParen);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DelayStatement_Semicolon);
    });

    return this.pop<ast.DelayStatement>();
  });

  private createDeleteStatement(): ast.DeleteStatement {
    return {
      kind: ast.SyntaxKind.DeleteStatement,
      container: null,
      file: null,
      key: null,
    };
  }

  DeleteStatement = this.RULE("DeleteStatement", () => {
    let element = this.push(this.createDeleteStatement());

    this.CONSUME_ASSIGN1(tokens.DELETE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DeleteStatement_DELETE);
    });
    this.CONSUME_ASSIGN1(tokens.FILE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DeleteStatement_FILE);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DeleteStatement_OpenParenFile,
      );
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.file = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DeleteStatement_CloseParenFile,
      );
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.KEY, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DeleteStatement_KEY);
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DeleteStatement_OpenParenKey,
        );
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.key = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DeleteStatement_CloseParenKey,
        );
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DeleteStatement_Semicolon);
    });

    return this.pop<ast.DeleteStatement>();
  });

  private createDetachStatement(): ast.DetachStatement {
    return {
      kind: ast.SyntaxKind.DetachStatement,
      container: null,
      reference: null,
    };
  }

  DetachStatement = this.RULE("DetachStatement", () => {
    let element = this.push(this.createDetachStatement());

    this.CONSUME_ASSIGN1(tokens.DETACH, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DetachStatement_DETACH);
    });
    this.CONSUME_ASSIGN1(tokens.THREAD, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DetachStatement_THREAD);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DetachStatement_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.reference = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DetachStatement_CloseParen);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DetachStatement_Semicolon);
    });

    return this.pop<ast.DetachStatement>();
  });

  private createDisplayStatement(): ast.DisplayStatement {
    return {
      kind: ast.SyntaxKind.DisplayStatement,
      container: null,
      expression: null,
      reply: null,
      rout: [],
      desc: [],
    };
  }

  DisplayStatement = this.RULE("DisplayStatement", () => {
    let element = this.push(this.createDisplayStatement());

    this.CONSUME_ASSIGN1(tokens.DISPLAY, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DisplayStatement_DISPLAY);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DisplayStatement_OpenParenExpression,
      );
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.expression = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DisplayStatement_CloseParenExpression,
      );
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.REPLY, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DisplayStatement_REPLY);
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DisplayStatement_OpenParenReply,
        );
      });
      this.SUBRULE_ASSIGN1(this.LocatorCall, {
        assign: (result) => {
          element.reply = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DisplayStatement_CloseParenReply,
        );
      });
    });
    this.OPTION3(() => {
      this.CONSUME_ASSIGN1(tokens.ROUTCDE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DisplayStatement_ROUTCDE);
      });
      this.CONSUME_ASSIGN3(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DisplayStatement_OpenParenRout,
        );
      });
      this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DisplayStatement_RoutNumber0,
        );
        element.rout.push(token.image);
      });
      this.MANY1(() => {
        this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.DisplayStatement_CommaRout,
          );
        });
        this.CONSUME_ASSIGN2(tokens.NUMBER, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.DisplayStatement_RoutNumber1,
          );
          element.rout.push(token.image);
        });
      });
      this.CONSUME_ASSIGN3(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DisplayStatement_CloseParenRout,
        );
      });
      this.OPTION2(() => {
        this.CONSUME_ASSIGN1(tokens.DESC, (token) => {
          this.tokenPayload(token, element, CstNodeKind.DisplayStatement_DESC);
        });
        this.CONSUME_ASSIGN4(tokens.OpenParen, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.DisplayStatement_OpenParenDesc,
          );
        });
        this.CONSUME_ASSIGN3(tokens.NUMBER, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.DisplayStatement_DescNumber0,
          );
          element.desc.push(token.image);
        });
        this.MANY2(() => {
          this.CONSUME_ASSIGN2(tokens.Comma, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DisplayStatement_CommaDesc,
            );
          });
          this.CONSUME_ASSIGN4(tokens.NUMBER, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DisplayStatement_DescNumber1,
            );
            element.desc.push(token.image);
          });
        });
        this.CONSUME_ASSIGN4(tokens.CloseParen, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.DisplayStatement_CloseParenDesc,
          );
        });
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DisplayStatement_Semicolon);
    });

    return this.pop<ast.DisplayStatement>();
  });

  DoStatement = this.RULE("DoStatement", () => {
    let element = this.push(ast.createDoStatement());

    this.CONSUME_ASSIGN1(tokens.DO, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoStatement_DO);
    });
    this.OPTION1(() => {
      this.OR1([
        {
          GATE: () => this.LA(2).tokenTypeIdx !== tokens.Equals.tokenTypeIdx,
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.DoType2, {
              assign: (result) => {
                element.doType2 = result;
              },
            });
          },
        },
        {
          GATE: () => this.LA(2).tokenTypeIdx === tokens.Equals.tokenTypeIdx,
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.DoType3, {
              assign: (result) => {
                element.doType3 = result;
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.LOOP, (token) => {
              this.tokenPayload(token, element, CstNodeKind.DoStatement_LOOP);
              element.doType4 = true;
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoStatement_Semicolon0);
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.Statement, {
        assign: (result) => {
          element.statements.push(result);
        },
      });
    });
    this.SUBRULE_ASSIGN1(this.EndStatement, {
      assign: (result) => {
        element.end = result;
      },
    });
    this.CONSUME_ASSIGN2(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoStatement_Semicolon1);
    });

    return this.pop<ast.DoStatement>();
  });

  DoType2 = this.OR_RULE<ast.DoType2>("DoType2", () => [
    this.DoWhile,
    this.DoUntil,
  ]);

  DoWhile = this.RULE("DoWhile", () => {
    let element = this.push(ast.createDoWhile());

    this.CONSUME_ASSIGN1(tokens.WHILE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoWhile_WHILE);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoWhile_OpenParenWhile);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.while = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoWhile_CloseParenWhile);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.UNTIL, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoWhile_UNTIL);
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoWhile_OpenParenUntil);
      });
      this.SUBRULE_ASSIGN2(this.Expression, {
        assign: (result) => {
          element.until = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoWhile_CloseParenUntil);
      });
    });

    return this.pop<ast.DoWhile>();
  });

  DoUntil = this.RULE("DoUntil", () => {
    let element = this.push(ast.createDoUntil());

    this.CONSUME_ASSIGN1(tokens.UNTIL, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoUntil_UNTIL);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoUntil_OpenParenUntil);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.until = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoUntil_CloseParenUntil);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.WHILE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoUntil_WHILE);
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoUntil_OpenParenWhile);
      });
      this.SUBRULE_ASSIGN2(this.Expression, {
        assign: (result) => {
          element.while = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoUntil_CloseParenWhile);
      });
    });

    return this.pop<ast.DoUntil>();
  });

  DoType3 = this.RULE("DoType3", () => {
    let element = this.push(ast.createDoType3());

    this.SUBRULE_ASSIGN1(this.ReferenceItem, {
      assign: (result) => {
        element.variable = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.Equals, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DoType3_Equals);
    });
    this.SUBRULE_ASSIGN1(this.DoSpecification, {
      assign: (result) => {
        element.specifications.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DoType3_Comma);
      });
      this.SUBRULE_ASSIGN2(this.DoSpecification, {
        assign: (result) => {
          element.specifications.push(result);
        },
      });
    });

    return this.pop<ast.DoType3>();
  });

  private createDoSpecification(): ast.DoSpecification {
    return {
      kind: ast.SyntaxKind.DoSpecification,
      container: null,
      expression: null,
      upthru: null,
      downthru: null,
      repeat: null,
      whileOrUntil: null,
      to: null,
      by: null,
    };
  }

  DoSpecification = this.RULE("DoSpecification", () => {
    let element = this.push(this.createDoSpecification());

    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.expression = result;
      },
    });
    this.OPTION3(() => {
      this.OR1([
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.TO, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DoSpecification_TO0,
              );
            });
            this.SUBRULE_ASSIGN2(this.Expression, {
              assign: (result) => {
                element.to = result;
              },
            });
            this.OPTION1(() => {
              this.CONSUME_ASSIGN1(tokens.BY, (token) => {
                this.tokenPayload(
                  token,
                  element,
                  CstNodeKind.DoSpecification_BY0,
                );
              });
              this.SUBRULE_ASSIGN3(this.Expression, {
                assign: (result) => {
                  element.by = result;
                },
              });
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN2(tokens.BY, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DoSpecification_BY1,
              );
            });
            this.SUBRULE_ASSIGN4(this.Expression, {
              assign: (result) => {
                element.by = result;
              },
            });
            this.OPTION2(() => {
              this.CONSUME_ASSIGN2(tokens.TO, (token) => {
                this.tokenPayload(
                  token,
                  element,
                  CstNodeKind.DoSpecification_TO1,
                );
              });
              this.SUBRULE_ASSIGN5(this.Expression, {
                assign: (result) => {
                  element.to = result;
                },
              });
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.UPTHRU, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DoSpecification_UPTHRU,
              );
            });
            this.SUBRULE_ASSIGN6(this.Expression, {
              assign: (result) => {
                element.upthru = result;
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.DOWNTHRU, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DoSpecification_DOWNTHRU,
              );
            });
            this.SUBRULE_ASSIGN7(this.Expression, {
              assign: (result) => {
                element.downthru = result;
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.REPEAT, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DoSpecification_REPEAT,
              );
            });
            this.SUBRULE_ASSIGN8(this.Expression, {
              assign: (result) => {
                element.repeat = result;
              },
            });
          },
        },
      ]);
    });
    this.OPTION4(() => {
      this.OR2([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.DoWhile, {
              assign: (result) => {
                element.whileOrUntil = result;
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.DoUntil, {
              assign: (result) => {
                element.whileOrUntil = result;
              },
            });
          },
        },
      ]);
    });

    return this.pop<ast.DoSpecification>();
  });
  private createExecStatement(): ast.ExecStatement {
    return {
      kind: ast.SyntaxKind.ExecStatement,
      container: null,
      query: null,
    };
  }

  ExecStatement = this.RULE("ExecStatement", () => {
    let element = this.push(this.createExecStatement());

    this.CONSUME_ASSIGN1(tokens.EXEC, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ExecStatement_EXEC);
    });
    this.CONSUME_ASSIGN1(tokens.ExecFragment, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ExecStatement_Query);
      element.query = token.image;
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ExecStatement_Semicolon);
    });

    return this.pop<ast.ExecStatement>();
  });

  private createExitStatement(): ast.ExitStatement {
    return { kind: ast.SyntaxKind.ExitStatement, container: null };
  }

  ExitStatement = this.RULE("ExitStatement", () => {
    let element = this.push(this.createExitStatement());

    this.CONSUME_ASSIGN1(tokens.EXIT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ExitStatement_EXIT);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ExitStatement_Semicolon);
    });

    return this.pop<ast.ExitStatement>();
  });

  private createFetchStatement(): ast.FetchStatement {
    return {
      kind: ast.SyntaxKind.FetchStatement,
      container: null,
      entries: [],
    };
  }

  FetchStatement = this.RULE("FetchStatement", () => {
    let element = this.push(this.createFetchStatement());

    this.CONSUME_ASSIGN1(tokens.FETCH, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FetchStatement_FETCH);
    });
    this.SUBRULE_ASSIGN1(this.FetchEntry, {
      assign: (result) => {
        element.entries.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FetchStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.FetchEntry, {
        assign: (result) => {
          element.entries.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FetchStatement_Semicolon);
    });

    return this.pop<ast.FetchStatement>();
  });

  private createFetchEntry(): ast.FetchEntry {
    return {
      kind: ast.SyntaxKind.FetchEntry,
      container: null,
      entry: null,
      set: null,
      title: null,
    };
  }

  FetchEntry = this.RULE("FetchEntry", () => {
    let element = this.push(this.createFetchEntry());
    this.SUBRULE_ASSIGN1(this.ReferenceItem, {
      assign: (result) => {
        element.entry = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.SET, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FetchEntry_SET);
      });
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FetchEntry_OpenParenSet);
      });
      this.SUBRULE_ASSIGN1(this.LocatorCall, {
        assign: (result) => {
          element.set = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FetchEntry_CloseParenSet);
      });
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.TITLE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FetchEntry_TITLE);
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.FetchEntry_OpenParenTitle,
        );
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.title = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.FetchEntry_CloseParenTitle,
        );
      });
    });

    return this.pop<ast.FetchEntry>();
  });

  private createFlushStatement(): ast.FlushStatement {
    return {
      kind: ast.SyntaxKind.FlushStatement,
      container: null,
      file: null,
    };
  }

  FlushStatement = this.RULE("FlushStatement", () => {
    let element = this.push(this.createFlushStatement());

    this.CONSUME_ASSIGN1(tokens.FLUSH, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FlushStatement_FLUSH);
    });
    this.CONSUME_ASSIGN1(tokens.FILE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FlushStatement_FILE);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FlushStatement_OpenParen);
    });
    this.OR1([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.LocatorCall, {
            assign: (result) => {
              element.file = result;
            },
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            this.tokenPayload(token, element, CstNodeKind.FlushStatement_Star);
            element.file = token.image as "*";
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FlushStatement_CloseParen);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FlushStatement_Semicolon);
    });

    return this.pop<ast.FlushStatement>();
  });
  private createFormatStatement(): ast.FormatStatement {
    return {
      kind: ast.SyntaxKind.FormatStatement,
      container: null,
      list: null,
    };
  }

  FormatStatement = this.RULE("FormatStatement", () => {
    let element = this.push(this.createFormatStatement());

    this.CONSUME_ASSIGN1(tokens.FORMAT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FormatStatement_FORMAT);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FormatStatement_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.FormatList, {
      assign: (result) => {
        element.list = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FormatStatement_CloseParen);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FormatStatement_Semicolon);
    });

    return this.pop<ast.FormatStatement>();
  });
  private createFormatList(): ast.FormatList {
    return {
      kind: ast.SyntaxKind.FormatList,
      container: null,
      items: [],
    };
  }

  FormatList = this.RULE("FormatList", () => {
    let element = this.push(this.createFormatList());

    this.SUBRULE_ASSIGN1(this.FormatListItem, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FormatList_Comma);
      });
      this.SUBRULE_ASSIGN2(this.FormatListItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });

    return this.pop<ast.FormatList>();
  });

  private createFormatListItem(): ast.FormatListItem {
    return {
      kind: ast.SyntaxKind.FormatListItem,
      container: null,
      level: null,
      item: null,
      list: null,
    };
  }

  FormatListItem = this.RULE("FormatListItem", () => {
    let element = this.push(this.createFormatListItem());

    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.FormatListItemLevel, {
        assign: (result) => {
          element.level = result;
        },
      });
    });
    this.OR1([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.FormatItem, {
            assign: (result) => {
              element.item = result;
            },
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.FormatListItem_OpenParen,
            );
          });
          this.SUBRULE_ASSIGN1(this.FormatList, {
            assign: (result) => {
              element.list = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.FormatListItem_CloseParen,
            );
          });
        },
      },
    ]);

    return this.pop<ast.FormatListItem>();
  });

  private createFormatListItemLevel(): ast.FormatListItemLevel {
    return {
      kind: ast.SyntaxKind.FormatListItemLevel,
      container: null,
      level: null,
    };
  }

  FormatListItemLevel = this.RULE("FormatListItemLevel", () => {
    let element = this.push(this.createFormatListItemLevel());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.FormatListItemLevel_LevelNumber,
            );
            element.level = token.image;
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.FormatListItemLevel_OpenParen,
            );
          });
          this.SUBRULE_ASSIGN1(this.Expression, {
            assign: (result) => {
              element.level = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.FormatListItemLevel_CloseParen,
            );
          });
        },
      },
    ]);

    return this.pop<ast.FormatListItemLevel>();
  });

  FormatItem = this.OR_RULE<ast.FormatItem>("FormatItem", () => [
    this.AFormatItem,
    this.BFormatItem,
    this.CFormatItem,
    this.EFormatItem,
    this.FFormatItem,
    this.PFormatItem,
    this.ColumnFormatItem,
    this.GFormatItem,
    this.LFormatItem,
    this.LineFormatItem,
    this.PageFormatItem,
    this.RFormatItem,
    this.SkipFormatItem,
    this.VFormatItem,
    this.XFormatItem,
  ]);

  AFormatItem = this.RULE("AFormatItem", () => {
    let element = this.push(ast.createAFormatItem());

    this.CONSUME_ASSIGN1(tokens.A, (token) => {
      this.tokenPayload(token, element, CstNodeKind.AFormatItem_A);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.AFormatItem_OpenParen);
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.fieldWidth = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.AFormatItem_CloseParen);
      });
    });

    return this.pop<ast.AFormatItem>();
  });
  private createBFormatItem(): ast.BFormatItem {
    return {
      kind: ast.SyntaxKind.BFormatItem,
      container: null,
      fieldWidth: null,
    };
  }

  BFormatItem = this.RULE("BFormatItem", () => {
    let element = this.push(this.createBFormatItem());

    this.CONSUME_ASSIGN1(tokens.B, (token) => {
      this.tokenPayload(token, element, CstNodeKind.BFormatItem_B);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.BFormatItem_OpenParen);
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.fieldWidth = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.BFormatItem_CloseParen);
      });
    });

    return this.pop<ast.BFormatItem>();
  });
  private createCFormatItem(): ast.CFormatItem {
    return {
      kind: ast.SyntaxKind.CFormatItem,
      container: null,
      item: null,
    };
  }

  CFormatItem = this.RULE("CFormatItem", () => {
    let element = this.push(this.createCFormatItem());

    this.CONSUME_ASSIGN1(tokens.C, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CFormatItem_C);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CFormatItem_OpenParen);
    });
    this.OR1([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.FFormatItem, {
            assign: (result) => {
              element.item = result;
            },
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.EFormatItem, {
            assign: (result) => {
              element.item = result;
            },
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.PFormatItem, {
            assign: (result) => {
              element.item = result;
            },
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.CFormatItem_CloseParen);
    });

    return this.pop<ast.CFormatItem>();
  });

  private createFFormatItem(): ast.FFormatItem {
    return {
      kind: ast.SyntaxKind.FFormatItem,
      container: null,
      fieldWidth: null,
      fractionalDigits: null,
      scalingFactor: null,
    };
  }

  FFormatItem = this.RULE("FFormatItem", () => {
    let element = this.push(this.createFFormatItem());

    this.CONSUME_ASSIGN1(tokens.F, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FFormatItem_F);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FFormatItem_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.fieldWidth = result;
      },
    });
    this.OPTION2(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.FFormatItem_CommaFractional,
        );
      });
      this.SUBRULE_ASSIGN2(this.Expression, {
        assign: (result) => {
          element.fractionalDigits = result;
        },
      });
      this.OPTION1(() => {
        this.CONSUME_ASSIGN2(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.FFormatItem_CommaScalingFactor,
          );
        });
        this.SUBRULE_ASSIGN3(this.Expression, {
          assign: (result) => {
            element.scalingFactor = result;
          },
        });
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FFormatItem_CloseParen);
    });

    return this.pop<ast.FFormatItem>();
  });

  private createEFormatItem(): ast.EFormatItem {
    return {
      kind: ast.SyntaxKind.EFormatItem,
      container: null,
      fieldWidth: null,
      fractionalDigits: null,
      significantDigits: null,
    };
  }

  EFormatItem = this.RULE("EFormatItem", () => {
    let element = this.push(this.createEFormatItem());

    this.CONSUME_ASSIGN1(tokens.E, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EFormatItem_E);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EFormatItem_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.fieldWidth = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EFormatItem_Comma0);
    });
    this.SUBRULE_ASSIGN2(this.Expression, {
      assign: (result) => {
        element.fractionalDigits = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN2(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.EFormatItem_Comma1);
      });
      this.SUBRULE_ASSIGN3(this.Expression, {
        assign: (result) => {
          element.significantDigits = result;
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EFormatItem_CloseParen);
    });

    return this.pop<ast.EFormatItem>();
  });
  private createPFormatItem(): ast.PFormatItem {
    return {
      kind: ast.SyntaxKind.PFormatItem,
      container: null,
      specification: null,
    };
  }

  PFormatItem = this.RULE("PFormatItem", () => {
    let element = this.push(this.createPFormatItem());

    this.CONSUME_ASSIGN1(tokens.P, (token) => {
      this.tokenPayload(token, element, CstNodeKind.PFormatItem_P);
    });
    this.CONSUME_ASSIGN1(tokens.STRING_TERM, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.PFormatItem_SpecificationString,
      );
      element.specification = token.image;
    });

    return this.pop<ast.PFormatItem>();
  });
  private createColumnFormatItem(): ast.ColumnFormatItem {
    return {
      kind: ast.SyntaxKind.ColumnFormatItem,
      container: null,
      characterPosition: null,
    };
  }

  ColumnFormatItem = this.RULE("ColumnFormatItem", () => {
    let element = this.push(this.createColumnFormatItem());

    this.CONSUME_ASSIGN1(tokens.COLUMN, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ColumnFormatItem_COLUMN);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ColumnFormatItem_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.characterPosition = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ColumnFormatItem_CloseParen,
      );
    });

    return this.pop<ast.ColumnFormatItem>();
  });
  private createGFormatItem(): ast.GFormatItem {
    return {
      kind: ast.SyntaxKind.GFormatItem,
      container: null,
      fieldWidth: null,
    };
  }

  GFormatItem = this.RULE("GFormatItem", () => {
    let element = this.push(this.createGFormatItem());

    this.CONSUME_ASSIGN1(tokens.G, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GFormatItem_G);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GFormatItem_OpenParen);
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.fieldWidth = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GFormatItem_CloseParen);
      });
    });

    return this.pop<ast.GFormatItem>();
  });
  private createLFormatItem(): ast.LFormatItem {
    return { kind: ast.SyntaxKind.LFormatItem, container: null };
  }

  LFormatItem = this.RULE("LFormatItem", () => {
    let element = this.push(this.createLFormatItem());

    this.CONSUME_ASSIGN1(tokens.L, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LFormatItem_L);
    });

    return this.pop<ast.LFormatItem>();
  });
  private createLineFormatItem(): ast.LineFormatItem {
    return {
      kind: ast.SyntaxKind.LineFormatItem,
      container: null,
      lineNumber: null,
    };
  }

  LineFormatItem = this.RULE("LineFormatItem", () => {
    let element = this.push(this.createLineFormatItem());

    this.CONSUME_ASSIGN1(tokens.LINE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LineFormatItem_LINE);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LineFormatItem_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.lineNumber = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LineFormatItem_CloseParen);
    });

    return this.pop<ast.LineFormatItem>();
  });
  private createPageFormatItem(): ast.PageFormatItem {
    return { kind: ast.SyntaxKind.PageFormatItem, container: null };
  }

  PageFormatItem = this.RULE("PageFormatItem", () => {
    let element = this.push(this.createPageFormatItem());

    this.CONSUME_ASSIGN1(tokens.PAGE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.PageFormatItem_PAGE);
    });

    return this.pop<ast.PageFormatItem>();
  });
  private createRFormatItem(): ast.RFormatItem {
    return {
      kind: ast.SyntaxKind.RFormatItem,
      container: null,
      labelReference: null,
    };
  }

  RFormatItem = this.RULE("RFormatItem", () => {
    let element = this.push(this.createRFormatItem());

    this.CONSUME_ASSIGN1(tokens.R, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RFormatItem_R);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RFormatItem_OpenParen);
    });
    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RFormatItem_LabelRef);
      element.labelReference = token.image;
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RFormatItem_CloseParen);
    });

    return this.pop<ast.RFormatItem>();
  });
  private createSkipFormatItem(): ast.SkipFormatItem {
    return {
      kind: ast.SyntaxKind.SkipFormatItem,
      container: null,
      skip: null,
    };
  }

  SkipFormatItem = this.RULE("SkipFormatItem", () => {
    let element = this.push(this.createSkipFormatItem());

    this.CONSUME_ASSIGN1(tokens.SKIP, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SkipFormatItem_SKIP);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.SkipFormatItem_OpenParen);
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.skip = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.SkipFormatItem_CloseParen,
        );
      });
    });

    return this.pop<ast.SkipFormatItem>();
  });

  private createVFormatItem(): ast.VFormatItem {
    return { kind: ast.SyntaxKind.VFormatItem, container: null };
  }

  VFormatItem = this.RULE("VFormatItem", () => {
    let element = this.push(this.createVFormatItem());

    this.CONSUME_ASSIGN1(tokens.V, (token) => {
      this.tokenPayload(token, element, CstNodeKind.VFormatItem_V);
    });

    return this.pop<ast.VFormatItem>();
  });
  private createXFormatItem(): ast.XFormatItem {
    return {
      kind: ast.SyntaxKind.XFormatItem,
      container: null,
      width: null,
    };
  }

  XFormatItem = this.RULE("XFormatItem", () => {
    let element = this.push(this.createXFormatItem());

    this.CONSUME_ASSIGN1(tokens.X, (token) => {
      this.tokenPayload(token, element, CstNodeKind.XFormatItem_X);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.XFormatItem_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.width = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.XFormatItem_CloseParen);
    });

    return this.pop<ast.XFormatItem>();
  });
  private createFreeStatement(): ast.FreeStatement {
    return {
      kind: ast.SyntaxKind.FreeStatement,
      container: null,
      references: [],
    };
  }

  FreeStatement = this.RULE("FreeStatement", () => {
    let element = this.push(this.createFreeStatement());

    this.CONSUME_ASSIGN1(tokens.FREE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FreeStatement_FREE);
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.references.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.FreeStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.LocatorCall, {
        assign: (result) => {
          element.references.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.FreeStatement_Semicolon);
    });

    return this.pop<ast.FreeStatement>();
  });
  private createGetFileStatement(): ast.GetFileStatement {
    return {
      kind: ast.SyntaxKind.GetFileStatement,
      container: null,
      specifications: [],
    };
  }

  private createGetStringStatement(): ast.GetStringStatement {
    return {
      kind: ast.SyntaxKind.GetStringStatement,
      container: null,
      dataSpecification: null,
      expression: null,
    };
  }

  GetStatement = this.RULE("GetStatement", () => {
    let element: ast.GetStatement = this.push(this.createGetFileStatement());

    this.CONSUME_ASSIGN1(tokens.GET, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GetStatement_GET);
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
                    assign: (result) => {
                      fileStatement.specifications.push(result);
                    },
                  });
                },
              },
              {
                ALT: () => {
                  this.SUBRULE_ASSIGN1(this.GetCopy, {
                    assign: (result) => {
                      fileStatement.specifications.push(result);
                    },
                  });
                },
              },
              {
                ALT: () => {
                  this.SUBRULE_ASSIGN1(this.GetSkip, {
                    assign: (result) => {
                      fileStatement.specifications.push(result);
                    },
                  });
                },
              },
              {
                ALT: () => {
                  this.SUBRULE_ASSIGN1(this.DataSpecificationOptions, {
                    assign: (result) => {
                      fileStatement.specifications.push(result);
                    },
                  });
                },
              },
            ]);
          });
        },
      },
      {
        ALT: () => {
          const stringStatement = this.replace(this.createGetStringStatement());
          this.CONSUME_ASSIGN1(tokens.STRING, (token) => {
            this.tokenPayload(
              token,
              stringStatement,
              CstNodeKind.GetStatement_STRING,
            );
          });
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              stringStatement,
              CstNodeKind.GetStatement_OpenParen,
            );
          });
          this.SUBRULE_ASSIGN1(this.Expression, {
            assign: (result) => {
              stringStatement.expression = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              stringStatement,
              CstNodeKind.GetStatement_CloseParen,
            );
          });
          this.SUBRULE_ASSIGN2(this.DataSpecificationOptions, {
            assign: (result) => {
              stringStatement.dataSpecification = result;
            },
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, this.peek(), CstNodeKind.GetStatement_Semicolon);
    });

    return this.pop<ast.GetStatement>();
  });
  private createGetFile(): ast.GetFile {
    return {
      kind: ast.SyntaxKind.GetFile,
      container: null,
      file: null,
    };
  }

  GetFile = this.RULE("GetFile", () => {
    let element = this.push(this.createGetFile());

    this.CONSUME_ASSIGN1(tokens.FILE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GetFile_FILE);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GetFile_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.file = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GetFile_CloseParen);
    });

    return this.pop<ast.GetFile>();
  });
  private createGetCopy(): ast.GetCopy {
    return {
      kind: ast.SyntaxKind.GetCopy,
      container: null,
      copyReference: null,
    };
  }

  GetCopy = this.RULE("GetCopy", () => {
    let element = this.push(this.createGetCopy());

    this.CONSUME_ASSIGN1(tokens.COPY, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GetCopy_COPY);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GetCopy_OpenParen);
      });
      this.CONSUME_ASSIGN1(tokens.ID, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GetCopy_CopyReference);
        element.copyReference = token.image;
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GetCopy_CloseParen);
      });
    });

    return this.pop<ast.GetCopy>();
  });
  private createGetSkip(): ast.GetSkip {
    return {
      kind: ast.SyntaxKind.GetSkip,
      container: null,
      skipExpression: null,
    };
  }

  GetSkip = this.RULE("GetSkip", () => {
    let element = this.push(this.createGetSkip());

    this.CONSUME_ASSIGN1(tokens.SKIP, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GetSkip_SKIP);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GetSkip_OpenParen);
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.skipExpression = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GetSkip_CloseParen);
      });
    });

    return this.pop<ast.GetSkip>();
  });
  private createGoToStatement(): ast.GoToStatement {
    return {
      kind: ast.SyntaxKind.GoToStatement,
      container: null,
      label: null,
    };
  }

  GoToStatement = this.RULE("GoToStatement", () => {
    let element = this.push(this.createGoToStatement());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.GO, (token) => {
            this.tokenPayload(token, element, CstNodeKind.GoToStatement_GO);
          });
          this.CONSUME_ASSIGN1(tokens.TO, (token) => {
            this.tokenPayload(token, element, CstNodeKind.GoToStatement_TO);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.GOTO, (token) => {
            this.tokenPayload(token, element, CstNodeKind.GoToStatement_GOTO);
          });
        },
      },
    ]);
    this.SUBRULE_ASSIGN1(this.LabelReference, {
      assign: (result) => {
        element.label = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GoToStatement_Semicolon);
    });

    return this.pop<ast.GoToStatement>();
  });

  private createGenericAttribute(): ast.GenericAttribute {
    return {
      kind: ast.SyntaxKind.GenericAttribute,
      container: null,
      references: [],
    };
  }

  GenericAttribute = this.RULE("GenericAttribute", () => {
    let element = this.push(this.createGenericAttribute());

    this.CONSUME_ASSIGN(tokens.GENERIC, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GenericAttribute_GENERIC);
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.GenericAttribute_OpenParen);
    });
    this.OPTION(() => {
      this.SUBRULE_ASSIGN1(this.GenericReference, {
        assign: (result) => {
          element.references.push(result);
        },
      });
      this.MANY(() => {
        this.CONSUME_ASSIGN(tokens.Comma, (token) => {
          this.tokenPayload(token, element, CstNodeKind.GenericAttribute_Comma);
        });
        this.SUBRULE_ASSIGN2(this.GenericReference, {
          assign: (result) => {
            element.references.push(result);
          },
        });
      });
    });

    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.GenericAttribute_CloseParen,
      );
    });

    return this.pop<ast.GenericAttribute>();
  });

  private createGenericReference(): ast.GenericReference {
    return {
      kind: ast.SyntaxKind.GenericReference,
      container: null,
      descriptors: [],
      otherwise: false,
      entry: null,
    };
  }

  GenericReference = this.RULE("GenericReference", () => {
    let element = this.push(this.createGenericReference());

    this.SUBRULE_ASSIGN(this.ReferenceItem, {
      assign: (result) => {
        element.entry = result;
      },
    });
    this.OR([
      {
        ALT: () => {
          this.CONSUME_ASSIGN(tokens.WHEN, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.GenericReference_WHEN,
            );
          });
          this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.GenericReference_OpenParen,
            );
          });
          this.OPTION(() => {
            this.SUBRULE_ASSIGN(this.GenericDescriptor, {
              assign: (result) => {
                element.descriptors.push(result);
              },
            });
          });
          this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.GenericReference_CloseParen,
            );
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN(tokens.OTHERWISE, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.GenericReference_OTHERWISE,
            );
          });
        },
      },
    ]);

    return this.pop<ast.GenericReference>();
  });

  private createGenericDescriptor(): ast.GenericDescriptor {
    return {
      kind: ast.SyntaxKind.GenericDescriptor,
      container: null,
      attributes: [],
    };
  }

  GenericDescriptor = this.RULE("GenericDescriptor", () => {
    let element = this.push(this.createGenericDescriptor());

    this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
      assign: (result) => {
        element.attributes.push(result);
      },
    });
    this.MANY(() => {
      this.CONSUME_ASSIGN(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.GenericDescriptor_Comma);
      });
      this.SUBRULE_ASSIGN2(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });

    return this.pop<ast.GenericDescriptor>();
  });

  private createIfStatement(): ast.IfStatement {
    return {
      kind: ast.SyntaxKind.IfStatement,
      container: null,
      expression: null,
      unit: null,
      else: null,
      unitRange: null,
      elseRange: null,
    };
  }

  IfStatement = this.RULE("IfStatement", () => {
    let element = this.push(this.createIfStatement());

    this.CONSUME_ASSIGN1(tokens.IF, (token) => {
      this.tokenPayload(token, element, CstNodeKind.IfStatement_IF);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.expression = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.THEN, (token) => {
      this.tokenPayload(token, element, CstNodeKind.IfStatement_THEN);
    });
    this.SUBRULE_ASSIGN1(this.Statement, {
      assign: (result) => {
        element.unit = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.ELSE, (token) => {
        this.tokenPayload(token, element, CstNodeKind.IfStatement_ELSE);
      });
      this.SUBRULE_ASSIGN2(this.Statement, {
        assign: (result) => {
          element.else = result;
        },
      });
    });

    return this.pop<ast.IfStatement>();
  });

  // TODO: This is a preprocessor directive - maybe we can reintegrate it later?
  // IncludeDirective = this.RULE("IncludeDirective", () => {
  //   let element = this.push(this.createIncludeDirective());

  //   this.CONSUME_ASSIGN1(tokens.PercentINCLUDE, (token) => {
  //     this.tokenPayload(token, element, CstNodeKind.IncludeDirective_INCLUDE);
  //   });
  //   this.SUBRULE_ASSIGN1(this.IncludeItem, {
  //     assign: (result) => {
  //       element.items.push(result);
  //     },
  //   });
  //   this.MANY1(() => {
  //     this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
  //       this.tokenPayload(token, element, CstNodeKind.IncludeDirective_Comma);
  //     });
  //     this.SUBRULE_ASSIGN2(this.IncludeItem, {
  //       assign: (result) => {
  //         element.items.push(result);
  //       },
  //     });
  //   });
  //   this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
  //     this.tokenPayload(token, element, CstNodeKind.IncludeDirective_Semicolon);
  //   });

  //   return this.pop<ast.IncludeDirective>();
  // });
  // private createIncludeItem(): ast.IncludeItem {
  //   return {
  //     kind: ast.SyntaxKind.IncludeItem,
  //     container: null,
  //     file: null,
  //     ddname: false,
  //   };
  // }

  // IncludeItem = this.RULE("IncludeItem", () => {
  //   let element = this.push(this.createIncludeItem());

  //   this.OR1([
  //     {
  //       ALT: () => {
  //         this.OR2([
  //           {
  //             ALT: () => {
  //               this.CONSUME_ASSIGN1(tokens.STRING_TERM, (token) => {
  //                 this.tokenPayload(
  //                   token,
  //                   element,
  //                   CstNodeKind.IncludeItem_FileString0,
  //                 );
  //                 element.file = token.image;
  //               });
  //             },
  //           },
  //           {
  //             ALT: () => {
  //               this.CONSUME_ASSIGN1(tokens.ID, (token) => {
  //                 this.tokenPayload(
  //                   token,
  //                   element,
  //                   CstNodeKind.IncludeItem_FileID0,
  //                 );
  //                 element.file = token.image;
  //               });
  //             },
  //           },
  //         ]);
  //       },
  //     },
  //     {
  //       ALT: () => {
  //         this.CONSUME_ASSIGN1(tokens.ddname, (token) => {
  //           this.tokenPayload(token, element, CstNodeKind.IncludeItem_DDName);
  //           element.ddname = true;
  //         });
  //         this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
  //           this.tokenPayload(
  //             token,
  //             element,
  //             CstNodeKind.IncludeItem_OpenParen,
  //           );
  //         });
  //         this.OR3([
  //           {
  //             ALT: () => {
  //               this.CONSUME_ASSIGN2(tokens.STRING_TERM, (token) => {
  //                 this.tokenPayload(
  //                   token,
  //                   element,
  //                   CstNodeKind.IncludeItem_FileString1,
  //                 );
  //                 element.file = token.image;
  //               });
  //             },
  //           },
  //           {
  //             ALT: () => {
  //               this.CONSUME_ASSIGN2(tokens.ID, (token) => {
  //                 this.tokenPayload(
  //                   token,
  //                   element,
  //                   CstNodeKind.IncludeItem_FileID1,
  //                 );
  //                 element.file = token.image;
  //               });
  //             },
  //           },
  //         ]);
  //         this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
  //           this.tokenPayload(
  //             token,
  //             element,
  //             CstNodeKind.IncludeItem_CloseParen,
  //           );
  //         });
  //       },
  //     },
  //   ]);

  //   return this.pop<ast.IncludeItem>();
  // });

  private createIndForAttribute(): ast.IndForAttribute {
    return {
      kind: ast.SyntaxKind.IndForAttribute,
      container: null,
      reference: null,
    };
  }

  IndForAttribute = this.RULE("IndForAttribute", () => {
    let element = this.push(this.createIndForAttribute());

    this.CONSUME_ASSIGN(tokens.INDFOR, (token) => {
      this.tokenPayload(token, element, CstNodeKind.IndForAttribute_INDFOR);
    });
    this.SUBRULE_ASSIGN(this.LocatorCall, {
      assign: (result) => {
        element.reference = result;
      },
    });

    return this.pop<ast.IndForAttribute>();
  });

  private createIterateStatement(): ast.IterateStatement {
    return {
      kind: ast.SyntaxKind.IterateStatement,
      container: null,
      label: null,
    };
  }

  IterateStatement = this.RULE("IterateStatement", () => {
    let element = this.push(this.createIterateStatement());

    this.CONSUME_ASSIGN1(tokens.ITERATE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.IterateStatement_ITERATE);
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.LabelReference, {
        assign: (result) => {
          element.label = result;
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.IterateStatement_Semicolon);
    });

    return this.pop<ast.IterateStatement>();
  });
  private createLeaveStatement(): ast.LeaveStatement {
    return {
      kind: ast.SyntaxKind.LeaveStatement,
      container: null,
      label: null,
    };
  }

  LeaveStatement = this.RULE("LeaveStatement", () => {
    let element = this.push(this.createLeaveStatement());

    this.CONSUME_ASSIGN1(tokens.LEAVE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LeaveStatement_LEAVE);
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.LabelReference, {
        assign: (result) => {
          element.label = result;
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LeaveStatement_Semicolon);
    });

    return this.pop<ast.LeaveStatement>();
  });

  private createLocateStatement(): ast.LocateStatement {
    return {
      kind: ast.SyntaxKind.LocateStatement,
      container: null,
      variable: null,
      arguments: [],
    };
  }

  LocateStatement = this.RULE("LocateStatement", () => {
    let element = this.push(this.createLocateStatement());

    this.CONSUME_ASSIGN1(tokens.LOCATE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LocateStatement_LOCATE);
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.variable = result;
      },
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN1(this.LocateStatementOption, {
        assign: (result) => {
          element.arguments.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LocateStatement_Semicolon);
    });

    return this.pop<ast.LocateStatement>();
  });
  private createLocateStatementOption(): ast.LocateStatementOption {
    return {
      kind: ast.SyntaxKind.LocateStatementOption,
      container: null,
      type: null,
      element: null,
    };
  }

  LocateStatementOption = this.RULE("LocateStatementOption", () => {
    let element = this.push(this.createLocateStatementOption());

    this.CONSUME_ASSIGN1(tokens.LocateType, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LocateStatementOption_Type);
      element.type = token.image as ast.LocateStatementOption["type"];
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.LocateStatementOption_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.element = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.LocateStatementOption_CloseParen,
      );
    });

    return this.pop<ast.LocateStatementOption>();
  });

  private createNullStatement(): ast.NullStatement {
    return { kind: ast.SyntaxKind.NullStatement, container: null };
  }

  NullStatement = this.RULE("NullStatement", () => {
    let element = this.push(this.createNullStatement());

    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NullStatement_Semicolon);
    });

    return this.pop<ast.NullStatement>();
  });
  private createOnStatement(): ast.OnStatement {
    return {
      kind: ast.SyntaxKind.OnStatement,
      container: null,
      conditions: [],
      snap: false,
      system: false,
      onUnit: null,
    };
  }

  OnStatement = this.RULE("OnStatement", () => {
    let element = this.push(this.createOnStatement());

    this.CONSUME_ASSIGN1(tokens.ON, (token) => {
      this.tokenPayload(token, element, CstNodeKind.OnStatement_ON);
    });
    this.SUBRULE_ASSIGN1(this.Condition, {
      assign: (result) => {
        element.conditions.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OnStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.Condition, {
        assign: (result) => {
          element.conditions.push(result);
        },
      });
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.SNAP, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OnStatement_Snap);
        element.snap = true;
      });
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.SYSTEM, (token) => {
            this.tokenPayload(token, element, CstNodeKind.OnStatement_System);
            element.system = true;
          });
          this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.OnStatement_Semicolon,
            );
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.Statement, {
            assign: (result) => {
              element.onUnit = result;
            },
          });
        },
      },
    ]);

    return this.pop<ast.OnStatement>();
  });

  Condition = this.OR_RULE<ast.Condition>("Condition", () => [
    this.KeywordCondition,
    this.NamedCondition,
    this.FileReferenceCondition,
  ]);

  private createKeywordCondition(): ast.KeywordCondition {
    return {
      kind: ast.SyntaxKind.KeywordCondition,
      container: null,
      keyword: null,
    };
  }

  KeywordCondition = this.RULE("KeywordCondition", () => {
    let element = this.push(this.createKeywordCondition());

    this.CONSUME_ASSIGN1(tokens.KeywordConditions, (token) => {
      this.tokenPayload(token, element, CstNodeKind.KeywordCondition_Keyword);
      element.keyword = token.image as ast.KeywordCondition["keyword"];
    });

    return this.pop<ast.KeywordCondition>();
  });
  private createNamedCondition(): ast.NamedCondition {
    return {
      kind: ast.SyntaxKind.NamedCondition,
      container: null,
      name: null,
    };
  }

  NamedCondition = this.RULE("NamedCondition", () => {
    let element = this.push(this.createNamedCondition());

    this.CONSUME_ASSIGN1(tokens.CONDITION, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NamedCondition_CONDITION);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NamedCondition_OpenParen);
    });
    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NamedCondition_Name);
      element.name = token.image;
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NamedCondition_CloseParen);
    });

    return this.pop<ast.NamedCondition>();
  });

  private createFileReferenceCondition(): ast.FileReferenceCondition {
    return {
      kind: ast.SyntaxKind.FileReferenceCondition,
      container: null,
      keyword: null,
      fileReference: null,
    };
  }

  FileReferenceCondition = this.RULE("FileReferenceCondition", () => {
    let element = this.push(this.createFileReferenceCondition());

    this.CONSUME_ASSIGN1(tokens.FileReferenceConditions, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.FileReferenceCondition_Keyword,
      );
      element.keyword = token.image as ast.FileReferenceCondition["keyword"];
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.FileReferenceCondition_OpenParen,
        );
      });
      this.SUBRULE_ASSIGN1(this.ReferenceItem, {
        assign: (result) => {
          element.fileReference = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.FileReferenceCondition_CloseParen,
        );
      });
    });

    return this.pop<ast.FileReferenceCondition>();
  });
  private createOpenStatement(): ast.OpenStatement {
    return {
      kind: ast.SyntaxKind.OpenStatement,
      container: null,
      options: [],
    };
  }

  OpenStatement = this.RULE("OpenStatement", () => {
    let element = this.push(this.createOpenStatement());

    this.CONSUME_ASSIGN(tokens.OPEN, (token) => {
      this.tokenPayload(token, element, CstNodeKind.OpenStatement_OPEN);
    });
    this.SUBRULE_ASSIGN1(this.OpenOptionsGroup, {
      assign: (result) => {
        element.options.push(result);
      },
    });
    this.MANY(() => {
      this.CONSUME_ASSIGN(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OpenStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.OpenOptionsGroup, {
        assign: (result) => {
          element.options.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.OpenStatement_Semicolon);
    });

    return this.pop<ast.OpenStatement>();
  });
  private createOpenOptionsGroup(): ast.OpenOptionsGroup {
    return {
      kind: ast.SyntaxKind.OpenOptionsGroup,
      container: null,
      options: [],
    };
  }

  OpenOptionsGroup = this.RULE("OpenOptionsGroup", () => {
    let element = this.push(this.createOpenOptionsGroup());

    this.AT_LEAST_ONE(() => {
      this.SUBRULE_ASSIGN(this.OpenOption, {
        assign: (result) => element.options.push(result),
      });
    });

    return this.pop<ast.OpenOptionsGroup>();
  });

  private createOpenOption(): ast.OpenOption {
    return {
      kind: ast.SyntaxKind.OpenOption,
      container: null,
      option: null,
      expression: null,
    };
  }

  OpenOption = this.RULE("OpenOption", () => {
    // TODO: explain the discrepancy in the grammar
    // The language reference explains that BUFFERED/UNBUFFERED can only be followed by SEQUENTIAL or DIRECT
    // THIS IS NOT THE CASE
    // It can appear on its own
    // Therefore, we simply combine all open options into one single rule
    let element = this.push(this.createOpenOption());

    this.CONSUME_ASSIGN1(tokens.OpenOptionType, (token) => {
      this.tokenPayload(token, element, CstNodeKind.OpenOption_Type);
      element.option = token.image;
    });
    this.OPTION(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OpenOption_OpenParen);
      });
      // Note that only FILE, TITLE, LINESIZE and PAGESIZE are supposed to use this
      // Validate against this later in the lifecycle
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.expression = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.OpenOption_CloseParen);
      });
    });

    return this.pop<ast.OpenOption>();
  });

  private createProcincDirective(): ast.ProcincDirective {
    return {
      kind: ast.SyntaxKind.ProcincDirective,
      container: null,
      datasetName: null,
    };
  }

  ProcincDirective = this.RULE("ProcincDirective", () => {
    let element = this.push(this.createProcincDirective());

    this.CONSUME_ASSIGN1(tokens.PROCINC, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ProcincDirective_PROCINC);
    });
    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ProcincDirective_DatasetName,
      );
      element.datasetName = token.image;
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ProcincDirective_Semicolon);
    });

    return this.pop<ast.ProcincDirective>();
  });

  private createPutFileStatement(): ast.PutFileStatement {
    return {
      kind: ast.SyntaxKind.PutFileStatement,
      container: null,
      items: [],
    };
  }

  private createPutStringStatement(): ast.PutStringStatement {
    return {
      kind: ast.SyntaxKind.PutStringStatement,
      container: null,
      dataSpecification: null,
      stringExpression: null,
    };
  }

  PutStatement = this.RULE("PutStatement", () => {
    let element: ast.PutStatement = this.push(this.createPutFileStatement());
    let assignPayload = (element: ast.PutStatement) => {};

    this.CONSUME_ASSIGN1(tokens.PUT, (token) => {
      assignPayload = (element: ast.PutStatement) => {
        this.tokenPayload(token, element, CstNodeKind.PutStatement_PUT);
      };
      assignPayload(element);
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
                      assign: (result) => {
                        putFileStatement.items.push(result);
                      },
                    });
                  },
                },
                {
                  ALT: () => {
                    this.SUBRULE_ASSIGN1(this.DataSpecificationOptions, {
                      assign: (result) => {
                        putFileStatement.items.push(result);
                      },
                    });
                  },
                },
              ]);
            });
          },
        },
        {
          ALT: () => {
            const putStringStatement = this.replace(
              this.createPutStringStatement(),
            );
            assignPayload(putStringStatement);
            this.CONSUME_ASSIGN1(tokens.STRING, (token) => {
              this.tokenPayload(
                token,
                putStringStatement,
                CstNodeKind.PutStatement_STRING,
              );
            });
            this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
              this.tokenPayload(
                token,
                putStringStatement,
                CstNodeKind.PutStatement_OpenParen,
              );
            });
            this.SUBRULE_ASSIGN1(this.Expression, {
              assign: (result) => {
                putStringStatement.stringExpression = result;
              },
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
              this.tokenPayload(
                token,
                putStringStatement,
                CstNodeKind.PutStatement_CloseParen,
              );
            });
            this.SUBRULE_ASSIGN2(this.DataSpecificationOptions, {
              assign: (result) => {
                putStringStatement.dataSpecification = result;
              },
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, this.peek(), CstNodeKind.PutStatement_Semicolon);
    });

    return this.pop<ast.PutStatement>();
  });
  private createPutItem(): ast.PutItem {
    return {
      kind: ast.SyntaxKind.PutItem,
      container: null,
      attribute: null,
      expression: null,
    };
  }

  PutItem = this.RULE("PutItem", () => {
    let element = this.push(this.createPutItem());

    this.CONSUME_ASSIGN(tokens.PutAttribute, (token) => {
      this.tokenPayload(token, element, CstNodeKind.PutAttribute_FILE);
      element.attribute = token.image as ast.PutAttribute;
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.PutItem_OpenParen);
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.expression = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.PutItem_CloseParen);
      });
    });

    return this.pop<ast.PutItem>();
  });

  private createDataSpecificationOptions(): ast.DataSpecificationOptions {
    return {
      kind: ast.SyntaxKind.DataSpecificationOptions,
      container: null,
      dataList: null,
      edit: false,
      dataLists: [],
      formatLists: [],
      data: false,
      dataListItems: [],
    };
  }

  DataSpecificationOptions = this.RULE("DataSpecificationOptions", () => {
    let element = this.push(this.createDataSpecificationOptions());

    this.OR1([
      {
        ALT: () => {
          this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.LIST, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_LIST,
              );
            });
          });
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DataSpecificationOptions_OpenParenList,
            );
          });
          this.SUBRULE_ASSIGN1(this.DataSpecificationDataList, {
            assign: (result) => {
              element.dataList = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DataSpecificationOptions_CloseParenList,
            );
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.DATA, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DataSpecificationOptions_Data,
            );
            element.data = true;
          });
          this.OPTION2(() => {
            this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_OpenParenData,
              );
            });
            this.SUBRULE_ASSIGN1(this.DataSpecificationDataListItem, {
              assign: (result) => {
                element.dataListItems.push(result);
              },
            });
            this.MANY1(() => {
              this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
                this.tokenPayload(
                  token,
                  element,
                  CstNodeKind.DataSpecificationOptions_Comma,
                );
              });
              this.SUBRULE_ASSIGN2(this.DataSpecificationDataListItem, {
                assign: (result) => {
                  element.dataListItems.push(result);
                },
              });
            });
            this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_CloseParenData,
              );
            });
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.EDIT, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DataSpecificationOptions_Edit,
            );
            element.edit = true;
          });
          this.AT_LEAST_ONE1(() => {
            this.CONSUME_ASSIGN3(tokens.OpenParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_OpenParenEdit,
              );
            });
            this.SUBRULE_ASSIGN2(this.DataSpecificationDataList, {
              assign: (result) => {
                element.dataLists.push(result);
              },
            });
            this.CONSUME_ASSIGN3(tokens.CloseParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_CloseParenEdit,
              );
            });
            this.CONSUME_ASSIGN4(tokens.OpenParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_OpenParenFormat,
              );
            });
            this.SUBRULE_ASSIGN1(this.FormatList, {
              assign: (result) => {
                element.formatLists.push(result);
              },
            });
            this.CONSUME_ASSIGN4(tokens.CloseParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.DataSpecificationOptions_CloseParenFormat,
              );
            });
          });
        },
      },
    ]);

    return this.pop<ast.DataSpecificationOptions>();
  });
  private createDataSpecificationDataList(): ast.DataSpecificationDataList {
    return {
      kind: ast.SyntaxKind.DataSpecificationDataList,
      container: null,
      items: [],
    };
  }

  DataSpecificationDataList = this.RULE("DataSpecificationDataList", () => {
    let element = this.push(this.createDataSpecificationDataList());

    this.SUBRULE_ASSIGN1(this.DataSpecificationDataListItem, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DataSpecificationDataList_Comma,
        );
      });
      this.SUBRULE_ASSIGN2(this.DataSpecificationDataListItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });

    return this.pop<ast.DataSpecificationDataList>();
  });
  private createDataSpecificationDataListItem(): ast.DataSpecificationDataListItem {
    return {
      kind: ast.SyntaxKind.DataSpecificationDataListItem,
      container: null,
      value: null,
    };
  }

  DataSpecificationDataListItem = this.RULE(
    "DataSpecificationDataListItem",
    () => {
      let element = this.push(this.createDataSpecificationDataListItem());

      // TODO: research, in some example, this can be found:
      // ((I, ENTRY(I) DO I = 0 TO ENTRY_TABLE_COUNT))
      // However, this does not conform to the language reference
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.value = result;
        },
      });

      return this.pop<ast.DataSpecificationDataListItem>();
    },
  );
  private createQualifyStatement(): ast.QualifyStatement {
    return {
      kind: ast.SyntaxKind.QualifyStatement,
      container: null,
      statements: [],
      end: null,
    };
  }

  QualifyStatement = this.RULE("QualifyStatement", () => {
    let element = this.push(this.createQualifyStatement());

    this.CONSUME_ASSIGN1(tokens.QUALIFY, (token) => {
      this.tokenPayload(token, element, CstNodeKind.QualifyStatement_QUALIFY);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.QualifyStatement_Semicolon0,
      );
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN1(this.Statement, {
        assign: (result) => {
          element.statements.push(result);
        },
      });
    });
    this.SUBRULE_ASSIGN1(this.EndStatement, {
      assign: (result) => {
        element.end = result;
      },
    });
    this.CONSUME_ASSIGN2(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.QualifyStatement_Semicolon1,
      );
    });

    return this.pop<ast.QualifyStatement>();
  });
  private createReadStatement(): ast.ReadStatement {
    return {
      kind: ast.SyntaxKind.ReadStatement,
      container: null,
      arguments: [],
    };
  }

  ReadStatement = this.RULE("ReadStatement", () => {
    let element = this.push(this.createReadStatement());

    this.CONSUME_ASSIGN1(tokens.READ, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReadStatement_READ);
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN(this.ReadStatementOption, {
        assign: (result) => {
          element.arguments.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReadStatement_Semicolon);
    });

    return this.pop<ast.ReadStatement>();
  });
  private createReadStatementOption(): ast.ReadStatementOption {
    return {
      kind: ast.SyntaxKind.ReadStatementOption,
      container: null,
      type: null,
      value: null,
    };
  }

  ReadStatementOption = this.RULE("ReadStatementOption", () => {
    let element = this.push(this.createReadStatementOption());

    this.CONSUME_ASSIGN1(tokens.ReadStatementType, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReadStatementFile_Type);
      element.type = token.image as ast.ReadStatementOption["type"];
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ReadStatementFile_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.value = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ReadStatementFile_CloseParen,
      );
    });

    return this.pop<ast.ReadStatementOption>();
  });

  private createReinitStatement(): ast.ReinitStatement {
    return {
      kind: ast.SyntaxKind.ReinitStatement,
      container: null,
      reference: null,
    };
  }

  ReinitStatement = this.RULE("ReinitStatement", () => {
    let element = this.push(this.createReinitStatement());

    this.CONSUME_ASSIGN1(tokens.REINIT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReinitStatement_REINIT);
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.reference = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReinitStatement_Semicolon);
    });

    return this.pop<ast.ReinitStatement>();
  });
  private createReleaseStatement(): ast.ReleaseStatement {
    return {
      kind: ast.SyntaxKind.ReleaseStatement,
      container: null,
      star: false,
      references: [],
    };
  }

  ReleaseStatement = this.RULE("ReleaseStatement", () => {
    let element = this.push(this.createReleaseStatement());

    this.CONSUME_ASSIGN1(tokens.RELEASE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_RELEASE);
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.ReleaseStatement_Star,
            );
            element.star = true;
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.ReleaseStatement_References0,
            );
            element.references.push(token.image);
          });
          this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.ReleaseStatement_Comma,
              );
            });
            this.CONSUME_ASSIGN2(tokens.ID, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.ReleaseStatement_References1,
              );
              element.references.push(token.image);
            });
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReleaseStatement_Semicolon);
    });

    return this.pop<ast.ReleaseStatement>();
  });
  private createResignalStatement(): ast.ResignalStatement {
    return { kind: ast.SyntaxKind.ResignalStatement, container: null };
  }

  ResignalStatement = this.RULE("ResignalStatement", () => {
    let element = this.push(this.createResignalStatement());

    this.CONSUME_ASSIGN1(tokens.RESIGNAL, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ResignalStatement_RESIGNAL);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ResignalStatement_Semicolon,
      );
    });

    return this.pop<ast.ResignalStatement>();
  });
  private createReturnStatement(): ast.ReturnStatement {
    return {
      kind: ast.SyntaxKind.ReturnStatement,
      container: null,
      expression: null,
    };
  }

  ReturnStatement = this.RULE("ReturnStatement", () => {
    let element = this.push(this.createReturnStatement());

    this.CONSUME_ASSIGN1(tokens.RETURN, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnStatement_RETURN);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ReturnStatement_OpenParen,
        );
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.expression = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ReturnStatement_CloseParen,
        );
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnStatement_Semicolon);
    });

    return this.pop<ast.ReturnStatement>();
  });
  private createRevertStatement(): ast.RevertStatement {
    return {
      kind: ast.SyntaxKind.RevertStatement,
      container: null,
      conditions: [],
    };
  }

  RevertStatement = this.RULE("RevertStatement", () => {
    let element = this.push(this.createRevertStatement());

    this.CONSUME_ASSIGN1(tokens.REVERT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RevertStatement_REVERT);
    });
    this.SUBRULE_ASSIGN1(this.Condition, {
      assign: (result) => {
        element.conditions.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.RevertStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.Condition, {
        assign: (result) => {
          element.conditions.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RevertStatement_Semicolon);
    });

    return this.pop<ast.RevertStatement>();
  });
  private createRewriteStatement(): ast.RewriteStatement {
    return {
      kind: ast.SyntaxKind.RewriteStatement,
      container: null,
      arguments: [],
    };
  }

  RewriteStatement = this.RULE("RewriteStatement", () => {
    let element = this.push(this.createRewriteStatement());

    this.CONSUME_ASSIGN1(tokens.REWRITE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RewriteStatement_REWRITE);
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN(this.RewriteStatementOption, {
        assign: (result) => {
          element.arguments.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RewriteStatement_Semicolon);
    });

    return this.pop<ast.RewriteStatement>();
  });
  private createRewriteStatementOption(): ast.RewriteStatementOption {
    return {
      kind: ast.SyntaxKind.RewriteStatementOption,
      container: null,
      type: null,
      value: null,
    };
  }

  RewriteStatementOption = this.RULE("RewriteStatementOption", () => {
    let element = this.push(this.createRewriteStatementOption());

    this.CONSUME_ASSIGN1(tokens.RewriteStatementType, (token) => {
      this.tokenPayload(token, element, CstNodeKind.RewriteStatementFile_FILE);
      element.type = token.image as ast.RewriteStatementOption["type"];
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.RewriteStatementFile_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.value = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.RewriteStatementFile_CloseParen,
      );
    });

    return this.pop<ast.RewriteStatementOption>();
  });

  private createSelectStatement(): ast.SelectStatement {
    return {
      kind: ast.SyntaxKind.SelectStatement,
      container: null,
      on: null,
      statements: [],
      end: null,
    };
  }

  SelectStatement = this.RULE("SelectStatement", () => {
    let element = this.push(this.createSelectStatement());

    this.CONSUME_ASSIGN1(tokens.SELECT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SelectStatement_SELECT);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.SelectStatement_OpenParen,
        );
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.on = result;
        },
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.SelectStatement_CloseParen,
        );
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SelectStatement_Semicolon0);
    });
    this.MANY1(() => {
      this.OR1([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.WhenStatement, {
              assign: (result) => {
                element.statements.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.OtherwiseStatement, {
              assign: (result) => {
                element.statements.push(result);
              },
            });
          },
        },
      ]);
    });
    this.SUBRULE_ASSIGN1(this.EndStatement, {
      assign: (result) => {
        element.end = result;
      },
    });
    this.CONSUME_ASSIGN2(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SelectStatement_Semicolon1);
    });

    return this.pop<ast.SelectStatement>();
  });
  private createWhenStatement(): ast.WhenStatement {
    return {
      kind: ast.SyntaxKind.WhenStatement,
      container: null,
      conditions: [],
      unit: null,
    };
  }

  WhenStatement = this.RULE("WhenStatement", () => {
    let element = this.push(this.createWhenStatement());

    this.CONSUME_ASSIGN1(tokens.WHEN, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WhenStatement_WHEN);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WhenStatement_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.conditions.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.WhenStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.Expression, {
        assign: (result) => {
          element.conditions.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WhenStatement_CloseParen);
    });
    this.SUBRULE_ASSIGN1(this.Statement, {
      assign: (result) => {
        element.unit = result;
      },
    });

    return this.pop<ast.WhenStatement>();
  });
  private createOtherwiseStatement(): ast.OtherwiseStatement {
    return {
      kind: ast.SyntaxKind.OtherwiseStatement,
      container: null,
      unit: null,
    };
  }

  OtherwiseStatement = this.RULE("OtherwiseStatement", () => {
    let element = this.push(this.createOtherwiseStatement());

    this.CONSUME_ASSIGN1(tokens.OTHERWISE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.OtherwiseStatement_OTHERWISE,
      );
    });
    this.SUBRULE_ASSIGN1(this.Statement, {
      assign: (result) => {
        element.unit = result;
      },
    });

    return this.pop<ast.OtherwiseStatement>();
  });
  private createSignalStatement(): ast.SignalStatement {
    return {
      kind: ast.SyntaxKind.SignalStatement,
      container: null,
      condition: [],
    };
  }

  SignalStatement = this.RULE("SignalStatement", () => {
    let element = this.push(this.createSignalStatement());

    this.CONSUME_ASSIGN1(tokens.SIGNAL, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SignalStatement_SIGNAL);
    });
    this.SUBRULE_ASSIGN1(this.Condition, {
      assign: (result) => {
        element.condition.push(result);
      },
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.SignalStatement_Semicolon);
    });

    return this.pop<ast.SignalStatement>();
  });

  private createStopStatement(): ast.StopStatement {
    return { kind: ast.SyntaxKind.StopStatement, container: null };
  }

  StopStatement = this.RULE("StopStatement", () => {
    let element = this.push(this.createStopStatement());

    this.CONSUME_ASSIGN1(tokens.STOP, (token) => {
      this.tokenPayload(token, element, CstNodeKind.StopStatement_STOP);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.StopStatement_Semicolon);
    });

    return this.pop<ast.StopStatement>();
  });
  private createWaitStatement(): ast.WaitStatement {
    return {
      kind: ast.SyntaxKind.WaitStatement,
      container: null,
      task: null,
    };
  }

  WaitStatement = this.RULE("WaitStatement", () => {
    let element = this.push(this.createWaitStatement());

    this.CONSUME_ASSIGN1(tokens.WAIT, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WaitStatement_WAIT);
    });
    this.CONSUME_ASSIGN1(tokens.THREAD, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WaitStatement_THREAD);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WaitStatement_OpenParen);
    });
    this.SUBRULE_ASSIGN1(this.LocatorCall, {
      assign: (result) => {
        element.task = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WaitStatement_CloseParen);
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WaitStatement_Semicolon);
    });

    return this.pop<ast.WaitStatement>();
  });
  private createWriteStatement(): ast.WriteStatement {
    return {
      kind: ast.SyntaxKind.WriteStatement,
      container: null,
      arguments: [],
    };
  }

  WriteStatement = this.RULE("WriteStatement", () => {
    let element = this.push(this.createWriteStatement());

    this.CONSUME_ASSIGN1(tokens.WRITE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WriteStatement_WRITE);
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN1(this.WriteStatementOption, {
        assign: (result) => {
          element.arguments.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WriteStatement_Semicolon);
    });

    return this.pop<ast.WriteStatement>();
  });
  private createWriteStatementOption(): ast.WriteStatementOption {
    return {
      kind: ast.SyntaxKind.WriteStatementOption,
      container: null,
      type: null,
      value: null,
    };
  }

  WriteStatementOption = this.RULE("WriteStatementOption", () => {
    let element = this.push(this.createWriteStatementOption());

    this.CONSUME_ASSIGN1(tokens.WriteStatementType, (token) => {
      this.tokenPayload(token, element, CstNodeKind.WriteStatementFile_FILE);
      element.type = token.image as ast.WriteStatementOption["type"];
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.WriteStatementFile_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.value = result;
      },
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.WriteStatementFile_CloseParen,
      );
    });

    return this.pop<ast.WriteStatementOption>();
  });

  private createInitialAttribute(): ast.InitialAttribute {
    return {
      kind: ast.SyntaxKind.InitialAttribute,
      container: null,
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

  InitialAttribute = this.RULE("InitialAttribute", () => {
    let element = this.push(this.createInitialAttribute());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.INITIAL, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.InitialAttribute_INITIAL,
            );
          });
          this.OR3([
            {
              ALT: () => {
                this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_OpenParenDirect,
                  );
                  element.direct = true;
                });
                this.SUBRULE_ASSIGN1(this.InitialAttributeItem, {
                  assign: (result) => {
                    element.items.push(result);
                  },
                });
                this.MANY1(() => {
                  this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
                    this.tokenPayload(
                      token,
                      element,
                      CstNodeKind.InitialAttribute_CommaDirect,
                    );
                  });
                  this.SUBRULE_ASSIGN2(this.InitialAttributeItem, {
                    assign: (result) => {
                      element.items.push(result);
                    },
                  });
                });
                this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_CloseParenDirect,
                  );
                });
              },
            },
            {
              ALT: () => {
                this.CONSUME_ASSIGN1(tokens.CALL, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_Call,
                  );
                  element.call = true;
                });
                this.SUBRULE_ASSIGN1(this.ProcedureCall, {
                  assign: (result) => {
                    element.procedureCall = result;
                  },
                });
              },
            },
            {
              ALT: () => {
                this.CONSUME_ASSIGN1(tokens.TO, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_To,
                  );
                  element.to = true;
                });
                this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_OpenParenTo,
                  );
                });
                this.SUBRULE_ASSIGN1(this.InitialToContent, {
                  assign: (result) => {
                    element.content = result;
                  },
                });
                this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_CloseParenTo,
                  );
                });
                this.CONSUME_ASSIGN3(tokens.OpenParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_OpenParenToItem,
                  );
                });
                this.SUBRULE_ASSIGN3(this.InitialAttributeItem, {
                  assign: (result) => {
                    element.items.push(result);
                  },
                });
                this.MANY2(() => {
                  this.CONSUME_ASSIGN2(tokens.Comma, (token) => {
                    this.tokenPayload(
                      token,
                      element,
                      CstNodeKind.InitialAttribute_CommaToItem,
                    );
                  });
                  this.SUBRULE_ASSIGN4(this.InitialAttributeItem, {
                    assign: (result) => {
                      element.items.push(result);
                    },
                  });
                });
                this.CONSUME_ASSIGN3(tokens.CloseParen, (token) => {
                  this.tokenPayload(
                    token,
                    element,
                    CstNodeKind.InitialAttribute_CloseParenToItem,
                  );
                });
              },
            },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.INITACROSS, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.InitialAttribute_INITACROSS,
            );
            element.across = true;
          });
          this.CONSUME_ASSIGN4(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.InitialAttribute_OpenParenInitAcross,
            );
          });
          this.SUBRULE_ASSIGN1(this.InitAcrossExpression, {
            assign: (result) => {
              element.expressions.push(result);
            },
          });
          this.MANY3(() => {
            this.CONSUME_ASSIGN3(tokens.Comma, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.InitialAttribute_CommaInitAcross,
              );
            });
            this.SUBRULE_ASSIGN2(this.InitAcrossExpression, {
              assign: (result) => {
                element.expressions.push(result);
              },
            });
          });
          this.CONSUME_ASSIGN4(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.InitialAttribute_CloseParenInitAcross,
            );
          });
        },
      },
    ]);

    return this.pop<ast.InitialAttribute>();
  });
  private createInitialToContent(): ast.InitialToContent {
    return {
      kind: ast.SyntaxKind.InitialToContent,
      container: null,
      varying: null,
      type: null,
    };
  }

  InitialToContent = this.RULE("InitialToContent", () => {
    let element = this.push(this.createInitialToContent());

    // Varying and char tokens can appear in any order
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Varying, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.InitialToContent_VARYING0,
            );
            element.varying = token.image as ast.Varying;
          });
          this.OPTION1(() => {
            this.CONSUME_ASSIGN1(tokens.Char, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.InitialToContent_CHAR0,
              );
              element.type = token.image as ast.CharType;
            });
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN2(tokens.Char, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.InitialToContent_CHAR1,
            );
            element.type = token.image as ast.CharType;
          });
          this.OPTION2(() => {
            this.CONSUME_ASSIGN2(tokens.Varying, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.InitialToContent_VARYING1,
              );
              element.varying = token.image as ast.Varying;
            });
          });
        },
      },
    ]);

    return this.pop<ast.InitialToContent>();
  });
  private createInitAcrossExpression(): ast.InitAcrossExpression {
    return {
      kind: ast.SyntaxKind.InitAcrossExpression,
      container: null,
      expressions: [],
    };
  }

  InitAcrossExpression = this.RULE("InitAcrossExpression", () => {
    let element = this.push(this.createInitAcrossExpression());

    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.InitAcrossExpression_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.expressions.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.InitAcrossExpression_Comma,
        );
      });
      this.SUBRULE_ASSIGN2(this.Expression, {
        assign: (result) => {
          element.expressions.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.InitAcrossExpression_CloseParen,
      );
    });

    return this.pop<ast.InitAcrossExpression>();
  });

  InitialAttributeItem = this.RULE("InitialAttributeItem", () => {
    this.push({});

    this.OR1([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.InitialAttributeItemStar, {
            assign: (result) => {
              this.replace(result);
            },
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.InitialAttributeSpecification, {
            assign: (result) => {
              this.replace(result);
            },
          });
        },
      },
    ]);

    return this.pop<ast.InitialAttributeItem>();
  });

  private createInitialAttributeItemStar(): ast.InitialAttributeItemStar {
    return { kind: ast.SyntaxKind.InitialAttributeItemStar, container: null };
  }

  InitialAttributeItemStar = this.RULE("InitialAttributeItemStar", () => {
    let element = this.push(this.createInitialAttributeItemStar());

    this.CONSUME_ASSIGN1(tokens.Star, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.InitialAttributeItemStar_Star,
      );
    });

    return this.pop<ast.InitialAttributeItemStar>();
  });
  private createInitialAttributeSpecification(): ast.InitialAttributeSpecification {
    return {
      kind: ast.SyntaxKind.InitialAttributeSpecification,
      container: null,
      star: false,
      item: null,
      expression: null,
    };
  }

  InitialAttributeSpecification = this.RULE(
    "InitialAttributeSpecification",
    () => {
      let element = this.push(this.createInitialAttributeSpecification());

      this.OR1([
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.InitialAttributeSpecification_OpenParen,
              );
            });
            this.CONSUME_ASSIGN1(tokens.Star, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.InitialAttributeSpecification_Star,
              );
              element.star = true;
            });
            this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.InitialAttributeSpecification_CloseParen,
              );
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.Expression, {
              assign: (result) => {
                element.expression = result;
              },
            });
          },
        },
      ]);
      this.OPTION1(() => {
        this.SUBRULE_ASSIGN1(this.InitialAttributeSpecificationIteration, {
          assign: (result) => {
            element.item = result;
          },
        });
      });

      return this.pop<ast.InitialAttributeSpecification>();
    },
  );

  InitialAttributeSpecificationIteration = this.RULE(
    "InitialAttributeSpecificationIteration",
    () => {
      this.push({});

      this.OR1([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.InitialAttributeItemStar, {
              assign: (result) => {
                this.replace(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(
              this.InitialAttributeSpecificationIterationValue,
              {
                assign: (result) => {
                  this.replace(result);
                },
              },
            );
          },
        },
      ]);

      return this.pop<ast.InitialAttributeSpecificationIteration>();
    },
  );
  private createInitialAttributeSpecificationIterationValue(): ast.InitialAttributeSpecificationIterationValue {
    return {
      kind: ast.SyntaxKind.InitialAttributeSpecificationIterationValue,
      container: null,
      items: [],
    };
  }

  InitialAttributeSpecificationIterationValue = this.RULE(
    "InitialAttributeSpecificationIterationValue",
    () => {
      let element = this.push(
        this.createInitialAttributeSpecificationIterationValue(),
      );

      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.InitialAttributeSpecificationIterationValue_OpenParen,
        );
      });
      this.SUBRULE_ASSIGN1(this.InitialAttributeItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
      this.MANY1(() => {
        this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.InitialAttributeSpecificationIterationValue_Comma,
          );
        });
        this.SUBRULE_ASSIGN2(this.InitialAttributeItem, {
          assign: (result) => {
            element.items.push(result);
          },
        });
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.InitialAttributeSpecificationIterationValue_CloseParen,
        );
      });

      return this.pop<ast.InitialAttributeSpecificationIterationValue>();
    },
  );
  private createDeclareStatement(): ast.DeclareStatement {
    return {
      kind: ast.SyntaxKind.DeclareStatement,
      container: null,
      items: [],
      xDeclare: false,
    };
  }

  DeclareStatement = this.RULE("DeclareStatement", () => {
    let element = this.push(this.createDeclareStatement());

    this.CONSUME_ASSIGN1(tokens.DECLARE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DeclareStatement_DECLARE);
      if (token.image.charAt(0).toUpperCase() === "X") {
        element.xDeclare = true;
      }
    });
    this.SUBRULE_ASSIGN1(this.DeclaredItem, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DeclareStatement_Comma);
      });
      this.SUBRULE_ASSIGN2(this.DeclaredItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.Semicolon, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DeclareStatement_Semicolon);
    });

    return this.pop<ast.DeclareStatement>();
  });

  private createWildcardItem(): ast.WildcardItem {
    return {
      kind: ast.SyntaxKind.WildcardItem,
      container: null,
      token: null,
    };
  }

  DeclaredItem = this.RULE("DeclaredItem", () => {
    let element = this.push(ast.createDeclaredItem());

    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DeclaredItem_LevelNumber);
        element.levelToken = token;
        element.level = parseInt(token.image);
      });
    });
    this.OR1([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.DeclaredVariable, {
            assign: (result) => {
              element.elements.push(result);
            },
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.Star, (token) => {
            const wildcard = this.createWildcardItem();
            wildcard.token = token;
            this.tokenPayload(
              token,
              wildcard,
              CstNodeKind.WildcardItem_Asterisk,
            );
            element.elements.push(wildcard);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DeclaredItem_OpenParen,
            );
          });
          this.SUBRULE_ASSIGN1(this.DeclaredItem, {
            assign: (result) => {
              element.elements.push(result);
            },
          });
          this.MANY1(() => {
            this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
              this.tokenPayload(token, element, CstNodeKind.DeclaredItem_Comma);
            });
            this.SUBRULE_ASSIGN2(this.DeclaredItem, {
              assign: (result) => {
                element.elements.push(result);
              },
            });
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DeclaredItem_CloseParen,
            );
          });
        },
      },
    ]);
    this.MANY2(() => {
      this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });

    return this.pop<ast.DeclaredItem>();
  });

  DeclaredVariable = this.RULE("DeclaredVariable", () => {
    let element = this.push(ast.createDeclaredVariable());

    this.CONSUME_ASSIGN(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DeclaredVariable_Name);
      element.name = token.image;
      element.nameToken = token;
    });

    return this.pop<ast.DeclaredVariable>();
  });

  private getCommonDeclarationAttributes(): ParserMethod<[], any>[] {
    return [
      this.InitialAttribute,
      this.DateAttribute,
      this.HandleAttribute,
      this.DefinedAttribute,
      this.PictureAttribute,
      this.EnvironmentAttribute,
      this.DimensionsDataAttribute,
      this.ValueListFromAttribute,
      this.ValueListAttribute,
      this.ValueRangeAttribute,
      this.ReturnsAttribute,
      this.ComputationDataAttribute,
      this.EntryAttribute,
      this.LikeAttribute,
      this.TypeAttribute,
      this.OrdinalTypeAttribute,
      this.GenericAttribute,
      this.IndForAttribute,
    ];
  }

  DefaultDeclarationAttribute = this.OR_RULE<ast.DefaultDeclarationAttribute>(
    "DefaultDeclarationAttribute",
    () => [
      ...this.getCommonDeclarationAttributes(),
      this.DefaultValueAttribute,
    ],
  );

  DeclarationAttribute = this.OR_RULE<ast.DeclarationAttribute>(
    "DeclarationAttribute",
    () => [...this.getCommonDeclarationAttributes(), this.ValueAttribute],
  );

  private createDateAttribute(): ast.DateAttribute {
    return {
      kind: ast.SyntaxKind.DateAttribute,
      container: null,
      pattern: null,
    };
  }

  DateAttribute = this.RULE("DateAttribute", () => {
    let element = this.push(this.createDateAttribute());

    this.CONSUME_ASSIGN1(tokens.DATE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DateAttribute_DATE);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DateAttribute_OpenParen);
      });
      this.CONSUME_ASSIGN1(tokens.STRING_TERM, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DateAttribute_PatternString,
        );
        element.pattern = token.image;
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DateAttribute_CloseParen);
      });
    });

    return this.pop<ast.DateAttribute>();
  });
  private createDefinedAttribute(): ast.DefinedAttribute {
    return {
      kind: ast.SyntaxKind.DefinedAttribute,
      container: null,
      reference: null,
      position: null,
    };
  }

  DefinedAttribute = this.RULE("DefinedAttribute", () => {
    let element = this.push(this.createDefinedAttribute());

    this.CONSUME_ASSIGN1(tokens.DEFINED, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DefinedAttribute_DEFINED);
    });
    this.OR2([
      {
        ALT: () => {
          this.SUBRULE_ASSIGN1(this.MemberCall, {
            assign: (result) => {
              element.reference = result;
            },
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DefinedAttribute_OpenParenRef,
            );
          });
          this.SUBRULE_ASSIGN2(this.MemberCall, {
            assign: (result) => {
              element.reference = result;
            },
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.DefinedAttribute_CloseParenRef,
            );
          });
        },
      },
    ]);
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.POSITION, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefinedAttribute_POSITION,
        );
      });
      this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefinedAttribute_OpenParenPos,
        );
      });
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.position = result;
        },
      });
      this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefinedAttribute_CloseParenPos,
        );
      });
    });

    return this.pop<ast.DefinedAttribute>();
  });
  private createPictureAttribute(): ast.PictureAttribute {
    return {
      kind: ast.SyntaxKind.PictureAttribute,
      container: null,
      picture: null,
    };
  }

  PictureAttribute = this.RULE("PictureAttribute", () => {
    let element = this.push(this.createPictureAttribute());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.PICTURE, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.PictureAttribute_PICTURE,
            );
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.WIDEPIC, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.PictureAttribute_WIDEPIC,
            );
          });
        },
      },
    ]);
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.STRING_TERM, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.PictureAttribute_PictureString,
        );
        element.picture = token.image;
      });
    });

    return this.pop<ast.PictureAttribute>();
  });
  private createDimensionsDataAttribute(): ast.DimensionsDataAttribute {
    return {
      kind: ast.SyntaxKind.DimensionsDataAttribute,
      container: null,
      dimensions: null,
    };
  }

  DimensionsDataAttribute = this.RULE("DimensionsDataAttribute", () => {
    let element = this.push(this.createDimensionsDataAttribute());

    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.DIMENSION, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DimensionsDataAttribute_DIMENSION,
        );
      });
    });
    this.SUBRULE_ASSIGN1(this.Dimensions, {
      assign: (result) => {
        element.dimensions = result;
      },
    });

    return this.pop<ast.DimensionsDataAttribute>();
  });
  private createTypeAttribute(): ast.TypeAttribute {
    return {
      kind: ast.SyntaxKind.TypeAttribute,
      container: null,
      type: null,
    };
  }

  TypeAttribute = this.RULE("TypeAttribute", () => {
    let element = this.push(this.createTypeAttribute());

    this.CONSUME_ASSIGN1(tokens.TYPE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.TypeAttribute_TYPE);
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.TypeAttribute_TypeId0,
            );
            element.type = ast.createReference(element, token);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.TypeAttribute_OpenParen,
            );
          });
          this.CONSUME_ASSIGN2(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.TypeAttribute_TypeId1,
            );
            element.type = ast.createReference(element, token);
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.TypeAttribute_CloseParen,
            );
          });
        },
      },
    ]);

    return this.pop<ast.TypeAttribute>();
  });
  private createOrdinalTypeAttribute(): ast.OrdinalTypeAttribute {
    return {
      kind: ast.SyntaxKind.OrdinalTypeAttribute,
      container: null,
      type: null,
      byvalue: false,
    };
  }

  OrdinalTypeAttribute = this.RULE("OrdinalTypeAttribute", () => {
    let element = this.push(this.createOrdinalTypeAttribute());

    this.CONSUME_ASSIGN1(tokens.ORDINAL, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.OrdinalTypeAttribute_ORDINAL,
      );
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.OrdinalTypeAttribute_TypeId0,
            );
            element.type = ast.createReference(element, token);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.OrdinalTypeAttribute_OpenParen,
            );
          });
          this.CONSUME_ASSIGN2(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.OrdinalTypeAttribute_TypeId1,
            );
            element.type = ast.createReference(element, token);
          });
          this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.OrdinalTypeAttribute_CloseParen,
            );
          });
        },
      },
    ]);
    this.CONSUME_ASSIGN1(tokens.BYVALUE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.OrdinalTypeAttribute_ByValue,
      );
      element.byvalue = true;
    });

    return this.pop<ast.OrdinalTypeAttribute>();
  });
  private createReturnsAttribute(): ast.ReturnsAttribute {
    return {
      kind: ast.SyntaxKind.ReturnsAttribute,
      container: null,
      attrs: [],
    };
  }

  ReturnsAttribute = this.RULE("ReturnsAttribute", () => {
    let element = this.push(this.createReturnsAttribute());

    this.CONSUME_ASSIGN1(tokens.RETURNS, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnsAttribute_RETURNS);
    });
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnsAttribute_OpenParen);
    });
    this.MANY1(() => {
      this.OR1([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.ComputationDataAttribute, {
              assign: (result) => {
                element.attrs.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.DateAttribute, {
              assign: (result) => {
                element.attrs.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.ValueListAttribute, {
              assign: (result) => {
                element.attrs.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.ValueRangeAttribute, {
              assign: (result) => {
                element.attrs.push(result);
              },
            });
          },
        },
      ]);
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ReturnsAttribute_CloseParen,
      );
    });

    return this.pop<ast.ReturnsAttribute>();
  });
  private createComputationDataAttribute(): ast.ComputationDataAttribute {
    return {
      kind: ast.SyntaxKind.ComputationDataAttribute,
      container: null,
      type: null,
      dimensions: null,
    };
  }

  ComputationDataAttribute = this.RULE("ComputationDataAttribute", () => {
    let element = this.push(this.createComputationDataAttribute());

    this.CONSUME_ASSIGN(tokens.DefaultAttribute, (token) => {
      this.tokenPayload(token, element, CstNodeKind.DefaultAttribute_Value);
      element.type = token.image as ast.DefaultAttribute;
    });
    this.OPTION1(() => {
      this.SUBRULE_ASSIGN1(this.Dimensions, {
        assign: (result) => {
          element.dimensions = result;
        },
      });
    });

    return this.pop<ast.ComputationDataAttribute>();
  });
  private createDefaultValueAttribute(): ast.DefaultValueAttribute {
    return {
      kind: ast.SyntaxKind.DefaultValueAttribute,
      container: null,
      items: [],
    };
  }

  DefaultValueAttribute = this.RULE("DefaultValueAttribute", () => {
    let element = this.push(this.createDefaultValueAttribute());

    this.CONSUME_ASSIGN(tokens.VALUE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefaultValueAttribute_VALUE,
      );
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefaultValueAttribute_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN1(this.DefaultValueAttributeItem, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.MANY(() => {
      this.CONSUME_ASSIGN(tokens.Comma, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.DefaultValueAttribute_Comma,
        );
      });
      this.SUBRULE_ASSIGN2(this.DefaultValueAttributeItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.DefaultValueAttribute_CloseParen,
      );
    });

    return this.pop<ast.DefaultValueAttribute>();
  });
  private createValueAttribute(): ast.ValueAttribute {
    return {
      kind: ast.SyntaxKind.ValueAttribute,
      container: null,
      value: null,
    };
  }

  ValueAttribute = this.RULE("ValueAttribute", () => {
    let element = this.push(this.createValueAttribute());

    this.CONSUME_ASSIGN(tokens.VALUE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ValueAttribute_VALUE);
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ValueAttribute_OpenParen);
    });
    this.SUBRULE_ASSIGN(this.Expression, {
      assign: (result) => {
        element.value = result;
      },
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ValueAttribute_CloseParen);
    });

    return this.pop<ast.ValueAttribute>();
  });
  private createDefaultValueAttributeItem(): ast.DefaultValueAttributeItem {
    return {
      kind: ast.SyntaxKind.DefaultValueAttributeItem,
      container: null,
      attributes: [],
    };
  }

  DefaultValueAttributeItem = this.RULE("DefaultValueAttributeItem", () => {
    let element = this.push(this.createDefaultValueAttributeItem());

    this.AT_LEAST_ONE(() => {
      this.SUBRULE_ASSIGN(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });

    return this.pop<ast.DefaultValueAttributeItem>();
  });
  private createValueListAttribute(): ast.ValueListAttribute {
    return {
      kind: ast.SyntaxKind.ValueListAttribute,
      container: null,
      values: [],
    };
  }

  ValueListAttribute = this.RULE("ValueListAttribute", () => {
    let element = this.push(this.createValueListAttribute());

    this.CONSUME_ASSIGN(tokens.VALUELIST, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueListAttribute_VALUELIST,
      );
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueListAttribute_OpenParen,
      );
    });
    this.OPTION(() => {
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.values.push(result);
        },
      });
      this.MANY(() => {
        this.CONSUME_ASSIGN(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.ValueListAttribute_Comma,
          );
        });
        this.SUBRULE_ASSIGN2(this.Expression, {
          assign: (result) => {
            element.values.push(result);
          },
        });
      });
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueListAttribute_CloseParen,
      );
    });

    return this.pop<ast.ValueListAttribute>();
  });
  private createValueListFromAttribute(): ast.ValueListFromAttribute {
    return {
      kind: ast.SyntaxKind.ValueListFromAttribute,
      container: null,
      from: null,
    };
  }

  ValueListFromAttribute = this.RULE("ValueListFromAttribute", () => {
    let element = this.push(this.createValueListFromAttribute());

    this.CONSUME_ASSIGN(tokens.VALUELISTFROM, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueListFromAttribute_VALUELISTFROM,
      );
    });
    this.SUBRULE_ASSIGN(this.LocatorCall, {
      assign: (result) => {
        element.from = result;
      },
    });

    return this.pop<ast.ValueListFromAttribute>();
  });
  private createValueRangeAttribute(): ast.ValueRangeAttribute {
    return {
      kind: ast.SyntaxKind.ValueRangeAttribute,
      container: null,
      values: [],
    };
  }

  ValueRangeAttribute = this.RULE("ValueRangeAttribute", () => {
    let element = this.push(this.createValueRangeAttribute());

    this.CONSUME_ASSIGN(tokens.VALUERANGE, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueRangeAttribute_VALUERANGE,
      );
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueRangeAttribute_OpenParen,
      );
    });
    this.OPTION(() => {
      this.SUBRULE_ASSIGN1(this.Expression, {
        assign: (result) => {
          element.values.push(result);
        },
      });
      this.MANY(() => {
        this.CONSUME_ASSIGN(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.ValueRangeAttribute_Comma,
          );
        });
        this.SUBRULE_ASSIGN2(this.Expression, {
          assign: (result) => {
            element.values.push(result);
          },
        });
      });
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ValueRangeAttribute_CloseParen,
      );
    });

    return this.pop<ast.ValueRangeAttribute>();
  });

  private createLikeAttribute(): ast.LikeAttribute {
    return {
      kind: ast.SyntaxKind.LikeAttribute,
      container: null,
      reference: null,
    };
  }

  LikeAttribute = this.RULE("LikeAttribute", () => {
    let element = this.push(this.createLikeAttribute());

    this.CONSUME_ASSIGN(tokens.LIKE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LikeAttribute_LIKE);
    });
    this.SUBRULE_ASSIGN(this.LocatorCall, {
      assign: (result) => {
        element.reference = result;
      },
    });

    return this.pop<ast.LikeAttribute>();
  });
  private createHandleAttribute(): ast.HandleAttribute {
    return {
      kind: ast.SyntaxKind.HandleAttribute,
      container: null,
      size: null,
      type: null,
    };
  }

  HandleAttribute = this.RULE("HandleAttribute", () => {
    let element = this.push(this.createHandleAttribute());

    this.CONSUME_ASSIGN(tokens.HANDLE, (token) => {
      this.tokenPayload(token, element, CstNodeKind.HandleAttribute_HANDLE);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.HandleAttribute_OpenParenSize,
        );
      });
      this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.HandleAttribute_SizeNumber,
        );
        element.size = token.image;
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.HandleAttribute_CloseParenSize,
        );
      });
    });
    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN1(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.HandleAttribute_TypeId0,
            );
            element.type = ast.createReference(element, token);
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.HandleAttribute_OpenParenType,
            );
          });
          this.CONSUME_ASSIGN2(tokens.ID, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.HandleAttribute_TypeId1,
            );
            element.type = ast.createReference(element, token);
          });
          this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.HandleAttribute_CloseParenType,
            );
          });
        },
      },
    ]);

    return this.pop<ast.HandleAttribute>();
  });
  private createDimensions(): ast.Dimensions {
    return {
      kind: ast.SyntaxKind.Dimensions,
      container: null,
      dimensions: [],
    };
  }

  Dimensions = this.RULE("Dimensions", () => {
    let element = this.push(this.createDimensions());

    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Dimensions_OpenParen);
    });
    this.OPTION(() => {
      this.SUBRULE_ASSIGN1(this.DimensionBound, {
        assign: (result) => {
          element.dimensions.push(result);
        },
      });
      this.MANY(() => {
        this.CONSUME_ASSIGN(tokens.Comma, (token) => {
          this.tokenPayload(token, element, CstNodeKind.Dimensions_Comma);
        });
        this.SUBRULE_ASSIGN2(this.DimensionBound, {
          assign: (result) => {
            element.dimensions.push(result);
          },
        });
      });
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.Dimensions_CloseParen);
    });

    return this.pop<ast.Dimensions>();
  });
  private createDimensionBound(): ast.DimensionBound {
    return {
      kind: ast.SyntaxKind.DimensionBound,
      container: null,
      lower: null,
      upper: null,
    };
  }

  DimensionBound = this.RULE("DimensionBound", () => {
    let element = this.push(this.createDimensionBound());

    this.SUBRULE_ASSIGN1(this.Bound, {
      assign: (result) => {
        element.upper = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN(tokens.Colon, (token) => {
        this.tokenPayload(token, element, CstNodeKind.DimensionBound_Colon);
      });
      this.SUBRULE_ASSIGN2(this.Bound, {
        assign: (result) => {
          element.lower = element.upper;
          element.upper = result;
        },
      });
    });

    return this.pop<ast.DimensionBound>();
  });
  private createBound(): ast.Bound {
    return {
      kind: ast.SyntaxKind.Bound,
      container: null,
      expression: null,
      refer: null,
    };
  }

  Bound = this.RULE("Bound", () => {
    let element = this.push(this.createBound());

    this.OR1([
      {
        ALT: () => {
          this.CONSUME_ASSIGN(tokens.Star, (token) => {
            this.tokenPayload(token, element, CstNodeKind.Bound_Star);
            element.expression = token.image as "*";
          });
        },
      },
      {
        ALT: () => {
          this.SUBRULE_ASSIGN(this.Expression, {
            assign: (result) => {
              element.expression = result;
            },
          });
          this.OPTION1(() => {
            this.CONSUME_ASSIGN(tokens.REFER, (token) => {
              this.tokenPayload(token, element, CstNodeKind.Bound_REFER);
            });
            this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
              this.tokenPayload(token, element, CstNodeKind.Bound_OpenParen);
            });
            this.SUBRULE_ASSIGN(this.LocatorCall, {
              assign: (result) => {
                element.refer = result;
              },
            });
            this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
              this.tokenPayload(token, element, CstNodeKind.Bound_CloseParen);
            });
          });
        },
      },
    ]);

    return this.pop<ast.Bound>();
  });
  private createEnvironmentAttribute(): ast.EnvironmentAttribute {
    return {
      kind: ast.SyntaxKind.EnvironmentAttribute,
      container: null,
      items: [],
    };
  }

  EnvironmentAttribute = this.RULE("EnvironmentAttribute", () => {
    let element = this.push(this.createEnvironmentAttribute());

    this.CONSUME_ASSIGN(tokens.ENVIRONMENT, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.EnvironmentAttribute_ENVIRONMENT,
      );
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.EnvironmentAttribute_OpenParen,
      );
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN(this.EnvironmentAttributeItem, {
        assign: (result) => {
          element.items.push(result);
        },
      });
      // TODO: research, This does not align to the language spec
      this.OPTION(() => {
        this.CONSUME_ASSIGN(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.EnvironmentAttributeItem_Comma,
          );
        });
      });
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.EnvironmentAttribute_CloseParen,
      );
    });

    return this.pop<ast.EnvironmentAttribute>();
  });
  private createEnvironmentAttributeItem(): ast.EnvironmentAttributeItem {
    return {
      kind: ast.SyntaxKind.EnvironmentAttributeItem,
      container: null,
      environment: null,
      args: [],
    };
  }

  EnvironmentAttributeItem = this.RULE("EnvironmentAttributeItem", () => {
    let element = this.push(this.createEnvironmentAttributeItem());

    this.CONSUME_ASSIGN(tokens.ID, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.EnvironmentAttributeItem_Environment,
      );
      element.environment = token.image;
    });
    this.OPTION3(() => {
      this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EnvironmentAttributeItem_OpenParen,
        );
      });
      this.OPTION2(() => {
        this.SUBRULE_ASSIGN1(this.Expression, {
          assign: (result) => {
            element.args.push(result);
          },
        });
        this.MANY1(() => {
          this.OPTION1(() => {
            this.CONSUME_ASSIGN(tokens.Comma, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.EnvironmentAttributeItem_Comma,
              );
            });
          });
          this.SUBRULE_ASSIGN2(this.Expression, {
            assign: (result) => {
              element.args.push(result);
            },
          });
        });
      });
      this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EnvironmentAttributeItem_CloseParen,
        );
      });
    });

    return this.pop<ast.EnvironmentAttributeItem>();
  });
  private createEntryAttribute(): ast.EntryAttribute {
    return {
      kind: ast.SyntaxKind.EntryAttribute,
      container: null,
      limited: [],
      attributes: [],
      options: [],
      variable: [],
      returns: [],
      environmentName: [],
    };
  }

  EntryAttribute = this.RULE("EntryAttribute", () => {
    let element = this.push(this.createEntryAttribute());

    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.LIMITED, (token) => {
        this.tokenPayload(token, element, CstNodeKind.EntryAttribute_Limited0);
        element.limited.push(token.image as "LIMITED");
      });
    });
    this.CONSUME_ASSIGN1(tokens.ENTRY, (token) => {
      this.tokenPayload(token, element, CstNodeKind.EntryAttribute_ENTRY);
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EntryAttribute_OpenParenAttribute,
        );
      });
      this.SUBRULE_ASSIGN1(this.EntryDescription, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
      this.MANY2(() => {
        this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.EntryAttribute_CommaAttribute,
          );
        });
        this.SUBRULE_ASSIGN2(this.EntryDescription, {
          assign: (result) => {
            element.attributes.push(result);
          },
        });
      });
      this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.EntryAttribute_CloseParenAttribute,
        );
      });
    });
    this.MANY3(() => {
      this.OR1([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.Options, {
              assign: (result) => {
                element.options.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.VARIABLE, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.EntryAttribute_Variable,
              );
              element.variable.push(token.image as "VARIABLE");
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN2(tokens.LIMITED, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.EntryAttribute_Limited1,
              );
              element.limited.push(token.image as "LIMITED");
            });
          },
        },
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.ReturnsOption, {
              assign: (result) => {
                element.returns.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.EXTERNAL, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.EntryAttribute_EXTERNAL,
              );
            });
            this.OPTION2(() => {
              this.CONSUME_ASSIGN2(tokens.OpenParen, (token) => {
                this.tokenPayload(
                  token,
                  element,
                  CstNodeKind.EntryAttribute_OpenParenEnv,
                );
              });
              this.SUBRULE_ASSIGN1(this.Expression, {
                assign: (result) => {
                  element.environmentName.push(result);
                },
              });
              this.CONSUME_ASSIGN2(tokens.CloseParen, (token) => {
                this.tokenPayload(
                  token,
                  element,
                  CstNodeKind.EntryAttribute_CloseParenEnv,
                );
              });
            });
          },
        },
      ]);
    });

    return this.pop<ast.EntryAttribute>();
  });
  private createReturnsOption(): ast.ReturnsOption {
    return {
      kind: ast.SyntaxKind.ReturnsOption,
      container: null,
      returnAttributes: [],
    };
  }

  ReturnsOption = this.RULE("ReturnsOption", () => {
    let element = this.push(this.createReturnsOption());

    this.CONSUME_ASSIGN(tokens.RETURNS, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnsOption_RETURNS);
    });
    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnsOption_OpenParen);
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN(this.DeclarationAttribute, {
        assign: (result) => {
          element.returnAttributes.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN(tokens.CloseParen, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReturnsOption_CloseParen);
    });

    return this.pop<ast.ReturnsOption>();
  });

  EntryDescription = this.OR_RULE<ast.EntryDescription>(
    "EntryDescription",
    () => [this.EntryParameterDescription, this.EntryUnionDescription],
  );

  private createEntryParameterDescription(): ast.EntryParameterDescription {
    return {
      kind: ast.SyntaxKind.EntryParameterDescription,
      container: null,
      attributes: [],
      star: false,
    };
  }

  EntryParameterDescription = this.RULE("EntryParameterDescription", () => {
    let element = this.push(this.createEntryParameterDescription());

    this.OR([
      {
        ALT: () => {
          this.AT_LEAST_ONE(() => {
            this.SUBRULE_ASSIGN1(this.DeclarationAttribute, {
              assign: (result) => {
                element.attributes.push(result);
              },
            });
          });
        },
      },
      {
        ALT: () => {
          this.CONSUME_ASSIGN(tokens.Star, (token) => {
            this.tokenPayload(
              token,
              element,
              CstNodeKind.EntryParameterDescription_Star,
            );
            element.star = true;
          });
          this.MANY1(() => {
            this.SUBRULE_ASSIGN2(this.DeclarationAttribute, {
              assign: (result) => {
                element.attributes.push(result);
              },
            });
          });
        },
      },
    ]);

    return this.pop<ast.EntryParameterDescription>();
  });
  private createEntryUnionDescription(): ast.EntryUnionDescription {
    return {
      kind: ast.SyntaxKind.EntryUnionDescription,
      container: null,
      init: null,
      attributes: [],
      prefixedAttributes: [],
    };
  }

  EntryUnionDescription = this.RULE("EntryUnionDescription", () => {
    let element = this.push(this.createEntryUnionDescription());

    this.CONSUME_ASSIGN(tokens.NUMBER, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.EntryUnionDescription_InitNumber,
      );
      element.init = token.image;
    });
    this.MANY1(() => {
      this.SUBRULE_ASSIGN(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });
    this.CONSUME_ASSIGN(tokens.Comma, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.EntryUnionDescription_Comma,
      );
    });
    this.MANY2(() => {
      this.SUBRULE_ASSIGN(this.PrefixedAttribute, {
        assign: (result) => {
          element.prefixedAttributes.push(result);
        },
      });
    });

    return this.pop<ast.EntryUnionDescription>();
  });
  private createPrefixedAttribute(): ast.PrefixedAttribute {
    return {
      kind: ast.SyntaxKind.PrefixedAttribute,
      container: null,
      level: null,
      attributes: [],
    };
  }

  PrefixedAttribute = this.RULE("PrefixedAttribute", () => {
    let element = this.push(this.createPrefixedAttribute());

    this.CONSUME_ASSIGN(tokens.NUMBER, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.PrefixedAttribute_LevelNumber,
      );
      element.level = token.image;
    });
    this.MANY(() => {
      this.SUBRULE_ASSIGN(this.DeclarationAttribute, {
        assign: (result) => {
          element.attributes.push(result);
        },
      });
    });

    return this.pop<ast.PrefixedAttribute>();
  });

  ProcedureParameter = this.RULE("ProcedureParameter", () => {
    let element = this.push(ast.createProcedureParameter());

    this.CONSUME_ASSIGN(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ProcedureParameter_Id);
      element.ref = ast.createReference(element, token);
    });

    return this.pop<ast.ProcedureParameter>();
  });
  private createReferenceItem(): ast.ReferenceItem {
    return {
      kind: ast.SyntaxKind.ReferenceItem,
      container: null,
      ref: null,
      dimensions: null,
    };
  }

  ReferenceItem = this.RULE("ReferenceItem", () => {
    let element = this.push(this.createReferenceItem());

    this.CONSUME_ASSIGN(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ReferenceItem_Ref);
      element.ref = ast.createReference(element, token);
    });
    this.OPTION(() => {
      this.SUBRULE_ASSIGN(this.Dimensions, {
        assign: (result) => {
          element.dimensions = result;
        },
      });
    });

    return this.pop<ast.ReferenceItem>();
  });

  BinaryExpression = this.RULE("BinaryExpression", () => {
    const element: IntermediateBinaryExpression = this.push({
      infix: true,
      items: [],
      operators: [],
    });

    this.SUBRULE_ASSIGN1(this.PrimaryExpression, {
      assign: (result) => {
        element.items.push(result);
      },
    });
    this.MANY(() => {
      this.CONSUME_ASSIGN(tokens.BinaryOperator, (token) => {
        this.tokenPayload(
          token,
          element as any,
          CstNodeKind.BinaryExpression_Operator,
        );
        // TODO: maybe use token.image as well?
        // Depends on whether we need it
        // For now, the name of the token is required to perform the transformation
        element.operators.push(token);
      });
      this.SUBRULE_ASSIGN2(this.PrimaryExpression, {
        assign: (result) => {
          element.items.push(result);
        },
      });
    });

    return this.pop<ast.BinaryExpression>();
  });

  Expression = this.BinaryExpression;

  PrimaryExpression = this.OR_RULE<ast.Expression>("PrimaryExpression", () => [
    this.Literal,
    this.ParenthesizedExpression,
    this.UnaryExpression,
    this.LocatorCall,
  ]);

  private createParenthesizedExpression(): ast.Parenthesis {
    return {
      kind: ast.SyntaxKind.Parenthesis,
      container: null,
      value: null,
      do: null,
    };
  }

  ParenthesizedExpression = this.RULE("ParenthesizedExpression", () => {
    let element = this.push(this.createParenthesizedExpression());

    this.CONSUME_ASSIGN(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ParenthesizedExpression_OpenParen,
      );
    });
    this.SUBRULE_ASSIGN(this.Expression, {
      assign: (result) => {
        element.value = result;
      },
    });
    this.OPTION1(() => {
      this.CONSUME_ASSIGN(tokens.DO, (token) => {
        this.tokenPayload(
          token,
          element,
          CstNodeKind.ParenthesizedExpression_DO,
        );
      });
      this.SUBRULE_ASSIGN(this.DoType3, {
        assign: (result) => {
          element.do = result;
        },
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ParenthesizedExpression_CloseParen,
      );
    });
    this.OPTION2(() => {
      const multiplier = element;
      const literal = this.replace(this.createLiteral());
      this.ACTION(() => {
        literal.multiplier = multiplier;
      });
      this.SUBRULE_ASSIGN(this.LiteralValue, {
        assign: (result) => {
          literal.value = result;
        },
      });
    });

    return this.pop<ast.Parenthesis>();
  });
  private createMemberCall(): ast.MemberCall {
    return {
      kind: ast.SyntaxKind.MemberCall,
      container: null,
      element: null,
      previous: null,
    };
  }

  MemberCall = this.RULE("MemberCall", () => {
    let element = this.push(this.createMemberCall());

    this.SUBRULE_ASSIGN1(this.ReferenceItem, {
      assign: (result) => {
        element.element = result;
      },
    });
    this.MANY1(() => {
      this.ACTION(() => {
        const previous = element;
        element = this.replace(this.createMemberCall());
        element.previous = previous;
      });
      this.CONSUME_ASSIGN1(tokens.Dot, (token) => {
        this.tokenPayload(token, element, CstNodeKind.MemberCall_Dot);
      });
      this.SUBRULE_ASSIGN2(this.ReferenceItem, {
        assign: (result) => {
          element.element = result;
        },
      });
    });

    return this.pop<ast.MemberCall>();
  });
  private createLocatorCall(): ast.LocatorCall {
    return {
      kind: ast.SyntaxKind.LocatorCall,
      container: null,
      element: null,
      previous: null,
      pointer: false,
      handle: false,
    };
  }

  LocatorCall = this.RULE("LocatorCall", () => {
    let element = this.push(this.createLocatorCall());

    this.SUBRULE_ASSIGN1(this.MemberCall, {
      assign: (result) => {
        element.element = result;
      },
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
            this.CONSUME_ASSIGN1(tokens.MinusGreaterThan, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.LocatorCall_Pointer,
              );
              element.pointer = true;
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.EqualsGreaterThan, (token) => {
              this.tokenPayload(token, element, CstNodeKind.LocatorCall_Handle);
              element.handle = true;
            });
          },
        },
      ]);
      this.SUBRULE_ASSIGN2(this.MemberCall, {
        assign: (result) => {
          element.element = result;
        },
      });
    });

    return this.pop<ast.LocatorCall>();
  });
  private createProcedureCall(): ast.ProcedureCall {
    return {
      kind: ast.SyntaxKind.ProcedureCall,
      container: null,
      procedure: null,
      args1: null,
      args2: null,
    };
  }

  ProcedureCall = this.RULE("ProcedureCall", () => {
    let element = this.push(this.createProcedureCall());

    this.CONSUME_ASSIGN(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.ProcedureCall_ProcedureRef);
      element.procedure = ast.createReference(element, token);
    });
    let i = 0;
    // Use MANY to prevent grammar ambiguity
    this.MANY({
      DEF: () => {
        this.SUBRULE_ASSIGN(this.ProcedureCallArgs, {
          assign: (result) => {
            if (i === 0) {
              element.args1 = result;
            } else {
              element.args2 = result;
            }
          },
        });
        i++;
      },
      // Use a gate to prevent parsing this more than twice
      GATE: () => i < 2,
    });

    return this.pop<ast.ProcedureCall>();
  });

  private createProcedureCallArgs(): ast.ProcedureCallArgs {
    return {
      kind: ast.SyntaxKind.ProcedureCallArgs,
      container: null,
      list: [],
    };
  }

  ProcedureCallArgs = this.RULE("ProcedureCallArgs", () => {
    const element = this.push(this.createProcedureCallArgs());
    this.CONSUME_ASSIGN1(tokens.OpenParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ProcedureCallArgs_OpenParen,
      );
    });
    this.OPTION1(() => {
      this.OR1([
        {
          ALT: () => {
            this.SUBRULE_ASSIGN1(this.Expression, {
              assign: (result) => {
                element.list.push(result);
              },
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME_ASSIGN1(tokens.Star, (token) => {
              this.tokenPayload(
                token,
                element,
                CstNodeKind.ProcedureCallArgs_Star0,
              );
              element.list.push(token.image as "*");
            });
          },
        },
      ]);
      this.MANY1(() => {
        this.CONSUME_ASSIGN1(tokens.Comma, (token) => {
          this.tokenPayload(
            token,
            element,
            CstNodeKind.ProcedureCallArgs_Comma,
          );
        });
        this.OR2([
          {
            ALT: () => {
              this.SUBRULE_ASSIGN2(this.Expression, {
                assign: (result) => {
                  element.list.push(result);
                },
              });
            },
          },
          {
            ALT: () => {
              this.CONSUME_ASSIGN2(tokens.Star, (token) => {
                this.tokenPayload(
                  token,
                  element,
                  CstNodeKind.ProcedureCallArgs_Star1,
                );
                element.list.push(token.image as "*");
              });
            },
          },
        ]);
      });
    });
    this.CONSUME_ASSIGN1(tokens.CloseParen, (token) => {
      this.tokenPayload(
        token,
        element,
        CstNodeKind.ProcedureCallArgs_CloseParen,
      );
    });
    return this.pop<ast.ProcedureCallArgs>();
  });

  private createLabelReference(): ast.LabelReference {
    return {
      kind: ast.SyntaxKind.LabelReference,
      container: null,
      label: null,
    };
  }

  LabelReference = this.RULE("LabelReference", () => {
    let element = this.push(this.createLabelReference());

    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      this.tokenPayload(token, element, CstNodeKind.LabelReference_LabelRef);
      element.label = ast.createReference(element, token);
    });

    return this.pop<ast.LabelReference>();
  });
  private createUnaryExpression(): ast.UnaryExpression {
    return {
      kind: ast.SyntaxKind.UnaryExpression,
      container: null,
      op: null,
      expr: null,
    };
  }

  UnaryExpression = this.RULE("UnaryExpression", () => {
    let element = this.push(this.createUnaryExpression());

    this.CONSUME_ASSIGN1(tokens.UnaryOperator, (token) => {
      this.tokenPayload(token, element, CstNodeKind.UnaryExpression_Operator);
      element.op = token.image as ast.UnaryExpression["op"];
    });
    this.SUBRULE_ASSIGN1(this.Expression, {
      assign: (result) => {
        element.expr = result;
      },
    });

    return this.pop<ast.UnaryExpression>();
  });
  private createLiteral(): ast.Literal {
    return {
      kind: ast.SyntaxKind.Literal,
      container: null,
      multiplier: null,
      value: null,
    };
  }

  Literal = this.RULE("Literal", () => {
    let element = this.push(this.createLiteral());

    this.SUBRULE_ASSIGN1(this.LiteralValue, {
      assign: (result) => {
        element.value = result;
      },
    });

    return this.pop<ast.Literal>();
  });

  LiteralValue = this.OR_RULE<ast.LiteralValue>("LiteralValue", () => [
    this.StringLiteral,
    this.NumberLiteral,
  ]);

  StringLiteral = this.RULE("StringLiteral", () => {
    let element = this.push(ast.createStringLiteral());

    this.CONSUME_ASSIGN1(tokens.STRING_TERM, (token) => {
      this.tokenPayload(token, element, CstNodeKind.StringLiteral_ValueString);
      element.value = token.image;
    });

    return this.pop<ast.StringLiteral>();
  });
  private createNumberLiteral(): ast.NumberLiteral {
    return {
      kind: ast.SyntaxKind.NumberLiteral,
      container: null,
      value: null,
    };
  }

  NumberLiteral = this.RULE("NumberLiteral", () => {
    let element = this.push(this.createNumberLiteral());

    this.CONSUME_ASSIGN1(tokens.NUMBER, (token) => {
      this.tokenPayload(token, element, CstNodeKind.NumberLiteral_ValueNumber);
      element.value = token.image;
    });

    return this.pop<ast.NumberLiteral>();
  });
  private createFQN(): ast.FQN {
    return "";
  }

  FQN = this.RULE("FQN", () => {
    let fqn = this.push(this.createFQN());

    this.CONSUME_ASSIGN1(tokens.ID, (token) => {
      // this.tokenPayload(token, element, CstNodeKind.FQN_ID_0);
      fqn += token.image;
    });
    this.MANY1(() => {
      this.CONSUME_ASSIGN1(tokens.Dot, (token) => {
        fqn += ".";
        // this.tokenPayload(token, element, CstNodeKind.FQN_Dot_0);
      });
      this.CONSUME_ASSIGN2(tokens.ID, (token) => {
        fqn += token.image;
        // this.tokenPayload(token, element, CstNodeKind.FQN_ID_1);
      });
    });

    return this.pop<string>();
  });
}

export const PliParserInstance = new PliParser();

const expressionTokenTypes = [
  tokens.ID,
  tokens.BinaryOperator,
  tokens.UnaryOperator,
  tokens.AssignmentOperator,
  tokens.STRING_TERM,
  tokens.NUMBER,
];

export function performAssignmentLookahead(
  lookahead: (la: number) => tokens.Token | undefined,
): boolean {
  let i = 1;
  let token = lookahead(i++);
  // First token of an assigment needs to be an ID
  if (!token || !tokenMatcher(token, tokens.ID)) {
    return false;
  }
  token = lookahead(i++);
  // We have found a match immediately with the assignment operator
  if (token && tokenMatcher(token, tokens.AssignmentOperator)) {
    return true;
  }
  // Otherwise expect an opening parenthesis
  if (!token || !tokenMatcher(token, tokens.OpenParen)) {
    return false;
  }
  // The compiler will not use more than 160 tokens to perform the lookahead
  const max = 160;
  let parenthesis = 1;
  while (i < max) {
    const token = lookahead(i++);
    if (!token) {
      return false;
    }
    if (parenthesis === 0) {
      // If we are outside of the parentheses, we always try to match the assignment operator
      return tokenMatcher(token, tokens.AssignmentOperator);
    }
    if (tokenMatcher(token, tokens.OpenParen)) {
      parenthesis++;
    } else if (tokenMatcher(token, tokens.CloseParen)) {
      parenthesis--;
    } else if (tokenMatcher(token, tokens.Semicolon)) {
      // Semicolon indicates the end of the statement
      return false;
    } else {
      for (const tokenType of expressionTokenTypes) {
        if (!tokenMatcher(token, tokenType)) {
          return false;
        }
      }
      // Continue with the next token, the current token is a valid expression token
    }
  }
  // If we reach this point, the lookahead was not successful
  return false;
}
