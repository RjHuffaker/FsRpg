'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var origins = require('../../app/controllers/origins');

	// Origins Routes
	app.route('/origins')
		.post(users.requiresLogin, origins.create);
	
	app.route('/origins/:originType')
		.get(origins.list);
	
	app.route('/origins/:originId')
		.get(origins.read)
		.put(users.requiresLogin, origins.hasAuthorization, origins.update)
		.delete(users.requiresLogin, origins.hasAuthorization, origins.delete);
	
	// Finish by binding the Origin middleware
	app.param('originId', origins.originByID);
};