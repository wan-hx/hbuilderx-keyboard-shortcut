const os = require('os');
const path = require("path");

const vueFile = path.join(__dirname, 'static', 'vue.min.js');
const bootstrapCssFile = path.join(__dirname, 'static', 'bootstrap.min.css');

const osName = os.platform();

/**
 * @description 生成视图内容
 */
function getWebviewContent(uiData, commands, keyboardProgram) {

    // UI
    let {
        background,
        fontColor,
        lineColor,
        liHoverBackground,
        editIcon,
        resetIcon
    } = uiData;
    
    // key command
    commands = JSON.stringify(commands);

    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="${bootstrapCssFile}">
            <script src="${vueFile}"></script>
            <style type="text/css">
                [v-cloak] {
                    display: none;
                }
                * {
                    moz-user-select: -moz-none;
                    -moz-user-select: none;
                    -o-user-select: none;
                    -khtml-user-select: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                body {
                    background-color: ${background};
                    color: ${fontColor};
                }
                .link {
                    color: red !important;
                }
                .search {
                    color: #007acc !important;
                    border: none !important;
                }
                .body-head {
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid ${lineColor};
                    background-color: ${background}!important;
                    z-index: 999;
                }
                .body-content {
                    margin-top: 60px;
                }
                .body-head .page-title {
                    line-height: 50px;
                    margin-bottom: 0px !important;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    position: relative;
                    display: inline-block;
                }
                .fz8 {
                    font-size: 0.85rem !important;
                }
                .form-control {
                    display: inline !important;
                    height: calc(1.5em + .55rem + 2px) !important;
                    line-height: calc(1.5em + .55rem + 2px) !important;
                    font-size: 0.95rem !important;
                    font-weight: 500 !important;
                    background-color: ${background}!important;
                }
                .input-group-append {
                    height: calc(1.5em + .55rem + 4px) !important;
                    font-size: 0.9rem !important;
                    line-height: calc(1.5em + .55rem + 2px) !important;
                }
                .form-control:disabled,
                .form-control[readonly] {
                    background-color: #FFF;
                    opacity: 1;
                }
                .form-control::-webkit-input-placeholder {
                    font-size: 0.85rem !important;
                    font-weight: 200 !important;
                    color: ${fontColor} !important;
                }
                .outline-none {
                    box-shadow: none !important;
                }
                .table td,
                .table th {
                    padding: 0.35rem 0.5rem !important;
                    font-size: 14px !important;
                    color: ${fontColor};
                }
                .tr-active:active {
                    background-color: ${liHoverBackground};
                    outline: none;
                    border-radius: 4px;
                }
                .tr-active:focus {
                    background-color: ${liHoverBackground};
                    color: #FFF;
                    outline: none;
                    border-radius: 4px;
                }
                .keysStyle {
                    border: 1px solid ${lineColor};
                    padding: 3px 8px;
                    border-radius: 5px;
                }
                .modal-mask {
                    position: fixed;
                    z-index: 9998;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: table;
                    transition: opacity 0.3s ease;
                }
                .modal-wrapper {
                    display: table-cell;
                    vertical-align: middle;
                }
                .modal-container {
                    width: 400px;
                    margin: 0px auto;
                    padding: 20px 30px;
                    background-color: #fff;
                    border-radius: 2px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
                    transition: all 0.3s ease;
                    font-family: Helvetica, Arial, sans-serif;
                }
                .modal-header,
                .modal-footer-1 {
                    border: none !important;
                    padding: 0.75rem 1rem;
                }
                .modal-header h4 {
                    margin-top: 0;
                    color: #42b983;
                    width: 400px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .modal-header button {
                    border: none !important;
                    background-color: #FFF !important;
                    outline: none;
                }
                .modal-body {
                    margin: 0;
                }
                .modal-default-button {
                    float: right;
                }
                .modal-enter {
                    opacity: 0;
                }
                .modal-leave-active {
                    opacity: 0;
                }
                .modal-enter .modal-container,
                .modal-leave-active .modal-container {
                    -webkit-transform: scale(1.1);
                    transform: scale(1.1);
                }
                .key-input {
                    background-color: #FFF !important;
                    box-shadow: none !important;
                }
            </style>
        </head>
        <body id="body">
            <div id="app" v-cloak>
                <div class="fixed-top body-head">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <div class="d-flex">
                                    <div class="flex-fill">
                                        <p class="page-title" @click="showKeyboardProgram();">基于{{ keyboardProgram }}快捷键方案设置</p>
                                    </div>
                                    <div class="flex-fill">
                                        <input type="search" class="form-control outline-none search my-2 px-0" placeholder="按commandId和名称进行搜索"
                                            v-model.trim="searchWord" @keyup.enter="goSearch();" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-fluid body-content">
                    <div>
                        <table class="table table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col">命令</th>
                                    <th scope="col">键绑定</th>
                                    <th scope="col">源</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="tr-active" v-for="(item,idx) in AllCommands" :key="idx" :id="item.commandId"
                                    :tabindex="idx" @dblclick="openBox(item);" @click="selectCommand = item">
                                    <td>
                                        <span>{{ item.name }}</span>
                                        <span title="编辑快捷键" v-if="JSON.stringify(selectCommand) != '{}' && item.commandId == selectCommand.commandId" v-html="editIcon" @click="openBox(item);"></span>
                                    </td>
                                    <td>
                                        <span :class="{ keysStyle : item.key}">{{item.key}}</span>
                                        <span title="重置快捷键" v-if="JSON.stringify(selectCommand) != '{}' && item.commandId == selectCommand.commandId && item.key" v-html="resetIcon" @click="reset(item);"></span>
                                    </td>
                                    <td>{{ item.isDefault ? '默认值' : '用户自定义' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
    
                <div class="modal-mask" v-if="isShowBox">
                    <div class="modal-wrapper">
                        <div class="modal-container">
                        
                            <div class="modal-header">
                                <slot name="header">
                                    <h4>{{ selectCommand.name ? selectCommand.name : '设置快捷键'}}</h4>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                        @click="closeBox();">X</button>
                                </slot>
                            </div>
    
                            <div class="modal-body">
                                <div style="display: block;">
                                    <p style="font-size: 11px;">
                                    请依次按下要输入的键, 当按下ctrl、shift、command、alt、PgUp、PgDown、left、right、up、down、Home、End键时会自动填充，也可切换手动输入
                                    </p>
                                </div>
                                <slot name="body">
                                    <div class="input-group mb-3" v-if="isManualSet">
                                        <input id="keyValue" type="text" class="form-control key-input" id="basic-url" aria-describedby="basic-addon3"
                                            v-model="keyValue" placeholder="手动输入要设置的快捷键">
                                    </div>
                                    <div class="input-group mb-3" v-else>
                                        <input id="keyValue" type="text" class="form-control key-input" id="basic-url" aria-describedby="basic-addon3"
                                            v-model="keyValue" placeholder="依次按下键符" @keyup="keyup($event);" @keydown="keydown($event);">
                                    </div>
                                </slot>
                            </div>
    
                            <div class="modal-footer-1">
                                <slot name="footer">
                                    <span @click="switchInput" style="text-decoration: underline;font-size: 12px; ">{{ isManualSet? '切换默认输入' : '切换手动输入' }}</span>
                                    <div class="float-right">
                                        <button type="button" class="btn" @click="clearKeys();">清空</button>
                                        <button type="button" class="btn btn-outline-success" @click="setKeys();">设置</button>
                                    </div>
                                </slot>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
            <script>
                var app = new Vue({
                    el: '#app',
                    data: {
                        keyboardProgram: '',
                        searchWord: '',
                        rawAllCommands: [],
                        AllCommands: [],
                        isShowBox: false,
                        selectCommand: {},
                        keyValue: '',
                        tmpKeys: [],
                        editIcon: '',
                        resetIcon: '',
                        isManualSet: false,
                        osName: ''
                    },
                    watch: {
                        searchWord: function(newVal, oldVal) {
                            if (newVal.trim() == '') {
                                this.AllCommands = Object.assign(this.rawAllCommands);
                                return;
                            };
                            let tmp = [];
                            for (let s of this.rawAllCommands) {
                                if ((s.name).includes(newVal) || (s.commandId).includes(newVal)) {
                                    tmp.push(s);
                                };
                            };
                            this.AllCommands = tmp;
                        }
                    },
                    created() {
                        this.rawAllCommands = ${commands};
                        this.AllCommands = ${commands};
                        this.editIcon = '${editIcon}';
                        this.resetIcon = '${resetIcon}';
                        this.keyboardProgram = '${keyboardProgram}';
                        this.osName = '${osName}';
                    },
                    mounted() {},
                    methods: {
                        showKeyboardProgram() {
                            hbuilderx.postMessage({
                                command: 'showKeyboardProgram',
                                keyboardProgram: this.keyboardProgram
                            });
                        },
                        switchInput() {
                            if (this.isManualSet) {
                                this.isManualSet = false;
                            } else {
                                this.isManualSet = true;
                            };
                            this.keyValue = '';
                            this.tmpKeys = [];
                        },
                        openBox(item) {
                            this.selectCommand = item;
                            this.isShowBox = true;
                            document.getElementById("body").style.overflow = 'hidden';
                            document.getElementById("body").style.height = '100%';
                        },
                        closeBox() {
                            this.selectCommand = {};
                            this.isShowBox = false;
                            this.keyValue = '';
                            document.getElementById("body").style.overflow = '';
                            document.getElementById("body").style.height = '';
                        },
                        reset() {
                            hbuilderx.postMessage({
                                command: 'resetKeys',
                                data: this.selectCommand
                            });
                        },
                        setKeys() {
                            let data = Object.assign(this.selectCommand);
                            data.key = this.keyValue;
                            hbuilderx.postMessage({
                                command: 'setKeys',
                                data: data
                            });
                            this.closeBox();
                        },
                        clearKeys() {
                            this.keyValue = '';
                            this.tmpKeys = [];
                        },
                        share() {
                            hbuilderx.postMessage({
                                command: 'share'
                            });
                        },
                        refresh() {
                            hbuilderx.postMessage({
                                command: 'refresh'
                            });
                        },
                        openWebHelp() {
                            hbuilderx.postMessage({
                                command: 'help'
                            });
                        },
                        keydown(e) {
                            let code = e.keyCode;
                            let result = [...this.tmpKeys];
                            if (e.ctrlKey) {
                                result.push('Ctrl');
                            };
                            let last = [...new Set(result)];
                            this.tmpKeys = last;
                            this.keyValue = last.join("+") + '+';
                        },
                        keyup(e) {
                            let code = e.keyCode;
                            let result = [...this.tmpKeys];
                            if (e.ctrlKey) {
                                result.push('Ctrl');
                            };
                            if (e.altKey || e.keyCode == 18) {
                                result.push('Alt');
                            };
                            if (e.keyCode == 17 && this.osName != 'darwin') {
                                result.push('Ctrl');
                            };
                            
                            if ((e.shiftKey || e.keyCode == 16) && !result.includes('Shift')) {
                                result.push('Shift');
                            };
                            if (e.metaKey && this.osName == 'darwin') {
                                result.push('Command');
                            };
                            if (![9,13,16,17,18,33,34,35,36,37,38,39,40,45,112,113,114,115,116,117,118,119,120,121,122,123].includes(code)) {
                                return;
                            };
                            if (code == 9) {
                                result.push('Tab');
                            }else if (code == 13) {
                                result.push('Enter');
                            }else if (code == 27) {
                                result.push('esc');
                            }else if (code == 33) {
                                result.push('PgUp');
                            }else if (code == 34) {
                                result.push('PgDown');
                            }else if (code == 35) {
                                result.push('End');
                            }else if (code == 36) {
                                result.push('Home');
                            }else if (code == 37) {
                                result.push('Left');
                            }else if (code == 38) {
                                result.push('up');
                            }else if (code == 39) {
                                result.push('right');
                            }else if (code == 40) {
                                result.push('down');
                            }else if (code == 45) {
                                result.push('Insert');
                            }else if (code == 112) {
                                result.push('F1');
                            }else if (code == 113) {
                                result.push('F2');
                            }else if (code == 114) {
                                result.push('F3');
                            }else if (code == 115) {
                                result.push('F4');
                            }else if (code == 116) {
                                result.push('F5');
                            }else if (code == 117) {
                                result.push('F6');
                            }else if (code == 118) {
                                result.push('F7');
                            }else if (code == 119) {
                                result.push('F7');
                            }else if (code == 120) {
                                result.push('F9');
                            }else if (code == 121) {
                                result.push('F10');
                            }else if (code == 122) {
                                result.push('F11');
                            }else if (code == 123) {
                                result.push('F12');
                            };
                            let last = [...new Set(result)];
                            this.tmpKeys = last;
                            this.keyValue = last.join("+") + '+';
                        }
                    }
                });
            </script>
            <script>
                // window.oncontextmenu = function() {
                //     event.preventDefault();
                //     return false;
                // }
            </script>
        </body>
    </html>
    `
};


module.exports = {
    getWebviewContent
}
