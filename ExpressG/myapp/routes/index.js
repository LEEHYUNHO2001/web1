var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var login = require('../lib/loginstatus.js');
var flash = require('connect-flash');

router.use(flash());
router.use(cookieParser());

//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

//startPage 선언
var startPage = [];

const HomePageUI = async (req, res) => {
    const topicquery = 'SELECT * FROM topics;';
    var clientquery = await client.query(topicquery)
    var topic = clientquery.rows

    var fmsg = req.flash();
    var feedback = '';
    if(fmsg.error){
        feedback = fmsg.error;
    }

    //startPage 배열값 길어지지 않게..
    if(startPage.length >= 1){
        startPage.pop([0]);
    }
    //현재 pageId 저장
    startPage.push(req.params.pageId);


    res.render('index', {
        title:'Node.js 게시판',
        feedback:feedback,
        filelist:topic,
        authIsOwner:await req.user,
        pageId:await req.params.pageId,
        nickname:await login.LoginNick(req),
        startPage:startPage
    });
}

//Home
router.get('/', (req, res) => {
    HomePageUI(req, res)
});

//page
router.get('/:pageId', (req, res) => {   
    HomePageUI(req, res)
});

module.exports = router;