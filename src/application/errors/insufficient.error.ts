export class InsufficientQuantityError extends Error {
  constructor(message: string = 'Insufficient stock sorry!') {
    super(message);
    this.message = message;
  }
}
