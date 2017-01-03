faire
=====

Text list management, useful for todo lists

[![Build Status](https://api.travis-ci.org/spectrumbranch/faire.png)](http://travis-ci.org/spectrumbranch/faire)
[![Dependency Status](https://david-dm.org/spectrumbranch/faire.svg)](https://david-dm.org/spectrumbranch/faire)

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

Make sure sendmail is installed if you wish to have email working.
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
  cookie_password: 'xfgkj23owe90nef0'
};

exports.mailconfig = {
  method: 'sendmail',
  sendmail: {
    bin: '/usr/sbin/sendmail',
	from: '"Faire Server" <no-reply@something.com>'
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

Run with ```node .``` and enjoy! It will be accessible via the given hostname and port in the config.js file.
