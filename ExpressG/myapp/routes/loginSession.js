var express = require('express');
var router = express.Router();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('../lib/passport.js')(router);

//login
router.get('/login', async (req, res) => {
    res.locals.authIsOwner = await req.user;
    res.locals.title = '로그인';
    res.render('login');    
});

//현재 flash가 session에 저장되지 않는 문제가 있음
router.post('/login_process',
    passport.authenticate('local', {failureFlash:true,failureRedirect: '/auth/login'}), 
    (req, res) => {
        req.session.save(function(){
            res.redirect('/');
        });
    }
);

//logout -> session delete
router.get('/logout', (req, res) => {
    req.logout()
    req.session.save(function(){
        res.redirect('/');
    });  
}); 

module.exports = router;