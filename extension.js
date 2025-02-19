const hx = require("hbuilderx");
const path = require("path");

let CatCustomEditorProviderForWebview = require('./src/webview/main.js');
let checkUpdate = require('./src/common/checkUpdate.js');

function activate(context) {
    let provider = new CatCustomEditorProviderForWebview({});
    hx.window.registerCustomEditorProvider("HBuilderX - 键盘快捷方式", provider);
    
    let keyboardShortcutSupport = hx.commands.registerCommand('extension.keyboardShortcutSupport', (param) => {
        const cscratFile = path.join(__dirname, 'template', 'HBuilderX - 键盘快捷方式');
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
