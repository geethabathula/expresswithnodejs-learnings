//Import Express Package Framework
const express = require('express');
const fs = require('fs');

const moviesData = JSON.parse(fs.readFileSync('./movies/movies.json'));
let app = express();//calling express returns a js object
//custom middleware
const logger = function (req, res, next) {
    console.log('Custom Middleware Called');
    req.requestedAt = new Date().toISOString();//adding custom middleware property
    next();//next function
}

app.use(express.json());
app.use(logger);//order matters
//GET METHOD - get all movies 
const getAllMovies = (req, res) => {
    //JSendJson Format 
    res.status(200).json({
        status: "success",
        requestedAt: req.requestedAt,
        data: {
            movies: moviesData,
        },
        count: moviesData.length
    });
}
//POST method - create a new movie object
const createNewMovie = (req, res) => {
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
}
//Get a movie
const findMovieByID = (req, res) => {
    const routeID = Number(req.params.id);
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
}
//Update movie Release Year based on ID
const updateMovieByID = (req, res) => {
    const routeID = Number(req.params.id);

    const movieToUpdate = moviesData.find(el =>
        el.id === routeID
    )

    if (!movieToUpdate) {
        return res.status(404).json({
            status: "failed",
            message: `Movie with ID ${routeID} is not Found`,
        })
    }
    const movieIndex = moviesData.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    moviesData[movieIndex] = movieToUpdate;

    fs.writeFile('./movies/movies.json', JSON.stringify(moviesData), (err) => {
        res.status(200).json({
            status: "success",
            data: {
                movies: movieToUpdate,
            }
        })
    })
}
//Delete a movie
const deleteMovieByID = (req, res) => {
    const routeID = Number(req.params.id);
    const movieToDelete = moviesData.find(el =>
        el.id === routeID
    )
    if (!movieToDelete) {
        return res.status(404).json({
            status: "failed",
            message: `Movie with ID ${routeID} is not Found`,
        })
    }
    const movieIndex = moviesData.indexOf(movieToDelete);
    moviesData.splice(movieIndex, 1);

    fs.writeFile('./movies/movies.json', JSON.stringify(moviesData), (err) => {
        res.status(204).json({
            status: "success",
            data: {
                movies: null,
            }
        })
    })
}

//Instead of separte we can chain them as they are having same route 
//using route()
// app.get('/api/v1/movies', getAllMovies);
// app.post('/api/v1/movies', createNewMovie);

app.route('/api/v1/movies')
    .get(getAllMovies)
    .post(createNewMovie);

app.route('/api/v1/movies/:id')
    .get(findMovieByID)
    .patch(updateMovieByID)
    .delete(deleteMovieByID);

//Create a server
const portnumber = 3000;
app.listen(portnumber, '127.0.0.1', () => {
    console.log("Server started on portnumber: 3000");
})

module.exports = app;