var http = require('http');
var fs = require('fs');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    
    if(pathname ==='/'){
            if(queryData.id === undefined){
                
                fs.readdir('./data', function(error, filelist){
                    var title = 'Web';
                    var description = 'Welcome Web';

                    var list = '<ul>';
                    var i=0;
                    while(i < filelist.length){
                        list = list + `<li><a
                        href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                        i=i+1;
                    }
                    list = list + '</ul>';

                    var template =`
                    <!doctype html>
                    <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="utf-8">
                        </head>
                    
                        <body>
                            <a href="/"><h1>WEB</h1></a>
                            ${list}
                            <ul>
                                <li>hyunho</li>
                                <li>hyunho2</li>
                                <li>hyunho2</li>
                            </ul>
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </body>
                    </html>`
                response.writeHead(200);
                response.end(template);  
                });

       
            
            } else{
                fs.readdir('./data', function(error, filelist){
                    var title = 'Web';
                    var description = 'Welcome Web';

                    var list = '<ul>';
                    var i=0;
                    while(i < filelist.length){
                        list = list + `<li><a
                        href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                        i=i+1;
                    }
                    list = list + '</ul>';
                    fs.readFile(`data/${queryData.id}`, `utf8`, function(err, description){
                            var title = queryData.id;
                            var template =`
                            <!doctype html>
                            <html>
                                <head>
                                    <title>WEB1 - ${title}</title>
                                    <meta charset="utf-8">
                                </head>
                            
                                <body>
                                    <a href="/"><h1>WEB</h1></a>
                                    ${list}
                                    <ul>
                                        <li>hyunho</li>
                                        <li>hyunho2</li>
                                        <li>hyunho2</li>
                                    </ul>
                                    <h2>${title}</h2>
                                    <p>${description}</p>
                                </body>
                            </html>`
                        response.writeHead(200);
                        response.end(template);        
                    });
                });
            }                
        } else{
            response.writeHead(404);
            response.end("Not found");
        }
    
    })

    
app.listen(3000);