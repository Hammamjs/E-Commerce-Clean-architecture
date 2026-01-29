import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { ITokenService } from "src/domain/service/jwt-token.repository.interface";

export class JwtGuard implements CanActivate {
 constructor(private readonly _tokenService: ITokenService) { }

 canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  const req = context.switchToHttp().getRequest();
  const rawToken = req['rawToken'];

  if (!rawToken) return false;

  const user = this._tokenService.verifyToken(rawToken);

  req['user'] = user;

  return true
 }

}