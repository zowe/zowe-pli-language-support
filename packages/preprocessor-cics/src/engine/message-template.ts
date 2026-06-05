export class MessageTemplate {
  template: string;
  delimiter: string | null;
  args: any[];

  /**
   * Create a {@link MessageTemplate} that contains a template with arguments. The arguments may be
   * also {@link MessageTemplate} and they will be localized recursively.
   *
   * @param template the key for localization
   * @param args arguments to built in the string template after the localization
   * @return localized string
   */
  public static of(template: string, ...args: any[]): MessageTemplate {
    return new MessageTemplate(template, null, ...args);
  }

  /**
   * Create a {@link MessageTemplate} that contains a template with arguments, and the delimiter
   * that will be used for concatenating the arguments into one string. If the delimiter is null,
   * the arguments will not be concatenated.
   *
   * @param template the key for localization
   * @param delimiter string used as a delimiter while concatenating the arguments
   * @param args arguments to built in the string template after the localization
   * @return localized string
   */
  public static concatenatingArgs(template: string, delimiter: string, ...args: any[]): MessageTemplate {
    return new MessageTemplate(template, delimiter, ...args);
  }

  private constructor(template: string, delimiter: string | null, ...args: any[]) {
    this.template = template;
    this.delimiter = delimiter;
    this.args = args;
  }
}