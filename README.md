# 👟 Thompson Footwear – E-Commerce Platform (Sprint 1)

Welcome to the official repository for **Thompson Footwear**, a modern full-stack e-commerce application designed to sell shoes for Men, Women, and Kids.

This repository is for **Sprint 1**, which focuses on setting up the core backend, frontend structure, database connection, Stripe payment, and basic admin functionality.

---

## ✅ Features Completed in Sprint 1

### 🔧 Backend API (Node.js + Express)
- Connected to MySQL database using `mysql2`
- Created routes:
  - `/products` – fetch all products
  - `/orders` – save orders from checkout
  - `/users` – login and signup functionality
  - `/contact` – save user contact messages
- Stripe Checkout integration
- Stripe Webhook to handle `checkout.session.completed` events

### 🗃️ Database Setup (MySQL)
- Tables created:
  - `products`
  - `users`
  - `orders`
  - `contact_messages`
- Orders and messages are saved via form or checkout

### 🖥️ Frontend (React.js)
- React pages for:
  - `HomePage.js` – landing page + contact form
  - `Home.js` – product listing
  - `ProductDetail.js` – detailed product view
  - `Cart.js` – shopping cart and checkout flow
  - `Login.js` / `Register.js` – user auth flow
  - `Success.js` – payment confirmation
  - `Admin.js` – admin dashboard (orders/messages)
- Guest Checkout with full Stripe payment integration
- Contact form that sends data to backend and stores in DB

---

## 📁 Folder Structure

/frontend /src /pages /components App.js ... /backend /routes productRoutes.js userRoutes.js orderRoutes.js contactRoutes.js server.js .env (ignored in Git)

