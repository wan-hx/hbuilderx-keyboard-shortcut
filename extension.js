const hx = require("hbuilderx");
const path = require("path");

// let webviewEditorProvider = require('./src/webview/main.js');
let vueEditorProvider = require("./src/vue/vueMain.js");
let checkUpdate = require('./src/common/checkUpdate.js');

function activate(context) {
    
    let editorFileName = '可视化自定义快捷键视图';
    try {
        // hx.window.registerCustomEditorProvider("visualizationOfCustomizableShortcutKeys", new webviewEditorProvider({}));
        hx.window.registerCustomEditorProvider("visualizationOfCustomizableShortcutKeys", new vueEditorProvider());
    } catch (error) {};
    
    let keyboardShortcutSupport = hx.commands.registerCommand('extension.keyboardShortcutSupport', (param) => {
        const cscratFile = path.join(__dirname, 'template', editorFileName);
        hx.workspace.openTextDocument(cscratFile);
        checkUpdate();
    });
    context.subscriptions.push(keyboardShortcutSupport);
}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}
