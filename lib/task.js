
var internals = {};

internals.data = require('./models');

internals.isValidID = function(input) {
	var isValid = true;
	var original = input;
	
	input = parseInt(input);
	
	var isBad = isNaN(input) || original !== input;

	isValid = !isBad;

	return isValid;
}

var Task = {};

Task.add = function(input, callback) {
	var errorMessages = [];
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}
	if (!input.name) {
		errorMessages.push('Object field "name" is required.');
	}
	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		//TODO
		callback(new Error('Not yet implemented.'));
	}
}

Task.activate = function(taskid, callback) {
	var errorMessages = [];
	if (!internals.isValidID(taskid)) {
		errorMessages.push('Object field "taskid" must be an integer.');
	}
	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		//TODO
		callback(new Error('Not yet implemented.'));
	}
}



module.exports = Task;