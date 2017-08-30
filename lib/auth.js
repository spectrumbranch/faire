const internals = {
	redirectAfterFailure: '/',
	redirectAuthenticatedDefault: '/',
	redirectLoggedOut: '/',
	redirectBadLogin: '/login?badlogin',
	redirectConfirmationSuccess: '/login?confirmed',
	registerSuccessful: '/login?registerSuccessful',
	registerUserAlreadyExists: '/register?userAlreadyExists',
	baseuri: ''
};

internals.data = require('./models');

internals.setURI = function(input) {
	internals.baseuri = input;
}

const Faire = require('./');
const Email = Faire.Email;
const Config = Faire.Config;
const Preferences = Faire.Preferences;

const scurvy = Faire.Scurvy;

internals.confirm = function(request, reply) {
	scurvy.doesMetastateHashkeyHaveUser(request.params.hashkey, function(err, result) {
		if (!result) {
			reply.redirect(internals.redirectAfterFailure);
		} else {
			//result is an object containing user and metastate.
			scurvy.activateUser(result, function(err2, activationResult) {
				if (err2) {
					console.log('auth.confirm: Error from activateUser: ' + err2);
					reply.redirect(internals.redirectAfterFailure);
				} else {
					console.log('auth.confirm: user has been activated');
					reply.redirect(internals.redirectConfirmationSuccess);
				}
			});
		}
	});
}


internals.register = function(request, reply) {
	const errors = [];
	
	if (!request.payload) {
		console.log("Register endpoint hit: Not a payload");
		errors.push("No valid payload sent.");
	} else {
		console.log("Register endpoint hit: A payload");

		// 1.) take in payload and grab each parameter
		//		email, passwrd, passwrd0 (confirmation)
		
		const passwrd = request.payload.passwrd;
		const passwrd0 = request.payload.passwrd0;
		const email = request.payload.email;
		const isView = request.payload.view === 'true';
		
		// 2.) validate parameters - https://github.com/spumko/hapi/blob/master/examples/validation.js
		//		route validation:: validate: { query: { userid: Hapi.types.String().required().with('passwrd') ...etc } }
		// Some route validation happens in the routing mechanism at the moment.
		
		//Password must match confirmation.
		if (passwrd !== passwrd0) {
			errors.push('Confirmation password does not match.');
		}

		if (errors.length > 0) {
			//don't create user, send error response
			reply({ success: false, errors: errors });
		} else {
			// 3.) create deactivated user with a metastate record. requires creating the metastate hashkey from the user's salt and email (create user, send OK)
			
			scurvy.createUser({email: email, passwrd: passwrd, status: 'inactive'}, function(err, userball) {
				if (err) {
					errors.push(err);
					console.log('Error when trying to create user: ', err);
					if (isView) {
						if (err.code === 'ER_DUP_ENTRY' || err.original.code === 'ER_DUP_ENTRY') {
							//Bring user to register page and display a message that a user already exists with that email address
							return reply.redirect(internals.registerUserAlreadyExists);
						} else {
							return reply({ success: false, errors: errors });
						}
					} else {
						return reply({ success: false, errors: errors });
					}
				} else {
					Preferences.setTheme({ user: userball.user.id, theme: 'default' }, function (preferr, prefResult) {
						if (preferr) {
							errors.push(preferr);
							console.log('Error when trying to set default preferences: ' + preferr);
							return reply({ success: false, errors: errors });
						} else {
							internals.sendConfirmationEmail(email, userball.metastate.hashkey, function(err, result) {
								if (isView) {
									//Bring user to login page and display a message of success
									return reply.redirect(internals.registerSuccessful);
								} else {
									return reply({ success: result });
								}
							});
						}
					});
				}
			});
		}
	}
}


internals.sendConfirmationEmail = function(email, hashkey, callback) {
	const confirmationUrl = internals.baseuri + '/confirm/' + hashkey;
	const subject = 'Faire - Confirm Registration';
	const body = 'Hello! Someone using this email address (' 
		+ email 
		+ ') has made an account registration request for the application Faire. If you intended to register, please confirm your registration by clicking the following link: ' 
		+ confirmationUrl 
		+ ' \n If you did not intend to register, please feel free to ignore and delete this email. Thanks!';

	return Email.sendMessage({
	    to: email,
	    subject: subject,
	    body: body
	  },
	  function(mailErr, response) {
	    console.log('mail send operation finished: ', mailErr || response);
	    return callback(mailErr, response);
	  }
	);
}


internals.login = function(request, reply) {
	if (request.auth.isAuthenticated) {
		return reply.redirect(internals.redirectAuthenticatedDefault);
	}
	let message = '';
	
	if (!request.payload.email || !request.payload.passwrd) {
		message = 'Missing email or password';
	} else {
		const password_input = request.payload.passwrd;
		const email_input = request.payload.email;
		const isView = request.payload.view === 'true';
		
		scurvy.verifyCredentials({email: email_input, passwrd: password_input, include: [internals.data.preference]}, function(err, user) {
			if (user) {
				//It matches!
				request.cookieAuth.set(user);
				return reply.redirect(internals.redirectAuthenticatedDefault);
			} else {
				//It doesn't match.
				if (isView) {
					return reply.redirect(internals.redirectBadLogin);
				} else {
					//is JSON API format
					message = 'Invalid email or password';
					return reply({ status: 'errors', errors: [message] });
				}
			}
		})
	}
}

internals.register_view = function(request, reply) {
	if (request.auth.isAuthenticated) {
		return reply.redirect(internals.redirectAuthenticatedDefault);
	}

	return reply.view('register', {});
}

internals.login_view = function(request, reply) {
	if (request.auth.isAuthenticated) {
		return reply.redirect(internals.redirectAuthenticatedDefault);
	}

	return reply.view('login', {});
}

internals.logout = function(request, reply) {
    request.cookieAuth.clear();
    return reply.redirect(internals.redirectLoggedOut);
}

exports.logout = internals.logout;
exports.login = internals.login;
exports.login_view = internals.login_view;
exports.register_view = internals.register_view
exports.confirm = internals.confirm;
exports.register = internals.register;

exports.setURI = internals.setURI;