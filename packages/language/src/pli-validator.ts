/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import type { ValidationChecks } from 'langium';
import type { Pl1AstType } from './generated/ast.js';
import type { Pl1Services } from './pli-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Pl1Services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.Pl1Validator;
    const checks: ValidationChecks<Pl1AstType> = {
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Pl1Validator {

}
