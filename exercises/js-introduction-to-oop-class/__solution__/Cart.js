class Cart {
  items = [];

  addItem(item, count) {
    this.items.push({ item, count });
  }

  getItems() {
    return this.items;
  }

  getCost() {
    return this.items.reduce((acc, { item, count }) => acc + (item.price * count), 0);
  }

  getCount() {
    return this.items.length;
  }
}

export default Cart;
