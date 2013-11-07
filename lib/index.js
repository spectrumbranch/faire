//var util = require('./util');
//var home = require('./home');
//exports.Util = util;
//exports.Home = home;

var Faire = {};
var auth = require('./auth');
var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
var mailer = require('./mail');
var tasks = require('./tasks');

Faire.Auth = auth;
Faire.Scurvy = Scurvy;
Faire.Mailer = mailer;
Faire.Tasks = tasks;

module.exports = Faire;