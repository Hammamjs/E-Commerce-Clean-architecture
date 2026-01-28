export interface ITokenService {
 verifyToken(token: string): any;
 generateToken(payload: any, expiresIn: string): Promise<string>;
}
