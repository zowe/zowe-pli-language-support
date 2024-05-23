/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.PlOneValidator;
    const checks = {
        Progname: validator.checkPrognameStartsWithCapital
    };
    registry.register(checks, validator);
}
/**
 * Implementation of custom validations.
 */
export class PlOneValidator {
    checkPrognameStartsWithCapital(prog, accept) {
        if (prog.name) {
            const firstChar = prog.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Prog name should start with a capital.', { node: prog, property: 'name' });
            }
        }
    }
}
//# sourceMappingURL=pl-one-validator.js.map