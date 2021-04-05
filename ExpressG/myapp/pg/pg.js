const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');

const {Client} = require('pg');
const Query = require('pg').Query

var client = new Client({
    user : 'postgres', 
    host : 'localhost', 
    database : 'postgres', 
    password : 'ejsvkrhfo44!', 
    port : 5432,
})

client.connect(err => { 
    if (err) { 
        console.error('connection error', err.stack)
    } else { 
        console.log('success!') 
    } 
});

app.get('/', function(req, res, next) { 
    const query = new Query("SELECT * FROM users") 
    client.query(query)
    var rows = [];

     /** * row에서 데이터 가져오고 end에서 검색할 때 발생한 각종 정보, error는 오류 발생시 */
    query.on("row",row=>{ 
         rows.push(row); 
        }); 
    query.on('end', () => { 
        console.log(rows); 
        console.log('query done') 
        res.send(rows); res.status(200).end(); 
    }); 
    query.on('error', err => { 
        console.error(err.stack) 
    });
 });

 app.use(function(request, response, next){
    response.status(404).send('페이지를 찾을 수 없습니다.');
});

app.use(function(err, request, response, next){
    console.error(err.stack);
    response.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

