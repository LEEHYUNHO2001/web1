var express = require('express');
var router = express.Router()
const path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var login = require('../lib/loginstatus.js');
var CRUD = require('../lib/CRUD.js');
var shortid = require('shortid');
var flash = require('connect-flash');

router.use(flash());
router.use(bodyParser.urlencoded({extended: false}));

//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

//create
router.get('/create', async (req, res) => {
    var loginID = await req.user;
    if(!loginID){
        login.accesslogin(req, res)
    }else{
        res.locals.authIsOwner = await loginID;
        res.locals.nickname = await login.LoginNick(req);
        res.locals.title = '글쓰기';
        res.render('create', {
            title:'글쓰기',
            authIsOwner:await loginID,
            nickname:await login.LoginNick(req)
        });
    }
});

//create process
router.post('/create_process', async (req, res) => {
    var post = await req.body;
    var title = await post.title;
    var description = await post.description;
    var loginID = await req.user;
    var id = shortid.generate();
    CRUD.createDatabase(id, title, description, loginID);
    res.redirect(`/topic/${id}`);
});

//update
router.get('/update/:pageId', async (req, res) => {
    var loginID = await req.user;
    if(!loginID){
        login.accesslogin(req, res)
    }else{
        const topicRedirect = `SELECT * FROM topics WHERE id = '${req.params.pageId}';`;
        var clientquery1 = await client.query(topicRedirect)
        var topicRe = clientquery1.rows[0];

        const topicquery = 'SELECT * FROM topics;';
        var clientquery2 = await client.query(topicquery)
        var topic = clientquery2.rows;

        res.render('update', {
            authIsOwner:await loginID,
            nickname:await login.LoginNick(req),
            filelist:topic,
            topicRe:topicRe
        });
    }
});

//update process
router.post('/update_process', async (req, res) => {
    var post = await req.body;
    var title = await post.title;
    var description = await post.description;
    var id = await post.id;
    var users_id = await post.users_id;

    //user 접근제어
    var loginID = await req.user;
    if(users_id != loginID){
        login.accessUser(req, res)
    } else{
        CRUD.updateDatabase(title, description, id);
        res.redirect(`/topic/${id}`);
    }          
});

//delete process
router.post('/delete_process', async (req, res) => {
    //login 접근제어
    var loginID = await req.user;
    if(!loginID){
        login.accesslogin(req, res)
    } else{
        var post = await req.body;
        var id = await post.id;
        var users_id = await post.users_id;
        //user 접근제어
        if(users_id != loginID){
            login.accessUser(req, res)
        } else{
            CRUD.deleteDatabase(id);
            res.redirect('/');
        }
    }
});

//Home else
router.get('/:pageId', async (req, res) => {
    const topicRedirect = `SELECT * FROM topics WHERE id = '${req.params.pageId}';`;
    var clientquery1 = await client.query(topicRedirect)
    var topicRe = clientquery1.rows[0];

    const topicquery = 'SELECT * FROM topics;';
    var clientquery2 = await client.query(topicquery)
    var topic = clientquery2.rows;

    const topicNick = `SELECT nickname FROM users WHERE id='${topicRe.users_id}';`;
    var clientquery3 = await client.query(topicNick);
    var topicNickname = clientquery3.rows[0].nickname;
    var loginID = await req.user;

    res.render('homeelse',{
        sanitizeTitle:sanitizeHtml(topicRe.title),
        sanitizeDescription:sanitizeHtml(topicRe.description, {allowedTags:['h1']}),
        authIsOwner:await loginID,
        filelist:topic,
        topicRe:topicRe,
        topicNickname:topicNickname,
        nickname:await login.LoginNick(req)
    });
});

module.exports = router;
