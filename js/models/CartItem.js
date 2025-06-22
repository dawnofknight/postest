// CartItem model
export class CartItem {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
    this.quantity = 1;
  }

  getTotal() {
    return this.price * this.quantity;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      image: this.image,
      quantity: this.quantity,
    };
  }
}
