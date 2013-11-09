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
    ttl: 1800000,
    clearInvalid: true
});

//server.views({
//    engines: {
//        html: 'handlebars'            
//    },
//    path: './lib/views',
//    partialsPath: './lib/views/partials'
//});

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
        passwrd0: S().required().min(8)
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
  
  //{ method: 'GET',         path: '/', config: { handler: home.handler, auth: { mode: 'try' } } },
  //{ method: '*',         path: '/version', handler: function() { this.reply(util.version); } },
  //Authentication Routes
  { method: '*',         path: '/confirm/{hashkey*}', config: { handler: auth.confirm, auth: false  } },
  { method: 'GET', path: '/register', config: { handler: auth.register_view, auth: { mode: 'try' }  } },
  { method: 'POST', path: '/register', config: { handler: auth.register, validate: { payload: register_validate() }, auth: { mode: 'try' }   } },
  { method: 'POST', path: '/login', config: { handler: auth.login, validate: { payload: login_validate() }, auth: { mode: 'try' }  } },
  { method: 'GET', path: '/login', config: { handler: auth.login_view, auth: { mode: 'try' }  } },
  { method: '*', path: '/logout', config: { handler: auth.logout, auth: true  } },
  
  //All static content
  { method: '*', path: '/{path*}', config: { handler: { directory: { path: './static/', listing: false, redirectToSlash: true } }, auth: true } }
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
