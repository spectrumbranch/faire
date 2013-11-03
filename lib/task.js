
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
	//validate fields
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

Task.activate = function(input, callback) {
	var errorMessages = [];
	//test existence of fields
	if (!input.id) {
		errorMessages.push('Object field "id" is required.');
	}
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}
	
	//validate fields
	if (!internals.isValidID(input.id)) {
		errorMessages.push('Object field "id" must be an integer.');
	}
	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		//TODO
		callback(new Error('Not yet implemented.'));
	}
}

Task.inactivate = function(input, callback) {
	var errorMessages = [];
	//test existence of fields
	if (!input.id) {
		errorMessages.push('Object field "id" is required.');
	}
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}
	
	//validate fields
	if (!internals.isValidID(input.id)) {
		errorMessages.push('Object field "id" must be an integer.');
	}
	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		//TODO
		callback(new Error('Not yet implemented.'));
	}
}

Task.delete = function(input, callback) {
	var errorMessages = [];
	//test existence of fields
	if (!input.id) {
		errorMessages.push('Object field "id" is required.');
	}
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}
	
	//validate fields
	if (!internals.isValidID(input.id)) {
		errorMessages.push('Object field "taskid" must be an integer.');
	}
	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		//TODO
		callback(new Error('Not yet implemented.'));
	}
}

Task.update = function(input, callback) {
	var errorMessages = [];
	//test existence of required fields
	if (!input.id) {
		errorMessages.push('Object field "id" is required.');
	}
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}
	
	//TODO optional fields
	//name , status
	
	//validate fields
	if (!internals.isValidID(input.id)) {
		errorMessages.push('Object field "id" must be an integer.');
	}
	
	if (errorMessages.length > 0) {
		callback(new Error(errorMessages));
	} else {
		//TODO
		callback(new Error('Not yet implemented.'));
	}
}


module.exports = Task;