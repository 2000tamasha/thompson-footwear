# 👟 Thompson Footwear – E-Commerce Platform

Welcome to the official repository for **Thompson Footwear**, a full-stack e-commerce website built for a local shoe retailer aiming to sell footwear for **Men**, **Women**, and **Kids**. This project is part of a university team assignment and currently represents **Sprint 1** of our Agile development process.

---

## ✅ Sprint 1 Deliverables (Completed)

### 🔧 Backend API (Node.js + Express + MySQL)

- ✅ Connected to MySQL using `mysql2`
- ✅ RESTful API endpoints:
  - `GET /api/products` – Fetch all products
  - `GET /api/products/:id` – Fetch single product by ID
  - `POST /api/orders` – Save order details after checkout
  - `POST /api/users/login` – User login
  - `POST /api/users/register` – User signup
  - `POST /api/contact` – Save contact form messages
- ✅ Stripe Checkout integration (with test keys)
- ✅ Webhook to handle `checkout.session.completed` events

### 🗃️ Database Schema (MySQL)

- **products**
- **users**
- **orders**
- **contact_messages**

💾 All data is persisted securely via SQL queries from backend API.

---

## 🖥️ Frontend (React.js)

Developed using **React.js**, `react-router-dom`, and **Stripe.js**:

- `HomePage.js` – Store banner, brand intro, and contact form
- `Home.js` – Product grid display
- `ProductDetail.js` – Individual product view with size/quantity
- `Cart.js` – Shopping cart with quantity updates
- `Login.js` & `Register.js` – User authentication forms
- `Success.js` – Stripe success page
- `AdminLayout.js` – Admin dashboard layout
- Admin Pages:
  - `AdminDashboard.js` – Admin home
  - `AdminOrders.js` – View all orders
  - `AdminUsers.js` – View registered users
  - `AdminMessages.js` – View submitted contact messages

### 💳 Checkout Flow

- Guest Checkout (3 steps: Delivery → Payment → Review)
- Logged-in User Checkout (3 steps with prefilled data)
- Payment Methods:
  - Stripe Card Payment
  - PayPal ID (simulated)
  - Afterpay (simulated)
- Orders stored in database
- Confirmation message and redirect to `/success`

---

## 📁 Folder Structure

📦 thompson-footwear
├── frontend
│ └── src
│ ├── pages
│ ├── components
│ └── App.js
├── backend
│ ├── routes
│ │ ├── productRoutes.js
│ │ ├── userRoutes.js
│ │ ├── orderRoutes.js
│ │ └── contactRoutes.js
│ └── server.js
├── .env (ignored in Git)
└── README.md


---

## 🚀 Deployment

> Currently in **local development** phase. Final deployment will be done using **Heroku** 

---

## 🛠️ Technologies Used

- **Frontend:** React, React Router, Stripe.js
- **Backend:** Node.js, Express
- **Database:** MySQL (using `mysql2`)
- **Authentication:** JWT (planned for future iteration)
- **Payment Gateway:** Stripe
- **Dev Tools:** Postman, ESLint, concurrently

---

## 📬 Contact & Feedback

> 💡 Want to contribute ideas or report bugs?
Please open an [Issue](https://github.com/yourusername/thompson-footwear/issues) or submit a Pull Request.

---

## 📅 What's Next (Sprint 2 Plans)

- [ ] Complete JWT-based authentication
- [ ] Enable product CRUD from Admin
- [ ] Upload product images via admin panel
- [ ] Enable mobile responsiveness
- [ ] Apply accessibility improvements
- [ ] Add automated email confirmation on order

---

## 👨‍💻 Team Members

| Name               | Role                   | Email                                  |
|--------------------|------------------------|----------------------------------------|
| Sharan Adhikari    | Backend & DB Developer(full stack) | s.adhikari.36@student.scu.edu.au       |
| Thamasha Hakmana   | Frontend & UI/UX       | t.hakmana.kodithuwakkuge.10@student.scu.edu.au |
| FM Zayan Ahamed    |QA testing | z.fasal.mohamed.10@student.scu.edu.au  |

---

> ⭐ Star this repo to support our journey!

