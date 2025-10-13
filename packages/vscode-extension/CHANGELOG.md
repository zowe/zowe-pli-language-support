# Changelog

## 1.0.3 (Oct. 2025)

- Fix a bug that caused high CPU usage ([#288](https://github.com/zowe/zowe-pli-language-support/pull/288)).
- Usage of builtin functions is now configurable in the PL/I plugin configuration ([#294](https://github.com/zowe/zowe-pli-language-support/pull/294)).
- Improve reliability of the `textDocument/documentSymbol` LSP request ([#293](https://github.com/zowe/zowe-pli-language-support/pull/293)).
- Enable support for the `PP(INCLUDE(ID(...)))` compiler option ([#290](https://github.com/zowe/zowe-pli-language-support/pull/290)).
- Enable support for the `INCAFTER` compiler option ([#295](https://github.com/zowe/zowe-pli-language-support/pull/295)).
- Add support for various macro preprocessor statements:
    - `%DO SKIP;` ([#299](https://github.com/zowe/zowe-pli-language-support/pull/299)).
    - `%DO I = 1 TO ...` ([#343](https://github.com/zowe/zowe-pli-language-support/pull/343), [#351](github.com/zowe/zowe-pli-language-support/pull/351)).
    - Computation on arrays ([#341](https://github.com/zowe/zowe-pli-language-support/pull/341)).
    - Procedures ([#350](https://github.com/zowe/zowe-pli-language-support/pull/350), [#352](https://github.com/zowe/zowe-pli-language-support/pull/352), [#369](https://github.com/zowe/zowe-pli-language-support/pull/369)).
    - `%NOTE` ([#385](https://github.com/zowe/zowe-pli-language-support/pull/385)).
    - `%ANSWER` ([#404](https://github.com/zowe/zowe-pli-language-support/pull/404)).
    - `%CALL` ([#409](https://github.com/zowe/zowe-pli-language-support/pull/409)).
    - `%REPLACE` ([#420](https://github.com/zowe/zowe-pli-language-support/pull/420)).
    - `%SELECT` ([#423](https://github.com/zowe/zowe-pli-language-support/pull/423), [#426](https://github.com/zowe/zowe-pli-language-support/pull/426)).
- Improve performance ([#328](https://github.com/zowe/zowe-pli-language-support/pull/328), [#330](https://github.com/zowe/zowe-pli-language-support/pull/330), [#390](github.com/zowe/zowe-pli-language-support/pull/390)).
- Improve reliability of the language server after deleting/closing files ([#337](https://github.com/zowe/zowe-pli-language-support/pull/337)).
- Improve hover support to show procedure and variable declaration attributes ([#329](https://github.com/zowe/zowe-pli-language-support/pull/329)).
- Improve hover and definition requests for `%INSCAN` and `%INCLUDE` statements ([#387](https://github.com/zowe/zowe-pli-language-support/pull/387)).
- Fixed a bug related to the warnings shown on code outside of the margins ([#338](https://github.com/zowe/zowe-pli-language-support/pull/338)).
- Implemented various compiler validations ([#354](https://github.com/zowe/zowe-pli-language-support/pull/354), [#365](https://github.com/zowe/zowe-pli-language-support/pull/365), [#367](github.com/zowe/zowe-pli-language-support/pull/367), [#389](github.com/zowe/zowe-pli-language-support/pull/389)).
- Include JSON schema files for the configuration files ([#373](https://github.com/zowe/zowe-pli-language-support/pull/373)).
- Improve parsing and validation of compiler options ([#314](github.com/zowe/zowe-pli-language-support/pull/314), [#318](https://github.com/zowe/zowe-pli-language-support/pull/318), [#342](https://github.com/zowe/zowe-pli-language-support/pull/342), [#357](https://github.com/zowe/zowe-pli-language-support/pull/357), [#368](https://github.com/zowe/zowe-pli-language-support/pull/368), [#377](https://github.com/zowe/zowe-pli-language-support/pull/377), [#388](https://github.com/zowe/zowe-pli-language-support/pull/388), [#417](https://github.com/zowe/zowe-pli-language-support/pull/417)).
- Support the `SQLCA` and `SQLDA` builtins ([#401](https://github.com/zowe/zowe-pli-language-support/pull/401)).
