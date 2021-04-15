var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var shortid = require('shortid');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var CRUD = require('../lib/CRUD.js');
var login = require('../lib/loginstatus.js');

router.use(flash());

//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

//registerUI
router.get('/register', async (request, response) => {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
        feedback = fmsg.error;
    }
    
    response.render('register', {
        title:'register',
        feedback:feedback,
        authStatusUI:await login.LoginNick(request ,response)
    });
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
        return request.session.save(function(){
            return response.redirect('/customer/register');
        });  
    } else{
        bcrypt.hash(password, 10, function(err, hash){
            var user = {
                id:id,
                email:email,
                password:hash,
                nickname:nickname
            }
            CRUD.userDatabase(user.id, user.email, user.password, user.nickname);
            response.redirect('/');
        })
    }
});
 
module.exports = router;