var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');


var authData = {
    email: 'dlgusgh2001@naver.com',
    password: '1111',
    nickname: 'dlgusgh2001'
}

//login
router.get('/login', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'login';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<form action="/auth/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="password" placeholder="password"></p>
                <p><input type="submit" value="login"></p>
            </form>`,
            '');
    response.send(html);  
    });        
});

//login submit -> if가 참이면 정보 저장 후 home로 리다이렉션
router.post('/login_process', (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    if(email === authData.email && password === authData.password){
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        request.session.save(function(){
        response.redirect('/');
        });
    } else {
        response.send('Who??');
    }
    response.end();
});

//logout -> session delete
router.get('/logout', (request, response) => {
    request.session.destroy(function(err){
        response.redirect('/');

    });  
});
module.exports = router;