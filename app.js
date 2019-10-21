'use strict'//Java Script nuevo

//
var express = require('express');
var bodyParse = require('body-parser');

var app = express();

//Cargar tutas
var user_routes = require('./routes/user');

//Para usar JSON
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

//ruta base
app.use('/api', user_routes);

//Para exportar el modulo (app)
module.exports = app;