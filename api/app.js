'use strict'//Java Script nuevo

//
var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//Cargar tutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');
//var album_routes = require('./routes/album');
//var song_routes = require('./routes/song');

//Para usar JSON
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

//Configurar cabaceras para evitar problemas con el control de acceso
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Acces-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

//ruta base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

//Para exportar el modulo (app)
module.exports = app;