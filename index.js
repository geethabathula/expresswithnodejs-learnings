//Import Express Package Framework
const express = require('express');
let app = express();//calling express returns a jsobject

//Route = HTTPMETHOD(get) + URL
app.get('/', (req, res) => {
    //to send html response
    res.status(200).send('<h4>HTTP GET METHOD on base url</h4>');
    //to send json data 
    // res.json({ "portnumber": 3000 });
})

app.post('/users', (req, res) => {
    console.log("hi")
    res.status(200).send('<h4>HTTP POST METHOD on users url</h4>');
})

//Create a server
const portnumber = 3000;
app.listen(portnumber, '127.0.0.1', () => {
    console.log("Server started on portnumber: 3000");
})