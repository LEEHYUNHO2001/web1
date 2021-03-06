module.exports = {
    HTML:function(title, list, body, control, 
        authStatusUI = '<a href="/auth/login">로그인</a>  | <a href="/auth2/register">회원가입</a>'){
        return `
    <!doctype html>
    <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            ${authStatusUI}
            <a href="/"><h1>게시판</h1></a>
            ${list}
            ${control}      
            ${body}
        </body>
    </html>`;
    }, list:function(filelist){
        var list = '<ul>';
        var i=0;
        while(i < filelist.length){
            list = list + `<li><a
            href="/topic/${filelist[i].id}">${filelist[i].title}</a></li>`;
            i=i+1;
        }
        list = list + '</ul>';
        return list;
    }
}
