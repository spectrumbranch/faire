var Faire = {};
module.exports = Faire;

Faire.Hapi = require('hapi');
Faire.Joi = require('joi');
Faire.Async = require('async');
Faire.Promise = require('bluebird');
Faire.Path = require('path');
Faire.CookieAuth = require('hapi-auth-cookie');
Faire.Inert = require('inert');
Faire.Vision = require('vision');
Faire.Sequelize = require('sequelize');

var scurvy = require('scurvy');
var Scurvy = scurvy.createInstance({ authSchema: 'email' });
Faire.Scurvy = Scurvy;

const email = require('./email');
var preferences = require('./preferences');
var lists = require('./lists')(Faire);
var tasks = require('./tasks')(Faire);
var users = require('./users')(Faire);

Faire.Email = email;
Faire.Preferences = preferences;
Faire.Lists = lists;
Faire.Tasks = tasks;
Faire.Users = users;

var auth = require('./auth');
Faire.Auth = auth;

var home = require('./home');
Faire.Home = home;

var routes = require('./routes');
Faire.Routes = routes;

var package = require('../package');
Faire.Package = package;