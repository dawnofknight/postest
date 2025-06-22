// Product model
export class Product {
  constructor(id, name, price, category, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.image = image;
  }

  static fromSupabase(data) {
    return new Product(
      data.id,
      data.name,
      data.price,
      data.category,
      data.image
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      image: this.image,
    };
  }
}
