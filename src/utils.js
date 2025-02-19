const os = require('os');
const fs = require('fs');
const path = require('path');
const hx = require('hbuilderx');

const readFile = require("util").promisify(fs.readFile);
const JSONC = require('json-comments');
const ini = require('ini');

let { getWebviewContent } = require('./webview/html.js');
const hxCommands = require('./config/config.json');

const osName = os.platform();


// 当前用户自定义的快捷键设置
let currentUserSetKeys = {};

/**
 * @description 背景颜色、输入框颜色、字体颜色、线条颜色
 */
function getThemeColor() {
    let config = hx.workspace.getConfiguration();
    let colorScheme = config.get('editor.colorScheme');
    let colorCustomizations = config.get('workbench.colorCustomizations');

    if (colorScheme == undefined) {
        colorScheme = 'Default';
    };

    // 背景颜色、输入框颜色、字体颜色、线条颜色
    let background, liHoverBackground,inputColor, inputLineColor, cursorColor, fontColor, lineColor;
    
    let custom = {};
    try{
        custom = colorCustomizations[`[${colorScheme}]`];
    }catch(e){
        custom = {}
    };

    let viewBackgroundOptionName = 'editor.background';
    let viewFontOptionName = undefined
    let viewLiHoverBgOptionName = 'list.hoverBackground';

    if (colorScheme == 'Monokai') {
        if (custom != undefined && custom[viewBackgroundOptionName] && viewBackgroundOptionName in custom) {
            background = custom[viewBackgroundOptionName];
        } else {
            background = 'rgb(39,40,34)';
        };
        if (custom != undefined && custom[viewFontOptionName] && viewFontOptionName in custom) {
            fontColor = custom[viewFontOptionName];
        } else {
            fontColor = 'rgb(179,182,166)';
        };
        if (custom != undefined && custom[viewLiHoverBgOptionName] && viewLiHoverBgOptionName in custom) {
            liHoverBackground = custom[viewLiHoverBgOptionName];
        } else {
            liHoverBackground = 'rgb(78,80,73)';
        };
        inputColor = 'rgb(255,254,250)';
        inputLineColor = 'rgb(210,210,210)';
        cursorColor = 'rgb(255,255,255)';
        lineColor = 'rgb(23,23,23)';
    } else if (colorScheme == 'Atom One Dark') {
        if (custom != undefined && custom[viewBackgroundOptionName] && viewBackgroundOptionName in custom) {
            background = custom[viewBackgroundOptionName];
        } else {
            background = 'rgb(40,44,53)';
        };
        if (custom != undefined && custom[viewFontOptionName] && viewFontOptionName in custom) {
            fontColor = custom[viewFontOptionName];
        } else {
            fontColor = 'rgb(171,178,191)';
        };
        if (custom != undefined && custom[viewLiHoverBgOptionName] && viewLiHoverBgOptionName in custom) {
            liHoverBackground = custom[viewLiHoverBgOptionName];
        } else {
            liHoverBackground = 'rgb(44,47,55)';
        };
        inputColor = 'rgb(255,254,250)';
        inputLineColor = 'rgb(81,140,255)';
        cursorColor = 'rgb(255,255,255)';
        lineColor = 'rgb(33,37,43)';
    } else {
        if (custom != undefined && custom[viewBackgroundOptionName] && viewBackgroundOptionName in custom) {
            background = custom[viewBackgroundOptionName];
        } else {
            background = 'rgb(255,250,232)';
        };
        if (custom != undefined && custom[viewFontOptionName] && viewFontOptionName in custom) {
            fontColor = custom[viewFontOptionName];
        } else {
            fontColor = '#333';
        };
        if (custom != undefined && custom[viewLiHoverBgOptionName] && viewLiHoverBgOptionName in custom) {
            liHoverBackground = custom[viewLiHoverBgOptionName];
        } else {
            liHoverBackground = 'rgb(224,237,211)';
        };
        inputColor = 'rgb(255,252,243)';
        inputLineColor = 'rgb(65,168,99)';
        cursorColor = 'rgb(0,0,0)';
        lineColor = 'rgb(225,212,178)';
    };

    return {
        background,
        liHoverBackground,
        inputColor,
        inputLineColor,
        cursorColor,
        fontColor,
        lineColor
    };
};


class Common {
    constructor(arg) {
        this.hxAppData = hx.env.appData;
        this.keybindingsFile = path.join(this.hxAppData, 'user', 'keybindings.json');
    }
    
