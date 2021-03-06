module.exports.get = function(Faire) {

	var login_validate = function() {
		return {
			email: Faire.Joi.string().email().required().max(50),
			passwrd: Faire.Joi.string().required().min(8),
			view: Faire.Joi.string()
		}
	}

	var register_validate = function() {
		return {
			email: Faire.Joi.string().email().required().max(50),
			passwrd: Faire.Joi.string().required().min(8),
			passwrd0: Faire.Joi.string().required().min(8),
			view: Faire.Joi.string()
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
        {
			method: 'GET', path: '/lists/{id}', config: {
				handler: function(request, reply) {
					var session = request.auth.credentials;
                    var listid = request.params.id;
					if (session) {
                        if (listid) {
                            Faire.Lists.get({ user: session.id, id: listid }, function(err, list) {
                                if (err) {
                                    reply({error: err});
                                } else {
                                    reply(list);
                                }
                            });
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
			method: 'POST', path: '/lists/add', config: {
				handler: function(request, reply) {
					var listname = request.payload.name;
					var session = request.auth.credentials;
					if (session) {
						if (listname && listname != '') {
							Faire.Lists.add({ user: session.id, name: listname }, function(err, newList) {
								if (err) throw err;
								reply(newList);
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
			method: 'POST', path: '/lists/{id}/update', config: {
				handler: function(request, reply) {
					var listid = request.params.id;
					var listname = request.payload.name;
					var liststatus = request.payload.status;
					var session = request.auth.credentials;
					if (session) {
						var updateObj = {};
						updateObj.id = listid;
						updateObj.user = session.id;
						if (listname !== undefined) {
							updateObj.name = listname;
						}
						if (liststatus !== undefined) {
							updateObj.status = liststatus;
						}
						Faire.Lists.update(updateObj, function(err, updatedList) {
							if (err) throw err;
							reply(updatedList);
						})
					} else {
						reply({error: 'Must be logged in.'});
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
			method: 'POST', path: '/lists/{id}/delete', config: {
				handler: function(request, reply) {
					var listid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						console.log('we are logged in');
						Faire.Lists.delete({ user: session.id, id: listid }, function(err, deletedList) {
						
							console.log('we are inside delete callback');
							if (err) throw err;
							reply(deletedList);
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
		     method: 'POST', path: '/lists/{id}/share', config: {
		         handler: function(request, reply) {
		             var listid = request.params.id;
		             var listUsersToShare = request.payload.users;
		             var session = request.auth.credentials;
		             if (session) {
		                 var shareObj = {};
		                 shareObj.id = listid;
		                 shareObj.user = session.id;
		                 shareObj.users = listUsersToShare;
		                 Faire.Lists.share(shareObj, function(err, sharedUsers) {
		                     if (err) throw err;
		                     reply(sharedUsers);
		                 })
		             } else {
		                 reply({error: 'Must be logged in.'});
		             }
		         },
		         validate: {
		             params: {
		                 id: Faire.Joi.number().integer().required()
		             },
		             payload: {
		                 users: Faire.Joi.array()
		             }
		         },
		         auth: 'session'
		     }
		 },
		 {
		     method: 'POST', path: '/lists/{id}/unshare', config: {
		         handler: function(request, reply) {
		             var listid = request.params.id;
		             var listUserToUnshare = request.payload.users;
		             var session = request.auth.credentials;
		             if (session) {
		                 var unshareObj = {};
		                 unshareObj.id = listid;
		                 unshareObj.user = session.id;
		                 unshareObj.users = listUserToUnshare;
		                 Faire.Lists.unshare(unshareObj, function(err, unsharedUsers) {
		                     if (err) throw err;
		                     reply(unsharedUsers);
		                 })
		             } else {
		                 reply({error: 'Must be logged in.'});
		             }
		         },
		         validate: {
		             params: {
		                 id: Faire.Joi.number().integer().required()
		             },
		             payload: {
		                 users: Faire.Joi.array()
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
                    var listId = request.payload.list;
					var session = request.auth.credentials;
					if (session) {
						if (taskname && taskname != '') {
							Faire.Tasks.add({ user: session.id, name: taskname, list: listId }, function(err, addTask) {
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
						name: Faire.Joi.string().required(),
                        list: Faire.Joi.number().integer().required()
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
				handler: function(request, reply) {
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
							reply(updatedTask);
						})
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					params: {
						id: Faire.Joi.number().integer().required()
					},
					payload: {
						name: Faire.Joi.string().max(1000),
						status: Faire.Joi.any().valid(['active','inactive','deleted'])
					}
				},
				auth: 'session'
			}
		},
		{
			method: 'POST', path: '/tasks/{id}/delete', config: {
				handler: function(request, reply) {
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.delete({ user: session.id, id: taskid }, function(err, deletedTask) {
							if (err) throw err;
							reply(deletedTask);
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
			method: 'POST', path: '/tasks/{id}/inactivate', config: {
				handler: function(request, reply) {
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.inactivate({ user: session.id, id: taskid }, function(err, inactivatedTask) {
							if (err) throw err;
							reply(inactivatedTask);
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
			method: 'POST', path: '/tasks/{id}/activate', config: {
				handler: function(request, reply) {
					var taskid = request.params.id;
					var session = request.auth.credentials;
					if (session) {
						Faire.Tasks.activate({ user: session.id, id: taskid }, function(err, activatedTask) {
							if (err) throw err;
							reply(activatedTask);
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
		// Faire Users
		{
			method: 'GET', path: '/users/by-email/{email}', config: {
				handler: function(request, reply) {
					var emailToCheck = request.params.email;
					var session = request.auth.credentials;
					if (session) {
						Faire.Users.getByEmail({ email: emailToCheck }, function(err, user) {
							if (err) throw err;
							reply(user);
						})
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				validate: {
					params: {
						email: Faire.Joi.string().required()
					}
				},
				auth: 'session'
			}
		},
		//Version
		{
			method: 'GET', path: '/version', config: {
				handler: function(request, reply) {
					var session = request.auth.credentials;
					if (session) {
						var version = Faire.Package.version;

						reply({ version: version });
					} else {
						reply({error: 'Must be logged in.'});
					}
				},
				auth: 'session'
			}
		},
	  //Authentication Routes
	  { method: ['GET', 'POST'], path: '/confirm/{hashkey*}', config: { handler: Faire.Auth.confirm, auth: false  } },
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
	  { method: ['GET', 'POST'], path: '/logout', config: { handler: Faire.Auth.logout, auth: 'session' } }, 
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
      {
	      method: 'GET',
	      path: '/{path*}',
	      handler: {
	        directory: {
	          path: '.',
	          redirectToSlash: true,
	          index: true
	        }
	      }
	  }
	];
};
