const Faire = require('./lib');

const Path = Faire.Path;
const Hapi = Faire.Hapi;
const Inert = Faire.Inert;
const CookieAuth = Faire.CookieAuth;
const Vision = Faire.Vision;



const options = { cors: true };

Faire.Config = require('./config/config');

const serverConfig = Faire.Config,
    tlsConfig = Faire.Config.tlsconfig;

if (serverConfig.tls) {
  console.log('Loading tls');
  const fs = require('fs');

  options.tls = {
   key: fs.readFileSync(tlsconfig.key),
   cert: fs.readFileSync(tlsconfig.cert)
  };
}

Faire.Email.init(Faire.Config.email);

const server = new Hapi.Server({
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
  const virt_modules = [];
  virt_modules.push(Faire.Scurvy);

  const db = require('./lib/models');
  db.init(virt_modules, function() {
    console.log('database setup complete');
  
    server.start(function(err) {
      if (err) {
        throw err;
      }
      let baseURI;
      if (Faire.Config.baseuri) {
        baseURI = Faire.Config.baseuri;
      } else {
        baseURI = server.info.uri;
      }

      Faire.Auth.setURI(baseURI);
      console.log('Server up at ' + server.info.uri + ' !');
    });
  });
});
