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

import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { setupClient } from "./config.js";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

let wrapper: MonacoEditorLanguageClientWrapper | undefined;
let shareTimeout: number | undefined;

export async function startClient() {
  const url = new URL(window.location.toString());
  const encodedContent = url.searchParams.get("content") ?? undefined;
  registerShareButton();
  try {
    let content: string | undefined = undefined;
    if (encodedContent) {
      content = decompressFromEncodedURIComponent(encodedContent);
    }
    const config = await setupClient(content);
    wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.init(config);
    const element = document.getElementById("monaco-root")!;
    wrapper.start(element);
  } catch (e) {
    console.log(e);
  }
}

export function registerShareButton() {
  const shareButton = document.getElementById("share-button");
  shareButton?.addEventListener("click", () => {
    if (wrapper) {
      const text = wrapper.getEditor()?.getValue();
      if (typeof text === "string") {
        share(text);
      }
    }
  });
}

async function share(content: string): Promise<void> {
  const compressedContent = compressToEncodedURIComponent(content);
  const url = new URL("", window.origin);
  url.searchParams.append("content", compressedContent);
  await navigator.clipboard.writeText(url.toString());
  const shareInfo = document.getElementById("share-info");
  shareInfo?.classList.remove("hidden");
  window.clearTimeout(shareTimeout);
  shareTimeout = window.setTimeout(() => {
    shareInfo?.classList.add("hidden");
  }, 4000);
}
