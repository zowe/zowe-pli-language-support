import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { PlOneAstType, Progname } from './generated/ast.js';
import type { PlOneServices } from './pl-one-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: PlOneServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.PlOneValidator;
    const checks: ValidationChecks<PlOneAstType> = {
        Progname: validator.checkPrognameStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class PlOneValidator {

    checkPrognameStartsWithCapital(prog: Progname, accept: ValidationAcceptor): void {
        if (prog.name) {
            const firstChar = prog.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Prog name should start with a capital.', { node: prog, property: 'name' });
            }
        }
    }

}
