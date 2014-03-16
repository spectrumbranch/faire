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

Faire.Mailer.init(mailConfig);


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

//Routes setup
server.route(Faire.Routes.get(Faire));

//setup/load modules/plugins here
var virt_modules = [];
virt_modules.push(Faire.Scurvy);

var db = require('./lib/models');
db.init(virt_modules, function() {
    console.log('database setup complete');
    
    //start server
    server.start();
    Faire.Auth.setURI(server.info.uri);
    console.log('Server up at ' + server.info.uri + ' !');
});
