var db = require('../lib/db');
var shortid = require('shortid');
var sanitizeHtml = require('sanitize-html');
module.exports = {

    //comment check
    commentUI:function(request, response){
        var topic = db.get('topics').find({id:request.params.pageId}).value();
        var user = db.get('users') .find({id:topic.user_id}).value();
        var comment = db.get('comments').find({id:topic.id}).value();
        var sanitizeTitle = sanitizeHtml(topic.title);
        var sanitizeDescription = sanitizeHtml(topic.description, {allowedTags:['h1']});
        if(comment){
            commentUI = 
            `<h2>글 제목 : ${sanitizeTitle}</h2>
            <p>${sanitizeDescription}</p>
            <p>작성자 : ${user.nickname}</p>

            <p> 댓글 제목 : ${comment.title}</p>
            <p> 댓글 내용 : ${comment.description}</p>
            <p> 댓글 작성자 : ${comment.nickname}</p>
            <br><br><br>
            <form action="/topic/comment_process"
            method="post">
                <input type="hidden" name="id" value="${topic.id}">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="댓글 달기"></p>
            </form>
             `;
        } else{
            var commentUI = 
            `<h2>글 제목 : ${sanitizeTitle}</h2>
            <p>${sanitizeDescription}</p>
            <p>작성자 : ${user.nickname}</p>
            <form action="/topic/comment_process"
            method="post">
                <input type="hidden" name="id" value="${topic.id}">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="댓글 달기"></p>
            </form>
             `;
        }
        return commentUI;
    }
}