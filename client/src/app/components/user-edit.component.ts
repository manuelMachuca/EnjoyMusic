import { Component, OnInit } from '@angular/core';

import {GLOBAL} from '../services/global';
import { UserService } from '../services/user.services';
import { User } from '../model/user';

@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.html',
	providers: [UserService]
})

export class UserEditComponent implements OnInit{
	public title:string;
	public user:User;
	public identity;
	public token;
	public alertUpdate;
	public mensajeError;
	public url;

	constructor(
		private _userService: UserService,
	){
		this.title = 'Actualizar mis datos';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.user = this.identity;
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('user-edit.component.ts cargado');
	}

	onUserUpdate(){
		console.log(this.user);
		this._userService.updateUser(this.user).subscribe(
	  		response =>{
	  			console.log(response.user);
	  			let user = response.user;
	  			this.user = user;

	  			if(!user._id){
	  				alert("Problemas con el usuario");
	          		this.mensajeError = 'Ocurrio un error al actualizar el usuario';
	  			}else{
	  				if(!this.filesToUpload){
	  				}else{
	  					this.makeFileRequest(this.url+'updload-image-user/'+user._id,[],this.filesToUpload).then(
	  						(result: any) => {
	  							this.user.image =result.image;
	  						}
	  					);
	  				}
	  				
	  				localStorage.setItem('identity', JSON.stringify(this.user));
	  				document.getElementById('identity_name').innerHTML = this.user.name;
					console.log(this.user);
	  				console.log('Registrado correcto');
	          		this.alertUpdate = 'Se actualizo correctamente el usuario ' + this.user.email + '.';
	          	}
	  		},
	  		error =>{
	  			var errorMessage = <any> error;
	        	this.mensajeError = 'Ocurrio un error al actualizar el usuario';
	  			if(errorMessage != null){
	  				console.log(error);
	  			}
	  		}
  		);
	}

	public filesToUpload: Array<File>;

	fileChangueEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}

	makeFileRequest(url: string, params: Array<string>, files:Array<File>){
		var token = this.token;

		//Lanzar el codigo de la subida.
		return new Promise(function(resolve, reject){
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();
			for (var i = 0; i < files.length; i++) {
				formData.append('image', files[i], files[i].name);
			}
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			};

			xhr.open('POST',url,true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
			console.log('acabo');
		});
	
	}
}