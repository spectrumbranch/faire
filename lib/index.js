var Faire = {};
module.exports = Faire;

Faire.Hapi = require('hapi');
Faire.Joi = require('joi');
Faire.Async = require('async');
Faire.Promise = require('bluebird');

var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
Faire.Scurvy = Scurvy;


var mailer = require('./mail');
var preferences = require('./preferences');
var lists = require('./lists')(Faire);
var tasks = require('./tasks')(Faire);



Faire.Mailer = mailer;
Faire.Preferences = preferences;
Faire.Lists = lists;
Faire.Tasks = tasks;



var auth = require('./auth');
Faire.Auth = auth;

var home = require('./home');
Faire.Home = home;

var routes = require('./routes');
Faire.Routes = routes;