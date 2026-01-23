import { IBcryptService } from "src/domain/repositories/bcrypt.repository.interface";
import * as bcrypt from 'bcrypt';


export class BcryptService implements IBcryptService {
 async hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
 }
 async comparePassword(plaintext: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plaintext, hashedPassword);
 }
}