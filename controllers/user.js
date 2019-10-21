'use strict'

var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');

function pruebas(req, res) {
	res.status(200).send({
		message: 'Probando una accion del controller de user'
	});
}

function saveUser(req, res) {
	var user = new User();

	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	if(params.password){
		//Encriptar

	}else{
		res.tatus(500).send({message: "Introduce la contraseña"});
	}
}

module.exports = {
	pruebas
};