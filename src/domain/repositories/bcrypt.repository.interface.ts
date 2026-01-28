export interface IBcryptRepository {
  hashPassword(password: string): Promise<string>;
  comaprePassword(plaintext: string, hashedPassword: string): Promise<string>;
}
