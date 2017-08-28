/*
  Use this file as a template for configuring the 
  HTTP server aspect of the application.

  Rename this file to config.js and update
  the following configuration:
*/

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