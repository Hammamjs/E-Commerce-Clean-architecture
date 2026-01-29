import { SignUpUseCase } from "./sign-up.use-case";
import { SignInUseCase } from "./sign-in.use-case";

export class AuthFacade {
 constructor(public readonly signup: SignUpUseCase, public readonly signin: SignInUseCase) { }
}