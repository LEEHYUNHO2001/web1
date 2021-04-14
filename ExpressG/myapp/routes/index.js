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

const HomePageUI = async (req, res) => {
    const topicquery = 'SELECT * FROM topics;';
    var clientquery = await client.query(topicquery)
    var topic = clientquery.rows

    var fmsg = req.flash();
    var feedback = '';
    if(fmsg.error){
        feedback = fmsg.error;
    }
    
    res.locals.authIsOwner = await req.user;
    res.locals.feedback = feedback;
    res.locals.filelist = topic;
    res.locals.pageId = req.params.pageId;
    res.locals.title = 'Node.js 게시판';
    res.locals.nickname = await login.LoginNick(req)
    res.render('index');
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