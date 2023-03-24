const express = require('express');
var bodyParser = require('body-parser')

var dbConn  = require('./config/db.config');

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser());

app.get('/',(request,response)=>{
    response.send('Hello World!');
});

const routeControllerBook = require('./src/route/bookstore.route');
app.use('/books',routeControllerBook);


const routeControllerCust = require('./src/route/customer.route');
app.use('/customer',routeControllerCust);


app.listen(port, ()=>{
    console.log(`Express is running at port ${port}`);
});