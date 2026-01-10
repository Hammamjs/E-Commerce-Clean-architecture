export class UpdateUserCommand {
  constructor(
    readonly id: string,
    readonly fullName?: string,
    readonly email?: string,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
  }
}
