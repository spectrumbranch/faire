
var internals = {};

internals.data = require('./models');

var Preferences = {};

Preferences.getAvailableThemes = function(callback) {
	var fs = require('fs');
	fs.readdir('lib/views/themes', function(err, files) {
		callback(err, files);
	});
}

Preferences.setTheme = function(input, callback) {
	var errorMessages = [];
	
	console.log(input);
	//test existence of required fields
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}
	if (!input.theme) {
		errorMessages.push('Object field "theme" is required.');
	}

	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		internals.data.preference.findOrCreate({ where: { userId: input.user }, defaults: { theme: 'default' }}).then(function(preference, created) {
			preference[0].updateAttributes({ theme: input.theme }).then(function() {
				callback(null, preference[0]);
			});
		})
	}
}

Preferences.get = function(input, callback) {
	var errorMessages = [];
	//test existence of required fields
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}

	//?TODO future: test if input is an array in case they pass an array of ids?

	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		internals.data.preference.findOrCreate({ where: { userId: input.user }, defaults: { theme: 'default' }}).then(function(preference, created) {
			callback(null, preference[0]);
		})
	}
}

module.exports = Preferences;