import { User } from "src/domain/entities/user.entity";

export class SigninResponse {
 constructor(public user: Partial<User>, public accessToken: string) {
  this.user = {
   fullName: user.fullName,
   email: user.email,
   id: user.id,
  }
  this.accessToken = accessToken
 }
}