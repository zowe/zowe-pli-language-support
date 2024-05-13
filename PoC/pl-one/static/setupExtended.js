import { addMonacoStyles, defineUserServices, MonacoEditorLanguageClientWrapper } from './bundle/index.js';
import { configureWorker } from './setup.js';

addMonacoStyles('monaco-editor-styles');

export const setupConfigExtended = () => {
    const extensionFilesOrContents = new Map();
    const languageConfigUrl = new URL('../language-configuration.json', window.location.href);
    const textmateConfigUrl = new URL('../syntaxes/pl-one.tmLanguage.json', window.location.href);
    extensionFilesOrContents.set('/language-configuration.json', languageConfigUrl);
    extensionFilesOrContents.set('/pl-one-grammar.json', textmateConfigUrl);

    return {
        wrapperConfig: {
            serviceConfig: defineUserServices(),
            editorAppConfig: {
                $type: 'extended',
                languageId: 'pl-one',
                code: `// PL One is running in the web!`,
                useDiffEditor: false,
                extensions: [{
                    config: {
                        name: 'pl-one-web',
                        publisher: 'generator-langium',
                        version: '1.0.0',
                        engines: {
                            vscode: '*'
                        },
                        contributes: {
                            languages: [{
                                id: 'pl-one',
                                extensions: [
                                    '.pl-one'
                                ],
                                configuration: './language-configuration.json'
                            }],
                            grammars: [{
                                language: 'pl-one',
                                scopeName: 'source.pl-one',
                                path: './pl-one-grammar.json'
                            }]
                        }
                    },
                    filesOrContents: extensionFilesOrContents,
                }],                
                userConfiguration: {
                    json: JSON.stringify({
                        'workbench.colorTheme': 'Default Dark Modern',
                        'editor.semanticHighlighting.enabled': true
                    })
                }
            }
        },
        languageClientConfig: configureWorker()
    };
};

export const executeExtended = async (htmlElement) => {
    const userConfig = setupConfigExtended();
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(userConfig, htmlElement);
};
