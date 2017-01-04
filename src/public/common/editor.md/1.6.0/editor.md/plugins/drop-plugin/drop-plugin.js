/*!
 * Test plugin for Editor.md
 *
 * @file        test-plugin.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var $            = jQuery;           // if using module loader(Require.js/Sea.js).


		exports.fn.processDropFiles = function() {

			var _this       = this; // this == the current instance object of Editor.md

			var lang        = _this.lang;
			var settings    = _this.settings;
			var editor      = this.editor;
            var cm          = this.cm;
			var cursor      = cm.getCursor();
			var selection   = cm.getSelection();
			var classPrefix = this.classPrefix;


            cm.focus();

            ///////////////////////////////////////////////////////////////////////////
            var _configRight = false, _fileList = [];
            if(arguments.length > 1){
                _fileList = arguments[1];
                if($.type(_fileList) === "array"){
                    _configRight = true;
                }
            }

            if(!_configRight){
                console.warn("processDropFiles 缺少参数....");
            }else{
                // 分析传递的数据类型，然后进行处理
                console.log("processDropFiles 分析传递的数据类型，然后进行处理....");

                //
                $.each(_fileList, function(i, fileObj){
                    try {
                        var fileLink = fileObj.fileUrl;
                        var fileName = fileObj.fileName;

                        cm.setCursor(cursor.line, cursor.ch + 1);
                        //Image
                        if($.inArray(fileObj.extension, settings.imageFormats) > -1){
                            cm.replaceSelection("![" + fileName + "](" +　fileLink + ")");
                        //OtherFile
                        }else{
                            cm.replaceSelection("[" + fileName + "](" +　fileLink + ")");
                        }
                    } catch (e) {
                        console.error(e);
                    } finally {
                        
                    }


                });



            }



			//....


		};

	};

	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
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
	}
	else
	{
        factory(window.editormd);
	}

})();
