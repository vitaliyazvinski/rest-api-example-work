var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var promotion = require('../models/promotions');
var Verify = require('./verify');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        promotion.find({}, function (err, promo) {
            if (err) throw err;
            res.json(promo);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        promotion.create(req.body, function (err, promo) {
            if (err) throw err;
            console.log('Promotion created!');
            var id = promo._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the promotion with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        promotion.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

promoRouter.route('/:id')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        promotion.findById(req.params.id, function (err, promo) {
            if (err) throw err;
            res.json(promo);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        promotion.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
                new: true
            }, function (err, promo) {
                if (err) throw err;
                res.json(promo);
            });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        promotion.findByIdAndRemove(req.params.id, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

module.exports = promoRouter;