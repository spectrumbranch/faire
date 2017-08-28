faire
=====

Text list management, useful for todo lists

[![Build Status](https://api.travis-ci.org/spectrumbranch/faire.png)](http://travis-ci.org/spectrumbranch/faire)
[![Dependency Status](https://gemnasium.com/badges/github.com/spectrumbranch/faire.svg)](https://gemnasium.com/github.com/spectrumbranch/faire)


Installation
============
Clone the latest:
```
git clone git@github.com:spectrumbranch/faire.git
cd faire
```
Install the application's dependencies:
```
npm install .
```

Note: If you are a Windows user, you need to ensure that you have the dependencies for ```bcrypt``` (because faire uses it in the authentication module ```scurvy```) found here: https://github.com/ncb000gt/node.bcrypt.js/#dependencies

Setup configuration files:
```
cp ./config/database.example.js ./config/database.js
cp ./config/config.example.js ./config/config.js
```

Create `./config/client_id.json` using Google Gmail OAuth2 API credentials. At this time only Gmail is supported for email.  
Set up the database connection config in ```./config/database.js```. As of right now, mysql is the only officially supported database setup. Make sure the credentials are correct as to avoid crashing. The database needs to be created in advanced.
```
exports.config = {
  type: 'mysql',
  hostname: 'localhost',
  port: 3306,
  db: 'mydbname',
  user: 'dbuser',
  password: 'dbpass'
};
```
Set up the HTTP server, mail, and tls config in ```./config/config.js```. The following is customizable:
```
exports.config = {
  hostname: '0.0.0.0',
  port: 8000,
  tls: false,
  cookie_name: 'faire-cookie',
  cookie_password: 'CHANGEMExfgkj23owe90nef0xfgkj23owe90nef0xfgkj23owe90nef0xfgkj23owe90nef0xfgkj23owe90nef0_',
  email: {
    google_oauth_token_dir: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/',
    google_oauth_token_filename: 'gmail-nodejs-quickstart.json',
    from_email: 'no-reply@something.com',
    test_to_email: 'someones_email@something.com'
  }
};

//If exports.config.tls == true, then the following tlsconfig is required to be uncommented and filled out properly.
//Keep this commented out if exports.config.tls == false
//var fs = require('fs');
//exports.tlsconfig = {
//  key: fs.readFileSync('/somewhere/fixtures/keys/faire-key.pem'),
//  cert: fs.readFileSync('/somewhere/fixtures/keys/faire-cert.pem')
//}
```

You can use `node ./scripts/google-oauth2-setup.js` to setup the base OAuth2 token. Just ensure that your token has a refresh token (which is sent only the first time for a given authorization). If you do not get a refresh token, you may need to revoke the permissions from the Gmail account and set it up again.

Run with ```node .``` and enjoy! It will be accessible via the given hostname and port in the config.js file.
