import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect, lazy, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import BottomNavbar from "./components/MobileBottomNav"
import CartDrawer from "./components/CartDrawer"
import ProtectedRoute from "./components/ProtectedRoute"
import FlashDealBanner from "./components/FlashDealBanner"
import PageLoader from "./components/PageLoader"

// ── Lazy-loaded pages (code splitting) ──
const Home = lazy(() => import("./pages/Home"))
const Menu = lazy(() => import("./pages/Menu"))
const Cart = lazy(() => import("./pages/Cart"))
const Checkout = lazy(() => import("./pages/Checkout"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Payment = lazy(() => import("./pages/Payment"))
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"))
const OrderHistory = lazy(() => import("./pages/OrderHistory"))
const Profile = lazy(() => import("./pages/Profile"))
const Tracking = lazy(() => import("./pages/Tracking"))
const BookTable = lazy(() => import("./components/BookTable"))
const Favourites = lazy(() => import("./pages/Favourites"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"))

const AdminLogin = lazy(() => import("./admin/AdminLogin"))
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"))
const AdminMenu = lazy(() => import("./admin/AdminMenu"))
const AdminCoupons = lazy(() => import("./admin/AdminCoupons"))
const AdminFlashDeals = lazy(() => import("./admin/AdminFlashDeals"))
const AdminAnalytics = lazy(() => import("./admin/AdminAnalytics"))
const AdminChat = lazy(() => import("./admin/AdminChat"))
const AdminTables = lazy(() => import("./admin/AdminTables"))

/* ── Page transition variants ── */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}
const pageTransition = { duration: 0.25, ease: "easeInOut" }

function PageWrap({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

/* ── Scroll to top on every route change ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])
  return null
}

/* ── Animated Routes ── */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Customer Routes */}
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/menu" element={<PageWrap><Menu /></PageWrap>} />
          <Route path="/cart" element={<PageWrap><Cart /></PageWrap>} />
          <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />
          <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
          <Route path="/register" element={<PageWrap><Register /></PageWrap>} />
          <Route path="/forgot-password" element={<PageWrap><ForgotPassword /></PageWrap>} />
          <Route path="/payment" element={<PageWrap><Payment /></PageWrap>} />
          <Route path="/success" element={<PageWrap><OrderSuccess /></PageWrap>} />
          <Route path="/orders" element={<PageWrap><OrderHistory /></PageWrap>} />
          <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} />
          <Route path="/tracking" element={<PageWrap><Tracking /></PageWrap>} />
          <Route path="/book-table" element={<PageWrap><BookTable /></PageWrap>} />
          <Route path="/favourites" element={<PageWrap><Favourites /></PageWrap>} />
          <Route path="/rewards" element={<PageWrap><FeaturesPage /></PageWrap>} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<PageWrap><AdminLogin /></PageWrap>} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <PageWrap><AdminDashboard /></PageWrap>
          </ProtectedRoute>
        } />
        <Route path="/admin-menu" element={
          <ProtectedRoute>
            <PageWrap><AdminMenu /></PageWrap>
          </ProtectedRoute>
        } />
        <Route path="/admin-coupons" element={
          <ProtectedRoute>
            <PageWrap><AdminCoupons /></PageWrap>
          </ProtectedRoute>
        } />
        <Route path="/admin-flash-deals" element={
          <ProtectedRoute>
            <PageWrap><AdminFlashDeals /></PageWrap>
          </ProtectedRoute>
        } />
        <Route path="/admin-analytics" element={
          <ProtectedRoute>
            <PageWrap><AdminAnalytics /></PageWrap>
          </ProtectedRoute>
        } />
        <Route path="/admin-chat" element={
          <ProtectedRoute>
            <PageWrap><AdminChat /></PageWrap>
          </ProtectedRoute>
        } />
        <Route path="/admin-tables" element={
          <ProtectedRoute>
            <PageWrap><AdminTables /></PageWrap>
          </ProtectedRoute>
        } />
      </Routes>
      </AnimatePresence>
    </Suspense>
  )
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

      {/* Flash Deal Banner - only on customer pages */}
      {!isAdminPage && <FlashDealBanner />}

      {/* Top Navbar - only on customer pages */}
      {!isAdminPage && <Navbar />}

      {/* Page Content — no top padding on homepage (hero goes behind navbar) */}
      <div className={isAdminPage ? "min-h-screen" : isHomePage ? "min-h-screen" : "pt-14 sm:pt-20 min-h-screen"}>
        <AnimatedRoutes />
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
