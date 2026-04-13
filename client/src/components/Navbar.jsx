import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogIn, LogOut, Heart, Trophy } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const goHome = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setMobileMenuOpen(false);
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
    <nav ref={navRef} className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* Profile Icon */}
          <User
            size={22}
            className="cursor-pointer hover:text-amber-400 transition"
            onClick={() => navigate(localStorage.getItem("token") ? "/profile" : "/login")}
          />

          {/* Brand */}
          <div
            onClick={goHome}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="#f59e0b" strokeWidth="3" fill="#0f0f0f"/>
              <text x="50" y="62" textAnchor="middle" fill="#f59e0b" fontFamily="serif" fontWeight="bold" fontSize="42">L</text>
              <path d="M20 78 Q50 90 80 78" stroke="#f59e0b" strokeWidth="2" fill="none"/>
            </svg>
            <h1 className="text-2xl font-serif text-amber-400">
              LaCasa
            </h1>
          </div>

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

          {isLoggedIn && (
            <button onClick={() => navigate("/favourites")} className="hover:text-amber-400 flex items-center gap-1">
              <Heart size={18} />
            </button>
          )}

          {isLoggedIn && (
            <button onClick={() => navigate("/rewards")} className="hover:text-amber-400 flex items-center gap-1">
              <Trophy size={18} />
              Rewards
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="hover:text-amber-400 flex items-center gap-1"
              >
                <User size={18} />
                {user?.name?.split(" ")[0] || "Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="hover:text-amber-400 flex items-center gap-1"
              >
                <LogIn size={18} />
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-amber-500 text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                Sign Up
              </button>
            </div>
          )}

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

            {isLoggedIn && (
              <button
                onClick={() => { navigate("/favourites"); setMobileMenuOpen(false); }}
                className="hover:text-amber-400 flex items-center gap-2 text-left"
              >
                <Heart size={18} />
                Favourites
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => { navigate("/rewards"); setMobileMenuOpen(false); }}
                className="hover:text-amber-400 flex items-center gap-2 text-left"
              >
                <Trophy size={18} />
                Rewards
              </button>
            )}

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="hover:text-amber-400 flex items-center gap-2 text-left"
                >
                  <User size={18} />
                  {user?.name || "Profile"}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition w-fit"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="hover:text-amber-400 flex items-center gap-2 text-left"
                >
                  <LogIn size={18} />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setMobileMenuOpen(false);
                  }}
                  className="bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-semibold w-fit"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
