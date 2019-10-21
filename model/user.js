'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Permite crear un Objeto de tipo Schema (Documentos)

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	rol: String,
	image: String
});

//Objeto User instanciado con los valor del Schema
//Crea colecciones del objeto (Users)
module.exports = mongoose.model('User', UserSchema);