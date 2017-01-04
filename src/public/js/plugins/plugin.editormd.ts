/**
 * Created by Ian on 2015/5/14.
 */

///<reference path="../../typings/jquery/jquery.d.ts" />

export namespace RomanySoftPlugins {
    const VERSION:string = "1.6.0";
    const DEFAULT_LIB_PATH:string = "common/editor.md/"+ VERSION +"/editor.md/lib/";  // 默认版本哭路径
    const DEFAULT_LANG_PATH:string = "locales/extend/editormd/";  // 默认版本路径

    const DEFAULT_TOOLBARICONS = [
        "undo", "redo", "|",
        "bold", "del", "italic", "ins", "mark", "ucwords", "uppercase", "lowercase", "|",
        "h1", "h2", "h3", "h4", "h5", "h6", "|",
        "list-ul", "list-ol", "hr", "|",
        "quote", "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table",
        "incomplete-task-list", "complete-task-list",
        "datetime","math","flowchart", "sequence-diagram",
        "emoji",
        "html-entities", "pagebreak", "|",
        "goto-line", "watch", "preview", "|",
        "theme", "|",
        "search", "clear"
    ];

    /**
     * 标准的编辑器配置
     */
    export class EditorConfig {
        constructor(){
            return {
                width: "100%",
                height: "100%"
                ,path: DEFAULT_LIB_PATH
                ,toolbarIcons: DEFAULT_TOOLBARICONS
                ,appendMarkdown: ""   // 附加的md内容


                //其他配置项
                ,theme: "" // Editor.md self themes, before v1.5.0 is CodeMirror theme, default empty
                ,editorTheme:  "colorforth" // Editor area, this is CodeMirror theme at v1.5.0
                ,previewTheme:  "" // Preview area theme, default empty
                //,pluginPath: ''           //插件路径
                //,delay: 300               //启动延时处理
                //,watch: true              //开启实时预览
                //,placeholder: ""          //默认替换文字
                //,gotoLine: true           //是否开启gotoLine的功能
                ,codeFold:  true            //是否开启代码折叠功能
                //,autoHeight: false        //是否开启自动高度
                ,autoCloseTags: true        //是否自动补全标签
                ,searchReplace:true         //是否开启查找替换功能
                //,readOnly:  false          //是否开启只读模式
                ,lineNumbers: true        //是否显示行号
                ,matchWordHighlight:  true //是否匹配文件高亮
                ,styleActiveLine:  true    //是否高亮当前行
                ,dialogLockScreen: true   //是否对话框锁住屏幕
                ,dialogShowMask: true     //是否对话框显示Mask
                //,dialogDraggable: true    //是否对话框可以拖拽
                //,dialogMaskBgColor: "#fff" //设置对话框的Mask背景颜色
                //,dialogMaskOpacity: 0.1   //设置对话框的透明度
                ,fontSize: "13px"         //设置编辑器的字体大小
                //,saveHTMLToTextarea: false //开启是否保存HTML到文本区域
                //,disabledKeyMaps: []      //屏蔽哪些快捷键

                //,imageUpload: true       //图片是否上传
                ,imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"] //至此的图片格式
                //,imageUploadURL: ""       //图片上传的URL地址
                //,crossDomainUpload: false //是否跨域上传
                //,uploadCallbackURL: ""    //图片上传的回调URL

                ,toc:  true                 //是否开启Table of contents 功能
                ,tocm:  true                //是否Using [TOCM] auto create Toc dropdown menu
                ,tocTitle: ""               //是否指定Toc dropdown menu btn
                ,tocStartLevel: 1           //指定 Said from H1 to create Toc
                //,tocContainer: ""         //指定toc的容器
                ,htmlDecode: true           //是否开启Open the HTML tag identification
                ,pageBreak: true            //是否开启解析 page break [======]
                ,atLink: true               //是否开启@link功能
                ,emailLink: true            //是否开启Email地址自动link功能
                ,taskList: true             //是否开启Github Flavored Markdown task lists
                ,emoji:true                 //是否开启emoji
                ,tex:  true                 //是否开启Tex(Latex)，based on KaTex功能
                ,flowChart:  true           //是否开启FlowChart 功能
                ,sequenceDiagram: true      //是否开启SequenceDiagram 功能
                ,previewCodeHighlight: true //是否开启预览代码高亮功能
                //,toolbar: true            //是否显示工具栏
                ,toolbarAutoFixed:  true    //工具栏是否自动填充位置


                ////////////加载Handler的处理方式
                ,beforeLoad: function(){}     //加载成功前的处理
                ,onload:function(){}     //加载成功后的处理
                ,beforeResize:function(){}   //大小发生变化前的时候
                ,onresize: function(){}   //大小发生变化的时候
                ,beforeChange:  function(){}   //内容发生变化前的时候
                ,onchange:  function(){}   //内容发生变化的时候
                ,beforeWatch:  function(){}    //实时预览的时候
                ,onwatch:  function(){}    //实时预览的时候
                ,beforeUnwatch:function(){}  //实时预览关闭的时候
                ,onunwatch:  function(){}  //实时预览关闭的时候
                ,beforePreviewing: function(){} //当预览的时候
                ,onpreviewing: function(){} //当预览的时候
                ,beforePreviewed: function(){}  //当已经预览过的时候
                ,onpreviewed: function(){}  //当已经预览过的时候
                ,beforeFullscreen: function(){}  //当全屏的时候
                ,onfullscreen: function(){}  //当全屏的时候
                ,beforeFullscreenExit: function(){} //当全屏退出的时候
                ,onfullscreenExit: function(){} //当全屏退出的时候
                ,onscroll:function(){}     //当滚动的时候
                ,onpreviewscroll: function(){} //当预览滚动的时候
            };
        }
    }


