'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');
var Artist = require('../model/artist'); 
var Album = require('../model/album'); 
var Song = require('../model/song'); 

function getArtist(req,res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion del artista'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});			}
		}
	});
}

function getArtists(req,res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		page =1;
	}
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page,itemsPerPage, function(err, artists, totalItems){
		if(err){
			res.status(500).send({message: 'Error en la peticion de los artistas'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No existen artistas'});
			}else{
				return res.status(200).send({
					pages: totalItems,
					artists: artists
				});	
			}
		}
	});
}

function saveArtist(req,res){
	var artist = new Artist();

	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image=params.image;

	artist.save((err,artistStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});

}

function updateArtist(req, res){
	var artistId = req.params.id;
	var artist = req.body;

	Artist.findByIdAndUpdate(artistId, artist, (err, artistUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el artista'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});

}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemove) =>{
		if(err){
			res.status(500).send({message: 'Error al borrar el artista'});
		}else{
			if(!artistRemove){
				res.status(404).send({message: 'No se ha podido borrar el artista'});
			}else{

				Album.find({artist: artistRemove.id}).remove((err,albumRemove) => {
					if(err){
					res.status(500).send({message: 'Error al borrar los albumes del artista'});
					}else{
						if(!albumRemove){
							res.status(404).send({message: 'No se ha podido borrar los albumes del artista'});
						}else{
							
							Album.find({artist: artistRemove.id}).remove((err, songRemove) => {
								if(err){
									res.status(500).send({message: 'Error al borrar las canciones del artista'});
								}else{
									if(!songRemove){
										res.status(404).send({message: 'No se ha podido borrar las canciones del artista'});
									}else{
										res.status(200).send({artist: artistRemove});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req,res){
	var artistId = req.params.id;
	var file_name = 'No subido ...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\')
		var file_name = file_split[2];
		console.log('Nombre: ' + file_name);
		var file_split_ext = file_path.split('\.')
		var file_ext = file_split_ext[1];
		console.log('file_ext: ' + file_ext);

		if(file_ext == 'png' || file_ext =='jpg' || file_ext == 'gif'){
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) =>{
				if(!artistUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistUpdated});
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
	var path_file = './uploads/artists/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});

}

module.exports = {
	getArtist,
	getArtists,
	saveArtist,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};