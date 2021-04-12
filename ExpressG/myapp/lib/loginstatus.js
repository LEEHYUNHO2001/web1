//pg
const {Client} = require('pg');
const Query = require('pg').Query
const config = require('../lib/config.js');
var client = new Client(config)

module.exports = {
    //login check    
    authIsOwner : function(request, response){
        if(request.user){
            return true;
        } else{
            return false;
        }
    }/*,

    //search Nickname
    Nickname : function(request){
        return new Promise((resolve, reject) => {
            var userquery = new Query(`SELECT nickname FROM users WHERE id='${request.user}'`);
            client.query(userquery, (err, res) => {
                if (err){
                    console.log(err);
                    reject(err);
                } else{
                    resolve(res.rows[0]);
                }

            })
        })
    }*/,

    //logout (login status)
    authStatusUI : function(request, response){
        var authStatusUI = '<a href="/auth/login">로그인</a> | <a href="/customer/register">회원가입</a>';
       /* var nickname = this.Nickname(request)
            .then((nickname) => {
                console.log('닉네임 : ',nickname)
            })
            .catch((err) => {
                console.log(err)
                return false
            })*/
        if(this.authIsOwner(request, response)){ 
            authStatusUI = `사용자id값 : ${request.user} <br><a href="/auth/logout">로그아웃</a>`;
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