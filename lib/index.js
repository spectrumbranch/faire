//var util = require('./util');
//var home = require('./home');
//exports.Util = util;
//exports.Home = home;

var Faire = {};
module.exports = Faire;

var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
Faire.Scurvy = Scurvy;


var mailer = require('./mail');
var tasks = require('./tasks');



Faire.Mailer = mailer;
Faire.Tasks = tasks;

var auth = require('./auth');
Faire.Auth = auth;

