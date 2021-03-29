module.exports = {
    //login check    
    authIsOwner : function(request, response){
        if(request.session.is_logined){
            return true;
        } else{
            return false;
        }
    },

    //logout (login status)
    authStatusUI : function(request, response){
        var authStatusUI = '<a href="/auth/login">로그인</a>';
        if(this.authIsOwner(request, response)){
            authStatusUI = `닉네임 : ${request.session.nickname}<br><a href="/auth/logout">로그아웃</a>`;
        }
        return authStatusUI;
    },

    //login 접근 제어
    loginRequire : function(request, response){
        var loginRequire = true;
        if(this.authIsOwner(request, response) === false){
            loginRequire = false;
            var html = `
            <!doctype html>
            <html>
            <a href="/auth/login">로그인</a>
            <p>로그인이 필요합니다.</p>
            </html>`;
            response.send(html);
            return false;
        }
    }
}