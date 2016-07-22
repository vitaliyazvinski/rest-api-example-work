var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .all(Verify.verifyOrdinaryUser)

    .get(function (req, res, next) {
        Favorites.find({ postedBy: req.decoded._doc._id })
            .populate('postedBy dishes')
            .exec(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })

    .post(function (req, res, next) {
        Favorites.findOneAndUpdate({
            postedBy: req.decoded._doc._id
        }, {
                $addToSet: { dishes: req.body }
            }, {
                new: true,
                upsert: true
            },
            function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            })
    })

    .delete(function (req, res, next) {
        Favorites.findOneAndRemove(
            { postedBy: req.decoded._doc._id },
            function (err, resp) {
                if (err) throw err;
                res.json(resp);
            })
    })

favoriteRouter.route('/:dishId')
    .all(Verify.verifyOrdinaryUser)

    .delete(function (req, res, next) {
        Favorites.findOneAndUpdate({
            postedBy: req.decoded._doc._id
        }, {
                $pull: { dishes: req.params.dishId }
            }, {
                new: true
            },
            function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            })
    })

module.exports = favoriteRouter;