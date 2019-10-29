'use strict'

var express = require('express');
var userController = require('../controllers/user');

//Para crear rutas
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/probando-controlador', md_auth.ensureAuth, userController.pruebas);
api.post('/register-user', userController.saveUser);
api.post('/login-user', userController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/updload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.post('/get-image-user/:imageFile', userController.getImageFile)


module.exports = api;
