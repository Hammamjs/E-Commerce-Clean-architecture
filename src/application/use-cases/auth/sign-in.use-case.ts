import { SignInCommand } from "src/application/command/auth/sign-in.command";
import { IUseCase } from "../base.use-case";
import { SignInResult } from "src/application/command/auth/sign-in-result.command ";
import { IUserRepository } from "src/domain/repositories/user.repository.interface";
import { NotFoundError } from "src/application/errors/not-found.error";
import { IBcryptService } from "src/domain/service/bcrypt.service.interface";
import { ITokenService } from "src/domain/service/jwt-token.repository.interface";
import { IRefreshTokenRepository } from "src/domain/repositories/refresh-token.repository.interface";

export class SignInUseCase implements IUseCase<SignInCommand, SignInResult> {
 constructor(private readonly _userRepository: IUserRepository, private readonly _bcryptService: IBcryptService, private readonly _tokenService: ITokenService, private readonly _refreshTokenRepository: IRefreshTokenRepository) { }
 async execute(user: SignInCommand): Promise<SignInResult> {

  const userExists = await this._userRepository.findByEmail(user.email);
  if (!userExists) {
   throw new NotFoundError("User not found")
  }

  const hashedPassword = userExists.getPassword()?.toString()!;

  const isPasswordMatched = await this._bcryptService.comparePassword(user.password, hashedPassword);


  if (!isPasswordMatched) {
   throw new Error("Email or password is incorrect")
  }

  const accessToken = await this._tokenService.generateToken({ email: user.email, id: userExists.id }, '15min')

  const refreshToken = await this._tokenService.generateToken({ email: user.email, id: userExists.id }, '7d')

  await this._refreshTokenRepository.save(refreshToken, userExists.email);

  return {
   user: userExists,
   accessToken,
  }
 }
}
