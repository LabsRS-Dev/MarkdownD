/**
 * Created by Ian on 2015/3/5.
 */

(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    window.$fem = new RomanySoftPlugins.FileEditorManger();
    window.$fc = window.$fem.fileCache;

    var c$ = {};
    c$ = $.extend(window.UI.c$, {});

    var b$ = BS.b$;

    var $Cache = null; // 此单元的缓存部分

    var $NoticeCenter = c$.NoticeCenter = window["AppGlobalNoticeCenter"] = $.Callbacks(); // 消息中心
    var $NoticeCenterFncMap = c$.NoticeCenterFncMap = {}; // 消息回调Map视图

    var $Router = c$.RouterMethods = {}; // 路由控制器
    var $EditorProvider = c$.EditorProvider = new RomanySoftPlugins.EditorMdServices(); // 编辑器服务
    var $IAPProvider = c$.IAPProvider = new RomanySoftPlugins.IAP.IAP$Helper(); // IAP服务
    var $UserSettings = c$.UserSettings = new RomanySoftPlugins.Settings.UserSetting(); // 用户设置
    var $Util = c$.Util = {}; // 常用工具类
    var g_enableIAP = false;
    c$.g_curWorkFileObj = null; // 全局当前工作的文件对象

    // 默认的本地化语言
    c$.language = 'en-US';


    /// 可接受的Markdwon文件类型
    c$.AcceptMarkdownFileTypes = [];
    c$.AcceptMarkdownFileTypesEx = [
        {name: "Markdown Files", extensions: ['md', 'mkd', 'mkdown', 'ron', 'markdown']}
        ,{name: "All Files", extensions: ['*']}
    ];
    $.each(c$.AcceptMarkdownFileTypesEx, function (index, obj) {
        $.each(obj.extensions, function (e_i, ext) {
            c$.AcceptMarkdownFileTypes.push(ext);
        });
    });
    ///==


    /**
     * [内部通用消息不重复添加方式]
     * @param  {[type]} key [关键字]
     * @param  {[type]} fnc 解析的函数
     * @return {[type]}     [description]
     */
    c$._common_notice_add = function (key, fnc) {
        if (!$NoticeCenterFncMap.hasOwnProperty(key)) {
            $NoticeCenterFncMap[key] = fnc;
            if (!$NoticeCenter.has($NoticeCenterFncMap[key])) {
                $NoticeCenter.add($NoticeCenterFncMap[key]);
            }
        }
    };


    // 配置常用的工具类函数
    c$.configUtil = function () {


        /**
         * 统一国际化翻译处理
         * @param ele
         * @param parm
         * @returns {*}
         */
        $Util.fn_tri18n = function (ele, parm) {
            var content = "";
            try {
                content = (new IntlMessageFormat(ele, c$.language)).format(parm);
            } catch (e) {
                console.warn(e);
                content = "";
            }
            return content;
        }
    };

    // 初始化标题及版本
    c$.initTitleAndVersion = function () {
        document.title = b$.App.getAppName();
    };

    // 配置消息中心统一标识
    c$.configNoticeCenter = function () {

        var pre = "Message_";
        c$.NCMessage = {
            UNKnown: pre + "UNKnown",
            showSidedrawer: pre + "showSidedrawer" // 显示侧边栏
            ,
            onSidedrawerShow: pre + "onSidedrawerShow" // 当显示侧边栏
            ,
            hideSidedrawer: pre + "hideSidedrawer" // 隐藏侧边栏
            ,
            onSidedrawerHide: pre + "onSidedrawerHide" // 当隐藏侧边栏
            ,
            fileChange: pre + "fileChange" // 文件对象发生变化
            ,
            fileRemoved: pre + "fileRemoved" // 文件对象被删除
            ,
            userSettingsChange: pre + "userSettingsChange" // 用户设置发生变化
            ,
            productPurchased: pre + "productPurchased" // 商品已经被购买
            ,
            productRequested: pre + "productRequested" // 商品发送到服务器，进行验证
            ,
            productSyncNoAppStore: pre + "productSyncNoAppStore" // 在非AppStore产品状态下，同步插件信息
            ,
            userDropSomeFiles: pre + "userDropSomeFiles" // 用户拖拽文件到界面上，需要处理
            ,
            editorSettingsApplyToAll: pre + "editorSettingsApplyToAll" // 编辑器的主题样式应用到所有编辑器
            ,
            mustUpdateUI: pre + "mustUpdateUI" // 必须更新界面
        };
    };

    // 配置国际化
    c$.configInternationalization = function (deferred) {


        $.RTYUtils.loadLanguage("locales/", ".js", function (obj) {
            //console.log($.obj2string(obj));
            try {
                eval(obj.data);
                c$.language = obj.info.langID;
                $UserSettings.appSetting.systemLanguage = c$.language;
                deferred && deferred.resolve();
            } catch (e) {
                console.error(e);
            }
        });

        //==============================================================================
        c$._common_notice_add("Internationalization " + c$.NCMessage.userSettingsChange, function (message,
                                                                                                   old_data, new_data) {
            if (c$.NCMessage.userSettingsChange === message) {
                //检测语言是否与当前的语言匹配
                var userLang = new_data.appSetting.systemLanguage;
                if (c$.language !== userLang) {
                    $.RTYUtils.loadLanguage("locales/", ".js", function (obj) {
                        //console.log($.obj2string(obj));
                        try {
                            eval(obj.data);
                            c$.language = obj.info.langID;
                            $NoticeCenter.fire(c$.NCMessage.mustUpdateUI);
                            b$.App.setUserLanguage(c$.language);
                        } catch (e) {
                            console.error(e);
                        }
                    }, [userLang, c$.language]);
                }
            }
        });
        //end
        //
    };


    // 配置Cache
    c$.configCache = function () {

        $Cache = c$.Cache = new RomanySoftPlugins.Cache("UI.c$.cache", false);

        c$.CacheType = {
            UNKnown: "UNKnown",
            FileMarkDownCache: "file-markdown-cache" // markdown 文件缓存
        };

        //尝试恢复缓存数据
        $Cache.restore();
    };

    // 配置更新操作
    c$.checkUpdate = function () {

        b$.checkUpdate();
    };

    // 设置UI部分与逻辑交互
    c$.setupUI = function () {

        // 激活内置的$EditorProvider配置
        $EditorProvider.configEmoji();
        $EditorProvider.configKatexURL("common/katex/katex.min", "common/katex/katex.min", function () {
        });
        $EditorProvider.configLanguage(c$.language, function () {

            // 开启支持拖拽功能
            b$.enableDragDropFeature({
                callback: b$._get_callback(function (info) {
                    if (info.success) {
                        try {
                            if (!info.hasOwnProperty("filesArray")) return;
                            //发送消息异步来处理
                            $NoticeCenter.fire(c$.NCMessage.userDropSomeFiles,
                                info.filesArray);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }, true),
                fileTypes: c$.AcceptMarkdownFileTypes,
                typesDescript: c$.AcceptMarkdownFileTypesEx
            });

            // 注册缓存数据变更的消息处理函数(来自消息中心)
            c$._common_notice_add("$Cache.fileChange", function (message, fileId) {
                if (message === c$.NCMessage.fileChange) {

                    // 缓存 "file-markdown-cache" 类型的内容
                    var fileList = window.$fc.getAllFiles();

                    // 检查是否有对应的fileId传送过来
                    if (typeof fileId == "number") {
                        if (false == window.$fc.findFile(fileId)) { // 没有找到传过来的file id, 那么需要删除对应缓存的内容
                            $Cache.delete(fileId, c$.CacheType.FileMarkDownCache);
                        }
                    }

                    $.each(fileList, function (index, obj) {
                        $Cache.update(obj.id, c$.CacheType.FileMarkDownCache,
                            obj.coreDataToJSON())
                    });

                    $Cache.save();
                }
            });

            // 检查用户设置，是否设置了自动恢复功能
            var specFileObj = null;
            var mustCreateNew = true; // 是否必须创建一个新的文件对象
            if (c$.UserSettings.documentSetting.autoRestore) {
                // 查找是否有缓存的数据文件
                var cacheList = $Cache.findObjList(c$.CacheType.FileMarkDownCache); // 查找缓存 "file-markdown-cache" 类型的内容


                /// 声明设置Editor内容的函数
                function setEditorContent(fileObj, content) {
                    fileObj.content_utf8 = content;
                    try {
                        if (fileObj.assEditor) {
                            // 更新内容
                            $EditorProvider.setContent(
                                content,
                                fileObj.assEditor
                            );
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }


                // 恢复处理
                if (cacheList.length > 0) {

                    //弹出是否尝试恢复上一次编辑的文件
                    var _lng = I18N[c$.language].UI.filePage;

                    var _lng_message = $Util.fn_tri18n(_lng.Message[
                            "cacheResumeConfirm_message"
                            ]),
                        _lng_btn_Resume = $Util.fn_tri18n(_lng.Message[
                            "cacheResumeConfirm_restore"
                            ]),
                        _lng_btn_Cancel = $Util.fn_tri18n(_lng.Message[
                            "cacheResumeConfirm_cancel"
                            ]);

                    var rSelected = b$.Notice.alert({
                        title: b$.App.getAppName(),
                        message: _lng_message,
                        buttons: [_lng_btn_Resume, _lng_btn_Cancel]
                    });

                    if (rSelected != 0) {
                        // 清空$Cache
                        $.each(cacheList, function (index, cacheObj) {
                            $Cache.delete(cacheObj.key, c$.CacheType.FileMarkDownCache);
                        });

                        // 清空文件夹
                        b$.App.removeDir(b$.App.getAppDataHomeDir() + "/files_em_cache/", function () {

                        })

                    } else {
                        $.each(cacheList, function (index, cacheObj) {
                            var newFileObj = window.$fc.getNewFileObj();

                            newFileObj = newFileObj.coreDataFromJSON(newFileObj, cacheObj.value); // 数据还原
                            newFileObj.assEditor = null; // 去掉编辑器的对象关联

                            var _laodFilePath = "";
                            if (newFileObj.is_tmp) {
                                _laodFilePath = newFileObj.assTempContentFile;
                            } else {
                                _laodFilePath = newFileObj.path;
                                newFileObj.changed = false;
                            }

                            if (b$.App.checkPathIsFile(_laodFilePath)) {
                                b$.Binary.getUTF8TextContentFromFile({
                                    filePath: _laodFilePath
                                }, function (obj) {
                                    if (obj.success) {
                                        setEditorContent(newFileObj, obj.content);
                                    }
                                });

                                window.$fc.addFile(newFileObj, function () {
                                });
                                window.$fem.addNewFileObj(newFileObj);

                                // 添加到监视器中
                                if (!newFileObj.is_tmp) {
                                    c$.UIActions.addFileToWatcher(newFileObj.path);
                                }
                                mustCreateNew = false;
                            } else {
                                if (newFileObj.is_tmp){
                                    $Cache.delete(cacheObj.key, c$.CacheType.FileMarkDownCache);
                                }

                                console.warn("cache file can't found...");
                            }

                        });
                    }
                }
            }

            //////////////////////////////////////////////
            /// 检测是否从外部调用过来
            var process_argv = b$.App.getAppArgv();
            var argv_fileObjList = [];
            $.each(process_argv, function (index, arg) {
                //检查是否为文件
                if (b$.App.checkPathIsFile(arg)) {
                    var _path = arg;
                    argv_fileObjList.push({
                        fileName: b$.App.getFileName(_path),
                        filePath: _path,
                        extension: b$.App.getFileExt(_path)
                    })
                }
            });

            if (argv_fileObjList.length > 0) {
                var noSwitchView = true,
                    noNoticeMeesage = true;
                c$.UIActions.pri_importFiles(argv_fileObjList, noSwitchView, noNoticeMeesage);
                window.$fc.findFileEx({
                    path: argv_fileObjList[0].filePath
                }, function (fileObj) {
                    specFileObj = fileObj;
                });
                mustCreateNew = false;
            }

            ///////////////////////////////////////////////
            if (mustCreateNew) {
                specFileObj = c$.UIActions.crateNewFileObj();
            } else {
                //发送消息通知
                $NoticeCenter.fire(c$.NCMessage.fileChange);
            }

            // 默认启动，开启新的编辑对象
            try {
                $Router.go_workspace(specFileObj);
            } catch (error) {

            }

        });


    };

    // 配置UIActions
    c$.configUIActions = function () {

        // UI 的Actions
        c$.UIActions = {
            buyPlugin: function (id) {
                b$.IAP.buyProduct({
                    productIdentifier: id,
                    quantity: 1
                })
            }

            ,
            buyRestore: function () { // 恢复购买
                b$.IAP.restore();
            },
            getEditorDivEle: function (id) {
                var div_id = "div_editor" + id;
                return div_id;
            },
            revealIn: function (id) {
                try {
                    window.$fc.findFile(id, function (fileObj) {
                        b$.revealInFinder(fileObj.path);
                    });

                } catch (e) {

                }
            },
            loadFile: function (id) {
                window.$fc.reLoadFile(id || window.$fc.getLastModifyFileObj().id, function (fileObj) {
                    if (fileObj.is_tmp && $.trim(fileObj.path) === "") { // 临时文件
                        $Router.go_workspace(fileObj);
                    } else { // 本地文件
                        if (fileObj.mustReloadNextTime) {
                            b$.Binary.getUTF8TextContentFromFile({
                                callback: b$._get_callback(function (obj) {
                                    if (obj.success) {

                                        var setEditorContent = function () {
                                            fileObj.content_utf8 = obj.content;
                                            try {
                                                if (fileObj.assEditor) {
                                                    // 更新内容
                                                    $EditorProvider.setContent(
                                                        fileObj.content_utf8,
                                                        fileObj.assEditor
                                                    );
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        };

                                        // 检查内容是否一致
                                        if (fileObj.content_utf8 != obj.content && !fileObj.mustReloadNextTime) {

                                            // 需要询问用户是否更新
                                            var alertRet = b$.Notice.alert({
                                                message: $Util.fn_tri18n(
                                                    I18N[c$.language]
                                                        .UI.filePage
                                                        .Message[
                                                        "fileReloadConfirm_message"
                                                        ], {
                                                        path: fileObj
                                                            .path
                                                    }),
                                                title: $Util.fn_tri18n(
                                                    I18N[c$.language]
                                                        .UI.filePage
                                                        .Message[
                                                        "fileReloadConfirm_title"
                                                        ]),
                                                buttons: [
                                                    $Util.fn_tri18n(
                                                        I18N[c$.language]
                                                            .UI.filePage
                                                            .Message[
                                                            "fileReloadConfirm_btnOK"
                                                            ]),
                                                    $Util.fn_tri18n(
                                                        I18N[c$.language]
                                                            .UI.filePage
                                                            .Message[
                                                            "fileReloadConfirm_btnCancel"
                                                            ])
                                                ]
                                            });

                                            if (alertRet == 0) {
                                                setEditorContent();
                                            }
                                        } else if (fileObj.content_utf8 != obj.content) {
                                            setEditorContent();
                                        }

                                        fileObj.mustReloadNextTime = false;

                                        // 发送消息通知
                                        $NoticeCenter.fire(c$.NCMessage.fileChange);
                                        $Router.go_workspace(fileObj);
                                    }

                                }, true),
                                filePath: fileObj.path
                            });
                        } else {
                            $Router.go_workspace(fileObj);
                        }
                    }
                });
            },
            common_save_file: function (fileObj) {
                b$.Binary.createTextFile({
                    filePath: fileObj.path,
                    text: fileObj.content_utf8
                });

                fileObj.changed = false;

                // 发送消息通知
                $NoticeCenter.fire(c$.NCMessage.fileChange, fileObj.id);
            },
            saveFile: function (id, wantSaveAs) {
                var t$ = this;
                wantSaveAs = wantSaveAs || false;
                window.$fc.saveFile(id || window.$fc.getLastModifyFileObj().id, function (fileObj) {
                    if (fileObj.assEditor) {
                        fileObj.content_utf8 = $EditorProvider.getContent(fileObj.assEditor);
                    } else {
                        fileObj.content_utf8 = "";
                    }

                    var checkCanWritable = b$.App.checkPathIsExist(fileObj.path) && b$.App.checkPathIsWritable(
                            fileObj.path);
                    if (checkCanWritable && !wantSaveAs) {
                        t$.common_save_file(fileObj);
                    } else {

                        // 保存到本地
                        b$.selectOutFile({
                            callback: b$._get_callback(function (info) {
                                if (info.success) {
                                    fileObj.name = info.fileName;
                                    fileObj.is_tmp = false;
                                    fileObj.path = info.filePath;

                                    t$.common_save_file(fileObj);
                                }
                            }, true),
                            title: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                                "SaveDialog-Title"]),
                            prompt: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                                "SaveDialog-BtnSave"]),
                            fileName: fileObj.name,
                            enableFileFormatCombox: true,
                            types: c$.AcceptMarkdownFileTypes,
                            typesDescript: c$.AcceptMarkdownFileTypesEx

                        });
                    }

                });
            },
            saveAsFile: function (id) {
                var t$ = this;
                t$.saveFile(id, true);
            },
            exportFile: function (id) {

            },
            exportAsPDF: function (id) {
                // 共用方式
                function callExportToPdf(pdfFileName, cb) {

                    var _fileName = pdfFileName || "export_pdf_by_markdownd";

                    // 保存到本地
                    b$.selectOutFile({
                        callback: b$._get_callback(function (info) {
                            if (info.success) {
                                var pdfPath = info.filePath;
                                b$.App.printToPDF({
                                    filePath: pdfPath
                                }, function (obj) {
                                    if (obj.success) {
                                        b$.revealInFinder(pdfPath);
                                    } else {
                                        alert($.obj2string(obj.error));
                                    }

                                    cb && cb();
                                });
                            }
                        }, true),
                        title: $Util.fn_tri18n(I18N[c$.language].UI.filePage["SaveDialog-Title"]),
                        prompt: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                            "SaveDialog-BtnSave"]),
                        fileName: _fileName,
                        types: ['pdf']

                    });
                }

                var _editor = null,
                    _previewChang = false;
                var _fileObj = window.$fc.getLastModifyFileObj();

                var fileId = id || _fileObj.id;
                _editor = window.$fem.findEditorByFileId(fileId);

                $.RTYUtils.queue()
                    .next(function (nxt) {
                        if (_editor){
                            nxt && nxt();
                        }
                    })
                    .next(function (nxt) {
                        // 提示是导出整个窗体还是导出预览区域
                        // 检测当前所处的页面。
                        if (c$.g_current_page === "#view-workspace") {
                            if (_editor.state.preview === false) {
                                var _lng = I18N[c$.language].UI.filePage;
                                var _lng_message = $Util.fn_tri18n(_lng.Message[
                                        "fileExportPDFSelect_message"
                                        ]),
                                    _lng_exportPreview = $Util.fn_tri18n(_lng.Message[
                                        "fileExportPDFSelect_exportPreview"]),
                                    _lng_exportCurrentView = $Util.fn_tri18n(_lng.Message[
                                        "fileExportPDFSelect_exportCurrentView"]);

                                var rSelected = b$.Notice.alert({
                                    title: b$.App.getAppName(),
                                    message: _lng_message,
                                    buttons: [_lng_exportPreview, _lng_exportCurrentView,
                                        "Cancel"
                                    ]
                                });
                                console.log(rSelected);
                                if (rSelected === 0) {
                                    //切换MarkdownD到预览区域
                                    //检测当前状态
                                    if (_editor.state.preview === false) {
                                        _previewChang = true;
                                        _editor.previewing();
                                    }

                                } else if (rSelected === 1) {
                                }
                                if (rSelected === 2) return;
                            }
                        }

                        nxt && nxt();
                    })
                    .next(function (nxt) {
                        // 获取文件的名称
                        var err = null;
                        try {
                            callExportToPdf(_fileObj.name || "Untitled.pdf", function () {
                                if (_previewChang) {
                                    _editor.previewing();
                                }
                            });
                        } catch (e) {
                            err = e;
                        } finally {
                            nxt && nxt(err);
                        }
                    })
                    .done(function (err) {
                        console.log(err || "");
                    });
            },
            exportAsHtml: function (id) {
                function callExportToHtml(htmlFileName, fileContent, cb) {
                    // 保存到本地
                    b$.selectOutFile({
                        callback: b$._get_callback(function (info) {
                            if (info.success) {
                                var htmlPath = info.filePath;

                                b$.Binary.createTextFile({
                                    filePath: htmlPath,
                                    text: fileContent
                                }, function (obj) {
                                    if (obj.success) {
                                        b$.revealInFinder(htmlPath);
                                    }else{
                                        alert($.obj2string(obj.error));
                                    }
                                    cb && cb();

                                });
                            }
                        }, true),
                        title: $Util.fn_tri18n(I18N[c$.language].UI.filePage["SaveDialog-Title"]),
                        prompt: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                            "SaveDialog-BtnSave"]),
                        fileName: htmlFileName,
                        types: ['html']

                    });
                }


                var _editor = null,
                    _previewChang = false;
                var _fileObj = window.$fc.getLastModifyFileObj();

                var fileId = id || _fileObj.id;
                _editor = window.$fem.findEditorByFileId(fileId);


                $.RTYUtils.queue()
                    .next(function (nxt) {
                        if (_editor){
                            nxt && nxt();
                        }
                    })
                    .next(function (nxt) {
                        // 获取文件的名称
                        var err = null;
                        try {
                            var htmlContent = "";

                            htmlContent += '<!DOCTYPE html> \n';
                            htmlContent +=  '\n';
                            htmlContent +=  '<html>' + '\n';
                            htmlContent +=  '<head>' + '\n';
                            htmlContent +=  '<title>' + _fileObj.name + '</title>' + '\n';
                            htmlContent +=  '</head>' + '\n';
                            htmlContent +=  '<body>' + '\n';
                            htmlContent +=  _editor.getPreviewedHTML() + '\n';
                            htmlContent +=  '</body>' + '\n';
                            htmlContent +=  '</html>' + '\n';

                            callExportToHtml("MarkdownD_to_HTMLFile.html", htmlContent, function () {});
                        } catch (e) {
                            err = e;
                        } finally {
                            nxt && nxt(err);
                        }
                    })
                    .done(function (err) {
                        console.log(err || "");
                    });


            },
            removeFile: function (id) {
                window.$fc.removeFile(id, function (fileObj) {
                    // 发送消息通知
                    $NoticeCenter.fire(c$.NCMessage.fileRemoved, fileObj);
                    // 发送消息通知
                    $NoticeCenter.fire(c$.NCMessage.fileChange, fileObj.id);
                });

            },
            crateNewFileObj: function () {
                var newFileObj = window.$fc.getNewFileObj();
                newFileObj.assTempContentFile = b$.App.getAppDataHomeDir() + "/files_em_cache/" + newFileObj.id + ".cache";
                newFileObj.assEditor = null; // 去掉编辑器的对象关联

                window.$fc.addFile(newFileObj, function () {
                });
                window.$fem.addNewFileObj(newFileObj);

                // 发送消息通知
                $NoticeCenter.fire(c$.NCMessage.fileChange);
                return newFileObj;
            },
            createNew: function () {

                var fileObj = c$.UIActions.crateNewFileObj();
                if (c$.g_current_page !== '#view-files') {
                    $Router.go_workspace(fileObj);
                } else {
                    $Router.go_files();
                }

            },
            addFileToWatcher: function (in_path) {
                // 添加到系统变化监视器中
                b$.App.addFilePathToChangeWatcher({
                    callback: b$._get_callback(function (obj) {
                        var flag = obj.flag;
                        window.$fc.findFileEx({
                            path: obj.path
                        }, function (fileObj) {
                            if (flag === "FileWritten") {
                                fileObj.mustReloadNextTime = true;
                                b$.Notice.dockMessage({
                                    message: $Util.fn_tri18n(I18N[c$.language]
                                        .UI.filePage
                                        .Message[
                                        "fileChangeByOther_message"
                                        ], {
                                        path: fileObj.path
                                    }),
                                    title: $Util.fn_tri18n(I18N[c$.language]
                                        .UI.filePage
                                        .Message[
                                        "fileChangeByOther_title"
                                        ])
                                });
                            } else if (flag === "FileRenamed") {
                                b$.Notice.dockMessage({
                                    message: $Util.fn_tri18n(I18N[c$.language]
                                        .UI.filePage
                                        .Message[
                                        "fileRenamedByOther_message"
                                        ], {
                                        path: fileObj.path
                                    }),
                                    title: $Util.fn_tri18n(I18N[c$.language]
                                        .UI.filePage
                                        .Message[
                                        "fileRenamedByOther_title"
                                        ])
                                });
                            } else if (flag === "FileDeleted") {
                                b$.Notice.dockMessage({
                                    message: $Util.fn_tri18n(I18N[c$.language]
                                        .UI.filePage
                                        .Message[
                                        "fileDeletedByOther_message"
                                        ], {
                                        path: fileObj.path
                                    }),
                                    title: $Util.fn_tri18n(I18N[c$.language]
                                        .UI.filePage
                                        .Message[
                                        "fileDeletedByOther_title"
                                        ])
                                });
                            }

                        });


                    }, true),
                    path: in_path
                });
            },
            pri_importFiles: function (fileObjList, noSwitchView, noNoticeMeesage) {
                try {
                    $.each(fileObjList, function (index, obj) {
                        //检测是否已经存在
                        if (window.$fc.findFileEx({
                                path: obj.filePath
                            })) {
                            console.log('import file exist....');

                            if (!noNoticeMeesage) {
                                b$.Notice.dockMessage({
                                    message: $Util.fn_tri18n(I18N[c$.language].UI.filePage
                                        .Message[
                                        "existOnImport_message"], {
                                        path: obj.filePath
                                    }),
                                    title: $Util.fn_tri18n(I18N[c$.language].UI.filePage
                                        .Message[
                                        "existOnImport_title"])
                                });
                            }
                        } else {
                            var newFileObj = window.$fc.getNewFileObj();
                            newFileObj.name = obj.fileNameWithoutExtension;
                            newFileObj.path = obj.filePath;
                            newFileObj.ext = obj.extension;
                            newFileObj.is_tmp = false;
                            newFileObj.mustReloadNextTime = true;
                            window.$fc.addFile(newFileObj, function () {
                            });
                            window.$fem.addNewFileObj(newFileObj);

                            // 添加到监视器中
                            c$.UIActions.addFileToWatcher(newFileObj.path);

                            // 发送消息通知
                            $NoticeCenter.fire(c$.NCMessage.fileChange);
                        }

                    });
                } catch (e) {
                    console.error(e);
                } finally {
                    !noSwitchView && $Router.go_files();
                }
            },
            importFiles: function () {
                var t$ = this;
                b$.importFiles({
                    callback: b$._get_callback(function (info) {
                        if (info.success) {
                            t$.pri_importFiles(info.filesArray);
                        }
                    }, true),

                    title: $Util.fn_tri18n(I18N[c$.language].UI.filePage["ImportDialog-Title"]),
                    prompt: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                        "ImportDialog-BtnImport"]),
                    allowOtherFileTypes: true,
                    allowMulSelection: true,
                    enableFileFormatCombox: true,
                    types: c$.AcceptMarkdownFileTypes,
                    typesDescript: c$.AcceptMarkdownFileTypesEx
                });
            },

            /**
             * 检测编辑器中的文件变化情况，提示是否保存
             * @return {[type]} [description]
             */
            detectFilesStateAndSaveWhenAppQuit: function () {
                var t$ = this;
                var fileList = window.$fc.getAllFiles();

                var wantSaveFilesList = [];
                $.each(fileList, function (index, fileObj) {
                    if (fileObj.is_tmp === false && fileObj.changed) {
                        wantSaveFilesList.push(fileObj);
                    }
                });

                //如果发现有没有保存的本地文件，提示用户保存
                if (wantSaveFilesList.length > 0) {

                    var _filePaths = [];
                    $.each(wantSaveFilesList, function (index, fileObj) {
                        _filePaths.push(fileObj.path)
                    });

                    var _lng = I18N[c$.language].UI.filePage;
                    var _lng_message = $Util.fn_tri18n(_lng.Message[
                            "filesChangeWantSaveConfirm_message"
                            ], {
                            filePaths: _filePaths.join('\n')
                        }),
                        _lng_saveAll = $Util.fn_tri18n(_lng.Message[
                            "filesChangeWantSaveConfirm_saveAll"]),
                        _lng_dontSave = $Util.fn_tri18n(_lng.Message[
                            "filesChangeWantSaveConfirm_dontSave"]);


                    var rSelected = b$.Notice.alert({
                        title: b$.App.getAppName(),
                        message: _lng_message,
                        buttons: [_lng_saveAll, _lng_dontSave, "Cancel"]
                    });

                    if (rSelected === 0) {
                        $.each(wantSaveFilesList, function (index, fileObj) {
                            t$.saveFile(fileObj.id);
                        })
                    } else if (rSelected === 2) {
                        return false;
                    }
                }

                return true;
            },

            //===============================================================
            //用户设置
            //===============================================================
            resetUserSetting: function () {
            },
            saveUserSetting: function () {
            },
            useDefaultSetting: function () {
            },

            //===============================================================
            //用户帮助
            //===============================================================
            help: function () {
                var url = b$.App.getDocumentPageURL();
                b$.App.open(url);
            },

            //==============================================================
            //UI元素控制
            //==============================================================
            uiTextWidthInfo: {},
            uiGetTextWidth: function(text, font){ // 动态计算字体宽度
                "use strict";
                // if given, use cached canvas for better performance
                // else, create new canvas
                var canvas = $('#canvas_for_text_width')[0];
                var context = canvas.getContext("2d");
                context.font = font;
                var metrics = context.measureText(text);

                return metrics.width;
            },

            uiHTML_setNavTitle: function (text) { // 文本
                var t$ = this;
                var charNumbers = text.length;

                var limit = charNumbers;
                try {
                    var ele_head_width = $('#header').width();
                    var ele_navRight_width = $('#nav-right').width();

                    var fontWidth = 1;
                    var optNavTitleFontWidth = t$.uiTextWidthInfo["NavTitle"] || 0;


                    if (optNavTitleFontWidth < 1) {
                        var font = $('#nav-title').css('font');
                        var testText = "你好ABC";

                        fontWidth = t$.uiGetTextWidth(testText, font) / testText.length;
                        t$.uiTextWidthInfo["NavTitle"] = fontWidth;
                    } else {
                        fontWidth = optNavTitleFontWidth;
                    }

                    if (fontWidth > 0) {
                        limit = (ele_head_width - ele_navRight_width) / fontWidth;
                        limit = limit > 15 ? limit : 15;
                    }

                } catch (e) {
                    console.error(e);
                }

                var showText = "";
                if (charNumbers > limit) {
                    showText = text.substring(0, limit) + " ***";//最终显示的文本
                } else {
                    showText = text;
                }

                $('#nav-title').prop("title", text);
                $('#nav-title').html(showText);
            }
        };
    };

    // 配置左侧菜单栏
    c$.configSideDrawer = function () {
        console.log("left nav");

        var thisPage = '#sidedrawer';
        var ele = $(thisPage);
        if ($.trim(ele.html()).length == 0) {

            /**
             * [fn_update_ui 更新内容]
             * @param  {[type]} ele [description]
             * @return {[type]}     [description]
             */
            function fn_update_ui(ele) {
                var o = {
                    appName: b$.App.getAppName("MarkdownD"),
                    appVersion: b$.App.getAppVersion(),
                    navList: [{
                        name: $Util.fn_tri18n(I18N[c$.language].UI.navPage["Files"]),
                        class: "fa-clone",
                        href: "#/files"
                    }, {
                        name: $Util.fn_tri18n(I18N[c$.language].UI.navPage["Workspace"]),
                        class: "fa-tv",
                        href: "#/workspace"
                        // }, {
                        //     name: $Util.fn_tri18n(I18N[c$.language].UI.navPage["Plugins"]),
                        //     class:"",
                        //     href: "#/pluginsMgr"
                    }, {
                        name: $Util.fn_tri18n(I18N[c$.language].UI.navPage["Settings"]),
                        class: "fa-spinner",
                        href: "#/settings"
                    }
                        // , {
                        //     name: $Util.fn_tri18n(I18N[c$.language].UI.navPage["About"]),
                        //     class:"",
                        //     href: "#/about"
                        // }

                    ]
                };

                var html = template('tpl_sidedrawer', o);
                ele.html(html);
            }

            // ===========================================================================
            // 注册要求更新UI(来自消息中心)
            // ===========================================================================
            c$._common_notice_add(thisPage + c$.NCMessage.mustUpdateUI, function (message) {
                if (c$.NCMessage.mustUpdateUI === message) {
                    fn_update_ui(ele);
                }
            });

            //============================================================================
            // 更新
            //============================================================================
            fn_update_ui(ele);
            jQuery(function ($) {
                var $bodyEl = $('body'),
                    $sidedrawerEl = $('#sidedrawer');


                // ==========================================================================
                // Toggle Sidedrawer
                // ==========================================================================
                function showSidedrawer() {
                    // show overlay
                    var options = {
                        onclose: function () {
                            $sidedrawerEl
                                .removeClass('active')
                                .appendTo(document.body);
                        }
                    };

                    var $overlayEl = $(mui.overlay('on', options));

                    // show element
                    $sidedrawerEl.appendTo($overlayEl);
                    setTimeout(function () {
                        $sidedrawerEl.addClass('active');
                    }, 20);
                }


                function hideSidedrawer() {
                    $bodyEl.toggleClass('hide-sidedrawer');
                    $bodyEl.hasClass('hide-sidedrawer') ? $NoticeCenter.fire(c$.NCMessage
                        .onSidedrawerHide) :
                        $NoticeCenter.fire(c$.NCMessage.onSidedrawerShow);
                }


                $('.js-show-sidedrawer').on('click', showSidedrawer);
                $('.js-hide-sidedrawer').on('click', hideSidedrawer);

                // ==========================================================================
                // Register Notice
                // ==========================================================================
                c$._common_notice_add("js-sidedrawer", function (message) {
                    if (message === c$.NCMessage.showSidedrawer) {
                        if ($bodyEl.hasClass('hide-sidedrawer'))
                            showSidedrawer();
                    }

                    if (message === c$.NCMessage.hideSidedrawer) {
                        if ($bodyEl.hasClass('hide-sidedrawer')) return;
                        hideSidedrawer();
                    }

                });
            });


        }

    };

    // 配置路由控制
    c$.configRoute = function () {


        if (typeof Router === "undefined") {
            console.error('director router not config...');
            return;
        }

        // 所有的页面配置
        var allPageList = ['#view-files', '#view-workspace', '#view-settings'];

        c$.g_navTitle = ""; // 全局的导航标题

        $Router.fn_showOrHide = function (eleList, show, auto, cb) {
            $.each(eleList, function (index, ele) {
                if (auto == true) {
                    $(ele).is(":visible") == false ? $(ele).show() : $(ele).hide();
                } else if (show) {
                    if ($(ele).is(":visible") == false) {
                        $(ele).show()
                    }
                } else {
                    if ($(ele).is(":visible") == true) $(ele).hide();
                }

            });

            cb && cb();
        };

        $Router.fn_updateNavRight = function ($ele) {
            $('#nav-right > div').removeClass('mui--show').addClass('mui--hide');
            $ele.removeClass('mui--hide').addClass('mui--show');
        };


        $Router.go_files = function () {
            console.log("files");

            c$.g_navTitle = $Util.fn_tri18n(I18N[c$.language].UI.filePage["Title"]);
            c$.UIActions.uiHTML_setNavTitle(c$.g_navTitle);

            var thisPage = '#view-files';
            c$.g_current_page = thisPage;

            //===============================================================================
            // 更新标题栏右侧的工具栏
            //===============================================================================
            var $ele_header = $('#header-files');
            var htmlContent_header = template('tpl_header-files', {
                btnNewFileTitle: $Util.fn_tri18n(I18N[c$.language].UI.filePage["Btn-New"]),
                btnImportTitle: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                    "Btn-ImportFiles"]),
                buttons: [{
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage["Btn-New"]),
                    class: "fa-file-text",
                    href: "#/uiactions/create_new_file"
                }, {
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                        "Btn-ImportFiles"]),
                    class: "fa-folder-open-o",
                    href: "#/uiactions/impore_files"
                }, {
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage[
                        "Btn-Help"]),
                    class: "fa-question-circle",
                    href: "#/uiactions/help"
                }]
            });
            $ele_header.html(htmlContent_header);
            $Router.fn_updateNavRight($ele_header);


            //////////////////////////////////////////////////////////////////////////////////
            /// 注册文件拖拽的处理方式
            c$._common_notice_add(thisPage + c$.NCMessage.userDropSomeFiles, function (message, fileList) {
                if (message === c$.NCMessage.userDropSomeFiles) {
                    if (c$.g_current_page === thisPage) {
                        c$.UIActions.pri_importFiles(fileList);
                    }
                }
            });

            //====================================================================================
            // 注册文件对象被删除，关联的editor也要删除
            //====================================================================================
            c$._common_notice_add(thisPage + c$.NCMessage.fileRemoved, function (message, fileObj) {
                if (message === c$.NCMessage.fileRemoved) {
                    if (c$.g_current_page === thisPage) {
                        //文件视图结构要发生变化
                        try {
                            //=================================================================
                            //强制刷新页面
                            //================================================================
                            window.location.href = "#/files";

                            //对应的缓存文件也要删除
                            b$.App.removeFile(fileObj.assTempContentFile, function () {

                            });
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            });

            //////////////////////////////////////////////////////////////////////////////////
            var ele = $(thisPage);
            var curEditingFileObj = c$.g_curWorkFileObj;
            var o = {
                curFileId: curEditingFileObj ? curEditingFileObj.id : "", /// 当前编辑的文件ID
                files: window.$fc.getAllFilesWithSortByCreateTime(),
                buttons: [{
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage["Btn-Load"]),
                    class: "fa-pencil",
                    href: "#/uiactions_withid/file_load"
                }, {
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage["Btn-Save"]),
                    class: "fa-save",
                    href: "#/uiactions_withid/file_save"
                }, {
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage["Btn-Remove"]),
                    class: "fa-remove",
                    href: "#/uiactions_withid/file_remove"
                }, {
                    name: $Util.fn_tri18n(I18N[c$.language].UI.filePage["Btn-RevealIn"]),
                    class: "fa-folder-o",
                    href: "#/uiactions_withid/file_revealin"
                }]
            };


            var html = template('tpl_files', o);
            ele.html(html);

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);

            $('#view-files input').on("blur", function () {
                if ($(this).data('field') == 'name') {
                    var id = $(this).data('id');
                    var newName = this.value;
                    window.$fc.findFile(id, function (obj) {
                        obj.name = newName;
                    });
                }
            })

            window.location.href = '#';
        };

        /**
         * 打开编辑器工作空间
         * @param fileObj 传入文件对象 参见window.$fc.getNewFileObj()
         */
        $Router.go_workspace = function (fileObj) {
            console.log("workspace");

            var thisPage = '#view-workspace';
            c$.g_current_page = thisPage;

            //==============================================================================
            // 定义
            //==============================================================================
            /**
             * [隐藏所有Markdown编辑器]
             * @return {[type]} [description]
             * @see https://api.jquery.com/hide/
             */
            function _hideAllEditor(duration, complete_callback) {
                var eleList = $(thisPage + " > .editormd");
                var count_ele = eleList.length,
                    count_complete = 0;
                if (count_ele === 0) {
                    complete_callback && complete_callback();
                } else {
                    eleList.hide(duration || "fast", function () {
                        ++count_complete;
                        if (count_complete >= count_ele) {
                            complete_callback && complete_callback();
                        }
                    });
                }
            }

            /**
             * [显示指定Markdown编辑器]
             * @param  {[type]} div_id [description]
             * @return {[type]}        [description]
             * @see https://api.jquery.com/show/
             */
            function _showEditor(div_id, duration, complete_callback) {
                var eleList = $('#' + div_id);
                var count_ele = eleList.length,
                    count_complete = 0;
                if (count_ele === 0) {
                    complete_callback && complete_callback();
                } else {
                    eleList.show(duration || "fast", function () {
                        ++count_complete;
                        if (count_complete >= count_ele) {
                            complete_callback && complete_callback();
                        }
                    });
                }
            }


            //==============================================================================
            //检查文件对象是否真实存在？没有的话，需要创建新的。有的话，需要变更最后编辑时间
            //==============================================================================
            if (null === window.$fc.getLastModifyFileObj() && !fileObj) {
                fileObj = c$.UIActions.crateNewFileObj();
            }
            c$.g_curWorkFileObj = fileObj || window.$fc.getLastModifyFileObj();
            c$.g_curWorkFileObj.lastModify = $.now(); // 修改最后编辑的时间

            // 查找对应的Editor是否存在
            var div_id = c$.UIActions.getEditorDivEle(c$.g_curWorkFileObj.id);

            //=============================================================================
            // 更新标题栏上右侧区域
            //=============================================================================
            var $ele_hear = $('#header-workspace-filelist');

            // 获取$ele_hear 优化的能容纳的字数
            var autoGetOpenFileName = function (text) {
                var t$ = c$.UIActions;

                var charNumbers = text.length;
                var limit = charNumbers;
                var infoKey = "#header-workspace-filelist";

                try {

                    var fontWidth = 1;
                    var optFontWidth = t$.uiTextWidthInfo[infoKey] || 0;


                    if (optFontWidth < 1) {
                        var font = $ele_hear.css('font');
                        var testText = "你好ABC";

                        fontWidth = t$.uiGetTextWidth(testText, font) / testText.length;
                        t$.uiTextWidthInfo[infoKey] = fontWidth;
                    } else {
                        fontWidth = optFontWidth;
                    }

                    if (fontWidth > 0) {
                        limit = $ele_hear.width() / fontWidth;
                        limit = limit > 15 ? limit : 15;
                    }

                } catch (e) {
                    console.error(e);
                }

                var showText = "";
                if (charNumbers > limit * 2) {
                    showText = text.substring(0, limit * 2) + " ***";//最终显示的文本
                } else {
                    showText = text;
                }

                return showText;
            };


            var getEleHearHtmlContent = function () {
                var _getAllFiles = function () {
                    var _fileList = [];
                    $.each(window.$fc.getAllFilesWithSortByCreateTime(), function (index, obj) {
                        var fileObj = {};
                        fileObj.id = obj.id;
                        fileObj.path = obj.path;
                        fileObj.name = obj.changed ? ' [*]' + obj.name : obj.name;

                        fileObj.showToolTip = fileObj.name + "\n";
                        if (fileObj.path.length > 1){
                            fileObj.showToolTip += fileObj.path + "\n";
                        }

                        var date_lastModify = null;
                        try{
                            date_lastModify = new Date(parseInt(obj.lastModify));
                            if(date_lastModify){
                                fileObj.showToolTip += date_lastModify.toLocaleString().replace(/:\d{1,2}$/, ' ') + "\n";
                            }

                        }catch(e){
                            if(date_lastModify){
                                try{
                                    fileObj.showToolTip += date_lastModify.toDateString() + " " +date_lastModify.toTimeString();
                                }catch(e){}
                            }
                        }


                        fileObj.name = autoGetOpenFileName(fileObj.name);
                        _fileList.push(fileObj);
                    });
                    return _fileList;
                };


                var htmlContent = template('tpl_header-workspace-filelist', {
                    curFileId: c$.g_curWorkFileObj ? c$.g_curWorkFileObj.id : "", /// 当前编辑的文件ID
                    fileList: _getAllFiles(),
                    moreTools: {
                        enable: false, /// 是否可以启用更多工具
                        class: "fa-cog fa-spin fa-lg",
                        tools: [{
                            name: "",
                            description: "",
                            class: "",
                            href: ""
                        }]
                    },
                    buttons: [
                        {
                            name: $Util.fn_tri18n(I18N[c$.language].UI.workspacePage["Btn-ExportToHTML"]),
                            class: "fa-html5 fa-lg",
                            href: "#/uiactions/exportToHtml"
                        }, {
                            name: $Util.fn_tri18n(I18N[c$.language].UI.workspacePage["Btn-Help"]),
                            class: "fa-question-circle fa-lg",
                            href: "#/uiactions/help"
                        }
                    ]
                });

                return htmlContent;
            };

            $ele_hear.html(getEleHearHtmlContent());
            $Router.fn_updateNavRight($ele_hear);

            /// 注册外部消息导致标题栏右侧区域更新的消息句柄
            c$._common_notice_add("fn_updateNavRight" + thisPage + c$.NCMessage.fileChange, function (message, fileObj) {
                if (message === c$.NCMessage.fileChange) {
                    if (c$.g_current_page === thisPage) {
                        try {
                            $ele_hear.html(getEleHearHtmlContent());
                            $Router.fn_updateNavRight($ele_hear);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            });


            // 初始化内容
            var ele = $(thisPage);
            if ($.trim(ele.html()).length == 0) {
                var html = template('tpl_workspace', {});
                ele.html(html);
            }


            //============================================================================================
            // 处理Editor
            //============================================================================================
            $.RTYUtils.queue()
                .next(function (next) {
                    //==============================================================================
                    // 注册消息处理
                    //==============================================================================

                    /// 注册文件拖拽的处理方式
                    c$._common_notice_add(thisPage + c$.NCMessage.userDropSomeFiles, function (message,
                                                                                               fileList) {
                        if (message === c$.NCMessage.userDropSomeFiles) {
                            if (c$.g_current_page === thisPage) {
                                console.log("------- 拖拽文件 -----");
                                //TODO: 判断文件类型，然后进行操作。
                                //支持1. 本地图片及文件自动建立链接
                                //;
                                var _editor = window.$fem.findEditorByFileId(c$.g_curWorkFileObj
                                    .id);

                                // 获得所有支持md文件的
                                var mdFiles = [],
                                    otherFiles = [];
                                $.each(fileList, function (index, fileObj) {
                                    var ext = fileObj.extension;
                                    if ($.inArray(ext, c$.AcceptMarkdownFileTypes) > -1) {
                                        mdFiles.push(fileObj);
                                    } else {
                                        otherFiles.push(fileObj);
                                    }
                                });

                                if (mdFiles.length > 0) {
                                    var _lng = I18N[c$.language].UI.filePage;
                                    var rSelected = b$.Notice.alert({
                                        title: b$.App.getAppName(),
                                        message: $Util.fn_tri18n(_lng.Message[
                                            "dropfileconfirm_message"]),
                                        buttons: [
                                            $Util.fn_tri18n(_lng.Message[
                                                "dropfileconfirm_import"]), $Util.fn_tri18n(
                                                _lng.Message[
                                                    "dropfileconfirm_createlink"]),
                                            "Cancel"
                                        ]
                                    });

                                    if (rSelected === 0) {
                                        //导入
                                        c$.UIActions.pri_importFiles(mdFiles, true);

                                        //获取最新导入的文件对象
                                        var _lastFileObj = window.$fc.getLastCreatedFileObj();

                                        //然后打开这些文件
                                        if (_lastFileObj) {
                                            c$.UIActions.loadFile(_lastFileObj.id);
                                            window.location.href = '#';
                                        }
                                    } else if (rSelected === 1) {
                                        //创建链接
                                        _editor.executePlugin("processDropFiles",
                                            "drop-plugin/drop-plugin",
                                            mdFiles);
                                    }
                                }

                                if (otherFiles.length > 0) {
                                    _editor.executePlugin("processDropFiles",
                                        "drop-plugin/drop-plugin",
                                        otherFiles);
                                }
                            }
                        }
                    });
                    /// 注册文件变化的处理方式
                    c$._common_notice_add("nav-title" + thisPage + c$.NCMessage.fileChange, function (message, fileId) {
                        if (message === c$.NCMessage.fileChange) {
                            if (fileId === c$.g_curWorkFileObj.id) {
                                if (c$.g_current_page === thisPage) {
                                    var wk = $Util.fn_tri18n(I18N[c$.language].UI.workspacePage[
                                        "Title"]);

                                    var baseName = wk + ' - ' + c$.g_curWorkFileObj.name;
                                    var baseChangeName = wk + ' - [*] ' + c$.g_curWorkFileObj.name;
                                    c$.g_navTitle = (true === c$.g_curWorkFileObj.changed) ? baseChangeName : baseName;

                                    //=======================================================================
                                    // 更新Header的标题及文件选择列表
                                    //=======================================================================
                                    c$.UIActions.uiHTML_setNavTitle(c$.g_navTitle);
                                }
                            }
                        }
                    });

                    //===============================================================================
                    // 注册与window.$fem 的处理变更方式
                    //==============================================================================
                    c$._common_notice_add(thisPage + c$.NCMessage.userSettingsChange, function (message,
                                                                                                _old, _new) {
                        if (c$.NCMessage.userSettingsChange === message) {
                            // 获取所有激活状态的下载的file 和 editor对象，然后对editor进行变化
                            var editor_list = window.$fem.getAllEditor();

                            // 循环处理配置
                            $.each(editor_list, function (index, editor) {
                                if (editor) {
                                    try {
                                        if (typeof editor.config === "function") {
                                            var _es = _new.editorSetting,
                                                _old_es = _old.editorSetting;
                                            for (var key in _es) {
                                                try {
                                                    if (key in _old_es) {
                                                        if (_old_es[key] !== _es[key]) {
                                                            editor.config(key, _es[key]);
                                                        }
                                                    } else {
                                                        editor.config(key, _es[key]);
                                                    }

                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }

                            });
                        }
                    });

                    //====================================================================================
                    // 注册编辑器设置整体发生变化后的处理方式
                    //====================================================================================
                    c$._common_notice_add(thisPage + c$.NCMessage.editorSettingsApplyToAll, function (message,
                                                                                                      settings) {
                        if (message === "applyToAll.editormd-settings") {
                            // [应用到后面要创建及现在还有Editor实例]
                            for (var key in settings) {
                                if (key in $UserSettings.editorSetting) {
                                    $UserSettings.editorSetting[key] = settings[key];
                                }
                            }

                            // [应用到黄倩已经有Editor实例的文件中]获取所有激活状态的下载的file 和 editor对象，然后对editor进行变化
                            var editor_list = window.$fem.getAllEditor();
                            $.each(editor_list, function (index, editor) {
                                editor && $EditorProvider.updateSettings(settings,
                                    editor);
                            });
                        }
                    });

                    //===================================================================================
                    // 配置Editor.md 编辑器默认工具更新
                    //===================================================================================
                    c$._common_notice_add("Editor" + c$.NCMessage.mustUpdateUI, function (message) {
                        if (c$.NCMessage.mustUpdateUI === message) {
                            console.log("[message]" + message);
                            $EditorProvider.configLanguage(c$.language, function () {
                                // [应用到黄倩已经有Editor实例的文件中]获取所有激活状态的下载的file 和 editor对象，然后对editor进行变化
                                var editor_list = window.$fem.getAllEditor();
                                $.each(editor_list, function (index, editor) {
                                    editor && $EditorProvider.updateUIWhenLanguageChanged(
                                        editor);
                                });
                            });
                        }
                    });

                    //====================================================================================
                    // 注册文件对象被删除，关联的editor也要删除
                    //====================================================================================
                    c$._common_notice_add(thisPage + c$.NCMessage.fileRemoved, function (message,
                                                                                         fileObj) {
                        if (message === c$.NCMessage.fileRemoved) {
                            //workspace 结构要发生变化
                            try {
                                var editor = fileObj.assEditor;
                                if (editor instanceof editormd) {
                                    var div_id = editor.id;

                                    if (editor) editor.length = 0;
                                    window.$fem.removeFileObjById(fileObj.id);

                                    var $ele = $('#' + div_id);
                                    $ele.remove();
                                }

                            } catch (e) {
                                console.error(e);
                            }
                        }
                    });

                    next && next();
                })
                .next(function (next) {
                    //
                    //发送消息通知
                    $NoticeCenter.fire(c$.NCMessage.fileChange, c$.g_curWorkFileObj.id);
                    next && next();
                })
                .next(function (next) {
                    _hideAllEditor($UserSettings.editorSetting["switchDelay"], function () {
                        next && next();
                    }); // 隐藏所有markdown编辑器
                })
                .next(function (next) {


                    var _foundExistEditor = window.$fem.findEditorByFileId(c$.g_curWorkFileObj.id);
                    /// 检查在Document文档中的正确性,没有找到，要及时删除垃圾数据
                    if (_foundExistEditor) {
                        if ($(thisPage).has('#' + div_id).length === 0) {
                            _foundExistEditor.length = 0;
                            _foundExistEditor = null;
                            c$.g_curWorkFileObj.assEditor = null;
                        }
                    }

                    //============================================================================================
                    if (_foundExistEditor) {
                        _showEditor(div_id, $UserSettings.editorSetting["switchDelay"], function () {
                            var editor = _foundExistEditor;
                            try {
                                c$.g_curWorkFileObj.assEditor = editor;
                                c$.g_curWorkFileObj.lastModify = $.now(); // 修改最后编辑的时间
                            } catch (e) {

                            } finally {
                                next && next();
                            }
                        });
                    } else { // 否则，需要创建新的Editor来处理
                        // 先创建Div
                        var html_ele = '<div id="' + div_id + '"' + ' class="mui-panel"></div>';
                        ele.append(html_ele);

                        // 计算内部内容多余出来的高度。see http://api.jquery.com/outerHeight/
                        var fixedHeight = $('#' + div_id).outerHeight(true) - $('#' + div_id).height();

                        /**
                         * [getEditorHeight 获得编辑器的高度]
                         * @return {[type]} [Number]
                         */
                        function getEditorHeight() {
                            return $('body').height() - $('#header').height() - fixedHeight;
                        }

                        /**
                         * [getSidedrawerWidth 获得左侧边栏的宽度]
                         * @return {[type]} [description]
                         */
                        function getSidedrawerWidth() {
                            return $('#sidedrawer').outerWidth(true) - $('#sidedrawer').width();
                        }


                        // 然后创建编辑器, 并做关联
                        var newEditorMd = c$.g_curWorkFileObj.assEditor = $EditorProvider.createEditor(
                            div_id, $.extend({}, $UserSettings.editorSetting, {
                                height: getEditorHeight(),
                                toolbarAutoFixed: false
                                // 函数
                                ,
                                onload: function () {
                                    var _curFileObj = c$.g_curWorkFileObj;
                                    $EditorProvider.setContent(_curFileObj.content_utf8, this);
                                    _curFileObj.lastModify = $.now(); // 修改最后编辑的时间
                                },
                                onchange: function () {
                                    var _curFileObj = c$.g_curWorkFileObj;
                                    var curContent = $EditorProvider.getContent(this);
                                    var settings = c$.UserSettings.documentSetting;
                                    _curFileObj.changed = false;

                                    /** ///////////////////////////////////////////////////
                                     * 缓存文件要及时保存, 检测变化为5秒 [*** 缓存文件时刻保存 ***]
                                     * ////////////////////////////////////////////////////
                                     */
                                    var cacheSaveSec = 2; // 缓存文件保存检查时间

                                    if (_curFileObj.content_utf8_cache != curContent) {
                                        if (_curFileObj.is_tmp) {
                                            _curFileObj.changed = _curFileObj.isCacheEnable;
                                        }

                                        var mustSave = (($.now() - _curFileObj.lastSaveToCacheTime) >= cacheSaveSec * 1000) || !_curFileObj.isCacheEnable;
                                        if (mustSave) {
                                            //临时文件的保存
                                            try {
                                                b$.Binary.createTextFile({
                                                    filePath: _curFileObj
                                                        .assTempContentFile,
                                                    text: curContent
                                                }, function (obj) {
                                                    if (obj.success) {
                                                        _curFileObj.content_utf8_cache = curContent;
                                                        _curFileObj.isCacheEnable = true;
                                                        _curFileObj.lastSaveToCacheTime = $.now();
                                                    }
                                                });

                                            } catch (e) {
                                            }
                                        }
                                    }


                                    /** ///////////////////////////////////////////////////
                                     * 本地文件检测
                                     * ////////////////////////////////////////////////////
                                     */
                                    if (_curFileObj.content_utf8 != curContent) {
                                        _curFileObj.changed = true;
                                        if (settings.autoSave) {
                                            // 检查间隔
                                            if (($.now() - _curFileObj.lastSaveToFileTime) >= settings.autoSaveSecs * 1000) {
                                                // 非临时文件的保存
                                                if (false == _curFileObj.is_tmp) {
                                                    try {
                                                        b$.Binary.createTextFile({
                                                            filePath: _curFileObj.path,
                                                            text: _curFileObj.curContent
                                                        }, function (obj) {
                                                            if (obj.success) {
                                                                _curFileObj.content_utf8 = curContent;
                                                                _curFileObj.lastSaveToFileTime = $.now();
                                                                _curFileObj.changed = false;
                                                            } else {
                                                                alert(obj.error);
                                                            }
                                                        });
                                                    } catch (e) {
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    _curFileObj.lastModify = $.now(); // 修改最后编辑的时间
                                    //发送消息通知
                                    $NoticeCenter.fire(c$.NCMessage.fileChange, _curFileObj
                                        .id);
                                },
                                onscroll: function () {

                                },
                                beforePreviewing: function () {
                                    var t$ = this;
                                    $('#header').hide();
                                    $NoticeCenter.fire(c$.NCMessage.hideSidedrawer);
                                },
                                onpreviewing: function () {
                                    console.log("call onpreviewing -----------");
                                },
                                onpreviewed: function () {
                                    console.log("call onpreviewed -----------");
                                    $('#header').show();
                                },
                                onfullscreen: function () {
                                    console.log("call onfullscreen -----------");
                                },
                                onfullscreenExit: function () {
                                    console.log("call onfullscreenExit -----------");
                                }
                            }));

                        //=======================================
                        //注册事件
                        //=======================================
                        function _p_common_resize_editor() {
                            setTimeout(function () {
                                c$.UIActions.uiHTML_setNavTitle(c$.g_navTitle);
                                newEditorMd.resize();
                            }, 200);
                        }

                        $(window).on('resize', function (e) {
                            newEditorMd.height(getEditorHeight());
                            _p_common_resize_editor();
                        });
                        c$._common_notice_add(div_id + "_sidedrawer", function (message) {
                            if (message === c$.NCMessage.onSidedrawerHide || message === c$.NCMessage
                                    .onSidedrawerShow) {
                                (message === c$.NCMessage.onSidedrawerHide) ? $('#sidedrawer').hide() :
                                    $('#sidedrawer').show();
                                _p_common_resize_editor();
                            }


                        })

                        next && next();
                    }

                })
                .done(function () {
                    $Router.fn_showOrHide(allPageList, false);
                    $Router.fn_showOrHide([thisPage], true,
                        false,
                        function () {
                            /**
                             * 修正编辑器的尺寸
                             */
                            try {
                                var curEditor = c$.g_curWorkFileObj.assEditor;
                                curEditor.resize();
                                $EditorProvider.focus(curEditor);
                                $EditorProvider.refresh(curEditor);
                            } catch (e) {
                            }

                            //Fixed: for safari verion 5
                            try {
                                if ($.RTYWebHelper.isSafariExtend(600) ||
                                    $.RTYWebHelper.isSafariExtend(5)) {
                                    mui && mui.dropdown.initListeners();
                                }

                            } catch (e) {
                            }
                            //end Fiexed
                        });

                    window.location.href = '#';
                })


        };

        $Router.go_settings = function () {
            console.log("settings");

            c$.g_navTitle = $Util.fn_tri18n(I18N[c$.language].UI.settingsPage["Title"]);
            c$.UIActions.uiHTML_setNavTitle(c$.g_navTitle);

            var thisPage = '#view-settings';
            c$.g_current_page = thisPage;

            //===============================================================================
            // 更新标题栏右侧的工具栏
            //===============================================================================
            var $ele_header = $('#header-settings');

            function fn_update_header_ui($ele_header) {

                var htmlContent_header = template('tpl_header-settings', {
                    buttons: [{
                        name: $Util.fn_tri18n(I18N[c$.language].UI.settingsPage[
                            "Btn-reset_user_settings"]),
                        description: "重置用户设置",
                        class: "fa-rotate-left",
                        href: "#/uiactions/reset_user_settings"
                    }, {
                        name: $Util.fn_tri18n(I18N[c$.language].UI.settingsPage[
                            "Btn-save_user_settings"]),
                        description: "保存用户设置",
                        class: "fa-save",
                        href: "#/uiactions/save_user_settings"
                    }, {
                        name: $Util.fn_tri18n(I18N[c$.language].UI.settingsPage[
                            "Btn-use_default_user_settings"]),
                        description: "使用默认用户设置",
                        class: "fa-circle-o-notch",
                        href: "#/uiactions/use_default_user_settings"
                    }, {
                        name: $Util.fn_tri18n(I18N[c$.language].UI.settingsPage["Btn-Help"]),
                        description: "帮助",
                        class: "fa-question-circle",
                        href: "#/uiactions/help"
                    }]
                });
                $ele_header.html(htmlContent_header);
            }

            //=====================================================================================
            // 注册页面必须更新
            //=====================================================================================
            c$._common_notice_add(thisPage + "_header" + c$.NCMessage.mustUpdateUI, function (message) {
                if (c$.NCMessage.mustUpdateUI === message) {
                    c$.g_navTitle = $Util.fn_tri18n(I18N[c$.language].UI.settingsPage["Title"]);
                    c$.UIActions.uiHTML_setNavTitle(c$.g_navTitle);
                    fn_update_header_ui($ele_header);
                }
            });


            //======================================================================================
            fn_update_header_ui($ele_header);
            $Router.fn_updateNavRight($ele_header);


            //===============================================================================
            // 更新设置内容
            //===============================================================================
            var ele = $(thisPage);
            if ($.trim(ele.html()).length === 0) {
                var html = template('tpl_settings', {});
                ele.html(html);

                var editor = c$.go_settings_editor = new JSONEditor($("#app-settings-code")[0], {});

                //设置关联
                // 保存用户定义的设置
                c$.UIActions.saveUserSetting = function () {
                    var jsonObj = editor.get();
                    var old_data = $.objClone($UserSettings);
                    var new_data = $UserSettings.restoreCoreDataWithInfo(jsonObj);

                    //发送UserSetttings变化
                    $NoticeCenter.fire(c$.NCMessage.userSettingsChange, old_data, new_data);
                }

                // 重置用户定义设置
                c$.UIActions.resetUserSetting = function () {
                    editor.set($UserSettings.forUserCoreData());
                    editor.expandAll();
                }

                // 使用系统默认设置
                c$.UIActions.useDefaultSetting = function () {
                    var obj = $UserSettings.forDefaultcoreData();
                    var newObj = {};
                    for (var key in obj) {
                        var newKey = key.replace("default_", "");
                        newObj[newKey] = obj[key];
                    }
                    editor.set(newObj);
                    editor.expandAll();
                }
            }

            if (c$.go_settings_editor) {
                var editor = c$.go_settings_editor;
                editor.set($UserSettings.forUserCoreData());
                editor.expandAll();
            }

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);

            window.location.href = '#';
        };


        var myRoutes = {
            '/files': $Router.go_files,
            '/workspace': $Router.go_workspace,
            '/settings': $Router.go_settings,

            // 附加的处理
            '/worksace_file/:fileObjID': function (fileObjID) {
                $fc.findFile(fileObjID, function (fileObj) {
                    $Router.go_workspace(fileObj);
                });
                window.location.href = '#';
            },
            '/uiactions/:action': function (action) {
                if (action === "create_new_file") c$.UIActions.createNew();
                if (action === "impore_files") c$.UIActions.importFiles();
                if (action === "save_user_settings") c$.UIActions.saveUserSetting();
                if (action === "reset_user_settings") c$.UIActions.resetUserSetting();
                if (action === "use_default_user_settings") c$.UIActions.useDefaultSetting();
                if (action === "exportToHtml") c$.UIActions.exportAsHtml();
                if (action === "help") c$.UIActions.help();

                //=======================================================
                //重置，一遍循环使用
                //=======================================================
                window.location.href = '#';
            },
            '/uiactions_withid/?([^\/]*)\/([^\/]*)/?': function (action, id) {
                console.log('action:' + action + ",id:" + id);
                var _s_id = id.toString();

                if (action === "file_load") {
                    c$.UIActions.loadFile(_s_id);
                } else if (action === "file_save") {
                    c$.UIActions.saveFile(_s_id);
                } else if (action === "file_remove") {
                    c$.UIActions.removeFile(_s_id);
                } else if (action === "file_revealin") {
                    c$.UIActions.revealIn(_s_id);
                }
                window.location.href = '#';
            },

            // 附加工具
            '/clound_evernote/:action': function (action) {
                console.log('action:' + action);
                window.location.href = '#';
            }
        };

        // 全局路由
        c$.g_router = Router(myRoutes);
        c$.g_router.init();
        c$.g_current_page = null; // 当前所在的页面
        window.location.href = "#";

    };

    // 绑定系统Preferences菜单
    c$.bindSystemPreferencesMenu = function (cb) {

        var cbName = b$._get_callback(function (info) {
            cb && cb(info)
        }, true);

        if (b$.pN) {
            var obj = {
                menuTag: 903,
                action: cbName
            };
            b$.SystemMenus.setMenuProperty(obj);
        }
    };

    // 配置系统菜单
    c$.configSystemMenu = function (cb) {


        // File部分
        if (b$.pN) {

            //New
            b$.SystemMenus.setMenuProperty({
                menuTag: 101,
                action: b$._get_callback(function (info) {
                    window.UI.c$.UIActions.createNew();
                }, true)
            });

            //Open
            b$.SystemMenus.setMenuProperty({
                menuTag: 102,
                action: b$._get_callback(function (info) {
                    window.UI.c$.UIActions.importFiles();
                }, true)
            });

            //Save
            b$.SystemMenus.setMenuProperty({
                menuTag: 106,
                action: b$._get_callback(function (info) {
                    window.UI.c$.UIActions.saveFile();
                }, true)
            });

            //Save As
            b$.SystemMenus.setMenuProperty({
                menuTag: 107,
                action: b$._get_callback(function (info) {
                    window.UI.c$.UIActions.saveAsFile();
                }, true)
            });

            //ExportAsPdF
            b$.SystemMenus.setMenuProperty({
                menuTag: 194,
                title: "ExportAsPDF",
                action: b$._get_callback(function (info) {
                    //TODO: 创建选择对话框
                    window.UI.c$.UIActions.exportAsPDF();
                }, true)
            });


            //Print
            b$.SystemMenus.setMenuProperty({
                menuTag: 111,
                action: b$._get_callback(function (info) {
                    //TODO: 创建选择对话框
                    b$.App.print();
                }, true)
            });

            //Exit
            b$.SystemMenus.setMenuProperty({
                menuTag: 911,
                action: b$._get_callback(function (info) {
                    b$.App.terminate();
                }, true)
            });

        }


    };

    // 绑定插件引导及相关的插件
    c$.startPluginEngine = function (cb) {


        c$.plugin_callbacks = $.Callbacks(); // 注册业务逻辑回调(使用Jquery的Callbacks())
        c$.plugin_callbacks.add(cb || function (obj) {

            });

        var cbName = b$._get_callback(function (obj) {
            console.log($.obj2string(obj));
            // 声明处理插件初始化的方法
            function process_init(obj) {
                var c$ = UI.c$;
                var b$ = BS.b$;
                try {
                    if (obj.type == "type_initcoresuccess") {

                    } else if (obj.type == "type_initcorefailed") {
                        console.error('init core plugin failed!');
                    }
                } catch (e) {
                    console.error(e);
                }

            }

            // 声明处理CLI的回调处理
            function process_dylibCLI(obj) {
                var c$ = UI.c$;
                var b$ = BS.b$;

                try {
                    var infoType = obj.type;
                    if (infoType == 'type_clicall_start') {

                    } else if (infoType == 'type_clicall_reportprogress') {

                    } else if (infoType == 'type_clicall_end') {

                    }

                } catch (e) {
                    console.error(e);
                }
            }

            // 声明处理ExecCommand的方法
            function process_execCommand(obj) {
                var c$ = UI.c$;
                var b$ = BS.b$;

                try {
                    var infoType = obj.type;
                    if (infoType == 'type_addexeccommandqueue_success') {
                        var queueID = obj.queueInfo.id;
                        b$.sendQueueEvent(queueID, "execcommand", "start");
                    } else if (infoType == 'type_execcommandstart') {

                    } else if (infoType == 'type_reportexeccommandprogress') {

                    } else if (infoType == 'type_execcommandsuccess') {

                    } else if (infoType == 'type_canceledexeccommand') {

                    } else if (infoType == 'type_execcommanderror') {

                    }
                } catch (e) {
                    console.error(e);
                }

            }

            // 声明处理Task的方法
            function process_task(obj) {

                var c$ = UI.c$;
                var b$ = BS.b$;
                try {
                    var infoType = obj.type;
                    if (infoType == "type_addcalltaskqueue_success") {
                        var queueID = obj.queueInfo.id;
                        b$.sendQueueEvent(queueID, "calltask", "start");

                        c$.plugin_callbacks.fire({
                            type: '_native_task_added',
                            data: obj
                        });
                    } else if (infoType == "type_calltask_start") {
                        var queueID = obj.queueInfo.id;
                        c$.plugin_callbacks.fire({
                            type: '_native_task_started',
                            data: obj
                        });

                    } else if (infoType == "type_calltask_error") {
                        console.error($.obj2string(obj));
                        c$.plugin_callbacks.fire({
                            type: '_native_task_error',
                            data: obj
                        });

                    } else if (infoType == "type_calltask_success") {
                        console.log($.obj2string(obj));
                        c$.plugin_callbacks.fire({
                            type: '_native_task_finished',
                            data: obj
                        });

                    } else if (infoType == "type_type_calltask_cancel") {
                        console.log($.obj2string(obj));
                        c$.plugin_callbacks.fire({
                            type: '_native_task_canceled',
                            data: obj
                        });
                    }
                } catch (e) {
                    console.error(e);
                }

            }

            // 以下是调用顺序
            process_init(obj);
            process_dylibCLI(obj);
            process_execCommand(obj);
            process_task(obj);

        }, true);

        if (b$.pN) {
            b$.enablePluginCore([], cbName);
        }

    };

    // 配置UserSettings
    c$.configUserSettings = function (cb) {


        // 注册缓存数据变更的消息处理函数(来自消息中心)
        c$._common_notice_add("configUserSettings", function (message) {
            if (c$.NCMessage.userSettingsChange === message) {
                // 缓存 "user-settings-cache" 类型的内容
                // 备注: 当前，默认仅支持一个，使用default 作为key

                var us_json = $UserSettings.coreDataToJSON();
                $Cache.update("default", "user-settings-cache", us_json);
                $Cache.save();
            }
        });

        // 查找是否有缓存的数据文件
        var cacheList = $Cache.findObjList("user-settings-cache");

        // 恢复处理
        if (cacheList.length > 0) {
            $.each(cacheList, function (index, cacheObj) {
                var us_json = cacheObj.value;
                $UserSettings.coreDataFromJSON(us_json);
                return false; // 默认使用一个，后期，升级的时候，可以加入导入settings的设计
            });
        }

    };


    // 当关闭的时候
    c$.configWhenQuit = function (cb) {

        /**
         * http://electron.atom.io/docs/api/browser-window/
         *Event: ‘close’
         Returns:

         event Event
         Emitted when the window is going to be closed. It’s emitted before the beforeunload and unload event of the DOM. Calling event.preventDefault() will cancel the close.

         Usually you would want to use the beforeunload handler to decide whether the window should be closed, which will also be called when the window is reloaded. In Electron, returning any value other than undefined would cancel the close. For example:

         window.onbeforeunload = (e) => {
              console.log('I do not want to be closed');

              // Unlike usual browsers that a message box will be prompted to users, returning
              // a non-void value will silently cancel the close.
              // It is recommended to use the dialog API to let the user confirm closing the
              // application.
              e.returnValue = false;
            };
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        window.onbeforeunload = function (e) {
            // 提示并选择是否保存
            var bValue = c$.UIActions.detectFilesStateAndSaveWhenAppQuit();

            //Fixed: 修正，点击窗体没有正确退出的问题, 想要正确退出，不要给e.returnValue 赋值
            if (!bValue) {
                e.returnValue = bValue;
            }
        };

    };

    // 启动
    c$.launch = function () {


        var deferred = $.Deferred();

        c$.configUtil();
        c$.initTitleAndVersion();
        c$.configCache();
        c$.configNoticeCenter();
        c$.configUserSettings();

        deferred.done(function () {
            c$.configUIActions();
            c$.configSideDrawer();
            c$.configRoute();
            c$.configSystemMenu();
            c$.setupUI();
            c$.checkUpdate();
            c$.configWhenQuit();

        });

        c$.configInternationalization(deferred);


    };


}());
