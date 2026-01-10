export class NonPositiveError extends Error {
  constructor(
    readonly message: string = 'Non positive number or zero provided ',
  ) {
    super(message);
    this.message = message;
  }
}
