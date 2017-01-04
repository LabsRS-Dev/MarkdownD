/**
 * Created by Ian on 2016/05/25
 */


///<reference path="../../typings/jquery/jquery.d.ts" />


let OAuth:any = window['OAuth']; // 外部JS引用过来的
//let Evernote:any = window['Evernote'];

/////////////////////////////////////////////////////////////////////////////////////
module RomanySoftPlugins {

    /**
     * 云端印象笔记提供的服务
     */
    interface ColundEvernoteServices{

        testRequest?() : void
    }

    /// 授权选项
    export class OAuthOptions{
        consumerKey: string;
        consumerSecret: string;
        callbackUrl: string;
        signatureMethod: string;

        constructor(json: {}){

        }
    }

    /// 实现云端印象笔记
    export class ColundEvernote implements ColundEvernoteServices{

        /// 云端服务器地址
        static debugHost: string = "https://sandbox.evernote.com";
        static releaseHost: string = "https://www.evernote.com";

        // 测试授权问题是否可以通过
        static testOAuth(){
            window.location.href = "#/clound_evernote/callback";
            let opts = new OAuthOptions({
                consumerKey: "app-romanysoft",
                consumerSecret: "502de6fdbd7744f0",
                callbackUrl: window.location.href,
                signatureMethod: "HMAC-SHA1"
            });

            window.location.href = '#';

            let assOAuth = OAuth(opts);
            assOAuth.request({'method': 'GET', 'url': this.debugHost + '/oauth', 'success': function(){
                console.log('success');
            }, 'failure': function(data){
                alert(data.text);
            }});

        }

    }
}
