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

export function normalizeIdentifier<T extends string>(id: T): Uppercase<T> {
    return id.toUpperCase() as Uppercase<T>;
}

export function compareIdentifiers<T extends string>(lhs: T, rhs: T) {
    return normalizeIdentifier(lhs) === normalizeIdentifier(rhs);
}