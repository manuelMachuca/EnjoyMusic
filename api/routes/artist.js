'use strict'

var express = require('express');
var api = express.Router();

var artistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' });

api.get('/artist/:id', md_auth.ensureAuth, artistController.getArtist);
api.post('/save-artist', md_auth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, artistController.getArtists);
api.post('/update-artists/:id', md_auth.ensureAuth, artistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, artistController.deleteArtist);
api.post('/updload-image-artist/:id', [md_auth.ensureAuth, md_upload], artistController.uploadImage);
api.post('/get-image-artist/:imageFile', artistController.getImageFile);

module.exports = api;
