var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var login = require('../lib/loginstatus.js');

router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: false}));

//pg
const {Client} = require('pg');
const Query = require('pg').Query
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

const topicquery = {
    text: 'SELECT * FROM topics',
    rowMode: 'dictionary',
}

//Home
router.get('/', (request, response) => {
    client
        .query(topicquery)
        .then(res => { 
            var title = 'Node.js 게시판';
            var description = `<a href="https://github.com/LEEHYUNHO2001/web1/tree/master" 
                                target="_blank" title="github 주소">클릭 GitHub</a>`;
            var list = template.list(res.rows);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}
                <img src="/images/view.jpg" style="width:300px; display:block; margin-top:10px">`,
                `<a href="/topic/create">글쓰기</a>`,
                login.authStatusUI(request, response)
                ); 
            response.send(html); 
        })
        .catch(err => console.error('뭔가 오류남',err.stack))     
});

//page
router.get('/:pageId', (request, response, next) => {   
    client
        .query(topicquery)
        .then(res => {
            var title = 'Node.js 게시판';
            var description = `<a href="https://github.com/LEEHYUNHO2001/web1/tree/master" 
                                target="_blank" title="github 주소">클릭 GitHub</a>`;
            var list = template.list(res.rows, request.params.pageId);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}
                <img src="/images/view.jpg" style="width:300px; display:block; margin-top:10px">`,
                `<a href="/topic/create">글쓰기</a>`,
                login.authStatusUI(request, response)
                ); 
            response.send(html); 
        })
        .catch(err => console.error('뭔가 오류남',err.stack))  
});

module.exports = router;