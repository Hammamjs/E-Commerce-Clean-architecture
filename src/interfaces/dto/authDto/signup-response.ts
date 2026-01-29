import { User } from "src/domain/entities/user.entity"

export class SignupResponse {
 constructor(public user: Partial<User>, public accessToken: string) {
  this.user = {
   id: user.id,
   fullName: user.fullName,
   email: user.email,
  }
  this.accessToken = accessToken
 }
}