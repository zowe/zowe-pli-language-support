import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Pl1AstType, Person } from './generated/ast.js';
import type { Pl1Services } from './pli-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Pl1Services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.Pl1Validator;
    const checks: ValidationChecks<Pl1AstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Pl1Validator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
