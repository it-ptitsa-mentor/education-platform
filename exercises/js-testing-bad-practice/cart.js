// Корзина, которую нужно протестировать (уже реализована)
const makeCart = () => {
  const items = [];
  return {
    addItem(product, count) {
      items.push({ product, count });
    },
    getItems() {
      return items;
    },
    getCost() {
      return items.reduce((acc, { product, count }) => acc + (product.price * count), 0);
    },
    getCount() {
      return items.reduce((acc, { count }) => acc + count, 0);
    },
  };
};

export default makeCart;
