const hx = require("hbuilderx");
const path = require('path');

hx.vue.defineComponent('modifyKeyWord', path.resolve(__dirname, "./modify.vue"));
let cfg_is_open = false;

async function modify_keyWord(currentKeyData={}) {
    let {commandId} = currentKeyData;
    if (commandId == undefined) return;
    
    if (cfg_is_open) return;
    cfg_is_open = true;
    // console.error("[modify_keyWord]............", currentKeyData);
    
    let form = await hx.window.showFormDialog({
        title: "修改快捷键",
        submitButtonText: "确定(&S)",
        cancelButtonText: "关闭(&C)",
        footer: "<a href=\"\">反馈问题</a>",
        width: 600,
        height: 320,
        showModal: false,
        validate: async function(formData) {
            this.showError("");
            let data = formData.modifyKeyWord;
            let { key } = data;
            if (key == 0 || /^\s+$/.test(key) ) {
                this.showError("key不能为空哦！");
                return;
            };
            return true;
        },
        onChanged: function (field, value, formData) {
            console.log("调用changed函数", value);
        },
        formItems: [{
            "type": "vue:modifyKeyWord",
            "name": "modifyKeyWord",
            "value": {
                "currentKeyData": currentKeyData
            },
            // event：可在vue中调用里面的方法
            event: {
                showMsg(msg) {
                    hx.window.showInformationMessage(msg);
                }
            }
        }]
    }).then((res)=> {
        console.log('------',JSON.stringify(res, null, 4));
        cfg_is_open = false;
    }, function () {
        cfg_is_open = false;
    })
    return true;
};

module.exports = modify_keyWord;
