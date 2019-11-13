export class User{
	constructor(
		public _id: string, //get and set
		public name: string,
		public email:string,
		public password: string,
		public role: string,
		public surname: string
	){}
}