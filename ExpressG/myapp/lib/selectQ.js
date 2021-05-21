//pg
const {Client} = require('pg');
const Query = require('pg').Query
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

module.exports = {
    topicRedirect: async (pageId) => {
        try{
            const topicRedirect = `SELECT * FROM topics WHERE id = '${pageId}';`;
            var clientquery = await client.query(topicRedirect)
            var topicRe = await clientquery.rows[0];
            console.log('topicRe : ', topicRe)
            return topicRe
        } catch(err){
            console.log('topicRedirect에러', err);
        }
    },
    
    topicquery: async () => {
        try{
            const topicquery = 'SELECT * FROM topics;';
            var clientquery = await client.query(topicquery)
            var topic = clientquery.rows;
            return topic
        } catch(err){
            console.log('topicquery에러',err);
        }
    },
    
    topicNick: async (topicRedirect) => {
        try{
            var topicRe = await topicRedirect;
            const topicNick = `SELECT nickname FROM users WHERE id='${topicRe.users_id}';`;
            var clientquery = await client.query(topicNick);
            var topicNickname = await clientquery.rows[0].nickname;
            return topicNickname
        } catch(err){
            console.log('topicNick에러', err);
        }
    },

    searchComment: async (topicRe_id) => {
        try{
            const searchCommemt = `SELECT * FROM comments WHERE topicre='${topicRe_id}';`;
            var clientquery = await client.query(searchCommemt);
            var comment = await clientquery.rows;
            return comment
        } catch(err){
            console.log('searchComment에러', err);
        }
    },

    commentNick: async (loginID) => {
        try{
            const commentNick = `SELECT nickname FROM users WHERE id='${loginID}';`;
            var clientquery = await client.query(commentNick);
            var commentNickname = await clientquery.rows[0].nickname;
            return commentNickname
        } catch(err){
            console.log('commentNick에러', err);
        }
    },

    searchTitle: async (searchText) => {
        try{
            const search = `SELECT * FROM topics WHERE title LIKE '%${searchText}%';`;
            var clientquery = await client.query(search);
            var searchTitle = await clientquery.rows;
            return searchTitle
        } catch(err){
            console.log('searchTitle에러', err);
        }
    },

    searchDescription: async (searchText) => {
        try{
            const search = `SELECT * FROM topics WHERE description LIKE '%${searchText}%';`;
            var clientquery = await client.query(search);
            var searchDescription = await clientquery.rows;
            return searchDescription
        } catch(err){
            console.log('searchDescription에러', err);
        }
    },

    searchTD: async (searchText) => {
        try{
            const search = `SELECT * FROM topics WHERE title LIKE '%${searchText}%' OR description LIKE '%${searchText}%';`;
            var clientquery = await client.query(search);
            var searchTD = await clientquery.rows;
            return searchTD
        } catch(err){
            console.log('searchTD에러', err);
        }
    }
}