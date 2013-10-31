var internals = {};


internals.sendPlainEmailFromServer = function(to, subject, body, callback) {
	if (internals.server_from) {
		internals.sendPlainEmail(internals.server_from, to, subject, body, function(err, result) {
			callback(err, result);
		});
	} else {
		callback(new Error('Mailer not initialized'), false);
	}
}
//sendmail method
internals.sendPlainEmail = function(from, to, subject, body, callback) {
	if (!internals.method) {
		callback('Mailer not initialized', false);
	} else {
		console.log('mailer.sendPlainEmail:from:: ' + from);
		console.log('mailer.sendPlainEmail:to:: ' + to);
		if (internals.method === 'Sendmail') {
			var nodemailer = require('nodemailer');
			var transport = nodemailer.createTransport(internals.method, internals.sendmail_bin);

			var message = {
				from: from,
				//TODO: make to a Comma separated list of recipients
				to: to,//'"Chris Bebry" <invalidsyntax@gmail.com>',
				subject: subject,
				// plaintext body
				text: body
			};
			transport.sendMail(message, function(error){
				var result = false;
				if (error){
					console.log('Error occured in mail.js:sendPlainEmail()');
					console.log(error.message);
					result = false;
				} else {
					console.log('Message sent successfully!');
					result = true;
				}
				
				callback(error, result);
			});
		} else {
			callback('Only sendmail is supported at the moment.', false);
		}
	}
}

//Only supports sendmail at the moment.
exports.init = function(config) {
	internals.config = config;
	if (internals.config.method === 'sendmail') {
		internals.method = 'Sendmail';
		internals.sendmail_bin = internals.config.sendmail.bin;
		internals.server_from = internals.config.sendmail.from;
	} else {
		internals.method = internals.config.method;
	}
}
exports.sendEmail = internals.sendPlainEmailFromServer;