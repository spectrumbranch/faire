var Faire = require('./lib');

var Path = Faire.Path;
var Hapi = Faire.Hapi;
var Inert = Faire.Inert;
var CookieAuth = Faire.CookieAuth;
var Vision = Faire.Vision;

var options = { cors: true };

var masterConfig = require('./config/config');

var serverConfig = masterConfig.config,
    tlsConfig = masterConfig.tlsconfig,
    mailConfig = masterConfig.mailconfig;


Faire.Mailer.init(mailConfig);
        
if (serverConfig.tls) {
    console.log('Loading tls');
    options.tls = tlsConfig;
}

var server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'static')
      }
    }
  }
});

server.connection({
  host: serverConfig.hostname,
  port: serverConfig.port
});


server.register([Inert, CookieAuth, Vision], (err) => {
      server.auth.strategy('session', 'cookie', {
          password: serverConfig.cookie_password,
          cookie: serverConfig.cookie_name,
          redirectTo: '/login',
          isSecure: serverConfig.tls,
          clearInvalid: true
      });

      server.route(Faire.Routes.get(Faire));


    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: Path.join(__dirname, '/lib/views'),
        path: '.',
        partialsPath: 'partials'
    });

    //setup/load modules/plugins here
    var virt_modules = [];
    virt_modules.push(Faire.Scurvy);

    var db = require('./lib/models');
    db.init(virt_modules, function() {
        console.log('database setup complete');
        
        server.start(function(err) {
            if (err) {
              throw err;
            }

            Faire.Auth.setURI(server.info.uri);
            console.log('Server up at ' + server.info.uri + ' !');
        });
    });

      
});
