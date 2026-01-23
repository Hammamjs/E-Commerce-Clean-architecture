import { SignUpUseCase } from "./sign-up.use-case";

export class AuthFacade {
 constructor(public readonly signup: SignUpUseCase) { }
}