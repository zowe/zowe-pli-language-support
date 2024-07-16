import deepmerge from 'deepmerge';
import * as fs from 'fs/promises';

const generated = JSON.parse(await fs.readFile('./packages/extension/syntaxes/pli.tmLanguage.json', 'utf8'));
const manual = JSON.parse(await fs.readFile('./packages/extension/syntaxes/pli.manual.json', 'utf8'));

let result = deepmerge(generated, manual, {
    arrayMerge: (destinationArray, sourceArray) => [...destinationArray, ...sourceArray],
});
const json = JSON.stringify(result, null, 2);
await fs.writeFile('./packages/extension/syntaxes/pli.merged.json', json);
