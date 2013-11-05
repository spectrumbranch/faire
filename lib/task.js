
var internals = {};
internals.DEFAULT_STATUS = 'active';

internals.data = require('./models');

//This function checks that the input id is of the right type. it does not check if the id exists for an item in the database.
exports.isValidID = internals.isValidID = function isValidID(input) {
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
		var task_status = internals.DEFAULT_STATUS; //default
		if (input.status) {
			task_status = input.status;
		}
		internals.data.User.find(parseInt(input.user)).success(function(user) {
			if (user == null) {
				//bad input, associated user doesn't exist, handle
				errorMessages.push('The user does not exist.');
				callback(new Error(errorMessages));
			} else {
				internals.data.Task.create({ name: input.name, status: task_status }).success(function(newTask) {
					newTask.setUser(user).success(function() {
						//success
						callback(null, newTask);
					});
				});
			}
		})
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
		internals.data.Task.find({ where: { id: input.id, UserId: input.user }, include: [internals.data.User] }).success(function(task) {
			//console.log(task.user);// .email
			var output = {};
			
			output.id = task.id;
			output.name = task.name;
			output.userid = task.user.id;
			output.email = task.user.email;
			output.createdAt = task.createdAt;
			output.updatedAt = task.updatedAt;
			output.status = 'active';
			console.log(output);
			callback(null, output);
		});
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

Task.get = function(input, callback) {
	var errorMessages = [];
	//test existence of required fields
	if (!input.id) {
		errorMessages.push('Object field "id" is required.');
	}
	if (!input.user) {
		errorMessages.push('Object field "user" is required.');
	}

	//TODO: test if input is an array in case they pass an array of ids.
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
