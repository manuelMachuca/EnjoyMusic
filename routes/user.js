'use strict'

var express = require('express');
var userController = require('../controllers/user');

//Para crear rutas
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-controlador', md_auth.ensureAuth, userController.pruebas);
api.post('/register-user', userController.saveUser);
api.post('/login-user', userController.loginUser);

module.exports = api;
