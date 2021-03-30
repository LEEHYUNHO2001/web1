var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var login = require('../Cookie/loginpassport.js');

router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: false}));

//Home
router.get('/', (request, response) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'Node.js 게시판';
        var description = `<a href="https://github.com/LEEHYUNHO2001/web1/tree/master" 
                            target="_blank" title="github 주소">클릭 GitHub</a>`;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
            <img src="/images/view.jpg" style="width:300px; display:block; margin-top:10px">`,
            `<a href="/topic/create">글쓰기</a>`,
            login.authStatusUI(request, response)
            ); 
    response.send(html);
    });                
});

module.exports = router;