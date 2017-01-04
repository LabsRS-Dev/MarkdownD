(function() {
    var factory = function(exports) {
        var lang = {
            name: "de",
            description: "Open-Source-online-Markdown-Editor.",
            tocTitle: "Inhaltsverzeichnis",
            toolbar: {
                undo: "Rückgängig machen(Ctrl+Z)",
                redo: "Wiederholen(Ctrl+Y)",
                bold: "Fett",
                del: "Durchgestrichen",
                italic: "Italic",
                ins: "Unterstrichen",
                mark: "Titel",
                quote: "Block-Zitat",
                ucwords: "Anfangsbuchstaben der Wörter in Großbuchstaben umwandeln",
                uppercase: "Auswahl Text in Großbuchstaben zu konvertieren",
                lowercase: "Auswahl Text in Kleinbuchstaben zu konvertieren",
                h1: "Überschrift 1",
                h2: "Überschrift 2",
                h3: "Überschrift 3",
                h4: "Überschrift 4",
                h5: "Überschrift 5",
                h6: "Überschrift 6",
                "list-ul": "Ungeordnete Liste",
                "list-ol": "Geordnete Liste",
                hr: "Horizontal rule",
                link: "Link",
                "reference-link": "Reference Link",
                image: "Bild",
                code: "Code inline",
                "preformatted-text": "Vorformatierten Text / Code-Block (Tab Gedankenstrich)",
                "code-block": "Code-Block (Multi-Sprachen)",
                table: "Tische",
                "incomplete-task-list": "Die Liste der unerledigten Aufgaben",
                "complete-task-list": "Führen Sie die Aufgabenliste ",
                datetime: "Terminzeit",
                "math": "Die mathematische Formel",
                "flowchart": "Flussdiagramm",
                "sequence-diagram": "Sequenzdiagramm",
                emoji: "Emoji",
                "html-entities": "HTML Entities",
                pagebreak: "Seitenumbruch",
                "goto-line": "Wechseln zu der Linie",
                watch: "Unwatch",
                unwatch: "Watch",
                preview: "HTML-Vorschau (Drücken Sie die Umschalttaste + Exit ESC)",
                fullscreen: "Vollbild (Ausfahrt ESC)",
                clear: "lar",
                search: "KSuche",
                help: "Hilfe",
                theme: "Thema",
                info: "über " + exports.title
            },
            buttons: {
                enter: "Eingeben",
                cancel: "Stornieren",
                close: "Schließen"
            },
            dialog: {
                link: {
                    title: "Link",
                    url: "Adresse",
                    urlTitle: "Titel",
                    urlEmpty: "Fehler: Bitte füllen Sie das Link-Adresse."
                },
                referenceLink: {
                    title: "Reference Link",
                    name: "Name",
                    url: "Adresse",
                    urlId: "ID",
                    urlTitle: "Titel",
                    nameEmpty: "Fehler: Reference Name darf nicht leer sein.",
                    idEmpty: "Fehler: Bitte füllen Sie Referenz Link-ID.",
                    urlEmpty: "Fehler: Bitte füllen Sie Referenz Link URL-Adresse."
                },
                image: {
                    title: "Bild",
                    url: "Adresse",
                    link: "Link",
                    alt: "Titel",
                    uploadButton: "Hochladen",
                    imageURLEmpty: "Fehler: Bild URL-Adresse darf nicht leer sein.",
                    uploadFileEmpty: "Fehler: Upload-Bilder darf nicht leer sein!",
                    formatNotAllowed: "Fehler: nur erlaubt es, Bilder-Datei-Upload erlaubt Bilddateiformat hochzuladen:"
                },
                preformattedText: {
                    title: "Vorformatierten Text / Codes",
                    emptyAlert: "Fehler: Bitte füllen Sie das Vorformatierter Text oder Inhalt der Codes."
                },
                codeBlock: {
                    title: "Codeblock",
                    selectLabel: "Sprachen: ",
                    selectDefaultText: "wählen Sie eine Codesprache ...",
                    otherLanguage: "andere Sprachen",
                    unselectedLanguageAlert: "Fehler: Bitte wählen Sie die Codesprache.",
                    codeEmptyAlert: "Fehler: Bitte füllen Sie das Codeinhalt."
                },
                theme: {
                    title: "Wählen Sie ein Thema",
                    codeMirrorThemeLabel: "Topic Editor:",
                    previewThemeLabel: "Tour-Themen:",
                    btnApplyToAll: "Auf alle anwenden"
                },
                htmlEntities: {
                    title: "HTML Entities"
                },
                help: {
                    title: "Hilfe"
                }
            }
        };

        exports.defaults.lang = lang;
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
                var editormd = require("../editormd");
                factory(editormd);
            });
        }
    } else {
        factory(window.editormd);
    }

})();
