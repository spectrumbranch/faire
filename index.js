var Hapi = require('hapi'),
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

var Faire = require('./lib');
//var util = Faire.Util;
var auth = Faire.Auth;
var mailer = Faire.Mailer;
mailer.init(mailConfig);
var scurvy = Faire.Scurvy;


server.auth('session', {
    scheme: 'cookie',
    password: serverConfig.cookie_password,
    cookie: serverConfig.cookie_name,
    redirectTo: '/',
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
  { method: '*',         path: '/{path*}', handler: { directory: { path: './static/', listing: false, redirectToSlash: true } } }
]);

//setup/load modules/plugins here
var virt_modules = [];
virt_modules.push(scurvy);

var db = require('./lib/models');
db.init(virt_modules, function() {
    console.log('database setup complete');
    
    //start server
    server.start();
    auth.setURI(server.info.uri);
    console.log('Server up at ' + server.info.uri + ' !');
});
