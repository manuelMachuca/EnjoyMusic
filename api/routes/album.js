'use strict'

var express = require('express');
var api = express.Router();

var albumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' });

api.get('/album/:id', md_auth.ensureAuth, albumController.getAlbum);
api.get('/albums/:id?', md_auth.ensureAuth, albumController.getAlbums);
api.post('/save-album', md_auth.ensureAuth, albumController.saveAlbum);
api.put('/update-album/:id', md_auth.ensureAuth, albumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, albumController.deleteAlbum);
api.post('/updload-image-album/:id', [md_auth.ensureAuth, md_upload], albumController.uploadImage);
api.get('/get-image-album/:imageFile', albumController.getImageFile);

module.exports = api;
