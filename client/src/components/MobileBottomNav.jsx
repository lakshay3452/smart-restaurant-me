import { Home, Utensils, Clock, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-white/10 flex justify-around py-3 md:hidden z-50">

      <button onClick={goHome} className="flex flex-col items-center text-xs text-gray-300">
        <Home size={20} />
        Home
      </button>

      <button onClick={() => navigate("/menu")} className="flex flex-col items-center text-xs text-gray-300">
        <Utensils size={20} />
        Menu
      </button>

      <button onClick={() => navigate("/orders")} className="flex flex-col items-center text-xs text-gray-300">
        <Clock size={20} />
        Orders
      </button>

      <button onClick={() => navigate("/cart")} className="flex flex-col items-center text-xs text-gray-300">
        <ShoppingCart size={20} />
        Cart
      </button>

      <button onClick={() => navigate(localStorage.getItem("token") ? "/profile" : "/login")} className="flex flex-col items-center text-xs text-gray-300">
        <User size={20} />
        Profile
      </button>

    </div>
  );
}
