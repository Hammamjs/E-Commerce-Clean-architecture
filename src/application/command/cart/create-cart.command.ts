export class CreateCartCommand {
  constructor(public readonly userId: string) {
    this.userId = userId;
  }
}
