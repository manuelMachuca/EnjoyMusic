import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class UserService{
	public identity; 
	public token; 
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	/*public signup(){
		return "Mensaje desde el servicio";
	}*/

	registerUser(user_to_register){
		
		console.log("");
		let json = JSON.stringify(user_to_register);
		let params = json;

		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'register-user', params, {headers: headers}).map(res=> res.json());		
	}

	updateUser(update_to_register){
		
		console.log("");
		let json = JSON.stringify(update_to_register);
		let params = json;

		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':this.getToken()
		});
		
		return this._http.put(this.url+'update-user/'+update_to_register._id, 
			params, {headers: headers}).map(res=> res.json());		
	}

	signup(user_to_login, gethash = null){
		if(gethash != null){
			user_to_login.gethash = gethash;
			console.log("tiene hash");
		}
		console.log("no tiene hash");
		let json = JSON.stringify(user_to_login);
		let params = json;

		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'login-user', params, {headers: headers}).map(res=> res.json());		
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));
		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

	getToken(){
		let token =JSON.parse(localStorage.getItem('token'));	
		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}
}	