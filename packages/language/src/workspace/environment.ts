export const IsDebugging =
  typeof process !== "undefined" && process.env?.NODE_ENV === "development";
