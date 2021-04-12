//pg
const {Client} = require('pg');
const Query = require('pg').Query
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

module.exports = {

    createDatabase:function (id, title, description, users_id){
        const createquery = new Query(`
        CREATE TABLE IF NOT EXISTS topics (id VARCHAR(50), title VARCHAR(25), description VARCHAR(300), users_id VARCHAR(50));
        INSERT INTO topics (id, title, description, users_id) VALUES('${id}', '${title}', '${description}', '${users_id}')`);
        client.query(createquery)
    },
    
    deleteDatabase:function (id){
        console.log('함수 안에서 id 값',id)
        const deletequery = new Query(`
        DELETE FROM topics WHERE id='${id}'`);
        client.query(deletequery)
    },
    
    updateDatabase:function (title, description, id){
        const updatequery = new Query(`
        UPDATE topics SET title='${title}', description='${description}' WHERE id='${id}'`);
        client.query(updatequery)
    }
}