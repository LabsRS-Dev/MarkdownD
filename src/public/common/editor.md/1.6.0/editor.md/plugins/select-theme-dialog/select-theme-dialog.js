(function() {

    var factory = function(exports) {

        var pluginName = "select-theme-dialog";

        /**
         * [codeMirrorThemes 主题样式，需要通过使用setCodeMirrorTheme 函数来设置]
         * @type {Object}
         */
        var codeMirrorThemes = [
            "default",
            "3024-day",
            "3024-night",
            "abcdef",
            "ambiance-mobile",
            "ambiance",
            "base16-dark",
            "base16-light",
            "bespin",
            "blackboard",
            "cobalt",
            "colorforth",
            "dracula",
            "eclipse",
            "elegant",
            "erlang-dark",
            "hopscotch",
            "icecoder",
            "isotope",
            "lesser-dark",
            "liquibyte",
            "material",
            "mbo",
            "mdn-like",
            "midnight",
            "monokai",
            "neat",
            "neo",
            "night",
            "paraiso-dark",
            "paraiso-light",
            "pastel-on-dark",
            "railscasts",
            "rubyblue",
            "seti",
            "solarized",
            "the-matrix",
            "tomorrow-night-bright",
            "tomorrow-night-eighties",
            "ttcn",
            "twilight",
            "vibrant-ink",
            "xq-dark",
            "xq-light",
            "yeti",
            "zenburn"
        ];

        /**
         * [themes EditorMd 整体样式]
         * @type {Object}
         */
        var themes = {

        };



        /**
         * [previewThemes 预览窗口的主题样式，需要使用setPreviewTheme来设置]
         * @type {Object}
         */
        var previewThemes = {

        };



        exports.fn.themeDialog = function() {

            var _this = this;
            var cm = this.cm;
            var editor = this.editor;
            var settings = this.settings;
            var selection = cm.getSelection();
            var lang = this.lang;
            var dialogLang = lang.dialog.theme;
            var classPrefix = this.classPrefix;
            var dialogName = classPrefix + pluginName,
                dialog;

            cm.focus();


            var default_Url = "http://romanysoft.github.io/MarkdownD/";
            var _cureEditorTheme = cm.getOption("theme"),
                _lastEditorTheme = _cureEditorTheme;


            function updateUI(dialog) {
                /// Update editor Select
                var $editorThemeSelect = dialog.find("select[data-codemirror]");
                $editorThemeSelect.html("");
                for (var index in codeMirrorThemes) {
                    var theme = codeMirrorThemes[index];
                    if (_cureEditorTheme === theme) {
                        $editorThemeSelect.append("<option selected=\"selected\" value=\"" + theme +
                            "\" mode=\"" + theme + "\">" +
                            theme + "</option>");
                    } else {
                        $editorThemeSelect.append("<option value=\"" + theme + "\" mode=\"" + theme +
                            "\">" +
                            theme + "</option>");
                    }
                }

                $editorThemeSelect.change(function() {
                    var _mode = $(this).find("option:selected").attr("mode");
                    console.log(_mode);
                    try {
                        _this.setCodeMirrorTheme(_mode);
                        _lastEditorTheme = _mode;
                    } catch (e) {
                        _this.setCodeMirrorTheme("_lastEditorTheme");
                    }
                })

                /// Update prevew select
                ///
            }

            if (editor.find("." + dialogName).length > 0) {
                dialog = editor.find("." + dialogName);
                updateUI(dialog);

                this.dialogShowMask(dialog);
                this.dialogLockScreen();
                dialog.show();
            } else {
                var dialogHTML = "<div class=\"" + classPrefix + "theme-toolbar\">" +
                    "<label>" + dialogLang.codeMirrorThemeLabel + "</label>" +
                    "<select data-codemirror></select>" +
                    // "<br/>" +
                    // "<label>" + dialogLang.previewThemeLabel + "</label>" +
                    // "<select data-preview><option selected=\"selected\" value=\"\">" + dialogLang.selectDefaultText +
                    // "</option></select>" +
                    "</div>";

                dialog = this.createDialog({
                    title: dialogLang.title,
                    width: 380,
                    height: 200,
                    content: dialogHTML,
                    mask: settings.dialogShowMask,
                    drag: settings.dialogDraggable,
                    lockScreen: settings.dialogLockScreen,
                    maskStyle: {
                        opacity: settings.dialogMaskOpacity,
                        backgroundColor: settings.dialogMaskBgColor
                    },
                    buttons: {
                        enter: [dialogLang.btnApplyToAll, function() {

                            var toAllEditor = true;
                            try {
                                _this.setCodeMirrorTheme(_lastEditorTheme, toAllEditor);
                            } catch (e) {}

                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }],
                        cancel: [lang.buttons.cancel, function() {
                            if (_lastEditorTheme !== _cureEditorTheme) {
                                _this.setCodeMirrorTheme(_cureEditorTheme);
                            }
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }],
                        close: [lang.buttons.close, function() {
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }]
                    }
                });

                updateUI(dialog);
            }



        };

    };

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = factory;
    } else if (typeof define === "function") // AMD/CMD/Sea.js
    {
        if (define.amd) { // for Require.js

            define(["editormd"], function(editormd) {
                factory(editormd);
            });

        } else { // for Sea.js
            define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
        }
    } else {
        factory(window.editormd);
    }

})();
