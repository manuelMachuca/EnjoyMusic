'use strict'

var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


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
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//Almacenar dato
				console.log("datos completos");
				user.save((err, userStored) =>{
					if(err){
						res.status(500).send({message:'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(400).send({message:'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user:userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: 'Introduce los campos requeridos'});
			}
		});
	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}
}

//Por POST
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) =>{
		if(err){
			res.status(500).send({message: 'Error en la péticion'});
		}else{
			console.log(user);
			if(user==null){
				res.status(404).send({message:'El usuario no existe'});
			}else{
				bcrypt.compare(password, user.password, function (err, check){
					if(check){
						//Devolver datos del usuario logeado
						if(params.gethash){
							//Devolver un token de jwt
							console.log("Tiene hash");
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message:'El usuario no ha podido loguearse, contraseña incorrecta'});
					}
				});
			}
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser
};