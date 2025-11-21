import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { fileURLToPath } from "url";

/**
 * With this script, we can test whether all AST-relevant enum are really parsed.
 * This is useful when adding new enums or literals to ensure they are properly mapped.
 * Let's assume that we can have gaps in the mapping, but we want to be aware of them.
 */

const ReportFileName = "MISSING-TOKENS.md";
const EnumIgnoreList = new Set<string>([
    //TODO when we add enums to ast.ts, we probably need to add them here as well if they are not relevant for token mapping
    //TODO any better way to manage the enums?
    "SyntaxKind", "SkipModeType", "ReferenceType"
]);

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Adjust these paths as needed
const astPath = path.resolve(__dirname, "packages/language/src/syntax-tree/ast.ts");
const tokensPath = path.resolve(__dirname, "packages/language/src/parser/tokens.ts");

const astSource = fs.readFileSync(astPath, "utf8");

// Parse enums and literals from ast.ts
function parseEnums(source: string): Record<string, string[]> {
    const enums: Record<string, string[]> = {};
    const enumRegex = /export\s+enum\s+(\w+)\s*{([^}]*)}/g;
    let match: RegExpExecArray | null;
    while ((match = enumRegex.exec(source))) {
        const enumName = match[1];
        if (EnumIgnoreList.has(enumName)) {
            continue;
        }
        const body = match[2];
        const literals = body
            .split("\n")
            .map(line => line.replace(/\/\*.*?\*\//g, "")) // remove inline comments
            .map(line => line.trim().replace(/,?$/, "")) // remove trailing comma
            .filter(line => line && !line.startsWith("//"))
            .map(line => line.split("=")[0].trim()) // remove explicit values
            .filter(Boolean);
        enums[enumName] = literals;
    }
    return enums;
}

// Collect all ast.<Enum>.<Literal> references and their line numbers
async function collectReferences(tokensPath: string): Promise<Map<string, number>> {
    const refMap = new Map<string, number>();
    const rl = readline.createInterface({
        input: fs.createReadStream(tokensPath),
        crlfDelay: Infinity,
    });

    let lineNumber = 0;
    const refRegex = /\bast\.(\w+)\.(\w+)\b/g;

    for await (const line of rl) {
        lineNumber++;
        let match: RegExpExecArray | null;
        while ((match = refRegex.exec(line))) {
            const key = `${match[1]}.${match[2]}`;
            if (!refMap.has(key)) {
                refMap.set(key, lineNumber);
            }
        }
    }
    return refMap;
}

async function main() {
    const enums = parseEnums(astSource);
    const refMap = await collectReferences(tokensPath);

    const rows: string[] = [];
    rows.push("| Enum | Literal | File Location |");
    rows.push("|------|---------|--------------|");

    let hasMissing = false;
    for (const [enumName, literals] of Object.entries(enums)) {
        for (const literal of literals) {
            const key = `${enumName}.${literal}`;
            const hasLocation = refMap.has(key);
            const location = hasLocation
                ? `[tokens.ts#${refMap.get(key)}](packages/language/src/parser/tokens.ts#L${refMap.get(key)})`
                : "";
            hasMissing = hasMissing || !hasLocation;
            rows.push(`| ${enumName} | ${literal} | ${location} |`);
        }
    }

    const table = rows.join("\n");
    fs.writeFileSync(ReportFileName, table, "utf8");

    if (hasMissing) {
        console.error(`Missing token-to-enum mappings found. See ${ReportFileName} for details.`);
        process.exit(1);
    } else {
        console.log("All token-to-enum mappings are present.");
    }
}

main();