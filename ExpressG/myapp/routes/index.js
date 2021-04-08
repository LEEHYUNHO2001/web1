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

var client = new Client({
    user : 'postgres', 
    host : 'localhost', 
    database : 'postgres', 
    password : 'ejsvkrhfo44!', 
    port : 5432,
})

client.connect(err => { 
    if (err) { 
        console.error('Home 연결 에러', err.stack);
    } else { 
        console.log('connection good');
    }
    
});

//Home
router.get('/', (request, response) => {

    const topicquery = new Query(`SELECT * FROM topics`);
    client.query(topicquery, (err, res) => {
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
});

//page
router.get('/:pageId', (request, response, next) => {   
    const topicquery = new Query(`SELECT * FROM topics`);
    client.query(topicquery, (err, res) => {
        var title = 'Node.js 게시판';
        var description = `<a href="https://github.com/LEEHYUNHO2001/web1/tree/master" 
                            target="_blank" title="github 주소">클릭 GitHub</a>`;

        //template.list와 함께 생각해보기
        /*if(request.params.pageId === 1){
            list = template.list(res.rows)
        }*/
        /*
        if(res.rows.length > 3){
            console.log(res.rows[0].title)
        }*/
        
        var list = template.list(res.rows, request.params.pageId);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
            <img src="/images/view.jpg" style="width:300px; display:block; margin-top:10px">`,
            `<a href="/topic/create">글쓰기</a>`,
            login.authStatusUI(request, response)
            ); 
        response.send(html); 
    }) 
});

module.exports = router;