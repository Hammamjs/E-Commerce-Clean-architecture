import { IBcryptService } from "src/domain/service/bcrypt.service.interface";
import * as bcrypt from 'bcrypt';


export class BcryptService implements IBcryptService {
 async hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
 }
 async comparePassword(plaintext: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hashedPassword);
 }
}