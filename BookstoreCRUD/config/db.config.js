const mysql = require('mysql');

// create here mysql connection

const dbConnection = mysql.createConnection({
    host: 'mystack-databasereplicainstance-lelio3wv3pe2.ct7azeruzkp4.us-east-1.rds.amazonaws.com',
    // host: 'localhost',
    port: '3306',
    user: 'awsadmin',
    // user: 'root',
    password: 'awspassword',
    // password: 'password',
    database: 'bookstore'
});

dbConnection.connect(function(error){
    if(error) throw error;
    console.log('Database Connected Successfully!!!');
})

module.exports = dbConnection;