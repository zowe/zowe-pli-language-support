import { PPInstruction, Label, PPIGoto } from "./pli-preprocessor-instructions";


export type PliPreprocessorProgram = {
    instructions: PPInstruction[];
};

export class PliPreprocessorProgramBuilder {
    private labelCounter = 0;
    private readonly labelStack: Record<string, Label>[] = [{}];
    private readonly program: PliPreprocessorProgram;

    constructor() {
        this.program = { instructions: [] };
    }

    pushInstruction(instruction: PPInstruction): void {
        this.program.instructions.push(instruction);
    }

    pushDoGroup(): void {
        this.labelStack.push({});
    }

    createLabel(label?: string): Label {
        label ??= `$label${this.labelCounter++}$`;
        const newLabel: Label = { address: undefined };
        this.labelStack[this.labelStack.length - 1][label] = newLabel;
        return newLabel;
    }

    pushLabel(label: Label): void {
        label.address = this.program.instructions.length;
    }

    popDoGroup(): void {
        this.labelStack.pop();
    }

    lookupLabel(label: string): Label {
        for (let i = this.labelStack.length - 1; i >= 0; i--) {
            const labelEntry = this.labelStack[i][label];
            if (labelEntry) {
                return labelEntry;
            }
        }
        throw new Error(`Label '${label}' not found.`);
    }

    build(): PliPreprocessorProgram {
        return {
            instructions: this.program.instructions.map(instr => {
                if ((instr.type === 'goto' && typeof instr.address !== 'number') || (instr.type === 'branchIfNEQ' && typeof instr.address !== 'number')) {
                    return <PPIGoto>{
                        ...instr,
                        address: instr.address.address,
                    };
                }
                return instr;
            })
        };
    }
}
