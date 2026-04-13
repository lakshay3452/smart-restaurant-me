import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { FeaturesProvider } from "./context/FeaturesContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <FeaturesProvider>
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          <App />
        </FeaturesProvider>
      </CartProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
