var express = require('express');
var router = express.Router()
const path = require('path');
const fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

//create
router.get('/create', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'Web - create';
        var list = template.list(filelist);
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
        `, '');
        response.send(html);
    });      
});

//create submit -> data directory에 저장
router.post('/create_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, `utf8`, function(err){
        response.redirect(`/topic/${title}`);
    });
    /*
    var body ='';
    request.on('data', function(data){
        body=body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, `utf8`, function(err){
            response.redirect(`/page/${title}`);
        });
    });
    */
});

//update
router.get('/update/:pageId', (request, response) => {
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
                <a href="/topic/update/${title}">update</a>`
                );
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
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
        response.redirect('/');
    });  
});

//Home else
router.get('/:pageId', (request, response, next) => {
    fs.readdir('./data', function(error, filelist){         
        var filteredId = path.parse(request.params.pageId).base;          
        fs.readFile(`data/${filteredId}`, `utf8`, function(err, description){
            if(err){
                next(err);
             } else {
                var title = request.params.pageId;
                var sanitizeTitle = sanitizeHtml(title);
                var sanitizeDescription = sanitizeHtml(description, {allowedTags:['h1']});
                var list = template.list(filelist);
                var html = template.HTML(sanitizeTitle, list,
                    `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
                    `<a href="/topic/create">create</a>
                    <a href="/topic/update/${sanitizeTitle}">update</a>

                    <form action="/topic/delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizeTitle}">
                        <input type="submit" value="delete">
                    </form>`
                    );
                response.send(html); 
            }   
        });
    });           
});

module.exports = router;
