import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { SignupDto } from "../dto/authDto/signup-dto";
import { AuthFacade } from "src/application/use-cases/auth/auth.facade";
import { SignupResponse } from "../dto/authDto/signup-response";
import { SigninDto } from "../dto/authDto/sign-in.dto";
import { SigninResponse } from "../dto/authDto/sign-in.response";


@Controller('auth')
export class AuthController {
 constructor(private readonly authFacade: AuthFacade) { }
 @Post('register')
 async signup(@Body() signupDto: SignupDto) {
  try {
   const { user, accessToken } = await this.authFacade.signup.execute(signupDto)
   return new SignupResponse(user, accessToken)
  } catch (error) {
   throw new ConflictException(error.message)
  }
 }

 @Post('sign-in')
 async signin(@Body() signinDto: SigninDto) {
  try {
   const { user, accessToken } = await this.authFacade.signin.execute(signinDto)
   return new SigninResponse(user, accessToken)
  } catch (error) {
   throw new ConflictException(error.message)
  }
 }

}