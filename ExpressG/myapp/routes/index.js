var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var login = require('../lib/loginstatus.js');
var flash = require('connect-flash');
var selectQ = require('../lib/selectQ.js');
var bodyParser = require('body-parser');
router.use(flash());
router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: false}));

//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

const HomePageUI = async (req, res, searchPage, filelist) => {
    try{
        //flash사용
        var fmsg = req.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error;
        }
        res.render('index', {
            title:'Node.js 게시판',
            feedback:feedback,
            filelist:filelist,
            authIsOwner:await req.user,
            pageId:await req.params.pageId,
            searchPage:searchPage,
            nickname:await login.LoginNick(req)
        });
    } catch(err){
        console.log('Home, pageUI에러', err)
    }
}


//Home
router.get('/', async(req, res) => {
    var filelist = await selectQ.topicquery();
    HomePageUI(req, res, 0, filelist)
});

//page
router.get('/:pageId', async(req, res) => {   
    var filelist = await selectQ.topicquery();
    HomePageUI(req, res, 0, filelist)
});

//search
router.post('/search', async(req, res) => {
    try{
        var post = await req.body;
        var option = await post.options;
        var searchText = await post.searchText;
        var filelist = false;
        var searchPage = 1000;
        
        if(option === 'title'){
            filelist = await selectQ.searchTitle(searchText);
        } else if(option === 'description'){
            filelist = await selectQ.searchDescription(searchText);
        } else{
            filelist = await selectQ.searchTD(searchText);
        }
        HomePageUI(req, res, searchPage, filelist)
    } catch(err){
        console.log('search에러', err);
    }
});


module.exports = router;