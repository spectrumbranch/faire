module.exports.get = function(Faire) {

	login_validate = function() {
		var S = Faire.Joi.string;
		return {
			email: S().email().required().max(50),
			passwrd: S().required().min(8),
			view: S()
		}
	}

	register_validate = function() {
		var S = Faire.Joi.string;
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
				handler: function(request, reply) {
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
						reply({ theme: theme });
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				auth: 'session'
			}
		},
		{
			method: 'POST', path: '/preferences/theme', config: {
				handler: function(request, reply) {
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
										reply({ success: true });
									});
								} else {
									reply({error: 'Theme is invalid.'});
								}
							});
						} else {
							reply({error: 'Theme is invalid.'});
						}
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				auth: 'session'
			}
		},
		{
			method: 'GET', path: '/themes', config: {
				handler: function(request, reply) {
					var session = request.auth.credentials;
					if (session) {
						Faire.Preferences.getAvailableThemes(function(err, themes) {
							reply({ themes: themes });
						});
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				auth: 'session'
			}
		},
		//Faire Lists
		{
			method: 'GET', path: '/lists', config: {
				handler: function(request, reply) {
					var session = request.auth.credentials;
					if (session) {
						Faire.Lists.getAll({ user: session.id }, function(err, getAllLists) {
							if (err) {
								reply({error: err});
							} else {
								reply(getAllLists);
							}
						});
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				auth: 'session'
			}
		},
		//Faire Tasks
		{
			method: 'GET', path: '/lists/{list}/tasks', config: {
				handler: function(request, reply) {
					var session = request.auth.credentials;
					var listid = request.params.list;
					if (session) {
						if (listid) {
							Faire.Tasks.getAll({ user: session.id, list: listid }, function(err, getAllTasks) {
								if (err) throw err;
								reply(getAllTasks);
							})
						} else {
							reply({error: 'Must provide list id.'});
						}
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				auth: 'session'
			}
		},
		{
			method: 'POST', path: '/tasks/add', config: {
				handler: function(request, reply) {
					var taskname = request.payload.name;
					var session = request.auth.credentials;
					if (session) {
						if (taskname && taskname != '') {
							Faire.Tasks.add({ user: session.id, name: taskname }, function(err, addTask) {
								if (err) throw err;
								reply(addTask);
							})
						} else {
							reply({error: 'name is a required field.'});
						}
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				validate: { 
					payload: {
						name: Faire.Joi.string().required()
					}
				},
				auth: 'session'
			}
		},
		{
			method: 'GET', path: '/tasks/{id}', config: {
				handler: function(request, reply) {
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.get({ user: session.id, id: taskid }, function(err, getTask) {
							if (err) throw err;
							reply(getTask);
						})
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					params: {
						id: Faire.Joi.number().integer().required()
					}
				},
				auth: 'session'
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
					params: {
						id: Faire.Joi.number().integer().required()
					},
					payload: {
						name: Faire.Joi.string().max(50),
						status: Faire.Joi.any().valid(['active','inactive','deleted'])
					}
				},
				auth: 'session'
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
					params: {
						id: Faire.Joi.number().integer().required()
					}
				},
				auth: 'session'
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
					params: {
						id: Faire.Joi.number().integer().required()
					}
				},
				auth: 'session'
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
					params: {
						id: Faire.Joi.number().integer().required()
					}
				},
				auth: 'session'
			}
		},
	  //Authentication Routes
	  { method: '*', path: '/confirm/{hashkey*}', config: { handler: Faire.Auth.confirm, auth: false  } },
	  { method: 'POST', path: '/register', config: { handler: Faire.Auth.register, validate: { payload: register_validate() }, auth: { mode: 'try', strategy: 'session' }, 
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
			}
		}  } },
	  { method: 'POST', path: '/login', config: { handler: Faire.Auth.login, validate: { payload: login_validate() }, auth: { mode: 'try', strategy: 'session' },
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
			}
		}  } },
	  { method: '*', path: '/logout', config: { handler: Faire.Auth.logout, auth: 'session' } }, 
	  //Views
	  { method: 'GET', path: '/', config: { handler: Faire.Home.home_view, auth: 'session'  } },
	  { method: 'GET', path: '/login', config: { handler: Faire.Auth.login_view, auth: { mode: 'try', strategy: 'session' },
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
			}
		}  } },
	  { method: 'GET', path: '/register', config: { handler: Faire.Auth.register_view, auth: { mode: 'try', strategy: 'session' },
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
			}
		}  } },
	  //All static content
	  { method: '*', path: '/{path*}', config: { handler: { directory: { path: './static/', redirectToSlash: true } }, auth: { mode: 'try', strategy: 'session' },
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
			}
		}  } }
	];
};