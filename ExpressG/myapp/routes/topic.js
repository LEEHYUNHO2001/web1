var express = require('express');
var router = express.Router()
const path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var bodyParser = require('body-parser');
var login = require('../Cookie/loginpassport.js');
var shortid = require('shortid');
var passport = require('../lib/passport.js')(router);
router.use(bodyParser.urlencoded({extended: false}));

//pg
const {Client} = require('pg');
const Query = require('pg').Query

var client = new Client({
    user : 'postgres', 
    host : 'localhost', 
    database : 'postgres', 
    password : 'ejsvkrhfo44!', 
    port : 5432,
})



//create
router.get('/create', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
        var title = 'Web - create';
        var html = template.HTML(title, '',`
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

function createDatabase(id, title, description, users_id){
    const createquery = new Query(`
    CREATE TABLE IF NOT EXISTS topics (id VARCHAR(50), title VARCHAR(25), description VARCHAR(300), users_id VARCHAR(50));
    INSERT INTO topics (id, title, description, users_id) VALUES('${id}', '${title}', '${description}', '${users_id}')`);
    client.query(createquery)
}

//create submit -> data directory에 저장
router.post('/create_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    client.connect(err => { 
        if (err) { 
            console.error('connection error', err.stack)
        } else { 
            console.log('connection good')
        }
        
    });
    createDatabase(id, title, description, request.user); 
    response.redirect(`/topic/${id}`);
});

//update
router.get('/update/:pageId', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
    fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(request.params.pageId).base;                   
        fs.readFile(`data/${filteredId}`, `utf8`, function(err, description){
            var title = request.params.pageId;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
                `
                <form action="/topic/update_process"
                method="post">
                    <input type="hidden" name="id" value="${title}">
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
                <a href="/topic/update/${title}">update</a>`,
                login.authStatusUI(request ,response));
            response.send(html);
        });
    });
});

//data directory read -> update 후 write
router.post('/update_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = post.id;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, `utf8`, function(err){
            response.redirect(`/topic/${title}`);
        });  
    });               
});

//data directory read -> unliink
router.post('/delete_process', (request, response) => {
    //login 접근 제어
    if(login.loginRequire(request, response) === false){return false;}
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
        response.redirect('/');
    });  
});

//Home else
router.get('/:pageId', (request, response, next) => {       
    const topicquery = new Query(`SELECT * FROM topics`);
    client.query(topicquery, (err, res) => {
        var topic = false;
        for(var i=0 ; i < res.rows.length ; i++){
            if(res.rows[i].id === request.params.pageId){
                topic = res.rows[i];
            }
        }
        var sanitizeTitle = sanitizeHtml(topic.title);
        var sanitizeDescription = sanitizeHtml(topic.description, {allowedTags:['h1']});
        var list = template.list(res.rows);
        var html = template.HTML(sanitizeTitle, list,
            `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
            `<a href="/topic/create/">글쓰기</a>
            <a href="/topic/update/${sanitizeTitle}">글수정</a>
    
            <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizeTitle}">
                <input type="submit" value="글삭제">
            </form>`,
            login.authStatusUI(request ,response));
        response.send(html); 
    }) 
});

module.exports = router;
