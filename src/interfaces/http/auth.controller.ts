import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { SignupDto } from "../dto/authDto/signup-dto";
import { AuthFacade } from "src/application/use-cases/auth/auth.facade";


@Controller('auth')
export class AuthController {
 constructor(private readonly authFacade: AuthFacade) { }
 @Post('register')
 async signup(@Body() signupDto: SignupDto) {
  try {
   const { user, accessToken } = await this.authFacade.signup.execute(signupDto)
   if (user) throw new ConflictException("User already exists")
   return { user, accessToken }
  } catch (error) {
   throw new ConflictException(error.message)
  }
 }
}