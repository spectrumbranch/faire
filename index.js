var Faire = require('./lib');

var Hapi = Faire.Hapi,
    options = { cors: true };
var masterConfig = require('./config/config');

var serverConfig = masterConfig.config,
    tlsConfig = masterConfig.tlsconfig,
    mailConfig = masterConfig.mailconfig;
        
if (serverConfig.tls) {
    console.log('Loading tls');
    options.tls = tlsConfig;
}

var server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);


//var util = Faire.Util;
var auth = Faire.Auth;
var mailer = Faire.Mailer;
mailer.init(mailConfig);


server.auth('session', {
    scheme: 'cookie',
    password: serverConfig.cookie_password,
    cookie: serverConfig.cookie_name,
    redirectTo: '/login',
    isSecure: serverConfig.tls,
//    ttl: 1800000,
    clearInvalid: true
});

server.views({
    engines: {
        html: 'handlebars'            
    },
    path: './lib/views',
    partialsPath: './lib/views/partials'
});

login_validate = function() {
    var S = Hapi.types.String;
    return {
		email: S().email().required().max(50),
        passwrd: S().required().min(8),
        view: S()
    }
}

register_validate = function() {
    var S = Hapi.types.String;
    return {
		email: S().email().required().max(50),
        passwrd: S().required().min(8),
        passwrd0: S().required().min(8),
		view: S()
    }
}


server.route([
	//Faire Routes
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
				name: Hapi.types.String().required()
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
			validate: { path: { id: Hapi.types.Number().integer().required() } },
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
				path: { id: Hapi.types.Number().integer().required() },
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
				path: { id: Hapi.types.Number().integer().required() }
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
				path: { id: Hapi.types.Number().integer().required() }
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
				path: { id: Hapi.types.Number().integer().required() }
			},
			
			auth: { mode: "required" }
		}
	},
  //Authentication Routes
  { method: '*', path: '/confirm/{hashkey*}', config: { handler: auth.confirm, auth: false  } },
  { method: 'POST', path: '/register', config: { handler: auth.register, validate: { payload: register_validate() }, auth: { mode: 'try' }   } },
  { method: 'POST', path: '/login', config: { handler: auth.login, validate: { payload: login_validate() }, auth: { mode: 'try' }  } },
  { method: '*', path: '/logout', config: { handler: auth.logout, auth: true  } }, 
  //Views
  { method: 'GET', path: '/', config: { handler: Faire.Home.home_view, auth: true  } },
  { method: 'GET', path: '/login', config: { handler: auth.login_view, auth: { mode: 'try' }  } },
  { method: 'GET', path: '/register', config: { handler: auth.register_view, auth: { mode: 'try' }  } },
  //All static content
  { method: '*', path: '/{path*}', config: { handler: { directory: { path: './static/', listing: false, redirectToSlash: true } }, auth: { mode: 'try' } } }
]);

//setup/load modules/plugins here
var virt_modules = [];
virt_modules.push(Faire.Scurvy);

var db = require('./lib/models');
db.init(virt_modules, function() {
    console.log('database setup complete');
    
    //start server
    server.start();
    auth.setURI(server.info.uri);
    console.log('Server up at ' + server.info.uri + ' !');
});
