import { Component, OnInit } from '@angular/core';
import { User } from './model/user';
import { UserService } from './services/user.services'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //Inyeccion de dependencias
  providers: [UserService]
})

//Buena practica implementar OnInit
export class AppComponent implements OnInit{
  public title = 'Enjoy Music';
  public user: User; //Propiedad objeto, este se debe importar
  public identity; //Propiedad para validar el login
  public token; 
  //Guardaremos en el Local Storage los valores del usuario logueado

  constructor(
  	private _userService: UserService //Declara propiedad de la clase (get and set)
  ){
  	this.user = new User('','','','','ROLE_USER',''); //Inicializar propiedades/atributos
  }

  //Ejecuta codigo al argar el componente
  ngOnInit(){
  	var mensaje = this._userService.signup();
  	console.log(mensaje);
  }

  public Prueba(){
  	console.log(this.user);

  }
}
