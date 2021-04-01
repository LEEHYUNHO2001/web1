var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');

var passport = require('../lib/passport.js')(router);

//회원가입 UI
router.get('/register', (request, response) => {
    //flash
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success){
      feedback = fmsg.success[0];
    } else if (fmsg.error) {
        feedback = fmsg.error[0];
    }
    var title = 'register';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<div style="color:blue;">${feedback}</div>
        <form action="/auth2/register_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="password2" placeholder="password"></p>
            <p><input type="text" name="nickname" placeholder="nick name"></p>
            <p><input type="submit" value="register"></p>
        </form>`,
        '');
    response.send(html);     
});

//회원 정보 session에 저장
router.post('/register_process', (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var nickname = post.nickname;
    if(password != password2){
        request.flash('error', '비밀번호가 같아야 합니다.');
        request.session.save(function(){
            return response.redirect('/auth2/register');
        }); 
    } else{
        bcrypt.hash(password, 10, function(err, hash){
            var user = {
                id:shortid.generate(),
                email:email,
                password:hash,
                nickname:nickname
            }
            db.get('users').push(user).write();
            request.login(user, function(err){
                request.session.save(function(){
                    return response.redirect('/');
                }); 
            })
        });

    }
});

module.exports = router;