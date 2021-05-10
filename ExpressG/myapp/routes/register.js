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
router.get('/register', async (req, res) => {
    try{
        //flash사용
        var fmsg = req.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error;
        }
        
        res.render('CRUD/register', {
            title:'회원가입',
            feedback:feedback,
            authStatusUI:await login.LoginNick(req ,res)
        });
    } catch(err){
        console.log('registerUI에러', err);
    }
});

router.post('/register_process', (req, res) => {
    try{
        var post = req.body;
        var email = post.email;
        var password = post.password;
        var password2 = post.password2;
        var nickname = post.nickname;
        var id=shortid.generate();
        
        if(password != password2){
            req.flash('error', '비밀번호가 다릅니다.');
            return req.session.save(() => {
                return res.redirect('/customer/register');
            });  
        } else{
            bcrypt.hash(password, 10, (err, hash) => {
                var user = {
                    id:id,
                    email:email,
                    password:hash,
                    nickname:nickname
                }
                CRUD.userDatabase(user.id, user.email, user.password, user.nickname);
                res.redirect('/');
            })
        }
    } catch(err){
        console.log('register_process에러', err);
    }
});
 
module.exports = router;