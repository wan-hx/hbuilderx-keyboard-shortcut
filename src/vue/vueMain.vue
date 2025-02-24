<template>
    <q-scroll-view layout='vbox' id="scrollView">
        <q-view layout='hbox' style="margin-bottom: 10px;">
            <q-input id="elInput" accessibleName="searchWord" 
                placeholderText="按commandId和名称进行搜索"
                :text='searchWord'
                @textChanged="el_set">
            </q-input>
        </q-view>
        <!-- @entered="setKeybindings"@pressed="setKeybindings" -->
        <q-list-view id="QListView" :currentIndex="currentIndex" 
            @currentRowChanged="currentRowChanged" 
            @doubleClicked="setKeybindings"
            >
            <q-list-item layout='hbox' id="keysItem" v-for="item in CommandList"
                :style="{ 'background-color': item.commandId == selectedID ? 'rgb(232, 223, 196)': ''}">
                <q-view layout='hbox' id="commandName">
                    <!-- <q-radio id='checkBox' :enabled='false' :checked='item.commandId == selectedID'></q-radio> -->
                    <q-label :text="item.name"></q-label>
                    <!-- <q-label :text="item.commandId" id="commandID"></q-label> -->
                </q-view>
                <q-view layout='hbox'>
                    <q-view horizontal-size-policy="Preferred"></q-view>
                    <q-label :text="item.key"></q-label>
                    <q-label :text="item ? '默认值' : '用户自定义' " id="keySettingDesc" alignment="AlignRight|AlignVCenter"></q-label>
                </q-view>
            </q-list-item>
        </q-list-view>
    </q-scroll-view>
</template>

<script>
    let keyBoard = require('./utils.js');
    let modify_keyWord = require("./modify/modify.js");
    export default {
        data() {
            return {
                searchWord: "",
                selectedItem: {},
                selectedID: "",
                currentIndex: 0,
                allCommands: [],
            }
        },
        
        computed: {
            CommandList() {
                if (this.searchWord.trim() == "") return this.allCommands;
                let query = this.searchWord.toLowerCase();
                try {
                    let result = [];
                    for (let s of this.allCommands) {
                        let {name, commandId} = s;
                        name = name.toLowerCase();
                        commandId = commandId.toLowerCase();
                        if (name.includes(query) || commandId.includes(query)) {
                            result.push(s);
                        };
                    };
                    return result;
                } catch (error) {
                    return allCommands;
                }
            }
        },

        created() {
            this.getAllCommands();
            // console.log("-->", this.CommandList);
        },

        methods: {
            async getAllCommands() {
                const kb = new keyBoard();
                const result = await kb.main();
                this.allCommands = result;
                this.updateUi();
            },

            async currentRowChanged(e) {
                const idx = e.target.currentRow;
                this.currentIndex = idx;
                console.log("changed==================", idx);
                this.selectedItem = this.allCommands[idx];
                this.selectedID = this.selectedItem["commandId"];
                await this.updateUi()
            },
            
            async setKeybindings() {
                console.log("-----------", this.selectedItem);
                modify_keyWord(this.selectedItem);
            },
            
            async eventFilter(e) {
                console.log("-----------", e);
            },
            
            async el_set(e) {
                const accessibleName = e.target.accessibleName;
                if (accessibleName == "searchWord") {
                    this.searchWord = e.target.text;
                };
                this.updateUi();
            }
        },
    }
</script>

<style>
    * {
        background: transparent;
        font-family: 'microsoft yahei';
        color: #3a4c54;
        font-size: 13px;
        padding: 0;
    }

    #elInput {
        border: none;
        height: 30px;
        border-bottom: 1px solid #d6d6d6;
        outline: none;
    }

    #elInput:focus {
        background: transparent;
        border-color: #eee;
    }
    
    #commandID {}

    #linebox {
        display: flex;
        padding: 4px 0;
    }

    #linebox:hover,
    #linebox:focus {
        background: rgb(232, 223, 196);
        color: #43c45b;
    }

    #keySettingDesc {
        padding-right: 15px;
    }

    #QListView {
        height: 100%;
    }

    #QListView::item {
        height: 30px;
        line-height: 30px;
        justify-content: center;
    }

    #QListView::item:selected,
    #QListView::item:hover {
        background-color: rgb(232, 223, 196);
    }
</style>