    export class EditorMdServices{
        version:string = VERSION;
        editormd:any = window["editormd"] ||{};
        default_lib_path:string = DEFAULT_LIB_PATH;  // 默认版本哭路径
        default_lang_path:string = DEFAULT_LANG_PATH;  // 默认版本路径

        getDefault_toolbarIcons(){
            return DEFAULT_TOOLBARICONS;
        }

        configEmoji(cb:Function){
            //配置emoji的. 配置 You can custom Emoji's graphics files url path
            this.editormd.emoji = {
                /// Clone https://github.com/Romanysoft/emoji-cheat-sheet.com
                path  : "https://github.com/WebpageFX/emoji-cheat-sheet.com/raw/master/public/graphics/emojis/",
                ext   : ".png"
            };

            //配置Twemoji的. Twitter Emoji (Twemoji)  graphics files url path
            this.editormd.twemoji = {
                /// Clone https://github.com/Romanysoft/twemoji
                path : "https://raw.githubusercontent.com/twitter/twemoji/gh-pages/36x36/",
                ext  : ".png"
            };
        }

        /**
         * 配置语言
         * @param lang 语言标识
         * @param cb   回调函数
         */
        configLanguage(lang:string, cb:Function){
            this.editormd.loadScript(this.default_lang_path + lang, function(){
                cb && cb();
            })
        }

        /**
         * 自定义KatexURL的源
         * @param cssUrl
         * @param jsUrl
         * @param cb
         */
        configKatexURL(cssUrl:string, jsUrl:string, cb:Function){
            this.editormd.katexURL.css = cssUrl;
            this.editormd.katexURL.js = jsUrl;
            cb && cb();
        }

        /**
         * 重新配置工具栏的函数
         * @param handlerName
         * @param newHandler
         * @param append
         */
        resetToolbarHandler(handlerName:string,  newHandler:Function, append:boolean){
            var toolbarHandlers = this.editormd.toolbarHandlers;

            if(handlerName in toolbarHandlers){
                var oldFunc = toolbarHandlers[handlerName];
                toolbarHandlers[handlerName] = function(){
                    if(append){
                        var ret = newHandler && newHandler();
                        if(false == ret){
                            oldFunc && oldFunc.call(this);
                            //eval('this.executePlugin("emojiDialog", "emoji-dialog/emoji-dialog")');
                        }
                    }else{
                        newHandler && newHandler();
                    }
                };
            }
        }

