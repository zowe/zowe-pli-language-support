import { MessageTemplate } from "./message-template";

export interface MessageService {
  /**
   * Return a localized {@link String} based on passed key and params.
   *
   * @param key Unique ID for each message in externalized message file.
   * @param parameters Arguments referenced by the format specifiers in the format * string in
   *     externalized message file.
   * @return {@link String}
   */
  getMessage(key: string, ...parameters: any[]): string;

  /**
   * Localize the template and return it as a string. If the arguments of the template are instances
   * of the {@link MessageTemplate} too, they also will be localized.
   *
   * @param template a {@link MessageTemplate} to localize
   * @return localized string
   */
  localizeTemplate(template: MessageTemplate): string;

  /** Reload and updates the messages for Cobol and its dialect. */
  reloadMessages(): void;
}