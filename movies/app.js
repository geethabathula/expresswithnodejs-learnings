//Import Express Package Framework
const express = require('express');
const fs = require('fs');

const moviesData = JSON.parse(fs.readFileSync('./movies/movies.json'));

let app = express();//calling express returns a jsobject
app.use(express.json())
//api/v1/movies
//GET METHOD - get all movies 
app.get('/api/v1/movies', (req, res) => {
    //to send html response
    console.log(req.body)
    //JSendJson Format 
    res.status(200).json({
        status: "success",
        data: {
            movies: moviesData,
        },
        count: moviesData.length
    });
})

//POST method - create a new movie object
app.post('/api/v1/movies', (req, res) => {
    //we also need to add body so we use a middleware we use express.json()
    //adding id dynamically
    const newID = moviesData[moviesData.length - 1].id + 1;
    const newMovie = Object.assign({ id: newID }, req.body)
    moviesData.push(newMovie);

    fs.writeFile('./movies/movies.json', JSON.stringify(moviesData), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                movies: newMovie,
            }
        });
    });

})

//api/v1/movies/id
app.get('/api/v1/movies/:id', (req, res) => {
    const routeID = Number(req.params.id);

    console.log(routeID);
    //returns element of the array based on condition
    const movieFinder = moviesData.find(el =>
        el.id === routeID
    )

    if (!movieFinder) {
        res.status(404).json({
            status: "failed",
            message: `Movie with ID ${routeID} is not Found`,
        }

        )
    }

    res.status(200).json({
        status: "success",
        data: {
            movies: movieFinder,
        }
    })
})

//Create a server
const portnumber = 3000;
app.listen(portnumber, '127.0.0.1', () => {
    console.log("Server started on portnumber: 3000");
})

module.exports = app;