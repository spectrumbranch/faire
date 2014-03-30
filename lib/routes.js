module.exports.get = function(Faire) {

	login_validate = function() {
		var S = Faire.Hapi.types.String;
		return {
			email: S().email().required().max(50),
			passwrd: S().required().min(8),
			view: S()
		}
	}

	register_validate = function() {
		var S = Faire.Hapi.types.String;
		return {
			email: S().email().required().max(50),
			passwrd: S().required().min(8),
			passwrd0: S().required().min(8),
			view: S()
		}
	}

	return [
		//Faire Routes
		//Faire Preferences/Themes
		{
			method: 'GET', path: '/preferences/theme', config: {
				handler: function() {
					var request = this;
					var session = request.auth.credentials;
					if (session) {
						var theme = '';
						if (session.preference == null || session.preference.theme == null) {
							//Use the default since the user does not have it set.
							//We could decide to later create the field in the table here since it doesn't exist yet.
							theme = 'default';
						} else {
							theme = session.preference.theme;
						}
						request.reply({ theme: theme });
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				auth: { mode: "required" }
			}
		},
		{
			method: 'POST', path: '/preferences/theme', config: {
				handler: function() {
					var request = this;
					var theme = request.payload.theme;
					var session = request.auth.credentials;
					if (session) {
						if (theme && theme != '') {
							//check to see if a theme with that name even exists on the filesystem
							Faire.Preferences.getAvailableThemes(function(err, themes) {
								var exists = false;
								for (var i = 0; i < themes.length; i++) {
									if (themes[i] == theme) {
										exists = true;
										break;
									}
								}
								
								if (exists) {
									Faire.Preferences.setTheme({user: session.id, theme: theme}, function(err, preference) {
										session.preference = preference;
										request.auth.session.set(session);
										request.reply({ success: true });
									});
								} else {
									request.reply({error: 'Theme is invalid.'});
								}
							});
						} else {
							request.reply({error: 'Theme is invalid.'});
						}
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				auth: { mode: "required" }
			}
		},
		{
			method: 'GET', path: '/themes', config: {
				handler: function() {
					var request = this;
					var session = request.auth.credentials;
					if (session) {
						Faire.Preferences.getAvailableThemes(function(err, themes) {
							request.reply({ themes: themes });
						});
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				auth: { mode: "required" }
			}
		},
		//Faire Tasks
		{
			method: 'GET', path: '/tasks', config: {
				handler: function() {
					var request = this;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.getAll({ user: session.id }, function(err, getAllTasks) {
							if (err) throw err;
							request.reply(getAllTasks);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				auth: { mode: "required" }
			}
		},
		{
			method: 'POST', path: '/tasks/add', config: {
				handler: function() {
					var request = this;
					var taskname = request.payload.name;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.add({ user: session.id, name: taskname }, function(err, addTask) {
							if (err) throw err;
							request.reply(addTask);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				validate: { payload: {
					name: Faire.Hapi.types.String().required()
				} },
				auth: { mode: "required" }
			}
		},
		{
			method: 'GET', path: '/tasks/{id}', config: {
				handler: function() {
					var request = this;
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.get({ user: session.id, id: taskid }, function(err, getTask) {
							if (err) throw err;
							request.reply(getTask);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				validate: { path: { id: Faire.Hapi.types.Number().integer().required() } },
				auth: { mode: "required" }
			}
		},
		{
			method: 'POST', path: '/tasks/{id}/update', config: {
				handler: function() {
					var request = this;
					var taskid = request.params.id;
					var taskname = request.payload.name;
					var taskstatus = request.payload.status;
					var session = request.auth.credentials;
					if (session) {
						var updateObj = {};
						updateObj.id = taskid;
						updateObj.user = session.id;
						if (taskname !== undefined) {
							updateObj.name = taskname;
						}
						if (taskstatus !== undefined) {
							updateObj.status = taskstatus;
						}
						Faire.Tasks.update(updateObj, function(err, updatedTask) {
							if (err) throw err;
							request.reply(updatedTask);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					path: { id: Faire.Hapi.types.Number().integer().required() },
					payload: {
						name: Faire.Joi.string().max(50),
						status: Faire.Joi.any().valid(['active','inactive','deleted'])
					}
				},
				
				auth: { mode: "required" }
			}
		},
		{
			method: 'POST', path: '/tasks/{id}/delete', config: {
				handler: function() {
					var request = this;
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.delete({ user: session.id, id: taskid }, function(err, deletedTask) {
							if (err) throw err;
							request.reply(deletedTask);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					path: { id: Faire.Hapi.types.Number().integer().required() }
				},
				
				auth: { mode: "required" }
			}
		},
		{
			method: 'POST', path: '/tasks/{id}/inactivate', config: {
				handler: function() {
					var request = this;
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.inactivate({ user: session.id, id: taskid }, function(err, inactivatedTask) {
							if (err) throw err;
							request.reply(inactivatedTask);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					path: { id: Faire.Hapi.types.Number().integer().required() }
				},
				
				auth: { mode: "required" }
			}
		},
		{
			method: 'POST', path: '/tasks/{id}/activate', config: {
				handler: function() {
					var request = this;
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.activate({ user: session.id, id: taskid }, function(err, activatedTask) {
							if (err) throw err;
							request.reply(activatedTask);
						})
					} else {
						request.reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					path: { id: Faire.Hapi.types.Number().integer().required() }
				},
				
				auth: { mode: "required" }
			}
		},
	  //Authentication Routes
	  { method: '*', path: '/confirm/{hashkey*}', config: { handler: Faire.Auth.confirm, auth: false  } },
	  { method: 'POST', path: '/register', config: { handler: Faire.Auth.register, validate: { payload: register_validate() }, auth: { mode: 'try' }   } },
	  { method: 'POST', path: '/login', config: { handler: Faire.Auth.login, validate: { payload: login_validate() }, auth: { mode: 'try' }  } },
	  { method: '*', path: '/logout', config: { handler: Faire.Auth.logout, auth: true  } }, 
	  //Views
	  { method: 'GET', path: '/', config: { handler: Faire.Home.home_view, auth: true  } },
	  { method: 'GET', path: '/login', config: { handler: Faire.Auth.login_view, auth: { mode: 'try' }  } },
	  { method: 'GET', path: '/register', config: { handler: Faire.Auth.register_view, auth: { mode: 'try' }  } },
	  //All static content
	  { method: '*', path: '/{path*}', config: { handler: { directory: { path: './static/', listing: false, redirectToSlash: true } }, auth: { mode: 'try' } } }
	];
};