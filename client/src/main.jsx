import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <App />
    </CartProvider>
  </React.StrictMode>
);
