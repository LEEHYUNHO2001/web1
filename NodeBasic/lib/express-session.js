module.exports = {
    //login check
    authIsOwner : function (request,response){

    },

    //logout (login status)
    authStatusUI : function (request, response){
        var authStatusUI = '<a href="/login"><font color="red">로그인</font></a>';
        if(request.session.is_logined === true){
            authStatusUI = '<a href="/logout_process"><font color="red">로그아웃</font></a>'
        }
        return authStatusUI;
    }

    ,
    //login 접근 제어
    loginRequire : function (request, response){
        var loginRequire = true;
        if(this.authIsOwner(request, response) === false){
            loginRequire = false;
            var html = `
            <!doctype html>
            <html>
            <a href="/login"><font color="red">로그인</font></a>
            <p>로그인이 필요합니다.</p>
            </html>`;
            response.send(html);
            return false;
        }
    
    }

}