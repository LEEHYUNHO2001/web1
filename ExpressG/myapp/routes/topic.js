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
    if(!req.user){
        login.accesslogin(req, res)
    }else{
        res.locals.authIsOwner = await req.user;
        res.locals.nickname = await login.LoginNick(req);
        res.locals.title = '글쓰기';
        res.render('create');
    }
});

//create process
router.post('/create_process', (req, res) => {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    CRUD.createDatabase(id, title, description, req.user);
    res.redirect(`/topic/${id}`);
});

//update
router.get('/update/:pageId', async (req, res) => {
    if(!req.user){
        login.accesslogin(req, res)
    }else{
        const topicRedirect = `SELECT * FROM topics WHERE id = '${req.params.pageId}';`;
        var clientquery1 = await client.query(topicRedirect)
        var topicRe = clientquery1.rows[0];

        const topicquery = 'SELECT * FROM topics;';
        var clientquery2 = await client.query(topicquery)
        var topic = clientquery2.rows;

        res.locals.authIsOwner = await req.user;
        res.locals.nickname = await login.LoginNick(req)
        res.locals.filelist = topic;
        res.locals.topicRe = topicRe;
        res.render('update');
    }
});

//update process
router.post('/update_process', (req, res) => {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    var id = post.id;
    var users_id = post.users_id;

    //user 접근제어
    if(users_id != req.user){
        login.accessUser(req, res)
    } else{
        CRUD.updateDatabase(title, description, id);
        res.redirect(`/topic/${id}`);
    }          
});

//delete process
router.post('/delete_process', async (req, res) => {
    //login 접근제어
    if(!req.user){
        login.accesslogin(req, res)
    } else{
        var post = req.body;
        var id = post.id;
        var users_id = post.users_id;
        //user 접근제어
        if(users_id != req.user){
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

    res.locals.authIsOwner = await req.user;
    res.locals.sanitizeTitle = sanitizeHtml(topicRe.title);
    res.locals.sanitizeDescription = sanitizeHtml(topicRe.description, {allowedTags:['h1']});
    res.locals.topicRe = topicRe;
    res.locals.topicNickname = topicNickname;
    res.locals.filelist = topic;
    res.locals.nickname = await login.LoginNick(req)
    res.render('homeelse');

});

module.exports = router;
