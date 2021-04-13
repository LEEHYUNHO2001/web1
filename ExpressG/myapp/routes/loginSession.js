var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('../lib/passport.js')(router);

//login
router.get('/login', (request, response) => {
        var title = 'login';
        var html = template.HTML(title, '',
            `<form action="/auth/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="password" placeholder="password"></p>
                <p><input type="submit" value="login"></p>
            </form>`,
            '');
    response.send(html);  
      
});

//현재 flash가 session에 저장되지 않는 문제가 있음
router.post('/login_process',
    passport.authenticate('local', {failureFlash:true,failureRedirect: '/auth/login'}), 
    (request, response) => {
        request.session.save(function(){
            response.redirect('/');
        });
    }
);

//logout -> session delete
router.get('/logout', (request, response) => {
    request.logout()
    request.session.save(function(){
        response.redirect('/');
    });  
}); 

module.exports = router;