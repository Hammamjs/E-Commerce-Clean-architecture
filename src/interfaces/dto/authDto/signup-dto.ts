import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class SignupDto {
 @IsNotEmpty()
 name: string

 @IsEmail()
 email: string

 @IsNotEmpty()
 // @Length(8)
 password: string
}