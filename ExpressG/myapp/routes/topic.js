var express = require('express');
var router = express.Router()
const path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var bodyParser = require('body-parser');
var login = require('../lib/loginstatus.js');
var CRUD = require('../lib/CRUD.js');
var shortid = require('shortid');
var body = require('../lib/body.js')

router.use(bodyParser.urlencoded({extended: false}));

//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

//create
router.get('/create', async (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
        var title = 'Web - create';
        var html = template.HTML(title, '',body.create(), '',
        await login.authStatusUI(request ,response));
        response.send(html);  
});

//create process
router.post('/create_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    console.log(request)
    CRUD.createDatabase(id, title, description, request.user);
    response.redirect(`/topic/${id}`);
});


//update
router.get('/update/:pageId', async (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;} 

    const topicRedirect = `SELECT * FROM topics WHERE id = '${request.params.pageId}';`;
    var clientquery1 = await client.query(topicRedirect)
    var topicRe = clientquery1.rows[0];

    const topicquery = 'SELECT * FROM topics;';
    var clientquery2 = await client.query(topicquery)
    var topic = clientquery2.rows;

    var title = topicRe.title;
    var description = topicRe.description;
    var list = template.list(topic);
    var html = template.HTML(title, list,body.update(topicRe),
        `<a href="/topic/create">글쓰기</a>
        <a href="/topic/update/${topicRe.id}">글수정</a>`,
        await login.authStatusUI(request ,response));
    response.send(html);
});

//update process
router.post('/update_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = post.id;
    var users_id = post.users_id;
    if(users_id != request.user){
        return response.redirect(`/topic/${id}`);
    }
    CRUD.updateDatabase(title, description, id);
    response.redirect(`/topic/${id}`);
              
});

//delete process
router.post('/delete_process', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
    var post = request.body;
    var id = post.id;
    var users_id = post.users_id;
    //user 접근제어
    if(users_id != request.user){
        return response.redirect(`/topic/${id}`);
    }
    CRUD.deleteDatabase(id);
    response.redirect('/');
});

//Home else
router.get('/:pageId', async (request, response) => {
    const topicRedirect = `SELECT * FROM topics WHERE id = '${request.params.pageId}';`;
    var clientquery1 = await client.query(topicRedirect)
    var topicRe = clientquery1.rows[0];

    const topicquery = 'SELECT * FROM topics;';
    var clientquery2 = await client.query(topicquery)
    var topic = clientquery2.rows;

    const topicNick = `SELECT nickname FROM users WHERE id='${topicRe.users_id}';`;
    var clientquery3 = await client.query(topicNick);
    var nickname = clientquery3.rows[0].nickname;

    var sanitizeTitle = sanitizeHtml(topicRe.title);
    var sanitizeDescription = sanitizeHtml(topicRe.description, {allowedTags:['h1']});
    var list = template.list(topic);
    var html = template.HTML(sanitizeTitle, list,
        `<h2>${sanitizeTitle}</h2>${sanitizeDescription}
        <p>닉네임 : ${nickname}</p>`,body.homeelse(topicRe),
        await login.authStatusUI(request ,response));
    response.send(html);
});

module.exports = router;
