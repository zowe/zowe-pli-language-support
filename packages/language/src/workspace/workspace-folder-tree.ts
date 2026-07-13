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

import { UriUtils } from "../utils/uri";

export type WorkspaceFolderNode<TData> = {
    uri: string;
    part: string;
    parent: WorkspaceFolderNode<TData> | null;
    children: Record<string, WorkspaceFolderNode<TData>>;
    data?: TData;
}

export class WorkspaceFolderTree<TData> {
    private root: WorkspaceFolderNode<TData> = {
        uri: "",
        part: "",
        parent: null,
        children: {},
        data: undefined,
    };

    constructor(private readonly caseInsensitive: boolean = false) {}

    public addWorkspaceFolder(folderUri: string, folder: TData): void {
        const parts = this.prepareUriParts(folderUri);
        let currentChildren = this.root.children;
        let parent: WorkspaceFolderNode<TData> = this.root;
        const currentPath = [];
        for (const part of parts) {
            currentPath.push(part);
            if (currentChildren[part] === undefined) {
                currentChildren[part] = {
                    uri: currentPath.join("/"),
                    part,
                    parent,
                    children: {},
                };
            }
            parent = currentChildren[part];
            currentChildren = parent.children;
        }
        parent.data = folder;
    }

    private prepareUriParts(folderUri: string) {
        const normalized = UriUtils.normalizePath(folderUri);
        return UriUtils.parts(normalized).map(part => this.caseInsensitive ? part.toLowerCase() : part);
    }

    public getWorkspaceFolderOf(uri: string): TData | undefined {
        const parts = this.prepareUriParts(uri);
        let currentChildren = this.root.children;
        let parent: WorkspaceFolderNode<TData> = this.root;
        let currentData: TData | undefined = parent.data;
        for (const part of parts) {
            if (currentChildren[part] === undefined) {
                break;
            }
            parent = currentChildren[part];
            currentChildren = parent.children;
            if (parent.data !== undefined) {
                currentData = parent.data;
            }
        }
        return currentData;
    }
}