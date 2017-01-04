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
                "Files": "Files",
                "Workspace": "Workspace",
                "Settings": "Settings"
            };
            this.filePage = {
                "Title": "Files",
                "Btn-Load": "Edit",
                "Btn-Save": "Save",
                "Btn-SaveAs": "Save as",
                "Btn-Remove": "Remove",
                "Btn-Export": "Export",
                "Btn-New": "New File",
                "Btn-RevealIn": "Reveal in the File Manager",
                "Btn-ImportFiles": "Import Files",
                "Btn-Help": "Online help",
                "SaveDialog-Title": "Save as",
                "SaveDialog-BtnSave": "Save",
                "ImportDialog-Title": "Open markdown files",
                "ImportDialog-BtnImport": "Open",
                createNewDocTip: {
                    "Title": "Message",
                    "Content": "Already have the largest number of the current document [{docCount}], you could increase the maximum number of documents to meet your requirements.Every purchase, increased 5 documents.",
                    "btnBuy": "Buy",
                    "btnCancel": "Cancel"
                },
                Message: {
                    "existOnImport_message": "The file '{path}' is already in workspace..",
                    "existOnImport_title": "Warning",
                    "fileChangeByOther_message": "The file '{path}' contents has changed ",
                    "fileChangeByOther_title": "Information",
                    "fileRenamedByOther_message": "The file '{path}' has renamed ",
                    "fileRenamedByOther_title": "Information",
                    "fileDeletedByOther_message": "The file '{path}' has deleted ",
                    "fileDeletedByOther_title": "Information",
                    "fileReloadConfirm_title": "Warning",
                    "fileReloadConfirm_message": "The local file '{path}' content has changed, whether to reload?",
                    "fileReloadConfirm_btnOK": "Reload",
                    "fileReloadConfirm_btnCancel": "Don't Reload",
                    "filesChangeWantSaveConfirm_message": "The following files content have changed but not saved \n '{filePaths}' \n, whether to save? \n",
                    "filesChangeWantSaveConfirm_saveAll": "Save all",
                    "filesChangeWantSaveConfirm_dontSave": "Do not save",
                    "fileExportPDFSelect_message": "Export to PDF Operation tips: \nYou can choose to export live preview (Markdown) content or you can choose to export the current operation edit view.",
                    "fileExportPDFSelect_exportPreview": "Export the preview",
                    "fileExportPDFSelect_exportCurrentView": "Export the view",
                    "dropfileconfirm_message": "Tips: Import the file or create the file link?",
                    "dropfileconfirm_import": "Import",
                    "dropfileconfirm_createlink": "Create file link",
                    "cacheResumeConfirm_message": "Whether to resume editing the last opened file?",
                    "cacheResumeConfirm_restore": "Resume",
                    "cacheResumeConfirm_cancel": "Cancel"
                }
            };
            this.workspacePage = {
                "Title": "Workspace",
                "Btn-Help": "Online help",
                "Btn-ExportToHTML": "Export To HTML"
            };
            this.settingsPage = {
                "Title": "Settings",
                "Btn-reset_user_settings": "Reset user settings",
                "Btn-save_user_settings": "Save user Settings",
                "Btn-use_default_user_settings": "Use the default user settings",
                "Btn-Help": "Online help"
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
            this["en"] = {
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
//# sourceMappingURL=en.js.map