import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from './model/user';
import { UserService } from './services/user.services';

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
  public user_register: User; 
  public identity; //Propiedad para validar el login
  public token; 
  public mensajeError;
  public mensajeSuccess;
  //Guardaremos en el Local Storage los valores del usuario logueado

  constructor(
  	private _userService: UserService,
    private _router: Router
     //Declara propiedad de la clase (get and set)
  ){
  	this.user = new User('','','','','ROLE_USER','');
  	this.user_register = new User('','','','','ROLE_USER','');//Inicializar propiedades/atributos
    console.log("Constructor");
  }

  //Ejecuta codigo al cargar el componente
  ngOnInit(){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
    console.log("ngOnInit");
  }

  logout(){
  	localStorage.removeItem('identity');
  	localStorage.removeItem('token');
    localStorage.clear();
    this.user = new User('','','','','ROLE_USER','');
    this.user_register = new User('','','','','ROLE_USER','');
  	this.identity = null;
  	this.token = null;
    this.mensajeError = null;
    this.mensajeSuccess = null;
    this._router.navigate(['/']);
  }

  public registerUser(){
  	console.log('register');
  	console.log(this.user_register);
  	this._userService.registerUser(this.user_register).subscribe(
  		response =>{
  			console.log(response.user);
  			let user = response.user;
  			this.user_register = user;

  			if(!user._id){
  				alert("Problemas con el usuario");
          this.mensajeError = 'Ocurrio un error al registrar el usuario';
  			}else{
  				//Creamos el localStorage para tener una session
  				console.log('Registrado correcto');
          this.mensajeSuccess = 'Se registro correctamente el usuario ' + this.user_register.email + '.';
  				this.user_register = new User('','','','','ROLE_USER','');
  			}
  			console.log(response);

  		},
  		error =>{
  			var errorMessage = <any> error;
        this.mensajeError = 'Ocurrio un error al registrar el usuario';
  			if(errorMessage != null){
  				console.log(error);
  			}
  		}
  	);
  }

  public onSubmit(){
  	//El problema es que el usuario se queda con su atributo gethash con datos
  	//Por tanto el api retorna token y no hay id
  	console.log(this.user);
  	this._userService.signup(this.user).subscribe(
  		response =>{
  			console.log(response.user);
  			let identity = response.user;
  			this.identity = identity;

  			if(!this.identity._id){
  				alert("Problemas con el usuario");
  			}else{
  				//Creamos el localStorage para tener una session
  				localStorage.setItem('identity', JSON.stringify(identity));

  				//Coneguir el token
  				console.log(this.user);
			  	this._userService.signup(this.user, 'true').subscribe(
			  		response =>{
			  			let token = response.token;
			  			this.token = token;

			  			if(this.token.length<=0){
			  				alert("Problemas con el usuario");
			  			}else{
			  				//Creamos el localStorage para tener el token disponible
			  				console.log(token);
			  				console.log(identity);
			  				localStorage.setItem('token', JSON.stringify(token));
			  			}
			  			console.log(response);

			  		},
			  		error =>{
			  			var errorMessage = <any> error;

			  			if(errorMessage != null){
			  				console.log(error);
			  			}
			  		}
			  	);

  			}
  			console.log(response);

  		},
  		error =>{
  			var errorMessage = <any> error;

  			if(errorMessage != null){
  				console.log(error);
  			}
  		}
  	);
  }
}
