# Migration Guide

This document provides guidance on how to migrate from older versions of the language parser to the latest version.
It can be seen as pattern database of translations from old syntax/structures to new ones.

The old parser can be found in the `#file:parser-chevrotain.ts` file.
The new parser can be found in the `#file:parser-handwritten.ts` file.

## Rules

For each rule defined in the old parser, follow the pattern below to migrate it to the new parser structure.

```ts
//Prompt: if the are doubts about the AST type, place the original code line and comment it out and ask the user to fill the gap
ConditionPrefix = this.RULE("ConditionPrefix", () => {
    let element = this.push(this.createConditionPrefix());

    //Prompt: look up and apply other patterns here, if no pattern is matching,
    //put in the original code but comment it out and
    //ask the user to fill in the gaps or to provide a pattern

    return this.pop<ast.ConditionPrefix>();
});
```

becomes

```ts
ruleConditionPrefix(state: ParserState): ast.ConditionPrefix {
    //Prompt: here we create the element, look up the AST type first and initialize its
    //properties with [] or null, except for 'kind' which should be set to ast.SyntaxKind.<TypeName>
    const element: ast.ConditionPrefix = {
        kind: ast.SyntaxKind.ConditionPrefix,
        container: null,
        items: [],
    };

    return element;
}
```
