'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');
var Artist = require('../model/artist'); 
var Album = require('../model/album'); 
var Song = require('../model/song');


function getSong(req,res){
	var songId = req.params.id;

	//Nos trae los datos del album, popular, no solo me trae el id 
	Song.findById(songId).populate({path:'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion de la cancion'});
		}else{
			if(!song){
				res.status(404).send({message: 'El cancion no existe'});
			}else{
				res.status(200).send({song});			
			}
		}
	});
}

function getSongs(req, res){
	var albumId = req.params.id;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}
	
	find.populate({
		path:'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, songs)=>{
		if(err){
			res.status(500).send({message: 'Error en la peticion de las canciones'});
		}else{
			if(!songs || songs.length==0){
				res.status(404).send({message: 'No se encontraron canciones'});
			}else{
				res.status(200).send({songs});			
			}
		}
	});
}

function saveSong(req,res){
	var song = new Song();

	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album=params.album;

	song.save((err, songStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar la cancion'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'La cancion no ha sido guardado'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});
}


function updateSong(req, res){
	var songId = req.params.id;
	var song = req.body;
	
	Song.findByIdAndUpdate(songId, song, (err, songUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar la cancion'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha podido actualizar la cancion'});
			}else{
				res.status(200).send({album: songUpdated});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;

	//find().remove()
	Song.findByIdAndRemove(songId, (err, songRemove) =>{
		if(err){
			res.status(500).send({message: 'Error al borrar la cancion'});
		}else{
			if(!songRemove){
				res.status(404).send({message: 'No se ha podido borrar la cancion'});
			}else{
				res.status(200).send({album: songRemove});
			}
		}
	});
}

function uploadSongFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido ...';

	if(req.files){
		var file_path = req.files.file.path;
		console.log('NAMEEE: ' + file_path);
		var file_split = file_path.split('\\')
		var file_name = file_split[2];

		var file_split_ext = file_path.split('\.')
		var file_ext = file_split_ext[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){

			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) =>{
				if(!songUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la cancion'});
				}else{
					res.status(200).send({song: songUpdated});
				}
			});
		}else{
			res.status(200).send({message: 'Formato de archivo no permitido'});
		}
	}else{
		res.status(200).send({message: 'No ha subido imagen alguna'});
	}
}

function getSongFile(req,res){
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la cancion en los archivos'});
		}
	});

}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadSongFile,
	getSongFile
};
