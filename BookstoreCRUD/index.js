const express = require('express');
var bodyParser = require('body-parser')

const app = express();

const port = process.env.PORT || 80;

app.use(bodyParser());

app.get('/',(request,response)=>{
    response.send('Hello World!');
});

//endoint for book operations
const routeControllerBook = require('./src/route/bookstore.route');
app.use('/books',routeControllerBook);

//endpoint for customer oprations
const routeControllerCust = require('./src/route/customer.route');
app.use('/customers',routeControllerCust);


app.listen(port, ()=>{
    console.log(`Express is running at port ${port}`);
});