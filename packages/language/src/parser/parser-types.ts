import { IRecognitionException , IToken} from "chevrotain";

export interface Parser<TAst, TToken extends IToken = IToken> {
    set input(value: TToken[]);
    get errors(): IRecognitionException[];
    parse(): TAst;
}