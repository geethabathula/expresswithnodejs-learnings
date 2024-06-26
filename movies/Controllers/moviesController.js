const fs = require('fs');

const moviesData = JSON.parse(fs.readFileSync('./movies/movies.json'));

//using param middleware
exports.checkID = (req, res, next, value) => {
    //Find Movie based on ID Parameter
    const routeID = Number(value);
    console.log(typeof (value))
    const movieFinder = moviesData.find(el =>
        el.id === routeID
    )
    if (!movieFinder) {
        return res.status(404).json({
            status: "failed",
            message: `Movie with ID ${routeID} is not Found`,
        }
        )
    }
    next();
}

//Adding validation to create a movie 
exports.validateBody = (req, res, next) => {
    if (!req.body.Title || !req.body.Year) {
        return res.status(400).json({
            status: "failed",
            message: `Movie data missing properties Title or Year`,
        }
        )
    }
    next();
}

//Route Handling Functions
//GET METHOD - get all movies 
exports.getAllMovies = (req, res) => {
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
exports.createNewMovie = (req, res) => {
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
exports.findMovieByID = (req, res) => {
    const routeID = Number(req.params.id);
    //returns element of the array based on condition
    const movieFinder = moviesData.find(el =>
        el.id === routeID
    )
    // if (!movieFinder) {
    //     return res.status(404).json({
    //         status: "failed",
    //         message: `Movie with ID ${routeID} is not Found`,
    //     }
    //     )
    // }
    res.status(200).json({
        status: "success",
        data: {
            movies: movieFinder,
        }
    })
}
//Update movie Release Year based on ID
exports.updateMovieByID = (req, res) => {
    const routeID = Number(req.params.id);

    const movieToUpdate = moviesData.find(el =>
        el.id === routeID
    )

    // if (!movieToUpdate) {
    //     return res.status(404).json({
    //         status: "failed",
    //         message: `Movie with ID ${routeID} is not Found`,
    //     })
    // }
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
exports.deleteMovieByID = (req, res) => {
    const routeID = Number(req.params.id);
    const movieToDelete = moviesData.find(el =>
        el.id === routeID
    )
    // if (!movieToDelete) {
    //     return res.status(404).json({
    //         status: "failed",
    //         message: `Movie with ID ${routeID} is not Found`,
    //     })
    // }
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

