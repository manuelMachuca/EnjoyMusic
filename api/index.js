'use strict'

var mongoose = require('mongoose');

//llamamos el modulo app (Fichero js)
var app = require('./app');
//Configuracion servidor de Node
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/enjoymusic', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("Conexion exitosa");
		
		app.listen(port, function(){
			console.log("Servidor API Rest Escuchando");
		});
	}

});
