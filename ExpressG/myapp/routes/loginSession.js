var express = require('express');
var router = express.Router();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('../lib/passport.js')(router);

//login
router.get('/login', async (req, res) => {
    try{
        res.render('login',{
            title:'로그인',
            authIsOwner: req.user
        });
    } catch(err){
        console.log('loginUI에러', err);
    }    
});

//현재 flash가 session에 저장되지 않는 문제가 있음
router.post('/login_process',
    passport.authenticate('local', {failureFlash:true,failureRedirect: '/auth/login'}), 
    async (req, res) => {
        try{
            req.session.save(() => {
                res.redirect('/');
            });
        } catch(err){
            console.log('login_process에러', err);
        }
    }
);

//logout -> session delete
router.get('/logout', async (req, res) => {
    try{
        req.logout()
        req.session.save(() => {
            res.redirect('/');
        });  
    } catch(err){
        console.log('logout에러', err);
    }
}); 

module.exports = router;