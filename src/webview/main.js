const hx = require('hbuilderx');

let icon = require('./static/icon.js');
let { keyBoard, getThemeColor } = require('../utils.js');

let CustomDocument = hx.CustomEditor.CustomDocument;
let CustomEditorProvider = hx.CustomEditor.CustomEditorProvider;
let CustomDocumentEditEvent = hx.CustomEditor.CustomDocumentEditEvent;

let uiData = {};

class CatCustomDocument extends CustomDocument {
    constructor(uri) {
        super(uri)
    }
    dispose() {
        super.dispose();
    }
};

class CatCustomEditorProviderForWebview extends CustomEditorProvider {
    constructor(context) {
        super()
    }
    openCustomDocument(uri) {
        return Promise.resolve(new CatCustomDocument(uri));
    }
    resolveCustomEditor(document, webViewPanel) {
        
        setView(webViewPanel);

        webViewPanel.onDidDispose(function() {
            console.log("custom editor disposed");
        });
        
        let provider = this;
        webViewPanel.webView.onDidReceiveMessage(function(msg) {
            let action = msg.command;
            switch (action) {
                case 'showKeyboardProgram':
                    let keyboardProgram = msg.keyboardProgram;
                    let message = `目前快捷键方案为 ${keyboardProgram}。\n 菜单【工具】，可切换为其它方案（如vscode等）。切换需重新打开此视图。`;
                    hx.window.showInformationMessage(message, ['我知道了']);
                    break;
                case 'setKeys':
                    let command = new keyBoard(webViewPanel, uiData);
                    command.writeUserSet(msg.data);
                    break;
                case 'resetKeys':
                    let r = new keyBoard(webViewPanel, uiData);
                    r.resetUserSet(msg.data);
                    break;
                case 'help':
                    hx.env.openExternal('https://ext.dcloud.net.cn/plugin?name=hbuilderx-keyboard-shortcut-support#rating');
                    break;
                default:
                    break;
            };
        });
    }
};

async function setView(webViewPanel) {
    // theme info
    uiData = getThemeColor();
    let { fontColor } = uiData;
    
    // icon
    let editIcon = icon.editIcon(fontColor);
    let resetIcon = icon.resetIcon(fontColor);
    uiData = Object.assign(uiData, {
        'editIcon': editIcon,
        'resetIcon': resetIcon
    });
    
    // HBuilderX commands and plugins commands
    let cds = new keyBoard(webViewPanel, uiData);
    cds.main();
}


module.exports = CatCustomEditorProviderForWebview;
