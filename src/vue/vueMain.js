var hx = require("hbuilderx");
var path = require('path');

// 引入主要的类
let CustomDocument = hx.CustomEditor.CustomDocument;
let CustomEditorProvider = hx.CustomEditor.CustomEditorProvider;
let CustomDocumentEditEvent = hx.CustomEditor.CustomDocumentEditEvent;

// 继承CustomDocument
class CatCustomDocument extends CustomDocument {
    constructor(uri) {
        super(uri)
    }
    dispose() {
        super.dispose();
    }
}

hx.vue.defineComponent('abcEditor2', path.resolve(__dirname, './vueMain.vue'));

// 继承CustomEditorProvider，实现必要的方法
class vueEditorProvider extends CustomEditorProvider {
    constructor(context) {
        super()
    }
    openCustomDocument(uri) {
        console.log("[uri] ->", uri)
        return Promise.resolve(new CatCustomDocument(uri));
    }
    resolveCustomEditor(document) {
        console.log("[document] ->", document);
        const a = hx.vue.createComponent("abcEditor2");
        return a
    }
    saveCustomDocument(document) {
        return true;
    }
    saveCustomDocumentAs(document, destination) {
        return true;
    }
}

module.exports = vueEditorProvider;
