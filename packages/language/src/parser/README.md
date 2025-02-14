# Preprocessor implementation

```mermaid
flowchart TB
    I1[/text/] --> MarginsProcessor --> I2[/text without margins/]

    PreprocessorLexer -->|1: for every preprocessor instruction| PreprocessorParser
    PreprocessorParser -->|2: return instruction| PreprocessorLexer
    PreprocessorLexer -->|3: interpret instruction| PreprocessorLexer

    I2 --> PreprocessorLexer -->|4: generate tokens| I3[/tokens/]
    I3 --> PliParser --> I4[/AST/]
```

The preprocessor is a tool that allows to modify the source code before it is parsed. So, the preprocessor returns a stream of tokens in the end, without reflecting the preprocessor instructions. The preprocessor instructions get expanded and produce more tokens.

## Terms and concepts

* `MarginsProcessor`: a processor that removes margins from the text. The text is replaced with spaces to have the same positions for the remaining text.
* `PreprocessorLexer`: a lexer that reads the source code and returns a stream of tokens. During the processing, it can interpret preprocessor instructions.
* `PreprocessorParser`: a parser that reads the stream of tokens and returns a preprocessor instruction AST (abstract syntax tree).
* `PliParser`: a parser that reads the stream of tokens and returns a PL/I AST.

## The preprocessor algorithm

1. The preprocessor lexer reads the source code and for every preprocessor instruction, it calls the preprocessor parser.
2. This parser returns exactly one preprocessor instruction.
3. The preprocessor lexer interprets the instruction and may adds new tokens to the output.
4. The preprocessor lexer emits tokens that are later used by the PliParser.
