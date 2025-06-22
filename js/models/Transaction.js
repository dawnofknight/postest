// Transaction model
export class Transaction {
  constructor(
    id,
    items,
    subtotal,
    tax,
    total,
    paymentMethod,
    timestamp = new Date()
  ) {
    this.id = id;
    this.items = items;
    this.subtotal = subtotal;
    this.tax = tax;
    this.total = total;
    this.paymentMethod = paymentMethod;
    this.timestamp = timestamp;
  }

  static fromCart(cart, paymentMethod) {
    const subtotal = cart.getSubtotal();
    const tax = cart.getTax();
    const total = cart.getTotal();

    return new Transaction(
      null, // ID will be assigned by Supabase
      cart.items,
      subtotal,
      tax,
      total,
      paymentMethod
    );
  }

  toJSON() {
    return {
      id: this.id,
      items: this.items.map((item) => item.toJSON()),
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      payment_method: this.paymentMethod,
      timestamp: this.timestamp,
    };
  }
}
