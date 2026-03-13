import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import BottomNavbar from "./components/MobileBottomNav"

import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import BookTable from "./components/BookTable"

import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminMenu from "./admin/AdminMenu"

export default function App() {

  return (

    <Router>

      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="pt-20 min-h-screen">

        <Routes>

          {/* Customer Routes */}

          <Route path="/" element={<Home />} />

          <Route path="/menu" element={<Menu />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/login" element={<Login />} />

          <Route path="/book-table" element={<BookTable />} />


          {/* Admin Routes */}

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin-menu" element={<AdminMenu />} />

        </Routes>

      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navbar */}
      <BottomNavbar />

    </Router>

  )

}