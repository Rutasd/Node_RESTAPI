const mysql = require('mysql');

// create here mysql connection

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bookstore'
});

dbConnection.connect(function(error){
    if(error) throw error;
    console.log('Database Connected Successfully!!!');
})

module.exports = dbConnection;