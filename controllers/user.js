'use strict'

var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

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
			console.log('front: ' + password);

	User.findOne({email: email.toLowerCase()}, (err, user) =>{
		if(err){
			res.status(500).send({message: 'Error en la péticion'});
		}else{
			if(!user){
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

function updateUser(req, res){
	var userId = req.params.id;
	var user = req.body;
	
	User.findByIdAndUpdate(userId, user, (err, userUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});

}

function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'No subido ...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\')
		var file_name = file_split[2];

		var file_split_ext = file_path.split('\.')
		var file_ext = file_split_ext[1];

		if(file_ext == 'png' || file_ext =='jpg' || file_ext == 'gif'){
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({user: userUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'Formato de archivo no permitido'});
		}
	}else{
		res.status(200).send({message: 'No ha subido imagen alguna'});
	}
}

function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});

}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};