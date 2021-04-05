module.exports = {
    //login check    
    authIsOwner : function(request, response){
        if(request.user){
            return true;
        } else{
            return false;
        }
    },

    //logout (login status)
    authStatusUI : function(request, response){
        var authStatusUI = '<a href="/auth/login">로그인</a> | <a href="/customer/register">회원가입</a>';
        if(this.authIsOwner(request, response)){ 
            authStatusUI = `닉네임 : ${request.user.id}<br><a href="/auth/logout">로그아웃</a>`;
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