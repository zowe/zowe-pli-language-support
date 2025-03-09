import { EmbeddedActionsParser, TokenType, IParserConfig, ParserMethod, SubruleMethodOpts, IToken } from "chevrotain";
import { LLStarLookaheadStrategy } from "chevrotain-allstar";

export interface SubruleAssignMethodOpts<ARGS, R> extends SubruleMethodOpts<ARGS> {
    assign: (result: R) => void;
}

export interface ParserStackAccess<T> {
    readonly item: T;
}

export class AbstractParser extends EmbeddedActionsParser {

    constructor(tokens: TokenType[], config?: IParserConfig) {
        super(tokens, {
            ...config,
            recoveryEnabled: true,
            lookaheadStrategy: new LLStarLookaheadStrategy()
        });
    }

    private stack: any[] = [];

    protected push<T>(value: T): ParserStackAccess<T> {
        this.stack.push(value);
        const that = this;
        return {
            get item() {
                return that.peek();
            }
        };
    }

    protected peek(): any {
        return this.stack[this.stack.length - 1];
    }

    protected pop() {
        return this.stack.pop();
    }

    protected consume_assign(index: number, tokenType: TokenType, assign: (value: IToken) => void): void {
        const token = this.consume(index, tokenType);
        assign(token);
    }

    protected CONSUME_ASSIGN(tokenType: TokenType, assign: (value: IToken) => void): void {
        this.consume_assign(0, tokenType, assign);
    }

    protected CONSUME_ASSIGN1(tokenType: TokenType, assign: (value: IToken) => void): void {
        this.consume_assign(1, tokenType, assign);
    }

    protected CONSUME_ASSIGN2(tokenType: TokenType, assign: (value: IToken) => void): void {
        this.consume_assign(2, tokenType, assign);
    }

    protected CONSUME_ASSIGN3(tokenType: TokenType, assign: (value: IToken) => void): void {
        this.consume_assign(3, tokenType, assign);
    }

    protected subrule_assign<ARGS extends unknown[], R>(
        index: number,
        ruleToCall: ParserMethod<ARGS, R>,
        options: SubruleAssignMethodOpts<ARGS, R>
    ): void {
        let value: R;
        try {
            value = this.subrule(index, ruleToCall, options);
        } finally {
            this.ACTION(() => {
                if (value === undefined) {
                    value = this.pop();
                }
                if (value !== undefined) {
                    options.assign(value);
                }
            });
        }
    }

    protected SUBRULE_ASSIGN<ARGS extends unknown[], R>(
        ruleToCall: ParserMethod<ARGS, R>,
        options: SubruleAssignMethodOpts<ARGS, R>
    ): void {
        this.subrule_assign(0, ruleToCall, options);
    }

    protected SUBRULE_ASSIGN1<ARGS extends unknown[], R>(
        ruleToCall: ParserMethod<ARGS, R>,
        options: SubruleAssignMethodOpts<ARGS, R>
    ): void {
        this.subrule_assign(1, ruleToCall, options);
    }

    protected SUBRULE_ASSIGN2<ARGS extends unknown[], R>(
        ruleToCall: ParserMethod<ARGS, R>,
        options: SubruleAssignMethodOpts<ARGS, R>
    ): void {
        this.subrule_assign(2, ruleToCall, options);
    }

    protected SUBRULE_ASSIGN3<ARGS extends unknown[], R>(
        ruleToCall: ParserMethod<ARGS, R>,
        options: SubruleAssignMethodOpts<ARGS, R>
    ): void {
        this.subrule_assign(3, ruleToCall, options);
    }

}