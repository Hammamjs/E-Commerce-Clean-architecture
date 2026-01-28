import { ITokenService } from "src/domain/service/jwt-token.repository.interface"
import * as jwt from 'jsonwebtoken'


export class TokenService implements ITokenService {
 async verifyToken(token: string): Promise<any> {
  return jwt.verify(token, process.env.JWT_SECRET!)
 }

 async generateToken(payload: any, expiresIn: string): Promise<string> {
  const options = {
   expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
   algorithm: 'HS256' as jwt.SignOptions['algorithm']
  }
  return jwt.sign(payload, process.env.JWT_SECRET!, options)
 }

}