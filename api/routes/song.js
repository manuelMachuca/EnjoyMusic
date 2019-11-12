'use strict'

var express = require('express');
var api = express.Router();

var songController = require('../controllers/song');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/song/:id', md_auth.ensureAuth, songController.getSong);
api.get('/songs/:id?', md_auth.ensureAuth, songController.getSongs);
api.post('/save-song', md_auth.ensureAuth, songController.saveSong);
api.put('/update-song/:id', md_auth.ensureAuth, songController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, songController.deleteSong);
api.post('/updload-file-song/:id', [md_auth.ensureAuth, md_upload], songController.uploadSongFile);
api.get('/get-file-song/:songFile', songController.getSongFile);

module.exports = api;