var bcrypt = require('bcrypt');

module.exports = function(router){
    //pg
    const {Client} = require('pg');
    const Query = require('pg').Query
    const config = require('../lib/config.js');
    var client = new Client(config)
    client.connect()

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
        session:true
    }, (email, password, done) => {               
        const userEmail = {
            text: `SELECT * FROM users WHERE email='${email}'`,
            rowMode: 'dictionary',
        }
        client
            .query(userEmail)
            .then(res => {
                var user = res.rows[0];
                if(user){
                    bcrypt.compare(password, user.password, function(err, result){
                        if(result){
                            console.log('로그인 성공');
                            return done(null, user);
                        } else{
                            console.log('없는 비밀번호입니다.');
                            return done(null, false);            
                        }
                    })
                } else{
                    console.log('없는 아이디입니다.');
                    return done(null, false);
                }   
            })
            .catch(err => console.error('뭔가 오류남',err.stack))   
    }));
    passport.serializeUser(function(user, done){
        console.log('serialize: ',user);
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        console.log('desrialize : ',id);
        done(null, id);
    });
    return passport;
}
