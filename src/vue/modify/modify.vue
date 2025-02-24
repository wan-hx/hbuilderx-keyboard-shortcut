<template>
    <q-view layout='vbox' id="scrollView">
        
        <q-view layout='hbox'>
            <q-label id="labelView" text="描述: "></q-label>
            <q-label :text="currentKeyData.name"></q-label>
            <q-view horizontal-size-policy='Expanding'></q-view>
        </q-view>
        <q-view layout='hbox'>
            <q-label id="labelView" text="command:"></q-label>
            <q-label :text="currentKeyData.commandId"></q-label>
            <q-view horizontal-size-policy='Expanding'></q-view>
        </q-view>
        <q-view layout='hbox' style="margin-top: 20px;">
            <q-input :text='key' @textChanged="el_set"
                id="elInput"
                accessibleName="key"
                clearButtonEnabled='true'
                placeholderText="请在键盘上按下所需的快捷键"
            ></q-input>
        </q-view>
        
    </q-view>
</template>

<script>
    export default {
        data() {
            return {
                currentKeyData: {},
                key: ""
            }
        },

        methods: {
            el_set(e) {
                const accessibleName = e.target.accessibleName;
                if (accessibleName == "key") {
                    this.key = e.target.text;
                };
                this.updateUi();
            },

            clickBtn() {
                this.$mitt.emit('showMsg', "这是一条从vue页面传递的消息");
            },
        },
    }
</script>

<style>
    * {
        background: transparent;
    }

    #scrollView {
        width: 100%;
        justify-content: start;
    }

    #labelView {
        min-width: 70px;
        text-align: right;
        font-weight: 600;
    }

    #elInput {
        border: none;
        height: 30px;
        border-bottom: 1px solid #d6d6d6;
        outline: none;
    }

    #elInput:focus {
        background: transparent;
        border-color: #43c45b;
    }
</style>
