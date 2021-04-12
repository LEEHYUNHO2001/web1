var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var shortid = require('shortid');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');

router.use(flash());

//session 설정
router.use(session({
    HttpOnly:true,
    //secure: true,
    secret: 'asdfasdfasdf',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
  }))
 
//pg
const {Client} = require('pg');
const Query = require('pg').Query
const config = require('../lib/config.js');
var client = new Client(config)

client.connect(err => { 
    if (err) { 
        console.error('회원가입 pg 연결 실패', err.stack)
    } else { 
        console.log('연결 성공')
    } 
});

function userDatabase(id, email, password, nickname){
    const userquery = new Query(`
    CREATE TABLE IF NOT EXISTS users (id VARCHAR(50), email VARCHAR(25), password VARCHAR(100), nickname VARCHAR(10));
    INSERT INTO users (id, email, password, nickname) VALUES('${id}', '${email}', '${password}', '${nickname}')`);
    client.query(userquery)
}

//registerUI
router.get('/register', (request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success){
        feedback = fmsg.success[0];
    } else if(fmsg.error){
        feedback.error[0];
    }

    var title = 'register';
    var html = template.HTML(title, '',
        `<div style="color:red;">${feedback}</div>
        <form action="/customer/register_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="password2" placeholder="password"></p>
            <p><input type="text" name="nickname" placeholder="nick name"></p>
            <p><input type="submit" value="register"></p>
        </form>`,
        '');
    response.send(html);  
      
});

router.post('/register_process', (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var nickname = post.nickname;
    var id=shortid.generate();
    
    if(password != password2){
        request.flash('error', '비밀번호가 다릅니다.');
        request.session.save(function(){
            response.redirect('/customer/register');
        });  
    } else{
        bcrypt.hash(password, 10, function(err, hash){
            var user = {
                id:id,
                email:email,
                password:hash,
                nickname:nickname
            }
            userDatabase(user.id, user.email, user.password, user.nickname);
            response.redirect('/');
        })
    }
});
 
module.exports = router;