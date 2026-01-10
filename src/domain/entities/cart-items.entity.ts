export class CartItems {
  constructor(
    public id: string | null,
    public cartId: string,
    public productId: string,
    private unitPrice: number,
    private quantity: number,
    private total?: number,
    private createdAt?: string,
  ) {}

  getTotal() {
    return this.unitPrice * this.quantity;
  }

  increaseQuantity(amount: number) {
    if (amount <= 0) throw new Error('Invalid quantity');
    this.quantity += amount;
  }

  decreaseQuantity(amount: number) {
    if (amount <= 0) throw new Error('Invalid quantity');
    if (this.quantity - amount < 0)
      throw new Error('Quantity cannot be negative');
    this.quantity -= amount;
  }

  getUnitPrice() {
    return this.unitPrice;
  }

  getQuantity() {
    return this.quantity;
  }
}
