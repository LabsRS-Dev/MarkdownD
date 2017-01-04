/**
 * Created by Ian on 2016/05/25
 */
///<reference path="../../typings/jquery/jquery.d.ts" />
var OAuth = window['OAuth']; // 外部JS引用过来的
//let Evernote:any = window['Evernote'];
/////////////////////////////////////////////////////////////////////////////////////
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    /// 授权选项
    var OAuthOptions = (function () {
        function OAuthOptions(json) {
        }
        return OAuthOptions;
    }());
    RomanySoftPlugins.OAuthOptions = OAuthOptions;
    /// 实现云端印象笔记
    var ColundEvernote = (function () {
        function ColundEvernote() {
        }
        // 测试授权问题是否可以通过
        ColundEvernote.testOAuth = function () {
            window.location.href = "#/clound_evernote/callback";
            var opts = new OAuthOptions({
                consumerKey: "app-romanysoft",
                consumerSecret: "502de6fdbd7744f0",
                callbackUrl: window.location.href,
                signatureMethod: "HMAC-SHA1"
            });
            window.location.href = '#';
            var assOAuth = OAuth(opts);
            assOAuth.request({ 'method': 'GET', 'url': this.debugHost + '/oauth', 'success': function () {
                    console.log('success');
                }, 'failure': function (data) {
                    alert(data.text);
                } });
        };
        /// 云端服务器地址
        ColundEvernote.debugHost = "https://sandbox.evernote.com";
        ColundEvernote.releaseHost = "https://www.evernote.com";
        return ColundEvernote;
    }());
    RomanySoftPlugins.ColundEvernote = ColundEvernote;
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.evernote.js.map