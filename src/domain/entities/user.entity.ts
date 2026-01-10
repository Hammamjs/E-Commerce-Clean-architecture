export class User {
  constructor(
    public fullName: string,
    public email: string,
    public readonly id?: string,
    public readonly createdAt?: string,
  ) {}

  public changeName(newName: string) {
    if (!newName) throw new Error('Name not provided');
    this.fullName = newName;
  }

  public changeEmail(newEmail: string) {
    if (!newEmail || !newEmail.includes('@'))
      throw new Error('Email not provided or invalid');
    this.email = newEmail;
  }
}
