export class CreateUserCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
  ) {
    this.email = email;
    this.fullName = fullName;
  }
}
