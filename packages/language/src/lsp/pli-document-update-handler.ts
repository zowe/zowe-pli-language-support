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

import { URI } from "langium";
import { DefaultDocumentUpdateHandler, DocumentUpdateHandler } from "langium/lsp";
import { TextDocument, TextDocumentChangeEvent } from "vscode-languageserver";

export class PliDocumentUpdateHandler extends DefaultDocumentUpdateHandler implements DocumentUpdateHandler {

    didCloseDocument(event: TextDocumentChangeEvent<TextDocument>): void {
        const uri = URI.parse(event.document.uri);
        if (uri.scheme !== 'pli-builtin') {
            // Only remove the file from memory if it is not a built-in file
            this.fireDocumentUpdate([], [uri]);
        }
    }

}
