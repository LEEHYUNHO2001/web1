//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

module.exports = {
    //login check    
    authIsOwner : function(request, response){
        if(request.user){
            return true;
        } else{
            return false;
        }
    },

    //search Nickname
    Nickname : async function(request){
        const userNick = `SELECT nickname FROM users WHERE id='${request.user}';`
        var clientquery = await client.query(userNick);
        var nickname = await clientquery.rows[0].nickname;
        return nickname
    },

    //logout (login status)
    authStatusUI : async function(request, response){
        var authStatusUI = '<a href="/auth/login">로그인</a> | <a href="/customer/register">회원가입</a>';
        
        if(this.authIsOwner(request, response)){ 
            var nickname = await this.Nickname(request)
            authStatusUI = `닉네임 : ${nickname} <br><a href="/auth/logout">로그아웃</a>`;
        }
        return authStatusUI;
    },

    //login 접근 제어
    loginRequire : function(request, response){
        var loginRequire = true;
        if(this.authIsOwner(request, response) === false){
            loginRequire = false;
            var html = `
            <!doctype html>
            <html>
            <a href="/auth/login">로그인</a>
            <p>로그인이 필요합니다.</p>
            </html>`;
            response.send(html);
            return false;
        }
    }
}