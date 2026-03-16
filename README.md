# 🍽️ Smart Restaurant — Full Stack Web Application

A modern full-stack restaurant management web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features a customer-facing website and a complete admin panel for restaurant management.

![React](https://img.shields.io/badge/React-19-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![Express](https://img.shields.io/badge/Express-4-lightgrey?logo=express) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)

---

## ✨ Features

### 🛒 Customer Side
- **Home Page** — Hero section, signature dishes, stats, testimonials
- **Menu Page** — Browse food items with category filtering
- **Cart System** — Add/remove items, quantity management, cart drawer
- **Checkout** — Order placement with delivery details
- **Order Tracking** — Real-time order status tracking
- **Order History** — View past orders
- **Table Booking** — Reserve tables with date & time selection
- **User Profile** — View/manage account details

### 🔐 Authentication (OTP-Based)
- **Email OTP Verification** — Users verify identity via 6-digit OTP sent to email using Nodemailer
- **JWT Token Auth** — Secure session management with JSON Web Tokens
- **Bcrypt Password Hashing** — Passwords stored securely
- **Role-based Access** — User / Admin / Blocked roles

### 🛠️ Admin Panel
- **Dashboard** — Stats cards, revenue charts (Recharts), recent orders overview
- **Order Management** — View all orders, update status (Pending → Accepted → Preparing → Ready → Delivered)
- **Menu Management** — Full CRUD for menu items with categories, pricing, images, availability toggle
- **Table Reservations** — View and manage customer table bookings (Approve/Decline)
- **User Management** — View registered users, block/unblock accounts, view user order history
- **Settings** — Restaurant info, tax configuration, operating hours
- **Sidebar Navigation** — Professional admin layout

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios |
| **Backend** | Node.js, Express, Mongoose, JWT, Bcrypt, Nodemailer |
| **Database** | MongoDB Atlas |
| **Email** | Nodemailer (Gmail SMTP) |
| **Payment** | Razorpay SDK (integrated) |

---

## 📁 Project Structure

```
smart-restaurant/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets (food images)
│   └── src/
│       ├── admin/              # Admin pages (Dashboard, Menu, Login)
│       ├── components/         # Reusable components (Navbar, Footer, CartDrawer, etc.)
│       ├── context/            # React Context (Cart, Theme, Toast)
│       ├── data/               # Static data
│       └── pages/              # Customer pages (Home, Menu, Cart, Login, Register, etc.)
│
├── server/                     # Express Backend
│   ├── config/                 # Database connection
│   ├── middleware/             # JWT Auth middleware
│   ├── models/                # Mongoose models (User, Order, Menu, Otp, Reservation, Settings)
│   ├── routes/                # API routes (auth, orders, menu, admin, reservations, settings)
│   ├── storage/               # In-memory storage helpers
│   └── utils/                 # Razorpay utility
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** 18+
- **npm** 9+
- **MongoDB Atlas** account (free tier works)
- **Gmail** account with App Password (for OTP emails)

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/lakshay3452/smart-restaurant.git
cd smart-restaurant
```

### 2. Install dependencies

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd ../server && npm install
```

### 3. Environment Variables

Create a `server/.env` file:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **How to get Gmail App Password:**
> Go to [Google Account](https://myaccount.google.com) → Security → 2-Step Verification → App Passwords → Create one for "Mail"

### 4. Run the application

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/send-otp` | Send OTP for registration |
| POST | `/api/auth/register/verify-otp` | Verify OTP & create account |
| POST | `/api/auth/login/send-otp` | Send OTP for login |
| POST | `/api/auth/login/verify-otp` | Verify OTP & login |
| GET | `/api/auth/me` | Get current user profile |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/json` | Get all orders (JSON) |
| GET | `/api/orders` | Get all orders (HTML view) |
| PUT | `/api/orders/:id` | Update order status |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| POST | `/api/menu` | Add menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |
| PATCH | `/api/menu/:id/toggle` | Toggle item availability |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations` | Get all reservations |
| PUT | `/api/reservations/:id` | Update status |
| DELETE | `/api/reservations/:id` | Delete reservation |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics & charts data |
| GET | `/api/admin/users` | Get all registered users |
| PUT | `/api/admin/users/:id/toggle-block` | Block/unblock user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/users/:id/orders` | Get user's order history |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get restaurant settings |
| PUT | `/api/settings` | Update restaurant settings |

---

## 🖥️ Frontend Routes

| Route | Page |
|-------|------|
| `/` | Home page |
| `/menu` | Menu with category filter |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form |
| `/login` | User login (with OTP) |
| `/register` | User signup (with OTP) |
| `/profile` | User profile |
| `/orders` | Order history |
| `/tracking` | Order tracking |
| `/book-table` | Table reservation |
| `/admin-login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin-menu` | Admin menu management |

---

## 📊 Data Flow

1. Customer browses `/menu` and adds items to cart (managed by `CartContext`)
2. Customer goes to `/checkout` and places order → `POST /api/orders`
3. Admin dashboard at `/admin` polls `GET /api/orders/json` every 3 seconds
4. Admin updates order status via `PUT /api/orders/:id`
5. Customer sees status updates on `/tracking` and `/orders` pages

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 rounds)
- JWT tokens for authenticated API access
- Email OTP verification for signup & login
- Role-based access control (user/admin/blocked)
- HTML output is XSS-safe (escaped)
- `.env` file excluded from version control

---

## 👥 Team

- **Lakshay** — Developer

---

## 📄 License

This project is for educational purposes (Semester 6 Project).