        // 获得编辑器的配置
        getEditorSettings(in_config:any){
            var _config = in_config || {};
            var _cloneConfig =  new EditorConfig();

            for(var key in _config){
                if(key in _cloneConfig){
                    _cloneConfig[key] = _config[key];
                }
            }

            return _cloneConfig;
        }

        // 更新Editor的默认设置
        updateSettings(in_settings:{}, editor: any){
            if(!editor) return null;

            var _config = in_settings || {};
            var settings = editor.settings;

            if(settings){
                for(var key in _config){
                    if(key in settings){
                        settings[key] = _config[key];

                        if(key === "editorTheme"){
                            editor.setEditorTheme(_config[key]);
                        }
                    }
                }
            }

            return editor;
        }

        /**
         * [updateToolbarUIWhenLanguageChanged 当外部语言变化时，更新EditorUI]
         * @param  {any}    editor [description]
         * @return {[type]}        [description]
         */
        updateUIWhenLanguageChanged(editor: any){
            try{
                editor.updateToolbar();
            }catch(e){
                console.error(e);
            }
        }

        /**
         * [让Editor处于焦点中]
         * @param  {any}    editor [description]
         * @return {[type]}        [description]
         */
        focus(editor:any){
            try{
                editor.focus();
            }catch(e){
                console.error(e);
            }

        }

        refresh(editor:any){
            try{
                editor.cm.refresh();
            }catch(e){
                console.error(e);
            }
        }

        /**
         * [getCodeMirror 获得CodeMirror]
         * @return {[type]} [description]
         */
        getCodeMirror(){
            return this.editormd.$CodeMirror;
        }

        createEditor(ui_ele:string, in_config:any){

            var _config = in_config || {};

            // 插件部分
            var ui_ele_editor = this.editormd(ui_ele, this.getEditorSettings(in_config));
            return ui_ele_editor;
        }

        // 获取编辑器区域的内容
        getContent(editor: any){
            return editor.getMarkdown();
        }

        // 设置编辑器区域的内容
        setContent(content: string, editor: any){
            editor.setMarkdown(content);
        }

        // 附加内容到编辑器
        appendContent(content: string, editor: any) {
            editor.appendMarkdown(content);
        }

        // 获得编辑器主题样式
        getEditorTheme(editor: any){
            var settings = editor.settings;
            return settings.editorTheme;
        }

        // 设置编辑器主题样式
        setEditorTheme(theme: string, editor: any){
            editor.setEditorTheme(theme);
        }


        /**
         * 获得当前的光标位置
         * @param editor    editormd的实例对象
         * @returns {Object}     pos 位置键值对象，例:{line:1, ch:0, xRel:1}
         */
        getCursorPosition(editor: any){
            return editor.getCursor();
        }

        /**
         * 设置光标位置
         * @param pos {Object} pos 位置键值对象，例:{line:1, ch:0, xRel:1}
         * @param editor    editormd的实例对象
         */
        setCursorPosition(pos: any, editor: any){

        }

        // 聚焦光标位
        focusCursorPosition(editor: any){
            editor.focus();
        }

        /**
         * 获取光标选中的文本范围
         * @param editor
         * @returns {Array}
         */
        getSelections(editor: any){
            return editor.getSelections();
        }

        /**
         * 设置光标选中的文本范围
         * @param ranges {Array}
         * @param editor    编辑器实例
         */
        setSelections(ranges:any, editor:any){
            editor.setSelections(ranges);
        }

        /**
         * 调整编辑器的尺寸和布局
         * @param width     宽度
         * @param height    高度
         * @param editor    编辑器实例
         */
        resize(width: number, height:number, editor:any){
            editor.resize(width, height);
        }

        /**
         * 重置编辑器的历史记录
         * @param history 历史记录对象
         * @param editor  编辑器实例
         */
        resetHistory(history: any, editor: any){
            editor.cm.history = history;
        }


        /**
         * 获取编辑器的历史
         * @param editor
         * @returns {*}
         */
        getHistory(editor: any){
            return editor.cm.history;
        }


    }
}


export default RomanySoftPlugins;
