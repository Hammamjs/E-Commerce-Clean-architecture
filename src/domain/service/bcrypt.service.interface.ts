export interface IBcryptService {
 hashPassword(password: string): Promise<string>;
 comparePassword(plaintext: string, hashedPassword: string): Promise<boolean>;
}
