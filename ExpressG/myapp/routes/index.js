var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var cookieParser = require('cookie-parser');
var login = require('../lib/loginstatus.js');

router.use(cookieParser());

//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

const HomePageUI = async (request, response) => {
    const topicquery = 'SELECT * FROM topics;';
    var clientquery = await client.query(topicquery)
    var topic = clientquery.rows
    var title = 'Node.js 게시판';
    var description = `<a href="https://github.com/LEEHYUNHO2001/web1/tree/master" 
                        target="_blank" title="github 주소">클릭 GitHub</a>`;
    var list = template.list(topic);
    if(request.params.pageId){
        list = template.list(topic, request.params.pageId);
    }
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/images/view.jpg" style="width:300px; display:block; margin-top:10px">`,
        `<a href="/topic/create">글쓰기</a>`,
        await login.authStatusUI(request, response)
        ); 
    response.send(html);
}

//Home
router.get('/', (request, response) => {
    HomePageUI(request, response)
});

//page
router.get('/:pageId', (request, response) => {   
    HomePageUI(request, response)
});

module.exports = router;