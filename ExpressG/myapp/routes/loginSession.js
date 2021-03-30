var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

//session 설정
router.use(session({
    HttpOnly:true,
    //secure: true,
    secret: 'asdfasdfasdf',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
  }))

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

var passport = require('../lib/passport.js')(router);

//현재 flash가 session에 저장되지 않는 문제가 있음
router.post('/login_process',
    passport.authenticate('local', {failureFlash:true,failureRedirect: '/auth/login'}), 
    
    (request, response) => {
        request.session.save(function(){
            response.redirect('/');   
        });
    }
);

//logout -> session delete
router.get('/logout', (request, response) => {
    request.logout();
    request.session.save(function(){
        response.redirect('/');
    });  
});

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({users:[]}).write();


router.get('/register', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'register';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<form action="/auth/register_process" method="post">
                <p><input type="text" name="email" placeholder="email" value="dlgusgh2001@naver.com"></p>
                <p><input type="password" name="password" placeholder="password" value="1111"></p>
                <p><input type="password" name="password2" placeholder="password" value="1111"></p>
                <p><input type="text" name="nickname" placeholder="nick name" value="dlgusgh"></p>
                <p><input type="submit" value="register"></p>
            </form>`,
            '');
    response.send(html);  
    });        
});

router.post('/register_process', (request, response) => {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var nickname = post.nickname;
    db.get('users').push({
        email:email,
        password:password,
        nickname:nickname
    }).write();
    response.redirect('/');
});

module.exports = router;