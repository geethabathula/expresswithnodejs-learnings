//Import Express Package Framework
const express = require('express');
const morgan = require('morgan')//3rd party middleware 
const moviesRouter = require('../movies/Routes/moviesRoutes');

let app = express();//calling express returns a js object

//custom middleware
const logger = function (req, res, next) {
    req.requestedAt = new Date().toISOString();//adding custom middleware property
    next();//next function
}

app.use(express.json());
app.use(logger);//order matters
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static('./public'))

app.use('/api/v1/movies', moviesRouter);

module.exports = app;