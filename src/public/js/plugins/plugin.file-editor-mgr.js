/**
 * Created by Ian on 2015/5/14.
 */
/// <reference path="plugin.files-cache.ts" />
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var FileEditorManger = (function () {
        function FileEditorManger(options) {
            var t = this;
            t.fileCache = new RomanySoftPlugins.FilesCache();
        }
        // 添加新的文件对象到管理器
        FileEditorManger.prototype.addNewFileObj = function (fileObj) {
            var t = this;
            var key = "FileObj" + fileObj.id;
            t[key] = fileObj;
        };
        // 根据ID获取文件对象
        FileEditorManger.prototype.findFileObjById = function (fileId) {
            var key = "FileObj" + fileId;
            if (key in this)
                return this[key];
            return null;
        };
        // 移除文件对象，通过ID
        FileEditorManger.prototype.removeFileObjById = function (fileId) {
            var t = this;
            var key = "FileObj" + fileId;
            if (key in t) {
                t[key] = null;
            }
        };
        // 创建文件对象与编辑器的关联
        FileEditorManger.prototype.createNewEditor = function (fileId, editor) {
            var t = this;
            var find = t.fileCache.findFile(fileId, function (fileObj) {
                fileObj.assEditor = editor;
            });
            if (false == find) {
                alert("no file");
            }
        };
        // 获得所有的Editor对象
        FileEditorManger.prototype.getAllEditor = function () {
            var t = this;
            var key_pre = "FileObj";
            var list = [];
            for (var key in t) {
                if (key.indexOf(key_pre) === 0) {
                    var fileObj = t[key];
                    if (fileObj instanceof RomanySoftPlugins.FileObj) {
                        list.push(fileObj.assEditor);
                    }
                }
            }
            return list;
        };
        // 查找Editor对象，通过文件ID
        FileEditorManger.prototype.findEditorByFileId = function (fileId, cb) {
            var key = "FileObj" + fileId;
            if (key in this) {
                var fileObj = this[key];
                return fileObj.assEditor;
            }
            return null;
        };
        return FileEditorManger;
    }());
    RomanySoftPlugins.FileEditorManger = FileEditorManger;
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.file-editor-mgr.js.map