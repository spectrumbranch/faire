
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
		internals.data.Preference.findOrCreate({ UserId: input.user }, { theme: 'default' }).success(function(preference, created) {
			//var output = {};
			
			preference.updateAttributes({ theme: input.theme }).success(function() {
				//output.id = preference.id;
				//output.theme = preference.theme;
				
				callback(null, preference);
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
		internals.data.Preference.find({ where: { UserId: input.user }, include: [internals.data.User] }).success(function(preference) {
			if (preference == null) {
				//user hasnt had a preferences record created for them. create one and return default?
			}
			
			callback(null, preference);
		})
	}
}

module.exports = Preferences;