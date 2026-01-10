export class NotFoundError extends Error {
  constructor(message: string = 'No data found') {
    super(message);
    this.message = message;
  }
}
