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

import { URI, Utils } from "vscode-uri";
export { URI };

export namespace UriUtils {

    export const basename = Utils.basename;
    export const dirname = Utils.dirname;
    export const extname = Utils.extname;
    export const joinPath = Utils.joinPath;
    export const resolvePath = Utils.resolvePath;

    const isWindows = typeof process === 'object' && process?.platform === 'win32';

    export function equals(a?: URI | string, b?: URI | string): boolean {
        return a?.toString() === b?.toString();
    }

    export function relative(from: URI | string, to: URI | string): string {
        const fromPath = typeof from === 'string' ? URI.parse(from).path : from.path;
        const toPath   = typeof   to === 'string' ? URI.parse(to).path   : to.path;
        const fromParts = fromPath.split('/').filter(e => e.length > 0);
        const toParts   =   toPath.split('/').filter(e => e.length > 0);

        if (isWindows) {
            const upperCaseDriveLetter = /^[A-Z]:$/;
            if (fromParts[0] && upperCaseDriveLetter.test(fromParts[0])) {
                fromParts[0] = fromParts[0].toLowerCase();
            }
            if (toParts[0] && upperCaseDriveLetter.test(toParts[0])) {
                toParts[0] = toParts[0].toLowerCase();
            }
            if (fromParts[0] !== toParts[0]) {
                // in case of different drive letters, we cannot compute a relative path, so...
                return toPath.substring(1); // fall back to full 'to' path, drop the leading '/', keep everything else as is for good comparability
            }
        }

        let i = 0;
        for (; i < fromParts.length; i++) {
            if (fromParts[i] !== toParts[i]) {
                break;
            }
        }
        const backPart = '../'.repeat(fromParts.length - i);
        const toPart = toParts.slice(i).join('/');
        return backPart + toPart;
    }

    export function normalize(uri: URI | string): string {
        return URI.parse(uri.toString()).toString();
    }

}