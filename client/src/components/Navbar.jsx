import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  const goHome = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav ref={navRef} className="fixed top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="w-full px-4 py-4 flex justify-between items-center">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* Profile Icon */}
          <User
            size={22}
            className="cursor-pointer hover:text-amber-400 transition"
            onClick={() => navigate("/login")}
          />

          {/* Brand */}
          <h1
            onClick={goHome}
            className="text-2xl font-serif text-amber-400 cursor-pointer select-none"
          >
            LaCasa
          </h1>

        </div>

        {/* RIGHT SECTION - DESKTOP */}
        <div className="hidden md:flex items-center gap-8 text-white">

          <button onClick={goHome} className="hover:text-amber-400">
            Home
          </button>

          <button onClick={() => navigate("/menu")} className="hover:text-amber-400">
            Menu
          </button>

          <button
            onClick={() => {
              if (location.pathname !== "/") navigate("/");
              setTimeout(() => {
                document.getElementById("book-table")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="hover:text-amber-400"
          >
            Book Table
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="hover:text-amber-400 flex items-center gap-1"
          >
            <ShoppingCart size={18} />
            Cart {cartCount > 0 && `(${cartCount})`}
          </button>

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white hover:text-amber-400 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-4 py-4 flex flex-col gap-4 text-white">
            <button
              onClick={() => {
                goHome();
                setMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left"
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate("/menu");
                setMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left"
            >
              Menu
            </button>

            <button
              onClick={() => {
                if (location.pathname !== "/") navigate("/");
                setTimeout(() => {
                  document.getElementById("book-table")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
                setMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 text-left"
            >
              Book Table
            </button>

            <button
              onClick={() => {
                navigate("/cart");
                setMobileMenuOpen(false);
              }}
              className="hover:text-amber-400 flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
