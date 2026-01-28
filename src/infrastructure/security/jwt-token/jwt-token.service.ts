import { ITokenService } from "src/domain/service/jwt-token.repository.interface"
import * as jwt from 'jsonwebtoken'


export class TokenService implements ITokenService {
 verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET!)
 }

 signToken(payload: any, expiresIn: string): string {
  const options = {
   expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
   algorithm: 'HS256' as jwt.SignOptions['algorithm']
  }
  return jwt.sign(payload, process.env.JWT_SECRET!, options)
 }

}