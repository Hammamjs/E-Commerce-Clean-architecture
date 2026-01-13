export class InvalidInput extends Error {
  constructor(message: string = 'Invalid input') {
    super(message);
    this.message = message;
  }
}
