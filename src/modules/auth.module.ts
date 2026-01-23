import { AuthController } from "src/interfaces/http/auth.controller";
import { Module } from "@nestjs/common";
import { SignUpUseCase } from "src/application/use-cases/auth/sign-up.use-case";
import { AuthFacade } from "src/application/use-cases/auth/auth.facade";
import { IUserRepository } from "src/domain/repositories/user.repository.interface";
import { ITokenService } from "src/domain/repositories/jwt-token.repository.interface";
import { IBcryptService } from "src/domain/repositories/bcrypt.repository.interface";
import { IRefreshTokenRepository } from "src/domain/repositories/refresh-token.interface";
import { BCRYPT_SERVICE, REFRESH_TOKEN_REPO, TOKEN_SERVICE, USERS_REPO } from "src/domain/repositories/tokens.repositories";
import { DatabaseModule } from "./Database.module";
import { PgUserRepository } from "src/infrastructure/persistence/users/pg.user.repository";
import { TokenService } from "src/infrastructure/security/jwt-token/jwt-token.service";
import { RefreshToken } from "src/infrastructure/persistence/refresh-token/refresh-token.service";
import { Pool } from "pg";
import { HelperQuery } from "src/infrastructure/persistence/shared/helper-query";
import { BcryptService } from "src/infrastructure/security/bcrypt/bcrypt.service";
import { PG_CONNECTION } from "src/infrastructure/database/pg-connection";

@Module({
 controllers: [AuthController],
 providers: [
  { provide: USERS_REPO, useFactory: (pool: Pool, helperQuery: HelperQuery) => new PgUserRepository(pool, helperQuery), inject: [PG_CONNECTION, HelperQuery] },
  { provide: TOKEN_SERVICE, useClass: TokenService },
  { provide: BCRYPT_SERVICE, useClass: BcryptService },
  {
   provide: REFRESH_TOKEN_REPO,
   useFactory: (pool: Pool) => new RefreshToken(pool), inject: [PG_CONNECTION]
  },
  {
   provide: AuthFacade,
   useFactory: (userRepo: IUserRepository, tokenService: ITokenService, bcryptService: IBcryptService
    , refreshRepo: IRefreshTokenRepository) => new AuthFacade(new SignUpUseCase(userRepo, tokenService, bcryptService, refreshRepo)),
   inject: [USERS_REPO, TOKEN_SERVICE, BCRYPT_SERVICE, REFRESH_TOKEN_REPO]
  }
 ],
 imports: [DatabaseModule],
 exports: []
})

export class AuthModule { }