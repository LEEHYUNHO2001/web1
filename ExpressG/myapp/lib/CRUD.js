//pg
const {Client} = require('pg');
const Query = require('pg').Query

var client = new Client({
    user : 'postgres', 
    host : 'localhost', 
    database : 'postgres', 
    password : 'ejsvkrhfo44!', 
    port : 5432,
})

module.exports = {

    createDatabase:function (id, title, description, users_id){
        client.connect(err => { 
            if (err) { 
                console.error('connection error', err.stack)
            } else { 
                console.log('connection good')
            }   
        });
        const createquery = new Query(`
        CREATE TABLE IF NOT EXISTS topics (id VARCHAR(50), title VARCHAR(25), description VARCHAR(300), users_id VARCHAR(50));
        INSERT INTO topics (id, title, description, users_id) VALUES('${id}', '${title}', '${description}', '${users_id}')`);
        client.query(createquery)
    },
    
    deleteDatabase:function (id){
        client.connect(err => { 
            if (err) { 
                console.error('connection error', err.stack)
            } else { 
                console.log('connection good')
            }   
        });
        console.log('함수 안에서 id 값',id)
        const deletequery = new Query(`
        DELETE FROM topics WHERE id='${id}'`);
        client.query(deletequery)
    },
    
    updateDatabase:function (title, description, id){
        client.connect(err => { 
            if (err) { 
                console.error('connection error', err.stack)
            } else { 
                console.log('connection good')
            }   
        });
        const updatequery = new Query(`
        UPDATE topics SET title='${title}', description='${description}' WHERE id='${id}'`);
        client.query(updatequery)
    }
}