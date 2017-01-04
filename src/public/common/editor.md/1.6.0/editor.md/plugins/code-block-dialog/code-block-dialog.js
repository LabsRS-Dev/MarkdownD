/*!
 * Code block dialog plugin for Editor.md
 *
 * @file        code-block-dialog.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function(exports) {
        var cmEditor;
        var pluginName = "code-block-dialog";

        // for CodeBlock dialog select
        var codeLanguages = exports.codeLanguages = {
            apl: ["APL", "apl"],
            "asn.1": ["ASN.1", "asn.1"],
            asterisk: ["Asterisk dialplan", "asterisk"],
            asp: ["ASP", "vbscript"],
            actionscript: ["ActionScript(3.0)/Flash/Flex", "clike"],
            brainfuck: ["Brainfuck", "brainfuck"],
            bash: ["Bash/Bat", "shell"],
            c: ["C", "clike"],
            cpp: ["C++", "clike"],
            csharp: ["C#", "clike"],
            ceylon: ["Ceylon", "clike"],
            clojure: ["Clojure", "clojure"],
            cmake: ["CMake", "cmake"],
            cobol: ["COBOL", "cobol"],
            coffeescript: ["CoffeeScript", "coffeescript"],
            commonlisp: ["Common Lisp", "commonlisp"],
            crystal: ["Crystal", "crystal"],
            css: ["CSS", "css"],
            cypher: ["Cypher", "cypher"],
            cython: ["Cython", "python"],
            d: ["D", "d"],
            dart: ["Dart", "dart"],
            diff: ["Diff", "diff"],
            django: ["Django", "django"],
            dockerfile: ["Dockerfile", "dockerfile"],
            delphi: ["Delphi/Pascal", "pascal"],
            dtd: ["DTD", "dtd"],
            dylan: ["Dylan", "dylan"],
            ebnf: ["EBNF", "ebnf"],
            ecl: ["ECL", "ecl"],
            eiffel: ["Eiffel", "eiffel"],
            elm: ["Elm", "elm"],
            erlang: ["Erlang", "erlang"],
            factor: ["Factor", "factor"],
            fcl: ["FCL", "fcl"],
            forth: ["Forth", "forth"],
            fortran: ["Fortran", "fortran"],
            fsharp: ["F#", "mllike"],
            gas: ["Gas", "gas"],
            gherkin: ["Gherkin", "gherkin"],
            go: ["Golang", "go"],
            groovy: ["Groovy", "groovy"],
            haml: ["HAML", "haml"],
            handlebars: ["Handlebars", "handlebars"],
            haskell: ["Haskell", "haskell"],
            haxe: ["Haxe", "haxe"],
            html: ["HTML", "htmlembedded"],
            http: ["HTTP", "http"],
            idl: ["IDL", "idl"],
            java: ["Java", "clike"],
            jade: ["Jade", "jade"],
            json: ["JSON", "javascript"],
            javascript: ["Javascript", "javascript"],
            jsx: ["Javascript(JSX)", "jsx"],
            jinja2: ["JinJa2", "jinja2"],
            julia: ["Julia", "julia"],
            less: ["LESS", "css"],
            livescript: ["LiveScript", "livescript"],
            lua: ["Lua", "lua"],
            markdown: ["Markdown", "gfm"],
            mathematica: ["Mathematica", "mathematica"],
            mbox: ["mbox", "mbox"],
            mirc: ["mIRC", "mirc"],
            modelica: ["Modelica", "modelica"],
            mscgen: ["MscGen", "mscgen"],
            numps: ["MUMPS", "numps"],
            nginx: ["Nginx", "nginx"],
            nsis: ["NSIS", "nsis"],
            ntriples: ["NTriples", "ntriples"],
            "objective-c": ["Objective-C", "clike"],
            OCaml: ["OCaml", "mllike"],
            Octave: ["Octave (MATLAB)", "octave"],
            Oz: ["Oz", "oz"],
            php: ["PHP", "php"],
            perl: ["Perl", "perl"],
            python: ["Python", "python"],
            powershell: ["PowerShell", "powershell"],
            properties: ["Properties", "properties"],
            protobuf: ["ProtoBuf", "protobuf"],
            puppet: ["Puppet", "puppet"],
            q: ["Q", "q"],
            r: ["R", "r"],
            rpm: ["RPM", "rpm"],
            rst: ["reStructedText", "rst"],
            ruby: ["Ruby", "ruby"],
            sql: ["SQL", "sql"],
            sas: ["SAS", "sas"],
            sass: ["SASS/SCSS", "sass"],
            spreadsheet: ["Spreadsheet", "spreadsheet"],
            shell: ["Shell", "shell"],
            scala: ["Scala", "clike"],
            swift: ["Swift", "swift"],
            smalltalk: ["Smalltalk", "smalltalk"],
            sTeX: ["sTeX/LaTeX", "stex"],
            tcl: ["Tcl", "tcl"],
            textile: ["Textile", "textile"],
            tiddlywiki: ["Tiddlywiki", "tiddlywiki"],
            tiki: ["Tiki wiki", "tiki"],
            toml: ["TOML", "toml"],
            tornado: ["Tornado", "tornado"],
            vb: ["VB.net/VB/VBScript", "vb"],
            vhdl: ["VHDL", "vhdl"],
            vue: ["Vue.js/template", "vue"],
            xml: ["XML", "xml"],
            xquery: ["XQuey", "xquery"],
            yacas: ["Yacas", "yacas"],
            yaml: ["YAML", "yaml"],
            "yaml-frontmatter": ["YAML frontmatter", "yaml-frontmatter"],
            "z80": ["Z80", "z80"]
        };

        exports.fn.codeBlockDialog = function() {

            var _this = this;
            var cm = this.cm;
            var lang = this.lang;
            var editor = this.editor;
            var settings = this.settings;
            var cursor = cm.getCursor();
            var selection = cm.getSelection();
            var classPrefix = this.classPrefix;
            var dialogName = classPrefix + pluginName,
                dialog;
            var dialogLang = lang.dialog.codeBlock;

            cm.focus();

            if (editor.find("." + dialogName).length > 0) {
                dialog = editor.find("." + dialogName);
                dialog.find("option:first").attr("selected", "selected");
                dialog.find("textarea").val(selection);

                this.dialogShowMask(dialog);
                this.dialogLockScreen();
                dialog.show();
            } else {
                var dialogHTML = "<div class=\"" + classPrefix + "code-toolbar\">" +
                    dialogLang.selectLabel + "<select><option selected=\"selected\" value=\"\">" +
                    dialogLang.selectDefaultText + "</option></select>" +
                    "</div>" +
                    "<textarea placeholder=\"coding now....\" style=\"display:none;\">" + selection +
                    "</textarea>";

                dialog = this.createDialog({
                    name: dialogName,
                    title: dialogLang.title,
                    width: 780,
                    height: 565,
                    mask: settings.dialogShowMask,
                    drag: settings.dialogDraggable,
                    content: dialogHTML,
                    lockScreen: settings.dialogLockScreen,
                    maskStyle: {
                        opacity: settings.dialogMaskOpacity,
                        backgroundColor: settings.dialogMaskBgColor
                    },
                    buttons: {
                        enter: [lang.buttons.enter, function() {
                            var codeTexts = this.find("textarea").val();
                            var langName = this.find("select").val();

                            if (langName === "") {
                                alert(lang.dialog.codeBlock.unselectedLanguageAlert);
                                return false;
                            }

                            if (codeTexts === "") {
                                alert(lang.dialog.codeBlock.codeEmptyAlert);
                                return false;
                            }

                            langName = (langName === "other") ? "" : langName;

                            cm.replaceSelection(["```" + langName, codeTexts, "```"].join(
                                "\n"));

                            if (langName === "") {
                                cm.setCursor(cursor.line, cursor.ch + 3);
                            }

                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }],
                        cancel: [lang.buttons.cancel, function() {
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    }
                });
            }

            var langSelect = dialog.find("select");

            if (langSelect.find("option").length === 1) {
                for (var key in codeLanguages) {
                    var codeLang = codeLanguages[key];
                    langSelect.append("<option value=\"" + key + "\" mode=\"" + codeLang[1] + "\">" +
                        codeLang[0] + "</option>");
                }

                langSelect.append("<option value=\"other\">" + dialogLang.otherLanguage + "</option>");
            }

            var mode = langSelect.find("option:selected").attr("mode");

            var cmConfig = {
                mode: (mode) ? mode : "text/html",
                theme: settings.theme,
                tabSize: 4,
                autofocus: true,
                autoCloseTags: true,
                indentUnit: 4,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {
                    "Ctrl-Q": function(cm) {
                        cm.foldCode(cm.getCursor());
                    }
                },
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets: true,
                indentWithTabs: true,
                styleActiveLine: true,
                styleSelectedText: true,
                autoCloseBrackets: true,
                showTrailingSpace: true,
                highlightSelectionMatches: true
            };

            var textarea = dialog.find("textarea");
            var cmObj = dialog.find(".CodeMirror");

            if (dialog.find(".CodeMirror").length < 1) {
                cmEditor = exports.$CodeMirror.fromTextArea(textarea[0], cmConfig);
                cmObj = dialog.find(".CodeMirror");

                cmObj.css({
                    "float": "none",
                    margin: "8px 0",
                    border: "1px solid #ddd",
                    fontSize: settings.fontSize,
                    width: "100%",
                    height: "390px"
                });

                cmEditor.on("change", function(cm) {
                    textarea.val(cm.getValue());
                });
            } else {

                cmEditor.setValue(cm.getSelection());
            }

            langSelect.change(function() {
                var _mode = $(this).find("option:selected").attr("mode");
                cmEditor.setOption("mode", _mode);
            });
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
