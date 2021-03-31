var db = require('../lib/db');
var bcrypt = require('bcrypt');

module.exports = function(router){

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
        passwordField: 'password',
        session: true
    }, (email, password, done) => {
        var user = db.get('users').find({email:email}).value();
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(result){
                    console.log('로그인 성공');
                    return done(null, user);
                } else{
                    console.log('비번 틀림');
                    return done(null, false, {
                        message: '비밀번호가 틀립니다.'
                    });
                }
            });
        } else{
            console.log('아이디 틀림');
            return done(null, false, {
                message: '없는 아이디 입니다.'
            });
        }
    }));

    passport.serializeUser(function(user, done){
        console.log('serializeUser: ',user);
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        var user = db.get('users').find({id:id}).value();
        console.log('deserializeUser : ',id, user);
        done(null, user);
    });

    return passport;
}