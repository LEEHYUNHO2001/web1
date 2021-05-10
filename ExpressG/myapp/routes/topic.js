var express = require('express');
var router = express.Router()
const path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var login = require('../lib/loginstatus.js');
var CRUD = require('../lib/CRUD.js');
var selectQ = require('../lib/selectQ.js');
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
    try{
        var loginID = req.user;
        if(!loginID){
            login.accesslogin(req, res)
        }else{
            res.locals.authIsOwner = await loginID;
            res.locals.nickname = await login.LoginNick(req);
            res.locals.title = '글쓰기';
            res.render('CRUD/create', {
                title:'글쓰기',
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
        await CRUD.createDatabase(id, title, description, loginID);
        res.redirect(`/`);
    } catch(err){
        console.log('create_process에러', err);
    }
});

//update
router.get('/update/:pageId', async (req, res) => {
    try{
        var loginID =  req.user;
        if(!loginID){
            await login.accesslogin(req, res)
        }else{
            var topicRe = await selectQ.topicRedirect(req.params.pageId);
            var topic = await selectQ.topicquery();
    
            res.render('CRUD/update', {
                authIsOwner:loginID,
                nickname:await login.LoginNick(req),
                filelist:topic,
                topicRe:topicRe
            });
        }
    } catch(err){
        console.log('updateUI에러', err);
    }
});

//update process
router.post('/update_process', async (req, res) => {
    try{
        var post = await req.body;
        var title = await post.title;
        var description = await post.description;
        var id = await post.id;
        var users_id = await post.users_id;
    
        //user 접근제어
        var loginID =  req.user;
        if(users_id != loginID){
            await login.accessUser(req, res)
        } else{
            await CRUD.updateDatabase(title, description, id);
            res.redirect(`/topic/${id}`);
        }
    } catch(err){
        console.log('update_process에러', err);
    }          
});

//delete process
router.post('/delete_process', async (req, res) => {
    try{
        //login 접근제어
        var loginID = req.user;
        if(!loginID){
            await login.accesslogin(req, res)
        } else{
            var post = await req.body;
            var id = await post.id;
            var users_id = await post.users_id;
            
            //user 접근제어
            if(users_id != loginID){
                await login.accessUser(req, res)
            } else{
                await CRUD.deleteDatabase(id);
                res.redirect('/');
            }
        }
    } catch(err){
        console.log('delete_process에러', err)
    }
});

//Home else
router.get('/:pageId', async (req, res) => {
    try{
        var topicRe = await selectQ.topicRedirect(req.params.pageId);
        var topic = await selectQ.topicquery();
        var topicNickname = await selectQ.topicNick(topicRe);
    
        res.render('homeelse',{
            sanitizeTitle:sanitizeHtml(await topicRe.title),
            sanitizeDescription:sanitizeHtml(await topicRe.description, {allowedTags:['h1']}),
            authIsOwner:req.user,
            filelist:topic,
            topicRe:await topicRe,
            topicNickname:await topicNickname,
            nickname:await login.LoginNick(req)
                });
    } catch(err){
        console.log('Home elseUI에러', err)
    }
});

module.exports = router;
