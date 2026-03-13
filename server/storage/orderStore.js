let orders = [];

const addOrder = (order) => {
  orders.push(order);
};

const getOrders = () => {
  return orders;
};

module.exports = {
  addOrder,
  getOrders
};