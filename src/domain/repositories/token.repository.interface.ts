export interface ITokenRepository {
  verify(): Promise<void>;
  sign(): Promise<void>;
}
