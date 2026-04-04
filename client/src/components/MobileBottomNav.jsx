import { Home, Utensils, Clock, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);
  const path = location.pathname;

  const goHome = () => {
    if (path === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const navItems = [
    { label: "Home", icon: Home, action: goHome, active: path === "/" },
    { label: "Menu", icon: Utensils, action: () => navigate("/menu"), active: path === "/menu" },
    { label: "Orders", icon: Clock, action: () => navigate("/orders"), active: path === "/orders" },
    { label: "Cart", icon: ShoppingCart, action: () => navigate("/cart"), active: path === "/cart", badge: cartCount },
    { label: "Profile", icon: User, action: () => navigate(localStorage.getItem("token") ? "/profile" : "/login"), active: path === "/profile" || path === "/login" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0b0b0b]/95 backdrop-blur-xl border-t border-white/[0.06] flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden z-50">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className={`relative flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors min-w-[48px] py-1 ${
            item.active ? "text-amber-400" : "text-white/40 active:text-white/60"
          }`}
        >
          <div className="relative">
            <item.icon size={20} strokeWidth={item.active ? 2.5 : 1.5} />
            {item.badge > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            )}
          </div>
          {item.label}
          {item.active && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-amber-400" />
          )}
        </button>
      ))}
    </div>
  );
}
