import { test } from "vitest";
import { readFileSync } from "fs";
import { performance } from 'perf_hooks';

test('perf', () => {
    let text = readFileSync(process.cwd() + '/code_samples/RXGIM.pli', 'utf-8');
    while (text.length < 500_000) {
        text += text;
    }
    console.log('Lexing ' + text.length + ' characters');
    const items: number[] = [];
    for (let i = 0; i < 20; i++) {
        const start = performance.now();
        tokenize(text, '');
        const end = performance.now();
        items.push(end - start);
    }
    console.log('done');
}, 100000);

// Type definitions
interface Token {
  Image: string;
  Type: number;
  Range: Range;
  Uri: string;
  Kind: number;
  Element: any;
  ImmediateFollow: boolean;
}

interface Range {
  Start: number;
  End: number;
}

// Token type constants
const Id = 1;
const Number = 2;
const StringTerm = 3;
const Comment = 4;
// const ExecFragment = 5;
const PlusEqualsOp = 6;        // +=
const MinusEqualsOp = 7;       // -=
const MultEqualsOp = 8;        // *=
const DivEqualsOp = 9;         // /=
const OrEqualsOp = 10;         // |=
const AndEqualsOp = 11;        // &=
const NotEqualsOp = 12;        // ^= AND <> NOTE: The former is subject to the NOT compiler option
const NotLessThanOp = 13;      // ^<
const LessThanEqualsOp = 14;   // <=
const GreaterThanEqualsOp = 15; // >=
const NotGreaterThanOp = 16;   // ^>
const ConcatOp = 17;           // ||
const ExpOp = 18;              // **
const Locator = 19;            // ->
const EqualsGreaterThanOp = 20; // =>
const Semicolon = 21;          // ;
const OpenParen = 22;          // (
const CloseParen = 23;         // )
const Colon = 24;              // :
const Comma = 25;              // ,
const MultOp = 26;             // *
const EqualsOp = 27;           // =
const OrOp = 28;               // |
const NotOp = 29;              // ^
const AndOp = 30;              // &
const LessThanOp = 31;         // <
const GreaterThanOp = 32;      // >
const PlusOp = 33;             // +
const MinusOp = 34;            // -
const DivOp = 35;              // /
const Dot = 36;                // .
const Percent = 37;            // %

interface TwoCharToken {
  rune: string;
  int: number;
}

const SingleCharTokens: Record<string, number> = {
  ';': Semicolon,
  '(': OpenParen,
  ')': CloseParen,
  ':': Colon,
  ',': Comma,
  '*': MultOp,
  '=': EqualsOp,
  '|': OrOp,
  '^': NotOp,
  '&': AndOp,
  '<': LessThanOp,
  '>': GreaterThanOp,
  '+': PlusOp,
  '-': MinusOp,
  '/': DivOp,
  '.': Dot,
  '%': Percent,
};

const TwoCharTokens: Record<string, TwoCharToken[]> = {
  '=': [{ rune: '>', int: EqualsGreaterThanOp }],
  '>': [{ rune: '=', int: GreaterThanEqualsOp }],
  '<': [{ rune: '=', int: LessThanEqualsOp }],
  '|': [{ rune: '=', int: OrEqualsOp }, { rune: '|', int: ConcatOp }],
  '&': [{ rune: '=', int: AndEqualsOp }],
  '^': [{ rune: '=', int: NotEqualsOp }, { rune: '<', int: NotLessThanOp }, { rune: '>', int: NotGreaterThanOp }],
  '+': [{ rune: '=', int: PlusEqualsOp }],
  '-': [{ rune: '=', int: MinusEqualsOp }, { rune: '>', int: Locator }],
  '*': [{ rune: '=', int: MultEqualsOp }, { rune: '*', int: ExpOp }],
  '/': [{ rune: '=', int: DivEqualsOp }],
};

function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

function isDigit(char: string): boolean {
  return /\d/.test(char);
}

function isLetter(char: string): boolean {
  return /[a-zA-Z]/.test(char);
}

function tokenize(input: string, uri: string): Token[] {
  const tokens: Token[] = [];
  
  for (let i = 0; i < input.length; ) {
    const char = input[i];
    
    if (isWhitespace(char)) {
      // Simply skip any whitespace
      i++;
      continue;
    }
    
    if (char === '/') {
      const start = i;
      const nextChar = input[i + 1];
      if (nextChar === '*') {
        i += 2;
        while (i < input.length) {
          if (input[i] === '*' && input[i + 1] === '/') {
            i += 2;
            break;
          }
          i++;
        }
        tokens.push({
          Image: input.slice(start, i),
          Type: Comment,
          Range: { Start: start, End: i },
          Uri: uri,
          Kind: 0,
          Element: null,
          ImmediateFollow: false,
        });
        continue;
      }
    }
    
    // Check for two-character tokens
    if (TwoCharTokens[char]) {
      const nextChar = input[i + 1];
      const end = i + 2;
      let found = false;
      
      for (const followItem of TwoCharTokens[char]) {
        if (followItem.rune === nextChar) {
          tokens.push({
            Image: input.slice(i, end),
            Type: followItem.int,
            Range: { Start: i, End: end },
            Uri: uri,
            Kind: 0,
            Element: null,
            ImmediateFollow: false,
          });
          i = end;
          found = true;
          break;
        }
      }
      
      if (found) {
        continue;
      }
    }
    
    // Check for single-character tokens
    if (SingleCharTokens[char]) {
      tokens.push({
        Image: char,
        Type: SingleCharTokens[char],
        Range: { Start: i, End: i + 1 },
        Uri: uri,
        Kind: 0,
        Element: null,
        ImmediateFollow: false,
      });
      i++;
      continue;
    }
    
    // Handle numbers
    if (isDigit(char)) {
      const start = i;
      while (i < input.length && (isDigit(input[i]) || input[i] === '.')) {
        i++;
      }
      tokens.push({
        Image: input.slice(start, i),
        Type: Number,
        Range: { Start: start, End: i },
        Uri: uri,
        Kind: 0,
        Element: null,
        ImmediateFollow: false,
      });
      continue;
    }
    
    // Handle identifiers
    if (isLetter(char) || char === '_') {
      const start = i;
      while (i < input.length && (isLetter(input[i]) || isDigit(input[i]) || input[i] === '_')) {
        i++;
      }
      tokens.push({
        Image: input.slice(start, i),
        Type: Id,
        Range: { Start: start, End: i },
        Uri: uri,
        Kind: 0,
        Element: null,
        ImmediateFollow: false,
      });
      // TODO: Handle keywords
      continue;
    }
    
    // Handle string literals
    if (char === '"' || char === "'") {
      const quote = char;
      const start = i;
      i++; // Skip opening quote
      
      while (i < input.length) {
        if (input[i] === quote) {
          i++; // Include closing quote
          break;
        }
        i++;
      }
      
      tokens.push({
        Image: input.slice(start, i),
        Type: StringTerm,
        Range: { Start: start, End: i },
        Uri: uri,
        Kind: 0,
        Element: null,
        ImmediateFollow: false,
      });
      continue;
    }
    
    // Unrecognized character
    console.log("Unrecognized character:", char, "at position", i);
    i++;
  }
  
  return tokens;
}