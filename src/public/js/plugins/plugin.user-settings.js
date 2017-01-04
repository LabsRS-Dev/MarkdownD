/**
 * Created by Ian on 2015/5/14.
 */
"use strict";
///<reference path="../../typings/jquery/jquery.d.ts" />
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var Settings;
    (function (Settings) {
        // 应用程序整体部分
        var AppUnit = (function () {
            function AppUnit() {
                this.systemLanguage = "en"; // 系统默认语言英文
            }
            return AppUnit;
        }());
        // 文档控制部分
        var DocumentUnit = (function () {
            function DocumentUnit() {
                //enableTabMode:boolean = false;  // 默认不使用Tab页签模式
                this.autoSave = false; // 是否默认自动保存
                this.autoSaveSecs = 300; // 自动保存的间隔时间(秒数)，默认是立即保存，
                this.autoRestore = true; // 是否自动恢复之前使用的文档
            }
            return DocumentUnit;
        }());
        // 编辑器部分
        var EditorUnit = (function () {
            function EditorUnit() {
                var _config = new RomanySoftPlugins["EditorConfig"]();
                var formmatConfig = {
                    "switchDelay": 15 // 添加自定义的参数，Editor之间切换动画的间隔
                };
                var excludeSettings = [
                    "mode", "name", "value", "width", "height", "path", "toolbarIcons", "appendMarkdown",
                    "theme", "previewTheme", "imageFormats", "toolbarAutoFixed"
                ];
                for (var key in _config) {
                    if ($.inArray(key, excludeSettings) === -1) {
                        var valueType = $.type(_config[key]);
                        if (valueType === "boolean" || valueType === "array" || valueType === "number" || valueType === "string") {
                            formmatConfig[key] = _config[key];
                        }
                    }
                }
                return formmatConfig;
            }
            return EditorUnit;
        }());
        // 云端存储
        var CloudStorageUnit = (function () {
            function CloudStorageUnit() {
            }
            return CloudStorageUnit;
        }());
        // 云端帮助
        var CloudHelpUnit = (function () {
            function CloudHelpUnit() {
            }
            return CloudHelpUnit;
        }());
        var UserSetting = (function () {
            function UserSetting() {
                this.appSetting = new AppUnit();
                this.default_appSetting = new AppUnit(); // 默认系统语言
                this.documentSetting = new DocumentUnit();
                this.default_documentSetting = new DocumentUnit(); // 默认文档设置
                this.editorSetting = new EditorUnit();
                this.default_editorSetting = new EditorUnit(); // 默认编辑器设置
            }
            // 恢复数据，根据传入的Info
            UserSetting.prototype.restoreCoreDataWithInfo = function (info) {
                var t = this;
                // 公共处理函数
                function fn(field, obj, t) {
                    if (field in obj) {
                        for (var key in obj[field]) {
                            if (key in t[field]) {
                                if (typeof t[field][key] == typeof obj[field][key]) {
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
            };
            //===========================================================================
            // forUser
            //===========================================================================
            // 去除默认数据，得到用户设置
            UserSetting.prototype.forUserCoreData = function () {
                var obj = {};
                for (var key in this) {
                    if (key.indexOf("default_") === -1) {
                        obj[key] = this[key];
                    }
                }
                return obj;
            };
            //===========================================================================
            // default
            //===========================================================================
            UserSetting.prototype.forDefaultcoreData = function () {
                var obj = {};
                for (var key in this) {
                    if (key.indexOf("default_") !== -1) {
                        obj[key] = this[key];
                    }
                }
                return obj;
            };
            //===========================================================================
            // forAll
            //===========================================================================
            // 获取核心的数据的json系列化
            UserSetting.prototype.coreDataToJSON = function () {
                var obj = {};
                for (var key in this) {
                    obj[key] = this[key];
                }
                return JSON.stringify(obj, null, 4);
            };
            // 核心数据的反序列化
            UserSetting.prototype.coreDataFromJSON = function (str) {
                try {
                    var obj = JSON.parse(str);
                    this.restoreCoreDataWithInfo(obj);
                }
                catch (e) { }
                return this;
            };
            return UserSetting;
        }());
        Settings.UserSetting = UserSetting;
    })(Settings = RomanySoftPlugins.Settings || (RomanySoftPlugins.Settings = {}));
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RomanySoftPlugins;
//# sourceMappingURL=plugin.user-settings.js.map