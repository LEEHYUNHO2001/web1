module.exports = function(router){

//pg
const {Client} = require('pg');
const Query = require('pg').Query

var client = new Client({
    user : 'postgres', 
    host : 'localhost', 
    database : 'postgres', 
    password : 'ejsvkrhfo44!', 
    port : 5432,
})


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
    
        client.connect(err => { 
            if (err) { 
                console.error('연결 실패', err.stack)
            } else { 
                console.log('연결 성공');
            }
        });
                                
        var userquery = new Query(`SELECT * FROM users`);
        client.query(userquery, (err, res) => {
            var user = false;
            for(var i=0 ; i < res.rows.length ; i++){
                if(res.rows[i].email === email && res.rows[i].password === password){
                    user = res.rows[i];
                }
            }
            console.log('user 값 : ',user);
            if(user){
                console.log('로그인 성공');
                return done(null, user);
            } else{
                console.log('로그인 실패');
                return done(null, false);
            }
            client.end();
        }
    );   
}));

    passport.serializeUser(function(user, done){
        console.log('1: ',user);
        done(null, user.email);
    });
    passport.deserializeUser(function(id, done){
        var user = client.query(`SELECT id FROM users WHERE users.id = ${id}`);
        console.log('2 : ',id, user);
        done(null, user);
    });
    
    return passport;
}