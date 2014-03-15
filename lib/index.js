//var util = require('./util');

//exports.Util = util;

var Faire = {};
module.exports = Faire;

Faire.Hapi = require('hapi');
Faire.Joi = require('joi');

var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
Faire.Scurvy = Scurvy;


var mailer = require('./mail');
var preferences = require('./preferences');
var tasks = require('./tasks');


Faire.Mailer = mailer;
Faire.Preferences = preferences;
Faire.Tasks = tasks;


var auth = require('./auth');
Faire.Auth = auth;

var home = require('./home');
Faire.Home = home;

var routes = require('./routes');
Faire.Routes = routes;