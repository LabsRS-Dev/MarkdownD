/**
* Created by Ian on 2015/5/22.
*/

(function($) {
    class Native{
        data:any = {

        }

        constructor(){}
    }

    class UI {
        navPage:any = {
            "Files": "Datei"
            ,"Workspace": "Arbeitsplatz"
            ,"Settings": "Einrichten"
        };

        filePage:any = {
            "Title": "Dateiverwaltung"
            ,"Btn-Load": "Last"
            ,"Btn-Save": "Speichern"
            ,"Btn-Remove": "Entfernen"
            ,"Btn-New": "Neue Dateien"
            ,"Btn-RevealIn": "Reveal in the File Manager"
            ,"Btn-ImportFiles": "Datei importieren"
            ,"Btn-Help": "Online-Hilfe"
            ,"SaveDialog-Title": "Speichern als"
            ,"SaveDialog-BtnSave": "Speichern"
            ,"ImportDialog-Title": "Import .md Datei"
            ,"ImportDialog-BtnImport": "Import"

            ,createNewDocTip:{
                "Title":"Nachrichten",
                "Content": "Hat bereits die größte Anzahl des aktuellen Dokuments [{docCount}], Sie können die maximale Anzahl von Dateien zu erhöhen, um Ihren Anforderungen zu entsprechen. Jeder Kauf und erhöhen die Anzahl der Dokumente 5.",
                "btnBuy": "Kauf",
                "btnCancel": "Stornieren"
            }

            // 统一消息
            ,Message:{
                "existOnImport_message": "Datei '{path}' Ist bereits in der Arbeitsbereich..",
                "existOnImport_title":"Vorbehalt",
                "fileChangeByOther_message":"Datei '{path}' Inhaltliche Änderungen ",
                "fileChangeByOther_title":"Information",
                "fileRenamedByOther_message":"Datei '{path}' Wurde umbenannt ",
                "fileRenamedByOther_title":"Information",
                "fileDeletedByOther_message":"Datei '{path}' es wurde gelöscht",
                "fileDeletedByOther_title":"Information",
                "fileReloadConfirm_title":"Vorbehalt",
                "fileReloadConfirm_message":"lokale Dokumente '{path}' Inhalt ändert, ob sie neu zu laden?",
                "fileReloadConfirm_btnOK":"nachladen",
                "fileReloadConfirm_btnCancel":"nicht geladen",
                "filesChangeWantSaveConfirm_message":"The following files content have changed but not saved \n '{filePaths}' \n, whether to save? \n",
                "filesChangeWantSaveConfirm_saveAll": "Save all",
                "filesChangeWantSaveConfirm_dontSave": "Do not save",
                "fileExportPDFSelect_message":"Export to PDF Operation tips: \nYou can choose to export live preview (Markdown) content or you can choose to export the current operation edit view.",
                "fileExportPDFSelect_exportPreview":"Export the preview",
                "fileExportPDFSelect_exportCurrentView":"Export the view",
                "dropfileconfirm_message":"Tips: Import the file or create the file link?",
                "dropfileconfirm_import":"Import",
                "dropfileconfirm_createlink":"Create file link"

                ,"cacheResumeConfirm_message":"Ob wieder aufnehmen, die zuletzt geöffnete Datei zu bearbeiten?"
                ,"cacheResumeConfirm_restore":"Erholung"
                ,"cacheResumeConfirm_cancel":"Annulliert"

            }
        };

        workspacePage:any = {
            "Title": "Arbeitsplatz"
            ,"Btn-Help": "Online-Hilfe"
            ,"Btn-ExportToHTML": "Export To HTML"
        };

        settingsPage:any = {
            "Title": "Einrichten"
            ,"Btn-Help": "Online-Hilfe"
            ,"Btn-reset_user_settings": "Zurücksetzen von Benutzereinstellungen"
            ,"Btn-save_user_settings": "Speichern der Benutzereinstellungen"
            ,"Btn-use_default_user_settings": "Verwenden Sie die Standardbenutzereinstellungen"
        };

    constructor(){}
    }


    class Message{
    constructor(){}
    }


    class I18N {
        "de": any = {
            UI: new UI(),
            Native: new Native(),
            Message: new Message()
        }

        constructor(){}
    }

    window["I18N"] = window["I18N"] || {};
    window["I18N"] = $.extend(window["I18N"], new I18N());
})(jQuery);
