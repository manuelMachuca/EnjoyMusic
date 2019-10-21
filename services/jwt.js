'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave_secreta";

//El usuario lo guarda dentro de un token
exports.createToken = function(user){
	var payload = {
		sub: user.id,
		name: user.name,
		surname: user.surname,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};
	return jwt.encode(payload, secret);
};