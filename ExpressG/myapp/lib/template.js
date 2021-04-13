module.exports = {
    HTML:function(title, list, body, control, 
        authStatusUI = '<a href="/auth/login">로그인</a>  | <a href="/customer/register">회원가입</a>'){
        return `
    <!doctype html>
    <link rel="icon" href="data:,">
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
    }, page:function(filelist){
        console.log('파일리스트 : ',filelist.length)
        var pagelength = filelist.length;
        var j=1;
        var page = `<a href="/${j}">[${j}] </a>`;
        var maxpost = 3;
        for(var i=0; i < filelist.length; i++){
            if( pagelength > maxpost ){
                    j++;
                    page = page + `<a href="/${j}">[${j}]</a>`;
                    pagelength -=maxpost;    
                }  
            }
        return page

    }, list:function(filelist, pageId){
        var list = '<ol>';
        var page = this.page(filelist);
        var maxpost=3;

        for(var i = 1 ; i <= filelist.length/maxpost +1 ; i++)
            if(pageId === `${i}`){
                var next = maxpost*i -maxpost;
                for(var j=0 ; j<3 ; j++){
                    list = list + `<li><a
                    href="/topic/${filelist[j+next].id}">${filelist[j+next].title}</a></li>`;
                    if(filelist.length % maxpost === j+1 && i === parseInt(filelist.length/maxpost) +1){
                        break;
                    }   
                }
            }else if(!pageId){
                for(var j=0 ; j<3 ; j++){
                    list = list + `<li><a
                    href="/topic/${filelist[j].id}">${filelist[j].title}</a></li>`;
                }
                break;
            }
        
        list = list + '</ol>' + page +'<br>';
        return list;
    }
}