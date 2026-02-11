import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";

const fixFlag = process.argv.includes("--fix");

const header = await readFile("license-header.js", "utf-8");
const files = await glob("**/{src,test}/**/*.{js,mjs,cjs,ts,mts,cts}");
let count = 0;
for (const file of files) {
    if(file.startsWith("packages/language/test/fourslash-harness/wrappers")) {
        continue;
    }

    const content = await readFile(file, "utf-8");
    if (!content.startsWith(header)) {
        count++;
        if (!fixFlag) {
            console.error(`${file}: missing license header.`);
        } else {
            await writeFile(file, header + content);
            console.error(`${file}: added license header.`);
        }
    }
}

if (count > 0) {
    const are = fixFlag ? "were" : "are";
    console.error(`${count} files of ${files.length} ${are} missing license headers.`);
    !fixFlag && process.exit(1);
}