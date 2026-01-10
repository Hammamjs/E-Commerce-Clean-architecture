import { ItemStatus } from 'src/domain/enums/order-item-status.enum';

export class InvalidTransitionStatusError extends Error {
  constructor(currentStatus: ItemStatus, nextStatus: ItemStatus) {
    super(`Cannot change status from ${currentStatus} to ${nextStatus}`);
  }
}
