const internals = {};

const fs = require('fs');
const google = require('googleapis');
const OAuth2Client = google.auth.OAuth2;


internals.init = function(config) {
	internals.config = config;

	const clientConfig = require('../../config/client_id.json');
	const CLIENT_ID = clientConfig.web.client_id;
	const CLIENT_SECRET = clientConfig.web.client_secret;
	const REDIRECT_URL = clientConfig.web.redirect_uris[0];

	internals.oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
}

internals.getTokenPath = function() {
	return internals.getTokenDir() + internals.config.google_oauth_token_filename;
}

internals.getTokenDir = function() {
	return internals.config.google_oauth_token_dir;
}

internals.getOAuth2Client = function() {
	return internals.oauth2Client;
}

internals.checkAuthentication = function(cb) {
	// Check if we have previously stored a token.
	return fs.readFile(internals.getTokenPath(), function(err, token) {
	  if (err) {
	    return cb(err);
	  } else {
	    let existingToken = JSON.parse(token);
	    internals.getOAuth2Client().credentials = existingToken;
	    console.log('already authenticated!', internals.getOAuth2Client().credentials);

	    return cb(null, internals.getOAuth2Client());
	  }
	});
}



internals.makeBody = function(to, from, subject, message) {
    const str = ['Content-Type: text/plain; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        'to: ', to, '\n',
        'from: ', from, '\n',
        'subject: ', subject, '\n\n',
        message
    ].join('');

    const encodedMail = new Buffer(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

internals.sendMessage = function(properties, cb) {
	return internals.checkAuthentication(function(err, auth) {
	  if (err) {
	    return console.log('err', err);
	  } else {
	  	const raw = internals.makeBody(properties.to, internals.config.from_email, properties.subject, properties.body);
	    const gmail = google.gmail('v1');
	    return gmail.users.messages.send({
	        auth: auth,
	        userId: 'me',
	        resource: {
	            raw: raw
	        }
	    }, cb);
	  }
	});
}

module.exports = {
	init: internals.init,
	getTokenPath: internals.getTokenPath,
	getTokenDir: internals.getTokenDir,
	getOAuth2Client: internals.getOAuth2Client,
	sendMessage: internals.sendMessage
}