export class SignUpCommand  {
 constructor(public readonly name: string, public readonly email: string, public readonly password: string) {
  this.name = name;
  this.email = email;
  this.password = password;
 }
}
