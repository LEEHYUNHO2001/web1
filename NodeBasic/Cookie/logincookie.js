module.exports = {
    //login check
    authIsOwner : function (request,response){
        var isOwner = false;
        var cookies = {}
        if(request.cookies){
        cookies = request.cookies;
        }
        if(cookies.email === 'dlgusgh2001@naver.com' && cookies.password === '1111'){
        isOwner = true;
        }
        return isOwner;
    },

    //logout (login status)
    authStatusUI : function (request, response){
        var authStatusUI = '<a href="/login">login</a>';
        if(this.authIsOwner(request,response) === true){
            authStatusUI = '<a href="/logout_process">logout</a>'
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
            <a href="/login">login</a>
            <p>로그인이 필요합니다.</p>
            </html>`;
            response.send(html);
            return false;
        }
    
    }

}