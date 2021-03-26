var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

router.use(cookieParser());

//login
router.get('/login', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'login';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<form action="/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="password" placeholder="password"></p>
                <p><input type="submit"></p>
            </form>`,
            `<a href="/topic/create">create</a>`);
    response.send(html);  
    });        
});

//login submit -> 실제 password와 비교 -> 일치하면 쿠키로 정보 구움
router.post('/login_process', (request, response) => {
    var post = request.body;
    if(post.email === 'dlgusgh2001@naver.com' && post.password === '1111'){
        response.writeHead(302, {
            'Set-Cookie':[
            `email=${post.email}`,
            `password=${post.password}`,
            `nickname=dlgusgh2001`],
            Location: `/`
        }); 
    } else {
        response.end('Who??');
    }
    response.end();
    /*response.cookie({
    'Set-Cookie':[
    `email=${post.email}`,
    `password=${post.password}`,
    `nickname=dlgusgh2001`
    ]});
    response.redirect(`/`);
    */   
});

//logout, cookie 정보 날림
router.get('/logout_process', (request, response) => {
    var post = request.body;
    response.writeHead(302, {
        'Set-Cookie':[
        `email=; Max-Age=0`,
        `password=; Max-Age=0`,
        `nickname=; Max-Age=0`],
        Location: `/`
    }); 
    response.end();
});

module.exports = router;