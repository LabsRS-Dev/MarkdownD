/**
* Created by Ian on 2015/5/22.
*/
(function ($) {
    var Native = (function () {
        function Native() {
            this.data = {};
        }
        return Native;
    }());
    var UI = (function () {
        function UI() {
            this.navPage = {
                "Files": "ファイル",
                "Workspace": "ワークスペース",
                "Settings": "セットアップ"
            };
            this.filePage = {
                "Title": "ファイル管理",
                "Btn-Load": "ロード",
                "Btn-Save": "保存",
                "Btn-Remove": "削除します",
                "Btn-New": "新しいファイル",
                "Btn-RevealIn": "ファイルマネージャに表示",
                "Btn-ImportFiles": "インポートファイル",
                "Btn-Help": "オンラインヘルプ",
                "SaveDialog-Title": "名前を付けて保存",
                "SaveDialog-BtnSave": "保存",
                "ImportDialog-Title": "インポート markdown ファイル",
                "ImportDialog-BtnImport": "インポート",
                createNewDocTip: {
                    "Title": "ニュース",
                    "Content": "すでに現在のドキュメントの数が最も多いです [{docCount}], あなたは、あなたの要件に合わせてファイルの最大数を増やすことができます。それぞれの購入と文書5の数を増やします。",
                    "btnBuy": "購入",
                    "btnCancel": "キャンセル"
                },
                Message: {
                    "existOnImport_message": "ファイル '{path}' ワークスペースにすでに存在しています..",
                    "existOnImport_title": "警告",
                    "fileChangeByOther_message": "ファイル '{path}' コンテンツの変更 ",
                    "fileChangeByOther_title": "情報",
                    "fileRenamedByOther_message": "ファイル '{path}' これは、名前が変更されました ",
                    "fileRenamedByOther_title": "情報",
                    "fileDeletedByOther_message": "ファイル '{path}' 削除されました",
                    "fileDeletedByOther_title": "情報",
                    "fileReloadConfirm_title": "警告",
                    "fileReloadConfirm_message": "本地ファイル '{path}' コンテンツの変更、かどうかをリロードするには？",
                    "fileReloadConfirm_btnOK": "リロード",
                    "fileReloadConfirm_btnCancel": "ロードされていません",
                    "filesChangeWantSaveConfirm_message": "The following files content have changed but not saved \n '{filePaths}' \n, whether to save? \n",
                    "filesChangeWantSaveConfirm_saveAll": "Save all",
                    "filesChangeWantSaveConfirm_dontSave": "Do not save",
                    "fileExportPDFSelect_message": "Export to PDF Operation tips: \nYou can choose to export live preview (Markdown) content or you can choose to export the current operation edit view.",
                    "fileExportPDFSelect_exportPreview": "Export the preview",
                    "fileExportPDFSelect_exportCurrentView": "Export the view",
                    "dropfileconfirm_message": "Tips: Import the file or create the file link?",
                    "dropfileconfirm_import": "Import",
                    "dropfileconfirm_createlink": "Create file link",
                    "cacheResumeConfirm_message": "最後に開いたドキュメントを編集を再開するかどうか？",
                    "cacheResumeConfirm_restore": "回復",
                    "cacheResumeConfirm_cancel": "Cancel"
                }
            };
            this.workspacePage = {
                "Title": "ワークスペース",
                "Btn-Help": "オンラインヘルプ",
                "Btn-ExportToHTML": "Export To HTML"
            };
            this.settingsPage = {
                "Title": "セットアップ",
                "Btn-reset_user_settings": "ユーザー設定をリセット",
                "Btn-save_user_settings": "ユーザー設定を保存します",
                "Btn-use_default_user_settings": "デフォルトのユーザー設定を使用します",
                "Btn-Help": "オンラインヘルプ"
            };
        }
        return UI;
    }());
    var Message = (function () {
        function Message() {
        }
        return Message;
    }());
    var I18N = (function () {
        function I18N() {
            this["ja"] = {
                UI: new UI(),
                Native: new Native(),
                Message: new Message()
            };
        }
        return I18N;
    }());
    window["I18N"] = window["I18N"] || {};
    window["I18N"] = $.extend(window["I18N"], new I18N());
})(jQuery);
//# sourceMappingURL=ja.js.map