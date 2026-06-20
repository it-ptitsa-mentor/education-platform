const cart = makeCart();
cart.addItem({ name: 'car', price: 3 }, 5);
cart.addItem({ name: 'house', price: 10 }, 2);
cart.getItems().length; // 2
cart.getCost(); // 35
cart.getCount(); // 7
cart.addItem({ name: 'house', price: 10 }, 1);
cart.getItems().length; // 3
cart.getCost(); // 45