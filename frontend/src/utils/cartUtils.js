export const addDecimals = (num) => {
  // Ensure that num is a number
  num = typeof num === 'number' ? num : parseFloat(num);
  // Round num to two decimal places and return it
  return Math.round(num * 100) / 100;
};

export const updateCart = (state) => {
  if (state.cartItems.length === 0) {
    // If the cart is empty, set prices to 0
    state.itemsPrice = 0;
    state.shippingPrice = 0;
    state.totalPrice = 0;
  } else {
    // Calculate prices if the cart has items
    state.itemsPrice = addDecimals(
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    state.shippingPrice = addDecimals(state.itemsPrice > 300 ? 0 : 50);
    state.totalPrice = addDecimals(Number(state.itemsPrice) + Number(state.shippingPrice));
  }

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};