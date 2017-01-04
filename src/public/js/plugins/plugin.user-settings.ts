/**
 * Created by Ian on 2015/5/14.
 */

///<reference path="../../typings/jquery/jquery.d.ts" />

namespace RomanySoftPlugins {

    export namespace Settings {
        // 应用程序整体部分
        class AppUnit{
            systemLanguage: string = "en";   // 系统默认语言英文
        }


        // 文档控制部分
        class DocumentUnit{

            //enableTabMode:boolean = false;  // 默认不使用Tab页签模式

            autoSave:boolean = false;         // 是否默认自动保存
            autoSaveSecs:number = 300;        // 自动保存的间隔时间(秒数)，默认是立即保存，
            autoRestore: boolean = true;      // 是否自动恢复之前使用的文档
        }

        // 编辑器部分
        class EditorUnit{

            constructor(){
                let _config = new RomanySoftPlugins["EditorConfig"]();
                let formmatConfig = {
                    "switchDelay": 15 // 添加自定义的参数，Editor之间切换动画的间隔
                };
                let excludeSettings = [
                    "mode", "name", "value", "width", "height", "path", "toolbarIcons", "appendMarkdown",
                    "theme", "previewTheme", "imageFormats", "toolbarAutoFixed"
                ];
                for(var key in _config ){
                    if($.inArray(key, excludeSettings) === -1){ // 排除
                        var valueType = $.type(_config[key]);
                        if(valueType === "boolean" || valueType === "array" || valueType === "number" || valueType === "string"){
                            formmatConfig[key] = _config[key];
                        }
                    }
                }
                return formmatConfig;
            }

        }


        // 云端存储
        class CloudStorageUnit{

        }

        // 云端帮助
        class CloudHelpUnit{

        }



        export class UserSetting{
            appSetting:AppUnit = new AppUnit();
            default_appSetting:AppUnit = new AppUnit();                 // 默认系统语言

            documentSetting: DocumentUnit = new DocumentUnit();
            default_documentSetting: DocumentUnit = new DocumentUnit(); // 默认文档设置

            editorSetting: EditorUnit = new EditorUnit();
            default_editorSetting: EditorUnit = new EditorUnit();      // 默认编辑器设置

            // 恢复数据，根据传入的Info
            private restoreCoreDataWithInfo(info:any){
                var t = this;

                // 公共处理函数
                function fn(field: string, obj: any, t: any){
                    if(field in obj){
                        for(var key in obj[field]){
                            if(key in t[field]){
                                if(typeof t[field][key] == typeof  obj[field][key]){
                                    t[field][key] = obj[field][key];
                                }
                            }
                        }
                    }
                }

                // appSetting
                fn("appSetting", info, this);

                // document
                fn("documentSetting", info, this);

                // editor
                fn("editorSetting", info, this);

                return this;
            }

            //===========================================================================
            // forUser
            //===========================================================================

            // 去除默认数据，得到用户设置
            public forUserCoreData(): any{
                var obj = {};
                for(var key in this){
                    if(key.indexOf("default_") === -1 ){
                        obj[key] = this[key];
                    }
                }

                return obj;
            }

            //===========================================================================
            // default
            //===========================================================================
            public forDefaultcoreData(): any{
                var obj = {};
                for(var key in this){
                    if(key.indexOf("default_") !== -1 ){
                        obj[key] = this[key];
                    }
                }

                return obj;
            }

            //===========================================================================
            // forAll
            //===========================================================================

            // 获取核心的数据的json系列化
            public coreDataToJSON():string{
                var obj = {};
                for(var key in this){
                    obj[key] = this[key];
                }

                return JSON.stringify(obj, null, 4);
            }

            // 核心数据的反序列化
            public coreDataFromJSON(str:string){
                try{
                    var obj:any = JSON.parse(str);
                    this.restoreCoreDataWithInfo(obj);
                }catch(e){}

                return this;
            }
        }
    }

}

export default RomanySoftPlugins;
