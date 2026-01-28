export interface IRefreshTokenRepository {
  save(refreshToken: string, email: string): Promise<void>;
}