import { readFile } from "fs/promises"

const text = await readFile("packages/language/src/syntax-tree/ast.ts", "utf8");
const lines = text.split("\n");
const regexType = /export (interface|type) (\w+)/;
const regexField = / *(\w+): *(Expression|\w+<Expression>)( *\| *null|\[\]);/;
let currentType = "";
let count = 0;
console.log(`| syntax node | field | expected type | done |`);
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (regexType.test(line)) {
        currentType = line.match(regexType)![2];
    } else if(regexField.test(line)) {
        count++;
        const field = line.match(regexField)![1].trim().replace(";", "");
        console.log(`| ${currentType} | ${field} | | |`);
    }
}