(function() {
    var factory = function(exports) {
        var lang = {
            name: "ja",
            description: "",
            tocTitle: "目次",
            toolbar: {
                undo: "元に戻す(Ctrl+Z)",
                redo: "やり直し(Ctrl+Y)",
                bold: "太字",
                del: "取り消し線",
                italic: "斜体",
                ins: "下線",
                mark: "タイトル",
                quote: "ブロック引用",
                ucwords: "単語の最初の文字を大文字に変換します。",
                uppercase: "選択テキストを大文字に変換します。",
                lowercase: "選択テキストを小文字に変換します。",
                h1: "見出し 1",
                h2: "見出し 2",
                h3: "見出し 3",
                h4: "見出し 4",
                h5: "見出し 5",
                h6: "見出し 6",
                "list-ul": "順不同のリスト",
                "list-ol": "順序付きリスト",
                hr: "水平方向の規則",
                link: "リンク",
                "reference-link": "参照リンク",
                image: "イメージ",
                code: "インライン コード",
                "preformatted-text": "テキストのフォーマット コード ブロック (タブ インデント)/",
                "code-block": "コード ブロック (多言語)",
                table: "テーブル",
                "incomplete-task-list": "未完了タスクリスト",
                "complete-task-list": "タスクリストを完了します",
                datetime: "Datetime",
                "math": "数式",
                "flowchart": "フローチャート",
                "sequence-diagram": "シーケンス図",
                emoji: "Emoji",
                "html-entities": "HTML エンティティ」",
                pagebreak: "改ページ",
                "goto-line": "行へジャンプ",
                watch: "Unwatch",
                unwatch: "Watch",
                preview: "HTML プレビュー (shift キーを押し + ESC 出口)",
                fullscreen: "フルスクリーン (esc キーを押して終了)",
                clear: "明確な",
                search: "検索",
                help: "ヘルプ",
                theme: "テーマ",
                info: "について " + exports.title
            },
            buttons: {
                enter: "入力します",
                cancel: "キャンセル",
                close: "クローズ"
            },
            dialog: {
                link: {
                    title: "リンク",
                    url: "アドレス",
                    urlTitle: "タイトル",
                    urlEmpty: "エラー：リンクアドレスをご記入ください。"
                },
                referenceLink: {
                    title: "参考リンク",
                    name: "名",
                    url: "アドレス",
                    urlId: "ID",
                    urlTitle: "タイトル",
                    nameEmpty: "エラー：参照名を空にすることはできません。",
                    idEmpty: "エラー：参照リンクIDを記入してください。",
                    urlEmpty: "エラー：参照リンクのURLアドレスを記入してください。"
                },
                image: {
                    title: "画像",
                    url: "アドレス",
                    link: "リンク",
                    alt: "タイトル",
                    uploadButton: "アップロード",
                    imageURLEmpty: "エラー: 画像の url アドレスを空にすることはできません。",
                    uploadFileEmpty: "エラー: アップロード画像を空にすることはできません!",
                    formatNotAllowed: "エラー: はのみアップロード許可されているイメージ ファイル形式の写真ファイルをアップロードすることができます。"
                },
                preformattedText: {
                    title: "テキストをフォーマット/コード",
                    emptyAlert: "エラー: は、書式設定済みのテキストまたはコードの内容で記入してください。"
                },
                codeBlock: {
                    title: "コード ブロック",
                    selectLabel: "言語： ",
                    selectDefaultText: "コード言語を選択.",
                    otherLanguage: "他の言語",
                    unselectedLanguageAlert: "エラー: コード言語を選択してください。",
                    codeEmptyAlert: "エラー: コードの内容で記入してください。"
                },
                theme: {
                    title: "トピックを選択",
                    codeMirrorThemeLabel: "トピックエディタ：",
                    previewThemeLabel: "ツアーテーマ：",
                    btnApplyToAll: "すべてに適用"
                },
                htmlEntities: {
                    title: "HTML エンティティ"
                },
                help: {
                    title: "ヘルプ"
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
