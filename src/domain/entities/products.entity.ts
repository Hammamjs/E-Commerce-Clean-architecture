export class Products {
  constructor(
    public name: string,
    public price: number,
    public inStock: number,
    public id?: string,
    public createdAt?: string,
  ) {
    if (!name) throw new Error('Product name is required');
    if (price < 0) throw new Error('Product price must be positive');
    if (inStock < 0) throw new Error('Product stock must be non-negative');
  }

  getInStock(): number {
    return this.inStock;
  }

  rename(newName: string): void {
    if (!newName) throw new Error('No name provided');
    this.name = newName;
  }

  setPrice(newPrice: number) {
    if (newPrice < 0) throw new Error('Price must be positive');
    this.price = newPrice;
  }

  setStock(quantity: number) {
    if (quantity < 0) throw new Error('Qauntity must be positive');
    this.inStock = quantity;
  }
}
