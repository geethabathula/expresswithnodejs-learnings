const express = require('express');
const router = express.Router();
const moviesController = require('../Controllers/moviesController');

router.param('id', moviesController.checkID)

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.validateBody, moviesController.createNewMovie);

router.route('/:id')
    .get(moviesController.findMovieByID)
    .patch(moviesController.updateMovieByID)
    .delete(moviesController.deleteMovieByID);


module.exports = router;