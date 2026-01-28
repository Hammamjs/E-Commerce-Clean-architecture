import { IUseCase } from "../base.use-case";
import { SignUpCommand } from "src/application/command/auth/sign-up.comand";
import { User } from "src/domain/entities/user.entity";
import { ITokenService } from "src/domain/repositories/jwt-token.repository.interface";
import { IBcryptService } from "src/domain/repositories/bcrypt.repository.interface";
import { IUserRepository } from "src/domain/repositories/user.repository.interface";
import { IRefreshTokenRepository } from "src/domain/repositories/refresh-token.interface";

export class SignUpUseCase implements IUseCase<SignUpCommand, { user: User, accessToken: string }> {
 constructor(
  private readonly _userRepository: IUserRepository,
  private readonly _tokenService: ITokenService,
  private readonly _bcryptRepository: IBcryptService,
  private readonly _refreshTokenRepository: IRefreshTokenRepository
 ) { }
 async execute(newUser: SignUpCommand): Promise<{ user: User, accessToken: string }> {
  const userExists = await this._userRepository.findByEmail(newUser.email);

  if (userExists) {
   throw new Error("User already exists");
  }

  const accessToken = this._tokenService.signToken({ email: newUser.email }, '15min')

  const refreshToken = this._tokenService.signToken({ email: newUser.email }, '7d')

  await this._refreshTokenRepository.save(refreshToken, newUser.email);

  const hashedPassword = await this._bcryptRepository.hashPassword(newUser.password);

  const user = new User(newUser.name, newUser.email, hashedPassword);
  await this._userRepository.create(user);

  return {
   user,
   accessToken,
  };
 }

}