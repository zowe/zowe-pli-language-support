import { GlobalConfigLoader, Messages, sendRequest, URI } from "pli-language";
import { Connection } from "vscode-languageserver";

export class VscodeGlobalConfigLoader implements GlobalConfigLoader {
  constructor(private readonly connection: Connection) {}
  async loadGlobalConfig(workspaceUri: URI): Promise<Messages.GlobalConfig> {
    return await sendRequest(this.connection, Messages.GetGlobalConfig, workspaceUri.toString());
  }
}