    // 读取用户自定义的快捷键设置
    async ReadUserDefinedKeySet() {
        let fr = await readFile(this.keybindingsFile, "utf-8");
        if (fr == '[]') {
            return {};
        };
        
        let FileContext = [];
        try{
            FileContext = JSONC.parse(fr);
        }catch(e){ 
            console.log(e)
            hx.window.showErrorMessage('自定义快捷键设置文件存在错误，请修改错误后再操作。', ['我知道了']);
            return 'error';
        };
        
        
        let currentData = {};
        for (let item of FileContext) {
            let v = item['command']
            currentData[v] = item['key'];
        };
        return currentData;
    }
}

class keyBoard extends Common {
    constructor(webViewPanel, uiData) {
        super();
        this.webViewPanel = webViewPanel;
        this.uiData = uiData;
        this.hxAppData = hx.env.appData;
        this.keybindingsFile = path.join(this.hxAppData, 'user', 'keybindings.json');
        this.defaultKeys = {};
        this.keyboardProgram = 'hbuilderx';
    }
    
    async init() {
        let keybindings;
        try{
            const appData = hx.env.appData;
            const iniFile = path.join(appData,'HBuilder X.ini')
            const fileinfo = ini.parse(fs.readFileSync(iniFile, 'utf-8'));
            keybindings = (fileinfo.Workbench.keybindings).toLowerCase();
        } catch(e){
            keybindings = 'hbuilderx';
        };
        
        if (keybindings == 'eclipse') { this.keyboardProgram = 'eclipse' };
        if (keybindings == 'vscode') { this.keyboardProgram = 'vscode' };
        if (keybindings == 'sublime text') { this.keybindings = 'SublimeText' };
        if (keybindings == 'intellij idea') { this.keyboardProgram = 'webstorm' };
        
        if (osName == 'darwin') {
            let macPath = `./config/macosx/${this.keyboardProgram}.json`;
            this.defaultKeys = require(macPath);
        } else {
            let winPath = `./config/windows/${this.keyboardProgram}.json`;
            this.defaultKeys = require(winPath);
        }
    }
    
    async writeFile(type, msg) {
        let keyboards = [];
        for (let s in currentUserSetKeys) {
            keyboards.push({"key": currentUserSetKeys[s], "command": s});
        };
        
        let str = JSON.stringify(keyboards,"","\t");
        let that = this;
        fs.writeFile(this.keybindingsFile, str, function(err) {
            if (err) {
                hx.window.setStatusBarMessage(`${msg} 操作失败`, '10000', 'error');
                if (type == 'set') {
                    that.main();
                };
                console.log('[hbuilderx-keyboard-shortcut-support] write error',err)
            } else {
                hx.window.setStatusBarMessage(`${msg} 操作成功`, '10000', 'info');
                if (type == 'reset') {
                    that.main();
                };
            }
        });
    }
    
    // 写入用户设置的快捷键
    async writeUserSet(data) {
        let { commandId, key, name } = data;
        if (commandId == undefined || key == '' || key == undefined) {
            return;
        };
        currentUserSetKeys[commandId] = key;
        this.writeFile('set',`【${name}】设置快捷键`);
    }
    
    // 重置快捷键
    async resetUserSet(data) {
        // 当前用户自定义的快捷键
        currentUserSetKeys = await super.ReadUserDefinedKeySet();
        
        let { commandId, name } = data;
        if (currentUserSetKeys[commandId] == undefined) {
            hx.window.setStatusBarMessage(`【${name}】 从未自定义过快捷键，无需重置。`)
            return;
        }
        if (commandId == undefined) {
            hx.window.setStatusBarMessage("要重置的快捷键不存在，重置失败。")
            return;
        };
        delete currentUserSetKeys[commandId];
        this.writeFile('reset',`【${name}】重置快捷键`);
    }
    
    async main() {
        // 默认快捷键方案
        await this.init();
        
        // 当前用户自定义的快捷键
        currentUserSetKeys = await super.ReadUserDefinedKeySet();
        
        // hx所有commands
        let commands = hxCommands['commands'];
        
        let data = [];
        for (let s of commands) {
            let cid = s['commandId'];
            if (currentUserSetKeys[cid] != undefined && currentUserSetKeys[cid] != '') {
                data.push(Object.assign(s, {"key": currentUserSetKeys[cid], 'isDefault': false}));
                continue;
            };
            if (this.defaultKeys[cid] != undefined) {
                data.push(Object.assign(s, {"key": this.defaultKeys[cid], 'isDefault': true}))
            } else {
                data.push(Object.assign(s, {"key": '', 'isDefault': true}))
            };
        };
        
        this.webViewPanel.webView.html = getWebviewContent(this.uiData, data, this.keyboardProgram);
    }
};

module.exports = {
    getThemeColor,
    keyBoard
}