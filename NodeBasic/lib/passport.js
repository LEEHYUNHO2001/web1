module.exports = function(router){

    var authData = {
        email: 'dlgusgh2001@naver.com',
        password: '1111',
        nickname: 'dlgusgh2001'
    }

    var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
    var flash = require('connect-flash');
    const { request, response } = require('express');

    router.use(passport.initialize())
    router.use(passport.session())
    router.use(flash());

    passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {
        if(username === authData.email){
            if(password === authData.password){
                console.log('로그인 성공');
                return done(null, authData);
            } else{
                console.log('비번 틀림');
                return done(null, false, {
                    message: '비밀번호가 틀렸습니다.'
                });
            }
        } else {
            console.log('아이디 틀림');
            return done(null, false, {
                message: '없는 사용자 입니다.'
            });
        }
    }
    ));

    passport.serializeUser(function(user, done){
        console.log('1: ',user);
        done(null, user.email);
    });
    passport.deserializeUser(function(id, done){
        console.log('2 : ',id);
        done(null, authData);
    });

    return passport;
}