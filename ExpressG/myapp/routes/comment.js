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

//create
router.get('/create', async (req, res) => {
    try{
        var loginID = req.user;
        if(!loginID){
            login.accesslogin(req, res)
        }else{
            res.locals.authIsOwner = await loginID;
            res.locals.nickname = await login.LoginNick(req);
            res.locals.title = '댓글쓰기';
            res.render('CRUD/create', {
                title:'댓글쓰기',
                authIsOwner:loginID,
                nickname:await login.LoginNick(req)
            });
        }
    } catch(err){
        console.log('createUI에러', err);
    }
});

//create process
router.post('/create_process', async (req, res) => {
    try{
        var loginID =  req.user;
        var post = await req.body;
        var title = await post.title;
        var description = await post.description;
        var id = shortid.generate();
        await CRUD.createComment(id, title, description, loginID);
        res.redirect(`/`);
    } catch(err){
        console.log('create_process에러', err);
    }
});
 
module.exports = router;