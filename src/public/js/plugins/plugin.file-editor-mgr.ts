/**
 * Created by Ian on 2015/5/14.
 */
/// <reference path="plugin.files-cache.ts" />
module RomanySoftPlugins{

    export class FileEditorManger{
        fileCache: FilesCache;


        constructor(options: any){
            var t = this;
            t.fileCache = new FilesCache();

        }

        // 添加新的文件对象到管理器
        addNewFileObj(fileObj: FileObj){
            var t = this;
            var key = "FileObj" + fileObj.id;
            t[key] = fileObj;
        }

        // 根据ID获取文件对象
        findFileObjById(fileId:number){
            var key = "FileObj" + fileId;
            if (key in this) return this[key];

            return null;
        }

        // 移除文件对象，通过ID
        removeFileObjById(fileId:number){
            var t = this;
            var key = "FileObj" + fileId;
            if (key in t){
                t[key] = null;
            }
        }

        // 创建文件对象与编辑器的关联
        createNewEditor(fileId: number, editor: any){
            var t = this;
            var find = t.fileCache.findFile(fileId, function(fileObj){
                fileObj.assEditor = editor;
            });

            if (false == find){
                alert("no file");
            }

        }

        // 获得所有的Editor对象
        getAllEditor():any[]{
            var t = this;
            var key_pre = "FileObj";

            var list = [];

            for(var key in t){
                if(key.indexOf(key_pre) === 0){
                    var fileObj = t[key];
                    if(fileObj instanceof FileObj){
                        list.push(fileObj.assEditor);
                    }
                }
            }

            return list;
        }

        // 查找Editor对象，通过文件ID
        findEditorByFileId(fileId: number, cb: Function){
            var key = "FileObj" + fileId;
            if (key in this) {
                var fileObj = this[key];
                return fileObj.assEditor;
            }

            return null;
        }

    }
}