/*
  Use this file as a template for configuring the 
  HTTP server aspect of the application.

  Rename this file to config.js and update
  the following configuration:
*/

module.exports = {
  baseuri: 'https://faire.something.com',
  hostname: '0.0.0.0',
  port: 8000,
  tls: false,
  cookie_name: 'faire-cookie',
  cookie_password: 'CHANGEMExfgkj23owe90nef0xfgkj23owe90nef0xfgkj23owe90nef0xfgkj23owe90nef0xfgkj23owe90nef0_$UVijt3IHv4V#NJV#JLMKSVNKRV@KOR@O@R#Fesfsgsgfgsse22_',
  email: {
    google_oauth_token_dir: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/',
    google_oauth_token_filename: 'gmail-nodejs-quickstart.json',
    from_email: 'no-reply@something.com',
    test_to_email: 'someones_email@something.com'
  },
  tlsconfig: {
   key: '/somewhere/fixtures/keys/faire-key.pem',
   cert: '/somewhere/fixtures/keys/faire-cert.pem'
  }
};
