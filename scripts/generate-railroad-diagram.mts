import { PliParserInstance } from '../packages/language/src/parser/parser';
import { createSyntaxDiagramsCode } from 'chevrotain';
import { writeFileSync } from 'fs';

const gast = PliParserInstance.getSerializedGastProductions();
const syntaxDiagram = createSyntaxDiagramsCode(gast);
writeFileSync('syntax-diagrams.html', syntaxDiagram);
