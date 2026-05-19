export enum SemanticsKind {
  Identifier,
  Keyword,
  String,
  Comment,
  Number,
}

export interface WithRange {
    startOffset: number;
    endOffset: number;
}

export interface Token extends WithRange {
  image: string;
  semanticsKind: SemanticsKind;
}

export interface ParseError extends WithRange {
  message: string;
}
