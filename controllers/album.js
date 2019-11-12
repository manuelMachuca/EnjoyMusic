'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');
var Artist = require('../model/artist'); 
var Album = require('../model/album'); 
var Song = require('../model/song'); 

function getAlbum(req,res){
	var albumId = req.params.id;

	//Nos trae los datos de artist, popular, no solo me trae el id 
	Album.findById(albumId).populate({path:'artist'}).exec((err, album)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion del album'});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe'});
			}else{
				res.status(200).send({album});			}
		}
	});
}

function getAlbums(req, res){
	var artistId = req.params.id;

	if(!artistId){
		var find = Album.find({}).sort('title');
	}else{
		var find = Album.find({artist: artistId}).sort('year');
	}
	
	find.populate({path:'artist'}).exec((err, albums)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion de los albumes'});
		}else{
			if(!albums || albums.length==0){
				res.status(404).send({message: 'No se encontraron albumes'});
			}else{
				res.status(200).send({albums});			
			}
		}
	});
}

function saveAlbum(req,res){
	var album = new Album();

	var params = req.body;

	album.title = params.title;
	album.description = params.description;
	album.year=params.year;
	album.image='null';
	album.artist = params.artist;

	album.save((err, albumStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el album'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'El album no ha sido guardado'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});

}

function updateAlbum(req, res){
	var albumId = req.params.id;
	var album = req.body;
	
	Album.findByIdAndUpdate(albumId, album, (err, albumUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemove) =>{
		if(err){
			res.status(500).send({message: 'Error al borrar el album'});
		}else{
			if(!albumRemove){
				res.status(404).send({message: 'No se ha podido borrar el album'});
			}else{

				Song.find({album: albumRemove.id}).remove((err,songRemove) => {
					if(err){
						res.status(500).send({message: 'Error al borrar los albumes del artista'});
					}else{
						if(!songRemove){
							res.status(404).send({message: 'No se ha podido borrar las canciones del album'});
						}else{
							res.status(200).send({album: albumRemove});
						}
					}
				});
			}
		}
	});
}

module.exports = {
	getAlbum,
	getAlbums,
	saveAlbum,
	updateAlbum,
	deleteAlbum
};
