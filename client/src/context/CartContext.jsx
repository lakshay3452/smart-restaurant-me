import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

// Safe ID matcher — avoids undefined === undefined
const matchId = (a, b) => {
  if (a._id != null && b._id != null) return a._id === b._id;
  if (a.id != null && b.id != null) return a.id === b.id;
  return false;
};

const matchIdValue = (item, id) => {
  if (id == null) return false;
  return item._id === id || item.id === id;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const exist = cartItems.find((item) => matchId(item, product));

    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          matchId(item, product)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    toast.success(`${product.name} added to cart 🛒`);
  };

  const removeFromCart = (id) => {
    const removedItem = cartItems.find((item) => matchIdValue(item, id));
    setCartItems(cartItems.filter((item) => !matchIdValue(item, id)));
    if (removedItem) {
      toast.error(`${removedItem.name} is removed`);
    } else {
      toast.error("Item removed");
    }
  };

  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        matchIdValue(item, id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          matchIdValue(item, id)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
