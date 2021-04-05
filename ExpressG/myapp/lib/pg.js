module.exports =function(){
    const {Client} = require('pg');
    const Query = require('pg').Query

    var client = new Client({
        user : 'postgres', 
        host : 'localhost', 
        database : 'postgres', 
        password : 'ejsvkrhfo44!', 
        port : 5432,
    })
}


