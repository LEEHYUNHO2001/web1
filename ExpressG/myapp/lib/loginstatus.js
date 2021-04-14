//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

module.exports = {
    //search Nickname
    LoginNick : async function(req){
        var nickname = false;
        if(req.user){
            const userNick = `SELECT nickname FROM users WHERE id='${req.user}';`
            var clientquery = await client.query(userNick);
            var nickname = await clientquery.rows[0].nickname;  
        }
        return nickname
    },

    //login 접근 제어
    accesslogin : async function(req, res){
        req.flash('error', '로그인이 필요한 기능입니다.');
        req.session.save(function(){
            return res.redirect("/")
        })
    },
    accessUser : async function(req, res){
        req.flash('error', '자신의 글이 아닙니다.');
        req.session.save(function(){
            return res.redirect("/")
        })
    }
}