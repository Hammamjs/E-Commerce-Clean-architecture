export interface ITokenService {
  verifyToken(token: string): any;
  signToken(payload: any, expiresIn: string): string;
}
