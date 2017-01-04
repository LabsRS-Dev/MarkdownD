(function() {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function() {

    var c$ = {};
    c$ = $.extend(window.UI.c$, {});

    var b$ = BS.b$;

    c$.Global = {
        // 常量
        Constants: {
            help_www_url: "//romanysoft.github.io/MarkdownD"
        }
    }

    window.UI.c$ = c$;
}());
