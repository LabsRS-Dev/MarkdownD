/**
 * Created by Ian on 2015/5/15.
 */
///<reference path="../../typings/jquery/jquery.d.ts" />
module RomanySoftPlugins {

    interface CacheServices{
        save():boolean;
        restore():boolean;
        find(key: string, type: string):string;
        findObj(key: string, type: string): any;
        findObjList(type:string): any[];
        update(key: string, type: string, value:string);
        delete(key: string, type: string);
    }

    export class Cache implements CacheServices{
        key: string = "default_key";
        data: any[] = [];
        db: any = null;
        defalut_db_file: string = "";
        useSQLite: boolean = false;  // 是否使用本地SQlite服务


        constructor(key: string, _useSQLite: boolean){
            var t$ = this;
            t$.key = key;

            t$.useSQLite = _useSQLite;
            if (t$.useSQLite){
                t$.defalut_db_file = window.BS.b$.App.getAppDataHomeDir() + "/cache.sqlite";

                if (!t$.db){

                    /// 声明初始化数据库
                    function initDB(orgData){
                        var db = new SQL.Database(orgData);
                        if(db){
                            //TODO：检查默认的数据库是否存在，不存在要创建
                            var sqlstr = "SELECT * FROM localStorage";
                            var mustCreate = true;

                            try{
                                var res = db.exec(sqlstr);
                                if (res) {
                                    mustCreate = res.length == 0;
                                }
                            }catch(e){

                            }

                            if (mustCreate){
                                sqlstr =  "DROP TABLE IF EXISTS localStorage;";
                                sqlstr += "CREATE TABLE localStorage (key text, value text);";
                                sqlstr += "INSERT INTO localStorage VALUES ('ROMANYSOFT_SQLITE', 'True');";

                                db.run(sqlstr);
                            }
                        }
                        t$.db = db;
                    }

                    //检测默认db文件是否存在？
                    if (window.BS.b$.App.checkPathIsFile(t$.defalut_db_file)){
                        window.BS.b$.Binary.getUTF8TextContentFromFile({filePath:t$.defalut_db_file}, function(obj){
                            if(obj.success){
                                var uInt8Array = new window.TextEncoder().encode(obj.content);
                                initDB(uInt8Array);
                            }
                        })
                    }else{
                        initDB([]);
                    }

                }
            }
        }

        getDB():any{
            var t$ = this;
            return t$.db;
        }

        /// 同步数据库到文件
        syncDB(){
            var t$ = this;
            if (t$.db && t$.defalut_db_file){
                var unit8ArrayData = t$.db.export();

                window.BS.b$.Binary.createTextFile({
                    filePath:t$.defalut_db_file,
                    text: new window.TextDecoder().decode(unit8ArrayData)
                }, function (obj) {
                    console.dir(obj);
                })
            }
        }

        setItemToDB(key: string, value: string){
            var db = this.getDB();

            if (this.getItemFromDB(key)){ //update
                var sql = "UPDATE localStorage SET value = '" + value + "' WHERE key = '" + key + "'";
                db.run(sql);

            }else{ // insert
                var sql = "INSERT INTO localStorage VALUES ('" + key +"', '" + value +"');";
                db.run(sql);
            }

            this.syncDB();
        }

        getItemFromDB(key: string):string{
            var value = null;
            var db = this.getDB();
            var sql = "SELECT value FROM localStorage WHERE key = '" + key + "'";

            if (db){
                try{
                    var result = db.exec(sql);
                    if (result.length > 0){
                        var obj = result[0];
                        var colIndex = obj.columns.indexOf("value");
                        var rowValue = obj.values[colIndex];
                        return rowValue;
                    }
                }catch(e){console.error(e)}
            }

            return "";
        }

        removeItemFromwDB(key: string){
            var t$ = this;
            var db = t$.getDB();
            var sql = "DELETE FROM localStorage where key = '"+ key + "'";

            if (db){
                try{
                    db.run(sql);

                    t$.syncDB();
                }catch(e){console.error(e)}
            }
        }

        save():boolean{
            var t$ = this;
            var ls = t$.useSQLite ? t$.getDB() : window.localStorage;

            if(ls){
                var dataStr = JSON.stringify(t$.data);
                t$.useSQLite ? t$.setItemToDB(t$.key, dataStr) : ls.setItem(t$.key, dataStr);
                return true;
            }

            return false;
        }

        restore():boolean{
            var t$ = this;
            var ls = t$.useSQLite ? t$.getDB() : window.localStorage;

            if(ls){
                var dataStr = t$.useSQLite ? t$.getItemFromDB(t$.key) : ls.getItem(t$.key);
                if(dataStr){
                    t$.data.length = 0;
                    t$.data = JSON.parse(dataStr);
                    return true;
                }
            }

            return false;
        }

        findObj(key: string, type: string):any{
            var t$ = this;
            var foundObj = null;
            $.each(this.data, function(index, obj){
                if(obj){
                    var _key = obj.key, _value = obj.value, _type = obj.type;
                    if( key === _key && type === _type){
                        foundObj = obj;
                        return false;
                    }
                }
            });

            return foundObj;
        }

        findObjList(type:string): any[]{
            var t$ = this;
            var objList = [];
            $.each(t$.data, function(index, obj){
                if(obj){
                    var _type = obj.type;
                    if( type === _type){
                        objList.push(obj) ;
                    }
                }
            });

            return objList;
        }

        find(key: string, type: string):string{
            var t$ = this;
            var obj = t$.findObj(key, type);
            if(obj) return obj.value;

            return null;
        }

        update(key: string, type: string, value:string){
            var t$ = this;

            var obj = t$.findObj(key, type);
            if(obj){
                obj.value = value;
            }else{
                t$.data.push({key:key, value:value, type:type})
            }

            t$.save();
        }

        delete(key: string, type: string){
            var t$ = this;

            var obj = this.findObj(key, type);
            if(obj){
                t$.data.splice($.inArray(obj, t$.data), 1);
            }

            t$.save();
        }
    }
}