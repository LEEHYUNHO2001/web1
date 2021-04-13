//pg
const {Client} = require('pg');
const config = require('../lib/config.js');
var client = new Client(config)
client.connect()

module.exports = {
    register : function(feedback){
        return `
        <div style="color:red;">${feedback}</div>
        <form action="/customer/register_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="password2" placeholder="password"></p>
            <p><input type="text" name="nickname" placeholder="nick name"></p>
            <p><input type="submit" value="register"></p>
        </form>`
    },

    create : function(){
        return`
        <form action="/topic/create_process"
        method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>               
        `
    },

    update : function(topicRe){
        return`
        <form action="/topic/update_process"
        method="post">
            <input type="hidden" name="id" value="${topicRe.id}">
            <input type="hidden" name="users_id" value="${topicRe.users_id}">
            <p><input type="text" name="title" placeholder="title" value="${topicRe.title}"></p>
            <p><textarea name="description" placeholder="description">${topicRe.description}</textarea></p>
            <p><input type="submit"></p>
        </form>`
    },

    homeelse : function(topicRe){
        return `
        <a href="/topic/create/">글쓰기</a>
        <a href="/topic/update/${topicRe.id}">글수정</a>

        <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${topicRe.id}">
            <input type="hidden" name="users_id" value="${topicRe.users_id}">
            <input type="submit" value="글삭제">
        </form>`
    }
}