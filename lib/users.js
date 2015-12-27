var Faire;
var internals = {};

internals.data = require('./models');


var Users = {};


Users.getByEmail = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.email) {
        errorMessages.push('Users.getByEmail: Object field "email" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.user.findAll({ where: { email: input.email } }).then(function(users) {
        	if (users.length > 0) {
				var output = {};
        
	            output.id = users[0].id;
	            output.email = users[0].email;
	            callback(null, output);
        	} else {
        		callback(null, { id : null, email: input.email });
        	}
        });
    }
}

module.exports = function(faire) {
    Faire = faire;
    return Users;
}