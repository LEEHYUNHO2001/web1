const { request, response } = require('express');
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var template = require('./lib/template.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

//Home
app.get('/', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'Web';
        var description = 'Welcome Web';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
            <img src="/images/view.jpg" style="width:300px; display:block; margin-top:10px">`,
            `<a href="/create">create</a>`);
    response.send(html);  
    });                
});

//else
app.get('/page/:pageId', (request, response, next) => {
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
                    `<a href="/create">create</a>
                    <a href="/update/${sanitizeTitle}">update</a>

                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizeTitle}">
                        <input type="submit" value="delete">
                    </form>`
                    );
                response.send(html); 
            }   
        });
    });           
});
//create
app.get('/create', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'Web - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list,`
        <form action="/create_process"
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
app.post('/create_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, `utf8`, function(err){
        response.redirect(`/page/${title}`);
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
app.get('/update/:pageId', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(request.params.pageId).base;                   
        fs.readFile(`data/${filteredId}`, `utf8`, function(err, description){
            var title = request.params.pageId;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
                `
                <form action="/update_process"
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
                `<a href="/create">create</a>
                <a href="/update/${title}">update</a>`
                );
            response.send(html);
        });
    });
});
//data directory read -> update 후 write
app.post('/update_process', (request, response) => {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = post.id;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, `utf8`, function(err){
            response.redirect(`/page/${title}`);
        });  
    });               
});

//data directory read -> unliink
app.post('/delete_process', (request, response) => {
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
        response.redirect('/');
    });  
});

app.use(function(request, response, next){
    response.status(404).send('Can not page!!!');
});

app.use(function(err, request, response, next){
    console.error(err.stack);
    response.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = 
    http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname ==='/'){
            if(queryData.id === undefined){
                fs.readdir('./data', function(error, filelist){
                    var title = 'Web';
                    var description = 'Welcome Web';
                    var list = template.list(filelist);
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);  
                });                
            } else{
                fs.readdir('./data', function(error, filelist){         
                    var filteredId = path.parse(queryData.id).base;          
                    fs.readFile(`data/${filteredId}`, `utf8`, function(err, description){
                            var title = queryData.id;
                            var sanitizeTitle = sanitizeHtml(title);
                            var sanitizeDescription = sanitizeHtml(description, {allowedTags:['h1']});
                            var list = template.list(filelist);
                            var html = template.HTML(sanitizeTitle, list,
                                `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
                                `<a href="/create">create</a>
                                <a href="/update?id=${sanitizeTitle}">update</a>

                                <form action="delete_process" method="post" onsubmit="dssdfsdf">
                                    <input type="hidden" name="id" value="${sanitizeTitle}">
                                    <input type="submit" value="delete">
                                </form>`
                                );
                        response.writeHead(200);
                        response.end(html);        
                    });
                });
            }                
        } else if(pathname ==='/create'){
            fs.readdir('./data', function(error, filelist){
                var title = 'Web - create';
                var list = template.list(filelist);
                var html = template.HTML(title, list,`
                <form action="/create_process"
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
            response.writeHead(200);
            response.end(html);  
            });
        }else if(pathname ==='/create_process'){
            var body ='';
            request.on('data', function(data){
                body=body + data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var title = post.title;
                var description = post.description;
                fs.writeFile(`data/${title}`, description, `utf8`, function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        } else if(pathname === `/update`){
            fs.readdir('./data', function(error, filelist){
                var filteredId = path.parse(queryData.id).base;                   
                fs.readFile(`data/${filteredId}`, `utf8`, function(err, description){
                        var title = queryData.id;
                        var list = template.list(filelist);
                        var html = template.HTML(title, list,
                            `
                            <form action="/update_process"
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
                            `<a href="/create">create</a>
                            <a href="/update?id=${title}">update</a>`
                            );
                    response.writeHead(200);
                    response.end(html);        
                });
            });

        } else if(pathname === '/update_process'){
            var body ='';
            request.on('data', function(data){
                body=body + data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var title = post.title;
                var description = post.description;
                var id = post.id;
                fs.rename(`data/${id}`, `data/${title}`, function(error){
                    fs.writeFile(`data/${title}`, description, `utf8`, function(err){
                        response.writeHead(302, {Location: `/?id=${title}`});
                        response.end();
                    });  
                });               
            });
        } else if(pathname === '/delete_process'){
            var body ='';
            request.on('data', function(data){
                body=body + data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var id = post.id;
                var filteredId = path.parse(id).base;
                fs.unlink(`data/${filteredId}`, function(error){
                    response.writeHead(302, {Location: `/`});
                    response.end();
                });
            });
        } else{
            response.writeHead(404);
            response.end("Not found");
        }
    
    })
  
app.listen(3000);
*/