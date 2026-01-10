export class InternalServerError extends Error {
  constructor(message: string = 'Internal server error occur') {
    super(message);
    this.message = message;
  }
}
