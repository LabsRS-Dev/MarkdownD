/**
 * Created by Ian on 2015/5/14.
 */
///<reference path="../../typings/jquery/jquery.d.ts" />
module RomanySoftPlugins {

    // 单一的文件对象
    export class FileObj {
        id: number =  Math.ceil($.now()*1000 + Math.random()*999) ;          // 唯一标识, 必须不能包含点，是整数
        name: string = "Untitled";          // 别名
        is_tmp: boolean = true;             // 是否是临时文件, 默认是临时的
        path:string = "";                   // 路径
        ext:string = "md";                  // 扩展名
        changed: boolean = false;           // 是否正在编辑, reload, 或者进入到workspace
        mustReloadNextTime: boolean = false;// 下次是否必须从文件中加载内容
        lastModify: number = $.now();       // 最后修改时间戳
        lastSaveToCacheTime: number = $.now(); // 最后一次写入到缓存的时间
        lastSaveToFileTime: number = $.now();  // 最后一次写入到文件的时间
        createTime: number = $.now();       // 创建的时间
        assEditor: any = null;              // 关联的Editor的对象的信息
        assEditorSettings: any = {};        // 关联的设置
        assTempContentFile: string = "";    // 关联的临时内容保存的文件 *.tmp

        content_utf8: string = "";          // 临时内容，应该从文件读取
        content_utf8_cache: string = "";    // 缓存的内容
        isCacheEnable: boolean = false;     // 标识是否缓存已经开启


        getExcludeKeys(): any{
            var _ExcludeKeys = ["lastSaveToCacheTime",
                "lastSaveToFileTime",
                "assEditor",
                "content_utf8",
                "content_utf8_cache",
                "isCacheEnable"
            ];

            return _ExcludeKeys;
        }

        // 获取核心的数据的json系列化
        coreDataToJSON():string{
            var t$ = this;

            var obj = {};
            for(var key in t$){
                if ($.inArray(key, t$.getExcludeKeys()) == -1){
                    if (t$.hasOwnProperty(key)){
                        obj[key] = t$[key];
                    }
                }

            }

            return JSON.stringify(obj);
        }

        // 核心数据的反序列化
        coreDataFromJSON(selfObj:any, str:string){
            var t$ = this;
            try{
                var obj:any = JSON.parse(str);
                for (var key in obj){
                    if ($.inArray(key, t$.getExcludeKeys()) == -1){
                        if (selfObj.hasOwnProperty(key)){
                            selfObj[key] = obj[key];
                        }
                    }
                }
            }catch(e){}

            return selfObj;

        }
    }

    // 文件缓存对象
    export class FilesCache {
        data: any[] = [];

        // 获取所有文件对象.排序
        getAllFiles(){
            "use strict";
            if(this.data.length <= 1)
                return this.data;

            var coloneData = [].concat(this.data);
            var sortDataList =  coloneData.sort(function(a, b){
                if(a.lastModify < b.lastModify) return 1;
                if(a.lastModify > b.lastModify) return -1;
                return 0;
            });

            return sortDataList;
        }

        // 获取所有文件对象，方向排序的
        getAllFilesWithSortByCreateTime() {
            "use strict";
            if(this.data.length <= 1)
                return this.data;

            var coloneData = [].concat(this.data);
            var sortDataList =  coloneData.sort(function(a, b){
                if(a.createTime < b.createTime) return 1;
                if(a.createTime > b.createTime) return -1;
                return 0;
            });

            return sortDataList;
        }

        // 获取最新创建的的文件对象
        getLastCreatedFileObj(){
            "use strict";
            var _allFilesWithSortByCreateTime = this.getAllFilesWithSortByCreateTime();
            if (_allFilesWithSortByCreateTime.length > 0)
                return _allFilesWithSortByCreateTime[0];

            return null;
        }

        // 获取所有文件对象，没有排序的
        getAllFilesWithNoSort() {
            "use strict";
            if (this.data.length < 1)
                return [];
            return this.data;
        }

        // 获取一个新的文件对象
        getNewFileObj(cacheDir: string):FileObj{
            "use strict";
            var t$ = this;
            var obj = new FileObj();
            obj.name = obj.name + (t$.data.length + 1);
            obj.assEditor = null;
            return obj;
        }

        // 获取最后一个修改的文件对象
        getLastModifyFileObj(): FileObj{
            "use strict";
            if(this.data.length == 0) return null;

            var sortDataList = this.getAllFiles();
            return sortDataList[0];
        }

        // 添加文件对象到缓存中
        addFile(file: FileObj, cb?: Function){
            "use strict";
            this.data.push(file);
            cb && cb(file);
        }

        // 重新加载文件
        reLoadFile(id:number, cb?:Function){
            "use strict";
            var t = this;
            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    cb && cb(obj);
                    return false;
                }
            })
        }

        // 保存缓存项
        saveFile(id: number, cb?:Function){
            "use strict";
            var t = this;

            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    cb && cb(obj);
                    return false;
                }
            })
        }

        // 删除文件缓存项
        removeFile(id: number, cb?:Function){
            "use strict";
            var t = this;

            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    t.data.splice(index, 1);
                    cb && cb(obj);
                    return false;
                }
            });
        }

        // 查找文件对象
        findFile(id: number, cb?:Function):boolean{
            "use strict";
            var t = this;

            var find = false;
            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    cb && cb(obj);
                    find = true;
                    return false;
                }
            });

            return find;
        }

        // 查找文件对象，扩展方式
        findFileEx(condition:{}, cb?:Function):boolean{
            "use strict";
            var t = this;

            var find = false;

            // 遍历key
            var _keyFind = function(condition, obj){
                for(var key in condition){
                    if(obj.hasOwnProperty(key)){
                        if(condition[key] != obj[key]){
                            return false;
                        }
                    }
                }

                return true;
            };

            $.each(t.data, function(index, obj){
                if (_keyFind(condition, obj)){
                    cb && cb(obj);
                    find = true;
                    return false;
                }
            });

            return find;
        }

    }
}
