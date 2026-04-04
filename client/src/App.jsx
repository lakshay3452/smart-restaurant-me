import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import BottomNavbar from "./components/MobileBottomNav"
import CartDrawer from "./components/CartDrawer"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Payment from "./pages/Payment"
import OrderSuccess from "./pages/OrderSuccess"
import OrderHistory from "./pages/OrderHistory"
import Profile from "./pages/Profile"
import Tracking from "./pages/Tracking"
import BookTable from "./components/BookTable"

import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminMenu from "./admin/AdminMenu"

/* ── Scroll to top on every route change ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function AppLayout() {
  const location = useLocation()

  // Hide customer navbar/footer on admin pages
  const isAdminPage = location.pathname.startsWith("/admin")
  const isHomePage = location.pathname === "/"

  return (
    <>
      {/* Scroll to top on navigation */}
      <ScrollToTop />

      {/* Top Navbar - only on customer pages */}
      {!isAdminPage && <Navbar />}

      {/* Page Content — no top padding on homepage (hero goes behind navbar) */}
      <div className={isAdminPage ? "min-h-screen" : isHomePage ? "min-h-screen" : "pt-14 sm:pt-20 min-h-screen"}>
        <Routes>

          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/book-table" element={<BookTable />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-menu" element={
            <ProtectedRoute>
              <AdminMenu />
            </ProtectedRoute>
          } />

        </Routes>
      </div>

      {/* Footer & Mobile Nav - only on customer pages */}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <BottomNavbar />}

      {/* Cart Drawer - only on customer pages */}
      {!isAdminPage && <CartDrawer />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}
