//var util = require('./util');
//var home = require('./home');
//exports.Util = util;
//exports.Home = home;

var Faire = {};
var auth = require('./auth');
var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
var mailer = require('./mail');
var task = require('./task');

Faire.Auth = auth;
Faire.Scurvy = Scurvy;
Faire.Mailer = mailer;
Faire.Task = task;

module.exports = Faire;