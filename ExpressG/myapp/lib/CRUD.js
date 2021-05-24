//pg
const {Client} = require('pg');
const Query = require('pg').Query
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

module.exports = {
    createDatabase: async (id, title, description, users_id) => {
        try{
            const createquery = new Query(`
            CREATE TABLE IF NOT EXISTS topics (num serial primary key, id VARCHAR(50), title VARCHAR(25), description VARCHAR(300), users_id VARCHAR(50));
            INSERT INTO topics (id, title, description, users_id) VALUES('${id}', '${title}', '${description}', '${users_id}')`);
            client.query(createquery)
        } catch(err){
            console.log('createquery에러', err);
        }
    },
    
    deleteDatabase: async (id) => {
        try{
            console.log('함수 안에서 id 값',id)
            const deletequery = new Query(`
            DELETE FROM topics WHERE id='${id}'`);
            client.query(deletequery)
        } catch(err){
            console.log('deletequery에러');
        }
    },
    
    updateDatabase: async (title, description, id) => {
        try{
            const updatequery = new Query(`
            UPDATE topics SET title='${title}', description='${description}' WHERE id='${id}'`);
            client.query(updatequery)
        } catch(err){
            console.log('updatequery에러', err);
        }
    },

    userDatabase: async (id, email, password, nickname) => {
        try{
            const userquery = new Query(`
            CREATE TABLE IF NOT EXISTS users (id VARCHAR(50), email VARCHAR(25), password VARCHAR(100), nickname VARCHAR(10));
            INSERT INTO users (id, email, password, nickname) VALUES('${id}', '${email}', '${password}', '${nickname}')`);
            client.query(userquery)
        } catch(err){
            console.log('userquery에러', err);
        }
    },

    createComment: async (id, description, users_id, commentNick, topicRe) => {
        try{
            const createquery = new Query(`
            CREATE TABLE IF NOT EXISTS comments (id VARCHAR(50),  description VARCHAR(300), users_id VARCHAR(50), commentNick VARCHAR(10), topicRe VARCHAR(50));
            INSERT INTO comments (id, description, users_id, commentNick, topicRe) VALUES('${id}', '${description}', '${users_id}', '${commentNick}', '${topicRe}')`);
            client.query(createquery)
        } catch(err){
            console.log('createComment에러', err);
        }
    },
    
    deleteComment: async (id) => {
        try{
            const deletequery = new Query(`
            DELETE FROM comments WHERE id='${id}'`);
            client.query(deletequery)
        } catch(err){
            console.log('deleteComment에러');
        }
    }
}