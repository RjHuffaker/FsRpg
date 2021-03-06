'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Trait = mongoose.model('Trait'),
	_ = require('lodash');

/**
 * Create a Trait
 */
exports.create = function(req, res) {
	var trait = new Trait(req.body);
	trait.user = req.user;

	trait.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trait);
		}
	});
};

/**
 * Show the current Trait
 */
exports.read = function(req, res) {
	res.jsonp(req.trait);
};

/**
 * Update a Trait
 */
exports.update = function(req, res) {
	var trait = req.trait;

	trait = _.extend(trait, req.body);

	trait.save(function(err) {
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trait);
		}
	});
};

/**
 * Delete an Trait
 */
exports.delete = function(req, res) {
	var trait = req.trait ;

	trait.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trait);
		}
	});
};

/**
 * List of Traits
 */
exports.list = function(req, res) {
	Trait.find({ traitType: req.params.traitType }).sort('-created').populate('user', 'displayName').exec(function(err, traits) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(traits);
		}
	});
};

/**
 * Trait middleware
 */
exports.traitByID = function(req, res, next, id) {
	Trait.findById(id).populate('user', 'displayName').exec(function(err, trait){
		if (err) console.log(err);
		if (err) return next(err);
		if (! trait) return next(new Error('Failed to load Trait ' + id));
		req.trait = trait;
		next();
	});
};

/**
 * Trait authorization middleware
 */
exports.hasAuthorization = function(req, res, next){
	if(req.trait.user.id !== req.user.id){
		return res.status(403).send('User is not authorized');
	}
	next();
};