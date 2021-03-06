'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Aspect = mongoose.model('Aspect'),
	_ = require('lodash');

/**
 * Create a Aspect
 */
exports.create = function(req, res) {
	var aspect = new Aspect(req.body);
	aspect.user = req.user;

	aspect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(aspect);
		}
	});
};

/**
 * Show the current Aspect
 */
exports.read = function(req, res) {
	res.jsonp(req.aspect);
};

/**
 * Update a Aspect
 */
exports.update = function(req, res) {
	var aspect = req.aspect ;

	aspect = _.extend(aspect , req.body);

	aspect.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(aspect);
		}
	});
};

/**
 * Delete an Aspect
 */
exports.delete = function(req, res) {
	var aspect = req.aspect ;

	aspect.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(aspect);
		}
	});
};

/**
 * List of Aspects
 */
exports.list = function(req, res) { 
	Aspect.find().sort('-created').populate('user', 'displayName').exec(function(err, aspects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(aspects);
		}
	});
};

/**
 * Query Aspects by both type and deck
 */
exports.query = function(req, res) {
	Aspect.find({deck: req.params.deckId}).exec(function(err, aspects) {
		console.log(err);
		console.log(aspects);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(aspects);
		}
	});
};

/**
 * Aspect middleware
 */
exports.aspectByID = function(req, res, next, id) { 
	Aspect.findById(id).populate('user', 'displayName').exec(function(err, aspect) {
		if (err) return next(err);
		if (! aspect) return next(new Error('Failed to load Aspect ' + id));
		req.aspect = aspect ;
		next();
	});
};

/**
 * Aspect authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.aspect.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
