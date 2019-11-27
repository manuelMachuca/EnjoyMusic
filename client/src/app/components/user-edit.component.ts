import { Component, OnInit } from '@angular/core';
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

	constructor(
		private _userService: UserService
	){
		this.title = 'Actualizar mis datos';
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		console.log('user-edit.component.ts cargado');
	}
}