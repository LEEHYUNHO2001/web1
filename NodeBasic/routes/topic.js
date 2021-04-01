var express = require('express');
var router = express.Router()
const path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var bodyParser = require('body-parser');
var login = require('../Cookie/loginpassport.js');
var comment = require('../lib/comment.js');
var shortid = require('shortid');
var db = require('../lib/db');

router.use(bodyParser.urlencoded({extended: false}));

//create
router.get('/create', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
        var title = 'Web - create';
        var list = template.list(request.list);
        var html = template.HTML(title, list,`
        <form action="/topic/create_process"
        method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>               
        `, 
        '',
        login.authStatusUI(request ,response));
        response.send(html);     
});

//create submit -> data directory에 저장
router.post('/create_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    db.get('topics').push({
        id:id,
        title:title,
        description:description,
        user_id:request.user.id
    }).write();
    response.redirect(`/topic/${id}`);
});

//update
router.get('/update/:pageId', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;} 
    var topic = db.get('topics').find({id:request.params.pageId}).value();

    //접근제어
    if(topic.user_id != request.user.id){
        //request.flash('error','다른 사람의 글입니다.');
        return response.redirect('/');
    }
    var title = topic.title;
    var description = topic.description;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
        <form action="/topic/update_process"
        method="post">
            <input type="hidden" name="id" value="${topic.id}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
                <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>  
        `,
        `<a href="/topic/create">create</a>
        <a href="/topic/update/${topic.id}">update</a>`,
    login.authStatusUI(request ,response));
    response.send(html);
});

//data directory read -> update 후 write
router.post('/update_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = post.id;
    var topic = db.get('topics').find({id:id}).value();

    db.get('topics').find({id:id}).assign({
        title:title, description:description
    }).write();
    response.redirect(`/topic/${topic.id}`);

});

//data directory read -> unliink
router.post('/delete_process', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
    var post = request.body;
    var id = post.id;
    var topic = db.get('topics').find({id:id}).value();

    //접근제어
    if(topic.user_id != request.user.id){
        //request.flash('error','다른 사람의 글입니다.');
        return response.redirect('/');
    }
    db.get('topics').remove({id:id}).write();
    response.redirect('/');
});

//Home else
router.get('/:pageId', (request, response, next) => {
    var topic = db.get('topics').find({id:request.params.pageId}).value();
    var user = db.get('users') .find({id:topic.user_id}).value();
    var sanitizeTitle = sanitizeHtml(topic.title);
    var sanitizeDescription = sanitizeHtml(topic.description, {allowedTags:['h1']});
    var list = template.list(request.list);
    var html = template.HTML(sanitizeTitle, list,
        comment.commentUI(request, response)
        ,
        `<a href="/topic/create/">글쓰기</a>
        <a href="/topic/update/${topic.id}">글수정</a>

        <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${topic.id}">
            <input type="submit" value="글삭제">
        </form>`,
        login.authStatusUI(request ,response));
    response.send(html);    
});

//comment
router.post('/comment_process', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;} 

    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = post.id;
    db.get('comments').push({
        id:id, // 글 제목 id
        title:title,
        description:description,
        user_id:request.user.id, // 작성자 id
        nickname:request.user.nickname  //작성자 닉네임
    }).write();
    response.redirect(`/topic/${id}`);
    

});

module.exports = router;
