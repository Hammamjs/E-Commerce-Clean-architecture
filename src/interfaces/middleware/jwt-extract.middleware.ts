import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class JwtExtractionMiddleware implements NestMiddleware {
 use(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
   const token = authHeader.split(' ')[1];
   req['rawToken'] = token;
  }
  next();
 }
}