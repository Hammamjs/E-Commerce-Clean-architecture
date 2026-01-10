export class ForbiddenError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.message = message;
  }
}
