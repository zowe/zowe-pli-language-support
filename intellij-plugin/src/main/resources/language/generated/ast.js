/******************************************************************************
 * This file was generated by langium-cli 3.0.3.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/
import { AbstractAstReflection } from 'langium';
export const PlOneTerminals = {
    WS: /\s+/,
    ID: /[_a-zA-Z][\w_]*/,
    INT: /[0-9]+/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};
export const EndProgram = 'EndProgram';
export function isEndProgram(item) {
    return reflection.isInstance(item, EndProgram);
}
export const Greeting = 'Greeting';
export function isGreeting(item) {
    return reflection.isInstance(item, Greeting);
}
export const Loop = 'Loop';
export function isLoop(item) {
    return reflection.isInstance(item, Loop);
}
export const Model = 'Model';
export function isModel(item) {
    return reflection.isInstance(item, Model);
}
export const Person = 'Person';
export function isPerson(item) {
    return reflection.isInstance(item, Person);
}
export const Progname = 'Progname';
export function isProgname(item) {
    return reflection.isInstance(item, Progname);
}
export class PlOneAstReflection extends AbstractAstReflection {
    getAllTypes() {
        return ['EndProgram', 'Greeting', 'Loop', 'Model', 'Person', 'Progname'];
    }
    computeIsSubtype(subtype, supertype) {
        switch (subtype) {
            default: {
                return false;
            }
        }
    }
    getReferenceType(refInfo) {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'Greeting:person': {
                return Person;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }
    getTypeMetaData(type) {
        switch (type) {
            case 'EndProgram': {
                return {
                    name: 'EndProgram',
                    properties: [
                        { name: 'name' }
                    ]
                };
            }
            case 'Greeting': {
                return {
                    name: 'Greeting',
                    properties: [
                        { name: 'person' }
                    ]
                };
            }
            case 'Loop': {
                return {
                    name: 'Loop',
                    properties: [
                        { name: 'name' },
                        { name: 'num' }
                    ]
                };
            }
            case 'Model': {
                return {
                    name: 'Model',
                    properties: [
                        { name: 'endProgram' },
                        { name: 'greetings', defaultValue: [] },
                        { name: 'loop', defaultValue: [] },
                        { name: 'persons', defaultValue: [] },
                        { name: 'progname', defaultValue: [] }
                    ]
                };
            }
            case 'Person': {
                return {
                    name: 'Person',
                    properties: [
                        { name: 'name' }
                    ]
                };
            }
            case 'Progname': {
                return {
                    name: 'Progname',
                    properties: [
                        { name: 'name' },
                        { name: 'num' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    properties: []
                };
            }
        }
    }
}
export const reflection = new PlOneAstReflection();
//# sourceMappingURL=ast.js.map