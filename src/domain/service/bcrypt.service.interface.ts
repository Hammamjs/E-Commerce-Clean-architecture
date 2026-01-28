export interface IBcryptRepository {
 hashPassword(password: string): Promise<string>;
 comparePassword(plaintext: string, hashedPassword: string): Promise<string>;
}
