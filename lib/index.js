//var util = require('./util');

//exports.Util = util;
//exports.Home = home;

var Faire = {};
module.exports = Faire;

Faire.Hapi = require('hapi');
Faire.Joi = require('joi');

var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
Faire.Scurvy = Scurvy;


var mailer = require('./mail');
var tasks = require('./tasks');



Faire.Mailer = mailer;
Faire.Tasks = tasks;

var auth = require('./auth');
Faire.Auth = auth;

var home = require('./home');
Faire.Home = home;