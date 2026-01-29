import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Role } from "src/domain/enums/roles.enum";



export class RolesGuard implements CanActivate {
 constructor(private readonly reflactor: Reflector) { }
 canActivate(context: ExecutionContext): boolean {
  const requireRoles = this.reflactor.getAllAndOverride<Role[]>(
   ROLES_KEY,
   [context.getHandler(), context.getClass()]
  )
  if (!requireRoles) return true;

  const { user } = context.switchToHttp().getRequest();
  return requireRoles.some(role => user.roles.includes(role))
 }
}