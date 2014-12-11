'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var traits = require('../../app/controllers/traits');

	// Traits Routes
	app.route('/traits')
		.post(users.requiresLogin, traits.create)
		.get(traits.list);
	
	app.route('/traits/:traitId')
		.get(traits.read)
		.put(users.requiresLogin, traits.hasAuthorization, traits.update)
		.delete(users.requiresLogin, traits.hasAuthorization, traits.delete);
	
	// Finish by binding the Card middleware
	app.param('traitId', traits.traitByID);
};