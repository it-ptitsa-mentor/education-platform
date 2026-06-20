const cart = new Cart();
cart.addItem({ name: 'car', price: 3 }, 5);
cart.addItem({ name: 'house', price: 10 }, 2);
cart.getItems().length; // 2
cart.getCost(); // 35
cart.getItems();
// [
//   { item: { name: 'car', price: 3 }, count: 5 },
//   { item: { name: 'house', price: 10 }, count: 2 },
// ]