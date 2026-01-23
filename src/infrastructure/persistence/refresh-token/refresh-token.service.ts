import { IRefreshTokenRepository } from "src/domain/repositories/refresh-token.interface";
import { SQL } from "./SQL";

export class RefreshToken implements IRefreshTokenRepository {
	constructor(private readonly _pool: any) {}
	async save(refreshToken: string, email: string): Promise<void> {
		await this._pool.query(SQL.insertRefreshToken, [refreshToken, email])
	}
}