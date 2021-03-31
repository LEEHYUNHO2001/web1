var topic = db.get('topics').find({id:request.params.pageId}).value();
var user = db.get('users') .find({id:topic.user_id}).value();      
var sanitizeTitle = sanitizeHtml(topic.title);
var sanitizeDescription = sanitizeHtml(topic.description, {allowedTags:['h1']});


module.exports = topic;